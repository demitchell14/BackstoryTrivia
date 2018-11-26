import * as React from "react";
import InputGroupComponent from "../InputGroupComponent";
import {GameOptions} from "../../routes/GameList";
//import {ChangeEvent, EventHandler} from "react";
import * as moment from "moment";

class GameOptionsComponent extends React.Component<GameOptionsProps, GameOptionsState> {
    public constructor(props) {
        super(props);

        this.state = {
            game: this.props.game
        } as GameOptionsState;
        //console.log(this.props.game);
    }

    private inputChange(evt:any) {
        let game = this.state.game;
        let target = evt.target.name;



        game[target] = evt.target.value;

        this.setState({game: game});
        this.props.onChange(game)
    }

    private onSubmit(evt) {
        evt.preventDefault();
    }

    public render() {
        return (
            <div className={"card"}>
                <form onSubmit={this.onSubmit} className={"card-body"}>
                    <InputGroupComponent>
                        <label className="col-form-label" htmlFor="name">Game Token:</label>
                        <input
                            className="form-control"
                            type="text"
                            name="token"
                            value={this.state.game.token}
                            readOnly={true}
                        />
                        <button className={"btn btn-outline-primary"}>Change</button>
                    </InputGroupComponent>
                    <hr/>
                    <InputGroupComponent>
                        <label className="col-form-label" htmlFor="name">Name:</label>
                        <input
                            className="form-control"
                            type="text"
                            name="name"
                            placeholder={this.props.game.name ? `current: "${this.props.game.name}"` :  "Enter the name of the game."}
                            defaultValue={this.state.game.name}
                            onChange={this.inputChange.bind(this)}
                        />
                    </InputGroupComponent>

                    <InputGroupComponent>
                        <label className="col-form-label" htmlFor="description">Description:</label>
                        <textarea
                            rows={3}
                            className="form-control"
                            name="description"
                            placeholder={this.props.game.description ? `current: "${this.props.game.description}"` : "Enter a description for your game.\nExample: We will be asking questions about Halloween!"}
                            defaultValue={this.state.game.description}
                            onChange={this.inputChange.bind(this)}/>
                    </InputGroupComponent>

                    <InputGroupComponent>
                        <label className="col-form-label" htmlFor="name">Image Link:</label>
                        <input
                            className="form-control"
                            type="text"
                            name="image"
                            placeholder={this.props.game.image ? `current: "${this.props.game.image}"` :  "Enter the name of the game."}
                            defaultValue={this.state.game.image}
                            onChange={this.inputChange.bind(this)}
                        />
                    </InputGroupComponent>
                    <small className={"text-muted"}>Soon we will be able to upload images directly here, but for now, you must copy/paste a link.</small>

                    <hr/>

                    <InputGroupComponent>
                        <label className="col-form-label" htmlFor="name">Start Time:</label>
                        <input
                            className="form-control"
                            type="datetime-local"
                            name="startTime"
                            placeholder={this.props.game.startTime ? `current: "${this.props.game.name}"` :  "Enter the start time of the game."}
                            defaultValue={moment(this.state.game.startTime).format("YYYY-MM-DD\THH:mm")}
                            onChange={this.inputChange.bind(this)}
                        />
                    </InputGroupComponent>


                </form>
            </div>
        )
    }
}

interface GameOptionsProps {
    game:GameOptions;
    onChange:any;
    state?:GameOptionsState;
}

interface GameOptionsState {
    game:GameOptions;
}

export default GameOptionsComponent;