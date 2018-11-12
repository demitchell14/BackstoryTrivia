import * as React from "react";
import ContainerComponent from "../components/ContainerComponent";

import {Api} from "../store/api";
import {Redirect} from "react-router";
import {apiRequest} from "../store/fetch";
import QuestionListComponent from "../components/manage/QuestionListComponent";
import {GameOptions} from "./GameList";
import GameOptionsComponent from "../components/manage/GameOptionsComponent";
import * as _ from "lodash";

//import {User} from "../store/session";

import "../css/Manage.css";
import GameControllerComponent from "../components/manage/GameControllerComponent";

const api = Api();
class ManageRoute extends React.Component<ManageProps, ManageState> {

    public constructor(props) {
        super(props);
        
        this.state = {
            authorized: api.session.user.isAuthorized(this.props.match.params.token),
            saveChanges: false,
            unSaved: [],
            saved: false,
        } as ManageState;

    }

    public componentDidMount() {
        this.loadGame()
    }

    componentWillUnmount() {

    }

    private async loadGame(): Promise<{error?:any, game?:GameOptions}> {
        let response = await apiRequest("game", {
            //path: "",
            headers: {
                game: this.props.match.params.token,
                //token: api.session.user.getAuthToken(),
                authorized: api.session.user.getAuthToken(),
            }
        });

        let json = await response.json();

        if (json.error) {
            this.setState({error: json.error})
        } else {
            if (json.game) {
                this.setState({data: json.game});
            } else {
                this.setState({error:"Unknown Error"});
            }
        }

        return json;
    }

    private gameChanged(game:GameOptions|Array<{answer:string, correct?:boolean}>) {
        if (this.state.data) {
            if (game instanceof Array) {
                //console.log(_.isEqual(game, this.state.data.questions));
                if (!_.isEqual(game, this.state.data.questions)) {
                    let unSaved = this.state.unSaved;
                    let idx = unSaved.findIndex(q => q.key === "questions");
                    if (idx === -1)
                        unSaved.push({key: "questions", value: game});
                    else
                        unSaved.splice(idx, 1, {key: "questions", value: game})
                    this.setState({saveChanges: true, unSaved: unSaved});
                } else {
                    this.setState({saveChanges: false});
                }
            } else {
                let difference = _.reduce(game, (result, value, key) => {
                    let res = {
                        key: key,
                        value: value,
                    };
                    //@ts-ignore
                    return _.isEqual(value, this.state.data[key]) ? result : result.concat(res);
                }, []);

                this.setState({saveChanges: difference.length > 0, unSaved: difference})
            }
            //console.log(`Properties differ: ${}`)
        }
    }

    private async gameSave(evt:any) {
        //let currentGame = _.cloneDeep(this.state.data) as GameOptions;
        //console.log(this.state.data)
        //this.state.unSaved.map(({key, value}) => {
//            currentGame[key] = value;
        //});

        apiRequest("manage", {
            path: "game/save",
            method: "POST",
            body: JSON.stringify(this.state.unSaved),
            headers: {
                "Content-Type": "application/json",
                game: this.props.match.params.token,
                //token: api.session.user.getAuthToken(),
                authorized: api.session.user.getAuthToken(),
            }
        }).then(res => {
            if (res.status === 200) {
                this.setState({saved: false, unSaved: [], saveChanges: false});
            }
        })



    }

    private controller(data) {
        this.loadGame().then(res => {
            console.log(res)
        })
    }

    public render() {
        const isStarted = typeof this.state.data !== "undefined" && this.state.data.started
        if (!this.state.authorized || this.state.saved) {
            return (<Redirect to={"/manage"}/>)
        } else {
            if (this.state.data) {
                return (
                    <ContainerComponent type={`row mb-extended ${this.state.saveChanges ? "" : ""}`}>
                        {this.state.saveChanges ? (
                            <div className={"save-changes-alert alert alert-warning"}>
                                <p>You have unsaved changes! Save your changes before you leave this page!</p>
                                <button
                                    onClick={this.gameSave.bind(this)}
                                    className={"btn btn-success"}>Save</button>
                            </div>
                        ) : ""}

                        <div className={"col-12"}>
                            <GameControllerComponent
                                controller={this.controller.bind(this)}
                                game={this.state.data}
                                authorized={this.state.authorized}
                            />
                        </div>

                        {!isStarted ? (
                            <div className={"col-md-6"}>
                                <QuestionListComponent
                                    onChange={this.gameChanged.bind(this)}
                                    questions={_.cloneDeep(this.state.data.questions)}/>
                            </div>
                        ) : ""}

                        {!isStarted ? (
                            <div className={"col-md-6"}>
                                <GameOptionsComponent
                                    onChange={this.gameChanged.bind(this)}
                                    game={_.cloneDeep(this.state.data)} />
                            </div>
                        ) : ""}

                    </ContainerComponent>
                )
            } else {
                return (
                    <div>Loading...</div>
                )
            }
        }
    }
}

interface ManageProps {
    match: {
        params: {
            token:string;
        }
    }
    state?:ManageState;
}

interface ManageState {
    authorized:boolean;
    data?:GameOptions;
    unSaved:Array<{key:string, value:string|any}>;
    error?:any;
    started?:boolean;
    paused?:boolean;
    saveChanges:boolean;
    saved: boolean;
}

export default ManageRoute;