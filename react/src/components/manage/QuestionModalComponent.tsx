import * as React from "react";
import * as _ from "lodash";
import {Question} from "../../routes/GameList";
import InputGroupComponent from "../InputGroupComponent";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ChangeEvent, RefObject} from "react";

import "../../css/ManageModal.css"

class QuestionModalComponent extends React.Component<QuestionModalProps, QuestionModalState> {
    typeRef: RefObject<HTMLSelectElement>;
    public constructor(props) {
        super(props);

        this.state = {
            //isOpen: true,
            question: this.props.question ? _.cloneDeep(this.props.question) : {
                question: "",
                type: "Multiple Choice",
                answer: "",
                choices: [],
                points: -1,
                timeLimit: -1
            },
        } as QuestionModalState;

        this.typeRef = React.createRef();
    }

    private close(evt:any) {
        this.setState({
            //isOpen: false,
            question: undefined,
        });

        if (this.props.onClose) {
            this.props.onClose()
        }
    }

    componentWillUpdate(props:QuestionModalProps, state:QuestionModalState) {
        if (typeof state.question === "undefined") {
            if (typeof props.question !== "undefined") {
                state.question = props.question;
            }
        } else {
            if (typeof props.question === "undefined") {
                //state.question = props.question;
            }
        }
        //state.choices = this.answerChoicesEl(state.question)
    }

    private questionChanged(evt:ChangeEvent){
        //@ts-ignore
        let target = evt.target.name, value = evt.target.value;
        let question = this.state.question;


        if (target === "choice") {
            let idx = Number.parseInt(evt.target.getAttribute("data-idx") as string);
            if (question.choices) {
                question.choices[idx].answer = value;
            }
        } else
            question[target] = value;


        console.log(question)
        this.setState({question: question});
    }


