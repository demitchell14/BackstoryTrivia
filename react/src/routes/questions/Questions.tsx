import * as React from "react";

import UserGate from "../../store/UserGate";
import ContainerComponent from "../../components/ContainerComponent";
import {Question} from "../GameList";
import InputGroupComponent from "../../components/InputGroupComponent";
import {RefObject, SyntheticEvent} from "react";


const q = {
    _id: "key",
    question: "What's the answer to the universe?",
    type: "Multiple Choice",
    category: "example",
    answer: "42",
    started: false,
    timeLeft: -1,
    choices: [
        {
            answer: "42",
            correct: true,
        },
        {
            answer: "hello",
            correct: false,
        },
        {
            answer: "another answer",
            correct: false,
        }
    ],
    points: 50,
    timeLimit: 50,
} as nQuestion;

const q1 = {
    _id: "key2",
    question: "Should this actually be a question?",
    type: "Multiple Choice",
    category: "example2",
    answer: "42",
    started: false,
    timeLeft: -1,
    choices: [
        {
            answer: "42",
            correct: true,
        },
        {
            answer: "hello",
            correct: false,
        },
        {
            answer: "another answer",
            correct: false,
        }
    ],
    points: 50,
    timeLimit: 50,
} as nQuestion;

const questionList = [q, q1];


class Questions extends React.Component<QuestionsProps, QuestionsState> {

    private filters: {
        category: RefObject<HTMLSelectElement>,
        question: RefObject<HTMLInputElement>
    }

    public constructor(props) {
        super(props);
        this.state = {
            questions: questionList || [],
            filter: {},
        }
        this.filters = {
            category: React.createRef(),
            question: React.createRef(),
        };
    }


    public render() {
        return (
            <UserGate>
                <ContainerComponent className={"my-4"} type={"d-flex flex-column"}>

                    <div className={"alert alert-success"}>
                        <h4 className={"alert-title"}>What is this?</h4>
                        <div className={"alert-body"}>
                            <p>This is a list of all questions that you have entered into the system.
                                This is to make it easier for you to manage, add, duplicate, and even categorize your questions.
                                This is directly linked to the Games Management page, so when you add a question over there,
                                you will also be adding it to the list here.</p>
                        </div>
                    </div>

                    <div className={"row"}>
                        <div className={"col-md-4"}>
                            <div className={"card"}>
                                <div className={"card-header"}>
                                    <h5 className={"card-title mb-0"}>Search Criteria</h5>
                                </div>
                                <form className={"card-body"}>
                                    <InputGroupComponent type={"block"}>
                                        <label>Question:</label>
                                        <input
                                            ref={this.filters.question}
                                            className={"form-control"}
                                            placeholder={"Find a question by the question itself"}
                                            name={"question"}
                                            onChange={this.filterChanged.bind(this)}
                                            type={"text"}/>
                                    </InputGroupComponent>

                                    <InputGroupComponent type={"block"}>
                                        <label>Category:</label>
                                        <select ref={this.filters.category}
                                                name={"category"}
                                                onChange={this.filterChanged.bind(this)}
                                                className={"form-control"}>
                                            <option value={""}>all categories</option>
                                            <option>example</option>
                                            <option>example2</option>
                                        </select>
                                    </InputGroupComponent>

                                    <button className={"btn btn-success btn-sm btn-block my-3"} onClick={(evt) => evt.preventDefault()}>Apply</button>
                                </form>
                            </div>
                        </div>
                        <div className={"col-md-8"}>
                            <QuestionListGroup {...this.state}
                                onCategory={this.filterChanged.bind(this)}/>
                        </div>
                    </div>
                </ContainerComponent>
            </UserGate>
        )
    }

    private filterChanged(evt:SyntheticEvent|string, value?:string) {
        let filterName:string;
        if (typeof evt === "string") {
            filterName = evt;
        } else {
            filterName = evt.currentTarget.getAttribute("name") as string;
        }
        const ref = this.filters[filterName] as RefObject<HTMLSelectElement|HTMLInputElement>;
        if (ref && ref.current) {
            let filter = this.state.filter;
            if (typeof evt === "string") {
                if (value) {
                    filter[filterName] = value;
                    ref.current.value = value;
                }
            } else {
                filter[filterName] = ref.current.value;
            }
            console.log(`Filter: '${filterName}' = '${filter[filterName]}'`);
            this.setState({filter: filter});

        } else {
            console.log(filterName + " is not an active filter.")
        }

    }
}


interface QLGProps extends QuestionsState {
    onCategory?:any;
    onSelected?:any;
}

class QuestionListGroup extends React.Component<QLGProps> {
    readonly baseClass:string;

    public constructor(props) {
        super(props);
        this.baseClass = "list-group-item list-group-item-action";
    }

    public componentWillReceiveProps(nextProps, nextState) {
        console.log(nextProps)
    }

    private applyFilters() {
        const {questions, filter} = this.props;

        return questions.filter(question => {
            let success = Object.keys(filter).every(f => {
                let search = filter[f],
                    value = question[f];
                if (search === "") {
                    return true;
                }

                if (typeof value === "string" && typeof search === "string") {
                    if (f === "question") {
                        return value.toLowerCase().indexOf(search.toLowerCase()) >= 0
                    } else
                        return value === search;
                }
                return true;
            });
            return success ? question : undefined;
        })
    }

    public render() {
        const baseClass = this.baseClass;
        const {active} = this.props;

        return (
            <div className={"card"}>
                <div className={"card-header d-flex justify-content-between align-items-center"}>
                    <h5 className={"card-title m-0"}>All Questions</h5>
                </div>
                <div className="list-group list-group-flush">
                    {this.applyFilters().map(q => (
                        <div
                            key={q._id}
                            className={`${baseClass} ${q._id === active ? "active" : ""}`}
                            onClick={this.questionSelected.bind(this)}
                        >
                            <div className={"d-flex flex-column"}>
                                <p className={"mb-0"}>{q.question}</p>
                                <p className={"mb-0"}><b>Category:</b> <a title={"View all from " + q.category} onClick={this.categorySelected.bind(this)} className={"text-info"}>{q.category}</a></p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        )
    }

    questionSelected(evt) {
        if (typeof this.props.onSelected === "function") {
            this.props.onSelected()
        }
    }

    categorySelected(evt:SyntheticEvent) {
        evt.stopPropagation();
        if (typeof this.props.onCategory === "function") {
            let target = evt.currentTarget as HTMLLinkElement;
            this.props.onCategory("category", target.innerHTML)
        }
    }
}



interface QuestionsProps {
    state?: QuestionsState;
}

interface QuestionsState {
    questions: Array<nQuestion>;
    active?: any;
    filter: {
        category?: string;
        question?: string;
    };
}

interface nQuestion extends Question{
    category:string;
}

export default Questions;