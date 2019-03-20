import * as React from "react";

export function CardBody(props:CardBodyProps) {
    const classes = ["card-body"];
    const style = {} as any;
    
    return React.createElement(props.component||"div", {
        style,
        className: classes.join(" ")
    }, props.children)

}


export interface CardBodyProps<T = React.ReactNode> {
    children: React.ReactNode|React.ReactNodeArray;
    component?: string|React.FunctionComponent<any>|React.ComponentClass;
    componentProps?: React.PropsWithoutRef<T>;
    fullWidth?: boolean;
    minHeight?: number;
}
