import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Main from "./Main";

import { library} from "@fortawesome/fontawesome-svg-core";

import {faHome, faPollH, faSlidersVSquare, faSignOutAlt, faChartNetwork, faClipboardListCheck} from "@fortawesome/pro-light-svg-icons";
library.add(faHome, faPollH, faSlidersVSquare, faSignOutAlt, faChartNetwork, faClipboardListCheck);

import {faTrash, faCopy, faClone, faFolderOpen, faEye} from "@fortawesome/pro-light-svg-icons";
library.add(faTrash, faCopy, faClone, faFolderOpen, faEye);

//import {} from "@fortawesome/pro-regular-svg-icons";
//import {} from "@fortawesome/pro-solid-svg-icons";


ReactDOM.render(<Main />, document.getElementById("root"))