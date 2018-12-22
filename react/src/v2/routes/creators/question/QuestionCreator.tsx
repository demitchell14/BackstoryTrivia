import * as React from "react";

import "./style.css";
import {ChangeEvent, ReactNode, SyntheticEvent} from "react";
//import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import QuestionPointValue from "./pointvalue/QuestionPointValue";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
//import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
//import InputGroupComponent from "../../../../components/InputGroupComponent";
//import TagInput from "../../../components/input/tags/TagInput";

class QuestionCreator extends React.Component<QuestionCreatorProps, QuestionCreatorState> {
    public constructor(props) {
        super(props);
        this.state = {
            // history: [0, 1, 2],
             history: [],
            stage: 0,
            stages: [
                {
                    renderer: this.renderStageZero
                },
                {
                    renderer: this.renderCreateFresh,
                    next: 2
                },
                {
                    renderer: this.renderQuestionType,
                    // isFinal: true
                }

            ],
            form: {},
             /*form: {
                 question: "Who is the president?",
                 timeLimit: 30,
                 points: 3,
                 category: "Current Events"
             },*/
            errors: {},
        } as QuestionCreatorState
    }

    componentDidMount(): void {

    }

    public render() {
        const {stages, stage} = this.state;
        return (
            <div onClick={this.overlayClicked} className={"creator-container centered flex-column"}>
                <div onClick={this.containerClicked} className={"creator-body"}>
                    <div className={"card-body"}>
                        <h2 className={"mb-4"}>Question Creator</h2>

                        <TransitionGroup>
                            {this.renderStage(stage)}
                        </TransitionGroup>

                    </div>

                </div>

                <div onClick={this.containerClicked} className={"creator-footer menu-open"}>
                    <div className={"ml-auto"}>
                        <button onClick={this.goBack} className={"btn btn-outline-warning m-2"}>Go Back</button>
                        <button onClick={this.onContinue} data-next={stages[stage].next} disabled={typeof stages[stage].next === "undefined" && typeof stages[stage].isFinal === "undefined"} className={`btn btn-outline-success m-2 ${stages[stage].isFinal ? "px-5" : ""}`}>{stages[stage].isFinal ? "Create" : "Continue"}</button>
                    </div>
                </div>
            </div>
        );
    }

    public onContinue = (evt:SyntheticEvent) => {
        const {stages, stage} = this.state;
        const next = evt.currentTarget.getAttribute("data-next");
        if (next && stages[next]) {
            //const target = stages[next];
            if (stages[stage].isFinal) {

            } else {
                this.pushStage(next)
            }
        }
    }

    private renderStage =(stage:number) => {
        if (this.state.stages[stage]) {
            const st = this.state.stages[stage];
            return (
                <CSSTransition key={stage} classNames={"stage-ani"} timeout={400}>
                    {st.renderer()}
                </CSSTransition>
            )
        }
        return <p>NA</p>
    }

    private renderStageZero = () => {
        return (
            <div className={"row my-3 justify-content-around"}>
                <div className={"col-md-3 d-flex justify-content-center p-2"}>
                    <button onClick={this.onModeSelect} data-stage={1} className={"creator-type"}>
                        <h5 className={"border-bottom"}>From Scratch</h5>
                        <p className={"mb-0"}>Create a question from no predefined information.</p>
                    </button>
                </div>
                <div className={"col-md-3 d-flex justify-content-center p-2"}>
                    <button className={"creator-type"} disabled>
                        <h5 className={"border-bottom"}>From A Question</h5>
                        <p className={"mb-0"}>Search through a list of questions that have already been made and use it as a template.</p>
                    </button>
                </div>
            </div>
        )
    }

