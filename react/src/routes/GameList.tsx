import * as React from "react";


import ContainerComponent from "../components/ContainerComponent";
import GameListItem from "../components/GameListItem";
import {Api} from "../store/api";

import halloween from "../images/halloween.jpg";
//console.log(bsdata);

class ListRouter extends React.Component<ListProps, ListState> {
    public constructor(props) {
        super(props);
        this.state = {

        };

    }

    async componentDidMount() {
        await this.setItems()
    }

    async setItems() {
        this.setState({
            items: await Api().games()
        });

    }

    getItemsAsComponent() {
        let displayItemsBool = typeof this.state !== "undefined"
            && typeof this.state.items !== "undefined"
            && this.state.items.length > 0;

        let {managed, games} = this.props;

        if (displayItemsBool) {
            // @ts-ignore
            return this.state.items.map(item => {
                const {name, token, started, startTime, questions, teams} = item;
                return (
                    <GameListItem
                        key={item["_id"]}
                        image={`${halloween}`}
                        name={name}
                        token={token}
                        started={started}
                        startTime={startTime}
                        questions={questions ? questions.length : 0}
                        teams={teams ? teams.length : 0}
                        managed={managed && (games ? games.findIndex(g => g === token) !== -1 : false)}
                    />
                )
            })
        } else {
            // TODO -- Better loading screen
            return ("Loading Games...");
        }
    }

    public render() {

        return (
            <ContainerComponent
                type={"card-columns"}>

                {this.getItemsAsComponent()}


            </ContainerComponent>
        )
    }

}

export interface GameOptions {
    _id: any;
    name: string;
    description?: string;
    image?:string;
    currentQuestionId?: number;
    started: boolean;
    paused:boolean;
    startTime?:string;
    token: string;
    teams: Array<Team>;
    questions: Array<Question>;
    updatesQueued?: number;
    needsUpdate?: boolean
}

export interface Question {
    answer: string;
    choices?: Array<{
        answer:string;
        correct?:boolean;
    }>;
    points: number;
    question: string;
    timeLimit: number;
    type: string;
}

export interface Team {
    answers: Array<Answer>;
    key: string;
    members: Array<any>;
    name: string;
}

export interface Answer {
    type: string;
    answer: string;
    correct: boolean;
    question: string;
}

interface ListProps {
    managed?:boolean;
    games?:Array<string>;
    state?: ListState;
}

interface ListState {
    items?:GameOptions[];
    //items: ;
}

export default ListRouter;