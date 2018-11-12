import * as React from "react";
import * as _ from "lodash";
import {Question} from "../../routes/GameList";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {SyntheticEvent} from "react";

import "../../css/QuestionList.css";
import QuestionModalComponent from "./QuestionModalComponent";

let key = 0;
class QuestionListComponent extends React.Component<QuestionListProps, QuestionListState> {

    public constructor(props) {
        super(props);

        this.state = {
            longPress: false,
            touchTimer: -1,
            questions: this.props.questions,
            modalOpen: false,
        } as QuestionListState;

    }

    public componentDidMount() {
        //console.log(this.props.questions[0]);
    }

    public sendChanges() {
        if (this.props.onChange) {
            this.props.onChange(this.state.questions);
        }
    }

    private editQuestion(evt:SyntheticEvent) {
        let rawId = evt.currentTarget.getAttribute("data-idx")
        let question = undefined as Question|undefined;
        if (typeof rawId === "undefined") {
        } else {
            let questionIdx = Number.parseInt(rawId as any);
            question = this.state.questions[questionIdx];
            //console.log(question);
        }
        this.setState({modalOpen: true, activeQuestion: question});
        this.sendChanges();
    }

    private moveQuestionUp(evt) {
        let rawId = evt.currentTarget.getAttribute("data-idx")
        //let question = undefined as Question|undefined;
        if (typeof rawId !== "undefined") {
            let questionIdx = Number.parseInt(rawId as any);
            if (questionIdx > 0) {
                let questions = this.state.questions;
                let question = questions.splice(questionIdx, 1)[0];
                questions.splice(questionIdx-1, 0, question);
                this.setState({questions: questions});
                this.sendChanges();
            }
        }
    }
    private moveQuestionDown(evt) {
        let rawId = evt.currentTarget.getAttribute("data-idx")
        //let question = undefined as Question|undefined;
        if (typeof rawId !== "undefined") {
            let questions = this.state.questions;
            let questionIdx = Number.parseInt(rawId as any);
            if (questionIdx < questions.length-1) {
                let question = questions.splice(questionIdx, 1)[0];

                questions.splice(questionIdx+1, 0, question);

                this.setState({questions: questions});
                this.sendChanges();
            }
        }
    }

    private cloneQuestion(evt:SyntheticEvent) {
        let rawId = evt.currentTarget.getAttribute("data-idx")
        let question = undefined as Question|undefined;
        if (typeof rawId !== "undefined") {
            let questions = this.state.questions;
            let questionIdx = Number.parseInt(rawId as any);
            question = _.cloneDeep(questions[questionIdx]);
            questions.push(question);
            this.setState({questions: questions});
            this.sendChanges();
        }

    }

    private deleteQuestion(evt) {
        let rawId = evt.currentTarget.getAttribute("data-idx");
        //let question = undefined as Question|undefined;
        if (typeof rawId !== "undefined") {
            let idx = Number.parseInt(rawId);
            let questions = this.state.questions;
            questions.splice(idx, 1);
            this.setState({questions: questions});
            this.sendChanges();
        }
    }

    private questionSaved(previous:Question, question:Question) {
        if (previous) {
            let idx = this.state.questions.findIndex(q => q.question === previous.question);
            let questions =this.state.questions;
            questions.splice(idx, 1, question);
            this.setState({questions: questions, modalOpen: false});
        } else {
            let questions = this.state.questions;
            questions.push(question);
            this.setState({questions: questions, modalOpen: false});
        }
        this.sendChanges();
    }

    private modalClose(evt) {
        this.setState({modalOpen: false, activeQuestion: undefined});
    }

    private editQuestionModal() {
        if (this.state.modalOpen) {
            return (
                <QuestionModalComponent
                    key={`modal-${++key}`}
                    onClose={this.modalClose.bind(this)}
                    onSave={this.questionSaved.bind(this)}
                    question={this.state.activeQuestion}
                    isOpen={this.state.modalOpen}/>
            )
        } else {
            return (<div></div>)
        }
    }


    public render() {
        //className={"list-group-item list-group-item-action d-flex px-2"}
        let items = this.state.questions.map((q, idx) => {
            return (
                <div
                    key={idx}
                    className={"question-item"}>
                    <div className={"question-id"}>
                        <div>{`${idx+1}`}</div>
                    </div>
                    <div className={"question-order"}>
                        <button onClick={this.moveQuestionUp.bind(this)} data-idx={idx} className={"btn btn-block btn-link"}><FontAwesomeIcon fixedWidth={true} icon={["fas", "caret-circle-up"]}/></button>
                        <button onClick={this.moveQuestionDown.bind(this)} data-idx={idx} className={"btn btn-block btn-link"}><FontAwesomeIcon fixedWidth={true} icon={["fas", "caret-circle-down"]}/></button>
                    </div>
                    <div className={"question-body"}>
                        <p>{q.question}</p>
                        <div className={"btn-group btn-group-sm"}>
                            <button
                                onClick={this.editQuestion.bind(this)}
                                data-idx={idx}
                                className={"btn btn-warning"}>Edit</button>
                            <button
                                onClick={this.cloneQuestion.bind(this)}
                                data-idx={idx}
                                className={"btn btn-secondary"}>Clone</button>
                            <button
                                onClick={this.deleteQuestion.bind(this)}
                                data-idx={idx}
                                className={"btn btn-danger"}>Delete</button>
                        </div>
                    </div>
                </div>
            )
        });

        return (
            <div className={"card"}>
                {this.editQuestionModal()}

                <div className={"card-header"}>
                    Questions List
                </div>
                <div className={"card-body p-0"}>
                    <button onClick={this.editQuestion.bind(this)} className={"btn btn-block btn-primary rounded-0"}>Add Question</button>
                </div>
                <div className={"list-group list-group-flush"}>
                    {items}
                </div>
            </div>
        )
    }
}

interface QuestionListProps {
    questions:Array<Question>;
    state?:QuestionListState;
    onChange?:any;
    sendModal?:any;
}
interface QuestionListState {
    touchTimer:any;
    longPress:boolean;
    modalOpen:boolean;
    activeQuestion:Question|undefined;
    questions:Array<Question>;
}



export default QuestionListComponent;
