import * as React from "react";
import {Card} from "../../../components";
import {GameObject} from "../../../containers";

export class WaitView extends React.Component<WaitViewProps, WaitViewState> {
    public constructor(props:WaitViewProps) {
        super(props);
        this.state = {} as WaitViewState

        console.log(props);
    }

    public render() {
        const {data} = this.props;
        if (data) {
            return (
                <div className={"wait-view"}>
                    <Card fullWidth display={"flex"} className={"p-3 mb-3"} variant={"outlined"} color={"secondary"}>
                        {data.name.length < 20 ?
                            (<h4 className={"mb-0"}>{data.name}</h4>)
                            : (<h6 className={"mb-0"}>{data.name}</h6>)}
                        {data.description && (<p>{data.description}</p>)}
                    </Card>

                    <Card fullWidth display={"flex"} className={"p-3"} variant={"outlined"} color={"primary"}>
                        <p className={"lead mb-0"}>This game hasn't started just yet.</p>
                        <hr/>
                        <p>While we wait, have a look through the game menu at the bottom of your screen, and
                        see just how this actually works! The activity bar at the top of your screen will indicate
                        whether or not the game is running and needs your input. All you need to do is simply click
                        on it and it will bring you back to the game!</p>
                    </Card>
                </div>
            );
        }

        return (<div />)
    }
}

interface WaitViewProps {
    state?: WaitViewState;
    data?: GameObject;
}

interface WaitViewState {

}
