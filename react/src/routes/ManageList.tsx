import * as React from "react";

import {Api} from "../store/api";
//import {User} from "../store/session";

//import ContainerComponent from "../components/ContainerComponent";
import ListRouter from "./GameList";
import UserGate from "../store/UserGate";

const api = Api();
class ManageListRoute extends React.Component<ManageListProps, ManageListState> {

    public constructor(props) {
        super(props);

        //let user = api.session.user;

        this.state = {
            authorized: api.session.user.isAuthorized(),
            errors: [],
            games: [],
        } as ManageListState;

    }

    componentDidUpdate() {
        console.log(this.state);
    }

    componentWillMount() {

    }


    componentWillUnmount() {

    }

    private authorized() {
        this.setState({
            authorized: api.session.user.isAuthorized(),
            games: api.session.user.games
        });
        //let promise = api.session.user.waitForAuthorization()
        //promise.then(() => {

        //});
    }

    public render() {
        return (
            <UserGate onSuccess={this.authorized.bind(this)}>
                <ListRouter managed={true} games={this.state.games}/>
            </UserGate>
        )
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
