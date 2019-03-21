import * as SocketIO from "socket.io";
import jwt, {AuthorizedToken} from "./jwt";
import {Database, TeamObject} from "./db/DatabaseHandler";
import {ObjectID} from "bson";
import {EventEmitter} from "events";
import {getGame, getUser} from "../api/v2";
import {Game, Team} from "../notrivia";
import GameInstanceManager from "./GameInstanceManager";

class SocketHandler {
    server:SocketIO.Server;
    constructor(server:SocketIO.Server) {
        this.server = server;

        this.server.on("connection", this.connection);
    }

    connection = (socket:SocketIO.Socket) => {
        console.log("Connected");

        const connection = new Connection(socket);

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

    constructor(socket:SocketIO.Socket) {
        super();

    }

    authenticate = async (token:string, gameToken:string) => {
        const decoded = await jwt.verify(token)
            .catch(err => this.handleError(err)) as AuthorizedToken;
        // console.log(decoded);
        const db = new Database();

        const team = await getUser(db, decoded) as TeamObject;
        // console.log(team);

        if (team) {
            const instanceManager = GameInstanceManager.getInstance(gameToken)


            //console.log(gameToken);

            // Team Exists, now find the game that is being searched for
            const game = await instanceManager.instance() as Game;
            if (game) {

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
                }
                this.emit("authenticated");
            }
        }
        // await db.openCollection(decoded.type + "s");
        // let cursor = await db.find({_id: ObjectID.createFromHexString(decoded._id)})
        //
        // if (await cursor.count() === 1) {
        //     // User exists, now find the game that is being searched for.
        //     const team = await cursor.next() as TeamObject;
        //     await db.openCollection("games");
        //
        // }
    };

    handleError = (err:any) => {
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