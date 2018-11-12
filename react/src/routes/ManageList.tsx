import * as React from "react";

import {Api} from "../store/api";
import {User} from "../store/session";

import ContainerComponent from "../components/ContainerComponent";
import ListRouter from "./GameList";

const api = Api();
class ManageListRoute extends React.Component<ManageListProps, ManageListState> {

    public constructor(props) {
        super(props);

        this.state = {
            authorized: api.session.user.isAuthorized(),
            errors: [],
            games: [],
        } as ManageListState;

        let user = api.session.user;

        user.authorize({
            email: "demitchell@gmail.com",
            authorized: "I'm a fake authorization token, lol"
        }).then((user:User)=> {
            console.log(user.games);
            this.setState({games: user.games, errors: [], authorized: user.isAuthorized()});
        }).catch((err:Error) => this.setState({errors: [...this.state.errors, err.message]}));

    }

    componentDidUpdate() {
        console.log(this.state);
    }


    componentWillUnmount() {

    }

    public render() {
        if (this.state.authorized) {
            return (
                <ListRouter managed={true} games={this.state.games}/>
            )
        } else {
            return (
                <ContainerComponent type={"d-flex"}>
                    Unauthorized, login.
                </ContainerComponent>
            )
        }
    }

}

interface ManageListProps {
    state?:ManageListState;
}

interface ManageListState {
    authorized:boolean;
    games:Array<any>;
    errors:Array<string>;
}

export default ManageListRoute;
