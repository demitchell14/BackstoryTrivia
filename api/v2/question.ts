
import * as express from "express";
import {Request} from "express";
import * as graphqlHTTP from "express-graphql";
import jwt, {AuthorizedRequest} from "../../util/jwt";
import {Middleware, Mongo} from "../../middleware/Mongo";
import {Question} from "notrivia";
import {Database, QuestionObject} from "../../util/db/DatabaseHandler";
import {ObjectID} from "bson";
import {Mongoose} from "mongoose";
import {Questions as QuestionsDB} from "../../middleware/models/QuestionSchema";

const router = express.Router();

class QuestionRoute implements QuestionRoute{
    index = async (req:RequestTypes.Index, res, next) => {
        res.sendStatus(200);
    }


    add = async (req:RequestTypes.Insert, res, next) => {
        const {question, timeLimit, points, answer, choices, type, questionDetails, questionImage, category} = req.body;
        if (question && type && (answer || choices)) {
            const {decoded, db} = req;
            const questionObj = new Question(req.body);


            let insertable = {
                question, timeLimit, points, answer, choices, type, questionDetails, questionImage,
                category: category.split(",").map(c => c.trim().toLowerCase()),
                _creator: ObjectID.createFromHexString(decoded._id),
            }

            await db.openCollection("questions");
            const response = await db.insert(insertable)
            res.status(201).json({questionObj, decoded, response});
            return;
        }
        res.status(500).json({error: "Missing important information"})
    }

    list_mongoosetest = async (req:RequestTypes.List, res, next) => {
        const {query, decoded} = req;
        const {limit, full, category} = query;
        const _creator = ObjectID.createFromHexString(decoded._id);
        const response = {} as any;
        response.filters = {};
        const dbResponse = QuestionsDB.find({_creator});

        if (limit) {
            // query.limit(Number.parseInt(limit + ""));
            response.filters.push({filter: "limit", value: limit})
        }
        if (category) {
            const a = category;
            // query.filter({category: {$in: [a]}})
            response.filters.push({filter: "category", value: category});
        }

        console.log()
        res.send(200);
    }

    list = async(req:RequestTypes.List, res, next) => {
        const {db, decoded} = req;
        const requestQuery = req.query;
        const _creator = ObjectID.createFromHexString(decoded._id);
        await db.openCollection("questions");
        const query = db.find({_creator});
        const response = {} as any;
        response.filters = [];
        if (requestQuery.limit) {
            query.limit(Number.parseInt(requestQuery.limit + ""));
            response.filters.push({filter: "limit", value: requestQuery.limit});
        }
        if (requestQuery.category) {
            const a = requestQuery.category;
            query.filter({category: {$in: [a]}})
            response.filters.push({filter: "category", value: requestQuery.category});
        }


        if (await query.count() > 0) {
            const questions = await query.toArray() as QuestionObject[];
            questions.map(q => delete q._creator);

            if (typeof requestQuery.full === "undefined") {
                questions.map(q => {
                    delete q._id;
                    delete q.questionDetails;
                    delete q.questionImage;
                    delete q.type;
                    delete q.timeLimit;
                    if (q.choices) {
                        const tmp = q.choices.find(a => a.correct);
                        q.answer = tmp ? tmp.answer : q.answer;
                    }
                    delete q.choices;
                    delete q.category;
                    delete q.points;
                })
            }

            response.questions = questions;
            res.status(200);
        } else {
            response.questions = [];
        }

        res.json(response);
    }

    private loadUser = async (db:Database, id:string) => {
        await db.openCollection("moderators");
        const _id = ObjectID.createFromHexString(id)
        const query = db.find({_id});
        if (await query.count() === 1) {
            return query.next();
        }
        return await query.count();
    }
}

declare namespace RequestTypes {
    interface Index extends AuthorizedRequest, Middleware.Mongo {

    }
    interface Insert extends AuthorizedRequest, Middleware.Mongo {
        body: Question & {
            category?: string;
        };
    }
    interface List extends AuthorizedRequest, Middleware.Mongo {
        query: {
            limit?: number;
            category?: string;
            full?:any;
        }
    }
}

const routes = new QuestionRoute();

router.get("/", jwt.authorized, Mongo(), routes.index);
router.post("/insert", jwt.authorized, Mongo(), routes.add);
router.get("/list", jwt.authorized, Mongo(), routes.list);

export default router;