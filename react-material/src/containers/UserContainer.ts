import {Container} from "unstated";
import {Api} from "./index";
//import conf from  "../../config"
//import {AuthTemplate, Bodies, Responses} from "./Authorization";

class UserContainer extends Container<UserState> {
    //public type = "admin";
    public state = {} as UserState;

    constructor() {
        super();
        this.state = {
            initializing: true
        }
        this.checkToken().then(() => this.setState({initializing: false}).catch(() => this.setState({initializing: false})));
    }

    login = async (data:LoginProps) => {
        this.removeAll();
        // /api/v2/user/login
        const response = await fetch("/api/v2/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        const _body = await response.text();
        if (response.status === 200) {
            this.storeData(_body)
        } else {
            try {
                const data = JSON.parse(_body);
                console.log(data);
            } catch(err) {
                this.setState({error: _body});
            }
        }
        return this;
    };

    register = async (data) => {

        return this;
    }

    async checkToken() : Promise<string|undefined> {
        const _token = localStorage.getItem("user-token");
        if (_token) {
            const response = await fetch(`/api/v2/user/login/${_token}`, {
                method: "POST",
            });
            const _body = await response.text();
            if (response.status === 200) {
                this.storeData(_body);
                await this.setState({verified: true});
                return this.state.token;
            } else {
                try {
                    const data = JSON.parse(_body);
                    console.log(data);
                } catch(err) {
                    this.setState({error: _body});
                }
            }
        }
        return undefined;
    }
    
    async token() {
        if (this.state.token)
            return this.state.token;
        return await this.checkToken();
    }

    logout() {
        localStorage.removeItem("user-token");
        this.removeAll();
    }

    storeData(obj:string) {
        const user = JSON.parse(obj) as Api.LoginResponse;
        const {email, name, token, type} = user;
        this.setState({email, token, name, type})
            .then(() => {
                localStorage.setItem("user-token", token);
            });
    }

    removeAll() {
        this.setState({
            token: undefined,
            email: undefined,
            name: undefined,
            error: undefined,
            type: undefined,
            verified: undefined
        })
    }
}

interface UserState {
    token?: string;
    email?: string;
    name?: string;
    error?: any;
    type?: string;
    verified?: boolean;
    initializing: boolean;
}

interface LoginProps {
    email: string;
    password: string;
    autologin: boolean;
}



export default UserContainer;