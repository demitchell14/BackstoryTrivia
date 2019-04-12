import * as React from "react";
import {GameObject, TeamObject} from "../../../containers";

export function TeamView(props:TeamViewProps) {
    const { teams} = props;

    return (
        <div style={props.style} className={"teams-view"}>
            <div className={"card-secondary p-0"}>
                <ul className="list-group list-group-flush alternate-primary">
                    {teams.map((team, idx) => (
                        <li key={idx} className="list-group-item media">
                            <i className={"avatar"}>{team.name.toUpperCase().charAt(0)}</i>
                            <div className="media-body">
                                <p className={"info"}>
                                    <span className={"lead"}>Team: </span>
                                    {team.name}
                                </p>
                                <p className={"info"}>
                                    <span className={"lead"}>Questions Answered:</span>
                                    {team.answered || 0}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export interface TeamViewProps {
    game:GameObject;
    teams: TeamObject[];
    style?: React.CSSProperties;
}