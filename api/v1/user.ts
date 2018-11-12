import * as uuidv1 from "uuid/v1";
import * as express from "express";
import * as _ from "lodash";
import {MiddlewareReq} from "../../www/trivia";


const router = express.Router();




router.post("/authorize", async function(req:MiddlewareReq, res, next) {
    const {email, authorized, password} =
        req.body as {email?:string, authorized?:string, password?:string};

    if (email && (password || authorized)) {

        // -- ***** ---------
        // -- This assumes we found a use with the email correct email
        // -- TODO add database search algorithm above
        // -- ***** ---------

        if (password) {
            res.sendStatus(504);


        }
        else if (authorized) {

            if (req.trivia.user)
                res.json(req.trivia.user.user());
            else
                res.sendStatus(403);



        }
    } else {
        // error
        res.sendStatus(403);
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