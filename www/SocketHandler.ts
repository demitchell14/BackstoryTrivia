import * as SocketIO from "socket.io"
import * as moment from "moment";
import {games} from "./trivia"
import {Server} from "http";
import Game from "../trivia/game/Game";
import Team from "../trivia/game/Team";

export class SocketHandler {
    gamerooms:SocketIO.Namespace[];
    socket:SocketIO.Server;

    connected: boolean;
    //join?: (token:string) => SocketIO.Socket;

    constructor(props?:SocketProps) {
        this.socket = SocketIO(props.server);
        this.connected = false;
        this.gamerooms = [];

        this.socket.on("connection", this.connection.bind(this));

        this.loopingEmits();
    }

    private loopingEmits() {
        const socket = this.socket;

        /*let x = setInterval(() => {
            socket.in("g-game123").emit("test", "I'm in game!");
        }, 1000);

        setTimeout(() => {
            clearInterval(x);
        }, 120 * 1000); */
    }


    private connection(socket:SocketIO.Socket) {
        console.log("Connected to Socket.IO");
        let connection = new Connection(socket);

        //console.log(this);

        ///socket.emit("test", "Message here");
        socket.on("ready",
            (opts) => SocketHandler.ready(connection, opts));

        socket.on("disconnect",
            () => SocketHandler.disconnect(connection));
    }

    static ready(connection:Connection, opts:ReadyOpts) {
        let token = Object.keys(games).find(game => game === opts.game);
        if (token) {
            let game = games[token] as Game;
            connection.join(`g-${game.token}`);

            if (opts.key === "something else") {
                // -- TODO create management sockets
                connection.join(`a-${game.token}`);
                connection.manageHandlers(game.token);
            } else {
                let team = game.getTeam(opts.key) as Team;
                connection.join(`t-${game.token}-${team.cleanName()}`);

            }
        }
        //console.log(this, socket, opts);
    }

    static disconnect(connection:Connection) {
        connection.disconnect();
        console.log("Disconnected from Socket.IO");
    }

    broadcast(token, event, data) {
        if (this.socket) {
            this.socket.in(token).emit(event, data);
        }
    }
}

class Connection {
    readonly socket:SocketIO.Socket;
    private connected:boolean;
    private game:Game;

    constructor(socket:SocketIO.Socket) {
        this.socket = socket;
        this.connected = this.socket.connected;
    }

    join(game:string) {
        this.socket.join(game);
    }

    isConnected() {
        this.connected = this.socket.connected;
        return this.connected;
    }
    disconnect() {
        this.socket.disconnect();
        this.connected = this.socket.connected;
    }

    manageHandlers(token:string) {
        const socket = this.socket;
        this.game = games[token];
        if (this.isConnected()) {
            socket.emit("authorized", "success");
            socket.emit("game state", )
            socket.on("game start", this.startGame.bind(this));
            socket.on("game stop", this.endGame.bind(this));
            socket.on("game toggle", this.toggleGame.bind(this));
            socket.on("game next question", this.nextQuestion.bind(this));
            socket.on("game reset", this.resetGame.bind(this))
        }
    }

    private startGame(callback?:Function) {
        if (this.game) {
            const game = this.game;
            let response = {
                util: responseUtil()
            } as SocketResponse;

            if (game.started) {
                response.error = "Game is already started.";
            } else {
                game.question().reset();
                game.setStarted(true);
                game.paused = true;
                response.data = {started: game.started}
            }
            if (callback) {
                callback(response)
            } else {
                handler.broadcast(`a-${game.token}`, "game start", response);
                handler.broadcast(`g-${game.token}`, "reload", undefined);
            }
        }
    }

    private endGame(callback?:Function) {
        if (this.game) {
            const game = this.game;
            let response = {
                util: responseUtil()
            } as SocketResponse;
            if (!game.started) {
                response.error = "Game is already stopped.";
            } else {
                game.setStarted(false);
                game.paused = true;
                response.data = {started: game.started}
            }

            if (callback) {
                callback(response)
            } else {
                handler.broadcast(`a-${game.token}`, "game stop", response);
                handler.broadcast(`g-${game.token}`, "reload", undefined);
            }
        }
    }

    private resetGame(callback?:Function) {
        if (this.game) {
            const game = this.game;
            let response = {
                util: responseUtil(),
            } as SocketResponse;
            game.reset();
            response.data = {reset: game.getCurrentQuestionIndex() === 0}

            if (callback) {
                callback(response);
            } else {
                handler.broadcast(`a-${game.token}`, "game toggle", response);
                handler.broadcast(`g-${game.token}`, "reload", undefined);
            }
        }
    }

    private toggleGame(callback?:Function) {
        if (this.game) {
            const game = this.game;
            let response = {
                util: responseUtil()
            } as SocketResponse;

            if (game.started) {

                if (game.paused)
                    game.question().resume();
                else
                    game.question().pause();

                response.data = {
                    started: game.started,
                    paused: game.paused,
                }
            } else {
                response.error = "Game has not started yet."
            }

            if (callback) {
                callback(response);
            } else {
                handler.broadcast(`a-${game.token}`, "game toggle", response);
                handler.broadcast(`g-${game.token}`, "reload", undefined);
            }
        }
    }

    private nextQuestion(callback?:Function) {
        //game next question
        if (this.game) {
            const game = this.game;
            let response = {
                util: responseUtil()
            } as SocketResponse;

            if (game.started && !game.paused) {
                game.question().next();
                response.data = {
                    t: game.question().current()
                }
            } else {
                response.error = "Game has not started yet."
            }

            if (callback) {
                callback(response);
            } else {
                handler.broadcast(`a-${game.token}`, "game toggle", response);
                handler.broadcast(`g-${game.token}`, "reload", undefined);
            }
        }
    }
}

const responseUtil = function() {
    return {
        timestamp: moment()
    }
};

interface SocketResponse {
    error?: any;
    data?: any;
    util: {
        timestamp: any;
    }
}
interface ReadyOpts {
    key:string;
    game:string;
}

interface SocketProps {
    server:Server;
}

let handler:SocketHandler;
export default function(opts?:any):SocketHandler {
    if (typeof handler === "undefined" && opts)
        handler = new SocketHandler({server: opts});

    return handler;
};

class SocketHandlerBACK {
    gamerooms:SocketIO.Namespace[];
    socket:SocketIO.Server;

    connected: boolean;
    //join?: (token:string) => SocketIO.Socket;

    constructor(props?:SocketProps) {
        this.socket = SocketIO(props.server);
        this.connected = false;
        this.gamerooms = [];

        this.socket.on("connection", this.connection.bind(this));
        //console.log(this.connection);
    }

    private ready(socket:SocketIO.Socket, opts:ReadyOpts) {

        console.log(this, socket, opts);
    }

    private connection(socket:SocketIO.Socket) {
        console.log("Connected to Socket.IO");
        this.connected = true;

        ///socket.emit("test", "Message here");
        socket.on("ready",
            (opts) => this.ready.call(this, socket, opts));

        socket.on("disconnect", this.disconnect.bind(this));
    }

    private disconnect() {
        this.connected = false;
        // -- Cleanup all functions that require a connection
        //delete this.join;
        console.log("Disconnected from Socket.IO");
    }
}