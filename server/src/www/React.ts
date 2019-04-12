import * as path from "path";
import * as express from "express";
import {Request, Response} from "express";

const router = express.Router();

router.get(/^((?!\/(api|static|images)|.*\.(js|css|ico|json)).*)$/, async function(req:Request , res:Response, next) {

    if (process.env.PUBLIC_DIR && process.env.PLAY_DIR) {
        if (req.headers.host.match(/^admin\./)) {
            res.sendFile(path.join(process.cwd(), `../${process.env.PUBLIC_DIR}/build/index.html`));
        } else {
            res.sendFile(path.join(process.cwd(), `../${process.env.PLAY_DIR}/build/index.html`));
        }
    } else {
        res.status(500).send("Use the React Development URL!");
    }
});

export default router;