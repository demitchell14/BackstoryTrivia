
import * as express from "express";
import {Request} from "express";
import * as graphqlHTTP from "express-graphql";
import jwt, {AuthorizedRequest} from "../../util/jwt";
import {Middleware, Mongo} from "../../middleware/Mongo";
import {Question} from "../../notrivia";
import {Database, QuestionObject} from "../../util/db/DatabaseHandler";
import {ObjectID} from "bson";
import {Mongoose} from "mongoose";
import {Questions, Questions as QuestionsDB} from "../../middleware/models/QuestionSchema";
import * as _ from "lodash";

const router = express.Router();

class QuestionRoute implements QuestionRoute{
    index = async (req:RequestTypes.Index, res, next) => {
        res.sendStatus(200);
    }


    add = async (req:RequestTypes.Insert, res, next) => {
        const {question, timeLimit, points, answer, choices, type, questionDetails, questionImage, category} = req.body;
        if (question && type && (answer || choices)) {
            const {decoded, db} = req;
            const _creator = ObjectID.createFromHexString(decoded._id);
            const questionObj = new Question(req.body);


            let insertable = {
                question, timeLimit, points, answer, choices, type, questionDetails, questionImage,
                // @ts-ignore
                category: category instanceof Array ? category : category ? category.split(",").map(c => c.trim().toLowerCase()) : [],
                _creator,
            }

            await db.openCollection("questions");
            const response = await db.insert(insertable)
            res.status(201).json({questionObj, decoded, response});
            return;
        }
        res.status(500).json({error: "Missing important information"})
    }

    update = async (req:RequestTypes.Update, res) => {
        const {db, decoded} = req;
        const _creator = ObjectID.createFromHexString(decoded._id);
        const _id = req.body._id ? ObjectID.createFromHexString(req.body._id) : undefined;
        if (_id) {
            const response = {} as any;
            const qDoc = await db.openCollection("questions");
            const cursor = qDoc.find({_id, _creator});
            const question = await cursor.next() as Questions;
            if (question) {
                const filtered = Object.keys(req.body).filter(k => !_.isEqual(req.body[k], question[k]));

                response.filtered = {} as any;
                filtered.map(f => {
                    response.filtered[f] = req.body[f];
                });


                delete response.filtered._id;
                delete response.filtered._creator;
                if (Object.keys(response.filtered).length > 0) {
                    console.log(response.filtered);
                    console.log(question);
                    const update = await qDoc.update({_id, _creator}, {$set: response.filtered});

                    console.log(update);
                }
                //console.log(response.filtered);
            }





            res.json(response);
        } else {
            res.status(404).json({error: "No question index sent"});
        }
    }

    delete = async (req:RequestTypes.Delete, res) => {
        const {db, body, decoded} = req;
        const _creator = ObjectID.createFromHexString(decoded._id);
        if (body.target) {
            const _id = ObjectID.createFromHexString(body.target);
            await db.openCollection("questions");
            const exists = await db.find({_id, _creator});
            if (await exists.count() === 1) {
                const deleted = await db.delete({_id, _creator});
                res.json(deleted);
                db.close();
            } else {
                res.status(404).json({error: "Question does not exist"});
            }
        } else {
            res.status(404).json({error: "A target is required to delete"});
        }
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
    interface Update extends AuthorizedRequest, Middleware.Mongo {
        body: Question & {
            category?: string;
            _id: string;
        };
    }
    interface List extends AuthorizedRequest, Middleware.Mongo {
        query: {
            limit?: number;
            category?: string;
            full?:any;
        }
    }
    interface Delete extends AuthorizedRequest, Middleware.Mongo {
        body: {
            target: string;
        }
    }
}

const routes = new QuestionRoute();

router.get("/", jwt.authorized, Mongo(), routes.index);

router.put("/", jwt.authorized, Mongo(), routes.update);
router.post("/", jwt.authorized, Mongo(), routes.add);
router.delete("/", jwt.authorized, Mongo(), routes.delete);


router.get("/list", jwt.authorized, Mongo(), routes.list);

export default router;