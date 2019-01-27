import * as React from 'react';
import {withStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {BrowserRouter} from "react-router-dom";
import Router from "./Router";
import TopNavigation from "./components/topnavigation/TopNavigation";
import SideNavigation from "./components/sidenavigation/SideNavigation";
import UserContainer from "./containers/UserContainer";
import QuestionContainer from "./containers/QuestionContainer";
import withContainer from "./containers/withContainer";


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
        } as MainState;
    }

    componentWillMount(): void {
        import(/* webpackChunkName: "fa" */"./FontAwesome")
            .then(fa => fa.init())
            .then(() => this.forceUpdate());
    }

    render() {
        const {classes, containers} = this.props;

        console.log(containers);
        //const {isAuthorized,} = this.state

        if (containers) {
            const {user} = containers;
            const {verified, token, type} = user.state;
            let isAuthorized = false;
            if (verified && token && type) {
                isAuthorized = verified;
            }
            return (
                <BrowserRouter>
                    <React.Suspense fallback={"Loading"}>
                        <div className={classes.root}>
                            <CssBaseline/>
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

                            <Router initialized={!user.state.initializing} isAuthorized={isAuthorized} userType={type}/>
                        </div>
                    </React.Suspense>
                </BrowserRouter>
            )
        }
        return (
            <div className={classes.root}>
                Loading???
            </div>
        )
    }
}

interface MainProps {
    classes: any;
    theme: any;
    containers: {
        user: UserContainer;
        question: QuestionContainer;
    }
}

interface MainState {
    s:string;
    open: boolean;
    isAuthorized: boolean;
}

// @ts-ignore
export default withStyles(styles, {withTheme: true})(withContainer(Main, [UserContainer, QuestionContainer]));