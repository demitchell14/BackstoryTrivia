import * as React from "react";
import {SyntheticEvent} from "react";
//
import classnames from "classnames";
import {
    Avatar,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    IconButton,
    InputBase,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
    TextField,
    Tooltip,
    Typography,
    withStyles
} from "@material-ui/core";
import {Api, Question} from "../../../containers";
import MenuIcon from "@material-ui/icons/Menu";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
// const FAIcon = React.lazy(() => import("../../../FontAwesome"));
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
    },
    noMargin: {
        margin: 0
    },
    w100: {width: "100%"},
    dflex: {
        display: "flex",
        width: "100%"
    },
    orderContainer: {
        display: "flex",
        flexDirection: "column",
        marginRight: ".75rem"
    }
});


class QuestionListPanel extends React.Component<QuestionListPanelProps, QuestionListPanelState> {
    public constructor(props) {
        super(props);
        this.state = {
            filter: {
                // question: "who"
            }
        } as QuestionListPanelState
    }

    public applyFilters = () => {
        const {filter} = this.state;
        return (question: Question) => {
            let showQuestion = true;
            if (typeof question._id === "undefined") return false;

            if (filter.question) {
                showQuestion = question.question.toLowerCase().includes(filter.question);
            }

            return showQuestion;
        }
    };

    public filterChanged = (evt: SyntheticEvent) => {
        const target = evt.currentTarget as HTMLInputElement;
        const {filter} = this.state;
        filter.question = target.value.toLowerCase();
        this.setState({filter});
    };

    public render() {
        // console.log("List Rendered");
        const {classes, questions, title, showSearch, showActions, showSelect, showUnselect, emptyMessage, showDetails, onUpdateDetails, showOrderModifier} = this.props;

        const answer = (question:Question) => {
            if (question.type === "Open Ended") {
                return question.answer;
            }
            if (question.choices) {
                const correct = question.choices.findIndex(c => c.correct);
                if (correct >= 0) {
                    return String.fromCharCode(65 + correct) + ". " + question.choices[correct].answer;
                }
            }
            return "";
        };

        let filteredQuestions = [] as Question[];
        if (questions) {
            if (questions instanceof Array) {
                filteredQuestions = questions.filter(this.applyFilters());
            } else {
                filteredQuestions = questions.currentQuestions.questions.filter(this.applyFilters())
            }
        }
        // const filteredQuestions =  questions instanceof Array ? [] : ;

        return (
            <ExpansionPanel defaultExpanded style={this.props.styles}>
                <ExpansionPanelSummary>
                    <Typography variant={"h6"} style={{margin: 0}}>{title ? title : "My Collection"}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.noPadding}>
                    <List component={"nav"} disablePadding
                          className={classnames(classes.questionsContainer, [classes.w100])}
                          style={this.props.contentStyles}>
                        {showSearch && (
                            <ListItem divider className={classes.noPadding}>
                                <Paper className={classnames(classes.inputRoot, [classes.noMargin, classes.w100])}
                                       square elevation={0}>
                                    <IconButton className={classes.iconButton} aria-label="Menu">
                                        <MenuIcon/>
                                    </IconButton>
                                    <InputBase className={classes.input} onChange={this.filterChanged}
                                               placeholder="Search Question"/>
                                </Paper>
                            </ListItem>
                        )}
                        {questions ? filteredQuestions.length > 0 ? filteredQuestions.map((question, idx) => {
                            return (
                                <ListItem key={question._id} button divider disableRipple
                                          className={classes.questionContainer}>
                                    <ExpansionPanel style={{width: "100%"}}>
                                        <ExpansionPanelSummary>
                                            {showOrderModifier && (
                                                <div style={{alignSelf:"center"}} className={classes.orderContainer}>
                                                    <IconButton disabled={idx === 0}
                                                        onClick={this.handleAction("order-changed", question, "up")}
                                                        style={{padding: ".5rem"}} color={"primary"}>
                                                        <FontAwesomeIcon fixedWidth icon={["fas", "caret-up"]} style={{fontSize: ".5em"}} />
                                                    </IconButton>
                                                    <IconButton disabled={idx === filteredQuestions.length-1}
                                                        onClick={this.handleAction("order-changed", question, "down")}
                                                        style={{padding: ".5rem"}} color={"primary"}>
                                                        <FontAwesomeIcon fixedWidth icon={["fas", "caret-down"]} style={{fontSize: ".5em"}} />
                                                    </IconButton>
                                                </div>
                                            )}
                                            <ListItemAvatar style={{alignSelf:"center"}}>
                                                <Tooltip placement={"left"}
                                                    title={question.points ? question.points + " Points" : question.timeLimit + " Seconds"}
                                                >
                                                    <Avatar>{question.points || question.timeLimit || ""}</Avatar>
                                                </Tooltip>
                                            </ListItemAvatar>
                                            <ListItemText style={{alignSelf:"center"}}
                                                primary={(
                                                    <React.Fragment>
                                                        <Typography variant={"subtitle1"}
                                                                    className={classes.questionPrimary}
                                                                    component={"p"}>{question.question}</Typography>
                                                    </React.Fragment>
                                                )}

                                                secondary={(
                                                    <React.Fragment>
                                                        <Typography variant={"caption"}
                                                                    className={classes.questionSecondary}
                                                                    component={"span"} color={"textPrimary"}>
                                                            {answer(question)}
                                                        </Typography>
                                                    </React.Fragment>
                                                )}
                                            />
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>

                                            {showDetails && (
                                                <div className={classes.dflex}>
                                                    <TextField fullWidth disabled={typeof onUpdateDetails === "undefined"}
                                                               onChange={this.handleAction("update-details", {_id: question._id, target: "timeLimit"})}
                                                               defaultValue={question.timeLimit}
                                                               type={"number"} label={"Time Limit"}/>
                                                    <TextField fullWidth disabled={typeof onUpdateDetails === "undefined"}
                                                               onChange={this.handleAction("update-details", {_id: question._id, target: "points"})}
                                                               defaultValue={question.points}
                                                               type={"number"} label={"Points"}/>
                                                </div>
                                            )}

                                            {showActions && (
                                                <div>
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
                                                </div>
                                            )}
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>

                                    {((showSelect || showUnselect) && !(showSelect && showUnselect)) && (
                                        <ListItemSecondaryAction>
                                            <Tooltip
                                                title={showSelect ? "Select Question" : showUnselect ? "Remove Question" : ""}
                                                placement={"left"} color={"primary"}>
                                                <IconButton color={"default"}
                                                            onClick={this.handleAction(showSelect ? "select" : showUnselect ? "unselect" : "", question)}>
                                                    <FontAwesomeIcon fixedWidth
                                                            icon={["far", showSelect ? "plus" : showUnselect ? "minus" : "check"]}/>
                                                </IconButton>
                                            </Tooltip>
                                        </ListItemSecondaryAction>
                                    )}
                                </ListItem>
                            )
                        }) : (
                            <ListItem>
                                <ListItemText
                                    primary={emptyMessage || "No questions match what you have searched for. Maybe you should create the question?"}/>
                            </ListItem>
                        ) : (
                            <ListItem button className={classes.questionContainer}>
                                <ListItemText primary={"Loading Questions... "}
                                              secondary={"This may take a few moments."}/>
                            </ListItem>
                        )}


                    </List>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }

