import * as React from "react";

import "./style.css";
import logo from "./bs-logo.png";
import {RefObject} from "react";
//import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class Heading extends React.Component<HeadingProps, HeadingState> {
    public hamburger: RefObject<HTMLDivElement>;
    public constructor(props) {
        super(props);
        this.hamburger = React.createRef()
    }


    public render(): React.ReactNode {
        return (
            <div className={"heading"}>
                <div className={"px-2"}>
                    <div ref={this.hamburger} onClick={this.onClose} 
                         className={`hamburger hamburger--arrowturn ${this.props.isMenuOpen ? "is-active" : ""}`}>
                        <div className="hamburger-box">
                            <div className="hamburger-inner"/>
                        </div>
                    </div>
                </div>
                <div className={"heading-body"}>
                    <h3>A Title</h3>
                </div>
                <div className={"logo"}>
                    <img src={logo} height={75} width={126}/>
                </div>
            </div>
        )
    }
    
    private onClose = (evt) => {
        if (this.props.onClose) {
            const {onClose} = this.props;
            onClose()

        }
    }
}

interface HeadingProps {
    onClose?: any;
    isMenuOpen?: boolean;
    state?: HeadingState;
}

interface HeadingState {

}

export default Heading;