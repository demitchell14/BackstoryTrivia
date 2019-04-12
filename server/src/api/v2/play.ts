import * as express from "express";
import {Request,Response} from "express";
import * as bcrypt from "bcrypt";
import {Middleware, Mongo} from "../../middleware/Mongo";
import {Encryption} from "../../config";
import jwt, {AuthorizedRequest} from "../../util/jwt";
import {Database, UserObject} from "../../util/db/DatabaseHandler";
import {ObjectID} from "bson";
import {Cursor} from "mongodb";
import {Mongoose, Document, Types} from "mongoose";
import {Moderators} from "../../middleware/models/UserSchema";
import GameInstanceManager from "../../util/GameInstanceManager";
import SocketHandler from "../../util/SocketHandler.new";
import {Answer, Game} from "notrivia";

const router = express.Router();

class PlayRouting {
    index = async (req:IndexRoute, res:Response) => {

        const {decoded} = req;
        if (decoded.type === "moderator") {
            // const instanceManager = GameInstanceManager.getInstance(token)
            //
            // // Team Exists, now find the game that is being searched for
            // const game = await instanceManager.instance() as Game;

            res.send("OK");
        } else
        res.send("HELP ME");
    }


    send = async (req:SendRoute, res:Response) => {
        const {decoded} = req;
        if (decoded.type === "moderator") {
            const {gameId, action} = req.body;
            delete req.body.gameId;
            delete req.body.action;

            // console.log("GameID is ", ObjectID.isValid(gameId));
            const instanceManager = GameInstanceManager.getInstance(gameId)
            const game = await instanceManager.instance()
                .catch(err => res.status(500).json(err)) as Game;
            if (game) {
                const socket = SocketHandler.handler();

                if (socket) {
                    const handled = await socket.handleAction(action, game, req.body);
                    // if (handled)
                    //     console.log("Handled: ", handled);
                    // const res = await socket.broadcastState(gameId);
                    // socket.server.in(gameId).emit("game state")
                }

                // console.log(socket);


                res.send("OK");
            } else {
                res.status(404).json({error: "Unable to find game"})
            }
        }
    }

    getHistory = async (req:HistoryState, res:Response) => {
        const {decoded} = req;
        const userID = ObjectID.createFromHexString(decoded._id);
        const {token} = req.params

        const instanceManager = GameInstanceManager.getInstance(token)
        const game = await instanceManager.instance()
            .catch(err => res.status(500).json(err)) as Game;
        if (game) {
            if (decoded.type === "moderator") {
                // TODO Handle differently
                res.send("Moderators TODO");
                return;
            }

            if (decoded.type === "team") {
                if (game.hasTeam(userID)) {
                    const answers = [] as Partial<Answer&{type: string}>[];
                    const team = game.getTeam(userID);
                    team.answers
                       .sort((a, b) => Number(a.order < b.order))
                       .map(ans => {
                           answers.push({
                               answer: ans.answer,
                               question: ans.question,
                               type: game.getQuestion(ans.question).type,
                               _id: game.getQuestion(ans.question)._id,
                           })
                       })

                    res.json({answers, token});
                    return;
                }
            }

            res.status(404).json({error: "You are not a part of this game."});
        } else {
            res.status(404).json({error: "Could not find game instance."});
        }
    }

    getStatus = async (req:StatusRequest, res:Response) => {
        const {decoded} = req;
        const {token} = req.params

        const instanceManager = GameInstanceManager.getInstance(token)
        const game = await instanceManager.instance()
            .catch(err => res.status(500).json(err)) as Game;
        if (game) {
            const response = {} as any;
            if (decoded.type === "moderator") {
                // TODO add extra properties since the user that requested status is a moderator ???
            }

            response.completed = game.getCurrentQuestionIndex() < 0;
            response.started    = game.started;
            response.paused     = game.paused;
            // response.teams      = game.teams.length;
            // response.questions  = game.questions.length;

            if (response.completed) {
                // TODO add extra status properties since the game is over ???
            }

            res.json(response);
        } else {
            res.status(404).json({error: "Could not find game instance."});
        }
    }
}

const routes = new PlayRouting();

interface StatusRequest extends AuthorizedRequest, Middleware.Mongo {
    params: {
        token: string;
    }
}

interface HistoryState extends AuthorizedRequest, Middleware.Mongo {
    params: {
        token: string;
    }
}

interface IndexRoute extends AuthorizedRequest, Middleware.Mongo {

}
interface SendRoute extends AuthorizedRequest, Middleware.Mongo {
    body: {
        gameId: string;
        action: string;
    }
}


router.get("/", jwt.authorized, routes.index);
router.get("/:token/status", jwt.authorized, Mongo(), routes.getStatus);
router.get("/:token/history", jwt.authorized, Mongo(), routes.getHistory);
router.post("/send", jwt.authorized, routes.send);


export default router;