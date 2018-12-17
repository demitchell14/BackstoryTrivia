import * as React from "react";
import {OffCanvasBody, OffCanvasMenu} from "./";

import "./style.css";
import {CSSProperties, RefObject} from "react";

class OffCanvas extends React.Component<OffCanvasProps, OffCanvasState> {
    baseStyle = {
        paddingX: 30
    };
    
    public references: {
        container: RefObject<HTMLDivElement>;
        menu: RefObject<HTMLDivElement>;
    }

    public constructor(props:OffCanvasProps) {
        super(props);
        //this.state = {} as OffCanvasState;
        const {children} = this.props;
        let state = {} as any;
        if (children instanceof Array) {
            children.map((c: React.ReactElement<any>) => {
                if (c.type === OffCanvasBody) {
                    state.body = c;
                }
                if (c.type === OffCanvasMenu) {
                    state.menu = c;
                }
            })
        } else {
            throw Error("Requires 2 children")
        }
        if (props.className) {
            state.className = props.className;
        } else {
            state.className = "offcanvas";
        }
        this.state = state as OffCanvasState;
        
        this.references = {
            container: React.createRef(),
            menu: React.createRef(),
        }
    }

    public componentWillMount(): void {
        const {body, menu} = this.state;
        if (body && menu) {

        } else {
            throw Error("OffCanvasMenu and OffCanvasBody are required children");
        }
    }

    public generateBodyProps = (thisProps:OffCanvasProps) => {
        let props = {} as any;

        props.className = `${this.state.className}-body`;
        if (thisProps.isMenuOpen) {
            props.style = {
                marginLeft: thisProps.width,
                width: window.innerWidth >= 425 ? undefined : window.innerWidth
            } as CSSProperties
        } else {
            props.style = {
                marginLeft: 0,
                width: window.innerWidth >= 425 ? undefined : window.innerWidth
            } as CSSProperties;
        }
        if (typeof thisProps.transitionDuration === "number") {
            props.style.transitionDuration = `${thisProps.transitionDuration}ms`;
        } else {
            props.style.transitionDuration = thisProps.transitionDuration;
        }

        return props;
    }

    public generateSBProps = (thisProps:OffCanvasProps) => {
        let props = {} as any;
        props.className = `${this.state.className}-sidebar`;
        if (thisProps.isMenuOpen) {
            props.style = {} as CSSProperties;
        } else {
            props.style = {
                transform: `translateX(-${thisProps.width}px)`
            } as CSSProperties;
        }

        props.style.width = thisProps.width;
        if (typeof thisProps.transitionDuration === "number") {
            props.style.transitionDuration = `${thisProps.transitionDuration}ms`;
        } else {
            props.style.transitionDuration = thisProps.transitionDuration;
        }

        if (this.references.container.current) {
            //console.log("EXISTS")
            //props.containerRef = this.references.container.current;
        }
        return props;
    }

    public render() {

        return (
            <div ref={this.references.container} className={this.state.className}>
                <div ref={this.references.menu} {...this.generateSBProps(this.props)}>
                    {this.state.menu}
                </div>
                <div {...this.generateBodyProps(this.props)}>
                    {this.state.body}
                </div>
            </div>
        );
    }
}

interface OffCanvasProps {
    state?: OffCanvasState;
    className?: any;
    width?: number|string;
    isMenuOpen: boolean;
    transitionDuration?: number|string;
    //children?: Array<React.ReactNode>;
}

interface OffCanvasState {
    body?: OffCanvasBody;
    menu?: OffCanvasMenu;
    className?: string;
}

export default OffCanvas