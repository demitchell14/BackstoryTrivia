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
import GameGate from 'src/store/GameGate';


let api = Api();
class GameRouter extends React.Component<GameProps, GameState> {

    public constructor(props) {
        super(props);
        this.state = {
            authorized: api.session.authorized(),
            gameID: props.match.params.token,
            showQuestion: false,
            showError: false,
            timers: [],
            socket: SocketIO.connect({
                autoConnect: false
            })
        } as GameState;
    }


    componentDidMount() {
        if (this.state.authorized) {

            this.state.socket.connect();
            this.state.socket.emit("ready", {key:api.session.teamKey(), game:api.session.gameKey()});
            console.log(this.state.socket);

            this.state.socket.on("reload", async () => {
                GameGate.reload();
            });

            this.state.socket.on("question timer", async (data) => {
                //console.log("Pinged.", data)
                if (typeof this.state.question !== "undefined") {
                    let question = this.state.question;
                    question.timeLeft = data.value;
                    this.setState({question: question});
                }
            })
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
            return (
                <GameGate
                    path={"question"}
                    gameToken={this.props.match.params.token}
                    onLoad={this.onLoad.bind(this)}>
                    {this.primaryBody()}
                </GameGate>
            )
        } else {
            return (<Redirect to={"/list"}/>)
        }
    }


    private onLoad(response) {
        console.log(response)

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

    private primaryBody() {
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
                        current={this.state.question.timeLeft}
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
    //timeLeft:number;
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

/*function tmp() {
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
}*/