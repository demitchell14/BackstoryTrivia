import {Container} from "unstated";
import * as io from "socket.io-client";
import Timeout = NodeJS.Timeout;


export class SocketContainer extends Container<SocketProps> {
    static containerName:string = "socket";

    socket:SocketIOClient.Socket;
    poller:Timeout;
    
    constructor() {
        super();
        
    }

    connected = () => this.socket && this.socket.connected;

    disconnect = () => {
        if (this.connected()) {
            if (this.poller)
                clearInterval(this.poller);
            this.socket.disconnect();
        }
    }
    
    connect = (token:string, game:string) => {
        const socket = io.connect();
        return new Promise((resolve, reject) => {
            socket.on("connect", () => {
                this.socket = socket;
                this.socket.emit("authenticate", token, game);
                resolve(this.socket);
            })
        })
    }

    startPolling = () => {
        console.log("Polling");
        if (this.connected()) {
            console.log("Starting Poller");
            const id =  setInterval(() => {
                this.socket.emit("poller");
            }, 2500);
            this.poller = id;
            return id;
        }
        return -1;
    }

}

export interface SocketProps {
    
}