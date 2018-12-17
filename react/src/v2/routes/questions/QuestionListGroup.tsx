import * as React from "react";
import {SyntheticEvent} from "react";
import QuestionsContainer, {nQuestion} from "../../handlers/questions/QuestionsContainer";
import {Subscribe} from "unstated";

interface QLGProps extends QuestionsState {
    onCategory?:any;
    onSelected?:any;
}
interface QuestionsState {
    questions: Array<nQuestion>;
    active?: any;
    filter: {
        category?: string;
        question?: string;
    };
}

class QuestionListGroup extends React.Component<QLGProps> {
    readonly baseClass:string;

    public constructor(props) {
        super(props);
        this.baseClass = "list-group-item list-group-item-action";

        //console.log(props)
    }

    public componentWillReceiveProps(nextProps, nextState) {
        //console.log(nextProps)
    }

    componentWillUpdate(nextProps: Readonly<QLGProps>, nextState: Readonly<{}>, nextContext: any): void {
        //console.log(nextProps)
    }

    public render() {
        const baseClass = this.baseClass;
        const {active} = this.props;

        return (
            <Subscribe to={[QuestionsContainer]}>
                {((question:QuestionsContainer) => {

                    return (
                        <div className={"card"}>
                            <div className={"card-body p-0"}>
                                <h5 className={"mb-0 px-3 py-2"}>All Questions</h5>
                                <div className="list-group list-group-flush">
                                    {question.applyFilters().map((q:nQuestion) => (
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
                        </div>
                    )
                })}

            </Subscribe>
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

export default QuestionListGroup