import * as _ from "lodash";
import {Request, Response} from "express"
import {Game, GameProps} from "../notrivia"
import {Socket} from "socket.io";
import SocketHandler, {SocketHandler as SocketClass} from "./SocketHandler";
import * as fs from "fs";
import Authorization from "./authorization";
import {info, log} from "../util/logger";
import {Database} from "../util/db/DatabaseHandler";
import {Cursor} from "mongodb";


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
    "/register/team",
    "/manage/game/save",
    "/game/authorize",
    "/game/question/answer",
    "/game/question",
    "/game/pause",
    "/game/resume",
    "/game",
];

let userAuthentation = [
    "/api/v1/user/authorize"
];


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


        //console.log("Got Here!")
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

            //console.log(nGame)

            if (nGame instanceof Game)
                req.trivia.game = nGame;
            else {
                if (typeof nGame !== "undefined")
                    req.trivia.game = new Game(nGame)
            }

            info(`${a} requires a game instance.`)
        }

        req.trivia.games = [];// await getAllGames();


        let doUpdate = false;
        req.forceUpdate = () => {
            doUpdate = true;
        };




        // -- Endpoint Start
        // -- Endpoint Start
        // -- Endpoint Start
        await next();
        // -- Endpoint End
        // -- Endpoint End
        // -- Endpoint End

        let current = req.trivia.game;
        if (current && !doUpdate) {
            games[current.token] = current;
            //log(current.update(), current.needsUpdate)
            if (current.update()) {
                //games[current.token] = current;
                log(current.token, "needs update:", current.needsUpdate)
                saveGame(current).then(res => {
                    log(`${current.token} was ${res ? "successfully" : "not successfully"} saved.`);
                })
            }
        } else
        if (current && doUpdate) {
            saveGame(current, true).then(res => {
                log(`${current.token} was ${res ? "successfully" : "not successfully"} saved.`);
            })
            log("Forcing database update.");
        }

        // -- TODO Save game to database afterwards
        //log(game.getTeam("Josh"));
    }
};



export const getAllGames = async function(forced?:boolean) {
    forced = forced || false;
    if (Object.keys(games).length > 0 && !forced) {
        return games;
    } else {
        let tmp = {} as any;
        const db = new Database();
        return db.openCollection("games").then(async () => {
            let gamesData = db.find({}) as Cursor;
            if (await gamesData.count() > 0) {

                await gamesData.forEach((ga: GameProps.Game) => {
                    if (!forced) {
                        games[ga.token] = new Game(ga);
                    }
                    tmp[ga.token] = new Game(ga);
                });
            }
            db.close();
            return tmp
        });
        //return getAllGames();
    }
};

let stack = [], saveLimiter = {};

/**
 * This function is called after every endpoint that requires a Game instance.
 * If there are no calls for <i>n</i> secondsd afterwards, it is saved to a database and deleted from
 * system memory. If there are consecutive calls within <i>n</i> seconds, the timeout is reset,
 * and we continue to use the game in memory.
 *
 * @param game
 * @returns Promise<boolean>
 */
export const saveGame = async function(game?:Game, _force?:boolean|number) {
    let force = typeof _force === "boolean" ? _force : false;
    let timeout = force ? 0 : typeof force === "number" ? force : 5000;

    if (saveLimiter[game.token])
        clearInterval(saveLimiter[game.token]);

    const fn = async () => {
        const db = new Database();
        await db.openCollection("games");
        let response = await db.update({token: game.token}, {
            $set: game
        });
        return response.modifiedCount === 1;
    };

    return new Promise((resolve, reject) => {
        if (game) {
            log(games);
            saveLimiter[game.token] = setTimeout(async () => {
                let result = await fn();
                resolve(result);
                if (!force) {
                    delete games[game.token];
                    //log(games);
                }

                //await getAllGames(true)
            }, timeout);
        }
    });

    if (stack.length > 4) {
        let x = stack.pop()();
        log(x);
        stack = [];
    }
    return false;
};


export const loadGame = async function(token:string):Promise<Game|undefined> {

    const exists = Object.keys(games).findIndex(g => g === token);

    let game:Game;

    //log(token)

    if (typeof exists === "number" && exists >=  0) {
        game = (await getAllGames())[token];
        if (!(game instanceof Game)) {
            game = new Game(game);
            log(game)
        }

    }

    if (typeof game === "undefined") {

        const db = new Database();
        await db.openCollection("games");

        let gameQuery = await db.find({token: token} as GameProps.Game) as Cursor;
        //log(token)
        if (await gameQuery.count() > 0) {
            const data = (await gameQuery.toArray())[0] as GameProps.Game;
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
        error?: any;
        statusCode?: any;
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