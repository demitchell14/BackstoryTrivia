import * as React from "react";
import {Paper} from "@material-ui/core";

class Home extends React.Component<HomeProps, HomeState> {
    public constructor(props: HomeProps) {
        super(props);
        this.state = {} as HomeState
    }

    public render() {
        return (
            <Paper className={"test"}>
                Hello from Games Home
            </Paper>
        );
    }
}

interface HomeProps {
    state?: HomeState;
}

interface HomeState {

}

export default Home