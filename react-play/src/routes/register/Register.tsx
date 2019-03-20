import {SyntheticEvent} from "react";
import * as React from "react";
import {RouterProps} from "react-router";
import {Container} from "../../components";
import {StorageContainer, PlayerContainer, RegisterFormData} from "../../containers";

export class Register extends React.Component<RegisterProps, RegisterState> {
    public constructor(props:RegisterProps) {
        super(props);
        this.state = {
            form: {
                email: "",
                teamName: "",
                passwordConfirm: "",
                password: "",
                autologin: true
            }
        } as RegisterState
        props.containers.player.attachStorage(props.containers.storage);
    }

    componentDidMount(): void {
        const {storage} = this.props.containers;
        const {history} = this.props;
        if (storage.hasToken()) {
            history.replace("/");
        }
    }

    sendRegister = (evt:any) => {
        evt.preventDefault();
        const register = this.props.containers.player.sendRegister(this.state.form);
        register.then(response => {
            if (response === true) {
                this.props.history.replace("/");
            }
        })
    }

    onChange = (evt:SyntheticEvent) => {
        const target = evt.currentTarget as HTMLInputElement;
        const {form} = this.state;
        form[target.name] = target.value;
        this.setState({form});
    }

    public render() {
        const {password, email, passwordConfirm, teamName} = this.state.form;
        return (
            <Container
                className={"head-pad"} component={"form"}
                fullWidth
                display={"flex"}
                direction={"column"}
                componentProps={{
                    action: "/test",
                    method: "POST",
                    onSubmit: this.sendRegister
                }}
                flex={{grow:1}}>
                <p className={"mb-0 text-light"}>
                    In order to play, you will need to create an account.
                    Your account will have pretty basic information.
                    All we need from you is a team name, an email, and a password.
                    You can also optionally add a pin number for quicker login when you get logged out.
                </p>
                <hr className={"primary"}/>
                <div>
                    <div className={"form-group"}>
                        <label className={"text-light"}>Team Name</label>
                        <input autoFocus required
                            onChange={this.onChange}
                            value={teamName}
                            type={"text"} className={"form-control"}
                            placeholder={"Enter your team name"}
                            name={"teamName"}
                        />
                    </div>

                    <div className={"form-group"}>
                        <label className={"text-light"}>Email</label>
                        <input required
                            onChange={this.onChange}
                            value={email}
                            type={"email"} className={"form-control"}
                            placeholder={"Enter your email"}
                            name={"email"}
                        />
                    </div>
                </div>
                <hr className={"primary"}/>
                <div>

                    <div className={"form-group"}>
                        <label className={"text-light"}>Password</label>
                        <input required
                            onChange={this.onChange}
                            value={password}
                            type={"password"} className={"form-control"}
                            placeholder={"Enter password"}
                            name={"password"}
                        />
                    </div>
                    <div className={"form-group"}>
                        <label className={"text-light"}>Confirm Password</label>
                        <input required
                            onChange={this.onChange}
                            value={passwordConfirm}
                            type={"password"} className={"form-control"}
                            placeholder={"Enter password again"}
                            name={"passwordConfirm"}
                        />
                    </div>

                </div>

                <div className={"mb-3"}>
                    <button className={"btn btn-block btn-primary"} type={"submit"}>Go</button>
                </div>

            </Container>
        );
    }
}

interface RegisterProps extends RouterProps {
    state?: RegisterState;
    containers: {
        player: PlayerContainer;
        storage: StorageContainer
    }
}

interface RegisterState {
    form: RegisterFormData
}

export default Register