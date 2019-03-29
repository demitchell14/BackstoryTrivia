import * as React from "react";
import {Transition} from "react-spring/renderprops-universal";
import {MultipleChoice} from "../";
import {Card} from "../../../components";
import {GameObject, QuestionDetails, SocketContainer, SocketState} from "../../../containers";

export class PlayView extends React.Component<PlayViewProps, PlayViewState> {
    type = {
        "Multiple Choice": MultipleChoice,
        "Multiple Choice2": (props: any) => {
            const choices = ["A", "B", "C", "D", "E"];

            return (
                <Card fullWidth className={"answers p-0 mx-0"} color={"primary"}>
                    {choices.map((c, i) => (
                        <div key={i} className={"choice"}>
                            <span>Choice {c}</span>
                        </div>
                    ))}
                </Card>
            )
        },
        "Open Ended": (props: any) => (
            <Card style={props.style} fullWidth display={"flex"} variant={"outlined"} color={"primary"}>
                <p className={"mb-0"}>This question is open ended. Type your answer in the block below to submit your
                    answer.</p>
                <textarea className={"form-control"} autoFocus placeholder={"Enter your answer here"}/>
            </Card>
        )
    }

    public constructor(props: PlayViewProps) {
        super(props);
        this.state = {} as PlayViewState
    }

    componentDidMount(): void {
        console.log(this);
    }

    simplify = (state: SocketState): SimplifiedSocketState => {
        const ret = {} as SimplifiedSocketState;
        const {question, gameStatus, game} = state;
        if ((gameStatus && gameStatus.started && !gameStatus.paused)
            && (game && game.started && !game.paused) && question) {
            // Question is currently running
            ret.question = {
                ...question
            };
            ret.game = {
                ...game
            }
        }
        return ret;
    };

    public render() {
        const socketState = this.simplify(this.props.socket.state);
        if (socketState.question && socketState.game) {
            const {question} = socketState;
            const Obj = this.type[socketState.question.type];
            // const Obj = "noop";
            if (typeof Obj !== "undefined") {
                return (
                    <div style={this.props.style} className={"play-view"}>
                        <div className={"card card-color-secondary p-0 mb-3"}>
                            {question.image && (
                                <img src={question.image} className={"card-img-top"} alt={question.question}/>
                            )}
                            <div className={"card-body test"}>
                                <p className={`lead ${question.details ? "" : "mb-0"}`}>{question.question}</p>
                                {question.details && (
                                    <p>{question.details}</p>
                                )}
                            </div>
                        </div>
                        {/*<Card display={"flex"} className={"p-3 mb-3 mx-2"} variant={"outlined"} color={"secondary"}>*/}
                        {/*    {game.name.length < 20 ?*/}
                        {/*        (<h4 className={"mb-1 border-bottom"}>{game.name}</h4>)*/}
                        {/*        : (<h6 className={"mb-1 border-bottom"}>{game.name}</h6>)}*/}
                        {/*        <p className={""}>{question.question}</p>*/}
                        {/*    /!*{game.description && (<p>{game.description}</p>)}*!/*/}
                        {/*</Card>*/}

                        <Transition
                            items={Obj}
                            from={{opacity: 0}}
                            enter={{opacity: 1}}
                            leave={{opacity: 0}}
                        >
                            {(Show: MultipleChoice | any) => Show && (props => <Show style={props}
                                                                                     onSubmit={(ans: any) => console.log(`Answer: '${ans}'`)} {...question} />)}
                        </Transition>

                        {/*{typeof Obj === "function" && (<Obj onSubmit={(ans:any) => console.log(`Answer: '${ans}'`)} {...question}  />)}*/}

                    </div>
                );
            }
            // Failed to render a Question Type Object
            return (<div style={this.props.style}/>)
        }
        // Question or Game data is not set and question isn't currently running
        return (<div style={this.props.style}/>)
    }
}

interface SimplifiedSocketState {
    question?: QuestionDetails;
    game?: GameObject;

}

interface PlayViewProps {
    state?: PlayViewState;
    socket: SocketContainer;
    style?: React.CSSProperties;
}

interface PlayViewState {

}

export default PlayView