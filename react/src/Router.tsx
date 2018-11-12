import * as React from "react";
import {lazy, Suspense} from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from "./App";
//import ManageRoute from "./routes/Manage";
import GameListRoute from "./routes/GameList";
import RegisterRoute from "./routes/Register";
//import GameRoute from "./routes/Game";

import HeadingComponent from "./components/HeadingComponent";
import NavigationComponent from "./components/NavigationComponent";
//import ManageListRoute from "./routes/ManageList";

const Manage = lazy(() => import("./routes/Manage"));
const ManageList = lazy(() => import("./routes/ManageList"));
const Game = lazy(() => import("./routes/Game"));


class RouterComponent extends React.Component {

    public render() {
        return (
            <main>
                <HeadingComponent
                    title={"Backstory Trivia"}
                    subtitle={"Every Sunday Night"}
                />

                <NavigationComponent

                />

                <Router>

                    <Suspense fallback={<div>Loading..</div>}>
                    <Switch>
                        <Route exact path={"/"} component={App} />
                        <Route exact path={"/list"} component={GameListRoute} />
                        <Route exact path={"/game/:token"} component={Game} />
                        <Route exact path={"/register/:token"} component={RegisterRoute} />
                        <Route exact path={"/manage"} component={ManageList} />
                        <Route exact path={"/manage/:token"} component={Manage} />
                    </Switch>
                    </Suspense>
                </Router>
            </main>
        )
    }
}

export default RouterComponent;