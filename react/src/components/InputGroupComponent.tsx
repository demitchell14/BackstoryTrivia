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

    }
    componentWillMount(): void {
        this.prepare(this.props.children);
    }

    prepare(children) {
        if (typeof children !== "undefined") {
            let prepend = [] as any,
                inputs = [] as any,
                append = [] as any,
                label = undefined as any;

            //console.log(this.props.children);

            children.map((c, idx) => {
                let type = c.type.toLowerCase();
                if (idx === 0) {
                    // -- First child is required to be a label
                    if (type === "label") {
                        // @ts-ignore
                        label = c;
                    }
                } else {
                    if ((type === "button" || type === "span") && inputs.length === 0) {
                        prepend.push(c);
                    } else if ((type === "button" || type === "span") && inputs.length > 0) {
                        append.push(c);
                    } else {
                        inputs.push(c);
                    }
                }
            });
            this.setState({
                label: label,
                append: append,
                inputs: inputs,
                prepend: prepend,
            })
        }
    }

    componentWillReceiveProps(nextProps: Readonly<InputProps>, nextContext: any): void {
        this.prepare(nextProps.children);
        //console.log(nextProps)
    }


    public render() {
        let labelClass = this.state.type === "inline" ? "col-auto" : "col-12";
        let inputClass = this.state.type === "inline" ? "col" : "col-12";

        return (
            <div className={`form-row my-1 ${this.props.className}`}>
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
    className?: string;
}

interface InputState {
    label?:any;
    inputs?:any;
    prepend?:any;
    append?:any;
    type:"inline"|"block";
}

export default InputGroupComponent;