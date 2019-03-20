import * as express from "express";
import * as _ from "lodash";
import * as path from "path";
import app from "../app";

const router = express.Router();


//@ts-ignore
router.get(/^((?!\/api|\/static|\/images|\/*\.(json|ico|js)).*)$/, async function(req , res, next) {

    console.log(req)
    if (process.env.PUBLIC_DIR && process.env.PLAY_DIR) {
        if (req.headers.host.match(/^play\./)) {
            res.sendFile(path.join(process.cwd(), `./${process.env.PLAY_DIR}/build/index.html`));
        } else {
            res.sendFile(path.join(process.cwd(), `./${process.env.PUBLIC_DIR}/build/index.html`));
        }
    } else {
        res.send("OK");
    }
});



export default router;