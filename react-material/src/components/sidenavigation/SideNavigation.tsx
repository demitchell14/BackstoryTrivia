import * as React from "react";
import {SyntheticEvent} from "react";
import * as classNames from "classnames";
import {Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, withStyles,} from "@material-ui/core";

import {ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon,} from "@material-ui/icons"

import {RouterProps, withRouter} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const drawerWidth = 240;

const styles = theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing.unit * 7 + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9 + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    grow: {
        flexGrow: 1,
    },
    menuIcon: {
        fontSize: "1.5em"
    }
});


class SideNavigation extends React.Component<SideNavigationProps, SideNavigationState> {
    public constructor(props) {
        super(props);
        this.state = {
            // isOpen: true
        } as SideNavigationState

        //console.log(this.props.classes)
        
    }

    public render() {
        const {classes, theme, isMenuOpen} = this.props;
        return (
            <Drawer
                variant={isMobile() ? "temporary" : "permanent"}
                //variant="permanent"
                className={classNames(classes.drawer, {
                    [classes.drawerOpen]: isMenuOpen,
                    [classes.drawerClose]: !isMenuOpen,
                })}
                classes={{
                    paper: classNames({
                        [classes.drawerOpen]: isMenuOpen,
                        [classes.drawerClose]: !isMenuOpen,
                    }),
                }}
                open={isMenuOpen}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={this.handleClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>

                <Divider />

                <List onClick={this.handleStandardRoutes}>
                    <ListItem value={"/"} button>
                        <ListItemIcon><FontAwesomeIcon fixedWidth className={classes.menuIcon} icon={["fal", "home"]} /></ListItemIcon>
                        <ListItemText primary={"Home"} />
                    </ListItem>
                    <ListItem value={"/games"} button>
                        <ListItemIcon><FontAwesomeIcon fixedWidth className={classes.menuIcon} icon={["fal", "poll-h"]} /></ListItemIcon>
                        <ListItemText primary={"Find Game"} />
                    </ListItem>

                </List>

                {this.renderAdminRoutes()}
                {this.renderAuthorizedRoutes()}

            </Drawer>
        );
    }

    private renderAdminRoutes = () => {
        const {classes} = this.props;
        if (this.props.isAuthorized && this.props.userType === "moderator") {
            return (
                <div>
                    <Divider />
                    <List onClick={this.handleAuthorizedRoutes}>
                        <ListItem value={"/manage/games"} button>
                            <ListItemIcon><FontAwesomeIcon fixedWidth className={classes.menuIcon} icon={["fal", "clipboard-list-check"]} /></ListItemIcon>
                            <ListItemText primary={"Manage Games"} />
                        </ListItem>
                        <ListItem value={"/manage/questions"} button>
                            <ListItemIcon><FontAwesomeIcon fixedWidth className={classes.menuIcon} icon={["fal", "chart-network"]} /></ListItemIcon>
                            <ListItemText primary={"Manage Questions"} />
                        </ListItem>
                    </List>
                </div>
            )
        }

        return undefined;
    };

    private renderAuthorizedRoutes = () => {
        const {classes} = this.props;
        if (this.props.isAuthorized) {
            return (
                <div>
                    <Divider />
                    <List onClick={this.handleAuthorizedRoutes}>
                        <ListItem value={"/"} button>
                            <ListItemIcon><FontAwesomeIcon fixedWidth className={classes.menuIcon} icon={["fal", "sliders-v-square"]} /></ListItemIcon>
                            <ListItemText primary={"Manage Account"} />
                        </ListItem>
                        <ListItem value={"/"} button>
                            <ListItemIcon><FontAwesomeIcon fixedWidth className={classes.menuIcon} icon={["fal", "sign-out-alt"]} /></ListItemIcon>
                            <ListItemText primary={"Sign Out"} />
                        </ListItem>
                    </List>
                </div>
            )
        }

        return undefined;
    };

    private handleStandardRoutes = (evt:SyntheticEvent) => {
        const target = evt.target as HTMLDivElement;
        const link = target.closest("[value]") as HTMLDivElement & {value: string};
        if (link) {
            const href = link.getAttribute("value");
            if (href) {
                if (isMobile())
                    this.handleClose();
                this.props.history.push(href)
            }
        }
    };

    private handleAuthorizedRoutes = (evt:SyntheticEvent) => {
        const target = evt.target as HTMLDivElement;
        const link = target.closest("[value]") as HTMLDivElement & {value: string};
        if (link && this.props.isAuthorized) {
            const href = link.getAttribute("value");
            if (href) {
                if (isMobile())
                    this.handleClose();
                this.props.history.push(href)
            }
        }
    };

    private handleClose = (evt?) => {
        if (this.props.closeMenu) {
            this.props.closeMenu();
        }
    }
}

const isMobile = function() {
    return window.innerWidth <= 425;
};


interface SideNavigationProps extends RouterProps{
    state?: SideNavigationState;
    classes: any;
    theme: any
    isMenuOpen?: boolean;
    closeMenu?: () => void;
    isAuthorized?: boolean;
    userType?: string;
}

interface SideNavigationState {
    // isOpen: boolean;
}

// @ts-ignore
export default withStyles(styles, {withTheme: true})(withRouter(SideNavigation));