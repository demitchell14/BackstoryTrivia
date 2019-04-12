import * as SocketIO from "socket.io";
import jwt, {AuthorizedToken} from "./jwt";
import {Database, TeamObject} from "./db/DatabaseHandler";
import {ObjectID} from "bson";
import {EventEmitter} from "events";
import {getUser, generateGameState, shuffle} from "../api/v2";
import {Question, Game, Team} from "notrivia";
import GameInstanceManager from "./GameInstanceManager";
import * as rand from "seedrandom";

class SocketHandler {
    server:SocketIO.Server;
    constructor(server:SocketIO.Server) {
        this.server = server;

        this.server.on("connect", this.connection);
    }

    actions = {
        start: (game:Game) => {
            if (!game.started) {
                game.question().reset();
                game.question().pause();
                game.setStarted(true);
                return true;
            }
        },
        stop: (game:Game) => {
            console.log("stopping: ", game.started);
            if (game.started) {
                game.question().pause();
                game.setStarted(false);
                return true;
            }
            return false;
        },
        pause: (game:Game, automaticNext?: boolean) => {
            if (game.started) {
                game.paused = true;
                game.question().pause();
                console.log("automaticNext: ", automaticNext);
                if (automaticNext === true) {
                    this.handleAction("next question", game);
                }
                return true;
            }
            return false;
        },
        "start question": (game:Game, props?: {automaticNext?: boolean}) => {
            if (game.started) {
                const question = game.question().current();
                if (question) {
                    const ret = question.start();
                    if (props) {
                        // @ts-ignore
                        ret.automaticStart = Boolean(props.automaticNext)
                    }
                    game.paused = false;
                    return ret;
                }
            }
            return false;
        },
        "start question countdown": (game:Game, props?:{timer?:string|number}) => {
            if (props && typeof props.timer !== "undefined" ){
                let timer:number;
                const countdown = function*(start:number) {
                    let date = new Date();
                    let limit:number, end:number;

                    if (start > 1000) limit = start;
                    else limit = start * 1000;

                    end = date.getTime() + limit;
                    if (end > date.getTime()) {
                        yield end;
                        // console.log(end, date.getTime());
                        while (end > date.getTime()) {
                            yield end - date.getTime()
                            date = new Date();
                        }
                        yield true
                    }
                }

                if (typeof props.timer === "string") {
                    timer = Number.parseInt(props.timer);
                    if (!Number.isInteger(timer)) {
                        return false;
                    }
                } else timer= props.timer;

                const generator = countdown(timer);

                let timeout = setInterval(() => {
                    let val = generator.next();
                    if (val.done) {
                        clearInterval(timeout);
                        return;
                    }
                    if (val.value === true) {
                        // start next question
                        console.log("Countdown Done\nStarting Question")
                        this.handleAction("start question", game);
                    } else {
                        console.log("Countdown: ", val.value)
                        this.broadcast(game._id.toHexString()).emit("question countdown", Math.ceil(val.value/1000))
                        // this.broadcast(game._id).emit("")
                    }
                }, 800);
                return true;
            }
            return false;
        },
        "next question": (game:Game) => {
            console.log("NEXT QUESTION PLEASE");
            if (game.started && game.paused) {
                if (game.question().next()) {
                    return true;
                } else {
                    // TODO Game is over at this point since next() returns undefined
                    return false;
                }
            }
            return false;
        }
    }

    connect = (socket:SocketIO.Socket) => {

    }

    broadcast = (token:string|ObjectID) => {
        let room;
        if (typeof token === "string")
            room = this.server.in(token);
        else
            room = this.server.in(token.toHexString())
        return room;
    }

    broadcastState = async (token:string|ObjectID) => {
        const room = this.server.in(typeof token === "string" ? token : token.toHexString());
        const mgr = GameInstanceManager.getInstance(token);
        const game = await mgr.instance() as Game;

        if (game) {
            try {
                const state = generateGameState(game);

                room.emit("game state", state);
                return state;
            } catch (err) {
                // this.handleAction("pause", game);
            }
        }
        return false
    }

