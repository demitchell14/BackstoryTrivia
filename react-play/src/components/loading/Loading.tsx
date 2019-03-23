import * as React from "react";

import "./loading.css";
export function Loading(props:LoadingProps) {
    const classes = ["loading"];
    
    if (props.dark)
        classes.push("dark")
    else
        classes.push("light");
    
    if (props.full)
        classes.push("full")
    
    if (props.visible)
        classes.push("visible");
    return (
        <div className={`overlay ${props.visible ? "active" : ""}`}>
            <div className={classes.join(" ")}>
                <div className={"text"}>Loading...</div>
            </div>
        </div>
    )
}

export interface LoadingProps {
    visible?: boolean;
    dark?:boolean;
    full?: boolean;
}