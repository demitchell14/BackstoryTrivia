
const AuthorizationString = "i'm technically authorized";


const Config = {
    AuthString: AuthorizationString,

};

export const Encryption = {
    saltRounts: 10,
    pattern: /^\$2[ayb]\$.{56}$/
};

export const MongoDetails = {
    baseurl: "ds029541.mlab.com:29541",
    username: "trivia",
    password: "trivia123",
    db: "sockettrivia",
    maxSavedSessions: 15,
};

export const AuthString = AuthorizationString;
export default Config;