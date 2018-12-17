import * as React from "react";

import "./style.css";
import {Subscribe} from "unstated";
import AdminAuthorization from "../../handlers/authorization/AdminAuthorization";
import {AuthTemplate} from "../../handlers/authorization/Authorization";
import InputGroupComponent from "../../../components/InputGroupComponent";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {RefObject} from "react";
import {IconLookup} from '@fortawesome/fontawesome-svg-core';

class Login extends React.Component<LoginProps, LoginState> {

    public state = {
        stayIcon: {
            unchecked: {
                prefix: "fal",
                iconName: "times-circle",
            },
            checked: {
                prefix: "fal",
                iconName: "check-circle",
            },
            state: () => {
                if (this.references.autologin.current) {
                    const x = this.references.autologin.current;
                    if (x.checked)
                        return this.state.stayIcon.checked;
                    return this.state.stayIcon.unchecked;
                }
                return this.state.stayIcon.unchecked;
            }
        }
    } as LoginState;

    public references = {
        email: React.createRef() as RefObject<HTMLInputElement>,
        password: React.createRef() as RefObject<HTMLInputElement>,
        autologin: React.createRef() as RefObject<HTMLInputElement>,
        icon: React.createRef() as RefObject<HTMLSpanElement>
    };

    public componentWillMount(): void {
        //console.log(this.props);
    }

    public render() {
        return (
            <Subscribe to={[AdminAuthorization]}>
                {(auth:AuthTemplate) => this.mode(auth)}
            </Subscribe>
        );
    }

    public mode = (auth:AuthTemplate) => {
        switch (auth.type) {
            case "admin":
                return this.buildAdmin(auth as AdminAuthorization);
            default:
                return <div>Unknown Route</div>
        }

    };

    private buildAdmin = (auth:AdminAuthorization) => {
        const submit = async (evt) => {
            evt.preventDefault();
            const email = this.references.email.current;
            const password = this.references.password.current;
            const autologin = this.references.autologin.current;
            if (email && password && autologin) {
                const success = await auth.login({
                    email: email.value,
                    password: password.value,
                    autologin: autologin.checked,
                })
                if (success) {
                    if (this.props.history) {
                        this.props.history.goBack();
                    }
                }
            }
            return false;
            //auth.login(references)
        }

        return (
            <div className={"container-fluid login"}>
                <form className={"card"} onSubmit={submit}>
                    <FontAwesomeIcon className={"login-ico"} icon={["fal", "fingerprint"]} />
                    <InputGroupComponent type={"block"}>
                        <label>Email/Username:</label>
                        <input type={"text"}
                               ref={this.references.email}
                               autoComplete={"email"}
                               className={"form-control"}
                        />
                    </InputGroupComponent>

                    <InputGroupComponent type={"block"}>
                        <label>Password:</label>
                        <input type={"password"}
                               ref={this.references.password}
                               autoComplete={"current-password"}
                               className={"form-control"}
                        />
                    </InputGroupComponent>

                    <label className={"form-control-label"}>
                        <input onChange={this.onChange} ref={this.references.autologin} className={"checkbox-block"} type={"checkbox"} />
                        <span><FontAwesomeIcon  icon={this.state.stayIcon.state()}/></span>
                        <span>Stay Logged In?</span>
                    </label>

                    <button className={"btn btn-bs my-2"}>Login</button>
                </form>
            </div>
        )
    }

    public onChange = (evt) => {
        this.forceUpdate()
    }
}

interface LoginState {
    stayIcon: {
        state: () => IconLookup;
        unchecked: IconLookup;
        checked: IconLookup;
    };
}

interface LoginProps {
    history?: {
        replace: (path:string) => void;
        goBack: () => void;
    }
    match?: {
        isExact: boolean;
        params: {
            type: "admin"|"team";
        };
        path: string;
        url: string;
    }
    state?: LoginState;
}

export default Login;