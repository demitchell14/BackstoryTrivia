import * as React from "react";


class TimeBarComponent extends React.Component<TimeBarProps, TimeBarState> {
    public constructor(props) {
        super(props);

        this.state = {
            min: this.props.min || 0,
            max: this.props.max || 100,
            color: `bg-${this.props.color || "dark"}`,
        } as TimeBarState;

    }


    public render() {
        let x = this.state.max >= 100 ? (this.state.max - this.state.min) / 100 : this.state.max - this.state.min;
        let styleWidth = (this.props.current - this.state.min) / x;
        if (this.props.current >= this.state.max)
            styleWidth = 100;

        if (this.props.current <= this.state.min)
            styleWidth = 0;

        //console.log(x, styleWidth);
        return (
            <div className={this.props.className || "d-flex"}>
                <small className="text-muted">
                    <span>Time Left:</span>
                    <span>{undefined}</span>
                </small>
                <div className="progress">
                    <div className={`progress-bar ${this.state.color} progress-bar-striped progress-bar-animated`}
                         aria-valuenow={this.props.current}
                         aria-valuemin={this.state.min}
                         aria-valuemax={this.state.max}
                         style={{width: `${styleWidth}%`}}>
                        {this.props.children || `${this.props.current}%`}
                    </div>
                </div>
            </div>
        )
    }
}

interface TimeBarProps {
    current:number;

    min?:number;
    max?:number;
    color?:string;
    className?:string;
    state?: TimeBarState;
}

interface TimeBarState {
    min:number;
    max:number;
    color:string;
}

export default TimeBarComponent;