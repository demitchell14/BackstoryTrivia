import {Request} from "express";
import * as jwt from "jsonwebtoken";
// import {JWT_SECRET} from "../config";


export const isAuthorized = async (req:Request) => {
    if (typeof process.env.JWT_SECRET === "undefined") {
        throw new Error("JWT_SECRET is not set");
    }
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (typeof token === "string") {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }
        let error;
        const result = await (new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded: any) => {
                // console.log(decoded)
                if (err) {
                    reject("Invalid Token")
                } else {
                    resolve(decoded);
                }
            });
        }).catch(err => error = err)) as AuthorizedToken|string;
        if (typeof result === "string")
            return false;

        if (result.type === "moderator") {
            return result;
        }


    } else {
        return false;
    }
}

export interface AuthorizedToken {
    iat: number;
    expires: number;
    _id: string;
    type: string;
    autologin?: boolean;
}