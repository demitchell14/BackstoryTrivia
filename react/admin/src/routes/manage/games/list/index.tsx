import * as React from "react";
import {
    Avatar,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Theme,
    withStyles
} from "@material-ui/core";
import withContainer from "../../../../containers/withContainer";
import QuestionContainer from "../../../../containers/QuestionContainer";
import UserContainer from "../../../../containers/UserContainer";
import GamesContainer, {GameObject} from "../../../../containers/GamesContainer";
import {SyntheticEvent} from "react";
import QuestionListPanel from "../../questions/QuestionListPanel";
import {RouteProps, RouterProps, withRouter} from "react-router";

const styles = (theme:Theme) => ({
    paper: {
        margin: `0 0 ${theme.spacing.unit * 2}px 0`
    },
    antiMargin: {
        margin: `0 -${theme.spacing.unit * 3}px`
    },
    listRoot: {
        background: theme.palette.background.paper,
        [theme.breakpoints.up('sm')]: {
            height: window.innerHeight - 300,
            borderTopRightRadius: ".25rem",
            borderBottomRightRadius: ".25rem",
        }
    },
    gameBasic: {
        [theme.breakpoints.up('md')]: {
            top:0,
            right: 0,
            position: "absolute",
            padding: "1.25rem",
            background: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
        },
        // [theme.breakpoints.down('sm')]: {
        //     width: "100%",
        //     display: "block",
        //     position: "relative"
        // }
    },
    gameText: {
        [theme.breakpoints.up('md')]: {
            color: theme.palette.primary.contrastText,
        }
    }
});

class ListComponent extends React.Component<ListComponentProps, ListComponentState> {
    public constructor(props) {
        super(props);
        this.state = {} as ListComponentState
    }
    
    componentWillMount(): void {
        const {games} = this.props.containers
        games.getGames()
    }

    selectGame = (id:string) => {
        return (evt:SyntheticEvent) => {
            console.log(this.props, id)
            this.props.history.push("/manage/games/" + id);
            // const {games} = this.props.containers;
            // const game = games.state.games.find(g => g._id === id);
            // if (game) {
            //     this.setState({
            //         selectedGame: id,
            //         game
            //     })
            // }
        }
    }

    basicInfo = [
        { name: "Name", variable: "name" },
        { name: "Token", variable: "token" },
        { name: "Description", variable: "description" },
        { name: "Start Time", variable: "startTime" },
        { name: "Image", variable: "image" },
    ]


