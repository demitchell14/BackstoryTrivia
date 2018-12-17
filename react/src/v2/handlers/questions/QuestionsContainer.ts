import {Container} from "unstated";
import {RefObject, SyntheticEvent} from "react";
import * as React from "react";

class QuestionsContainer extends Container<ContainerState> {
    public state = {} as ContainerState;
    public filters:QuestionFilters;
    public constructor() {
        super();
        this.filters = {
            category: React.createRef(),
            question: React.createRef(),
        };
        this.state = {
            questions: [q, q1],
            filter: {},
        }
    }

    applyFilters = () => {
        const {questions, filter} = this.state;

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

    filterChanged = (evt:SyntheticEvent|string, value?:string) => {
        let filterName:string;
        if (typeof evt === "string") {
            filterName = evt;
        } else {
            filterName = evt.currentTarget.getAttribute("name") as string;
        }
        // @ts-ignore
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
            //console.log(`Filter: '${filterName}' = '${filter[filterName]}'`);
            this.setState({filter: filter}).then(() => {
                console.log(this.state)
            });

        } else {
            console.log(filterName + " is not an active filter.")
        }

        //console.log(this.state)
    }
    
}

interface ContainerState {
    questions: Array<nQuestion>;
    filter: {
        category: string;
        question: string;
    }|{};
}

interface QuestionFilters {
    category: RefObject<HTMLSelectElement>,
    question: RefObject<HTMLInputElement>
}

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

export interface nQuestion extends Question{
    category:string;
}

interface Question {
    _id: any;
    answer: string;
    choices?: Array<{
        answer:string;
        correct:boolean;
    }>;
    points: number;
    question: string;
    timeLimit: number;
    timeLeft: number;
    type: string;
}

export default QuestionsContainer;