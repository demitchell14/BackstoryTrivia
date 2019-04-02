
const AuthorizationString = "";


const Config = {
    AuthString: AuthorizationString,

};

export const Encryption = {
    saltRounts: 10,
    pattern: /^\$2[ayb]\$.{56}$/
};

export const MongoDetails = {
    baseurl: process.env.MONGO_URL,
    username: process.env.MONGO_USER,
    password: process.env.MONGO_PASS,
    db: process.env.MONGO_DB,
    maxSavedSessions: 15,
};

export const MongooseDetails = {
    baseurl: "",
    username: "",
    password: "",
    db: "",
}

export const JWT_SECRET = "";

export const AuthString = AuthorizationString;
export default Config;