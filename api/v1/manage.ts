import * as uuidv1 from "uuid/v1";
import * as express from "express";
import * as _ from "lodash";

import * as RandExp from "randexp";

import {getAllGames, MiddlewareReq} from "../../www/trivia";
import {Game, Question} from "../../notrivia";
import {log} from "../../util/logger";
import {Database} from "../../util/db/DatabaseHandler";
import {Cursor} from "mongodb";


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

router.post("/game/create", async function(req:CreateRequest, res, next) {
    const user = req.trivia.user;
    let response = {
        error:[],
        data: {} as any,
    };
    if (user.authorized) {
        let token = req.body.token;
        if (req.body.generate) {
            // Generate a unique game token
            token = await generate("backstory");
        } else {
            const exists = await gameExists(token);
            if (exists)
                response.error.push("Game already exists with the token you entered.");
        }

        let status = await Promise.all([
            user.addGame(token),
            insertGame(token)
        ]);

        if (status[1] && status[0].user().games.findIndex(a => a === token) !== -1) {
            getAllGames(true).then(res => {
                log(res);
            })
        }
        res.send(response.error.length > 0 ? {error: response.error} : {data: response.data});
    } else {
        res.sendStatus(403);
    }
});


const insertGame = async function(token:string) {
    const db = new Database();
    await db.openCollection("games");
    const game = new Game({token: token, name: "Please name me!"});
    let insertion = await db.insert((game as any));
    const res = insertion.insertedCount === 1;
    db.close();
    return res;
};

let gameExists = async function(token) {
    const db = new Database();
    await db.openCollection("games");
    let x = await db.find({token: token}) as Cursor;
    const res = (await x.count()) > 0;
    db.close();
    return res;
};

const generate = async function(str?:string) {
    const generation = new RandExp(`${str ? str : "game"}-[a-zA-Z0-9]{10}`);
    let token = generation.gen();
    while (await gameExists(token))
        token = generation.gen();
    return token;
};

interface CreateRequest extends MiddlewareReq {
    body: {
        token?:string;
        generate?:boolean;
    }
}
interface SaveRequest extends MiddlewareReq {
    body: Array<{key:string, value: any}>;
}

export default router;