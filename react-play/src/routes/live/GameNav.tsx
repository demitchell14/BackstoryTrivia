import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import * as ReactGA from "react-ga";
import {Link} from "react-router-dom";
// import {Link} from "react-router-dom";

export function GameNav(props:GameNavProps) {
    return (
        <div className={"game-nav"}>
            {props.tabs && props.tabs.map((tab, idx) => (
                <Link onClick={sendActivity(tab.to)} key={idx} to={tab.to} className={`nav-item ${tab.to === props.active ? "active" : ""}`}>
                    <FontAwesomeIcon className={"icon"} icon={tab.icon} />
                    <span className={"text"}>{tab.text}</span>
                </Link>
            ))}
        </div>
    )
}

const sendActivity = (link:string) => {
    return () => {
        ReactGA.event({
            category: "Game Session",
            action: "View Tab",
            label: link
        });
    };
}

export interface GameNavProps {
    active: string;
    tabs: Array<{
        to: string;
        icon: string[]|any;
        text: string;
    }>;
} 