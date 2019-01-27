import * as React from "react";
import {BottomNavigation, BottomNavigationAction, Paper, Tab, Tabs, withStyles} from "@material-ui/core";
import withContainer from "../../../containers/withContainer";
import UserContainer from "../../../containers/UserContainer";
import Home from "./home";
import Builder from "./builder";

import "./styles.css"
import {match as MatchProps, RouteProps, RouterProps, withRouter} from "react-router";

const FAIcon = React.lazy(() => import("../../../FontAwesome"));
// import {CSSTransition, TransitionGroup,} from "react-transition-group";


const styles = theme => ({
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        overflowX: "hidden",
        marginBottom: 100
    },
    inputRoot: {
        //margin: "6px 8px 2px",
        marginBottom: theme.spacing.unit,
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: "auto",
    },

    input: {
        marginLeft: 8,
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        width: 1,
        height: 28,
        margin: 4,
    },
    tabOffset: {
        marginBottom: "1rem"
    },
    bottomNav: {
        position: "fixed",
        width: "100%",
        left: 0,
        bottom: 0,
        zIndex: 1000
    },
    navIcon: {
        fontSize: "1.4em"
    },
    scroller: {
        overflowX: "auto"
    }
});

class Games extends React.Component<GamesProps, GamesState> {

    private tabs = [
        {
            name: "Home",
            component: Home,
            icon: ["far", "home"],
            props: {},
            path: "/manage/games"
        },
        {
            name: "Games",
            component: props => <p>I need to be made!</p>,
            icon: ["fal", "clipboard-list-check"],
            props: {},
            path: "/manage/games/list"
        },
        {
            name: "Builder",
            component: Builder,
            icon: ["fas", "plus-circle"],
            props: {},
            path: "/manage/games/builder"
        }
    ] as any;

    public constructor(props) {
        super(props);
        this.state = {
            selectedTab: 2
        } as GamesState;

    }

    public render() {

        // [
        //     {label: "Home", icon: <FAIcon className={classes.navIcon} fixedWidth icon={["far", "home"]} />},
        //     {label: "Games", icon: <FAIcon className={classes.navIcon} fixedWidth icon={["fal", "clipboard-list-check"]} />},
        //     {label: "Builder", icon: <FAIcon className={classes.navIcon} fixedWidth icon={["fas", "plus-circle"]} />},
        //     //{label: "Home", icon: <FAIcon className={classes.navIcon} icon={["far", "home"]} />}
        // ]
        const {classes, match} = this.props;

        const target = this.tabs.find(t => t.path === match.url);
        return (
            <main className={classes.content}>
                <div className={classes.toolbar}/>
                <Navigator
                    classes={classes}
                    active={target.name}
                    tabs={this.tabs.map(tab => ({
                        label: tab.name,
                        icon: <FAIcon fixedWidth className={classes.navIcon} icon={tab.icon}/>
                    }))}
                    onChange={this.handleTabChange}
                />
                <div style={{width: "100%", position: "relative"}}>
                    {target && React.createElement(target.component, {
                        ...target.props
                    })}
                    {/*<TransitionGroup>*/}
                    {/*<CSSTransition key={target ? target.name : -1} timeout={500} classNames={"slide-down"}>*/}
                    {/**/}
                    {/*</CSSTransition>*/}
                    {/*</TransitionGroup>*/}
                </div>
            </main>
        );
    }

    handleTabChange = (evt, n) => {
        const {history, match} = this.props;
        const target = this.tabs.find(t => t.name === n);
        if (target && match.url !== target.path) {
            history.push(target.path);
        }
        // this.setState({selectedTab: n});
    };

    componentWillReceiveProps(nextProps: Readonly<GamesProps>, nextContext: any): void {

    }
}

const Navigator = props => {
    const {classes, tabs, active, onChange} = props;
    if (window.innerWidth > 425) {
        return (
            <Paper elevation={1} className={classes.tabOffset}>
                <Tabs value={active} fullWidth scrollable scrollButtons={"auto"} onChange={onChange}
                      classes={{scrollable: classes.scroller}}>
                    {tabs ? tabs.map((tab, id) => <Tab key={id} value={tab.label} label={tab.label}
                                                       icon={tab.icon}/>) : undefined}
                </Tabs>
            </Paper>
        )
    }
    return (
        <BottomNavigation value={active} className={props.classes.bottomNav} onChange={onChange}>
            {tabs ? tabs.map((tab, id) => <BottomNavigationAction key={id} value={tab.label} label={tab.label}
                                                                  icon={tab.icon}/>) : undefined}
        </BottomNavigation>
    )
};

interface GamesProps extends RouteProps, RouterProps {
    state?: GamesState;
    classes?: any;
    theme?: any;
    containers?: {
        user: UserContainer
    }
    match: MatchProps;
}

interface GamesState {
    selectedTab: number;
}

// @ts-ignore
export default withStyles(styles, {withTheme: true})
(withRouter(withContainer(Games, [UserContainer])));