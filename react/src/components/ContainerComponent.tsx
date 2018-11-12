import * as React from "react";


class ContainerComponent extends React.Component<ContainerProps, ContainerState> {
    public constructor(props) {
        super(props);

        this.state = {

        } as ContainerState;

        //console.log(this.props.children);
    }

    public render() {
        return (
            <div className={"container"}>
                <div className={this.props.type}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

interface ContainerProps {
    type:string;
}

interface ContainerState {

}

export default ContainerComponent;