    broadcastQuestion = async (game:Game, loop?:Generator&{automaticStart?:boolean;}) => {
        const room = this.server.in(typeof game._id === "string" ? game._id : game._id.toHexString());
        if (loop) {
            const seed = "s-" + Math.random() + "-d";
            let interval = 1000;

            const idx = setInterval(() => {
                const question = game.question().current();
                const questionIndex = game.getCurrentQuestionIndex();
                if (interval < 500)
                    interval = 500;
                const val = loop.next();

                if (val.done) {
                    clearInterval(idx);
                    this.handleAction("pause", game, loop.automaticStart)
                        // .then(() => ((val.value <= 10 || typeof val.value === "undefined") && this.handleAction("next question", game)) );
                }

                room.emit("question state", {
                    _id: question._id,
                    questionIndex,
                    question: question.question,
                    details: question.questionDetails,
                    image: question.questionImage,
                    timeLeft: question.timeLeft,
                    timeLimit: question.timeLimit,
                    points: question.points,
                    type: question.type,
                    choices: question.type === "Multiple Choice" ? shuffle(question.choices.map(choice => choice.answer), seed) : undefined,
                    started: question.started
                });
            }, interval);
        }
    }

    handleAction = async (action:string, game:Game, additional?: any) => {
        if (this.actions[action]) {
            // console.log({
            //     action, exists: typeof this.actions[action],
            //     additional
            // });
            const success = this.actions[action](game, {...additional});

            if (success) {
                this.broadcastState(typeof game._id === "string" ? game._id : game._id.toHexString());
                if (typeof success === "object") {
                    if (typeof success.next !== "undefined") {
                        return await this.broadcastQuestion(game, success);
                    } else
                        throw "Not set up!"
                }
            }
        }
    }


    connection = (socket:SocketIO.Socket) => {
        console.log("Connected");

        const connection = new Connection(socket);

        socket.on("request game", connection.requestGame);

        socket.on("authenticate", connection.authenticate);

        connection.on("authenticated", () => {
            // console.log("Authentication Successful ");
            // Attach additional listeners / emitters for game handling
            socket.on("request game state", connection.requestState);
            socket.on("answer question", connection.handleAnswer);
        })

    }

    handleError = (err:any) => {
        console.error("SocketIO Error:", err);
    }

}

class Connection extends EventEmitter {
    socket:SocketIO.Socket;

    constructor(socket:SocketIO.Socket) {
        super();
        this.socket = socket;
    }

    authenticate = async (token:string, gameToken:string, teamKey?: string) => {
        const decoded = await jwt.verify(token)
            .catch(err => this.handleError(err)) as AuthorizedToken;
        // console.log(decoded);
        const db = new Database({timeout: false});

        const team = await getUser(db, decoded) as TeamObject;
        // console.log(team);

        let success = false;

        if (team) {
            const instanceManager = GameInstanceManager.getInstance(gameToken)


            //console.log(gameToken);

            // Team Exists, now find the game that is being searched for
            const game = await instanceManager.instance() as Game;
            if (game) {
                const token = game._id.toHexString();
                if (teamKey) {
                    success = game.hasTeam(teamKey)
                }


                if (team.activeKey) {
                    console.error("This should NOT HAPPEN");
                    // TODO Handle ActiveKey
                    // Team has an active session
                    // If this game contains a team with the session key, we are good
                    // Otherwise the user is not joining the correct game.
                    if (game.hasTeam(team.activeKey)) {
                        // Authenticated and reconnected
                    } else {
                        // TODO Send invalid response
                    }
                } else {
                    // Team does not have an active session
                    // If this game contains a team with the same name, remove the current, and replace (effectively a ban by removing current score)
                    // Otherwise, add the team the game as a new team
                    if (!game.hasTeam(team._id)) {
                        game.addTeam(new Team({name: team.teamName, key: team._id}));
                    }
                    // console.log(game.teams, team);
                    success = true;
                }
                this.socket.join(token, (err) => {
                    if (err) {
                        this.socket.emit("error", err);
                        return;
                    }
                    this.socket.emit("room joined", token);
                });
                this.emit("authenticated");
                this.socket.emit("authenticated", {
                    success: success,
                    key: team.activeKey && success ? team.activeKey : game.getTeam(team._id).key,
                    message: success ? undefined : "Please register your team first."
                });

                // this.requestState(gameToken);
            } else {
                this.socket.emit("authenticated", {
                    success: success,
                    message: "Game not found"
                })
            }
        } else {
            this.socket.emit("authenticated", {
                success: success,
                message: "Team not found"
            })
        }
    };

