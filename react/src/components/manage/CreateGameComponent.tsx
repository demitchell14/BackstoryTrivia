import * as React from "react";
import InputGroupComponent from "../InputGroupComponent";
import ContainerComponent from "../ContainerComponent";
import {RefObject} from "react";
import {apiRequest} from "../../store/fetch";
import {Api} from "../../store/api";


const api = Api();
class CreateGameComponent extends React.Component {
    inputRef: RefObject<HTMLInputElement>;

    public constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }


    private async createGame(evt) {
        evt.preventDefault();
        if (this.inputRef.current) {
            let input = this.inputRef.current;
            let token = input.value;
            let body = {} as any;
            if (token)
                body.token = token;
            else
                body.generate = true;

            let response = await apiRequest("manage", {
                path: ["game", "create"],
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorized: api.session.user.getAuthToken()
                },
                body: JSON.stringify(body)
            });

            console.log(response)
        }
    }

    render() {
        return (
            <ContainerComponent type={"alert alert-info"} className={"mt-3"}>
                <div className={"close"}>&times;</div>
                <h4>Create a new game!</h4>
                <p>In order to make a new game, all you need to do is specify a token, or automatically generate a token. This token is how we identify each game.
                    It is also part of the url you will need to provide your guests. If you choose to create a custom token, please note that it must be unique across the entire platform.</p>
                <p className={"d-none"}>After you create a base game, you will be sent to a page where you will manage and create the trivia game</p>
                <form onSubmit={this.createGame.bind(this)}>
                    <InputGroupComponent type={"inline"}>
                        <label className={"col-form-label"}>Token:</label>
                        <input
                            className={"form-control"}
                            name={"token"}
                            ref={this.inputRef}
                            placeholder={"Leave empty to automatically generate."}
                            type={"text"} />
                    </InputGroupComponent>
                    <button className={"btn btn-success mt-2"}>Create</button>
                </form>
            </ContainerComponent>
        )
    }
}

export default CreateGameComponent;