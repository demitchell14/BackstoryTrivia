import * as React from "react";
import {RefObject, SyntheticEvent} from "react";
import {QuestionDetails} from "../../../containers";
import logger from "../../../util/logger";

export class MultipleChoice extends React.Component<MultipleChoiceProps, MultipleChoiceState> {

    private choiceRefs: { [T: string]: RefObject<HTMLDivElement> };

    public constructor(props: MultipleChoiceProps) {
        super(props);
        // this.state = {} as MultipleChoiceState;
        if (props.choices && props.choices.length > 0) {
            this.choiceRefs = {};

            props.choices.map(ch => {
                if (typeof ch === "string") {
                    this.choiceRefs[ch] = React.createRef();
                }
            })
        }

        this.state = {
            isConfirming: false,
            isSubmitted: props.isSubmitted || false,
        } as MultipleChoiceState;
        logger.log(props);
    }


    fontSize = (len: number) => {
        if (len <= 20) {
            return "2em";
        }
        if (len <= 30) {
            return "1.5em";
        }
        return "1em";
    };

    shouldComponentUpdate(nextProps: Readonly<MultipleChoiceProps>, nextState: Readonly<MultipleChoiceState>, nextContext: any): boolean {

        return true;
    }

    sendConfirmChoice = (index: number) => {
        return (evt: SyntheticEvent) => {
            if (this.state.isSubmitted) {
                if (this.props.onSubmit && typeof this.state.selected === "number" && this.props.choices) {
                    this.props.onSubmit(this.props.choices[this.state.selected]);
                }
                return;
            }
            // const question = evt.currentTarget as HTMLDivElement;
            // logger.log(evt.currentTarget);
            this.setState({selected: index});
            const confirmClick = (evt: Event) => {
                let target = evt.target as HTMLDivElement;
                const targetID = target.getAttribute("data-id");
                if (!target.classList.contains("choice")) {
                    target = target.parentElement as HTMLDivElement;
                    // isConfirmed = target.getAttribute("data-id") === index.toString();
                }
                let isConfirmed = target.getAttribute("data-id") === index.toString();
                if (isConfirmed && this.props.choices) {
                    if (this.props.onSubmit && typeof this.state.selected === "number") {
                        this.props.onSubmit(this.props.choices[this.state.selected]);
                        this.setState({isSubmitted: true});
                    }
                } else {
                    this.setState({selected: undefined})
                }

                logger.log({
                    isConfirmed, targetID,
                    isConfirming: this.state.isConfirming,
                    selected: this.state.selected,
                    isSubmitted: this.state.isSubmitted
                });
                // if (!isConfirmed && targetID && !this.state.isConfirming) {
                //     selected = Number.parseInt(target.getAttribute("data-id") || "");
                //     this.setState({isConfirming: true, selected})
                // } else {
                //     this.setState({ isConfirming: false, selected: undefined})
                // }
                // logger.log(this.state);

                document.removeEventListener("click", confirmClick);
                if (this.state.isSubmitted) {
                    // TODO
                    logger.log(this);
                    return;
                }
                this.setState({isConfirming: false});
            };
            if (!this.state.isConfirming) {
                document.addEventListener("click", confirmClick);
                this.setState({isConfirming: true})
            }
        }
    };

    public render() {
        // const {selected, style} = this.state;
        // this.props.

        // logger.log({selected, style})

        return (
            <div className={"answers row"} style={this.props.style}>
                {this.props.choices && this.props.choices.map((choice, idx) => (
                    <div key={idx} className={"col-6"}>
                        <div
                            className={`choice card ${this.state.selected === idx? "card-color-primary-dark" : "card-color-primary"}`}
                            onClick={this.sendConfirmChoice(idx)}
                            ref={this.choiceRefs[typeof choice === "string" ? choice : ""]}
                            data-id={idx}
                        >
                            <span style={{
                                fontSize: this.fontSize(choice.length)
                            }}>
                                {choice}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        )

        // return (
        //     <div className={"answers row"} style={this.props.style}>
        //         {this.props.choices && this.props.choices.map((choice, idx) => (
        //             <div key={idx} className={"col-6"}>
        //                 <div
        //                     onClick={this.sendConfirmChoice(idx)}
        //                     className={`choice ${this.state.selected === idx ? "active" : ""}`}
        //                     ref={this.choiceRefs[typeof choice === "string" ? choice : ""]}
        //                     data-id={idx}
        //                 >
        //                     <span style={{
        //                         fontSize: this.fontSize(choice.length)
        //                     }}>
        //                         {choice}
        //                     </span>
        //                 </div>
        //             </div>
        //         ))}
        //     </div>
        // )

        // return (
        //     <Card fullWidth className={"answers p-0 mx-0"} color={"primary"}>
        //         {this.props.choices && this.props.choices.map((choice, idx) => (
        //             <div
        //                 className={`choice${idx === selected ? " active" : ""}`}
        //                 key={idx}
        //                 ref={this.choiceRefs[typeof choice === "string" ? choice : ""]}
        //                 onClick={this.handleSelect(choice, idx)}
        //                 style={typeof selected === "number" && selected >= 0 && idx === selected ? style : undefined}
        //             >
        //                 <span style={{
        //                     fontSize: this.fontSize(choice.length)
        //                 }}>{choice}</span>
        //             </div>
        //         ))}
        //     </Card>
        // );
    }
}

interface MultipleChoiceProps extends QuestionDetails {
    state?: MultipleChoiceState;
    // choices: Array<any>;
    onSubmit: (answer: any) => any;
    style?: React.CSSProperties
    isSubmitted?: boolean;
}

interface MultipleChoiceState {
    selected?: number;
    isConfirming: boolean;
    style?: React.CSSProperties;
    isSubmitted: boolean;
}

export default MultipleChoice