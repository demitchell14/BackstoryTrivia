import * as _ from "lodash";
import {Request, Response} from "express"
import Game, {GameOptions} from "../trivia/game/Game";
import {Socket} from "socket.io";
import SocketHandler, {SocketHandler as SocketClass} from "./SocketHandler";
import * as fs from "fs";
import Authorization from "./authorization";
import {info, log} from "../util/logger";
import {Database} from "./DatabaseHandler";


export let games = {};

let activatedUrls = [
    "/api/v1/register/team",
    "/api/v1/manage/game/save",
    "/api/v1/game/authorize",
    "/api/v1/game/question/answer",
    "/api/v1/game/question",
    "/api/v1/game/pause",
    "/api/v1/game/resume",
    "/api/v1/game",
];

let userAuthentation = [
    "/api/v1/user/authorize"
];
let gameFile = fs.readFileSync("./trivia/json/game123.json", {encoding: "UTF-8"});

const g = JSON.parse(gameFile);

(async () => {
    const db = new Database();
    await db.openCollection("games");
    await db.insert(g)

});

const middleware = function(opts?:any) {

    //games["game123"] = new Game(g);

    return async function(req:MiddlewareReq, res:Response, next) {
        let sock = SocketHandler();
        if (typeof req.trivia === "undefined") {
            // @ts-ignore
            req.trivia = {};
        }
        if (typeof req.trivia.socket === "undefined") {
            req.trivia.socket = sock;
        }

        req.trivia.user = new Authorization(req);
        await req.trivia.user.session();

        let a;
        //log(req);

        let func = u => {
            let url = req.url;
            url = "/" + url.split("/").filter(a => a.trim().length > 0).join("/")
            //log(u, req.url, req.baseUrl, req.originalUrl);
            if (typeof u === "string")
                return u === url;
            if (u instanceof RegExp) {
                log(url)
                log(url.match(u))
                //return ;
            }

        };


        if (a = activatedUrls.find(func)) {
            let gameToken = req.body.game;
            // -- Get the Game ID from either body.token or headers.game
            if (typeof gameToken === "undefined") {
                gameToken = req.headers.game;
                if (typeof gameToken === "undefined") {
                    throw new Error("No game defined");
                }
            }

            let nGame = await loadGame(gameToken);

            if (nGame instanceof Game)
                req.trivia.game = nGame;
            else {
                if (typeof nGame !== "undefined")
                    req.trivia.game = new Game(nGame)
            }

            info(`${a} requires a game instance.`)
        }

        req.trivia.games = getAllGames();


        let doUpdate = false;
        req.forceUpdate = () => {
            doUpdate = true;
        };

        //log(req.trivia)
        await next();

        if (doUpdate) {
            log("Forcing database update.");
        }

        // -- TODO Save game to database afterwards
        //log(game.getTeam("Josh"));
    }
};

export const getAllGames = function() {
    if (Object.keys(games).length > 0) {
        return games;
    } else {
        const db = new Database();
        db.openCollection("games").then(async () => {
            let gamesData = db.find({});
            if (await gamesData.count() > 0) {
                await gamesData.forEach((ga:GameOptions) => {
                    games[ga.token] = new Game(ga);
                    log(games[ga.token]);
                });
            }
            db.close();
        })
    }
};


export const loadGame = async function(token:string):Promise<Game|undefined> {

    const exists = Object.keys(games).findIndex(g => g === token);

    let game:Game;

    //log(token)

    if (typeof exists === "number" && exists >=  0) {
        game = getAllGames()[token];
        if (!(game instanceof Game)) {
            console.info("Game saved as object, not Game Class. Fixing this..");
            console.log(getAllGames());
            game = new Game(game);
            console.log(game)
        }

    } else {

        const db = new Database();
        await db.openCollection("games");

        let gameQuery = await db.find({token: token} as GameOptions);
        //log(token)
        if (await gameQuery.count() > 0) {
            const data = (await gameQuery.toArray())[0] as GameOptions;
            game = new Game(data);

            log(`Loading ${game.token}...`)
            games[game.token] = game;


            db.close();
        }
    }
    return game;
};


export interface MiddlewareReq<G = {}> extends Request {
    trivia: {
        game?: Game;
        games: G;
        socket?: SocketClass;
        user?:Authorization;
    }
    forceUpdate:() => void;
    headers: {
        token?:string;
        game?:string;
        authorized?:string;
    }
}

export default function(opts) {

}

export const Middleware = middleware;