import * as uuidv1 from "uuid/v1";
import * as express from "express";
import * as _ from "lodash";
import {getAllGames, MiddlewareReq, saveGame} from "../../www/trivia";
import Game, {GameOptions} from "../../trivia/game/Game";
import Question from "../../trivia/game/Question";
import SocketHandler from "../../www/SocketHandler";
import {Database} from "../../www/DatabaseHandler";
import {log} from "../../util/logger";

const router = express.Router();

router.get("/", async function(req:MiddlewareReq, res, next) {
    let results = {} as any;
    const teamToken = req.headers.token;
    const game = req.trivia.game as Game;

    if (req.trivia.user.authorized) {
        // TODO -- send all data
        results.game = game
        if (typeof game === "undefined") {
            results.error = "Unable to find the requested game.";
        }

    } else {
        if (teamToken) {
            let clone = _.cloneDeep(game);
            //let team = clone.getTeam(teamToken);

            // @ts-ignore
            clone.teams = clone.teams.map(team => {
                if (team.isAuthorized(teamToken)) {
                    delete team.key;
                    return team;
                } else {
                    let t = team.toJSON();
                    delete t.answers;
                    return t;
                }
            });
            // @ts-ignore
            clone.questions = clone.questions.map(q => {
                return {
                    type: q.type,
                    question: q.question,
                    started: q.started,
                }
            });
            results.game = clone;
        } else{
            results.error = "Unauthorized access";
        }
    }

    res.status(results.error ? 403 : 200).json(results);
});

router.get("/list", async function(req:MiddlewareReq, res, next) {
    let games = req.trivia.games as any;
    let user = req.trivia.user;

    games = await getAllGames(true);

    if (games) {
        if (user.authorized) {
            games = Object.values(games).filter((g:Game) => {
                return user.user().games.find(token => token === g.token)
            });
        }

        games = Object.values(games).map((g:Game) => {
            const {teams, questions, name, description, image, paused, started, startTime, token, _id} = g;

            return {
                _id, token, name, startTime, started, paused, image, description, questions: questions.length, teams: teams.length,
            }
        });

        res.json(games);
    } else {
        res.json([]);
    }



    /*const db = new Database();
    await db.openCollection("games");
    let gamesData = db.find({});
    if (await gamesData.count() > 0) {
        await gamesData.forEach((ga:GameOptions) => {
            games.push({
                _id: ga["_id"],
                //image: ga.
                name: ga.name,
                token: ga.token,
                started: ga.started,
                teams: ga.teams.length,
                questions: ga.questions.length,
            });
        })
    }*/

    //log(games);
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
            default:
                question = game.questions[qIndex];
                if (question) {
                    if (!question.started) {
                        response.error = "Waiting for question.";
                        question = undefined;
                    }
                } else {
                    response.error = "Game is over or there was an error.";
                }
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

        //console.log(choice);
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