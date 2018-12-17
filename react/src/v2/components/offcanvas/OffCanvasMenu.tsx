import * as React from "react";

class OffCanvasMenu extends React.Component<OffCanvasMenuProps, OffCanvasMenuState> {
    public constructor(props) {
        super(props);
        this.state = {
            position: this.props.position || "absolute"
        } as OffCanvasMenuState
    }

    public componentDidMount(): void {
        if (this.props.containerRef) {
            //console.log("REF")
            const parent = this.props.containerRef;
            if (this.props.position) {
                //console.log("SET")
                parent.style.setProperty("position", this.props.position)
            }
        }
    }

    public render() {
        //console.log(this.props)
        return this.props.children;
    }
}

interface OffCanvasMenuProps {
    state?: OffCanvasMenuState;
    position?: string;
    containerRef?: HTMLDivElement;
}

interface OffCanvasMenuState {
    position: string;
}

export default OffCanvasMenu