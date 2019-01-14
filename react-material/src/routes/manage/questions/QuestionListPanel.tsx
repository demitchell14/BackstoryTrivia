import * as React from "react";
//
// import classNames from "classnames";
import {
    Avatar, Checkbox,
    ExpansionPanel, ExpansionPanelDetails,
    ExpansionPanelSummary,
    IconButton,
    List,
    ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText,
    Paper, Tooltip, Typography, withStyles
} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Api} from "../../../containers";
//import {Api} from "../../../containers";

const styles = theme => ({
    alignStart: {
        alignItems: "flex-start"
    },
    questionPrimary: {},
    questionSecondary: {},
    questionsContainer: {
        paddingTop: 1,
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
});


class QuestionListPanel extends React.Component<QuestionListPanelProps, QuestionListPanelState> {
    public constructor(props) {
        super(props);
        this.state = {} as QuestionListPanelState
    }

    public render() {
        const {classes, questions} = this.props;

        return (
            <Paper className={classes.questionsContainer} elevation={1}>
                <List component={"nav"} disablePadding>
                    {questions ? questions.currentQuestions.questions.map(question => {
                        return (
                            <ListItem key={question._id} button divider disableRipple className={classes.questionContainer}>
                                <ExpansionPanel style={{width: "100%"}}>
                                    <ExpansionPanelSummary>
                                        <ListItemAvatar>
                                            <Avatar />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={(
                                                <React.Fragment>
                                                    <Typography className={classes.questionPrimary} component={"p"}>{question.question}</Typography>
                                                </React.Fragment>
                                            )}

                                            secondary={(
                                                <React.Fragment>
                                                    <Typography className={classes.questionSecondary} component={"span"} color={"textPrimary"}>{question.answer}</Typography>
                                                </React.Fragment>
                                            )}
                                        />
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <Tooltip title={"View / Edit"}>
                                            <IconButton color={"primary"}>
                                                <FontAwesomeIcon icon={["fal", "eye"]} fixedWidth/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={"Copy As / Clone"}>
                                            <IconButton color={"primary"}>
                                                <FontAwesomeIcon icon={["fal", "clone"]} fixedWidth/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={<span>Delete Question. <b>Permanent!</b></span>}>
                                            <IconButton color={"secondary"}>
                                                <FontAwesomeIcon icon={["fal", "trash"]} fixedWidth/>
                                            </IconButton>
                                        </Tooltip>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>

                                <ListItemSecondaryAction>
                                    <Tooltip title={"Select Question"} placement={"left"} color={"primary"}>
                                        <Checkbox color={"primary"} />
                                    </Tooltip>
                                </ListItemSecondaryAction>
                            </ListItem>
                        )
                    }) : (
                        <ListItem button className={classes.questionContainer}>
                            <Typography variant={"h4"} color={"textPrimary"} >Loading Questions...</Typography>
                        </ListItem>
                    )}


                </List>
            </Paper>
        );
    }
}

interface QuestionListPanelProps {
    state?: QuestionListPanelState;
    classes?: any;
    questions?: {
        currentQuestions: Api.QuestionListResponse;
    };
}

interface QuestionListPanelState {

}

export default withStyles(styles, {withTheme: true})(QuestionListPanel)