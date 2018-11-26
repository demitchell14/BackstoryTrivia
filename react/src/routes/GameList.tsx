import * as React from "react";


import ContainerComponent from "../components/ContainerComponent";
import GameListItem from "../components/GameListItem";

import {apiRequest} from "../store/fetch";
import {Api} from "../store/api";
//console.log(bsdata);

const api = Api();
class ListRouter extends React.Component<ListProps, ListState> {
    public constructor(props) {
        super(props);
        this.state = {

        };
    }

    async componentDidMount() {
        if (this.props.managed) {
        }
        await this.setItems(this.props.managed)
    }

    async setItems(managed?:boolean) {
        let headers = {} as any;
        if (managed) {
            //console.log(api.session.user.getAuthToken())
            headers.authorized = api.session.user.getAuthToken();
        }
        const response = await apiRequest("game", {
            path: "list",
            headers: headers
        });

        if (response.status === 200) {
            this.setState({
                items: await response.json()
            })
        }

    }

    getItemsAsComponent() {
        let displayItemsBool = typeof this.state !== "undefined"
            && typeof this.state.items !== "undefined"
            && this.state.items.length > 0;

        let {managed, games} = this.props;

        if (displayItemsBool) {
            // @ts-ignore
            return this.state.items.map(item => {
                const {name, token, started, startTime, questions, teams, _id, image, description } = item;
                let questionCount = 0;
                let teamCount = 0;
                if (!(questions instanceof Array)) {
                    questionCount = questions;
                } else {
                    questionCount = questions.length;
                }

                if (!(teams instanceof Array)) {
                    teamCount = teams;
                } else {
                    teamCount = teams.length;
                }

                return (
                    <GameListItem
                        key={_id}
                        image={image}
                        description={description}
                        name={name}
                        token={token}
                        started={started}
                        startTime={startTime}
                        questions={questionCount}
                        teams={teamCount}
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