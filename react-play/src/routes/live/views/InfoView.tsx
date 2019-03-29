import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import {SplashOption} from "../../../components";
import {GameObject} from "../../../containers";

const formatDate = (str: string) => {
    // const date = new Date(str);
    // console.log(Date.parse(str));
    // console.log(date);

    // if (date.)
    return str;
};

export function InfoView(props: InfoPropsView) {
    console.log(props);

    return (
        <div style={props.style} className={"info-view"}>
            <div className={"card p-0"}>
                <img src={props.game.image} className={"card-img-top"} alt={props.game.name + " image"}/>
                <div className={"card-body test"}>
                    <p className={"lead text-capitalize"}>Welcome to {props.game.name}.</p>
                    <ul className={"list"}>

                        <li className={"item"}>
                            <label className={"item-title"}>Started?:</label>
                            <div className={"item-value"}>
                                <FontAwesomeIcon fixedWidth className={"item-icon"}
                                                 pulse={props.game.started && !props.game.paused}
                                                 icon={["fal", props.game.started ? (props.game.paused ? "pause-circle" : "spinner") : "stop-circle"]}/>
                                <span
                                    className={(!props.game.started || props.game.paused) ? "text-danger" : "text-success"}>
                                    {props.game.started ? props.game.paused ? `Currently waiting for a question` : `A question is active!` : `${props.game.name} has not started yet.`}
                                </span>
                            </div>
                        </li>
                        {/*TODO setup moment times maybe?*/}
                        <li className={"item"}>
                            <label className={"item-title"}>Start Time:</label>
                            <div className={"item-value"}>
                                <FontAwesomeIcon fixedWidth className={"item-icon"} icon={["fal", "calendar-day"]}/>
                                <span>{formatDate(props.game.startTime)}</span>
                            </div>
                        </li>
                        <li className={"item"}>
                            <label className={"item-title"}>Total Questions:</label>
                            <div className={"item-value"}>
                                <FontAwesomeIcon fixedWidth className={"item-icon"} icon={["fal", "question-circle"]}/>
                                <span>{`${props.game.questions} questions`}</span>
                            </div>
                        </li>
                        <li className={"item"}>
                            <label className={"item-title"}>Total Teams:</label>
                            <div className={"item-value"}>
                                <FontAwesomeIcon fixedWidth className={"item-icon"} icon={["fal", "users"]}/>
                                <span>{`${props.game.teams} teams`}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );

    return (
        <div className={"info-view"}>
            <div>
                <SplashOption key={"new"} reverse className={"py-4"}
                              title={<p className={"lead text-capitalize"}>Welcome to {props.game.name}.</p>}
                    // button={<Link key={"button"} to={"/register"} className={"btn btn-block btn-primary"}>Register to Play</Link>}
                >
                    <div>
                        <img src={props.game.image} className={"img-thumbnail"}/>
                    </div>
                    <ul>
                        <li>{props.game.started ? `${props.game.name} has started.` : `${props.game.name} has not started yet.`}</li>
                        {/*TODO setup moment times maybe?*/}
                        <li>Total Teams Playing: {props.game.startTime}</li>
                        <li>Total Questions: {props.game.questions}</li>
                        <li>Total Teams Playing: {props.game.teams}</li>
                    </ul>
                </SplashOption>
            </div>
            <div>AAA</div>
            <div>AAA</div>
            <div style={{minHeight: 800}}/>
        </div>
    )
}

export interface InfoPropsView {
    game: GameObject;
    style?: React.CSSProperties;
}