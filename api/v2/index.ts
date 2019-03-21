
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
//import schema from "./SpaceXSchemaDemo";

import user from "./user";
import team from "./team";
import question from "./question";
import games from "./games";
import {Database, GameObject, TeamObject, UserObject} from "../../util/db/DatabaseHandler";
import {AuthorizedToken} from "../../util/jwt";
import {ObjectID} from "bson";
import {Cursor} from "mongodb";
//import {A} from "./UserSchema.mongoose";
const router = express.Router();

router.use('/user', user);
router.use('/team', team);
router.use('/question', question);
router.use('/games', games);

export default router;

export async function getUser(db:Database, jwt:AuthorizedToken):Promise<Partial<UserObject>|TeamObject>;
export async function getUser(db:Database, jwt:AuthorizedToken) {

    await db.openCollection(jwt.type + "s");
    const file = await db.find({_id: ObjectID.createFromHexString(jwt._id)})
    if (await file.count() === 1) {
        const user = (await file.toArray())[0] as UserObject;
        delete user.passwordhash;
        delete user.pin;
        delete user.savedUIDs;
        delete user._id;
        return user;
    }
    return undefined;
}

export async function getGame(db:Database, token:string) {
    await db.openCollection("games");
    let cursor:Cursor<Object>;
    if (ObjectID.isValid(token)) {
        cursor = await db.find({_id: ObjectID.createFromHexString(token)})
    } else {
        cursor = await db.find({token});
    }

    if (await cursor.count() === 1) {
        const game = await cursor.next() as GameObject;
        return game;
    }
    return undefined;
}