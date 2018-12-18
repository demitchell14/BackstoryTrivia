import {RequestHandler, Request, Response} from "express";
import {Database} from "../util/db/DatabaseHandler";


export function Mongo() : RequestHandler {


    return async (req:Middleware.Mongo, res, next) => {
        req.db = new Database();


        let x=  await next();
        //console.log(x)
    }
}

export declare namespace Middleware {
    interface Mongo extends Request {
        db: Database;
    }
}