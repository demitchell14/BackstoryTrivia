
export function log(...msg) {
    if (!(process.env.NODE_ENV && process.env.NODE_ENV.trim() === "production")) {
        console.log(msg);
    }
}

export function info(...msg) {
    if (!(process.env.NODE_ENV && process.env.NODE_ENV.trim() === "production")) {
        console.info( msg);
    }
}

export function error(...msg) {
    console.error( msg)
}
