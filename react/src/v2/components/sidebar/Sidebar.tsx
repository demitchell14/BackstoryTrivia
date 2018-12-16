import * as React from "react";
//import * as ReactSwipeEvents from "react-swipe-events";

import "./style.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";
import {IconLookup} from '@fortawesome/fontawesome-svg-core';

class Sidebar extends React.Component<SidebarProps, SidebarState> {
    public state = {
        isTouch: (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0)),
    }

    public listBody = [
        {
            icon: { prefix: "fal", iconName: "home"},
            text: "Home",
            link: "/"
        },
        {
            icon: { prefix: "fal", iconName: "gamepad"},
            text: "View games",
            link: "/test"
        },
        {
            icon: { prefix: "fal", iconName: "question" },
            text: "View Questions",
            link: "/questions"
        },
        {
            icon: { prefix: "fal", iconName: "tools" },
            text: "Manage Games",
            link: "/test"
        },
        
    ] as Array<{
        icon: IconLookup,
        text:string;
        link:string;
    }>;


    public render() {
        // @ts-ignore
        let tmp = <p><button onClick={this.props.onClose}>&times;</button></p>;

        return (
            <div className={"sb-container"}>
                <section className={"sb-header"}>
                    <Link to={"/"}>
                        <h2 className={"sb-title"}>Backstory Trivia</h2>
                        <p className={"sb-subtitle"}>Join us every Sunday!</p>
                    </Link>
                </section>
                <section className={"sb-nav"}>
                    <div className={"sb-nav-item"}>
                        <a href={"#"} onClick={(e) => e.preventDefault()}>
                            <FontAwesomeIcon fixedWidth={true}
                                             className={"ico"} icon={["fal", "user-circle"]}/>
                            <p className={"text"}>My Account</p>
                        </a>
                    </div>

                    <div className={"sb-nav-item"}>
                        <a href={"#"} onClick={(e) => e.preventDefault()}>
                        <FontAwesomeIcon fixedWidth={true}
                                         className={"ico"} icon={["fal", "sign-out"]}/> 
                        <p className={"text"}>Sign Out</p>
                        </a>
                    </div>
                </section>
                <section className={"sb-body"}>
                    <ul className={"list"}>
                        {this.listBody.map((link, k) => (
                            <li key={k} className={"item"}>
                                <Link to={link.link} onClick={() => {
                                    if (this.props.onClose) {
                                        if (this.state.isTouch) {
                                            this.props.onClose()
                                        }
                                    }
                                }}>
                                    <p className={"text"}>{link.text}</p>

                                    <FontAwesomeIcon icon={link.icon}
                                                     fixedWidth={true} className={"ico"} />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        );
    }

    onTouchStart = (evt:any) => {
        alert("HELP")
    }
}

interface SidebarProps {
    onClose?: (evt?:any) => void;
    state?: SidebarState;
}

interface SidebarState {
    
}

export default Sidebar;