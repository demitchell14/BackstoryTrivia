import * as React from "react";
import {RefObject} from "react";
import * as Hammer from "hammerjs";

import {BrowserRouter} from "react-router-dom";
import {OffCanvas, OffCanvasBody, OffCanvasMenu} from "react-offcanvas";

import Router from "./Router";
import Sidebar from "./components/sidebar/Sidebar";
import Heading from "./components/heading/Heading";

class Main extends React.Component<any, {isMenuOpen: boolean; width: number; isTouch: boolean}> {
    public wrapper: RefObject<HTMLDivElement>;
    public touch:HammerManager;
    public componentWillMount() {
        this.setState({
            isMenuOpen: window.innerWidth >= 768,
            isTouch: (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0)),
            width: window.innerWidth < 425 ? 280 : 300,
        });
        this.wrapper = React.createRef();
    }

    public componentDidMount(): void {
        if (this.wrapper.current) {
            const wrapper = this.wrapper.current;
            if (this.state.isTouch) {
                this.touchInit(wrapper);
            }
        }
    }

    public render() {
        return (
            <BrowserRouter>
            <div ref={this.wrapper} className={"wrapper"}>
                <OffCanvas width={this.state.width} transitionDuration={450} isMenuOpened={this.state.isMenuOpen} position={"left"}>
                    <OffCanvasBody className={"wrapper"} style={{
                        marginLeft: window.innerWidth >= 768 ? this.state.isMenuOpen ? this.state.width : 0 : 0,
                        //width: this.state.isMenuOpen ? `calc(100% - ${this.state.width}px)` : "100%",
                        transform: "none"
                    }}>
                        <div className={`canvas-body ${this.state.isMenuOpen && this.state.isTouch ? "active" : undefined}`} onClick={this.state.isMenuOpen ? this.onClick : undefined}>
                            <Heading isMenuOpen={this.state.isMenuOpen} onClose={this.handleMenu} />
                            <Router />
                        </div>
                    </OffCanvasBody>
                    <OffCanvasMenu className={"sidebar"}>
                        <Sidebar onClose={this.handleMenu} />
                    </OffCanvasMenu>
                </OffCanvas>
            </div>
            </BrowserRouter>
        )
    }

    private onClick = (evt) => {
        if (this.state.isTouch)
            this.handleMenu()
    }

    private handleMenu = (callback?: (bool:boolean) => void) => {
        if (callback) {
            callback(!this.state.isMenuOpen)
        }
        this.setState({ isMenuOpen: !this.state.isMenuOpen})
    }


    private touchInit = (element:HTMLElement) => {
        this.touch = new Hammer(element, {
            enable: true,
            recognizers: [
                [
                    Hammer.Swipe,
                    {
                        direction: Hammer.DIRECTION_HORIZONTAL
                    }
                ]
            ]
        });
        const swiper = this.touch.get("swipe");
        swiper.set({enable: true});

        this.touch.on("swipe", (evt: HammerInput) => {
            switch (evt.direction) {
                case 4:
                    return this.setState({isMenuOpen: true});
                case 2:
                    return this.setState({isMenuOpen: false});
            }
        })

        console.log(swiper)
    };

}

export default Main;