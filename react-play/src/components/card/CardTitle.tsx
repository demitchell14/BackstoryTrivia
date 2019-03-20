import * as React from "react";

export function CardTitle(props:CardTitleProps) {
    const classes = ["card-title"];
    const style = {} as any;


    return React.createElement("div", {
            className: classes.join(" "),
            style
        },
        React.createElement(props.component||"h1", {
            ...props.componentProps
        }, props.children)
    )

}


export interface CardTitleProps {
    children: React.ReactNode|React.ReactNodeArray;
    component?: string|React.FunctionComponent<any>|React.ComponentClass;
    componentProps?: any;
    fullWidth?: boolean;
    minHeight?: number;
}
