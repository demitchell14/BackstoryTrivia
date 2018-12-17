import {Container} from "unstated";
import conf from  "../../config"
import {AuthTemplate, Bodies, Responses} from "./Authorization";

class AdminAuthorization extends Container<AdminState> implements AuthTemplate {
    public type = "admin";
    public state = {} as AdminState;

    public verifyToken = async (token:string) => {
        if (this.state.verified) {
            return this.state;
        }
        const response = await fetch("/api/v2/user/login/" + token, {
            method: "POST"
        });

        if (response.status === 200) {
            let data = await response.json() as Responses.Login;
            sessionStorage.setItem(conf.adminToken, data.token);
            // @ts-ignore
            data.verified = true;
            await this.setState(data);
        } else {
            throw Error("")
        }


        return this.state;
    }
    
    public getToken() {
        return sessionStorage.getItem(conf.adminToken);
    }
    
    public isEmailStored() {
        return localStorage.getItem(conf.adminEmail) !== null;
    }
    
    public isLoggedIn = () : boolean => {
        const token = this.getToken();
        if (this.state.error) {
            return false
        }
        if (token) {
            return typeof this.state.token === "string" && typeof this.state.email === "string"
        } else {
            return false;
        }
    };
    

    public login = async (body:Bodies.Login) => {
        // @ts-ignore
        const response = await fetch("/api/v2/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })

        if (response.status === 200) {
            const data = await response.json() as Responses.Login
            sessionStorage.setItem(conf.adminToken, data.token);
            this.setState(data);
            return true;
        } else {
            let body;
            if (false /* response.status !== 500*/) {
                body = JSON.parse(await response.json()) as Responses.LoginError;
            }
            this.reset(body);
            return false;
        }
    }

    public reset = (body?:any) => {
        let tmp = this.state as AdminState;
        delete tmp.email;
        delete tmp.token;
        if (body) {
            tmp.error = body;
        } else {
            delete tmp.error;
        }
        sessionStorage.removeItem(conf.adminToken);
        this.setState(tmp);
    }
}

interface AdminState {
    token?: string;
    email?: string;
    error?: any;
    verified?: boolean;
}



export default AdminAuthorization;