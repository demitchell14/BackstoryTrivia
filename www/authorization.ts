import {MiddlewareReq} from "./trivia";

const UserProps = {
    name: "Devin Mitchell",
    email: "demitchell14@gmail.com",
    authorization: "I'm a fake authorization token, lol",
    games: [ "game123" ],

    address: "123 Main St.",
    passwordHash: "todo...",
    lastAuth: "todo..."
};

class Authorization {
    key:string;
    authorized:boolean;
    readonly rawUser?:any;
    public constructor(req:MiddlewareReq) {
        this.key = req.headers.authorized || req.body.authorized;

        // -- TODO search DB for key.

        this.authorized = UserProps.authorization === this.key
        if (this.authorized)
            this.rawUser = UserProps;

        if (this.authorized)
            console.info(`Authorized connection to '${req.url}'`);

    }

    public user() {
        if (this.rawUser) {
            const {name, email, games, authorization} = this.rawUser;
            //TODO add token expiration and token replacement
            return {name, email, games, authorization, _isAuthorized: true};
        }
        return {error: "authorization failed"};
    }
}

export default Authorization;