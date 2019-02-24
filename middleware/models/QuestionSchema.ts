import * as mongoose from "mongoose";
import {Model} from "mongoose";
import {ObjectID} from "bson";

const QuestionSchema = new mongoose.Schema({
   question: {
       type: String,
       required: true,
   },
    timeLimit: {
       type: Number,
        default: 30,
        max: 120,
        min: 0,
    },
    points: {
        type: Number,
        default: 1,
    },
    answer: {
       type: String, required: (def, opt) => {
           console.log(def, opt);
           return true
        }
    },
    type: {
       type: String,
        required: true,
    },
    questionDetails: {
       type: String,
    },
    questionImage: {
       type: String,
    },
    category: {
       type: Array,
    },
    _creator: {
       type: ObjectID
    },
    _id: {
       type: ObjectID
    }
});

export const Questions = mongoose.model('questions', QuestionSchema, "questions") // as Model<Questions>;
// export const Moderators = mongoose.model('moderators', QuestionScema, "moderators")// as Model<Moderators>;

export interface Questions {
    _id: ObjectID;
    _creator: ObjectID;
    timeLimit: number;
    question: string;
    points: number;
    answer: string;
    type: string;
    questionImage?: string;
    questionDetails?: string;
    category: string[];
}

export default {
    Questions
};