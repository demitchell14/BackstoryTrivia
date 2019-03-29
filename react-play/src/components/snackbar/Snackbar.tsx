import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {SyntheticEvent} from "react";
import * as React from "react";

import "./snackbar.css";

export function Snackbar(props:SnackbarProps) {
    const classes = ["snackbar"];
    let btnClass = "";

    if (props.position) {
        classes.push(props.position);
    }

    if (props.variant) {
        classes.push(`snackbar-${props.variant}`);
        btnClass = `btn-secondary-outline-${props.variant}`
    }

    return (
        <div className={classes.join(" ")}>
            <div className={"snackbar-body"}>
                {props.children}
            </div>
            <div className={"close"}>
                <button onClick={props.onClose} className={`btn ${btnClass}`}><FontAwesomeIcon icon={["far", "times"]} /></button>
            </div>
        </div>
    )
}

export interface SnackbarProps {
    children?: React.ReactNodeArray|React.ReactNode|string;
    position?: string;
    variant?: string;
    onClose?: (evt:SyntheticEvent) => any;
}