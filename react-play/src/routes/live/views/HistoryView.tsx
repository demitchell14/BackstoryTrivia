import * as React from "react";
import {AnsweredQuestions} from "../../../containers";

export function HistoryView(props:HistoryViewProps) {
    const { answers } = props;
    return (
        <div style={props.style} className={"history-view"}>
            <div className={"card-primary p-0"}>
                <ul className="list-group list-group-flush alternate-secondary">
                    {answers && answers.questions.length > 0 ? answers.questions.map((answer, idx) => (
                        <li key={idx} className="list-group-item media">
                            <i className={"avatar"}>{idx + 1}</i>
                            <div className="media-body">
                                <p className={"info"}>
                                    <span className={"lead"}>Question: </span>
                                    {answer.question}
                                </p>
                                <p className={"info"}>
                                    <span className={"lead"}>Answser:</span>
                                    {answer.answer}
                                </p>
                            </div>
                        </li>
                    )) : (
                        <li className={"list-group-item media"}>
                            <i className={"avatar"}>0</i>
                            <div className="media-body">
                                <p className={"info lead"}>
                                    No answers yet, get to answering!
                                </p>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )

}

export interface HistoryViewProps {
    answers?: AnsweredQuestions
    style?: React.CSSProperties;
}