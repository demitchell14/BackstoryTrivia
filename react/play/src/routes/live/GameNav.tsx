import * as React from "react";
import {Link} from "react-router-dom";
// import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"; //import FAIcon from "../../FontAwesome";


export function GameNav(props:GameNavProps) {
    return (
        <div className={"game-nav"}>
            {props.tabs && props.tabs.map((tab, idx) => (
                <Link  key={idx} to={tab.to} className={`nav-item ${tab.to === props.active ? "active" : ""}`}>
                    <FontAwesomeIcon className={"icon"} icon={tab.icon} />
                    <span className={"text"}>{tab.text}</span>
                </Link>
            ))}
        </div>
    )
    return (
        <div className={"game-nav"}>
            <Link to={"#"} className={"nav-item active"}>
                <FontAwesomeIcon className={"icon"} icon={["far", "play"]} />
                <span className={"text"}>Play</span>
            </Link>
            <Link to={"#info"} className={"nav-item"}>
                <FontAwesomeIcon className={"icon"} icon={["far", "info"]} />
                <span>Info</span>
            </Link>
            <Link to={"#teams"} className={"nav-item"}>
                <FontAwesomeIcon className={"icon"} icon={["far", "users"]} />
                <span>Teams</span>
            </Link>
            <Link to={"#history"} className={"nav-item"}>
                <FontAwesomeIcon className={"icon"} icon={["far", "history"]} />
                <span>History</span>
            </Link>
        </div>
    )
}

export interface GameNavProps {
    active: string;
    tabs: Array<{
        to: string;
        icon: string[]|any;
        text: string;
    }>;
} 