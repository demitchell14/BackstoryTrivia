import {Container} from "unstated";
import logger from "../../util/logger";

const VER = "v2";
export class StorageContainer extends Container<any>{
    static containerName:string = "storage";

    constructor() {
        super();

        //StorageContainer.containerName = "storage"
    }
    setToken = (token:string) => {
        //localStorage.setI
        localStorage.setItem(`${VER}-token`, token);
        return localStorage.getItem(`${VER}-token`);
    };
    
    hasToken = () => localStorage.getItem(`${VER}-token`) !== null
    
    getToken = () => localStorage.getItem(`${VER}-token`) || "";

    clearToken = () => localStorage.removeItem(`${VER}-token`);


    setEmail = (email:string) => {
        localStorage.setItem(`${VER}-email`, email);
        return localStorage.getItem(`${VER}-email`);
    }
    
    hasEmail = () => localStorage.getItem(`${VER}-email`) !== null;
    
    getEmail = () => localStorage.getItem(`${VER}-email`) || "";

    clearEmail = () => localStorage.removeItem(`${VER}-email`);


    setPin = (pin:boolean) => {
        localStorage.setItem(`${VER}-pin`, pin ? "yes" : "no");
        return localStorage.getItem(`${VER}-pin`);
    };

    hasPin = () => localStorage.getItem(`${VER}-pin`) !== null

    getPin = () => localStorage.getItem(`${VER}-pin`) || "";

    clearPin = () => localStorage.removeItem(`${VER}-pin`);
    
    setTeamKey = (key:string) => {
        sessionStorage.setItem(`${VER}-teamkey`, key);
        return sessionStorage.getItem(`${VER}-teamkey`);
    } 
    
    getTeamKey = () => sessionStorage.getItem(`${VER}-teamkey`) || "";
    
    hasTeamKey = () => sessionStorage.getItem(`${VER}-teamkey`) !== null;
    
    clearTeamKey = () => sessionStorage.removeItem(`${VER}-teamkey`);


    setGameID = (key:string) => {
        sessionStorage.setItem(`${VER}-gametoken`, key);
        return sessionStorage.getItem(`${VER}-gametoken`);
    }

    getGameID = () => sessionStorage.getItem(`${VER}-gametoken`) || "";

    hasGameID = () => sessionStorage.getItem(`${VER}-gametoken`) !== null;

    clearGameID = () => sessionStorage.removeItem(`${VER}-gametoken`);


    settings = (key:string) => {
        // TODO setup settings to be saved on device
        switch (key) {
            case "vibrate": return true;
        }
        return undefined;
    }

    
    test = async () => {
        logger.log("Hello From Storage Container");
    }
}