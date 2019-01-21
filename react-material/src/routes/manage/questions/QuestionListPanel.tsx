import * as React from "react";
import {SyntheticEvent} from "react";
//
// import classNames from "classnames";
import {
    Avatar,
    Checkbox,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
    Tooltip,
    Typography,
    withStyles
} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Api, Question} from "../../../containers";
//import {Api} from "../../../containers";

const styles = theme => ({
    alignStart: {
        alignItems: "flex-start"
    },
    questionPrimary: {},
    questionSecondary: {},
    questionsContainer: {
        //paddingTop: 1,
        marginTop: 12,
        overflow: "auto",
        maxHeight: 600,
    },
    questionContainer: {
        alignItems: "flex-start",
        padding: 0
    },
    inputRoot: {
        margin: "6px 8px 2px",
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: "auto",
    },

    input: {
        marginLeft: 8,
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        width: 1,
        height: 28,
        margin: 4,
    },
    noPadding: {
        padding: 0
    }
});


class QuestionListPanel extends React.Component<QuestionListPanelProps, QuestionListPanelState> {
    public constructor(props) {
        super(props);
        this.state = {} as QuestionListPanelState
    }

    public render() {
        // console.log("List Rendered");
        const {classes, questions} = this.props;

        const answer = (question:Question) => {
            if (question.type === "Open Ended") {
                return question.answer;
            }
            if (question.choices) {
                const correct = question.choices.find(c => c.correct);
                if (correct) {
                    return correct.answer;
                }
            }
            return "";
        };

        return (
            <ExpansionPanel defaultExpanded className={classes.questionsContainer}>
                <ExpansionPanelSummary><Typography variant={"h6"}>Your Collection</Typography></ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.noPadding}>
                    <List component={"nav"} disablePadding>
                        {questions ? questions.currentQuestions.questions.filter(q => typeof q._id !== "undefined").map(question => {
                            return (
                                <ListItem key={question._id} button divider disableRipple
                                          className={classes.questionContainer}>
                                    <ExpansionPanel style={{width: "100%"}}>
                                        <ExpansionPanelSummary>
                                            <ListItemAvatar>
                                                <Avatar/>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={(
                                                    <React.Fragment>
                                                        <Typography className={classes.questionPrimary}
                                                                    component={"p"}>{question.question}</Typography>
                                                    </React.Fragment>
                                                )}

                                                secondary={(
                                                    <React.Fragment>
                                                        <Typography className={classes.questionSecondary}
                                                                    component={"span"} color={"textPrimary"}>
                                                            {answer(question)}
                                                        </Typography>
                                                    </React.Fragment>
                                                )}
                                            />
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>
                                            <Tooltip title={"View / Edit"}>
                                                <IconButton color={"primary"}
                                                            onClick={this.handleAction("view", question)}>
                                                    <FontAwesomeIcon icon={["fal", "eye"]} fixedWidth/>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={"Copy As / Clone"}>
                                                <IconButton color={"primary"}
                                                            onClick={this.handleAction("clone", question)}>
                                                    <FontAwesomeIcon icon={["fal", "clone"]} fixedWidth/>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={<span>Delete Question. <b>Permanent!</b></span>}>
                                                <IconButton color={"secondary"}
                                                            onClick={this.handleAction("delete", question)}>
                                                    <FontAwesomeIcon icon={["fal", "trash"]} fixedWidth/>
                                                </IconButton>
                                            </Tooltip>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>

                                    <ListItemSecondaryAction>
                                        <Tooltip title={"Select Question"} placement={"left"} color={"primary"}>
                                            <Checkbox color={"primary"}/>
                                        </Tooltip>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        }) : (
                            <ListItem button className={classes.questionContainer}>
                                <Typography variant={"h4"} color={"textPrimary"}>Loading Questions...</Typography>
                            </ListItem>
                        )}


                    </List>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
        return (
            <Paper className={classes.questionsContainer} elevation={1}>

            </Paper>

        );
    }

    public handleAction = (type:string, obj:Question) => {
        return (evt:SyntheticEvent) => {
            if (this.props.onSelected) {
                switch (type) {
                    case "view":
                        this.props.onSelected(evt, obj._id);
                        break;
                    case "delete":
                        if (this.props.onDeleted) {
                            this.props.onDeleted(evt, obj._id);
                        }
                        break;
                    case "clone":
                        if (this.props.onCloned) {
                            this.props.onCloned(evt, obj._id);
                        }
                        break;
                }
                //this.props.onSelected(evt, )
            }
        }
    }
}

interface QuestionListPanelProps {
    state?: QuestionListPanelState;
    classes?: any;
    questions?: {
        currentQuestions: Api.QuestionListResponse;
    };
    onSelected?: (evt:SyntheticEvent, target: any) => any;
    onDeleted?: (evt: SyntheticEvent, target: any) => any;
    onCloned?: (evt: SyntheticEvent, target: any) => any;
}

interface QuestionListPanelState {

}

export default withStyles(styles, {withTheme: true})(QuestionListPanel)