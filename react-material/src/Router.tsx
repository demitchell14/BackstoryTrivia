import * as React from "react";
// @ts-ignore
import {Route, Switch, withRouter, RouterProps as RProps, Redirect} from "react-router";
import {Suspense} from 'react';


import Home from "./routes/Home";
import Signin from "./routes/Signin";
import Test from "./routes/Test";
import Questions from "./routes/manage/questions/Questions";

class Router extends React.Component<RouterProps, RouterState> {
    public constructor(props) {
        super(props);
        this.state = {} as RouterState
    }

    public render() {
        return (
            <Switch>
                <Suspense fallback={"Loading..."}>
                    <Route path={"/"} exact component={Home} />
                    <Route path={"/(signin|register)"} exact component={Signin} />


                    {this.renderAuthorizedRoutes()}
                </Suspense>
            </Switch>
        );
    }

    private renderAuthorizedRoutes = () => {
        const {isAuthorized} = this.props;
        
        const redirector  = this.props.history.createHref({ pathname: "/", state: {requestedLocation: this.props.history.location}})
        
        const Redirector = () => {
            if (this.props.initialized)
                return (<Redirect to={redirector} />)
            return (<div>Loading...</div>)
        }

        return [
            <Route key={"test"} exact={true} path={"/test"} component={isAuthorized ? Test : Redirector} />,
            <Route key={"manage/questions"} exact={true} path={"/manage/questions"} component={isAuthorized ? Questions : Redirector} />,
        ];
    }
}


interface RouterProps extends RProps {
    state?: RouterState;
    isAuthorized?: boolean;
    userType?: string;
    initialized: boolean;
}

interface RouterState {}


export default withRouter(Router);