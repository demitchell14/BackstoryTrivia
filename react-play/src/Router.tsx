import * as React from "react";
import {Route, Switch, withRouter, RouteProps, RouterProps as IRouterProps} from "react-router";
import {Container, NavigationItem, NavigationItems, NavigationPanel, NavigationTitle} from "./components";

import {StorageContainer, withContainer} from "./containers";
import {PlayerContainer} from "./containers/player/Container";
import {Home, Register} from "./routes";


class Router extends React.Component<RouterProps, RouterState> {
    constructor(props:any) {
        super(props);
        this.state = {
            backgroundClass: "bg-core"
        } as RouterState;
    }

    componentWillMount(): void {
        if (this.props.location) {
            this.applyBackground(this.props.location.pathname);
        }
    }

    componentWillReceiveProps(nextProps: Readonly<RouterProps>, nextContext: any): void {
        
        if (nextProps.location) {
            this.applyBackground(nextProps.location.pathname);
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
        }
        this.setState({backgroundClass: bg});
    }

    public render() {
        const {backgroundClass} = this.state;


        return (
            <Container
                fullHeight fullWidth
                display={"flex"}
                direction={"column"}
                className={"bg-core " + backgroundClass}
            >
                <NavigationPanel visible locked>
                    <NavigationTitle>Backstory Trivia</NavigationTitle>
                    {/*<NavigationSubtitle>Another String Possible?</NavigationSubtitle>*/}
                    <NavigationItems>
                        <NavigationItem />
                        <NavigationItem />
                        <NavigationItem />
                        <NavigationItem />
                        <NavigationItem />
                    </NavigationItems>
                </NavigationPanel>
                <Switch>
                    <Route path={"/"} exact={true} component={withContainer(Home, StorageContainer, PlayerContainer)} />
                    <Route path={"/register"} exact={true} component={withContainer(Register, StorageContainer, PlayerContainer)} />
                </Switch>
            </Container>
        );
    }
}

interface RouterProps extends RouteProps, IRouterProps {
    state?: RouterState;
}

interface RouterState {
    backgroundClass:string;
}

export default withRouter(Router);