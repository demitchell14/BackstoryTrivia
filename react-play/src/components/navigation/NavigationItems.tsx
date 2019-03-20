import * as React from "react";

export function NavigationItems(props:NavigationItemsProps) {
    const classes:string[] = ["nav-items"];

    
    return (
        <ul className={classes.join(" ")}>
            {props.children}
        </ul>
    )
}
NavigationItems.componentName = "NavigationItems";

export interface NavigationItemsProps {
    children: React.ReactNode|React.ReactNodeArray;
    component?: string|React.FunctionComponent<any>|React.ComponentClass;
    componentProps?: any;
};