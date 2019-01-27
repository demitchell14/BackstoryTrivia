import * as React from "react";
import {AppBar, Button, IconButton, Menu, MenuItem, Toolbar, Typography, withStyles,} from "@material-ui/core";

import AccountCircle from "@material-ui/icons/AccountCircle"
import MenuIcon from "@material-ui/icons/Menu"

import classNames from 'classnames';
import {RouterProps, withRouter} from "react-router";
import {Link} from "react-router-dom";

const drawerWidth = 240;

const styles = theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        whiteSpace: "nowrap",
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    grow: {
        flexGrow: 1,
    },
    moveBack: {
        zIndex: theme.zIndex.drawer - 1,
    },
    colorCorrection: {
        textDecoration: "none",
        color: "inherit"
    }
});

class TopNavigation extends React.Component<TopNavigationProps, TopNavigationState> {
    public constructor(props) {
        super(props);
        this.state = {
            menuAnchorEl: null
        } as TopNavigationState
    }

    public handleDrawerOpen = (evt) => {
        //console.log("Open Menu");
        if (this.props.openMenu) {
            this.props.openMenu();
        }
    };

    public render() {
        const {classes, isAuthorized, isMenuOpen} = this.props;
        const { menuAnchorEl } = this.state;
        const open = Boolean(menuAnchorEl);

        return (
            <AppBar
                position="fixed"
                className={classNames(classes.appBar, {
                    [classes.appBarShift]: isMenuOpen && !isMobile(),
                    [classes.moveBack]: isMenuOpen,
                })}
            >
                <Toolbar className={classNames(classes.toolbar, {

                })} disableGutters={!isMenuOpen}>
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={this.handleDrawerOpen}
                        className={classNames(classes.menuButton, {
                            [classes.hide]: isMenuOpen,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            <Link to={"/"} className={classes.colorCorrection}>
                                Backstory Trivia
                            </Link>
                        </Typography>
                    {isAuthorized ? (
                        <div>
                            <IconButton
                                aria-owns={open ? 'menu-appbar' : undefined}
                                aria-haspopup="true"
                                onClick={this.handleAccountMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>

                            <Button onClick={this.handleLogout} color={"inherit"}>Logout</Button>

                            <Menu
                                id="menu-appbar"
                                anchorEl={menuAnchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={this.closeAccountMenu}
                            >
                                <MenuItem onClick={this.closeAccountMenu}>Profile</MenuItem>
                                <MenuItem onClick={this.closeAccountMenu}>My account</MenuItem>
                            </Menu>
                        </div>
                    ) : (
                        <div>
                            <Button onClick={() => this.props.history.push("/signin")} color={"inherit"}>Signin / Register</Button>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        );
    }

    private handleAccountMenu = (evt) => {
        this.setState({menuAnchorEl: evt.currentTarget})

    };

    private closeAccountMenu = (evt) => {
        this.setState({menuAnchorEl: null})
    };
    
    private handleLogout = (evt) => {
        if (this.props.logout) {
            this.props.logout();
        }
    }
}

const isMobile = function() {
    return window.innerWidth <= 425;
};

interface TopNavigationProps extends RouterProps {
    state?: TopNavigationState;
    classes: any;
    theme: any;
    isAuthorized?: boolean;
    isMenuOpen?: boolean;
    openMenu?: () => void;
    logout?: () => void;
}

interface TopNavigationState {
    menuAnchorEl: any;
}

export default withStyles(styles, {withTheme: true})(withRouter(TopNavigation))