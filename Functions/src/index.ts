import * as en from "dotenv";
import * as parser from "body-parser";
import * as express from "express";
import {Request} from "express";
en.config();

// import * as fileUpload from "express-fileupload";
const app = express()
const port = process.env.PORT || 8080;

app.use(parser.urlencoded({extended: true}));
// express.
// app.use(fileUpload({
//     // useTempFiles: true,
//     // tempFileDir: "/tmp/"
// }))

app.use(parser.raw({limit: "1mb", type: "*/*"}));

import * as HelloWorld from "./HelloWorld";
// import GetQuestions from "./GetQuestions";
import * as ImportQuestionsCSV from "./ImportQuestions.csv";
import * as ImportQuestionsCSVTest from "./ImportQuestions.csv.testing";
import * as ExportQuestionsCSV from "./ExportQuestions.csv";

const Functions = {
    HelloWorld,
    // GetQuestions,
    ImportQuestionsCSV,
    ImportQuestionsCSVTest,
    ExportQuestionsCSV,
}

app.all('/:func', async (req:Req, res, next) => {
    const {func} = req.params;
    try {
        const callable = Functions[func].exec;
        if (callable)
            callable(req, res, next);
        else
        res.sendStatus(404);
    } catch (err) {
        console.log(err)
        res.sendStatus(501);
    }
    

});

interface Req extends Request {
    params: {
        func?: any;
    }
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))