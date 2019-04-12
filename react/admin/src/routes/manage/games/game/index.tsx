import * as React from "react";
import {useState, ComponentState, useEffect} from "react";
import {Grid, List, ListItem, ListItemText, ListItemSecondaryAction, Paper, IconButton} from "@material-ui/core";
import QuestionListPanel from "../../questions/QuestionListPanel";
import withContainer from "../../../../containers/withContainer";
import GamesContainer from "../../../../containers/GamesContainer";
import {RouteProps, RouterProps, withRouter} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const info = [
    { name: "Name", variable: "name" },
    { name: "Token", variable: "token" },
    { name: "Description", variable: "description" },
    { name: "Start Time", variable: "startTime" },
    { name: "Image", variable: "image" },
];

function GameComponent(props:GameCompProps) {
    const [state, setState] = useState({}) as ComponentState;

    useEffect(() => {
        if (props.containers.games.state.games.length > 0) {
            const games = props.containers.games.state.games;
            const game = games.find(game => game._id === props.match.params.tab)
            if (game)
                setState({game});
            else
                props.containers.games.getGame(props.match.params.tab)
        } else {
            props.containers.games.getGame(props.match.params.tab)
        }
    });

    if (state.game) {
        return (
            <Grid container spacing={16}>
                <Grid md={5} item>
                    <Paper elevation={1}>
                        <List>
                            {info.map(inf => (
                                <ListItem key={inf.variable}>
                                    <ListItemText
                                        primary={inf.name}
                                        secondary={state.game[inf.variable] || `No ${inf.name} set`}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton style={{opacity: .1}}><FontAwesomeIcon icon={["fas", "pencil"]} fixedWidth /></IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid md={7} item>
                    <QuestionListPanel
                        showDetails
                        styles={{maxHeight: 800}}
                        questions={state.game.questions}
                        title={"Game Questions"}
                        emptyMessage={"No questions for this game."}
                    />
                </Grid>
            </Grid>
        )
    }
    return <div />
}

interface GameCompProps extends RouterProps, RouteProps {
    containers: {
        games: GamesContainer;
    }
    match: any;
    game: any;
}

// @ts-ignore
export default withContainer(withRouter(GameComponent), [GamesContainer]);

// class GameComponent extends React.Component<GameComponentProps, GameComponentState> {
//     public constructor(props) {
//         super(props);
//         this.state = {} as GameComponentState
//     }
//
//     public render() {
//         return (
//             <div>
//                 Hello
//             </div>
//         );
//     }
// }
//
// interface GameComponentProps {
//     state?: GameComponentState;
// }
//
// interface GameComponentState {
//
// }
//
// export default GameComponent