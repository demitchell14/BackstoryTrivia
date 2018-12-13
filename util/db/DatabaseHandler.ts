import * as mongo from "mongodb";
import {MongoDetails} from "../../config"
import {Collection, Cursor, FilterQuery, MongoClient, ObjectID, UpdateQuery} from "mongodb";
import {GameOptions} from "../../trivia/game/Game";
import {FindAndModifyWriteOpResultObject} from "mongodb";
import {User} from "../../react/src/store/session";

export class Database {

    readonly client:Promise<MongoClient>;
    private collection:Collection;
    private _collection:string;
    private autoTimeout:any;
    private timeout:number;
    public constructor(opts?:any) {
        this.client = mongo.MongoClient.connect(url(), {
            useNewUrlParser: true
        });
        this.timeout = 5 * 1000; // 60 seconds
        this.resetTimeout();
    }
    public async openCollection(collection:string) {
        this.resetTimeout();
        const client = await this.client;

        this.collection = client.db(MongoDetails.db).collection(collection)
        this._collection = collection;
        return this;
    }

    public find(query:FilterQuery<Object>): Cursor<Object>;
    public find(query:FilterQuery<Object>, update?:UpdateQuery<Object>): Promise<FindAndModifyWriteOpResultObject<Object>>;
    public find(query:FilterQuery<Object>, update?:UpdateQuery<Object>) {
        this.resetTimeout();
        const col = this.collection;
        //col.find({email: { $}})
        if (update) {
            return col.findOneAndUpdate(query, update);
        }
        return col.find(query);
    }

    public async update(query:FilterQuery<UserObject|TeamObject|SessionObject|GameOptions>, update:UpdateQuery<UserObject|TeamObject|SessionObject|GameOptions>) {
        this.resetTimeout();
        const col = this.collection;


        return await col.updateOne(query, update)
    }

    public async insert(query:Partial<UserObject|SessionObject|TeamObject>) {
        this.resetTimeout();
        const col = this.collection;
        let base;
        switch (this._collection) {
            case "sessions":
                base = {
                    sessionToken: "",
                    expiration: 0,
                    userToken: ""
                };
                break;
            default:
                base = {};
        }

        return col.insertOne(Object.assign(base, query));
    }

    public close() {
        clearTimeout(this.autoTimeout);
        this.client.then(c => c.close());
    }

    private resetTimeout() {
        clearTimeout(this.autoTimeout);
        this.autoTimeout = setTimeout(() => {
            this.close();
        }, this.timeout)
    }
}

export interface UserObject {
    _id: ObjectID;
    name: string;
    email: string;
    authorization: Array<string>,
    games: Array<string>,
    address: string;
    passwordhash: string;
    lastAuth: string;
    session?:string;

    //V2
    pin?: string;
    savedUIDs?:Array<string>;
}

export interface TeamObject {
    _id: ObjectID;
    teamName: string;
    email: string;
    hashedPassword: string;
    hashedPin: string;
    savedUIDs: Array<string>;

    image?: string;
    players?: Array<string>;

    //autologin?: boolean;
}

export interface SessionObject {
    _id:ObjectID;
    sessionToken:string;
    expiration:number;
    userToken:string;
}

export interface GameParams {
    _id: ObjectID;
    token: string;
}


const url = () => {
    const {baseurl, password, username, db} = MongoDetails
    return `mongodb://${username}:${password}@${baseurl}/${db}`
}
