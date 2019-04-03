import {SyntheticEvent} from "react";
import * as React from "react";
import logger from "../../util/logger";

export class Card extends React.Component<CardProps, CardState> {

    applyBorderRadius = (props:ApplyBorderRadius|boolean|number) => {
        const style = {} as React.CSSProperties;
        const applyBorderRadius = (val?:boolean|number|object)  => {
            if (val) {
                if (typeof val === "boolean")
                    return ".5rem";
                if (typeof val === "number")
                    return `${val}rem`;
                if (typeof val === "object") {
                    logger.log(val);
                    // @ts-ignore
                    return `${val.getValue()}rem`;
                }
            }
            return undefined;
        };

        if (typeof props === "boolean") {
            style.borderRadius = ".5rem"
        } else if (typeof props === "number") {
            style.borderRadius = applyBorderRadius(props);
        } else {
            style.borderBottomLeftRadius = applyBorderRadius(props.bottomLeft)
            style.borderBottomRightRadius = applyBorderRadius(props.bottomRight)
            style.borderTopLeftRadius = applyBorderRadius(props.topLeft)
            style.borderTopRightRadius = applyBorderRadius(props.topRight)
        }

        return style;
    }

    public constructor(props:CardProps) {
        super(props);

        const classes = ["card"];
        const style = {} as React.CSSProperties;

        if (props.fullWidth) {
            classes.push("card-block")
        }

        if (props.minHeight) {
            style.minHeight = props.minHeight;
        }

        if (props.bloated) {
            if (typeof props.bloated === "boolean")
                style.padding = "3rem";
            else
                style.padding = `${props.bloated}rem`;
        }

        if (props.display) {
            classes.push(`display-${props.display}`);
        }

        if (props.noBorder) {
            // classes.push("border-0");
            style.boxShadow = "none";
        }

        if (props.rounded) {
            Object.assign(style, this.applyBorderRadius(props.rounded));
            
        }

        if (props.style) {
            Object.assign(style, props.style);
        }

        //Object.assign(style, assignVariant(props));
        classes.push(assignVariant(props));
        classes.push(assignColor(props));

        if (props.className) {
            const nCls = props.className.split(" ");
            classes.push.apply(classes, nCls.filter(c => classes.find(a => a === c) === undefined));
        }

        this.state = {
            classes, style
        }
    }

    public onMouseEnter = (evt:SyntheticEvent) => {
        const {props} = this;
        if (props.onMouseEnter) {
            props.onMouseEnter(this);
        }
    }

    public onMouseLeave = (evt:SyntheticEvent) => {
        const {props} = this;
        if (props.onMouseLeave) {
            props.onMouseLeave(this);
        }
    }

    public render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const {props,state} = this;
        return (
            <div
                ref={props.ref}
                style={state.style}
                className={state.classes.filter(c => c.length > 0).join(" ")}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                {props.children}
            </div>
        )
    }
}

// export function Card2(props:CardProps) {
//     logger.log(props)
//     const classes = ["card"];
//     const style = {} as React.CSSProperties;
//
//     if (props.fullWidth) {
//         classes.push("card-block")
//     }
//
//     if (props.minHeight) {
//         style.minHeight = props.minHeight;
//     }
//
//     if (props.bloated) {
//         if (typeof props.bloated === "boolean")
//             style.padding = "3rem";
//         else
//             style.padding = `${props.bloated}rem`;
//     }
//
//     if (props.display) {
//         classes.push(`display-${props.display}`);
//     }
//
//     if (props.noBorder) {
//         // classes.push("border-0");
//         style.boxShadow = "none";
//     }
//
//     if (props.rounded) {
//         const applyBorderRadius = (val?:boolean|number|object)  => {
//             if (val) {
//                 if (typeof val === "boolean")
//                     return ".5rem";
//                 if (typeof val === "number")
//                     return `${val}rem`;
//                 if (typeof val === "object") {
//                     logger.log(val);
//                     // @ts-ignore
//                     return `${val.getValue()}rem`;
//                 }
//             }
//             return undefined;
//         };
//         if (typeof props.rounded === "boolean") {
//             style.borderRadius = ".5rem";
//         }
//         if (typeof props.rounded === "number") {
//             style.borderRadius = applyBorderRadius(props.rounded); //`${props.rounded}rem`;
//         }
//         if (typeof props.rounded === "object") {
//
//             style.borderBottomLeftRadius = applyBorderRadius(props.rounded.bottomLeft)
//             style.borderBottomRightRadius = applyBorderRadius(props.rounded.bottomRight)
//             style.borderTopLeftRadius = applyBorderRadius(props.rounded.topLeft)
//             style.borderTopRightRadius = applyBorderRadius(props.rounded.topRight)
//         }
//     }
//
//     if (props.style) {
//         Object.assign(style, props.style);
//     }
//
//     //Object.assign(style, assignVariant(props));
//     classes.push(assignVariant(props));
//     classes.push(assignTheme(props));
//
//
//     return (
//         <div
//             ref={props.ref}
//             style={style}
//             className={classes.filter(c => c.length > 0).join(" ")}
//             onMouseEnter={onMouseEnter}
//             onMouseLeave={props.onMouseLeave}
//         >
//             {props.children}
//         </div>
//     )
// }

function assignVariant(props:CardProps):string { //React.CSSProperties {
    switch (props.variant) {
        case "outlined":
            return "card-outlined";
            // return {
            //     boxShadow: "rgba(0, 0, 0, 0.35) 0px 0px 1rem 0.25rem",
            //     borderRadius: props.bloated ? "1.5rem" : ".75rem"
            // };
        case "regular":
            return "";
            // return {};
        default:
            return "";
            //return {}
    }
}

function assignColor(props:CardProps):string {
    if (props.dark)
        return props.color ? `card-color-${props.color}-dark` : "";
    return props.color ? `card-color-${props.color}` : "";
    // return props.color && props.color === "dark" ? "card-dark" : "";
}


export interface CardState {
    style: React.CSSProperties;
    classes: string[];
}

export interface CardProps {
    ref?: React.RefObject<any>;
    children: React.ReactNode|React.ReactNodeArray;
    component?: string|React.FunctionComponent<any>|React.ComponentClass;
    componentProps?: any;
    fullWidth?: boolean;
    minHeight?: number;
    rounded?: boolean|{
        bottomLeft?: number|boolean;
        bottomRight?: number|boolean;
        topLeft?: number|boolean;
        topRight?: number|boolean;
    }
    noBorder?: boolean;
    bloated?: boolean|number;
    style?: React.CSSProperties;
    variant?: "outlined"|"regular"|string;
    color?: string;
    theme?: "dark"|string;
    display?: string;
    onMouseEnter?: (evt:any) => void;
    onMouseLeave?: (evt:any) => void;
    className?: string;
    dark?: boolean;
}

interface ApplyBorderRadius {
    bottomLeft?: number|boolean;
    bottomRight?: number|boolean;
    topLeft?: number|boolean;
    topRight?: number|boolean;
}