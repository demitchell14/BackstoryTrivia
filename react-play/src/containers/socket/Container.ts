import {Container} from "unstated";
import * as io from "socket.io-client";
import * as ReactGA from "react-ga";
import {generateColor} from "../../util";
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
                console.debug("Socket Already connected");
                resolve();
                return;
            }
            console.debug("Socket Connected");

            const socket = io.connect();
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

    receiveQuestion = (data:QuestionDetails) => {
        const {gameStatus, game} = this.state;
        if (gameStatus && game) {
            if (game.started && !game.paused) {
                this.setState({question: data});
            } else {
                this.setState({question: undefined});
            }
        } else {
            this.setState({question: undefined});
        }
        console.log(data);
    }
    
    receiveState = (state?:GameStatus) => {
        console.log("State Received");
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
                console.debug("Requested Game");
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

    authenticate = (token:string, gameToken:string, teamKey?: string) => {
        if (this.socket) {
            this.setState({status: "authenticating"});
            this.socket.emit("authenticate", token, gameToken, teamKey);

            return new Promise((resolve) => {

                const timeout = setTimeout(() => {
                    this.socket.removeEventListener("authenticated");
                    this.socket.removeEventListener("game state");
                    this.socket.removeEventListener("question state");
                    resolve(false);
                }, 5000);

                const fn = (props:SocketResponses.Authenticated) => {
                    clearTimeout(timeout);
                    this.authenticated(props);

                    this.socket.once("room joined", (room:any) => {
                        this.roomJoined(room)
                            .then(() => {
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
            console.debug("Socket Authenticated")
            this.socket.on("game state", this.receiveState);
            this.socket.on("question state", this.receiveQuestion);

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
        console.error(props);
    }

    roomJoined = (room:any) => this.setState({room});

    startPolling = () => {
        console.log("Polling");
        if (this.connected()) {
            console.log("Starting Poller");
            const id =  setInterval(() => {
                this.socket.emit("poller");
            }, 2500);
            this.poller = id;
            return id;
        }
        return -1;
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
}