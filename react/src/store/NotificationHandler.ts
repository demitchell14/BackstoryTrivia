import {EventEmitter} from "events";

let totalNotifications = 1;
export class NotificationHandler  extends EventEmitter {
    private notifications:Notification[];

    public constructor(props?:any) {
        super();
        this.notifications = [];

        this.attachListeners();
    }

    public getNotifications() {
        return this.notifications;
    }

    public send(notification:string|NotificationType, str?:string) {
        if (typeof str === "undefined") {
            this.emit("send", {
                type: "info",
                message: notification,
            });
        } else {
            this.emit("send", {
                type: notification,
                message: str,
            })
        }
    }

    public remove(id:number) {
        this.emit("remove", id)
    }

    private attachListeners() {

        /**
         * The Send Notification listener.
         */
        this.addListener("send", (obj:{type:NotificationType, message:string, timeout?:number}) => {
            const key = ++totalNotifications;
            this.notifications.push({
                key,
                message: obj.message,
                type: obj.type,
                autohide: setTimeout(() => {
                    this.remove(key)
                }, (obj.timeout || 5000)),
            });
            this.emit("received");
        });

        this.addListener("remove", (id:number) => {
            const key = this.notifications.findIndex(a => a.key === id);
            if (typeof key === "number" && key >= 0) {
                const x = this.notifications.splice(key, 1);
                clearTimeout(x[0].autohide);
                this.emit("received");
            } else {
                console.error("Invalid key sent");
            }
        })

    }

}

type NotificationType = "info"|"warning"|"success"|"danger"|"primary";

export interface Notification {
    key: number;
    message:string;
    type:NotificationType;
    autohide:any;
}

export let Handler:NotificationHandler;
export function init() {
    Handler = new NotificationHandler();
    return Handler;
}