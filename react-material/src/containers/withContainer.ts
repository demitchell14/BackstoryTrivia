import * as React from "react";
import {Subscribe} from "unstated";

// @ts-ignore
const containerNames = {
    "UserContainer": "user",
    "QuestionContainer": "question"
}

export default function(C:React.ComponentClass, containers?:any) {

    const x = (containerObjects) => {
        let conts = {} as any;
        containers.map((con, id) => {
            conts[containerNames[con.name]] = containerObjects[id];
        })
        return conts;
    }
    
    return (props) => React.createElement(Subscribe, {to: containers,
        children: (...allContainers) => React.createElement(C, {...props, containers: x(allContainers)})
    })
}