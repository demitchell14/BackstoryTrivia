import {Container} from "unstated";
import {StorageContainer} from "..";
import * as ReactGA from "react-ga";
import logger from "../../util/logger";

export class PlayerContainer extends Container<any>{
    static containerName:string = "player";

    private storage:StorageContainer;

    constructor() {
        super();

        //StorageContainer.containerName = "storage"
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

    reset = () => {
        if (this.storage) {
            this.storage.clearEmail();
            this.storage.clearPin();
            this.storage.clearToken();
        }
    }
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