    public handleAction = (type:string, obj:Partial<Question>&{target?:any}, other?:any) => {
        return (evt:SyntheticEvent) => {
            switch (type) {
                case "view":
                    if (this.props.onSelected) {
                        this.props.onSelected(evt, obj._id)
                    }
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
                case "select":
                    if (this.props.onSelected) {
                        this.props.onSelected(evt, obj._id)
                    }
                    break;
                case "unselect":
                    if (this.props.onUnselected) {
                        this.props.onUnselected(evt, obj._id)
                    }
                    break;
                case "update-details":
                    // TODO

                    if (this.props.onUpdateDetails) {
                        this.props.onUpdateDetails(evt, obj._id, obj.target);
                    }
                    break;
                case "order-changed":
                    evt.stopPropagation();
                    if (this.props.onOrderChanged) {
                        this.props.onOrderChanged(evt, obj._id, other);
                    }
                    break;
            }
        }
    }
}

interface QuestionListPanelProps {
    state?: QuestionListPanelState;
    classes?: any;
    questions?: {
        currentQuestions: Api.QuestionListResponse;
    } | Array<Question>;
    title?: string;
    showSearch?: boolean;
    showActions?: boolean;
    showSelect?: boolean;
    showUnselect?: boolean;
    emptyMessage?: string;
    showDetails?: boolean;
    onSelected?: (evt:SyntheticEvent, target: any) => any;
    onUnselected?: (evt: SyntheticEvent, target: any) => any;
    onDeleted?: (evt: SyntheticEvent, target: any) => any;
    onCloned?: (evt: SyntheticEvent, target: any) => any;
    onUpdateDetails?: (evt:SyntheticEvent, target: any, value: any) => any;
    styles?: React.CSSProperties;
    contentStyles?: React.CSSProperties;
    maxHeight?: string | number;
    showOrderModifier?: boolean;
    onOrderChanged?: (evt:SyntheticEvent, target:any, direction?: any) => any;
}

interface QuestionListPanelState {
    filter: {
        question?: string;
    }
    order?: string[];
}

//@ts-ignore
export default withStyles(styles, {withTheme: true})(QuestionListPanel)