    public render() {
        // @ts-ignore
        const {classes, theme} = this.props;
        const {games} = this.props.containers;
        const game = this.state.game;

        console.log(games.state.games.length);

        return (
            <div className={classes.antiMargin}>
                <Grid container spacing={16}>
                    <Grid sm={4} item>
                        <List className={classes.listRoot}>
                            <ListItem>

                            </ListItem>
                            {games.state.games.length > 0 ? games.state.games.map((game, idx) => {
                                return (
                                    <ListItem selected={game._id === this.state.selectedGame} key={game._id} button onClick={this.selectGame(game._id)}>
                                        <ListItemAvatar>
                                            <Avatar>{idx+1}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={game.name}
                                            secondary={game.description || "No description"}
                                        />
                                    </ListItem>
                                )
                            }) : (
                                <ListItem button>
                                    {/*<ListItemAvatar>*/}
                                    {/*    <Avatar>1</Avatar>*/}
                                    {/*</ListItemAvatar>*/}
                                    <ListItemText
                                        primary={"No games found."}
                                    />
                                </ListItem>
                            )}
                        </List>
                    </Grid>
                    <Grid sm={8} item>
                        <Card style={{marginRight: 24, minHeight: window.innerHeight - 300}}>
                            <CardContent style={{position: "relative", display: "flex"}}>

                                {game && (
                                    <div>
                                        <div>
                                            <List component="nav">
                                                {this.basicInfo.map(inf => (
                                                    <ListItem key={inf.variable}>
                                                        <ListItemText
                                                            primary={inf.name}
                                                            secondary={game[inf.variable] || `No ${inf.name} set`}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </div>

                                        <QuestionListPanel
                                            showDetails
                                            styles={{maxHeight: 800}}
                                            questions={game.questions}
                                            title={"Game Questions"}
                                            emptyMessage={"No questions for this game."}
                                        />

                                    {/*<Grid container>*/}
                                    {/*    <Grid md={7} item>*/}
                                    {/*        <QuestionListPanel*/}
                                    {/*            showDetails*/}
                                    {/*            styles={{maxHeight: 800}}*/}
                                    {/*            questions={game.questions}*/}
                                    {/*            title={"Game Questions"}*/}
                                    {/*            emptyMessage={"No questions for this game."}*/}
                                    {/*        />*/}
                                    {/*        /!*<Paper elevation={2} style={{padding: 8}}>*!/*/}
                                    {/*        /!*    <List>*!/*/}
                                    {/*        /!*        {game.questions && game.questions.map((question, idx) => question && (*!/*/}
                                    {/*        /!*            <ListItem  key={question._id}>*!/*/}
                                    {/*        /!*                <ListItemAvatar>*!/*/}
                                    {/*        /!*                    <Avatar>{idx+1}</Avatar>*!/*/}
                                    {/*        /!*                </ListItemAvatar>*!/*/}
                                    {/*        /!*                <ListItemText*!/*/}
                                    {/*        /!*                    primary={question.question}*!/*/}
                                    {/*        /!*                    secondary={question.answer}*!/*/}
                                    {/*        /!*                />*!/*/}
                                    {/*        /!*            </ListItem>*!/*/}
                                    {/*        /!*        ))}*!/*/}
                                    {/*        /!*    </List>*!/*/}
                                    {/*        /!*</Paper>*!/*/}
                                    {/*    </Grid>*/}
                                    {/*    <Grid md={5} item>*/}
                                    {/*        <div className={classes.gameBasic}>*/}
                                    {/*            <div>*/}
                                    {/*                <Typography variant={"title"} className={classes.gameText}>Game Name:</Typography>*/}
                                    {/*                <Typography variant={"subtitle1"} className={classes.gameText}>{game.name || "No Name Set"}</Typography>*/}
                                    {/*            </div>*/}
                                    {/*            <div>*/}
                                    {/*                <Typography variant={"title"} className={classes.gameText}>Game Token:</Typography>*/}
                                    {/*                <Typography variant={"subtitle1"} className={classes.gameText}>{game.token|| "No Token Set"}</Typography>*/}
                                    {/*            </div>*/}
                                    {/*            <div>*/}
                                    {/*                <Typography variant={"title"} className={classes.gameText}>Game Description:</Typography>*/}
                                    {/*                <Typography variant={"subtitle1"} className={classes.gameText}>{game.description || "No Description Set"}</Typography>*/}
                                    {/*            </div>*/}
                                    {/*            <div>*/}
                                    {/*                <Typography variant={"title"} className={classes.gameText}>Game Start Time:</Typography>*/}
                                    {/*                <Typography*/}
                                    {/*                    variant={"subtitle1"} className={classes.gameText}>{game.startTime ? new Date(game.startTime).toDateString() : "No Start Set"}</Typography>*/}
                                    {/*            </div>*/}
                                    {/*            <div>*/}
                                    {/*                <Typography variant={"title"} className={classes.gameText}>Game Image:</Typography>*/}
                                    {/*                {game.image ? (*/}
                                    {/*                    <img src={game.image}/>*/}
                                    {/*                ) : (*/}
                                    {/*                    <Typography variant={"subtitle1"} className={classes.gameText}>No Image Set</Typography>*/}
                                    {/*                )}*/}
                                    {/*            </div>*/}
                                    {/*        </div>*/}
                                    {/*    </Grid>*/}
                                    {/*</Grid>*/}
                                    </div>
                                )}
                                
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

interface ListComponentProps extends RouterProps, RouteProps {
    state?: ListComponentState;
    classes?: any;
    theme: Theme;
    containers: {
        question: QuestionContainer;
        user: UserContainer;
        games: GamesContainer;
    }
}

interface ListComponentState {
    selectedGame: string;
    game?: GameObject;
    menu: null|any;
}

const me = withRouter(ListComponent);
// @ts-ignore
export default withStyles(styles, {withTheme: true})(withContainer(me, [QuestionContainer, UserContainer, GamesContainer]))