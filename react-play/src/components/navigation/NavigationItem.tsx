import * as React from "react";

export function NavigationItem(props:NavigationItemProps) {
    const classes:string[] = ["nav-item"];
    return (
        <li className={classes.join(" ")}>Item</li>
    )
}
NavigationItem.componentName = "NavigationItem";

export interface NavigationItemProps {
    children?: React.ReactNode|React.ReactNodeArray;
    component?: string|React.FunctionComponent<any>|React.ComponentClass;
    componentProps?: any;
};