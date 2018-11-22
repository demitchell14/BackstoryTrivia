import * as uuidv1 from "uuid/v1";
import * as express from "express";
import * as _ from "lodash";
import * as debug from "debug";
const log = debug("user");

import {MiddlewareReq} from "../../www/trivia";


const router = express.Router();




router.post("/authorize", async function(req:MiddlewareReq, res, next) {
    const {email, authorized, password} =
        req.body as {email?:string, authorized?:string, password?:string};

    if (email && (password || authorized)) {
        const user = req.trivia.user;
        // -- ***** ---------
        // -- This assumes we found a use with the email correct email
        // -- TODO add database search algorithm above
        // -- ***** ---------

        if (password) {

            await user.login(req.body);
            if (user.authorized) {
                res.json(user.user());
            } else {
                res.status(403).json({error: user.error})
            }

        }
        else if (authorized) {

            await user.session(req.body)
            if (user.authorized) {
                res.json(user.user());
            } else {
                res.status(403).json({error: user.error});
            }
        }

    } else {
        // error
        res.sendStatus(400);
    }

});


const UserProps = {
    name: "Devin Mitchell",
    email: "demitchell14@gmail.com",
    authorization: "I'm a fake authorization token, lol",
    games: [ "game123" ],

    address: "123 Main St.",
    passwordHash: "todo...",
    lastAuth: "todo..."
}

export default router;