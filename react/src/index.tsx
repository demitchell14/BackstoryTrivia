import * as React from 'react';
import * as ReactDOM from 'react-dom';
//import App from './App';


import { library} from "@fortawesome/fontawesome-svg-core";
import {faCaretDown, faCaretUp, faCaretCircleDown, faCaretCircleUp} from "@fortawesome/pro-solid-svg-icons";
import {faTrashAlt} from "@fortawesome/pro-light-svg-icons";

library.add(faTrashAlt, faCaretDown, faCaretUp, faCaretCircleDown, faCaretCircleUp);

//import registerServiceWorker from './registerServiceWorker';

import Router from "./Router";

ReactDOM.render(
  <Router />,
  document.getElementById('root') as HTMLElement
);
//registerServiceWorker();
