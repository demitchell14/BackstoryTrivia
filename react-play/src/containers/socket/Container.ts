import {Container} from "unstated";
import * as io from "socket.io-client";
import * as ReactGA from "react-ga";
import {PlayerContainer} from "..";
import {generateColor} from "../../util";
import logger from "../../util/logger";
import Timeout = NodeJS.Timeout;
// @ts-ignore
import Color = require("color");


export class SocketContainer extends Container<SocketState> {
    static containerName:string = "socket";

    socket: SocketIOClient.Socket;
    poller: Timeout;

    connecting:boolean;
    
    constructor() {
        super();
        this.state = {
            status: "",
            timeouts: {},
        }
        
    }

    connected = () => this.socket && this.socket.connected;

    disconnect = () => {
        if (this.connected()) {
            if (this.poller)
                clearInterval(this.poller);
            this.socket.disconnect();
            this.setState({
                status: "",
                showNotification: undefined,
                notification: undefined,
                activeKey: undefined,
                room: undefined,
                game: undefined,
                gameStatus: undefined,
                question: undefined,
            })
        }
    }
    
    connect = () => {
        return new Promise((resolve, reject) => {
            if (this.socket && this.socket.connected) {
                logger.debug("Socket Already connected");
                resolve();
                return;
            }
            logger.debug("Socket Connected");

            const socket = io.connect({secure: process.env.NODE_ENV === "production"});
            socket.on("connect", () => {
                this.socket = socket;
                this.socket.on("error", this.handleError);

                ReactGA.event({
                    category: "Socket",
                    action: "Connected",
                    nonInteraction: true
                });
                resolve();
                // resolve(this.socket);
            })
        })
    }

    roomJoined = (room:any) => this.setState({room});

    receiveCountdown = (data:number) => {
        logger.log(data);
    }

    receiveQuestion = (data:QuestionDetails) => {
        const {gameStatus, game, timeouts} = this.state;
        timeouts.question = this.resetQuestionTimeout();
        if (gameStatus && game) {
            if (game.started && !game.paused) {
                this.setState({question: data, timeouts});
            } else {
                this.setState({question: undefined, timeouts});
            }
        } else {
            this.setState({question: undefined, timeouts});
        }
    }

    resetQuestionTimeout = () => {
        const {timeouts} = this.state;
        if (timeouts.question) {
            clearTimeout(timeouts.question);
        }
        return setTimeout(() => {
            let {question, game, gameStatus} = this.state;
            if (question) question = undefined;
            // if (game && game.started) game.started = false;
            if (game && !game.paused) game.paused = true;
            if (gameStatus && !gameStatus.paused) gameStatus.paused = true;

            this.setState({
                question, game, gameStatus
            })
        }, 5000)
    }

    resetTimeout = (name:string) => {
        const {timeouts} = this.state;
        if (timeouts[name]) {
            clearTimeout(timeouts[name]);
        }
        return setTimeout(() => {
            if (this.state[name]) {
                this.setState({[name]: undefined})
                    .then(() => logger.log(this.state));
            }
            // this.setState({[name]: undefined})
        }, 5000);
    }
    
    receiveState = (state?:GameStatus) => {
        // logger.log("State Received");
        // state.teams = state.teams.map(team => ({
        //     name: team.name,
        //     color: generateColor(team.name.toUpperCase().charAt(0))
        // }))
        if (this.state.gameStatus && this.state.game && state) {
            let notification;
            if (!this.state.game.started && state.started) {
                notification = "Game was just started! Standby";
            }


            const status = this.state.gameStatus;
            const game = this.state.game;
            if (state.teams) {
                let newTeams = state.teams.filter(team => status.teams.find(t => t.name === team.name) === null);
                newTeams = newTeams.map(team => ({
                    ...team,
                    color: generateColor()
                }));
                delete state.teams;
                status.teams.push.apply(status.teams, newTeams);
            }
            Object.assign(status, state);

            game.paused = state.paused;
            game.started = state.started;
            game.name = state.name;


            this.setState({
                gameStatus: status, game,
                notification,
                showNotification: notification ?
                    // true
                    setTimeout(() => this.setState({notification: undefined, showNotification: false}), 4000)
                    : false
            });
        } else {
            if (state) {
                state.teams = state.teams.map(team => ({
                    ...team,
                    color: generateColor()
                }))
                this.setState({gameStatus: state});
            }
        }
    }


