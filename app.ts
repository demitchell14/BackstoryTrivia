import * as express from "express";

import * as logger from "morgan";
import * as path from "path";
import * as fs from "fs";
import * as cookieParser from "cookie-parser";

import {Middleware} from "./www/trivia";
import {Server} from "http";
import SocketHandler from "./www/SocketHandler";

import {log} from "./util/logger";

// -- Routes
import ApiV1 from "./api/v1/index";
import ApiV2 from "./api/v2/index";
import React from "./www/React";
// -- End Routes
import * as compression from "compression";

import {Mongoose} from "./middleware/Mongoose";

/**
 *
 * @type {Express}
 */
const app = express();

app.set("database", Mongoose());

app.use(logger("dev"));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

//log(path.join(process.cwd(), "./react/build"))
// app.use();
if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === "production") {
    app.use('/', React);
}
app.use('/api/v1', Middleware(), ApiV1);
app.use('/api/v2', ApiV2);


if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === "production") {
    if (process.env.PUBLIC_DIR) {
        app.use(express.static(path.join(process.cwd(), `./${process.env.PUBLIC_DIR}/build`)));
    }
    if (process.env.PLAY_DIR) {
        app.use(express.static(path.join(process.cwd(), `./${process.env.PLAY_DIR}/build`)));
    }
}


export function SocketInit(server:Server) {
    let x = SocketHandler(server);

    //console.log(x);

}
//module.exports = app;
export default app;