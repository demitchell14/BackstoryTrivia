import * as React from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import ContainerComponent from "../components/ContainerComponent";
import InputGroupComponent from "../components/InputGroupComponent";
import {ReactElement, SyntheticEvent} from "react";
import {Api} from "../store/api";
import {RegistrationResponse} from "../store/register";
import {Redirect} from "react-router";
import GameGate from "../store/GameGate";
import {GameOptions} from "./GameList";
//import Api from "../store/api";


class MemberElement extends React.Component<MProps, MState> {
    public constructor(props) {
        super(props);
        this.state = {
            value: ""
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }
    public render() {
        return (
            <InputGroupComponent>
                <label className="col-form-label" htmlFor="memberName">Name:</label>
                <input
                    className="form-control"
                    type="text"
                    name="memberName"
                    onChange={this.store.bind(this)}
                />
                <button
                    className="btn btn-outline-danger"
                    type="button"
                    onClick={this.removeRow.bind(this)}>
                    <FontAwesomeIcon  icon={["fal", "trash-alt"]}/>
                </button>
            </InputGroupComponent>
        )
    }

    public removeRow(evt:SyntheticEvent) {
        //console.log(evt);
        return this.props.remove(evt.target, this.props.id);
    }
    public store(evt:SyntheticEvent) {
        return this.props.update(evt, this.props.id);
    }
}
interface MProps {
    remove:any;
    update:any;
    id:number
    state?:MState;
}
interface MState {
    value:string;
}

class RegisterRoute extends React.Component<RegisterProps, RegisterState> {

    public constructor(props) {
        super(props);

        this.state = {
            ...props.match.params,
            memberKey: 0,
            memberElements: [],
            formData: {
                token: props.match.params.token,
                name: "",
                members:[]
            },
            registered: false,
        } as RegisterState;
    }

    public componentDidMount() {
        this.addMember();
    }

    public shouldComponentUpdate(nextProps, nextState) {
        //console.log(nextProps, nextState)
        //console.log(this.props, this.state);
        return true;
    }

    public removeMember(evt, id?:number) {
        let list = this.state.memberElements;
        if (id) {
            let idx = list.findIndex(f => f.props.id === id)
            list.splice(idx, 1);
            this.setState({memberElements: list});
        }
    }

    public updateMember(evt, id?:number) {
        //console.log(evt.target.value, id);
        if (id)
            this.state.formData.members[id] = evt.target.value
    }

    public addMember(evt?:any) {
        let ele = (<MemberElement
            id={this.state.memberKey+1}
            remove={this.removeMember.bind(this)}
            update={this.updateMember.bind(this)}
            key={this.state.memberKey+1}/>);
        let elements = this.state.memberElements;
        elements.push(ele)
        //console.log(elements)
        this.setState({memberKey: this.state.memberKey + 1, memberElements: elements});
        //console.log(this);
    }

    public async createTeam(evt) {
        evt.preventDefault();

        //console.log("HERE");

        const formData = this.state.formData;
        let members = formData.members as Array<string>;
        let teamName = formData.name;
        let filteredMembers = members.filter(m => m.length > 0);

        const response = await Api().register("team",{
            game: formData.token,
            name: teamName,
            members: filteredMembers
        }).catch(err => {
            // -- TODO Handle errors for creating teams
            console.error(err)
        }) as RegistrationResponse;

        if (response) {
            //console.log(response);
            if (response.error) {
                alert(response.error.join("\n"));
            } else {
                let {team} = response;

                if (team.key) {
                    let session = Api().session;
                    // -- TODO add session data here
                    session.setTeam(response)
                    //console.log(session.teamKey());
                    this.setState({registered: true});
                    //console.log(this.state.registered);
                }
            }

        }

        //console.log(response);

        //console.log(Api())
    }

    public store(evt) {
        let value = evt.currentTarget.value;
        let target = evt.currentTarget.name;
        this.state.formData[target] = value;
        //console.log(target, value)
    }


    private ready(data:{game: GameOptions}) {
        let game = data.game;

        this.setState({game: game});
    }

    public render() {
        //console.log(this.state);
        if (this.state.registered) {
            return (
                <Redirect to={'/list'}/>
            )
        }
        let game = this.state.game;

        return (
            <GameGate gameToken={this.props.match.params.token} onLoad={this.ready.bind(this)}>
                {game ? (
                    <ContainerComponent type={"row"}>
                        <div className="col-md-4">
                            <img className="img-thumbnail img-fluid" src={game.image ? game.image : ""} />
                            <h4 className="text-capitalize text-center mb-4">{game.name}</h4>
                        </div>
                        <div className={"col"}>
                            <form onSubmit={this.createTeam.bind(this)}>
                                <fieldset name={"team"}>
                                    <legend>Team Details</legend>
                                    <p className="text-muted d-none d-md-block">You are registering to join
                                        <span className="text-capitalize text-primary pl-1">{game.name}</span>.&nbsp;</p>

                                    <InputGroupComponent>
                                        <label className="col-form-label" htmlFor="teamName">Team Name:</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="name"
                                            onChange={this.store.bind(this)}
                                        />
                                    </InputGroupComponent>

                                </fieldset>

                                <fieldset name={"members"}>
                                    <legend>Member Names</legend>

                                    {this.state.memberElements.map(el => el)}

                                    <div className={"d-flex my-2"}>
                                        <button
                                            type={"button"}
                                            className={"btn btn-info"}
                                            onClick={this.addMember.bind(this)}>Add Member</button>
                                        <button
                                            className={"btn btn-success flex-fill mx-3"}
                                            type={"submit"}>Create Team</button>
                                    </div>
                                </fieldset>
                            </form>
                        </div>
                    </ContainerComponent>
                ) : <div></div>}
            </GameGate>
        )
    }
}

interface RegisterProps {
    state?: RegisterState;
    match: {
        params: {
            token:string;
        }
    }
}
interface RegisterState {
    token?:string;
    memberKey:number;
    memberElements: JSX.Element[];
    formData: {
        token:string;
        members:Array<string>;
        name:string;
    };
    registered:boolean;
    html:ReactElement<any>;
    game:Partial<GameOptions>;
}

export default RegisterRoute