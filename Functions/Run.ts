import * as express from "express";
import {Request} from "express";

import * as fileUpload from "express-fileupload";
const app = express()
const port = 8080;

app.use(express.urlencoded({extended: true}));
app.use(fileUpload({
    // useTempFiles: true,
    // tempFileDir: "/tmp/"
}))

import HelloWorld from "./HelloWorld";
import GetQuestions from "./GetQuestions";
import ImportQuestionsCSV from "./ImportQuestions.csv";

const Functions = {
    HelloWorld,
    GetQuestions,
    ImportQuestionsCSV
}

app.all('/:func', async (req:Req, res, next) => {
    const {func} = req.params;
    try {
        const callable = Functions[func];
        if (callable)
            callable(req, res, next);
        else
        res.sendStatus(404);
    } catch (err) {
        console.log(err)
        res.sendStatus(500);
    }
    

});

interface Req extends Request {
    params: {
        func?: any;
    }
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))