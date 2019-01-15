import {Container} from "unstated";
import {Api, Question} from "./index";

class QuestionContainer extends Container<QuestionState> {

    public state = {} as QuestionState;

    public init = async (obj: ContainerInit) => {
        let {token} = obj;
        this.setState({
            token: await token
        })
    }

    public get = async (force?:boolean) => {
        if (force !== true && this.state.currentQuestions) {
            this.setState({currentQuestions: this.state.currentQuestions});
            return this.state.currentQuestions;
        }
        return await this.load();
    };

    public create = async (data: Partial<Question>) => {
        let accepted = Object.keys(data).filter(k => data[k] !== null && typeof data[k] !== "undefined");
        let questionData = {} as any;
        accepted.map(a => questionData[a] = data[a]);
        if (questionData.category) {
            let cat = questionData.category as Array<{value: string, label: string}>;
            questionData.category = cat.map(c => c.value);
        }

        const token = this.state.token;
        const response = await fetch("/api/v2/question/insert", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(questionData)
        })
        const raw = await response.text();
        if (response.status === 201) {
            //const json = JSON.parse(raw) as Api.QuestionInsertResponse
            this.load();
        } else {
            console.log(raw);
        }
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
}


interface QuestionState {
    token?: any;
    currentQuestions?: Api.QuestionListResponse;
}

interface ContainerInit {
    token: Promise<string|undefined>
}

export default QuestionContainer;