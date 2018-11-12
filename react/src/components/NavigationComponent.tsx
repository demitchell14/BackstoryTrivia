import * as React from "react";


class NavigationComponent extends React.Component<NavProps, NavState> {
    public constructor(props) {
        super(props);
        this.state = {

        } as NavState;

    }

    public render() {
        return (
            <div className={"my-2"} />
        )
    }
}

interface NavProps {

}

interface NavState {

}

export default NavigationComponent;