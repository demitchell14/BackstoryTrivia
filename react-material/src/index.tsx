import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Main from "./Main";
import {Provider} from "unstated";
import QuestionContainer from "./containers/QuestionContainer";
import UserContainer from "./containers/UserContainer";
// import {BrowserRouter} from "react-router-dom";


//import {} from "@fortawesome/pro-regular-svg-icons";
//import {} from "@fortawesome/pro-solid-svg-icons";

const questionContainer = new QuestionContainer();
const userContainer = new UserContainer();

const Container = props => (
    <Provider inject={[questionContainer, userContainer]}>
        <Main/>
    </Provider>
);


ReactDOM.render(<Container/>, document.getElementById("root"));