    requestState = (game:string) => {
        if (this.socket) {
            this.socket.emit("request game state", game);
        }
    }

    requestGame = (game:string):Promise<SocketResponses.GameRequest> => {
        return new Promise((resolve, reject) => {
            if (this.socket) {
                logger.debug("Requested Game");
                this.socket.emit("request game", game, (data:any) => {
                    if (data.success) {
                        this.setState({
                            game: data.game
                        })
                    }
                    resolve(data)
                });

                this.socket.on("room joined", this.roomJoined);

            } else {
                reject("no socket");
            }
        })
    }


    sendAnswer = (player:PlayerContainer, answer:string) => {
        const question = this.state.question;
        const teamKey = this.state.activeKey;
        const gameId = this.state.room;
        if (this.socket && question) {

            // this.socket.once(`${question._id} answered`, (args:any) => {
            //     logger.log(args)
            // });

            this.socket.emit("answer question", {
                question,
                teamKey,
                gameId,
                answer
            }, (args:any) => {
                if (args.error) {
                    logger.error(args);
                    return;
                }
                // logger.log(args);
                player.addAnswer(args);
            })
        }

        // logger.log({question, answer, teamKey, gameId});
    }

    // requestAnswerHistory = () => {
    //     const {activeKey, room} = this.state;
    //     if (activeKey && room) {
    //         logger.log({
    //             activeKey, room
    //         })
    //     }
    // }
    //
    // receiveQuestionHistory = (data:AnswerResponse[]) => {
    //     logger.log(data);
    // }


    authenticate = (token:string, gameToken:string, teamKey?: string) => {
        if (this.socket) {
            this.setState({status: "authenticating"});
            this.socket.emit("authenticate", token, gameToken, teamKey);

            return new Promise((resolve) => {

                const timeout = setTimeout(() => {
                    this.socket.removeEventListener("authenticated");
                    this.socket.removeEventListener("game state");
                    this.socket.removeEventListener("question state");
                    this.socket.removeEventListener("question countdown");
                    resolve(false);
                }, 5000);

                const fn = (props:SocketResponses.Authenticated) => {
                    clearTimeout(timeout);
                    this.authenticated(props);

                    this.socket.once("room joined", (room:any) => {
                        this.roomJoined(room)
                            .then(() => {
                                logger.log(props)
                                resolve(props.success);
                            })
                    })
                };

                this.socket.once("authenticated", fn);
            })
        }
        return new Promise((resolve) => resolve(false));
    }

    authenticated = (props:SocketResponses.Authenticated) => {
        if (props.success) {
            logger.debug("Socket Authenticated")
            this.socket.on("game state", this.receiveState);
            this.socket.on("question state", this.receiveQuestion);
            this.socket.on("question countdown", this.receiveCountdown);
            // this.socket.on("question history", this.receiveQuestionHistory);
            // this.socket.on("question history", this.receiveQuestionHistory);

            this.setState({
                status: "authenticated",
                activeKey: props.key ? props.key : undefined
            });
        } else {
            this.setState({
                status: "unauthenticated",
                activeKey: props.message ? props.message : undefined
            });
        }
    }

    handleError = (...props:any[]) => {
        logger.error(props);
    }

}

export declare namespace SocketResponses {
    interface Authenticated {
        success:boolean;
        key?: string;
        message?: string;
    }
    interface GameRequest {
        success: boolean;
        game: GameObject;
    }
}

export interface QuestionDetails {
    _id: string;
    questionIndex: number;
    question: string;
    type: string;
    started: boolean;
    timeLeft: number;
    timeLimit: number;
    image?: string;
    details?: string;
    choices?: string[];
    points: number;
}

export interface GameObject {
    name: string;
    token: string;

    started: boolean;
    paused?: boolean;

    teams: number;
    questions: number;

    currentQuestion?: number;

    startTime: string;

    description?: string;
    image?: string;

}

export interface GameStatus {
    name: string;
    paused: boolean;
    started: boolean;
    teams: Array<TeamObject>;
}

export interface TeamObject {
    name: string;
    color:Color;
}

export interface SocketState {
    status:     string;
    activeKey?: string;
    room?:      string;
    game?: GameObject;
    gameStatus?: GameStatus;
    question?: QuestionDetails;
    notification?: string;
    showNotification?: Timeout|boolean;
    timeouts: {
        question?:Timeout;
    }
}