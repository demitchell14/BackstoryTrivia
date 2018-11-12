import * as React from "react";

class QuestionCardComponent extends React.Component<QuestionProps, QuestionState> {

    public constructor(props) {
        super(props);

        this.state = {
        } as QuestionState;
    }


    render() {
        return (
            <div className={this.props.className || "d-flex"}>
                <div className="card alert-info">
                    <div className="card-body">
                        <h4 className="card-title">On the 1979 Sit-Com, `On the Spot,` Who played John
                            in the first three seasons?
                        </h4>
                        <div className="d-flex">
                            <p>Nullam id dolor id nibh ultricies vehicula ut id elit. Cras justo odio,
                                dapibus ac facilisis
                                in, egestas eget quam. Donec id elit non mi porta gravida at eget
                                metus.</p>
                            <img className="rounded-circle d-md-block"
                                 src="http://i.pravatar.cc/150"
                                 height="150"/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

interface QuestionProps {
    className?:string;
    state?:QuestionState;
}
interface QuestionState {

}

export default QuestionCardComponent;