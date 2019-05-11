import * as express from "express";
import {Request} from "express";
import * as bcrypt from "bcrypt";
import {Middleware, Mongo} from "../../middleware/Mongo";
import {Encryption} from "../../config";
import jwt, {AuthorizedRequest} from "../../util/jwt";
import {Database, UserObject} from "../../util/db/DatabaseHandler";
import {ObjectID} from "bson";
import {Cursor} from "mongodb";
import {Mongoose,Document} from "mongoose";
import {Moderators} from "../../middleware/models/UserSchema";

const router = express.Router();

class UserRouting {

    updateUser(req: LoginBody, results: UserObject|Moderators) {
        const {db, ip} = req;
        let {_id, savedUIDs} = results;
        if (typeof savedUIDs === "undefined")
            savedUIDs = [];
        let updateData = {} as any;

        const exists = savedUIDs.findIndex(d =>d === ip);
        if (exists >= 0) {
            // -- Do nothing, already exists
        } else {
            savedUIDs.push(ip);
            updateData = {savedUIDs};

            db.find({_id}, {$set: updateData})
                .catch (err => console.error(err));
        }
        // db.close()
    }

    defaultRoute = async (req:AuthorizedRequest, res, next) => {
        console.log(req)

        res.send ({decoded: req.decoded})
        const db = await req.app.get("database") as Mongoose;
        //console.log();

    };

    loginRoute = async (req: LoginBody, res, next) => {
        //let errors = []
        const {db, params, body} = req;
        const type = "moderator";
        const {email, password, pin, autologin} = body;
        let authkey, _id;
        if (params.authkey) {
            let proceed = true;
            authkey = await jwt.verify(params.authkey).catch(err => {
                res.status(401).json(err);
                proceed = false;
            });
            if (authkey) {
                _id = ObjectID.createFromHexString(authkey._id);
                //console.log(authkey)
            }

            if (!proceed) {
                return;
            }
        }




        let queryParams = {_id, email} as any;
        if (typeof queryParams._id === "undefined")
            delete queryParams._id;
        if (typeof queryParams.email === "undefined")
            delete queryParams.email;
        if (Object.keys(queryParams).length === 0) {
            res.sendStatus(500)
            return;
        }


         // const db2 = await req.app.get("database") as Mongoose;

        await db.openCollection("moderators");
        const query = await Moderators.findOne(queryParams);

        //console.log(count, query)
        if (authkey) {
            const data = query.toJSON() as Moderators;

            if (data) {
                const {email, name} = data;
                const token = jwt.sign({_id, type: "moderator", autologin: authkey.autologin }, authkey.autologin ? "14d" : undefined);
                res.json({token, email, name, type});
                this.updateUser(req, data);
            }
            // db.close()
            return;
        } else {
            if (email) {
                if (password) {
                    const results = query.toJSON() as Moderators;
                    let {passwordhash, _id, name} = results;
                    console.log(passwordhash,)
                    if (bcrypt.compareSync(password, passwordhash)) {
                        const token = jwt.sign({_id, type: "moderator", autologin}, autologin ? "14d" : undefined);
                        res.json({token, email, name, type});
                        this.updateUser(req, results);
                        // db.close()
                        return;
                    }
                } else if (pin) {
                    const results = query.toJSON() as Moderators;
                    let {_id, name} = results;
                    if (bcrypt.compareSync(pin, results.pin)) {
                        const token = jwt.sign({_id, type: "moderator", autologin}, autologin ? "14d" : undefined)
                        res.json({token, email, name, type});
                        this.updateUser(req, results);
                        // db.close()
                        return;
                    }
                }
            }
        }
        res.sendStatus(500);
        // db.close()
    }

    registerRoute = async (req: RegisterBody, res, next) => {
        const db = req.db;
        const {email, password, pin, autologin} = req.body;
        await db.openCollection("moderators");
        let exists = db.find({ email }) as Cursor;
        const count = await exists.count();

        if (count === 0) {
            const complete = await db.insert({
                email,
                passwordhash: bcrypt.hashSync(password, Encryption.saltRounts),
                pin: bcrypt.hashSync(pin, Encryption.saltRounts),
                games: [],
                savedUIDs: [req.ip]
            });

            if (complete.insertedCount > 0) {
                const token = jwt.sign({ _id: complete.insertedId, type: "moderator", }, autologin ? "14d" : undefined);
                res.json({token, email});
                // db.close()
                return;
            }
        }

        res.sendStatus(500);
        // db.close()
    }

}

const routes = new UserRouting();

router.get("/", jwt.authorized, routes.defaultRoute);

router.post(["/login", "/login/:authkey"], Mongo(), routes.loginRoute);

router.post(["/register", "/register/:authkey"], Mongo(), routes.registerRoute);

interface LoginBody extends Middleware.Mongo {
    body: {
        //type: "login"|"token";
        email: string;
        password?: string;
        pin?: string;
        autologin?:boolean;
    }
    params: {
        authkey?:string;
    }
}

interface RegisterBody extends Middleware.Mongo {
    body: {
        email: string;
        password: string;
        pin: string;
        autologin?: boolean;
    },
    params: {
        authkey?: string;
    }
}



export default router;