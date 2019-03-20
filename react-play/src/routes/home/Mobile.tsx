import * as React from "react";

class Mobile extends React.Component<MobileProps, MobileState> {
    public constructor(props:any) {
        super(props);
        this.state = {} as MobileState
    }

    public render() {
        return (
            <div>
                Home On a Phone
            </div>
        );
    }
}

interface MobileProps {
    state?: MobileState;
}

interface MobileState {

}

export default Mobile