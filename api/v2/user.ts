import * as express from "express";
import {Request} from "express";
import * as bcrypt from "bcrypt";
import {Middleware, Mongo} from "../../middleware/Mongo";
import {Encryption} from "../../config";
import jwt, {AuthorizedRequest} from "../../util/jwt";
import {Database, UserObject} from "../../util/db/DatabaseHandler";
import {ObjectID} from "bson";
import {Cursor} from "mongodb";

const router = express.Router();

class UserRouting {

    updateUser(req: LoginBody, results: UserObject) {
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
    }

    defaultRoute = (req:AuthorizedRequest, res, next) => {
        console.log(req)
        res.json({
            decoded: req.decoded
        })
    };

    loginRoute = async (req: LoginBody, res, next) => {
        //let errors = []
        const {db, params, body} = req;
        const {email, password, pin, autologin} = body;
        let authkey, _id;
        if (params.authkey) {
            let proceed = true;
            authkey = await jwt.verify(params.authkey).catch(err => {
                console.log(err)
            });
            if (authkey) {
                _id = ObjectID.createFromHexString(authkey._id);
                //console.log(authkey)
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

        await db.openCollection("moderators");
        const query = db.find(queryParams).limit(1) as Cursor;
        const count = await query.count();

        //console.log(count, query)
        if (authkey) {
            // console.log(count, query)
            if (count) {
                const results = await query.next() as UserObject;

                const token = jwt.sign({_id, autologin: authkey.autologin }, authkey.autologin ? "14d" : undefined);
                res.json({token, email: results.email});
                this.updateUser(req, results);
                return;

            }
        } else {
            if (email) {
                if (password) {
                    if (count > 0) {
                        const results = await query.next() as UserObject;
                        let {passwordhash, _id} = results;
                        if (bcrypt.compareSync(password, passwordhash)) {
                            const token = jwt.sign({_id, autologin}, autologin ? "14d" : undefined);
                            res.json({token, email});
                            this.updateUser(req, results);
                            return;
                        }
                    }
                } else if (pin) {
                    if (count > 0) {
                        const results = await query.next() as UserObject;
                        let {_id} = results;
                        if (bcrypt.compareSync(pin, results.pin)) {
                            const token = jwt.sign({_id, autologin}, autologin ? "14d" : undefined)
                            res.json({token, email});
                            this.updateUser(req, results);
                            return;
                        }
                    }
                }
            }
        }
        res.sendStatus(500);
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
                const token = jwt.sign({ _id: complete.insertedId }, autologin ? "14d" : undefined);
                res.json({token, email});
                return;
            }
        }

        res.sendStatus(500);
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