import {Container} from "unstated";
import {StorageContainer} from "..";
import * as ReactGA from "react-ga";
import logger from "../../util/logger";

export class PlayerContainer extends Container<PlayerContainerState>{
    static containerName:string = "player";

    private storage:StorageContainer;

    constructor() {
        super();
        this.state = {};
        //StorageContainer.containerName = "storage"
    }

    isAnswered = (id:string) => {
        // logger.log(id, this.state.answers);
        if (this.state.answers) {
            if (id.match(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i))
                return this.state.answers.questions.findIndex(q => q._id === id) >= 0;
            else
                return this.state.answers.questions.findIndex(q => q.question === id) >= 0;
        }
        return false;
    }

    addAnswer = (props:AnswerResponse) => {
        const {answers} = this.state;
        if (answers) {
            if (this.isAnswered(props._id||props.answer)) {
                return false;
            }
            answers.questions.push(props)
            logger.log(answers);
            return answers.questions[answers.questions.length - 1];
        }
        return false;
    }
    
    gameInit = async (gameID:string, teamKey:string) => {
        logger.debug(`Player {gameInit} init in #${gameID}`)
        if (this.state.answers) {
            if (this.state.answers.gameID === gameID || this.state.answers.teamKey === teamKey)
                return true;
        }
        await this.setState({
            answers: {
                teamKey, gameID,
                questions: []
            }
        });

        this.requestQuestionHistory()
            .then((res:any) => logger.log(res))

        return true;
    }

    requestQuestionHistory = async () => {
        const storage = this.storage;
        if (storage) {
            if (storage.hasToken()
                    && storage.hasTeamKey()
                    && storage.hasGameID()) {
                const data = await fetch("/api/v2/team/history", {
                    headers: {
                        "Authorization": `Bearer ${storage.getToken()}`,
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({
                        team: storage.getTeamKey(),
                        game: storage.getGameID(),
                    })
                });

                logger.log({
                    status: data.status,
                    response: await data.text()
                })
            }

            return undefined;
        }
        return false
    }

    check = async () => {
        const storage = this.storage;
        if (storage) {
            if (storage.hasToken()) {
                const response = await fetch("/api/v2/team", {
                    headers: {
                        "Authorization": `Bearer ${storage.getToken()}`
                    }
                });
                const json = await response.json();
                const success = json.success;
                delete json.success;

                if (json.token) {
                    storage.setToken(json.token);
                    delete json.token;
                }

                if (!success) {
                    logger.debug(json.message);
                    storage.clearToken();
                    delete json.message;
                }

                Object.keys(json).map(k => this[k] = json[k]);
                return success;
            }
            return false;
        } else {
            return false;
        }
    }
    
    hasSession = async () => {
        const storage = this.storage;
        if (storage) {
            return storage.hasGameID() && storage.hasTeamKey();
        } else {
            throw "Storage not connected."
            // return false;
        }
    }
    
    sendLogin = async (formdata: LoginFormData) => {
        if (formdata.pin === "")
            delete formdata.pin;
        if (formdata.password === "")
            delete formdata.password;

        if (formdata.autologin === "on")
            formdata.autologin = true;
        if (formdata.autologin === "off")
            formdata.autologin = false;

        const response = await fetch("/api/v2/team/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formdata)
        });

        const json = await response.json() as LoginResponse;

        logger.log(json);
        if (response.status === 200) {
            if (json.token && json.email) {
                if (this.storage) {
                    this.storage.setToken(json.token);
                    this.storage.setEmail(json.email);
                    
                    let label = formdata.pin ? "With Pin" : "With Password";
                    
                    label += ", " + (formdata.autologin ? "Extended Login Timer" : "Standard Login Timer");
                    
                    ReactGA.event({
                        category: "Team",
                        action: "Logged in",
                        label
                    })

                    return true;
                } else {
                    return ["Storage Container is undefined"];
                }
            } else {
                return ["Response Error occurred"];
            }
        } else {
            return json.error;
        }
    }

    sendRegister = async (formdata:RegisterFormData) => {
        const response = await fetch("/api/v2/team/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formdata)
        });

        const json = await response.json() as RegisterResponse;
        if (response.status === 200) {
            // success
            if (json.token && json.email) {
                if (this.storage) {
                    this.storage.setToken(json.token);
                    this.storage.setEmail(json.email);

                    ReactGA.event({
                        category: "Team",
                        action: "Registered"
                    })

                    return true;
                } else {
                    return ["Storage Container is undefined."];
                }
            } else {
                return ["Response Error occurred"];
            }
        } else {
            return json.error;
        }
    }

    attachStorage = (storage:StorageContainer) => {
        if (typeof this.storage === "undefined") {
            this.storage = storage;
        }
    }

    // attachSocket = (socket:SocketContainer) => {
    //
    // }

    reset = () => {
        if (this.storage) {
            this.storage.clearEmail();
            this.storage.clearPin();
            this.storage.clearToken();
        }
    }
}

export interface PlayerContainerState {
    answers?:AnsweredQuestions
}

export interface AnsweredQuestions {
    gameID: string;
    teamKey: string;
    questions: Array<AnswerResponse>;
}

export interface AnswerResponse {
    _id?: string;
    type: string;
    answer: string;
    question: string;
}

export interface LoginFormData {
    email: string;
    password?: string;
    pin?: string;
    autologin: string|boolean;
}

export interface LoginResponse {
    token?: string;
    email?: string;
    error?: string[];
}

export interface RegisterFormData {
    email: string;
    password: string;
    passwordConfirm: string;
    teamName: string;
}

export interface RegisterResponse {
    token?: string;
    email?: string;
    error?: string[];
}