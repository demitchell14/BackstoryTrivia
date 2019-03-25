import * as React from "react";

import './live.css';
import {SvgClock} from "./";

export function ActivityStream(props:ActivityStreamProps) {
    return (
        <div className={"activity-stream"}>
            <div className={"activity-icon"}>
                {props.timer ? (
                    <SvgClock active limit={props.timer.limit} showNumber={props.timer.showNumber} current={props.timer.timeLeft}/>
                ) : (props.icon)}
            </div>
            <span className={"status"}>{props.status}</span>
        </div>
    )
}

export interface ActivityStreamProps {
    status: string;
    icon?: React.ReactNode;
    timer?: {
        limit: number;
        timeLeft?: number;
        showNumber?: boolean;
    };
    minimized?: boolean;
}