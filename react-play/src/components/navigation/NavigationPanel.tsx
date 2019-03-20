import * as React from "react";
//import {} from "react"
import "./navigation.css"
import {findChild} from "../index";

export function NavigationPanel(props:NavigationPanelProps) {
    let classes = ["navigation-panel"];

    const title = findChild(props.children, "NavigationTitle") as any;
    const items = findChild(props.children, "NavigationItems") as any;

    if (!props.visible) classes = [];

    if (props.expanded) {
        classes.push("expanded");
    }

    // const title = React.cloneElement(rawTitle, {
    //     className: props.expanded && "expanded"
    // });

    return (
        <div className={classes.join(" ")}>
            {!props.locked && props.visible && (<div className={"controller"}>&times;</div>)}
            {props.visible && title}
            {props.visible && props.expanded && items}
        </div>
    )
}
NavigationPanel.componentName = "NavigationPanel";

export interface NavigationPanelProps {
    children: React.ReactNode|React.ReactNodeArray;
    component?: string|React.FunctionComponent<any>|React.ComponentClass;
    componentProps?: any;
    
    expanded?: boolean;
    visible?: boolean;
    locked?: boolean;
};