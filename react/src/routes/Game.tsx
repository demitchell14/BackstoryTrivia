import * as React from "react";


//import ContainerComponent from "../components/ContainerComponent";
//import GameListItem from "../components/GameListItem";
import {Api, QuestionResponseBody} from "../store/api";
import {Redirect} from "react-router";
//import ContainerComponent from "../components/ContainerComponent";
import TimeBarComponent from "../components/TimeBarComponent";
import QuestionsContainerComponenet from "../components/QuestionsContainerComponenet";
import QuestionComponent from "../components/QuestionComponent";
import ContainerComponent from "../components/ContainerComponent";

import * as SocketIO from "socket.io-client";
import {apiRequest} from "../store/fetch";
import {SocketResponse} from "../components/manage/GameControllerComponent";


let api = Api();
class GameRouter extends React.Component<GameProps, GameState> {

    public constructor(props) {
        super(props);
        this.state = {
            authorized: api.session.authorized(),
            timeLeft: 100,
            gameID: props.match.params.token,
            showQuestion: false,
            showError: false,
            timers: [],
            socket: SocketIO.connect({
                autoConnect: false
            })
        } as GameState;
    }

    async loadQuestion() {

        let response = await apiRequest("game", {
            path: "question",
            headers: {
                game: this.props.match.params.token,
                token: api.session.teamKey()
            }
        }).then(res => res.json());




        if (response.error) {
            this.setState({
                showError: true,
                error: response.error,
                showQuestion: false,
                question: undefined,
            });
            return {error: response.error};
        } else if (response.question) {
            this.setState({
                showError: false,
                error: undefined,
                showQuestion: true,
                question: response.question,
            });
            return {question:response.question};
        } else {
            return {};
        }
    }

    componentDidMount() {
        if (this.state.authorized) {

            this.state.socket.connect();
            this.state.socket.emit("ready", {key:api.session.teamKey(), game:api.session.gameKey()});
            console.log(this.state.socket);

            this.state.socket.on("reload", async () => {
                let loaded = await this.loadQuestion();

                if (loaded) {
                    console.log(loaded)
                }
            });

            this.state.socket.on("game state", (response:SocketResponse) => {
                if (response.error) {
                    alert(response.error);
                } else {
                    const data = response.data;
                    console.log(data);
                }
                //console.log(value);
            });

            let  animate = () => {
                let id = api.timeout(1000, () => {
                    requestAnimationFrame(animate);
                    let time = this.state.timeLeft;
                    this.setState({timeLeft: time - 1 });
                })
                this.setState({
                    timers: {
                        ...this.state.timers,
                        visualTimer: id
                    }
                })
            };
            animate();

            this.loadQuestion().then(res => {

                // -- TODO add Socket.IO Tracking to tell me if I need to make a call for new question data.
                //let id = api.interval(5000, () => {
                //    return this.loadQuestion()
                //});
                console.log(this.state.question);
                this.setState({
                    timers: {
                        ...this.state.timers,
                //        refresh: id
                    }
                })
            });
        }
    }

    componentWillUnmount() {
        this.state.socket.disconnect();
        if (this.state.timers) {
            Object.keys(this.state.timers).map(key => {
                let id = this.state.timers[key];
                api.timeout(0, id);
                api.interval(0, id);
            })
        }
    }

    private async answerQuestion(answer:string) {
        let body = {} as any;
        body.answer = answer;

        let response = await apiRequest("game", {
            path: ["question", "answer"],
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                game: this.props.match.params.token,
                token: api.session.teamKey()
            }
        }).then(res => res.json());

        console.log(response);
        return true;
    }

    public render() {
        if (this.state.authorized) {
            if (!this.state.showError && !this.state.showQuestion) {
                return (
                    <div>Loading...</div>
                )
            } else if (this.state.showError) {
                return (
                    <ContainerComponent type={"d-flex"}>
                        <p>{this.state.error}</p>
                    </ContainerComponent>
                )
            } else if (this.state.showQuestion && this.state.question) {
                return (
                    <QuestionsContainerComponenet
                        className={"row"}>

                        <TimeBarComponent
                            className={"col-12 my-4"}
                            current={this.state.timeLeft}
                            max={this.state.question.timeLimit}/>


                        <div className={"col-md-7"}>


                            <QuestionComponent
                                onAnswer={this.answerQuestion.bind(this)}
                                data={this.state.question}
                            />

                        </div>




                    </QuestionsContainerComponenet>
                )
            } else {
                return (
                    <div>Test</div>
                )
            }
        } else {
            return (<Redirect to={"/list"}/>)
        }
    }
}

interface GameProps {
    match: {
        params: {
            token:string;
        }
    }
    state?: GameState;
}
interface GameState {
    authorized:boolean;
    timeLeft:number;
    gameID:string;
    showQuestion:boolean;
    showError:boolean;

    socket:SocketIOClient.Socket;

    question?:QuestionResponseBody|any;
    error?:any;

    timers: {
        refresh?:any;
        visualTimer?: any;
    }
}

export default GameRouter;