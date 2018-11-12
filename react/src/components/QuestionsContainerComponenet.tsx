import * as React from "react";

class QuestionsContainerComponenet extends React.Component<QContainerProps, QContainerState> {

    public render() {
        return (
            <div className={"container-fluid"}>
                <div className={this.props.className}>{this.props.children}</div>
            </div>
        )
    }
}

interface QContainerProps {
    className?:string;
    state?:QContainerState;
}
interface QContainerState {

}

export default QuestionsContainerComponenet;