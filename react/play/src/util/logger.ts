import * as process from "process";
export default {
    log(...args:any) {

        if (process.env.mode === "development")
            console.log.apply(null, args);
    },
    debug(...args:any) {
        if (process.env.mode === "development")
            console.debug.apply(null, args);
    },
    error(...args:any) {
        if (process.env.mode === "development")
            console.error.apply(null, args);
    },
    info(...args:any) {
        if (process.env.mode === "development")
            console.info.apply(null, args);
    },
}