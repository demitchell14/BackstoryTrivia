import * as React from "react";
import {Subscribe} from "unstated";

export * from "./storage/Container"
export * from "./player/Container";
export * from "./socket/Container";


export function withContainer(element:any, ...containers:any[]):any {
    if (containers.length === 1 && containers[0] instanceof Array) {
        containers = containers[0];
    }

    const x = (containerObjects:any) => {
        let conts = {} as any;
        containers.map((con, id) => {
            conts[con.containerName] = containerObjects[id];
        });
        return conts;
    };

    return (props:any) => React.createElement(Subscribe, {
        to: containers,
        children: (...allContainers:any) => React.createElement(element, {...props, containers: x(allContainers)})
    })
}