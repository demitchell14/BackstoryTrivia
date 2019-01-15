import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Main from "./Main";

import { library} from "@fortawesome/fontawesome-svg-core";

import {faHome, faPollH, faSlidersVSquare, faSignOutAlt, faChartNetwork, faClipboardListCheck} from "@fortawesome/pro-light-svg-icons";
library.add(faHome, faPollH, faSlidersVSquare, faSignOutAlt, faChartNetwork, faClipboardListCheck);

import {faTrash, faCopy, faClone, faFolderOpen, faEye, faFile, faTimes, faUnlink, faEdit} from "@fortawesome/pro-light-svg-icons";
library.add(faTrash, faCopy, faClone, faFolderOpen, faEye, faFile, faTimes, faUnlink, faEdit);

import {faImage} from "@fortawesome/pro-regular-svg-icons"
library.add(faImage)

import {faCheckCircle, faTimesCircle} from "@fortawesome/pro-solid-svg-icons"
library.add(faCheckCircle, faTimesCircle)

//import {} from "@fortawesome/pro-regular-svg-icons";
//import {} from "@fortawesome/pro-solid-svg-icons";


ReactDOM.render(<Main />, document.getElementById("root"))