import * as React from "react";
import {Container, Provider} from "unstated";


class Authorization extends React.Component {
    public render() {
        return (
            <Provider>
                {this.props.children}
            </Provider>
        )
        //return this.props.children;
    }
}

export interface AuthTemplate extends Container<any> {
    type: string;
    //hasToken: () => boolean;
    getToken: () => string|null;
    isLoggedIn: () => boolean;
    login: (body: Bodies.Login) => Promise<any>;

    reset: () => void;

}


export declare namespace Bodies {
    interface Login {
        email: string;
        password?: string;
        pin?: string;
        autologin?: boolean;
    }
}

export declare namespace Responses {
    interface Login {
        token: string;
        email: string;
    }
    interface LoginError {

    }
}

export default Authorization;