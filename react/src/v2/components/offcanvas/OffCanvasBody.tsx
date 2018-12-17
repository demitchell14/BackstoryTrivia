import * as React from "react";

class OffCanvasBody extends React.Component<OffCanvasBodyProps, OffCanvasBodyState> {
    public constructor(props) {
        super(props);
        this.state = {} as OffCanvasBodyState
    }

    public render() {
        return this.props.children;
    }
}

interface OffCanvasBodyProps {
    state?: OffCanvasBodyState;
}

interface OffCanvasBodyState {

}

export default OffCanvasBody