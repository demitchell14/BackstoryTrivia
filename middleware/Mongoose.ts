// import {RequestHandler, Request, Response} from "express";
// import {Database} from "../util/db/DatabaseHandler";
import {Response, Request} from "express";
import {MongoDetails, MongooseDetails} from "../config";
import * as mongoose  from "mongoose";
//import {Mongoose} from "@types/mongoose";

const url = () => {
    const {baseurl, password, username, db} = MongoDetails
    return `mongodb://${username}:${password}@${baseurl}/${db}`
}

export function Mongoose(props?:MongooseProps) {
    const {baseurl, db, password, username} = MongooseDetails
    let connection = mongoose.connect(url(), { useNewUrlParser: true, })
    return new Promise((resolve, reject) => {
        connection.then(db => {
            resolve(db);
        }).catch (err => {
            reject(err);
        })
    })
}

interface MongooseProps {

}


// export function Mongo() : RequestHandler {
//
//
//     return async (req:Middleware.Mongo, res, next) => {
//         req.db = new Database();
//
//
//         let x=  await next();
//         //console.log(x)
//     }
// }

// export declare namespace Middleware {
//     interface Mongo extends Request {
//         db: Database;
//     }
// }