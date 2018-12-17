import * as React from "react";
// @ts-ignore
import {lazy, LazyExoticComponent, Suspense} from "react";

import {Subscribe} from "unstated";

// @ts-ignore
import {Route, Switch, Redirect, HashRouter} from "react-router-dom";

//import Dashboard from "./routes/dashboard/Dashboard"
//import Questions from "../routes/questions/Questions";

//import Authorization from "./handlers/authorization/Authorization";
//import TeamAuthorization from "./handlers/authorization/TeamAuthorization";
import AdminAuthorization from "./handlers/authorization/AdminAuthorization";
//import UnAuthorized from "./components/unauthorized/UnAuthorized";

// -- Public
const Dashboard = lazy(() => import("./routes/dashboard/Dashboard"));
const Login = lazy(() => import("./routes/login/Login"));
// -- End Public

// -- Admin Only
const Questions = lazy(() => import("./routes/questions/Questions"));
// -- End Admin Only

class RouterComponent extends React.Component {
    public constructor(props) {
        super(props);
    }

    public render() {
        return (
            <main>
                <Suspense fallback={"loading"}>
                        <Switch>
                            <Route exact path={"/"} component={Dashboard}/>
                            <Route exact path={"/:type/login"} component={Login}/>
                        </Switch>

                        <Subscribe to={[AdminAuthorization]}>
                            {(auth:AdminAuthorization) => this.renderAdminRoutes(auth)}
                        </Subscribe>
                </Suspense>
            </main>
        )
    }
    

    private renderAdminRoutes = (auth:AdminAuthorization) => {
        if (auth.isLoggedIn()) {
            // -- User is successfully logged in, meaning the user has verified they are who they say
            // -- say they are through our database. Email & Token are stored in state.
            // -- if not found in state, you are not logged in.
            return (
                <Switch key={"browser"}>
                    <Route exact path={"/questions"} component={Questions}/>
                </Switch>
            )
        } else {
            // -- If there is a stored token in sessionStorage, we will verify and wait,
            // -- Otherwise we will send them to login page
            const token = auth.getToken()
            const email = auth.isEmailStored();
            if (token) {
                auth.verifyToken(token).catch(err => {
                    auth.reset();
                })
            } else if (email) {
                // -- TODO Add stored email, so login with pin instead ?????
            } else {
                return <Switch>
                    <Route exact path={"/questions"}>
                        <Redirect to={`/admin/login`} push from={"/questions"}/>
                    </Route>
                </Switch>
            }
        }
        return <div>Authorizing...</div>
    };
    
}

export default RouterComponent;