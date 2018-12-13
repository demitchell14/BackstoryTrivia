import * as React from "react";
import {lazy, Suspense} from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from "./Main";
//import ManageRoute from "./routes/Manage";
import GameListRoute from "./routes/GameList";
//import RegisterRoute from "./routes/Register";

//import UserGate from "./store/UserGate";
//import GameGate from "./store/GameGate";
//import GameRoute from "./routes/Game";

//import HeadingComponent from "./components/HeadingComponent";
///import NavigationComponent from "./components/NavigationComponent";
//import ManageListRoute from "./routes/ManageList";

const Manage = lazy(() => import("./routes/Manage"));
const ManageList = lazy(() => import("./routes/ManageList"));
const Game = lazy(() => import("./routes/Game"));
const Register = lazy(() => import("./routes/Register"));


const TestRoute = lazy(() => import("./routes/Testing"));
const QuestionStore = lazy(() => import("./routes/questions/Questions"));


class RouterComponent extends React.Component {

    public render() {
        return (
            <main>
                <Router>
                    <Suspense fallback={false}>
                    <Switch>
                        <Route exact path={"/"} component={App} />
                        <Route exact path={"/list"} component={GameListRoute} />
                        <Route exact path={"/game/:token"} component={Game} />
                        <Route exact path={"/register/:token"} component={Register} />
                        <Route exact path={"/test/:token"} component={TestRoute} />
                        <Route exact path={"/manage"} component={ManageList} />
                        <Route exact path={"/manage/:token"} component={Manage} />
                        <Route exact path={"/questions"} component={QuestionStore} />
                    </Switch>
                    </Suspense>
                </Router>
            </main>
        )
    }
}

export default RouterComponent;