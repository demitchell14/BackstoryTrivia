import {Request} from "express";
import {Readable} from "stream";
import * as csv from "csv-parser";
import {UploadedFile} from "express-fileupload";
import {AuthorizedToken, isAuthorized} from "./Authorization";
import * as mongo from "mongodb";
import {Collection, MongoClient, ObjectID} from "mongodb";

const __db = async ():Promise<MongoClient> => {
    const {MONGO_URL2, MONGO_PASS2, MONGO_USER2, MONGO_DB2} = process.env
    const connstr = `mongodb+srv://${MONGO_USER2}:${MONGO_PASS2}@${MONGO_URL2}/${MONGO_DB2}`;
    return await mongo.MongoClient.connect(connstr, {
        useNewUrlParser: true,
    });
}

export async function exec(req:Request, res, next) {

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

    const result = await questionDB.find({_creator: ObjectID.createFromHexString(user._id)});
    const array = await result.toArray();

    const ignored = (str:string) => !(
        str === "_id"
        || str === "_creator"
        || str === "questionImage"
        || str === "questionDetails"
    )

    const questions = [
        "# DO NOT DELETE",
        "question,timeLimit,points,category,type,choice1,choice2,choice3,choice4,choice5,choice6"
    ]
    array.map((q: Question) => {
        const {question, answer, _creator, category, choices, points, timeLimit, type} = q;
        const template = [
            `"${question.replace(/"/g,"\"\"")}"`,
            timeLimit,
            points,
            category && category.length > 0 ? `"${category.join(",")}"` : "",
            type,
            answer ? answer : (() => {
                const x = choices.find(c => c.correct);
                return x ? x.answer : ""
            })()
        ];
        if (choices && choices.length > 0) {
            const tmp = Array(5).fill("", 0);
            choices.filter(c => !c.correct)
                .map(c => tmp.unshift(c.answer));

            template.push(...tmp.slice(0, 5));
        }

        questions.push(template.join(","));
    })

    res.send(questions.join("\n"));
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