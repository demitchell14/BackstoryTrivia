import {Location} from "history";
import {SyntheticEvent} from "react";
import * as React from "react";
import {Route, Switch, withRouter, RouteProps, RouterProps as IRouterProps} from "react-router";
import {Link} from "react-router-dom";
import {Subscribe} from "unstated";
import {Container, NavigationItem, NavigationItems, NavigationPanel, NavigationTitle} from "./components";

import * as ReactGA from "react-ga";

import {SocketContainer, StorageContainer, PlayerContainer, withContainer} from "./containers";
import {Home, Register, Login, Play, Live} from "./routes";


class Router extends React.Component<RouterProps, RouterState> {
    constructor(props:any) {
        super(props);
        this.state = {
            backgroundClass: "bg-core",
            ready: false,
            navLink: "/"
        } as RouterState;
    }
    
    sendActivity = (location:Location) => {
        ReactGA.pageview(location.pathname);
    }
    

    componentWillMount(): void {
        if (this.props.location) {
            this.sendActivity(this.props.location)
            
            this.applyBackground(this.props.location.pathname);
        }

        import("./FontAwesome")
            .then(fa => fa.init())
            .then(() => this.setState({ready:true}));
    }

    componentWillReceiveProps(nextProps: Readonly<RouterProps>, nextContext: any): void {
        
        if (nextProps.location) {
            // console.log(nextProps);
            this.sendActivity(nextProps.location);
            this.applyBackground(nextProps.location.pathname);
            // const str = nextProps.location.pathname;
            // if (str.match(/^\/(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i) && str !== nextProps.location.pathname) {
            //     this.setState({navLink: str})
            // } else if (!str.match(/^\/(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i) && str !== nextProps.location.pathname) {
            //     this.setState({navLink: "/"})
            // }
        }
    }

    applyBackground = (location:string) => {
        
        let bg = "bg-main";
        switch (location) {
            case "/":
                bg = "bg-splash";
                break;
            case "/register":
                bg = "bg-register";
                break;
            case "/login":
                bg = "bg-login";
                break;
        }
        this.setState({backgroundClass: bg});
    }

    public render() {
        const {backgroundClass, ready, navLink} = this.state

        return (
            <Container
                fullHeight fullWidth
                display={"flex"}
                direction={"column"}
                className={"bg-core px-0 " + backgroundClass}
            >
                <Subscribe to={[SocketContainer, StorageContainer]}>
                    {(socket:SocketContainer, storage:StorageContainer) => (
                        <NavigationPanel visible>
                            <NavigationTitle component={Link} className={"h2 text-dark text-decoration-none"} componentProps={{
                                //to: (inGame && inGame.match(/^\/(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)) ? inGame : "/"
                                to: navLink
                            }}>Backstory Trivia</NavigationTitle>
                            {/*<NavigationSubtitle>Another String Possible?</NavigationSubtitle>*/}
                            <NavigationItems>
                                <NavigationItem />
                                <NavigationItem />
                                <NavigationItem />
                                <NavigationItem />
                                <NavigationItem />
                                <div onClick={this.handleLeave(socket, storage)} className={"nav-item"}>Leave Game Session</div>
                                <div onClick={this.handleSignout(socket, storage)} className={"nav-item"}>Sign Out</div>
                            </NavigationItems>
                        </NavigationPanel>
                    )}
                </Subscribe>
                {ready && (
                    <Switch>
                        <Route path={"/"} exact={true} component={withContainer(Home, StorageContainer, PlayerContainer)} />
                        <Route path={"/register"} exact={true} component={withContainer(Register, StorageContainer, PlayerContainer)} />
                        <Route path={"/login"} exact={true} component={withContainer(Login, StorageContainer, PlayerContainer)} />
                        <Route path={"/play"} exact={true} component={withContainer(Play, StorageContainer, PlayerContainer, SocketContainer)} />
                        <Route path={"/:live"} exact={true} component={withContainer(Live, StorageContainer, PlayerContainer, SocketContainer)} />
                    </Switch>
                )}
            </Container>
        );
    }

    handleLeave = (socket:SocketContainer, storage:StorageContainer, stay?:boolean) => {
        return (evt:SyntheticEvent) => {

            // const {socket, storage} = this.props.containers;
            socket.disconnect();
            storage.clearGameID();
            storage.clearTeamKey();

            socket.setState({
                status: "", room: undefined, activeKey: undefined,
            })
            if (stay)
                return;
            this.props.history.push("/");
        }
    }

    handleSignout = (socket:SocketContainer, storage:StorageContainer) => {
        return (evt:SyntheticEvent) => {
            this.handleLeave(socket, storage, true);
            storage.clearToken();
            storage.clearEmail();
            storage.clearPin();
            this.props.history.push("/");
        }
    }
}

interface RouterProps extends RouteProps, IRouterProps {
    state?: RouterState;
    // containers: {
    //     socket: SocketContainer;
    //     storage: StorageContainer;
    // }
}

interface RouterState {
    backgroundClass:string;
    ready:boolean;
    navLink: string;
}

export default withRouter(Router);
// export default withRouter(withContainer(Router, StorageContainer, SocketContainer));