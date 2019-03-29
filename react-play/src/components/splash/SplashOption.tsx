import * as React from "react";
// import {animated, useSpring} from "react-spring";
//import {Spring} from "react-spring/renderprops";

import "./splash.css";

import {Card} from "..";
import logger from "../../util/logger";

export function SplashOption(props:SplashOptionProps) {

    let rounded = {}
    let flipRounded = {};
    if (props.reverse) {
        rounded = {topLeft: 3, bottomRight: 2.5};
        flipRounded = {topRight: 3, bottomLeft: 2.5};
    } else {
        rounded = {topRight: 3, bottomLeft: 2.5};
        flipRounded = {topLeft: 3, bottomRight: 2.5};
    }

    const onMouseEnter = (obj:Card) => {
        logger.log("Mouse Entered")
        let style = Object.assign({}, obj.state.style) as any;

        Object.assign(style, obj.applyBorderRadius(flipRounded));

        obj.setState({style});
    }

    const onMouseLeave = (obj:Card) => {
        logger.log("Mouse Leave")
        let style = Object.assign({}, obj.state.style) as any;

        Object.assign(style, obj.applyBorderRadius(rounded));

        obj.setState({style});
    }


    return React.createElement(Card, {
        bloated: true,
        display: "flex",
        theme: "dark",
        className: props.className,
        rounded, onMouseLeave, onMouseEnter,
        children: React.createElement("div", {}, [
            typeof props.title === "string" ?
                React.createElement("h5", {key: "h5"}, props.title) : props.title,
            typeof props.children === "string" ?
                React.createElement("div", {key: "body"}, props.children) : props.children,
            typeof props.button === "string" ?
                React.createElement("button", {key:"button"}, props.button) : props.button
        ])
    });
}


{/*<Card*/}
{/*    noBorder*/}
{/*>*/}
{/*    <CardTitle component={"h3"}>Returning Player</CardTitle>*/}
{/*    <CardBody>*/}
{/*        <Button title={"Login to Play"} />*/}
{/*    </CardBody>*/}
{/*</Card>*/}

export interface SplashOptionProps {
    children?:any;
    title?: string|React.ReactNode;
    button?:string|React.ReactNode;
    body?:string|React.ReactNode;
    reverse?: boolean;
    className?: string;
}