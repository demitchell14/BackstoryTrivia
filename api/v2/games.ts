import * as express from "express";
import {Response} from "express";
import jwt, {AuthorizedRequest} from "../../util/jwt";
import {Middleware, Mongo} from "../../middleware/Mongo";
import {getUser} from "./index";
import _GameManager, {GameManager as GMR} from "../../middleware/GameManager";

const router = express.Router();
const GameManager = _GameManager();
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
        if (game.getName() === "unnamed game") {
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



        res.json({msg: "DD", user, game});
    }
}

declare namespace RequestTypes {
    interface List extends AuthorizedRequest, Middleware.Mongo {

    }
    interface Add extends AuthorizedRequest, Middleware.Mongo, GMR.ManagerReq{
    }
}

const controller = new GamesController();

router.get("/", jwt.authorized, controller.index);
router.post("/", jwt.authorized, Mongo(), GameManager.Manager, controller.add);
router.get('/list', jwt.authorized, Mongo(), controller.list);


export default router;