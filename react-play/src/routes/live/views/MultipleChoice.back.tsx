import {RefObject, SyntheticEvent} from "react";
import * as React from "react";
import {Card} from "../../../components";
import {QuestionDetails} from "../../../containers";

export class MultipleChoice extends React.Component<MultipleChoiceProps, MultipleChoiceState> {

    private choiceRefs:{[T:string]: RefObject<HTMLDivElement>};
    public constructor(props:MultipleChoiceProps) {
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

        this.state = {};
        console.log(props);
    }

    buildStr = (str:number[]) => {
        console.log(str);
        if (str.length === 3) {
            let s = `scale(${str[0].toFixed(2)}) translateY(${str[1].toFixed(2)}px) translateX(${str[2].toFixed(2)}px)`
            console.log(s)
            return s;
        }
        return "";
    }

    handleSelect = (choice:string, index:number, scale:number = 1.2) => {
        return (evt:SyntheticEvent) => {
            const returnValue = {
                selected: index,
            } as any;
            const ref = this.choiceRefs[choice];
            // const choiceData =  this.props.choices.findIndex(c => c === choice)
            if (ref.current) {
                const element = ref.current;

                // element.classList.add("active");

                const offsetTop = element.offsetTop;
                const offsetLeft = element.offsetLeft;
                const offsetHeight = element.offsetHeight;
                const offsetWidth = element.offsetWidth;

                const newHeight = offsetHeight * scale;
                const newWidth = offsetWidth * scale;

                // console.log({
                //     offsetTop, offsetLeft,
                //     offsetHeight, offsetWidth,
                //     newHeight, newWidth
                // })
                if (element.parentElement) {
                    const parent = element.parentElement;
                    const parentWidth = parent.offsetWidth;
                    const parentHeight = parent.offsetHeight;

                    // console.log({
                    //     parentWidth,
                    //     parentHeight,
                    // })

                    if (parent.childNodes.length > 1) {
                        // Only activate if there are 2 or more choices

                        let newOffsetLeft = (parentWidth - newWidth) / 2,
                            newOffsetTop = 0;
                        if (offsetLeft !== 0)
                            newOffsetLeft = -newOffsetLeft

                        const rows = Math.round(1.0 * parentHeight / offsetHeight);
                        if (rows > 1) {
                            // const diffHeight = parentHeight - offsetHeight;
                            newOffsetTop = (parentHeight - newHeight) / 2;
                            console.log({
                                newOffsetTop,
                                offsetTop, offsetHeight,
                                parentHeight
                            })
                            // if (offsetTop - offsetHeight <= 10 && offsetTop - offsetHeight >= -10) {
                            //     newOffsetTop = -newOffsetTop
                            // }
                            // console.log({diffHeight, newOffsetTop,
                            //     offsetTop, newHeight, offsetHeight, parentHeight})
                        }
                        returnValue.style = {
                            transform: this.buildStr([scale, newOffsetTop, newOffsetLeft])
                        }
                        // element.style.transform = ;
                    }
                }

                this.setState({...returnValue});
            }
        }
    }

    fontSize = (len:number) => {
        if (len <= 20)
            return "2em";
        if (len <= 30)
            return "1.5em";
        return "1em";
    }

    public render() {
        const {selected, style} = this.state;
        // this.props.

        console.log({selected, style})
        return (
            <Card fullWidth className={"answers p-0 mx-0"} color={"primary"}>
                {this.props.choices && this.props.choices.map((choice, idx) => (
                    <div
                        className={`choice${idx === selected ? " active" : ""}`}
                        key={idx}
                        ref={this.choiceRefs[typeof choice === "string" ? choice : ""]}
                        onClick={this.handleSelect(choice, idx)}
                        style={typeof selected === "number" && selected >= 0 && idx === selected ? style : undefined}
                    >
                        <span style={{
                            fontSize: this.fontSize(choice.length)
                        }}>{choice}</span>
                    </div>
                ))}
            </Card>
        );
    }
}

interface MultipleChoiceProps extends QuestionDetails {
    state?: MultipleChoiceState;
    // choices: Array<any>;
    onSubmit: (answer:any) => any;
}

interface MultipleChoiceState {
    selected?: number;
    style?: React.CSSProperties;
}

export default MultipleChoice