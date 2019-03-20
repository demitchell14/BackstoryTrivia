import * as React from "react";

import "./button.css"

export function Button(props:ButtonProps) {
    const classes:string[] = ["btn"];
    // console.log(props)
    let component = "button"

    if (props.variant) {
        classes.push(`btn-${props.variant}`);
    } else {
        classes.push("btn-link")
    }

    if (props.size) {
        classes.push(`btn-${props.size}`);
    }

    if (props.block) {
        classes.push("btn-block");
    }

    if (props.component) {
        component = props.component
    }



    if (props.className) {
        classes.push(props.className);
        delete props.className;
    }

    return React.createElement("div", {},
        React.createElement(component, {
            className: classes.join(" ")
        }, props.title)
    );

    return (
        <div>
            <button
                className={classes.join(" ")}
            >{props.title}</button>
        </div>
    )
}

export interface ButtonProps extends Partial<HTMLButtonElement> {
    title:string;
    component?: string;
    inline?:boolean;
    block?: boolean;
    className?: string;
    variant?: string;
    size?: string;
}