import {RefObject, SyntheticEvent} from "react";
import * as React from "react";
import {RouterProps} from "react-router";
import {Container} from "../../components";
import {PlayerContainer, StorageContainer} from "../../containers";

export class Login extends React.Component<LoginProps, LoginState> {
    public constructor(props:LoginProps) {
        super(props);
        this.state = {
            form: {
                email: "",
                password: "",
                pin: "",
                autologin: "off",
            },
        } as LoginState
        
        props.containers.player.attachStorage(props.containers.storage);
    }
    
    withPin = (props:any) => (
        <div>
            <p className={"mb-0"}>You are currently connected with the following email.</p>
            <p>{props.email}</p>
            <p>Not correct? Click Here</p>
            <hr className={"primary"} />
            <div className={"form-group"}>
                <label className={"text-light"}>Enter Pin</label>
                <div>
                    Pin Here
                </div>
            </div>
        </div>
    );
    
    withNothing = (props:any) => (
        <div>
            <div className={"form-group"}>
                <label className={"text-light"}>Email</label>
                <input
                    autoFocus required
                    onChange={props.onChange}
                    value={props.email}
                    type={"text"} className={"form-control"}
                    placeholder={"Enter email"}
                    name={"email"}
                />
            </div>
            <div className={"form-group"}>
                <label className={"text-light"}>Password</label>
                <input required
                       onChange={props.onChange}
                       value={props.password}
                       type={"password"} className={"form-control"}
                       placeholder={"Enter password"}
                       name={"password"}
                />
            </div>
        </div>
    );
    
    withPassword = (props:any) => (
        <div>
            <p className={"mb-0 text-light"}>You are currently connected with the following email.</p>
            <input type={"email"} className={"font-weight-light form-control-plaintext form-control-sm"} value={props.email} readOnly />
            <p className={"text-light"}>Not correct?
                <button type={"button"} onClick={this.resetPlayer} className={"btn btn-link btn-sm"}>Click Here</button>
            </p>
            <hr className={"primary"} />
            <div className={"form-group"}>
                <label className={"text-light"}>Password</label>
                <input required
                       onChange={props.onChange}
                       value={props.password}
                       type={"password"} className={"form-control"}
                       placeholder={"Enter password"}
                       name={"password"}
                />
            </div>
        </div>
    );
    
    componentWillMount(): void {
        const storage = this.props.containers.storage;
        const form = this.state.form;
        let mode = this.state.mode;
        if (storage.hasEmail()) {
            form.email = storage.getEmail();
            mode = "password";
        }
        if (storage.hasPin()) {
            mode = "pin";
        }
        this.setState({form, mode});

        this.autologin = React.createRef();
    }

    resetPlayer = () => {
        const player = this.props.containers.player;
        const form = this.state.form;
        player.reset();
        form.email = "";
        form.password = "";
        form.pin = "";
        this.setState({form, mode: ""})
        // this.forceUpdate();
    }

    onChange = (evt:SyntheticEvent) => {
        const target = evt.currentTarget as HTMLInputElement;
        const {form} = this.state;
        // console.log(target);
        if (target.name === "autologin")
            form[target.name] = target.checked ? "on" : "off";
        else
            form[target.name] = target.value;

        this.setState({form});
    }

    autologin:RefObject<HTMLInputElement>;

    handleAutologin = (evt:SyntheticEvent) => {
        if (this.autologin.current) {
            this.autologin.current.click();
        }
    }

    sendLogin = (evt:SyntheticEvent) => {
        evt.preventDefault();
        const {player} = this.props.containers;
        const login = player.sendLogin(this.state.form);
        login.then((response:string[]|true) => {
            if (response === true) {
                this.props.history.push("/");
            } else {
                this.setState({error: response});
            }
        })
    }

    public render() {
        //const {storage} = this.props.containers;
        const {mode,form} = this.state;
        
        let content;
        switch (mode) {
            case "password":
                content = this.withPassword({...form, onChange: this.onChange});
                break;
            case "pin":
                content = this.withPin({...form, onChange: this.onChange});
                break;
            default:
                content = this.withNothing({...form, onChange: this.onChange});
        }
        
        return (
            <Container
                className={"head-pad"} component={"form"}
                fullWidth
                display={"flex"}
                direction={"column"}
                componentProps={{
                    action: "/test",
                    method: "POST",
                    onSubmit: this.sendLogin,
                }}
                flex={{grow:1}}>

                {this.state.error && this.state.error.length > 0 && (
                    <div className={"alert alert-warning"}>
                        <div className={"alert-body"}>
                            {this.state.error.map((err:string, idx:number) =>
                                <p key={idx}>{err}</p>)}
                        </div>
                    </div>
                )}
                
                {content}

                <div className={"mb-3"}>
                    <div onClick={this.handleAutologin} className="custom-control custom-checkbox">
                        <input ref={this.autologin}
                            checked={form.autologin === "on"}
                            onChange={this.onChange}
                            type={"checkbox"}
                            name={"autologin"}
                            className={"custom-control-input"}
                        />
                        <label className={"custom-control-label text-light"}>
                            Stay logged In
                        </label>
                    </div>
                </div>

                <div className={"mb-3"}>
                    <button className={"btn btn-block btn-primary"} type={"submit"}>Go</button>
                </div>

            </Container>
        );
    }
}

interface LoginProps extends RouterProps {
    state?: LoginState;
    containers: {
        player: PlayerContainer;
        storage: StorageContainer;
    }
}

interface LoginState {
    mode: string;
    form: {
        email: string;
        password?: string;
        pin?: string;
        autologin: string;
    }
    error?: string[];
}

export default Login