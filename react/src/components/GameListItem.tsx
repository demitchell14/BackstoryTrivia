import * as React from "react";
import * as moment from "moment";
import {Moment} from "moment";
import {Link} from "react-router-dom";
import {Api} from "../store/api";

let api = Api();
class GameListItem extends React.Component<ItemProps, ItemState> {
    public constructor(props) {
        super(props);

        this.state = {
            authorized: false,
        } as ItemState;

        let session = api.session;
        let gameID = session.gameKey();
        //console.log(gameID, this.props.token);
        if (gameID) {
            if (gameID === this.props.token) {
                ///let myName = session.teamName();
                api.authorize().then(authorized => {
                    if (typeof authorized === "boolean" && authorized) {
                        this.setState({authorized: authorized});
                    }
                })
            }
        }
    }

    async componentDidMount() {


    }

    actions() {
        return {
            onClick: (evt:Event) => {

                let btn = evt.currentTarget as HTMLLinkElement

                console.log(btn, this.props);
            }
        }
    }

    buttonHandler() {
        let started = this.props.started;
        let registered = this.state.authorized;
        let type, text,
            props = {
                className: "",
                role: "",
                disabled: false,
                to: ""
                //onClick: this.actions().onClick
            };

        if (this.props.managed) {
            props.className = "btn btn-outline-info btn-block",
                props.role = "button",
                props.disabled = false,
                props.to = `/manage/${this.props.token}`;
            text = "Manage Game";
            type = "a";
        } else {

            if (started && registered) {
                props.className = "btn btn-outline-success btn-block";
                    props.role = "button",
                    props.disabled = false,
                    props.to = `/game/${this.props.token}`;
                    text = "Join Game",
                    type = "a"
            }
            else if (started && !registered) {
                props.className = "btn btn-outline-warning btn-block",
                    props.role = "button",
                    props.disabled = false,
                    props.to = `/register/${this.props.token}`;
                    type = "a",
                    text = "Register Team";
            } else {
                props.className = "btn btn-danger btn-block btn-sm",
                    type = "button",
                    props.disabled = true,
                    text = "Game not started yet"
            }
        }
            if (type.toLowerCase() === "a")
                return React.createElement(Link, {...props}, text)
            return React.createElement(type, props, text);
    }

    public render() {

        return (
            <div className="card">
                <img className="img-fluid card-img-top w-100 d-block" src={`${this.props.image}`} />
                    <div className="card-body">
                        <h4 className="card-title">{this.props.name}</h4>
                        <h6 className="text-muted card-subtitle mb-2">{moment(this.props.startTime).format("LLLL")}</h6>
                        <div className="table-responsive">
                            <table className="table table-sm">
                                <tbody>
                                <tr>
                                    <td><strong>Total Teams</strong></td>
                                    <td>{this.props.teams || 0}</td>
                                </tr>
                                <tr>
                                    <td><strong>Total Questions</strong></td>
                                    <td>{this.props.questions || 0}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        {this.buttonHandler()}

                    </div>
            </div>

        )
    }
}

interface ItemProps {
    image?:string;
    name:string;
    token:string;
    teams?:number;
    questions?:number;
    started?:boolean;
    startTime?:string|Moment;
    managed?:boolean;
}

interface ItemState {
    startTime?:Moment;
    authorized:boolean;
}

export default GameListItem;