import * as express from "express";
import {Request,Response} from "express";
import * as bcrypt from "bcrypt";
import {Middleware, Mongo} from "../../middleware/Mongo";
import {Encryption} from "../../config";
import jwt, {AuthorizedRequest} from "../../util/jwt";
import {Database, UserObject} from "../../util/db/DatabaseHandler";
import {ObjectID} from "bson";
import {Cursor} from "mongodb";
import {Mongoose,Document} from "mongoose";
import {Moderators} from "../../middleware/models/UserSchema";
import GameInstanceManager from "../../util/GameInstanceManager";
import SocketHandler from "../../util/SocketHandler.new";
import {Game} from "../../notrivia";

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

            console.log("GameID is ", ObjectID.isValid(gameId));
            const instanceManager = GameInstanceManager.getInstance(gameId)
            const game = await instanceManager.instance()
                .catch(err => res.status(500).json(err)) as Game;
            if (game) {
                const socket = SocketHandler.handler();

                if (socket) {
                    await socket.handleAction(game, action);
                    // const res = await socket.broadcastState(gameId);
                    // socket.server.in(gameId).emit("game state")
                }

                console.log(socket);


                res.send("OK");
            } else {
                res.status(404).json({error: "Unable to find game"})
            }
        }
    }
}

const routes = new PlayRouting();

interface IndexRoute extends AuthorizedRequest, Middleware.Mongo {

}
interface SendRoute extends AuthorizedRequest, Middleware.Mongo {
    body: {
        gameId: string;
        action: string;
    }
}


router.get("/", jwt.authorized, routes.index);
router.post("/send", jwt.authorized, routes.send);


export default router;