import * as React from 'react';
import * as  ReactDOM from 'react-dom';
import App from './App';

import "normalize.css";
import "./style/style.css";
// import * as serviceWorker from './serviceWorker';

const root = document.getElementById("root");

if (root) {
    if (root.hasChildNodes()) {
        ReactDOM.hydrate(<App />, root);
    } else {
        ReactDOM.render(<App />, root);
    }
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: http://bit.ly/CRA-PWA
    // serviceWorker.unregister();
}