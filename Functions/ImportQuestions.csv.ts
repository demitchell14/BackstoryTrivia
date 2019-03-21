import {Request} from "express";
import {Readable} from "stream";
import * as csv from "csv-parser";
import {UploadedFile} from "express-fileupload";

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

export default async function(req:Request, res, next) {
    let file;
    if (req.files)
        file = req.files.csv as UploadedFile;
    let timeout;

    const complete = (results:Row[]) => {
        // console.log(results[0].);
        const collection = [];

        try {
            results.map(row => {
                const question = {} as any;
                question.question = row.question;
                question.points = convert(row.points, "number");
                question.timeLimit = convert(row.timeLimit, "number");
                question.type = row.type;
                // question.questionDetails = row.details
                // question.questionImage = row.image
                question.category = row.category.split(/,\\s*/);

                if (question.type === "Open Ended") {
                    question.answer = row.answer;
                }
                if (question.type === "Multiple Choice") {
                    question.choices = [];
                    const choiceKeys = Object.keys(row).filter(k => k.toLowerCase().match(/choice/));
                    choiceKeys.unshift("answer");
                    choiceKeys.map(k => {
                        if (row[k]) {
                            question.choices.push({
                                answer: row[k],
                                correct: k === "answer"
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

        res.json({
            total: collection.length,
            questionsAdded: collection.map(q => q.question)
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
        readable.pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => complete(results));
    } catch (err) {}

}

interface Row {
    question: string;
    points: string;
    timeLimit:string;
    type:string;
    category: string;
    answer: string;
    choice2: string;
    choice3: string;
    choice4: string;
    choice5: string;
    choice6: string;
    choice7: string;
    choice8: string;
}