import {Container} from "unstated";

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
    
    test = async () => {
        console.log("Hello From Storage Container");
    }
}