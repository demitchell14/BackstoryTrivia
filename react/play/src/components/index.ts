import * as React from "react";

export * from "./container/Container"

export * from "./card/Card"
// export * from "./card/CardTitle"
// export * from "./card/CardBody"

export * from "./navigation/NavigationPanel"
export * from "./navigation/NavigationTitle"
export * from "./navigation/NavigationItems"
// export * from "./navigation/NavigationItem"


export * from "./splash/SplashOption";

export * from "./loading/Loading";

export * from "./snackbar/Snackbar";


export function findChild(root:any, search:any): React.ReactNode {
    if (root instanceof Array) {
        return root.find(el =>
            typeof el.type === "string" ? el.type === search : el.type.componentName === search
        )
    }
    return typeof root.type === "string" ? root.type === search ? root : undefined : root.type.componentName === search ? root : undefined
}