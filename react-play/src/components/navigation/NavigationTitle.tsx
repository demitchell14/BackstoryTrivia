import * as React from "react";

export function NavigationTitle(props:NavigationTitleProps) {
    const classes = ["navigation-title"];
    if (props.className) {
        classes.push(props.className)
    }
    return React.createElement(props.component||"h2", {
        className: classes.join(" ")
    }, props.children)
}
NavigationTitle.componentName = "NavigationTitle";

export interface NavigationTitleProps {
    children: React.ReactNode|React.ReactNodeArray;
    component?: string|React.FunctionComponent<any>|React.ComponentClass;
    componentProps?: any;
    className?: string;
};