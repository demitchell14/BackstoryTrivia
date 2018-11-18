import {MiddlewareReq} from "./trivia";
import {info} from "../util/logger";
import {Database, SessionObject, UserObject} from "./DatabaseHandler";
import {Encryption} from "../config";
import * as bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";


import {Cursor, FilterQuery} from "mongodb";

const UserProps = {
    _id: "",
    name: "Devin Mitchell",
    email: "demitchell14@gmail.com",
    authorization: "I'm a fake authorization token, lol",
    games: [ "game123" ],

    address: "123 Main St.",
    passwordHash: "todo...",
    lastAuth: "todo..."
};


class Authorization {
    key:string;
    authorized:boolean;
    private rawUser?:UserObject;
    error?:Array<string>;
    public constructor(req:MiddlewareReq) {
        this.key = req.headers.authorized || req.body.authorized;
        this.authorized = false;
        //this.rawUser = {};
        this.error = [];

        if (this.key) {
            info(`Connection Pending... ${this.key}`);
        }

        if (this.authorized)
            info(`Authorized connection to '${req.url}'`);

    }

    public user() {
        if (this.rawUser) {
            const {name, email, games, session} = this.rawUser;
            //TODO add token expiration and token replacement
            return {name, email, games, session, _isAuthorized: true};
        }
        return {error: "authorization failed"};
    }

    public async login(user:LoginParams) {
        let firstTime = false;
        const queryParams = {
            email: user.email,
        } as FilterQuery<UserObject>;
        const db = new Database();
        await db.openCollection("users");
        const query = db.find(queryParams) as Cursor<UserObject>;
        const results = await query.toArray() as Array<UserObject>;
        let hash:any;
        if (results.length > 0) {
            let u = results[0];
            if (!u.passwordhash.match(Encryption.pattern)) {
                if (u.passwordhash === user.password) {
                    firstTime = true;
                    hash = await bcrypt.hash(user.password, Encryption.saltRounts);
                } else {
                    hash = false;
                }
            } else {
                hash = await bcrypt.compare(user.password, u.passwordhash);
            }

            if (firstTime) {
                await db.update(query, {
                    $set: {passwordhash: hash}
                });
                this.error = ["First time login successful.", "Please resubmit the form to continue."]
            } else {
                if (hash) {
                    const newSessionToken = uuid();
                    const newUserToken = uuid();

                    const authorization = u.authorization;
                    authorization.unshift(newUserToken);
                    await db.update(queryParams, {
                        $set: {authorization: authorization}
                    });

                    await db.openCollection("sessions");
                    await db.insert({
                        userToken: newUserToken,
                        sessionToken: newSessionToken,
                        expiration: 0
                    });

                    u.session = newSessionToken;
                    this.rawUser = u;

                } else {
                    this.error = ["Invalid email or password."];
                }
                this.authorized = hash;
            }

        } else {
            this.error = ["Invalid email or password."];
            this.authorized = false;
            delete this.rawUser;
        }
        db.close();
        return this;
    }

    public async session(opts?:SessionParams) {
        let queryParams = {} as any;
        if (opts) {
            queryParams.sessionToken = opts.authorized
        } else {
            if (this.key)
                queryParams.sessionToken = this.key
            else
                return this;
        }
        //console.log(queryParams, opts)
        const db = new Database();
        await db.openCollection("sessions");
        const query = db.find(queryParams) as Cursor<SessionObject>;
        const results = await query.toArray() as Array<SessionObject>;
        if (results.length > 0) {
            const session = results[0];
            const isExpired = false;

            await db.openCollection("users");
            const target = session.userToken;
            const userResults = await db.find({
                authorization: {$in: [target]}
            }) as Cursor<UserObject>;
            const found = await userResults.toArray() as Array<UserObject>;

            if (found.length > 0) {
                if (isExpired) {
                    // -- TODO add expiration checking

                    const newSession = uuid();
                    const newUserToken = uuid();
                    const {authorization, _id} = found[0];
                    authorization.unshift(newUserToken);
                    if (authorization.length > 15) {
                        authorization.pop()
                    }

                    const updateUsers = async () => {
                        await db.openCollection("users");
                        await db.update({_id: _id}, {
                            $set: {authorization: authorization}
                        });
                    }
                    const updateSessions = async () => {
                        await db.openCollection("sessions");
                        await db.insert({
                            sessionToken: newSession,
                            userToken: newUserToken,
                            expiration: 0
                        })
                        //await
                    };

                    //await updateUsers();
                    //await updateSessions();
                } else {
                        this.rawUser = found[0];
                        this.authorized = true;
                }
            } else {
                this.error = ["Invalid token 2"];
                this.authorized = false;
                delete this.rawUser;
            }
        } else {
            this.error = ["Invalid token"];
            this.authorized = false;
            delete this.rawUser;
        }
        return this;
    }
}

interface LoginParams {
    email:string;
    password:string;
}
interface SessionParams {
    email:string;
    authorized:string;
}

export default Authorization;