    requestState = async (token:string) => {
        if (this.socket) {
            const instanceManager = GameInstanceManager.getInstance(token)

            const state = {} as any;

            // Team Exists, now find the game that is being searched for
            const game = await instanceManager.instance() as Game;

            state.name = game.name;
            state.started = game.started;
            state.paused = game.paused;

            state.teams = game.teams.map(team => ({
                name: team.name,
                answered: game.started ? team.answers.length : undefined, // lists all answered questions
                // correct: team.answers.filter(ans => ans.correct === true) // lists correct answers
            }));
            if (game.started) {

                const current = game.question().current();
                if (current) {
                    state.questionId = current._id;

                    if (game.paused === false) {
                        // game is running
                        state.question = {
                            started: current.started,
                            question: current.question,
                            image: current.questionImage || "",
                            description: current.questionDetails || "",
                            type: current.type,
                            choices: current.type === "Multiple Choice" ?
                                current.choices.map(choice => choice.answer)
                                : undefined,
                            points: current.points,
                            time: {
                                limit: current.timeLimit,
                                left: current.timeLeft,
                            },
                        }
                    }
                }
            }

            // console.log("Socket State Requested: ", {
            //     room: typeof game._id === "string" ? game._id : game._id.toHexString(),
            //     token,
            //     socket: this.socket
            // });
            const room = this.socket.server.in(typeof game._id === "string" ? game._id : game._id.toHexString());

            // console.log(this.socket.rooms);
            // this.socket.emit("game state", state);
            room.emit("game state", state);


            // console.log(state);
        }
    }

    requestGame = async (gameToken:string, callback:Function) => {
        const instanceManager = await GameInstanceManager.getInstance(gameToken);
        const game = await instanceManager.instance() as Game;
        if (game) {

            const response = {
                success: true,
                game: {
                    token: game.token,
                    name: game.name, // TODO game.getName()
                    teams: game.teams.length,
                    questions: game.questions.length,
                    description: game.description,
                    image: game.image,
                    startTime: game.startTime,
                    started: game.started,
                    paused: game.paused,
                },
            };

            callback(response);
        } else {
            callback({
                success: false,
                message: "Could not find game"
            })
        }
    }

    handleAnswer = async (args:AnswerRequest, callback?:Function) => {
        const instanceManager = await GameInstanceManager.getInstance(args.gameId);
        const game = await instanceManager.instance() as Game;
        console.log(args);
        if (game) {
            if (ObjectID.createFromHexString(args.teamKey)) {
                const team = game.getTeam(ObjectID.createFromHexString(args.teamKey));
                const question = game.question().current();
                if (typeof question === "undefined")
                    return;

                let questionKey = typeof question._id === "string" ? question._id : question._id.toHexString();

                // const idx = team.answers.findIndex(ans => ans.question === question.question);
                //
                // if (idx >= 0) {
                //     team.answers[idx].setAnswer(args.answer);
                //     if (typeof callback === "function") {
                //         callback({error: "This question was already answered your team!"});
                //     } else {
                //         this.socket.emit(`${questionKey} answered`, {error: "This question was already answered your team!"});
                //     }
                //     return;
                // }

                const answer = Object.assign({}, team.answer(question, args.answer));

                // TODO Send to admin here as well

                delete answer.correct;
                if (typeof callback === "function") {
                    callback(answer);
                } else {
                    this.socket.emit(`${questionKey} answered`, answer);
                }
                console.log(args.gameId);
                this.requestState(args.gameId)
            }
        }
    }

    handleError = (err:any) => {
        this.socket.emit("error", err);
        console.error("Socket Connection Error:", err);
    }

}

let handler:SocketHandler;
export default {
    init(opts?:any) {
        if (typeof handler === "undefined") {
            import("../www/server").then(obj => {
                const server = obj.default;
                const io = SocketIO(server);
                handler = new SocketHandler(io);
            })
        }
    },
    handler() {
        return handler;
    },
}

export interface AnswerRequest {
    question:Question;
    answer: string;
    gameId: string;
    teamKey: string;

}