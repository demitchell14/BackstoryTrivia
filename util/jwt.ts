import * as jwt from "jsonwebtoken";

import {Request,Response} from "express";
import {JWT_SECRET} from "../config";

const authorizedAccessOnly = (req:AuthorizedRequest, res:Response, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

    if (typeof token === "string") {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                if (decoded._id) {
                    const {_id, autologin} = decoded;
                    res.setHeader("authorization", "bearer " + sign({_id, autologin: autologin ? autologin : false}, decoded.autologin ? "14d" : "1m"));
                }
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(404).json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
};

const sign = (data:any, expires?:any) => {
    return jwt.sign(data,
        JWT_SECRET,
        { expiresIn: expires || '1m' // expires in 24 hours
        }
    );
};

const verify = (token:string) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded)
            }
        });
    })
}

export interface AuthorizedRequest extends Request {
    decoded?: AuthorizedToken;
}
export interface AuthorizedToken {
    iat: number;
    expires: number;
    _id: string;
    autologin?: boolean;
}

export default {
    authorized: authorizedAccessOnly,
    sign: sign,
    verify: verify
}