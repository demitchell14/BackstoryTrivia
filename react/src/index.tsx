import * as React from 'react';
import * as ReactDOM from 'react-dom';
//import App from './App';



import { library} from "@fortawesome/fontawesome-svg-core";
//import {faCaretDown, faCaretUp, faCaretCircleDown, faCaretCircleUp} from "@fortawesome/pro-solid-svg-icons";
// @ts-ignore
import {faCheckCircle, faTimesCircle, faTrashAlt, faQuestion, faFingerprint, faTools, faGamepad, faChevronLeft, faHome, faSnake, faSignOut, faUserCircle} from "@fortawesome/pro-light-svg-icons";
//import {} from "@fortawesome/pro-regular-svg-icons"

// @ts-ignore
library.add(faCheckCircle, faTimesCircle, faTrashAlt, faFingerprint, faTools, faQuestion, faSnake, faSignOut, faUserCircle, faGamepad, faHome, faChevronLeft);

import Main from "./v2/Main";
//import HeadingComponent from "./components/HeadingComponent";
//import NavigationComponent from "./components/NavigationComponent";
import {lazy} from "react";

import "./style/style.css";
//import registerServiceWorker from './registerServiceWorker';

if (true) {

    ReactDOM.render(
        <Main />,
        document.getElementById("root")
    )
} else {

    const routers = Promise.all([
        lazy(() => import("./Router")),
        lazy(() => import("./components/HeadingComponent")),
        lazy(() => import("./components/NavigationComponent"))
    ]);

    routers.then(com => {
        const Router = com[0],
            HeadingComponent = com[1],
            NavigationComponent = com[2];

        //const Router = lazy(() => import("./Router"));
        //const HeadingComponent = lazy(() => import("./components/HeadingComponent"));
        //const NavigationComponent = lazy(() => import("./components/NavigationComponent"));

        ReactDOM.render(
            <React.Suspense fallback={"loading"} >
                <div id={"header"}>
                    <HeadingComponent
                        title={"Backstory Trivia"}
                        subtitle={"Every Sunday Night"}
                    />
                </div>
                <div id={"navigation"}>
                    <NavigationComponent />
                </div>
                <Router />
            </React.Suspense>,
            document.getElementById("root")
        );
    })
}

//registerServiceWorker();
