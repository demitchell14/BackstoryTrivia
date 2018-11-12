import * as express from "express";
import * as _ from "lodash";
import * as path from "path";

const router = express.Router();


//@ts-ignore
router.get(/^((?!\/api|\/static|\/images|\/*\.(json|ico|js)).*)$/, async function(req , res, next) {
    res.sendFile(path.join(process.cwd(), "./react/build/index.html"));
});



export default router;