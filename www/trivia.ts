
import {Request, Response} from "express"
import Game from "../trivia/game/Game";
import {Socket} from "socket.io";
import SocketHandler, {SocketHandler as SocketClass} from "./SocketHandler";
import * as fs from "fs";
import Authorization from "./authorization";
import {log} from "../util/logger";


export let games = {};

let activatedUrls = [
    "/api/v1/register/team",
    "/api/v1/manage/game/save",
    "/api/v1/game/authorize",
    "/api/v1/game/question/answer",
    "/api/v1/game/question",
    "/api/v1/game/pause",
    "/api/v1/game/resume",
    "/api/v1/game"
];

let userAuthentation = [
    "/api/v1/user/authorize"
];
let gameFile = fs.readFileSync("./trivia/json/game123.json", {encoding: "UTF-8"});

const g = JSON.parse(gameFile);

const middleware = function(opts?:any) {

    games["game123"] = new Game(g);

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

        let a,
            game:Game;
        //log(req);

        let func = u => {
            let url = req.url;
            url = "/" + url.split("/").filter(a => a.trim().length > 0).join("/")
            //log(u, req.url, req.baseUrl, req.originalUrl);

            return u === url;

            if (u === url)
                return true;

            else {
                if (u.includes("**")) {
                    let us = u.split("/").filter(a => a !== "**") as any,
                        tmp = req.url as any;
                    let tmp2 = tmp.split("/").splice(0, us.length) as Array<string>;

                    us = us.join("/");
                    tmp = tmp2.join("/");

                    return us === tmp;
                }
                return false;
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

            // -- Find a game that matches the token.
            if (Object.keys(games).find(x => x === gameToken)) {
                game = games[gameToken];
            } else {
                // -- TODO Load games from a database instead of single instance
                game = new Game(g);
                games[gameToken] = game;
            }
            req.trivia.game = game;
        }

        req.trivia.games = getAllGames();
        await next();

        // -- TODO Save game to database afterwards
        //log(game.getTeam("Josh"));
    }
};

const getAllGames = function() {
    return games;
}


export interface MiddlewareReq<G = {}> extends Request {
    trivia: {
        game?: Game;
        games: G;
        socket?: SocketClass;
        user?:Authorization;
    }
    headers: {
        token?:string;
        game?:string;
        authorized?:string;
    }
}

export default function(opts) {

}

export const Middleware = middleware;