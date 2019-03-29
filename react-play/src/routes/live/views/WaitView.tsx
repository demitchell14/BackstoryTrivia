import * as React from "react";
import {Card} from "../../../components";
import {GameObject} from "../../../containers";

export class WaitView extends React.Component<WaitViewProps, WaitViewState> {
    public constructor(props:WaitViewProps) {
        super(props);
        this.state = {} as WaitViewState;

        console.log(props);
    }

    public render() {
        const {data} = this.props;
        if (data) {
            return (
                <div style={this.props.style} className={"wait-view"}>
                    <Card fullWidth display={"flex"} className={"p-3 mb-3"} variant={"outlined"} color={"secondary"}>
                        {data.name.length < 20 ?
                            (<h4 className={"mb-0"}>{data.name}</h4>)
                            : (<h6 className={"mb-0"}>{data.name}</h6>)}
                        {data.description && (<p>{data.description}</p>)}
                    </Card>

                    <Card fullWidth display={"flex"} className={"p-3"} variant={"outlined"} color={"primary"}>
                        {data.started && data.paused ? (
                            <div>
                                <p className={"lead mb-0"}>This game has started!</p>
                                <p className={"lead mb-0"}>We are currently waiting on a question to start..</p>
                            </div>
                        ) : (!data.started && (
                            <p className={"lead mb-0"}>This game hasn't started just yet.</p>
                        ))}
                        <hr/>
                        {data.started && data.paused ? (
                            <div>
                                <p>This game is about to begin! Hang tight on this page until a question appears on screen!</p>
                                <p className={"text-muted"}>Please note that this is currently in the testing phases and may not work 100%.
                                That being said, be sure to have your answers on paper as well</p>
                            </div>
                        ) : (!data.started && (
                            <p>While we wait, have a look through the game menu at the bottom of your screen, and
                                see just how this actually works! The activity bar at the top of your screen will indicate
                                whether or not the game is running and needs your input. All you need to do is simply click
                                on it and it will bring you back to the game!</p>
                        ))}

                        {data.started && !data.paused && (
                            <div>
                                <p>Loading Question...</p>
                                <p>This should only take a few moments.</p>
                            </div>
                        )}
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
    style?: React.CSSProperties;
}

interface WaitViewState {

}
