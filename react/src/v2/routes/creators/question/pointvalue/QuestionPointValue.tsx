import * as React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {SyntheticEvent} from "react";

import "./style.css";

class QuestionPointValue extends React.Component<QuestionPointValueProps, QuestionPointValueState> {
    public constructor(props:QuestionPointValueProps) {
        super(props);
        this.state = {
            multiplier: props.multipliers ? props.multipliers[0].interval : 1,
        } as QuestionPointValueState

    }

    pointAction = (evt:SyntheticEvent) => {
        const {multiplier} = this.state;
        let {value, onChange, name} = this.props;

        if (evt.type === "change") {
            const ele = evt.currentTarget as HTMLInputElement;
            ele.value = ele.valueAsNumber +"";
            if (onChange && name) {
                onChange({
                    name,
                    value: ele.valueAsNumber,
                    type: "number"
                })
            }
        } else {
            const el = evt.currentTarget as HTMLDivElement;
            const action = el.getAttribute("data-action")

            value = value || 0;
            switch (action) {
                case "+":
                    value += multiplier;
                    break;
                case "-":
                    value -= multiplier;
                    break;
            }
            if (onChange && name) {
                onChange({
                    name,
                    type: typeof value,
                    value
                })
            }
        }
    };

    public changeMultiplier = (evt:SyntheticEvent) => {
        let {multiplier} = this.state;
        let {multipliers} = this.props;
        if (multipliers) {
            const found = multipliers.find(v => {
                // @ts-ignore
                return multiplier < v.max;
            });
            if (found) {
                this.setState({multiplier: multiplier + found.interval})
            } else {
                this.setState({multiplier: 1})
            }
        }
    }

    public resetPoints = (evt:SyntheticEvent) => {
        const {onChange, name, multipliers} = this.props;
        if (onChange && name) {
            onChange({
                name, type: "number", value: 0
            })
        }
        this.setState({multiplier: multipliers ? multipliers[0].interval : 1})
    }

    public render() {
        const {pointAction, state, changeMultiplier, resetPoints, props} = this;
        const {value, multiplierText} = props;
        const {multiplier} = state;

        return (
            <div className={"qpt"}>
                <input type={"number"} onChange={pointAction} className={"qpt-display"} value={value || 0} />
                <div className={"qpt-actions"}>
                    <div onClick={pointAction} data-action="+" className={"qpt-action"}>
                        <FontAwesomeIcon icon={["far", "plus-circle"]}/>
                    </div>
                    <div onClick={resetPoints} className={"qpt-action"}>
                        <FontAwesomeIcon icon={["far", "undo-alt"]}/>
                    </div>
                    <div onClick={pointAction} data-action="-" className={"qpt-action"}>
                        <FontAwesomeIcon icon={["far", "minus-circle"]}/>
                    </div>
                </div>
                <div onClick={changeMultiplier} className={"btn btn-secondary ml-3"}>
                    <FontAwesomeIcon icon={["fal", "times"]} className={"mr-2"} />
                    <span className={"lead"}>{multiplier} {multiplierText ? `${multiplierText}${multiplier > 1 ? "s" : ""}` : ''}</span>
                </div>
            </div>
        );
    }
}

interface QuestionPointValueProps {
    state?: QuestionPointValueState;
    onChange?: (target:{type: string; name: string; value: any;}) => void;
    name?: string;
    value?: number;
    multipliers?: Array<{
        max: number;
        interval: number;
    }>;
    multiplierText?:string;
}

interface QuestionPointValueState {
    multiplier: number;
}

export default QuestionPointValue