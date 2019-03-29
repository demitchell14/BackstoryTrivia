import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {SyntheticEvent} from "react";
import * as React from "react";
//import {} from "react"
import "./navigation.css"
import {findChild} from "../index";

export class NavigationPanel extends React.Component<NavigationPanelProps, NavigationPanelState> {
    static componentName = "NavigationPanel";
    constructor(props:NavigationPanelProps) {
        super(props);
        let classes = ["navigation-panel"];

        if (!props.visible) classes = [];

        if (props.expanded) {
            classes.push("expanded");
        }

        this.state = {
            classes,
            expanded: props.expanded || false,
        }
    }

    toggleExpanded = (evt:SyntheticEvent) => {
        this.setState({expanded: !this.state.expanded})
    }

    render = () => {
        const {classes, expanded} = this.state;
        const {props} = this;

        const title = findChild(props.children, "NavigationTitle") as any;
        const items = findChild(props.children, "NavigationItems") as any;


        return (
            <div className={classes.join(" ")} draggable>
                {!props.locked && props.visible && (<div onClick={this.toggleExpanded} className={"controller"}><FontAwesomeIcon icon={["fal", "bars"]} /></div>)}
                {props.visible && title}
                {props.visible && expanded && items}
            </div>
        )
    }
}

export interface NavigationPanelState {
    classes: string[];
    expanded: boolean;
}

export interface NavigationPanelProps {
    children: React.ReactNode|React.ReactNodeArray;
    component?: string|React.FunctionComponent<any>|React.ComponentClass;
    componentProps?: any;
    
    expanded?: boolean;
    visible?: boolean;
    locked?: boolean;
};