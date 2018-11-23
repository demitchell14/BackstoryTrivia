import * as React from "react";

import {FormEvent, RefObject} from "react";
import {QuestionResponseBody} from "../store/api";
import InputGroupComponent from "./InputGroupComponent";

class QuestionComponent extends React.Component<QuestionProps, QuestionState> {

    public constructor(props) {
        super(props);
        this.state = {
            isAnswered: false,
        } as QuestionState;

    }

    componentDidUpdate() {

    }

    componentWillUpdate(nextProps:QuestionProps, nextState:QuestionState) {
        if (nextProps.data.question !== this.props.data.question) {
            this.setState({isAnswered: false});
        }
        return nextProps.data.question !== this.props.data.question;
    }


    public render() {
        return (
            <div className={"card"}>
                <div className={"card-body alert-danger"}>
                    <h4>{this.props.data.question}</h4>
                    {this.props.data.questionDetails ? (
                        <p className={"lead"}>{this.props.data.questionDetails}</p>
                    ) : undefined}
                </div>
                <ul className="list-group list-group-flush">
                    {this.setChoices()}
                </ul>
            </div>
        )
    }

    private setChoices() {
        let data = this.props.data;

        if (this.state.isAnswered) {
            return (
                <li className={"list-group-item list-group-item-success"}>
                    <div>
                        <h6>Question Answered!</h6>
                        <p className={"mb-0"}>You answered: <u>{this.state.selectedAnswer}</u></p>
                    </div>
                </li>
            );
        }
        switch (data.type) {
            case "Multiple Choice":
                if (data.choices) {
                    return data.choices.map(({answer}, idx) => (
                        <AnswerChoiceComponent
                            key={idx}
                            answer={answer}
                            onClick={this.choicePicked.bind(this)}/>
                    ))
                } else return (<li className={"list-group-item"}>There are no choices! Please notify the administrator of the game!</li>)

            case "Open Ended":

                console.log(data)
                return <AnswerOpenComponent onAnswer={this.choicePicked.bind(this)} />;
            default:
                return "TODO";

        }
    }

    private choicePicked(choice:string) {
        //console.log(this, `You selected '${choice}'`);
        if (this.props.onAnswer) {
            this.props.onAnswer(choice).then(success => {
                if (success)
                    this.setState({isAnswered: true, selectedAnswer: choice});
            })
        }
    }
}

class AnswerOpenComponent extends React.Component<{onAnswer?:any}> {
    answerRef: RefObject<HTMLInputElement>;

    public constructor(props) {
        super(props);
        this.answerRef = React.createRef();
    }

    private answered(evt:FormEvent) {
        evt.preventDefault();

        if (this.answerRef.current) {
            let ref = this.answerRef.current
            if (this.props.onAnswer) {
                this.props.onAnswer(ref.value);
            }
        }
    }

    public render() {
        return (
            <li className={"list-group-item list-group-item-info"}>
                <form onSubmit={this.answered.bind(this)}>
                    <InputGroupComponent type={"block"}>
                        <label className={"d-block"}>Enter Your Answer:</label>
                        <input ref={this.answerRef} className={"form-control"} name={"haha"}/>
                    </InputGroupComponent>
                    <button className={"btn btn-block btn-success mt-3"}>Submit</button>
                </form>
            </li>
        )
    }
}

class AnswerChoiceComponent extends React.Component<ChoiceProps, {}> {
    clicked(evt) {
        if (this.props.onClick)
            return this.props.onClick(this.props.answer);
    }

    public render() {
        return (
            <li className="list-group-item list-group-item-info">
                <div
                    className="d-flex flex-column btn btn-success"
                    onClick={this.clicked.bind(this)}>
                    <p className="lead mb-0" >{this.props.answer}</p>
                </div>
            </li>
        )
    }
}

interface ChoiceProps {
    answer:string;
    onClick?:any;
}

interface QuestionProps {
    data:QuestionResponseBody;
    state?:QuestionState;
    onAnswer?:Function;
}
interface QuestionState {
    isAnswered:boolean;
    selectedAnswer?:string;
}

export default QuestionComponent;