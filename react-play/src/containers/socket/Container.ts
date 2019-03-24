import {Container} from "unstated";
import * as io from "socket.io-client";
import * as ReactGA from "react-ga";
import Timeout = NodeJS.Timeout;


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
                    action: "Connected"
                });
                resolve();
                // resolve(this.socket);
            })
        })
    }
    
    receiveState = (state:any) => {
        this.setState({gameStatus: state});
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
    teams: Array<{name: string}>;
}

export interface SocketState {
    status:     string;
    activeKey?: string;
    room?:      string;
    game?: GameObject;
    gameStatus?: GameStatus;
}