import * as React from "react";
import {Suspense} from "react";
// @ts-ignore
import {Redirect, Route, RouterProps as RProps, Switch, withRouter} from "react-router";


import Home from "./routes/Home";
import Signin from "./routes/Signin";
import Test from "./routes/Test";

// import Questions from "./routes/manage/questions/Questions";
const Questions = React.lazy(() => import("./routes/manage/questions/Questions"));

// import Games from "./routes/manage/games/Games";
const Games = React.lazy(() => import("./routes/manage/games/Games"));

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

        const redirector = this.props.history.createHref({
            pathname: "/",
            state: {requestedLocation: this.props.history.location}
        });
        
        const Redirector = () => {
            if (this.props.initialized)
                return (<Redirect to={redirector}/>);
            return (<div>Loading...</div>)
        };

        return [
            <Route key={"test"} exact={true} path={"/test"} component={isAuthorized ? Test : Redirector} />,
            <Route key={"manage/questions"} exact={true} path={"/manage/questions"} component={isAuthorized ? Questions : Redirector} />,
            <Route key={"manage/games"} exact={true} path={"/manage/games"}
                   component={isAuthorized ? Games : Redirector}/>,
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