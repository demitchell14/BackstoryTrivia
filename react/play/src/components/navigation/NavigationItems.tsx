import * as React from "react";

export function NavigationItems(props:NavigationItemsProps) {
    const classes = ["nav-items"];
    if (props.className) {
        classes.push(props.className)
    }
    return React.createElement(props.component||"div", {
        className: classes.join(" "),
        ...props.componentProps
    }, props.children)
}
NavigationItems.componentName = "NavigationItems";

export interface NavigationItemsProps {
    children: React.ReactNode|React.ReactNodeArray;
    component?: string|React.FunctionComponent<any>|React.ComponentClass;
    componentProps?: any;
    className?: string;
};