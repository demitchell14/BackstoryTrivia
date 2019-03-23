import * as SocketIO from "socket.io";
import jwt, {AuthorizedToken} from "./jwt";
import {Database, TeamObject} from "./db/DatabaseHandler";
import {ObjectID} from "bson";
import {EventEmitter} from "events";
import {getUser} from "../api/v2";
import {Game, Team} from "../notrivia";
import GameInstanceManager from "./GameInstanceManager";

class SocketHandler {
    server:SocketIO.Server;
    constructor(server:SocketIO.Server) {
        this.server = server;

        this.server.on("connect", this.connection);
    }

    connect = (socket:SocketIO.Socket) => {

    }

    connection = (socket:SocketIO.Socket) => {
        console.log("Connected");

        const connection = new Connection(socket);

        socket.on("request game", connection.requestGame);

        socket.on("authenticate", connection.authenticate);

        connection.on("authenticated", () => {
            console.debug("Authentication Successful ??? ");
            // Attach additional listeners / emitters for game handling
        })

        // this.sendPoller(socket);
    }

    sendPoller = (socket:SocketIO.Socket) => {
        socket.on("poller", () => console.log(`Polled ${socket.id}`))
        setInterval(() => {

        }, 2500);
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
            const token = game._id.toHexString();
            if (game) {
                if (teamKey) {
                    success = game.hasTeam(teamKey)
                    // if (game.hasTeam(teamKey)) {
                    //     success = true;
                    // } else {
                    //     success = false;
                    // }
                }

                if (team.activeKey) {
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
                    if (game.hasTeam(team.teamName)) {
                        game.removeTeam(team.teamName);
                    }
                    game.addTeam(new Team({name: team.teamName}));
                    success = true;
                }
                this.socket.join(token, (err) => {
                    if (err) {
                        this.socket.emit("error", err);
                        return;
                    }
                    this.socket.emit("room joined", token);
                });
                this.socket.emit("authenticated", {
                    success: success,
                    key: team.activeKey && success ? team.activeKey : game.getTeam(team.teamName).key,
                    message: success ? undefined : "Please register your team first."
                });
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


    requestGame = async (gameToken:string, callback:Function) => {
        const instanceManager = await GameInstanceManager.getInstance(gameToken);
        const game = await instanceManager.instance() as Game;
        console.log(game);
        if (game) {
            console.log("Success");
            const response = {
                success: true,
                game: {
                    token: game.token,
                    name: game.getName(),
                    teams: game.teams.length,
                    questions: game.questions.length,
                    description: game.description,
                    image: game.image,
                    startTime: game.startTime,
                    started: game.started
                },
            };

            callback(response);
        } else {
            console.log("Fail");
            callback({
                success: false,
                message: "Could not find game"
            })
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
    }

}