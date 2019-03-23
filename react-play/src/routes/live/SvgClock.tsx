import * as React from "react";



export function SvgClock(props:SvgClockProps) {
    const classes = ["countdown"];

    if (props.className)
        classes.push(props.className);
    return (
        <div className={classes.join(" ")}>
            <div className={"number"}>{typeof props.showNumber === "undefined" || props.showNumber === true ? props.current : ""}</div>
            <svg>
                <circle style={{
                    stroke: "white",
                    animationName: props.active ? "countdown" : undefined,
                    animationIterationCount: 1,
                    animationTimingFunction: "linear",
                    animationDuration: props.limit + "s",

                    //animation: `countdown ${limit}s linear infinite reverse`
                }} r={18} cx={20} cy={20} />
            </svg>
        </div>
    )
}

export interface SvgClockProps {
    limit:number;
    current?: number;
    showNumber?:false|boolean;
    active: boolean;
    className?: string;
    
}