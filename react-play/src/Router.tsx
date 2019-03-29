import {Location} from "history";
import {SyntheticEvent} from "react";
import * as React from "react";
import {Route, Switch, withRouter, RouteProps, RouterProps as IRouterProps} from "react-router";
import {Link} from "react-router-dom";
import { Transition } from 'react-spring/renderprops'
import {Subscribe} from "unstated";
import {Container, NavigationItem, NavigationItems, NavigationPanel, NavigationTitle} from "./components";

import * as ReactGA from "react-ga";

import {SocketContainer, StorageContainer, PlayerContainer, withContainer} from "./containers";
import {Register, Login} from "./routes";

const Home = React.lazy(() => import("./routes/home/Home"));
const Play = React.lazy(() => import("./routes/play/Play"));
const Live = React.lazy(() => import("./routes/live/Live"));


class Router extends React.Component<RouterProps, RouterState> {
    constructor(props:any) {
        super(props);
        this.state = {
            backgroundClass: "bg-core",
            // ready: false,
            navLink: (props:RouterProps, socket:SocketContainer) => {
                if (props.location && props.location.pathname) {
                    const str = props.location.pathname;
                    const matches = str.match(/^\/(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i);
                    if (matches && socket.connected() && socket.state.status === "authenticated") {
                        return str;
                    }
                }
                return "/";
            }
        } as RouterState;
    }
    
    sendActivity = (location:Location) => {
        const str = location.pathname;
        const matches = str.match(/^\/(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i);
        if (matches)
            return;

        ReactGA.pageview(location.pathname);
    }
    

    componentWillMount(): void {
        if (this.props.location) {
            this.sendActivity(this.props.location)
            
            this.applyBackground(this.props.location.pathname);
        }
    }

    componentWillReceiveProps(nextProps: Readonly<RouterProps>, nextContext: any): void {
        
        if (nextProps.location) {
            // logger.log(nextProps);
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
        const {backgroundClass, navLink} = this.state;
        const {location} = this.props;

        // @ts-ignore
        const routes = [
            {
                key: "/",
                path: "/",
                exact: true,
                component: withContainer(Home, StorageContainer, PlayerContainer, SocketContainer)
            },
            {
                key: "/register",
                path: "/register",
                exact: true,
                component: withContainer(Register, StorageContainer, PlayerContainer)
            },
            {
                key: "/login",
                path: "/login",
                exact: true,
                component: withContainer(Login, StorageContainer, PlayerContainer)
            },
            {
                key: "/play",
                path: "/play",
                exact: true,
                component: withContainer(Play, StorageContainer, PlayerContainer, SocketContainer)
            },
            {
                key: "/:live",
                path: "/:live",
                exact: true,
                component: withContainer(Live, StorageContainer, PlayerContainer, SocketContainer)
            },
        ]

        // <Route path={"/"} exact={true} component={withContainer(Home, StorageContainer, PlayerContainer, SocketContainer)} />
        // <Route path={"/register"} exact={true} component={withContainer(Register, StorageContainer, PlayerContainer)} />
        // <Route path={"/login"} exact={true} component={withContainer(Login, StorageContainer, PlayerContainer)} />
        // <Route path={"/play"} exact={true} component={withContainer(Play, StorageContainer, PlayerContainer, SocketContainer)} />
        // <Route path={"/:live"} exact={true} component={withContainer(Live, StorageContainer, PlayerContainer, SocketContainer)} />

        return (
            <Container
                fullHeight fullWidth
                display={"flex"}
                direction={"column"}
                className={"bg-core no-overflow-x px-0 " + backgroundClass}
            >
                <Subscribe to={[SocketContainer, StorageContainer]}>
                    {(socket:SocketContainer, storage:StorageContainer) => (
                        <NavigationPanel visible>
                            <NavigationTitle component={Link} className={"h2 text-dark text-decoration-none"} componentProps={{
                                //to: (inGame && inGame.match(/^\/(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)) ? inGame : "/"
                                to: navLink(this.props, socket),
                                onDoubleClick: (evt:SyntheticEvent) => this.props.history.push("/")
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
                {location && (
                    <Transition
                        // native
                        config={{
                            // duration: 10000,
                        }}
                        items={location}
                        keys={location.pathname.split("/")[1]}
                                from={{ position: "absolute", transform: 'translateX(200px)', opacity: 0 }}
                                enter={{ position: "relative", transform: 'translateX(0px)', opacity: 1 }}
                                leave={{ height: "100%", position: "absolute", transform: 'translateX(-200px)', opacity: 0 }}
                    >
                        {(loc, state) => style => {
                            return (
                                <Switch location={state === 'update' ? location : loc}>
                                    <Route path={"/"} exact={true} render={(props) => {
                                        return withContainer(Home, StorageContainer, PlayerContainer, SocketContainer)({... props, style})
                                    }} />
                                    <Route path={"/register"} exact={true} render={props => withContainer(Register, StorageContainer, PlayerContainer)({... props, style})} />
                                    <Route path={"/login"} exact={true} render={props => withContainer(Login, StorageContainer, PlayerContainer)({... props, style})} />
                                    <Route path={"/play"} exact={true} render={props => withContainer(Play, StorageContainer, PlayerContainer, SocketContainer)({... props, style})} />
                                    <Route path={"/:live"} exact={true} render={props => withContainer(Live, StorageContainer, PlayerContainer, SocketContainer)({... props, style})} />
                                </Switch>
                            )
                        }}
                    </Transition>

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
    state: RouterState;
    // containers: {
    //     socket: SocketContainer;
    //     storage: StorageContainer;
    // }
}

interface RouterState {
    backgroundClass:string;
    // ready:boolean;
    navLink: (props:RouterProps, socket:SocketContainer) => string;
}

export default withRouter(Router);
// export default withRouter(withContainer(Router, StorageContainer, SocketContainer));