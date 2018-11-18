import * as uuidv1 from "uuid/v1";
import * as express from "express";
import * as _ from "lodash";
import {MiddlewareReq} from "../../www/trivia";
import Game from "../../trivia/game/Game";
import Question from "../../trivia/game/Question";
import SocketHandler from "../../www/SocketHandler";
import {log} from "../../util/logger";

const router = express.Router();

router.get("/", async function(req:MiddlewareReq, res, next) {
    let results = {} as any;

    let game = req.trivia.game as Game;

    if (req.trivia.user.authorized) {
        // TODO -- send all data

        results.game = game

    } else {
        results.error = "Unauthorized access";
    }

    res.status(results.error ? 403 : 200).json(results);
});


router.get("/question", async function(req:MiddlewareReq, res, next) {
    let teamAuth = req.headers.token,
        game = req.trivia.game,
        response = {} as any;

    //log(game);

    if (game.hasTeam(teamAuth)) {
        //let currentQuestionIndex, currentQuestion:Question;
        let question:Question;
        let qIndex = game.getCurrentQuestionIndex();

        switch (qIndex) {
            case -100: //Game over
                response.error = "Game is over.";
                break;
            case -1: //Waiting...
                response.error = "Waiting for a question...";
                break;
            default:
                question = game.questions[qIndex];
                break;
        }

        if (question) {
            let q = _.cloneDeep(question);
            q.choices.map(c => delete c.correct);
            delete q.answer;
            response.question = q;
        }
    }


    res.json(response);
});

router.post("/question/answer", async function(req:MiddlewareReq, res, next) {
    let sock = SocketHandler();
    let teamAuth = req.headers.token,
        game = req.trivia.game,
        response = {} as any;

    log(sock)
    if (game.hasTeam(teamAuth)) {
        const team = game.getTeam(teamAuth);
        let question = game.question().current();
        let choice = question.getChoice(req.body.answer)
        try {
            let ans = team.answer(question, choice)
            response.answer = ans;
        } catch (err) {
            console.error(err);
        }

        log(team);
        sock.broadcast(`a-${game.token}`, "team answered", {team: team.name, answer: response.answer});
    } else {
        response.error = "Invalid team";
    }

    response.ok = "ok";
    res.json(response);
})

router.options("/authorize", async function(req:MiddlewareReq, res, next) {
    let game = req.trivia.game;
    if (req.headers.token) {
        if (game.hasTeam(req.headers.token)) {
            let team = game.getTeam(req.headers.token);
            team.setKey(uuidv1());
            res.send(team.key);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }
    //log(game, game.hasTeam(req.headers.token), req.headers.token);

});

router.put(["/resume", "/pause"], function(req:MiddlewareReq, res, next) {
    let game = req.trivia.game;
    if (req.url === "/resume")
        game.question().resume();
    else
        game.question().pause();
    res.send(`${game.paused ? "Game Pause." : "Game Resumed"}`);
});


router.get("/sockettest", function(req:MiddlewareReq, res, next) {
    const socket = req.trivia.socket.socket;
    if (socket) {
        let test = socket.of("/game/game123");
        log(req.trivia.socket);
        test.emit("test", "hello world");
    }
    res.send("OK");
});


router.put("/question", function(req:MiddlewareReq, res, next) {
    let game = req.trivia.game;
    if (req.headers.token === "I'mtheboss") {
        let runner = game.question();
        let idx = game.getCurrentQuestionIndex();
        if (idx >= 0) {
            if (runner.next())
                res.send(`Question #${idx+2} launched.`);
            else
                res.send("Game over.");
        } else {
            if (idx === -100) {
                runner.reset();
                res.send("Game restarted.");
            } else {
                res.send("Game is paused.");
            }
        }
    }
});


export default router;