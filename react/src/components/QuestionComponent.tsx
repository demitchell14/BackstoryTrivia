import * as React from "react";
import {QuestionResponseBody} from "../store/api";

class QuestionComponent extends React.Component<QuestionProps, QuestionState> {

    public constructor(props) {
        super(props);
        this.state = {
            isAnswered: false,
        } as QuestionState;

        console.log(props.data);
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
            return "You already answered this question.";
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
                } else return "No answer choices available"

            default:
                return "TODO";

        }
    }

    private choicePicked(choice:string) {
        //console.log(this, `You selected '${choice}'`);
        if (this.props.onAnswer) {
            this.props.onAnswer(choice).then(success => {
                if (success)
                    this.setState({isAnswered: true});
            })
        }
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
}

export default QuestionComponent;