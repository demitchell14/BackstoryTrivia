import * as React from "react";
import {animated} from 'react-spring/renderprops';
import logger from "../../util/logger";
// import {} from "react-spring";

export function Container(props:ContainerProps) {
    let classes:string[] = [];

    if (props.fullWidth)
        classes.push("container-fluid");
    else
        classes.push("container");

    if (props.fullHeight) {
        classes.push("h-100");
    }

    if (props.display) {
        classes.push(`d-${props.display}`);
    }

    if (props.direction && props.display === "flex") {
        classes.push(`flex-${props.direction}`)
    }

    if (props.justifyContent && props.display === "flex") {
        classes.push(`justify-content-${props.justifyContent}`);
    }

    if (props.align && props.display === "flex") {
        if (props.align.content) {
            classes.push(`justify-content-${props.align.content}`)
        }

        if (props.align.items) {
            classes.push(`align-items-${props.align.items}`)
        }
    }
    if (props.flex && props.display === "flex") {
        if (props.flex.grow) {
            classes.push(`flex-grow-${props.flex.grow}`);
        }
    }

    if (props.className) {
        classes.push(props.className);
    }

    let myProps = {
        className: classes.join(" "),
    }

    if (props.componentProps) {
        Object.assign(myProps, props.componentProps)
    }
    if (props.style) {
        if (props.style.position && typeof props.style.position.getValue === "function") {
            logger.log(props.style);
            // @ts-ignore
            const component = animated(props.component||"div");
            return React.createElement(component, {...myProps, style: props.style}, props.children)
        } else {
            return React.createElement(props.component||"div", {...myProps, style: props.style}, props.children)
        }
    }

    return React.createElement(props.component||"div", myProps, props.children)
}

export interface ContainerProps<T = React.ReactNode> {
    children: React.ReactNode|React.ReactNodeArray;
    component?: string|React.FunctionComponent<any>|React.ComponentClass;
    componentProps?: React.PropsWithoutRef<T>;
    fullHeight?: boolean;
    fullWidth?: boolean;
    align?: {
        items?:string;
        content?:string;
    };
    flex?: {
        grow:number;
    }
    justifyContent?: string;
    display?:string;
    direction?: string;
    className?: string;
    style?: React.CSSProperties|any;
}