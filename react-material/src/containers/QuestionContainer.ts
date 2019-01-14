import {Container} from "unstated";
import {Api} from "./index";

class QuestionContainer extends Container<QuestionState> {

    public state = {} as QuestionState;
    
    get = async (force?:boolean) => {
        if (force !== true && this.state.currentQuestions) {
            return this.state.currentQuestions;
        }
        return await this.load();
    }

    private load = async () => {
        const t = this.state.token;
        const response =  await fetch("/api/v2/question/list?full", {
            method: "GET",
            headers: {"Authorization": `Bearer ${t}`}
        });
        const raw = await response.text();
        if (response.status === 200) {
            const json = JSON.parse(raw) as Api.QuestionListResponse;
            this.setState({currentQuestions: json});
            return json;
        } else {
            // console.log(response.status, raw);
            throw raw;
        }
    }
    
    init = async (obj: ContainerInit) => {
        let {token} = obj;
        this.setState({
            token: await token
        })
    }
}


interface QuestionState {
    token?: any;
    currentQuestions?: Api.QuestionListResponse;
}

interface ContainerInit {
    token: Promise<string|undefined>
}

export default QuestionContainer;