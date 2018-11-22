import * as uuidv1 from "uuid/v1";
import * as express from "express";
import * as _ from "lodash";
import {MiddlewareReq} from "../../www/trivia";
import Game from "../../trivia/game/Game";
import Question from "../../trivia/game/Question";
import {log} from "../../util/logger";


const router = express.Router();

//router.get("/", async function(req:MiddlewareReq, res, next)

router.post("/game/save", async function(req:SaveRequest, res, next) {

    let game = req.trivia.game;

    if (req.body instanceof Array) {
        req.body.map(({key, value}) => {
            switch (key) {
                case "name":
                    return game.setName(value);
                case "token":
                    return game.setToken(value);
                case "started":
                    return game.setStarted(value)
                case "questions":
                    let questions = value as Array<Question>;
                    game.questions = [];
                    questions.map(q => {
                        if (q.type === "Open Ended")
                            delete q.choices;
                        game.addQuestion(q)
                    });
                    break;
                default:
                    game[key] = value;
            }
        })
    }

    req.forceUpdate();

    //log(req.trivia);
    log(game)
    //log(req.body)
    res.send("ok");
});

interface SaveRequest extends MiddlewareReq {
    body: Array<{key:string, value: any}>;
}

export default router;