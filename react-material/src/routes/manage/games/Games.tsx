import * as React from "react";
import {Grid, withStyles} from "@material-ui/core";
import withContainer from "../../../containers/withContainer";
import UserContainer from "../../../containers/UserContainer";


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
});

class Games extends React.Component<GamesProps, GamesState> {
    public constructor(props) {
        super(props);
        this.state = {} as GamesState
    }

    public render() {
        const {classes} = this.props;
        return (
            <main className={classes.content}>
                <div className={classes.toolbar}/>
                <Grid container>
                    contents here
                </Grid>
            </main>
        );
    }
}

interface GamesProps {
    state?: GamesState;
    classes?: any;
    theme?: any;
    containers?: {
        user: UserContainer
    }
}

interface GamesState {

}

export default withStyles(styles, {withTheme: true})(withContainer(Games, [UserContainer]));