import * as React from "react";
import {Card, CardBody, CardTitle} from "../../components";

class WaitView extends React.Component<WaitViewProps, WaitViewState> {
    public constructor(props:WaitViewProps) {
        super(props);
        this.state = {} as WaitViewState
    }

    public render() {
        return (
            <Card fullWidth display={"flex"} className={"p-3"} variant={"outlined"} theme={"dark"}>
                <CardTitle>Need to Make Me!</CardTitle>
                <CardBody fullWidth>I'm the Wait View for in between questions and games... this needs to look good I think...</CardBody>
            </Card>
        );
    }
}

interface WaitViewProps {
    state?: WaitViewState;
}

interface WaitViewState {

}

export default WaitView