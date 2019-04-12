import {Game, QuestionOptions} from "notrivia";
import {v4} from "uuid";
import {AuthorizedRequest} from "../util/jwt";
import {Middleware} from "./Mongo";
import {ObjectID} from "bson";

let manager:GameManager;
export default function() {
    if (typeof manager === "undefined") {
        manager = new GameManager();
    }
    return {
        Manager: async (req:GameManager.ManagerReq, res, next) => {
            if (req.method === "POST") {
                await manager.createGame(req, res, next)
                    .catch(err => next(err));
                // next();
            } else {
                next();
            }
        }
    }
}
export declare namespace GameManager {
    interface ManagerReq extends AuthorizedRequest, Middleware.Mongo {
        body: any|{
            name: string;
            token: string;
            image?: string;
            description?: string;
            startTime: string;
            questions: string[];
        }
        game: Game;
    }
}

export class GameManager {
    constructor() {

    }

    createGame = async (req:GameManager.ManagerReq, res, next) => {
        const {db} = req;
        await db.openCollection("questions");
        const questionCursor = await db.find({_creator: ObjectID.createFromHexString(req.decoded._id)});
        const allQuestions = await questionCursor.toArray() as Array<QuestionOptions>;
        const questions = [];

        if (req.body.questions && req.body.questions.length > 0) {
            req.body.questions.map(_id => {
                const question = allQuestions.find(a => a._id.toString() === _id);
                if (question)
                    questions.push(question);
            });
            delete req.body.questions;
        }
        if (!req.body.token) {
            req.body.token = v4();
        }
        const game = new Game({...req.body, questions});
        req.game = game;
        next();
    }
}