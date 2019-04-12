import {ncp} from "ncp";
import * as path from "path";
import * as fs from "fs";
import * as rm from "rimraf";
import {promisify} from "util"
import {filter} from "minimatch";

const pkg = require("../package.json");

const copy = promisify(ncp);

const copyFile = (file:string, output:string) => {
    if (fs.existsSync(file)) {
        ncp(file, output, (err:Error) => {
            if (err) {
                console.error(err);
            }
        })
    }
    return file;
}

(async () => {
    const build = pkg.build;
    console.log(build);
    let output = build.output;
    if (typeof output === "undefined") {
        throw Error("Output location is required");
    }
    output = path.join(process.cwd(), output);
    if (fs.existsSync(output)) {
        rm.sync(output)
    }
    fs.mkdirSync(output);

    if (typeof build.packageJson === "string") {
        if (fs.existsSync(path.join(process.cwd(), build.packageJson))) {
            copyFile(
                path.join(process.cwd(), build.packageJson),
                path.join(output, 'package.json')
            )
        }
    }

    if (build.include) {
        build.include.map((file:string) => path.join(process.cwd(), file))
            .map((file:string) => copyFile(file, path.join(output, path.basename(file))))
    }

    if (build.directories) {
        Object.keys(build.directories).map(key => {
            const directory = build.directories[key];
            console.log(directory);
            fs.mkdirSync(path.join(output, key));
            const outputDir = path.join(output, key);
            const targetDir = path.join(process.cwd(), directory.path);
            const files = fs.readdirSync(targetDir);
            let filteredFiles = [];

            if (directory.exclude) {
                files.map(f => {
                    let allow = true;
                    directory.exclude.map((regex:string) => {
                        if (regex.charAt(0) === "/" && regex.charAt(regex.length-1) === "/") {
                            // TODO Regex
                            if (f.match(regex.substr(1, regex.length-2)) && allow === true) {
                                allow = false
                            }
                        } else {
                            if (f === regex && allow === true) {
                                allow = false;
                            }
                        }
                    })
                    if (allow) {
                        ncp(
                            path.join(targetDir, f),
                            path.join(outputDir, f),
                            (err:Error) => {
                                if (err)
                                    console.error(err);
                            }
                        )
                    }
                })
            }
        })
    }
})();