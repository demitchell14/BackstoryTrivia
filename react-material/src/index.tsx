import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Main from "./Main";

import {library} from "@fortawesome/fontawesome-svg-core";

import {
    faArrowFromRight,
    faChartNetwork,
    faClipboardListCheck,
    faClone,
    faCopy,
    faEdit,
    faEye,
    faFile,
    faFolderOpen,
    faHome,
    faPollH,
    faSignOutAlt,
    faSlidersVSquare,
    faTimes,
    faTrash,
    faUnlink
} from "@fortawesome/pro-light-svg-icons";
import {faArrowLeft, faCheck, faHome as farHome, faImage, faMinus, faPlus} from "@fortawesome/pro-regular-svg-icons"
import {faCheckCircle, faPlusCircle, faTimesCircle} from "@fortawesome/pro-solid-svg-icons"

library.add(faHome, faPollH, faSlidersVSquare, faSignOutAlt, faChartNetwork, faClipboardListCheck);

library.add(faTrash, faCopy, faClone, faFolderOpen, faEye, faFile, faTimes, faUnlink, faEdit);

library.add(faImage, farHome, faCheck, faPlus, faMinus, faArrowLeft, faArrowFromRight);

library.add(faCheckCircle, faTimesCircle, faPlusCircle);

//import {} from "@fortawesome/pro-regular-svg-icons";
//import {} from "@fortawesome/pro-solid-svg-icons";


ReactDOM.render(<Main/>, document.getElementById("root"));