import * as React from "react";
import {
    Divider,
    Grid, IconButton, InputBase,
    Paper, Tab, Tabs,
    withStyles,
} from "@material-ui/core";
import {Menu as MenuIcon} from "@material-ui/icons";
import QuestionContainer from "../../../containers/QuestionContainer";
import UserContainer from "../../../containers/UserContainer";
import withContainer from "../../../containers/withContainer";
import {Api} from "../../../containers";

import QuestionListPanel from "./QuestionListPanel";
import Builder from "./Builder";

const styles = theme => ({
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
    },
    inputRoot: {
        //margin: "6px 8px 2px",
        marginBottom: theme.spacing.unit,
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


class Questions extends React.Component<QuestionsProps, QuestionsState> {
    public constructor(props) {
        super(props);
        this.state = {
            tab: 0,
        } as QuestionsState
    }
    
    public componentWillMount(): void {
        //console.log(this.props.containers)
        if (this.props.containers) {
            //console.log(this.props.containers);
            const {user, question} = this.props.containers;
            if (user && question) {
                question.init({token: user.token()})
                    .then(() => {
                        question.get();

                        question.subscribe(() => {
                            const {currentQuestions} = question.state;
                            const questions = {
                                currentQuestions
                            }
                            this.setState({
                                questions
                            });
                        })

//                        console.log(question);
                    })
                //console.log(user, question);
            }
        }
    }

    public render() {
        const {classes} = this.props;

        const tabs = [
            Builder
        ]

        const tabsProps = [
            {onChange: (evt, key, value) => console.log(key, "=", value)}
            //{input: this.state.questions && this.state.questions.currentQuestions ? this.state.questions.currentQuestions.questions : []}
        ]

//        console.log(tabsProps);
        return (
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Grid container spacing={16}>
                    <Grid sm={6} md={8} item>
                        <Paper elevation={1}>
                            <Tabs value={this.state.tab} fullWidth onChange={this.tabChanged}>
                                <Tab label={"Create Question"} />
                                <Tab label={"Create Lists"} disabled />
                                <Tab label={"Settings"} disabled />
                            </Tabs>
                            {React.createElement(tabs[this.state.tab], {
                                ...tabsProps[this.state.tab]
                            })}
                        </Paper>
                    </Grid>
                    <Grid sm={6} md={4} item>
                        <Paper className={classes.inputRoot} elevation={1}>
                            <IconButton className={classes.iconButton} aria-label="Menu">
                                <MenuIcon />
                            </IconButton>
                            <InputBase className={classes.input} placeholder="Search Question" />
                            <IconButton className={classes.iconButton} aria-label="Search">
                                S
                            </IconButton>
                            <Divider className={classes.divider} />
                            <IconButton color="primary" className={classes.iconButton} aria-label="Directions">
                                D
                            </IconButton>
                        </Paper>
                        
                        <QuestionListPanel questions={this.state.questions}
                        />
                    </Grid>
                </Grid>
            </main>
        );
    }

    public tabChanged = (evt, value) => {
        this.setState({tab: value});
    }
}

interface QuestionsProps {
    state?: QuestionsState;
    containers?: {
        question:QuestionContainer;
        user:UserContainer;
    }
    classes?: any;
}

interface QuestionsState {
    tab: number;
    questions?: {
        currentQuestions?: Api.QuestionListResponse;
    };
}


export default withStyles(styles, {withTheme: true})(withContainer(Questions, [UserContainer, QuestionContainer]));