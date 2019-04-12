
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
//import schema from "./SpaceXSchemaDemo";

import user from "./user";
import team from "./team";
import question from "./question";
import games from "./games";
import play from "./play";
import {Database, GameObject, TeamObject, UserObject} from "../../util/db/DatabaseHandler";
import {AuthorizedToken} from "../../util/jwt";
import {ObjectID} from "bson";
import {Cursor, UpdateQuery} from "mongodb";
import {Game} from "../../notrivia";
import * as rand from "seedrandom";
//import {A} from "./UserSchema.mongoose";
const router = express.Router();

router.use('/user', user);
router.use('/team', team);
router.use('/question', question);
router.use('/games', games);
router.use('/play', play);

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
        // delete user._id;
        return user;
    }
    return undefined;
}

export async function updateUser(db:Database, jwt:AuthorizedToken, data:UpdateQuery<UserObject|TeamObject>) {
    await db.openCollection(jwt.type + "s");
    const success = await db.update({_id: typeof jwt._id === "string" ? ObjectID.createFromHexString(jwt._id) : jwt._id}, data);
    if (success.modifiedCount === 1)
        return success;
    return false;
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

export function generateGameState(game:Game) {
    const state = {} as any;
    state.name = game.name;
    state.started = game.started;
    state.paused = game.paused;

    state.teams = game.teams.map(team => ({
        name: team.name,
        answered: game.started ? team.answers.length : undefined, // lists all answered questions
        // correct: team.answers.filter(ans => ans.correct === true) // lists correct answers
    }));

    if (game.started) {

        const current = game.question().current();
        if (current) {
            state.questionId = current._id;

            if (game.paused === false) {
                // game is running
                state.question = {
                    started: current.started,
                    question: current.question,
                    image: current.questionImage || "",
                    description: current.questionDetails || "",
                    type: current.type,
                    choices: current.type === "Multiple Choice" ?
                        current.choices.map(choice => choice.answer)
                        : undefined,
                    points: current.points,
                    time: {
                        limit: current.timeLimit,
                        left: current.timeLeft,
                    },
                }
            }
        }

    }

    return state;
}

export function shuffle(array:any[], seed:string) {
    const r = rand.alea(seed);
    r.double();
    // console.log(r, r.double());
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(r.double() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function shuffle2(array:any[], seed:string) {
    const r = rand.alea(seed);
    array = Object.assign({}, array);
    var i = array.length, j, temp;
    if ( i == 0 ) return array;
    while ( --i ) {
        j = Math.floor( r.double() * ( i + 1 ) );
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}