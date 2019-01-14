import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {BrowserRouter} from "react-router-dom";
import Router from "./Router";
import TopNavigation from "./components/topnavigation/TopNavigation";
import SideNavigation from "./components/sidenavigation/SideNavigation";
import {Provider, Subscribe} from "unstated";
import UserContainer from "./containers/UserContainer";
import QuestionContainer from "./containers/QuestionContainer";


const styles = theme => ({
    root: {
        display: 'flex',
    },
});

class Main extends React.Component<MainProps, MainState> {


    constructor(props) {
        super(props);

        this.state = {
            open: false,
            isAuthorized: false,
            containers: {
                user: new UserContainer(),
                question: new QuestionContainer(),
            }
        } as MainState;
    }

    render() {
        const { } = this.props;
        const {containers} = this.state;
        const {user, question} = containers;
        return (
            <BrowserRouter>
                <Provider inject={[user, question]} >
                    <Subscribe to={[UserContainer]}>
                        {(user:UserContainer) => this._render(user)}
                    </Subscribe>
                </Provider>
            </BrowserRouter>
        );
    }

    _render(user:UserContainer, question?:QuestionContainer) {
        const { classes } = this.props;
        //const {isAuthorized,} = this.state
        const {verified, token, type} = user.state;
        let isAuthorized = false;
        if (verified && token && type) {
            isAuthorized = verified;
        }
        return (
            <div className={classes.root}>
                <CssBaseline />
                <TopNavigation
                    isAuthorized={isAuthorized}
                    isMenuOpen={this.state.open}
                    openMenu={() => this.setState({open: !this.state.open})}
                    logout={() => user.logout()}
                />
                <SideNavigation
                    isMenuOpen={this.state.open}
                    closeMenu={() => this.setState({open: false})}
                    isAuthorized={isAuthorized}
                    userType={type}
                />

                <Router initialized={!user.state.initializing} isAuthorized={isAuthorized} userType={type} />
            </div>
        )
    }
}

interface MainProps {
    classes: any;
    theme: any;
}

interface MainState {
    s:string;
    open: boolean;
    isAuthorized: boolean;
    containers: {
        user: UserContainer;
        question: QuestionContainer;
    }
}

// @ts-ignore
export default withStyles(styles, { withTheme: true })(Main);