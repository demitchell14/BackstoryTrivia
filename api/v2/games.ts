import * as express from "express";
import {Response} from "express";
import jwt, {AuthorizedRequest} from "../../util/jwt";
import {Middleware, Mongo} from "../../middleware/Mongo";
import {getUser, updateUser} from "./index";
// import _GameManager, {GameManager as GMR} from "../../middleware/GameManager";
import GameInstanceManager, {GameManagerRequest} from "../../util/GameInstanceManager";

const gameMiddleware = GameInstanceManager.middleware();
const router = express.Router();

class GamesController {
    index = async (req, res) => {
        res.send("Hello World from Games");
    }

    list = async (req:RequestTypes.List, res:Response) => {
        const {db} = req;
        await db.openCollection("games")
        db.find({})
        res.json({
            decoded: req.decoded,
            body: req.body
        })
    }

    add = async (req:RequestTypes.Add, res:Response) => {
        const {db,decoded, game} = req;
        const errors = [];
        if (game.name === "unnamed game") { // TODO game.getName()
            errors.push("No name set.");
        }
        if (game.questions.length === 0) {
            errors.push("Please add questions to your game otherwise this is a waste!");
        }

        if (errors.length > 0) {
            res.json(errors);
            return;
        }

        const user = await getUser(db, decoded);
        await db.openCollection("games");

        const done = await db.insert((game as any));
        if (done && done.insertedCount > 0 && done.insertedId) {
            const userUpdated = await updateUser(db, decoded, {$push: { games: done.insertedId }})
            // const userUpdated = await updateUser(db, decoded, { games: {$push: done.insertedId}})
            if (userUpdated) {
                res.json({msg: "DD", user, game: {...game, _id: done.insertedId} });
                return;
            }
        }
        res.json(["Failed to insert game."])
    }
}

declare namespace RequestTypes {
    interface List extends AuthorizedRequest, Middleware.Mongo {

    }
    interface Add extends AuthorizedRequest, Middleware.Mongo, GameManagerRequest {
    }
}

const controller = new GamesController();

router.get("/", jwt.authorized, controller.index);
router.post("/", jwt.authorized, Mongo(), gameMiddleware.Manager, controller.add);
router.get('/list', jwt.authorized, Mongo(), controller.list);


export default router;