    private renderCreateFresh = () => {

        const formChange = (evt:ChangeEvent|any) => {
            evt.preventDefault();
            const el = evt.target as HTMLInputElement;
            sendChange(el);
        };
        const sendChange = (el:{type: string; name: string; value: any;}) => {
            const {type, name, value} = el;
            const {form} = this.state;
            switch (type) {
                case "number":
                    form[name] = Number.parseInt(value);
                    break;
                default:
                    form[name] = value;
            }

            this.setState({form});
        }

        const test = (evt:SyntheticEvent) => {
            alert (evt.currentTarget)
        }
        return (
            <div className={"d-flex flex-column my-3"}>
                <form data-next="2" onSubmit={test} className={""}>
                    <p className="has-dynamic-label">
                        <textarea onChange={formChange} name={"question"} value={this.state.form.question} className="dynamic-label-input" placeholder="Enter your Question" required />
                        <label htmlFor="dynamic-label-input">Enter your Question</label>
                    </p>
                    <p className="has-dynamic-label">
                        <input onChange={formChange} name={"category"} value={this.state.form.category} type={"text"} className="dynamic-label-input" placeholder="Enter categories" required />
                        <label htmlFor="dynamic-label-input">Enter categories</label>
                    </p>

                    <div className={"row"}>

                        <div className={"col-md-6"}>
                            <div>
                                <label style={{fontSize: "1.5em"}}>Question Time Limit</label>
                                <QuestionPointValue name={"timeLimit"}
                                                    value={this.state.form.timeLimit} onChange={sendChange}
                                                    multipliers={[
                                                        {max:300, interval: 15},
                                                    ]} multiplierText={"second"}/>
                            </div>
                        </div>
                        <div className={"col-md-6"}>
                            <div>
                                <label style={{fontSize: "1.5em"}}>Question Point Value</label>
                                <QuestionPointValue name={"points"}
                                                    value={this.state.form.points} onChange={sendChange}
                                                    multipliers={[
                                                        {max:3, interval: 1},
                                                        {max:5, interval: 2},
                                                        {max:10, interval: 5},
                                                        {max:100, interval: 10}
                                                    ]} multiplierText={"point"}/>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }

    private renderQuestionType = () => {
        const {state} = this;
        const {form} = state;
        const {question, answer, answers} = form;
        if (answers) {
            // TODO
        } else
        if (answer) {

        }

        const updateQuestion = (evt:ChangeEvent) => {
            const ele = evt.target as HTMLInputElement;
            const value = ele.value;
            if (this.state.form.answers) {
                // TODO
            } else {
                const form = this.state.form;
                form.answer = value;
                this.setState({form});
            }
        }

        console.log(this.state.form)

        return (
            <form>
                <p className={"lead"}>{question}</p>

                <div className={"fa-layers fa-fw py-3 d-inline-block"}>
                    <FontAwesomeIcon size={"5x"} icon={["far", "ban"]} />
                    <FontAwesomeIcon size={"3x"} transform={"right-4"} icon={["fal", "keyboard"]} />
                </div>

                <div className={"list-group"}>
                    <div className={"list-group-item"}>
                        <div className={"text-success"}>Correct</div>
                        <input onChange={updateQuestion} value={answers ? answers[0].answer : answer} placeholder={"-- value here --"}  className={"form-plain"} type={"text"}/>
                    </div>
                    <div className={"list-group-item"}>
                        <button>Add Another Answer</button>
                    </div>
                </div>
            </form>
        )
    }

    
    private onModeSelect = (evt:SyntheticEvent) => {
        const target = evt.currentTarget.getAttribute("data-stage");
        if (target) {
            this.pushStage(target);
        }
    };

    private containerClicked =(evt) => {
        evt.stopPropagation();
    }
    private overlayClicked =(evt) => {
        evt.preventDefault();
        this.props.history.goBack();
    }

    private goBack = (evt) => {
        evt.preventDefault();
        const history = this.state.history;
        history.pop()
        this.setState({
            stage: history[history.length-1] || 0,
            history: history || [0]
        });
    }

    private pushStage = (target:string) => {
        const t = Number.parseFloat(target);
        const currentHist = this.state.history;
        currentHist.push(t);
        this.setState({
            stage: t,
            history: currentHist
        });
    }
}

interface QuestionCreatorProps {
    state?: QuestionCreatorState;
    onClose?: (callback:any) => void;
    history: {
        goBack: () => void;
        replace: (path:string) => void;
        push: (path:string) => void;
    }
}

interface QuestionCreatorState {
    stage: number;
    stages: Array<{
        renderer: () => ReactNode;
        isFinal?: boolean;
        next?:number;
    }>;
    history: number[];
    form: {
        timeLimit?:number;
        category?: string;
        question?: string;
        points?:number;
        answer?: string;
        answers?: Array<{
          answer: string;
          correct: boolean;
        }>;
    }
    errors: any;
}

export default QuestionCreator