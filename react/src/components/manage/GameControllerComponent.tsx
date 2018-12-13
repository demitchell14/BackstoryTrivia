import * as React from "react";
import * as SocketIO from "socket.io-client";

import {GameOptions, Question} from "../../routes/GameList";
import {Api} from "../../store/api";
import ManageQuestionComponent from "./ManageQuestionComponent";
import TimeBarComponent from "../TimeBarComponent";

let api = Api();
class GameControllerComponent extends React.Component<GameControllerProps, GameControllerState> {

    public constructor(props) {
        super(props);

        this.state = {
            gameID: this.props.game.token,
            socket: SocketIO.connect({
                autoConnect: false
            })
        } as GameControllerState;

    }

    public componentWillMount() {

    }

    public componentDidMount() {
        if (this.props.authorized) {
            const socket = this.state.socket;
            //console.log(api, this.state.socket);
            socket.connect();
            socket.on("connect", () => {
                api.session.managerAuthorization(this.state.gameID);
                // -- key TODO
                socket.emit("ready", {key: "something else", game: this.state.gameID});

                socket.once("authorized", (response) => {
                    if (response === "success")
                        this.setState({authorized: true});
                })

                const genericSocketFunction = (response:SocketResponse) => {
                    if (response.error) {
                        console.error("ERROR");
                        alert(response.error)
                    } else {
                        if (this.props.controller) {
                            this.props.controller(response.data);
                        }
                    }
                };
                socket.on("game start", genericSocketFunction);
                socket.on("game stop", genericSocketFunction);
                socket.on("game toggle", genericSocketFunction)
                socket.on("team answered", genericSocketFunction);
                socket.on("question timer", genericSocketFunction);
            })
        }
    }

    componentWillUnmount() {
        const socket = this.state.socket;
        socket.disconnect();
    }


    // @ts-ignore
    private teamAnswered(ans) {
        console.log(ans);
    }

    private gameStart() {
        const socket = this.state.socket;
        socket.emit("game start");
    }

    private gameStop() {
        const socket = this.state.socket;
        socket.emit("game stop");
    }

    private gameToggle() {
        const socket = this.state.socket;
        socket.emit("game toggle");
    }

    private nextQuestion() {
        const socket = this.state.socket;
        socket.emit("game next question");
    }

    private gameReset() {
        const socket = this.state.socket;
        socket.emit("game reset")
    }

    public render() {
        // @ts-ignore
        let data = this.props.game.questions[this.props.game.currentQuestionId] || {} as Question;

        let correctAnswer = "";
        if (data.choices && data.choices.length > 0) {
            let ans = data.choices.find(c => c.correct)
            if (ans) correctAnswer = ans.answer;
        } else correctAnswer = data.answer;


        return (
            <div className={"card"}>
                <div className={"card-body"}>
                    <div className={"card-title"}>
                        <h4>Game Controller</h4>
                    </div>
                    {this.state.authorized ? (
                        <div>
                            <div className={"row"}>
                                <div className={"col text-center"}>{this.startHandler()}</div>
                                <div className={"col text-center"}>{this.gameToggler()}</div>
                                <div className={"col text-center"}>{this.nextBtn()}</div>
                                <div className={"col text-center"}>{this.resetBtn()}</div>
                            </div>
                            <hr/>
                            {this.props.game.started ? (
                                <div className={`alert alert-${this.props.game.paused || this.props.game.currentQuestionId < 0 ? "danger" : "success"}`}>
                                    <h5 className={"alert-heading"}>{this.props.game.paused || this.props.game.currentQuestionId < 0 ? "Game State" : "Time Left"}</h5>
                                    {this.props.game.paused || this.props.game.currentQuestionId < 0 ? (
                                        <p className={"mb-0 lead"}>Game is Paused!</p>
                                    ) : (
                                        <TimeBarComponent
                                            className={"d-block my-2"}
                                            label={false}
                                            color={"success"}
                                            current={data.timeLeft}
                                            max={data.timeLimit}/>
                                    )}
                                </div>
                            ) : ""}
                            {data.question && this.props.game.started ? (
                                    <div className={"alert alert-info"}>

                                        <h5 className={"alert-heading"}>Current Question</h5>
                                        <p className={"mb-0"}>{data.question ? data.question : "Unknown."}</p>
                                        <hr/>
                                        <p className={"mb-0"}><b>Correct Answer:</b> {correctAnswer}</p>
                                    </div>
                            ) : ""}
                            <div className={"row mt-3"}>
                                {this.props.game.started ? (
                                    <ManageQuestionComponent
                                        active={{started: this.props.game.started, paused: this.props.game.paused}}
                                        teams={this.props.game.teams}
                                        questionid={this.props.game.currentQuestionId}
                                        questions={this.props.game.questions} />
                                ) : ""}
                            </div>
                        </div>
                    ) : "Authorizing..."}
                </div>
            </div>
        )
    }

    private resetBtn() {
        let text = "Reset",
            cls = "btn-danger",
            click = this.gameReset.bind(this);

        return (
            <button onClick={click} className={`btn ${cls}`}>{text}</button>
        )
    }

    private nextBtn() {
        let text = "Next Question",
            cls = "btn-primary",
            click = this.nextQuestion.bind(this);

        return (
            <button onClick={click} className={`btn ${cls}`} disabled={!this.props.game.started}>{text}</button>
        )
    }

    private startHandler() {
        let text = "Start Game";
        let cls  = "btn-success"
        let click = this.gameStart.bind(this);
        if (this.props.game.started) {
            cls = "btn-danger";
            text = "Stop Game";
            click = this.gameStop.bind(this);
        }

        return (
            <button onClick={click} className={`btn ${cls}`}>{text}</button>
        )
    }

    private gameToggler() {
        let text = "Pause Game",
            cls = "btn-warning",
            click = this.gameToggle.bind(this);

        if (this.props.game.paused) {
            text = "Resume Game";
            cls = "btn-info";
        }

        if (!this.props.game.started) {
            text = "Start Game First";
            cls = "btn-secondary"
        }


        return (
            <button onClick={click} className={`btn ${cls}`} disabled={!this.props.game.started}>{text}</button>
        )
    }
}


export interface SocketResponse {
    error?: any;
    data?: any;
    util: any;
}

interface GameControllerProps {
    game:GameOptions;
    authorized?:boolean;
    state?:GameControllerState;
    controller?:any;
}

interface GameControllerState {
    authorized: boolean;
    gameID:string;
    socket:SocketIOClient.Socket;
}

export default GameControllerComponent;