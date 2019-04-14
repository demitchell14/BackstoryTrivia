import {Request} from "express";
import {Readable} from "stream";
import * as csv from "csv-parser";
import {UploadedFile} from "express-fileupload";
import {AuthorizedToken, isAuthorized} from "./Authorization";
import * as mongo from "mongodb";
import {Collection, MongoClient, ObjectID} from "mongodb";

const convert = (val:string, type:string) => {
    if (type === "number") {
        if (val === "")
            return 0;
        try {
            let x = Number.parseInt(val);
            if (Number.isInteger(x))
                return x;
            return 0
        } catch (err) { return 0; }
    }
    return undefined;
}

const __db = async ():Promise<MongoClient> => {
    const {MONGO_URL2, MONGO_PASS2, MONGO_USER2, MONGO_DB2} = process.env
    const connstr = `mongodb+srv://${MONGO_USER2}:${MONGO_PASS2}@${MONGO_URL2}/${MONGO_DB2}`;
    return await mongo.MongoClient.connect(connstr, {
        useNewUrlParser: true,
    });
}

const insertCollection = async (db:Collection<any>, records:Question[], list?: string) => {
    // const x = await db.insertMany(records);
    return {
        error: "Testing - Did not insert records.",
        insertedCount: records.length,
        insertedIds: [],
        list
    }
    // return x;
}

export async function exec(req:Request, res, next) {
    let file;
    let listName = "";

    if (req.files)
        file = req.files.csv as UploadedFile;

    const db = await __db();
    const userDB = db.db().collection("moderators");
    const questionDB = db.db().collection("questions");
    const user = await isAuthorized(req) as AuthorizedToken;
    if (!user) {
        res.status(403).send("Unauthorized Access");
        return;
    }
    const currentUser = await userDB.findOne({_id: ObjectID.createFromHexString(user._id)})
    if (!currentUser) {
        res.status(403).send("Unauthorized Access");
        return;
    }

    // console.log(req);
    if (req.body instanceof Buffer) {
        let tmp = req.body.toString("UTF-8");
        if (tmp.indexOf("listName") >= 0) {
            let t = tmp.substr(tmp.indexOf("listName") + 9);
            t = t.substr(0, t.indexOf("------"));
            listName = t.trim();
        }

        tmp = tmp.substr(tmp.indexOf("# DO NOT DELETE"));
        file = {data: tmp};

        // console.log(file)
        console.log({listName})
    }

    let timeout;

    const complete = (results:Row[]) => {
        // console.log(results[0].);
        const collection = [];

        try {
            results.map(row => {
                const question = {} as Question;
                if (!row.question) {
                    return;
                }
                question._creator = ObjectID.createFromHexString(user._id);
                question.question = row.question;
                question.points = convert(row.points, "number");
                question.timeLimit = convert(row.timeLimit, "number");
                question.type = row.type;
                // question.questionDetails = row.details
                // question.questionImage = row.image
                question.category = row.category.split(/,\\s*/);

                if (question.type === "Open Ended") {
                    question.answer = row.choice1;
                }
                if (question.type === "Multiple Choice") {
                    question.choices = [];
                    const choiceKeys = Object.keys(row).filter(k => k.toLowerCase().match(/choice/));
                    // choiceKeys.unshift();
                    choiceKeys.map(k => {
                        if (row[k]) {
                            question.choices.push({
                                answer: row[k],
                                correct: k === "choice1"
                            });
                        }
                    })
                }

                if (question.question)
                    collection.push(question);
            });
        } catch (err) {}

        if (timeout)
            clearTimeout(timeout);

        insertCollection(questionDB, collection, listName)
            .then((data) => {

                res.json({
                    ...data
                    // inserted: false,
                    // total: collection.length,
                    // questionsAdded: collection.map(q => q.question),
                    // collection
                })
            })
    }

    let readable;
    timeout = setTimeout(() => {
        if (readable)
            readable.destroy();
        res.sendStatus(500);
    }, 10000);

    try {
        readable = new Readable();
        readable._read = () => {};
        readable.push(file.data);
        readable.push(null);
        const results = [];
        readable.pipe(csv({skipLines: 1}))
            .on("data", (data) => {
                results.push(data)
                // console.log(results)
            }).on("error", (err) => {
                console.error(err);
            })
            .on("end", () => complete(results));
    } catch (err) {
        clearTimeout(timeout);
        // console.error(err);
        res.status(501).send("The CSV you selected is not in a usable format.");
    }

}

interface Question {
    _creator: ObjectID;
    question: string;
    points: number;
    timeLimit: number;
    type: string;
    category: string[];
    answer: string;
    choices: {
        answer: string;
        correct: boolean;
    }[]
}

interface Row {
    question: string;
    points: string;
    timeLimit:string;
    type:string;
    category: string;
    choice1: string;
    choice2: string;
    choice3: string;
    choice4: string;
    choice5: string;
    choice6: string;
    choice7: string;
    choice8: string;
}