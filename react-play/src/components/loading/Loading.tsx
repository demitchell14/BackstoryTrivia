import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";

export class Loading extends React.PureComponent<LoadingProps> {
    constructor(props:LoadingProps) {
        super(props);
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

        const props = this.props;
        const classes = ["loading"];

        if (props.dark)
            classes.push("dark")
        else
            classes.push("light");

        if (props.full)
            classes.push("full")

        if (props.visible)
            classes.push("visible");
        return (
            <div className={`overlay ${props.visible ? "active" : ""}`}>
                <div className={classes.join(" ")}>
                    <div className={"text"}>
                        <FontAwesomeIcon icon={["fal", "spinner"]} spin className={"mr-3"} />
                        <span>Loading...</span>
                    </div>
                </div>
            </div>
        )
    }
}

export interface LoadingProps {
    visible?: boolean;
    dark?:boolean;
    full?: boolean;
}