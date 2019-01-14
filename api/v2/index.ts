
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
//import schema from "./SpaceXSchemaDemo";

import user from "./user";
import team from "./team";
import question from "./question";
//import {A} from "./UserSchema.mongoose";
const router = express.Router();

router.use('/user', user);
router.use('/team', team);
router.use('/question', question);


//router.use('/graphql', graphqlHTTP({
//    schema,
//    graphiql: true
//}));


export default router;