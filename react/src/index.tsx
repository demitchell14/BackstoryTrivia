import * as React from 'react';
import * as ReactDOM from 'react-dom';
//import App from './App';


import { library} from "@fortawesome/fontawesome-svg-core";
import {faCaretDown, faCaretUp, faCaretCircleDown, faCaretCircleUp} from "@fortawesome/pro-solid-svg-icons";
import {faTrashAlt} from "@fortawesome/pro-light-svg-icons";

library.add(faTrashAlt, faCaretDown, faCaretUp, faCaretCircleDown, faCaretCircleUp);

//import registerServiceWorker from './registerServiceWorker';

import Router from "./Router";
import HeadingComponent from "./components/HeadingComponent";
import NavigationComponent from "./components/NavigationComponent";



ReactDOM.render(
    <HeadingComponent
        title={"Backstory Trivia"}
        subtitle={"Every Sunday Night"}
    />,
    document.getElementById("header")
);

ReactDOM.render(
    <NavigationComponent

    />,
    document.getElementById("navigation")
);

ReactDOM.render(
  <Router />,
  document.getElementById('root') as HTMLElement
);
//registerServiceWorker();
