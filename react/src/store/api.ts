import {RegisterTeam, RegistrationOptions} from "./register";
import {Session} from "./session";

let session:Session;
export function Api(opts?:any) {
    if (typeof session === "undefined") {
        session = new Session();
    }
    let timers = [] as any;
    return {

        register: async function(mode:string, opts:RegistrationOptions) {
            if (mode === "team")
                return RegisterTeam(opts);
            else {
                // -- TODO register games here
                //return RegisterGame(opts);
                return undefined;
            }
        },

        session: session,

        resetSession: function() {
            session = new Session();
        },

        get: async function(opts:string|GetOpts) {
            let target = typeof opts === "string" ? opts : opts.target;
            if (target) {
                switch (target.toUpperCase()) {
                    case "GAMES":
                        return await getGameList();

                    case "QUESTION":
                        if (typeof opts !== "string")
                            return await getGame(opts)
                        else return Error("Question requires authorization");
                    default:
                        throw Error("Unknown target");

                }
            } else {
                throw Error("Unkonwn target");
            }
        },

        games: async function() {
            return await this.get("games");
        },

        authorize: async function() {
            if (session) {
                let gameID  = session.gameKey();
                let teamKey = session.teamKey();

                let fetched = await fetch(`/api/v1/game/authorize`, {
                    method: "OPTIONS",
                    headers: {
                        token: teamKey,
                        game: gameID,
                    }
                });

                if (fetched.status === 200) {
                    let newKey = await fetched.text();
                    return session.authorized(newKey);
                } else {
                    return await fetched.text();
                }
            } else {
                throw new Error("Session not found");
            }
        },

        interval: function(refresh:number, callback:any) {
            if (typeof callback === "function") {
                let id = setInterval(callback, refresh);
                timers.push(id);
                return id;
            } else {
                console.log("Timer stopped");
                return clearInterval(callback);
            }
        },

        timeout: function(refresh:number, callback:any) {
            if (typeof callback === "function") {
                let id = setTimeout(callback, refresh);
                timers.push(id);
                return id;
            } else {
                console.log("Timeout stopped.");
                return clearTimeout(callback);
            }
        }


    }
}

interface GetOpts {
    token:string;
    auth:string;
    target?:string;
}

const getGame = async function(opts:GetOpts) {
    let {token, auth} = opts;
    let call = await fetch(`/api/v1/game${opts.target ? ("/" + opts.target.toLowerCase()) : ""}`, {
        method: "GET",
        headers: {
            token: auth,
            game: token,
        }
    });

    if (call.status !== 200) throw Error(call.statusText);

    return await call.json();
}

const getGameList = async function() {
    //console.log(data);
    let call = await fetch("/api/v1/gamelist", {

    });

    if (call.status !== 200) throw new Error(call.statusText);

    //console.log(call);
    return await call.json();
};

export interface FetchQuestionResponse {
    question?: QuestionResponseBody;
    error?: any;
}
export interface QuestionResponseBody {
    points:number;
    question:string;
    questionDetails?:string;
    questionImage?:string;
    timeLimit:number;
    type:string;
    choices?: {
        answer:string;
    }[];
}