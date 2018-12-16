import * as React from "react";
// @ts-ignore
import {lazy, LazyExoticComponent, Suspense} from "react";

import { Route, Switch } from "react-router-dom";

//import Dashboard from "./routes/dashboard/Dashboard"
//import Questions from "../routes/questions/Questions";


class RouterComponent extends React.Component {
    routes: {
        Dashboard:LazyExoticComponent<any>;
        Questions:LazyExoticComponent<any>;
    }
    public constructor(props) {
        super(props);
        this.routes = {
            Dashboard: lazy(() => import("./routes/dashboard/Dashboard")),
            Questions: lazy(() => import("./routes/questions/Questions"))
        }
    }

    public render() {
        return (
            <main>
                <Suspense fallback={"loading"}>
                    <Switch>
                        <Route exact path={"/"} component={this.routes.Dashboard} />
                        <Route exact path={"/questions"} component={this.routes.Questions} />
                    </Switch>
                </Suspense>
            </main>
        )
    }
}

export default RouterComponent;