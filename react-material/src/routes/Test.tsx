import * as React from "react";
import {withStyles} from "@material-ui/core";

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
});

class Test extends React.Component<TestProps, TestState> {
    public constructor(props) {
        super(props);
        this.state = {} as TestState
    }

    public render() {
        const {classes} = this.props;
        return (
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <div>
                    Body
                </div>
            </main>
        );
    }
}

interface TestProps {
    state?: TestState;
    classes:any;
}

interface TestState {

}

export default withStyles(styles)(Test)