import * as express from "express";
import * as _ from "lodash";
import {Request} from "express";
import * as bcrypt from "bcrypt";
import {Middleware, Mongo} from "../../middleware/Mongo";
import {Encryption} from "../../config";
import jwt, {AuthorizedRequest, AuthorizedToken} from "../../util/jwt";
import {Database, TeamObject} from "../../util/db/DatabaseHandler";
import {ObjectID} from "bson";
import {Cursor} from "mongodb";

const router = express.Router();

class TeamRouting {

    updateUser(req: LoginBody|ModifyBody, results: TeamObject) {
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

    index =(req:AuthorizedRequest, res, next) => {
        res.json({decoded: req.decoded});
    }

    register = async (req: RegisterBody, res, next) => {
        const db = req.db;
        const {email, teamName, password, pin, players, image, autologin} = req.body;
        delete req.body.autologin;
        await db.openCollection("teams");
        let exists = db.find({ $or: [ { email }, { teamName }] }) as Cursor;
        const count = await exists.count();

        //res.send(200);
        //return;
        if (count === 0) {
            const complete = await db.insert({
                email, teamName, image, players,
                hashedPassword: bcrypt.hashSync(password, Encryption.saltRounts),
                hashedPin: bcrypt.hashSync(pin, Encryption.saltRounts)
            });

            if (complete.insertedCount > 0) {
                const token = jwt.sign({ _id: complete.insertedId }, autologin ? "14d" : undefined);
                res.json({token, email});
                return;
            }
        }

        res.sendStatus(500);
    }

    login = async (req: LoginBody, res, next) => {
        //let errors = []
        const {db, params, body} = req;
        const {email, password, pin, autologin} = body;
        let authkey, _id;
        if (params.authkey) {
            authkey = await jwt.verify(params.authkey);
            _id = ObjectID.createFromHexString(authkey._id);
            console.log(authkey)
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

        await db.openCollection("teams");
        const query = db.find(queryParams).limit(1) as Cursor;
        const count = await query.count();


        if (authkey) {
            // console.log(count, query)
            if (count) {
                const results = await query.next() as TeamObject;

                const token = jwt.sign({_id, autologin: typeof authkey.autologin === "boolean" ? authkey.autologin : authkey }, autologin ? "14d" : undefined);
                res.json({token, email: results.email});
                this.updateUser(req, results);
                return;

            }
        } else {
            if (email) {
                if (password) {
                    if (count > 0) {
                        const results = await query.next() as TeamObject;

                        let {hashedPassword, _id} = results;
                        if (bcrypt.compareSync(password, hashedPassword)) {
                            const token = jwt.sign({_id, autologin}, autologin ? "14d" : undefined);
                            res.json({token, email});
                            this.updateUser(req, results);
                            return;
                        }
                    }
                } else if (pin) {
                    if (count > 0) {
                        const results = await query.next() as TeamObject;
                        let {_id} = results;
                        if (bcrypt.compareSync(pin, results.hashedPin)) {
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

    modify = async(req: ModifyBody, res, next) => {
        const {decoded, db, body} = req;
        const {_id} = decoded as AuthorizedToken;
        if (body instanceof Array) {
            const queryStatement = {_id: ObjectID.createFromHexString(_id)};
            await db.openCollection("teams");
            const query = db.find(queryStatement) as Cursor;
            const exists = await query.count();

            if (exists) {
                const _data = await query.next() as TeamObject;
                let data = {} as Partial<TeamObject>;

                body.map(upd => {
                    if (upd.key === "pin" || upd.key === "password") {
                        upd.value = bcrypt.hashSync(upd.value, Encryption.saltRounts);
                        upd.key = `hashed${upd.key.charAt(0).toUpperCase()}${upd.key.substr(1)}`
                    }
                    data[upd.key] = upd.value;
                });

                let response = await db.update(queryStatement, {$set: data});
                console.log(response);
                if (response.matchedCount) {
                    if (response.modifiedCount > 0) {
                        res.sendStatus(200)
                    } else {
                        res.sendStatus(400);
                    }
                } else {
                    res.sendStatus(401);
                }
                return;
            } else {
                // -- Account doesn't exist in database. Cannot edit
                res.sendStatus(500);
                return;
            }
        }

        res.sendStatus(500);
    }

    remove = async (req: RemoveBody, res, next) => {

        res.sendStatus(100);
    }
}

interface RemoveBody extends Middleware.Mongo, AuthorizedRequest {
    body: {
        target?: string;
    }
}

interface ModifyBody extends Middleware.Mongo, AuthorizedRequest {
    body: Array<{
        key: string,
        value: string;
    }>;
}

interface LoginBody extends Middleware.Mongo {
    body: {
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
    body: TeamObject & {
        password: string;
        pin: string;
        autologin?: boolean;
    }
}

const routing = new TeamRouting();

router.get("/", jwt.authorized, routing.index);

router.post("/register", Mongo(), routing.register);

router.post(["/login", "/login/:authkey"], Mongo(), routing.login);

router.post("/edit", jwt.authorized, Mongo(), routing.modify);

router.delete("/remove", jwt.authorized, Mongo(), routing.remove);

export default router;