import * as express from "express";

import * as logger from "morgan";
import * as path from "path";
import * as fs from "fs";
import * as cookieParser from "cookie-parser";

import {Middleware} from "./www/trivia";
import {Server} from "http";
import SocketHandler from "./www/SocketHandler";

// -- Routes
import ApiV1 from "./api/v1/index";
import React from "./www/React";
// -- End Routes



/**
 *
 * @type {Express}
 */
const app = express();

app.use(logger("dev"));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === "production") {
    console.log = function() {

    };
    app.use(express.static(path.join(process.cwd(), "./react/build")));
}
app.use(cookieParser());

console.log(path.join(process.cwd(), "./react/build"))
app.use(Middleware());
if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === "production") {
    app.use('/', React);
}
app.use('/api/v1', ApiV1);


export function SocketInit(server:Server) {
    let x = SocketHandler(server);

    //console.log(x);

}
//module.exports = app;
export default app;