import * as express from "express";
import * as _ from "lodash";
import * as path from "path";

const router = express.Router();


//@ts-ignore
router.get(/^((?!\/api|\/static|\/images|\/*\.(json|ico|js)).*)$/, async function(req , res, next) {
    if (process.env.PUBLIC_DIR) {
        res.sendFile(path.join(process.cwd(), `./${process.env.PUBLIC_DIR}/build/index.html`));
    } else {
        res.send("OK");
    }
});



export default router;