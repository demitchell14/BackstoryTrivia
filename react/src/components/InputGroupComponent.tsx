import * as React from "react";


class InputGroupComponent extends React.Component<InputProps, InputState> {
    public constructor(props) {
        super(props);

        this.state = {
            label: undefined,
            prepend: [],
            inputs: [],
            append: [],
            type: props.type ? props.type : "inline"
        } as InputState;

        if (typeof this.props.children !== "undefined") {
            this.props.children.map((c, idx) => {
                let type = c.type.toLowerCase();
                if (idx === 0) {
                    // -- First child is required to be a label
                    if (type === "label") {
                        // @ts-ignore
                        this.state.label = c;
                    }
                } else {

                    if ((type === "button" || type === "span") && this.state.inputs.length === 0) {
                        this.state.prepend.push(c);
                    } else if ((type === "button" || type === "span") && this.state.inputs.length > 0) {
                        this.state.append.push(c);
                    } else {
                        this.state.inputs.push(c);
                    }
                }
            });
        }
    }

    public render() {
        let labelClass = this.state.type === "inline" ? "col-auto" : "col-12";
        let inputClass = this.state.type === "inline" ? "col" : "col-12";

        return (
            <div className="form-row my-1">
                <div className={labelClass}>
                    {this.state.label}
                </div>
                <div className={inputClass}>
                    <div className="input-group">
                        {this.state.prepend.length > 0 ? (
                            <div className={"input-group-prepend"}>
                                {this.state.prepend}
                            </div>
                        ) : undefined}
                        {this.state.inputs}
                        {this.state.append.length > 0 ? (
                            <div className={"input-group-append"}>
                                {this.state.append}
                            </div>
                        ) : undefined}
                    </div>
                </div>
            </div>
        )
    }
}

interface InputProps {
    label?:string;
    name?:string;
    type?:string;
    state?:InputState;
    children?:any;
}

interface InputState {
    label?:any;
    inputs?:any;
    prepend?:any;
    append?:any;
    type:"inline"|"block";
}

export default InputGroupComponent;