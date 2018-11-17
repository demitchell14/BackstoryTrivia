import * as uuidv1 from "uuid/v1";
import * as express from "express";
import * as _ from "lodash";
import {MiddlewareReq} from "../../www/trivia";
import Team from "../../trivia/game/Team";
import Player from "../../trivia/game/Player";
import Game from "../../trivia/game/Game";

import GameRoutes from "./game";
import UserRoutes from "./user";
import ManageRoutes from "./manage";

const router = express.Router();


//@ts-ignore
router.get("/", async function(req , res, next) {
    res.send("Game Api - Version 1.0");
});

router.use("/game", GameRoutes);
router.use("/user", UserRoutes);
router.use("/manage", ManageRoutes);

router.get("/gamelist", async function(req:MiddlewareReq, res, next) {
    let games = _.cloneDeep(Object.values(await req.trivia.games) as Array<Game>);
    games.map(game => {
        let {teams, questions} = game;
        teams.map(team => delete team.key);
        questions.map(question => {
            delete question.answer;
            question.choices.map(choice => delete choice.correct)
        })
    });

    //console.log(games);
    res.json(games);
});

router.get("/gamelist2", async function(req:MiddlewareReq, res, next) {
    let games = _.cloneDeep(Object.values(await req.trivia.games) as Array<Game>);
    res.json(games);
});


router.post("/register/team", async function(req:MiddlewareReq, res, next) {
    const game = req.trivia.game;

    let data = _.cloneDeep(req.body) as RegisterTeamOpts;
    delete data.token;

    let team = new Team({
        name: data.name,
        members: data.members.map(m => new Player(m))
    });
    if (!game.hasTeam(team.name)) {
        game.addTeam(team);
        res.status(201).json({
            game: {
                token: game.token
            },
            team
        })
    } else {
        res.status(409).send(`'${team.name}' already exists in game '${game.name}'`);
    }
    //res.send(game);
});

interface RegisterTeamOpts {
    token:string;
    name:string;
    members:Array<string>;
}

export default router;
//module.exports = router;