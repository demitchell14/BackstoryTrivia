import {Container} from "unstated";
import {StorageContainer} from "..";

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
                    console.debug(json.message);
                    storage.clearToken();
                    delete json.message;
                }

                Object.keys(json).map(k => this[k] = json[k]);
                return success;
            }
            return true;
        } else {
            return false;
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