import * as React from "react";
import {Typography, withStyles, Theme} from "@material-ui/core";

const styles = (theme:Theme) => ({
    
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


class Home extends React.Component<HomeProps, HomeState> {
    public constructor(props) {
        super(props);
        this.state = {} as HomeState
    }

    public render() {
        const {classes} = this.props;
        return (
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Typography paragraph>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent
                    elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in
                    hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum
                    velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing.
                    Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis
                    viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo.
                    Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus
                    at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed
                    ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
                </Typography>
                <Typography paragraph>
                    Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
                    facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
                    tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
                    consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus
                    sed vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in.
                    In hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
                    et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique
                    sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo
                    viverra maecenas accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam
                    ultrices sagittis orci a.
                </Typography>
            </main>
        );
    }
}

interface HomeProps {
    state?: HomeState;
    classes: any;
}

interface HomeState {

}

export default withStyles(styles, { withTheme: true })(Home)