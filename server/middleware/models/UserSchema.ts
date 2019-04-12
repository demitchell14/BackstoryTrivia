import * as mongoose from "mongoose";
import {Model} from "mongoose";
import {ObjectID} from "bson";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordhash: {
        type: String,
        required: true,
    },
    pin: {
        type: String,
        required: true,
    },
    savedUIDs: {
        type: Array,

    },
    games: {
        type: Array,
    }
});

export const Moderators = mongoose.model('moderators', UserSchema, "moderators")// as Model<Moderators>;

export interface Moderators {
    _id: ObjectID;
    email: string;
    name?: string;
    passwordhash: string;
    pin: string;
    savedUIDs: string[];
    games: string[];
}

export default {
    Moderators
};