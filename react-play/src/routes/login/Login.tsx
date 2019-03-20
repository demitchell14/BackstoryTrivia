import * as React from "react";

class Login extends React.Component<LoginProps, LoginState> {
    public constructor(props:LoginProps) {
        super(props);
        this.state = {} as LoginState
    }

    public render() {
        return (
            <div>

            </div>
        );
    }
}

interface LoginProps {
    state?: LoginState;
}

interface LoginState {

}

export default Login