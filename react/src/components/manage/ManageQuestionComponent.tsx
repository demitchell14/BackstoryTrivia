import * as React from "react";
import {Question, Team} from "../../routes/GameList";

class ManageQuestionComponent extends React.Component<ManageQuestionProps, ManageQuestionState> {

    public constructor(props) {
        super(props);
        this.state = {
            active: false,
            gameover: props.questionid < 0
        } as ManageQuestionState;
        //let {questionid, teams, questions} = props;
    }

    componentDidMount() {
        this.renderState(this.props);
    }
    componentWillReceiveProps(props:ManageQuestionProps) {
        this.renderState(props);
    }

    private renderState(props:ManageQuestionProps) {

        // @ts-ignore
        let {questionid, questions, teams, active} = props;
        let currentQuestion = undefined as Question|undefined;
        if (questions instanceof Array && typeof questionid === "number") {
            if (questionid >= 0) {
                currentQuestion = questions[questionid];
                this.setState({question: currentQuestion, gameover: false});
            } else {
                console.log(questionid)
                this.setState({gameover: true})
                // -- game is over because question index is less than 0
            }
        }
        if (teams instanceof Array && typeof currentQuestion !== "undefined") {
            const teamValues = teams.map(team => {
                // @ts-ignore
                let answered = team.answers.findIndex(ans => ans.question === currentQuestion.question);

                let res = {} as {name:string; correct?:boolean; selected?: string};
                res.name = team.name;
                if (answered >= 0) {
                    let answer = team.answers[answered];
                    res.correct = answer.correct;
                    res.selected = answer.answer;
                }
                return res;
            })

            this.setState({teams: teamValues});
            //console.log(this.state.teams)
        }
        this.setState({active: active.started && !active.paused});
    }

    private renderTeams() {
        let teams = this.state.teams;
        //let base = React.createElement("li", {className: "list-group-item"}, []);
        let classBase = "d-flex justify-content-between list-group-item";
        let response = [] as any;
        if (!this.state.active) {
            classBase += " disabled";
        }

        if (typeof teams === "undefined")
            return (<li key={"waiting..."} className={`${classBase}`}>Loading...</li>)

        if (this.state.gameover) {
            // -- TODO send gameover stats
        }

        let elements = teams.map((team, id) => {
            if (typeof team.correct === "boolean") {
                return (
                    <li key={`${this.props.questionid}-${id}`} className={`${classBase} ${team.correct ? "list-group-item-success" : "list-group-item-danger"}`}>
                        <span>{team.name}</span>
                        <span className={`badge align-self-center ${team.correct ? "badge-success" : "badge-danger"}`}>{team.correct ? "correct" : "incorrect"}</span>
                    </li>
                )
            } else {
                return (
                    <li key={`${this.props.questionid}-${id}`} className={`${classBase} list-group-item-list`}>
                        <span>{team.name}</span>
                        <span>Waiting...</span>
                    </li>
                )
            }
        });

        [].push.apply(response, elements);

        console.log(this.props.questionid, teams)

        return response;
    }

    public render() {
        return (
            <div className={"col-md-5"}>
                <ul className="list-group">
                    {this.renderTeams()}
                </ul>
            </div>
        )
    }
}

interface ManageQuestionProps {
    active: {started: boolean, paused: boolean};
    questionid: number|undefined;
    teams: Array<Team>;
    questions: Array<Question>|undefined;
    state?: ManageQuestionState;
}


interface ManageQuestionState {
    active: boolean;
    gameover: boolean;
    question?: Question;
    teams: Array<{
        name: string;
        selected?: string;
        correct?: boolean;
    }>;
}

export default ManageQuestionComponent;