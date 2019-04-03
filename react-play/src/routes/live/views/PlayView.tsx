import {RefObject, SyntheticEvent} from "react";
import * as React from "react";
import {Transition} from "react-spring/renderprops-universal";
import {MultipleChoice} from "../";
import {Card} from "../../../components";
import {GameObject, PlayerContainer, QuestionDetails, SocketContainer, SocketState} from "../../../containers";
import logger from "../../../util/logger";

export class PlayView extends React.Component<PlayViewProps, PlayViewState> {
    openEndedAnswer: RefObject<HTMLTextAreaElement>;
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
            <form style={props.style} className={"card-secondary p-3 tint-secondary"}>
                <p className={"mb-0"}>This question is open ended. Type your answer in the block below to submit your
                    answer.</p>
                <hr />
                <textarea ref={this.openEndedAnswer} className={"form-control mb-2"} placeholder={"Enter your answer here"}/>
                <button onClick={this.submitAnswer} className={"btn btn-block btn-primary"} type={"button"}>Submit Answer</button>
            </form>
        )
    }

    public constructor(props: PlayViewProps) {
        super(props);
        this.state = {
            isSubmitted: false,
        } as PlayViewState

        this.openEndedAnswer = React.createRef();
    }

    componentDidMount(): void {
        logger.log(this);

    }

    componentWillReceiveProps(nextProps: Readonly<PlayViewProps>, nextContext: any): void {
        const state = this.simplify(nextProps.socket.state);
        if (state.question) {
            const question = state.question;
            const isAnswered = this.props.player.isAnswered(question._id||question.question);
            this.setState({isSubmitted: isAnswered});
        }
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

    submitAnswer = (answer:string|SyntheticEvent) => {
        const {socket, player} = this.props;
        if (typeof answer === "string") {
            socket.sendAnswer(player, answer);
        } else {
            if (this.openEndedAnswer.current) {
                answer.preventDefault();
                let ans = this.openEndedAnswer.current;
                if (ans.value.length > 0) {
                    socket.sendAnswer(player, ans.value);
                } else {
                    if (this.props.onNotify) {
                        this.props.onNotify("Please enter an answer to submit.");
                    }
                }
            }
        }
    }

    public render() {
        const {isSubmitted} = this.state;
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
                            {(Show: MultipleChoice | any) => Show && (props => <Show style={props} isSubmitted={isSubmitted}
                                                                                     onSubmit={this.submitAnswer} {...question} />)}
                        </Transition>

                        {/*{typeof Obj === "function" && (<Obj onSubmit={(ans:any) => logger.log(`Answer: '${ans}'`)} {...question}  />)}*/}

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
    player: PlayerContainer;
    style?: React.CSSProperties;
    onNotify?: (message:string) => any;
}

interface PlayViewState {
    isSubmitted: boolean;
}

export default PlayView