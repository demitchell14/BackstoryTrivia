import * as React from "react";
import {ReactElement, RefObject} from "react";
import {Api} from "../store/api";
import {User, Session} from "../store/session";
import ContainerComponent from "../components/ContainerComponent";
import InputGroupComponent from "../components/InputGroupComponent";
//import {log} from "../";

//const sessionEmail = "demitchell@gmail.com";
//const sessionKey = "0e98c31f-5b50-400f-9566-f67b228bde1d";

class UserGate extends React.Component<UserGateProps, UserGateState> {

    public constructor(props) {
        super(props);
        const api = Api();
        this.state = {
            api: api,
            session: api.session,
            user: api.session.user,
            authorized: false,
            current: (<div>_</div>),
            error: [],
        };

    }

    private async login(email:string, pass:string) {
        const user = this.state.user;
        await user.session({
            email: email,
            password: pass
        });
        if (user.isAuthorized()) {
            //localStorage.setItem("session_token", user._session);
            //localStorage.setItem("session_email", user.email);
            sessionStorage.setItem("session_token", user._session);
            sessionStorage.setItem("session_email", user.email);
            this.setState({authorized: user.isAuthorized()});

            if (this.props.onSuccess) {
                this.props.onSuccess();
            }
        } else {
            if (this.props.onError) {
                // -- TODO
                console.log(this.props.onError)
                //this.props.onError("Invalid stored data.")
            } else {
                throw Error("Invalid stored data.")
            }
        }
    }

    public async componentWillMount() {
        let token = localStorage.getItem("session_token");
        let email = localStorage.getItem("session_email");
        if (token === null) {
            token = sessionStorage.getItem("session_token");
        }
        if (email === null) {
            email = sessionStorage.getItem("session_email");
        }
        if (token && email) {
            const user = this.state.user;
            await user.session({
                email: email,
                authorized: token
            });

            if (user.isAuthorized()) {
                this.setState({authorized: user.isAuthorized()});
            } else {
                if (this.props.onError) {
                    // -- TODO
                    this.props.onError("Invalid token found.")
                } else
                    throw Error("Invalid token found.");
            }
            if (this.props.onSuccess) {
                this.props.onSuccess();
            }
        } else {
            this.setState({current: <LoginComponent error={this.state.error} onSubmit={this.login.bind(this)} email={email}/>})
        }
        //let promise = this.state.user.session({
        //    email: sessionEmail,
        //    authorized: sessionKey,
        //});
        //promise.then((user:User)=> {
        //    console.log(user.isAuthorized())
        //})

    }
    
    public render() {
        if (this.state.authorized)
            return this.props.children
        else {
            return this.state.current;
        }
    }
}


interface LoginProps {
    onSubmit?: any;
    email?:string|null;
    error: Array<any>;
}
class LoginComponent extends React.Component<LoginProps> {
    emailRef:RefObject<HTMLInputElement>;
    passwordRef:RefObject<HTMLInputElement>;
    public constructor(props) {
        super(props);

        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
    }

    submitted(evt:any) {
        evt.preventDefault();
        const {emailRef, passwordRef} = this;
        if (emailRef.current && passwordRef.current) {
            const email = emailRef.current;
            const pass = passwordRef.current;
            if (this.props.onSubmit) {
                this.props.onSubmit(email.value, pass.value);
            }
        }
    }

    render() {
        return (
            <ContainerComponent type={"row"}>
                <div className={"col-12"}>
                    <h4 className={"text-center my-3"}>You must sign in to view this page.</h4>
                </div>
                <form onSubmit={this.submitted.bind(this)} className={"col-md-8 offset-md-2"}>
                    {this.props.email ? (
                        <div>b</div>
                    ) : (
                        <div>a</div>
                    )}
                    <InputGroupComponent>
                        <label className="col-form-label" htmlFor="email">Email:</label>
                        <input
                            ref={this.emailRef}
                            className="form-control"
                            type="text"
                            name="email"
                            autoComplete={"email"}
                        />
                    </InputGroupComponent>

                    <InputGroupComponent>
                        <label className="col-form-label" htmlFor="password">Password:</label>
                        <input
                            ref={this.passwordRef}
                            className="form-control"
                            type="password"
                            name="password"
                            autoComplete={"current-password"}
                        />
                    </InputGroupComponent>

                    {this.props.error.length > 0 ? (
                        <div className={"alert alert-danger"}>
                            <h5 className={"alert-heading"}>Oops! An Error Occurred!</h5>
                            {this.props.error.map(err => <p>{err}</p>)}
                        </div>
                    ) : ""}

                    <button type={"submit"} className={"btn btn-success"}>Sign in</button>
                </form>
            </ContainerComponent>
        )
    }
}

interface UserGateProps {
    email?:string;
    session?:string;

    onSuccess?:any;
    onError?:any;

    state?: UserGateState;
    children: Array<ReactElement<any>>|ReactElement<any>;
}
interface UserGateState {
    api: any;
    session:Session;
    user:User;
    authorized:boolean;
    current:any;
    error: Array<any>;
}

export default UserGate;