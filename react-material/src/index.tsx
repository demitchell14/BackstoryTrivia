import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Main from "./Main";
import {Provider} from "unstated";
import QuestionContainer from "./containers/QuestionContainer";
import UserContainer from "./containers/UserContainer";
// import {BrowserRouter} from "react-router-dom";
import {init as FAInit} from "./FontAwesome";
import GamesContainer from "./containers/GamesContainer";


//import {} from "@fortawesome/pro-regular-svg-icons";
//import {} from "@fortawesome/pro-solid-svg-icons";

const questionContainer = new QuestionContainer();
const userContainer = new UserContainer();
const gamesContainer = new GamesContainer();
gamesContainer.attachUser(userContainer);

const Container = props => (
    <Provider inject={[questionContainer, userContainer, gamesContainer]}>
        <Main/>
    </Provider>
);


FAInit()
    .then(() => {
        ReactDOM.render(<Container/>, document.getElementById("root"));
    })