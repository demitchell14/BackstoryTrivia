import {Container} from "unstated";
import UserContainer from "./UserContainer";
// import {Api,} from "./index";

class GamesContainer extends Container<GamesState> {
    public static containerName = "games";
    
    private user:UserContainer;
    constructor() {
        super();
        this.state = {
            games: [],
        }
    }
    
    attachUser(user:UserContainer) {
        this.user = user;
    }

    async getGames():Promise<GameObject[]|false|undefined> {
        if (this.user) {
            const req = await fetch("/api/v2/games/list", {
                headers: {
                    "Authorization": `Bearer ${await this.user.token()}`
                }
            });
            
            if (req.status === 200) {
                const response = await req.json();
                await this.setState({games: response.games});
                return this.state.games;
            }
        }
        return false;
    }

    d() {
        if (this.user) {

        }
    }

}

interface GamesState {
    games: GameObject[];
}

export interface GameObject {
    _id: string;
    name: string;
    token: string;

    started?: boolean;
    paused?: boolean;
    startTime?: string;

    description?: string;
    image?: string;

    currentQuestionId?: number;

    teams?: Array<{
        name: string;
        members?: Array<{
            id: string;
            name: string;
        }>;
        answers?: Array<{
            type?: string;
            correct?: boolean|string;
            question?: string;
            answer?: string
        }>;
        key?:string;
    }>;
    questions?: Partial<QuestionObject>[];
}

interface QuestionObject {
    _id?:string;
    question: string;
    questionDetails?: string;
    questionImage?: string;
    type: string;
    answer?: string;
    timeLimit: number;
    points: number;
    choices?: Array<{
        answer: string;
        correct: boolean;
    }>;
    category: string[];
}

export default GamesContainer;