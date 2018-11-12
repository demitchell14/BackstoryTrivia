//import {RegistrationResponse} from "./register";
import {apiRequest} from "./fetch";

export class Session {
    team: any;
    game:any;
    private isAuthorized:boolean;
    readonly user:User;

    constructor(props?:any) {
        props = props || {};
        this.team = props.team || {};
        this.game = props.game || {};
        this.user = new User(props.user);

    }
    setTeam(opts) {
        let {team, game} = opts;
        Object.assign(this.game, game);
        Object.assign(this.team, team);
        //console.log(this);
    }
    teamKey() {
        return typeof this.team.key !== "undefined" ? this.team.key : undefined;
    }
    teamName() {
        return typeof this.team.name !== "undefined" ? this.team.name : undefined;
    }
    gameKey() {
        return typeof this.game.token !== "undefined" ? this.game.token : undefined;
    }
    authorized(key?:string): boolean {
        if (key) {
            this.isAuthorized = true;
            return this.setTeamKey(key);
        } else
            return this.isAuthorized;
    }
    managerAuthorization(token:string) {
        let x = this.user;
        console.log(x);
    }
    private setTeamKey(key:string) {
        this.team.key = key;
        return key === this.team.key;
    }
}

export class User {
    name:string;

    private authorization:string;
    private _isAuthorized:boolean;

    games:Array<string>;

    public constructor(props?:UserResponseProps) {
        this._isAuthorized = false;
        if (props) {
            this.name = props.name;
            this.games = props.games || [];
            this.authorization = props.authorization;
        }
    }

    public async authorize(opts:UserAuthenticationBody) {
        if (opts.password) {
            // -- TODO login with HTML Form
            return false;
        } else {
            // -- login with saved authorization code
            let {email, authorized} = opts;
            let response = await apiRequest("user", {
                path: "authorize",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email, authorized}),
            }) as Response;
            if (response.status === 200) {
                let json = await response.json() as UserResponseProps;
                Object.assign(this, json);

                return this;
            } else {
                throw Error(response.statusText);
            }
            //return this._isAuthorized;
        }
    }

    public getAuthToken() {
        return this.authorization;
    }

    public isAuthorized(token?:string):boolean {
        if (typeof token === "string") {
            if (this.authorization) {
                return this.games.findIndex(g => g === token) !== -1
            }// else
            //this._isAuthorized = bool;
        }
        return this._isAuthorized;
    }
}

export interface UserAuthenticationBody {
    email:string;
    password?:string;
    authorized?:string;
}

export interface UserResponseProps {
    name:string;
    email:string;
    authorization:string;
    games: Array<string>;
}