    public render() {
        const {isOpen} = this.props;

        //@ts-ignore
        //const {question, choices, answer, points, timeLimit, type} = this.state.question || {};
        let question = this.state.question ? this.state.question.question : "";
        let type = this.state.question ? this.state.question.type : "Multiple Choice";
        let points = this.state.question ? this.state.question.points : 3;
        let choices = this.state.question ? this.state.question.choices ? this.state.question.choices : [] : [] as any;
        let timeLimit = this.state.question ? this.state.question.timeLimit : 0;
        let answer = this.state.question.answer ? this.state.question.answer : "";

        return (
            <div className={`manage-modal modal fade ${isOpen ? `d-block show` : ``}`}>
                <div className={"modal-dialog modal-lg"}>
                    <div className={"modal-content"}>
                        <div className={"modal-header"}>
                            <h5>{typeof this.state.question === "undefined" ? `Question Builder` : `Edit your Question`}</h5>
                            <button type={"button"} onClick={this.close.bind(this)} className={"close"}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className={"modal-body"}>
                            <fieldset>
                                <legend>Question Details</legend>
                                <InputGroupComponent>
                                    <label className="col-form-label" htmlFor="question">Question:</label>
                                    <textarea
                                        className={"form-control"}
                                        name={"question"}
                                        onChange={this.questionChanged.bind(this)}
                                        defaultValue={`${question}`}/>
                                </InputGroupComponent>

                                <InputGroupComponent>
                                    <label className="col-form-label" htmlFor="points">Point Value:</label>
                                    <input className={"form-control"}
                                           type={"number"}
                                           name={"points"}
                                           onChange={this.questionChanged.bind(this)}
                                           defaultValue={`${points}`}
                                    />
                                </InputGroupComponent>

                                <InputGroupComponent>
                                    <label className="col-form-label" htmlFor="points">Time Limit (seconds):</label>
                                    <input className={"form-control"}
                                           type={"number"}
                                           name={"timeLimit"}
                                           onChange={this.questionChanged.bind(this)}
                                           defaultValue={`${timeLimit}`}
                                    />
                                </InputGroupComponent>

                                <InputGroupComponent>
                                    <label className="col-form-label" htmlFor="question">Type:</label>
                                    <select
                                        className={"form-control"}
                                        name={"type"}
                                        ref={this.typeRef}
                                        onChange={this.questionChanged.bind(this)}
                                        defaultValue={`${type}`}>
                                        <option value={"Multiple Choice"}>Multiple Choice</option>
                                        <option value={"Open Ended"}>Open Ended</option>
                                    </select>
                                </InputGroupComponent>
                            </fieldset>

                            <hr/>
                            {this.state.question.type === "Multiple Choice" ? (
                                <fieldset>
                                    <legend>Choices</legend>

                                    {this.answerChoicesEl(choices)}
                                </fieldset>
                            ) : (
                                <fieldset>
                                    <legend>Answer</legend>
                                    <p>Notice: This is only a reference answer. You will be responsible for determining whether or not the answer the teams provide are correct.
                                    This is because otherwise, the teams would be required to enter the answer exactly as you enter it.</p>
                                    <InputGroupComponent>
                                        <label className={"col-form-label"}>Answer:</label>
                                        <input
                                            className={"form-control"}
                                            name={"answer"}
                                            defaultValue={`${answer}`}
                                            onChange={this.questionChanged.bind(this)} />
                                    </InputGroupComponent>
                                </fieldset>
                            )}



                        </div>
                        <div className={"modal-footer"}>
                            <button onClick={this.sendSave.bind(this)} className={"btn btn-primary"}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    private sendSave(evt) {
        if (this.props.onSave) {
            this.props.onSave(this.props.question, this.state.question);
        }
    }

    private correctAnswerChanged(evt) {
        if (this.state.question) {
            let question = _.cloneDeep(this.state.question);
            let idx = Number.parseInt(evt.target.getAttribute("data-idx"));
            if (question.choices) {
                question.choices = question.choices.map((q, id) => {
                    q.correct = idx === id;
                    return q;
                });

                this.setState({question: question});

                //let x = this.answerChoicesEl(question.choices);
                //console.log(x)
                //this.forceUpdate()
            }
        }
    }

    private deleteChoice(evt) {
        let idx = Number.parseInt(evt.currentTarget.getAttribute("data-idx"));
        if (this.state.question) {
            console.log(idx);
            let question = this.state.question;
            if (question.choices) {
                question.choices.splice(idx, 1);
            }
            this.setState({question:question});
        }
    }

    private addChoice(evt) {
        if (this.state.question) {
            if (this.state.question.type === "Open Ended") {
                console.error("This question is open ended.");

            } else {
                let question = this.state.question;
                if (question.choices) {
                    question.choices.push({
                        answer: "",
                        correct: false
                    })
                } else {
                    question.choices = [{
                        answer: "",
                        correct: true,
                    }]
                }
                this.setState({question: question});
            }
        }
    }

    private answerChoicesEl(choices?:Array<{answer:string, correct?:boolean}>) {
        //let answer = "", correct = false;
        let currentChoices = [] as any;
        //if (this.state.question && this.state.question.choices)
        //    choices = this.state.question.choices

        if (choices) {
            currentChoices = choices.map((choice, idx) => {
                let choiceClass = choice.correct ? "success" : "danger",
                    correctText = choice.correct ? "Correct" : "Incorrect";
                return (
                    <InputGroupComponent
                        key={idx}>
                        <label className="col-form-label" htmlFor="points">{`Choice ${idx+1}:`}</label>
                        <button
                            type={"button"}
                            data-idx={idx}
                            onClick={this.correctAnswerChanged.bind(this)}
                            className={`btn btn-${choiceClass}`}>{correctText}</button>
                        <input className={"form-control"}
                               type={"text"}
                               name={"choice"}
                               data-idx={idx}
                               onChange={this.questionChanged.bind(this)}
                               defaultValue={`${choice.answer}`}
                        />
                        <button type={"button"}
                                data-idx={idx}
                                onClick={this.deleteChoice.bind(this)}
                                className={"btn btn-danger"}><FontAwesomeIcon  icon={["fal", "trash-alt"]}/></button>
                    </InputGroupComponent>
                )
            })
        }
        currentChoices.push(<button onClick={this.addChoice.bind(this)} className={"btn btn-info"} key={"add-btn"} type={"button"}>Add Choice</button>);

        return currentChoices;
    }
}
///let temp = 0;
interface QuestionModalProps {
    question?:Question|undefined;
    isOpen:boolean;

    onClose: any;
    onSave:any;
    openHandler?: any;
    state?: QuestionModalState;
}

interface QuestionModalState {
    //isOpen:boolean;
    choices?:Array<{answer:string, correct?:boolean}>
    question:Question|any;
}

export default QuestionModalComponent;