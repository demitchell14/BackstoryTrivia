import * as React from "react";

import {CSSTransition, TransitionGroup} from "react-transition-group";

import "./styles.css";

import {
    Handler as notifications,
    Notification as notifInterface,
    NotificationHandler
} from "../../store/NotificationHandler";
import {SyntheticEvent} from "react";

class Notifications extends React.Component<NotificationsProps, NotificationsState> {
    private handler:NotificationHandler;
    public constructor(props:NotificationsProps) {
        super(props);
        this.state = {
            notifications: [],
        } as NotificationsState;

        if (props.container) {
            this.handler = props.container;
        } else {
            this.handler = notifications;
        }
    }

    public componentWillMount() {
        this.handler.on("received", () => {
            this.setState({
                notifications: this.handler.getNotifications()
            })
        })
    }

    public render() {
        const {position} = this.props;
        return (
            <div className={`notifications ${position ? position : "bottom-right"}`}>
                <TransitionGroup>
                    {this.state.notifications.map((notification) => {
                        const {key, type, message,} = notification;
                        return (
                            <CSSTransition
                                key={key}
                                timeout={600}
                                classNames={"notification"}>
                                <div className={`alert alert-${type}`}>
                                    <button
                                        type="button"
                                        data-target={key}
                                        onClick={this.remove.bind(this)}
                                        className="close" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    <p className={"alert-body"}>{message}</p>
                                </div>
                            </CSSTransition>
                        );

                    })}
                </TransitionGroup>
            </div>
        )
    }

    private remove(evt:SyntheticEvent): void {
        const key =evt.currentTarget.getAttribute("data-target") as string;
        this.handler.remove(Number.parseInt(key, 10));
    }
}



interface NotificationsProps {
    state?: NotificationsState;
    position?: "bottom-right"|"top-right"|"bottom-left"|"top-left";
    container?:NotificationHandler;
}
interface NotificationsState {
    notifications:notifInterface[];
}



export default Notifications;