import * as React from "react";

import blobby from "../images/blobby.jpg";
import "../css/HeadingComponent.css";

class HeadingComponent extends React.Component<HeadingProps, HeadingState> {
    public constructor(props:HeadingProps) {
        super(props);
        this.state = {

        } as HeadingState;


        //console.log(this);
    }
    public render() {
        return (
            <div data-bs-parallax-bg="true" className="shadow-lt"
                 style={{
                     height: "200px",
                     backgroundImage: `url(${blobby})`,
                     backgroundPosition: "center",
                     backgroundSize: "cover",
                 }}>
                <div className={"h-100"}
                     style={{
                         backgroundColor: "rgba(255,255,255,.75)"
                     }}>
                    <div className="container d-flex flex-row align-items-end flex-wrap h-100">
                        <h1 className="text-dark p-md-1">{this.props.title}</h1>
                        <h4 className="text-capitalize text-dark d-none d-md-block ml-md-2 p-md-1">
                            {this.props.subtitle}
                        </h4>
                    </div>
                </div>
            </div>
        )
    }
}

interface HeadingProps {
    title?:string;
    subtitle?:string;
    state?:HeadingState;
}
interface HeadingState {
    something?:string
}

export default HeadingComponent;