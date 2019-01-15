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
import {Api, Question} from "../../../containers";

import QuestionListPanel from "./QuestionListPanel";
import Builder from "./build/Builder";
import Home from "./home/Home";
import {SyntheticEvent} from "react";

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
    tabOffset: {
        marginBottom: "1rem"
    },
});


class Questions extends React.Component<QuestionsProps, QuestionsState> {
    private questionSubscription:any;
    public constructor(props) {
        super(props);
        this.state = {
            tab: 0,
            builder: {
                data: {},
            },
            errors: [],
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
                        question.get(true);

                        const func = () => {
                            const {currentQuestions} = question.state;
                            const questions = {
                                currentQuestions
                            }
                            this.setState({
                                questions
                            });
                        }

                        this.questionSubscription = func;

                        question.subscribe(func);
;
                    })
                //console.log(user, question);
            }
        }
    }


    public componentWillUnmount(): void {
        if (this.props.containers) {
            const x = this.props.containers.question;
            x.unsubscribe(this.questionSubscription);
            delete this.questionSubscription;
        }
    }

    choiceAction = (action:string, target?: number, value?: any) => {
        //console.log(action, target, value)
        let builder = this.state.builder;
        switch (action) {
            case "add":
                if (builder.data.type === "Multiple Choice" && value) {
                    if (builder.data.choices) {
                        builder.data.choices.push(Object.assign({}, value));
                    } else {
                        builder.data.choices = [Object.assign({}, value)]
                    }
                    this.setState({builder});
                }
                return;
            case "update":
                let choices = builder.data.choices;
                if (typeof target === "number" && typeof value !== "undefined") {
                    if (choices && choices[target]) {
                        choices[target] = Object.assign({}, value);
                        console.log(target, choices, choices[target]);
                    }
                    builder.data.choices = choices;
                    this.setState({builder});
                }
                return;
            case "correct":
                if (typeof target === "number" && this.state.builder.data) {
                    let builder = this.state.builder;
                    let choices = builder.data.choices;
                    if (choices) {
                        choices = choices.map(c => {
                            c.correct = false
                            return c;
                        });
                        choices[target].correct = true;
                    }
                    builder.data.choices = choices;
                    this.setState({builder});
                }
                return;
            case "change":
                if (typeof target === "number" && this.state.builder.data && typeof value !== "undefined") {
                    let choices = builder.data.choices;
                    if (choices) {
                        choices[target].answer = value;
                    }
                    builder.data.choices = choices;
                    this.setState({builder});
                }
                return;
            case "remove":
                if (typeof target === "number") {
                    let choices = builder.data.choices;
                    if (choices && choices.length > 0) {
                        if (choices.length === 1) {
                            choices = []
                        } else {
                            choices.splice(target, 1);
                        }
                    }
                    builder.data.choices = choices;
                    this.setState({builder});
                }
                return;
            case "reset":
                delete builder.data
                this.setState({builder});
                return;
        }
    }

    public render() {
        const {classes} = this.props;

        const tabs = [
            Home,
            Builder
        ];


        const tabsProps = [
            {},
            {
                onChange: this.builderStateChanged,
                onSubmit: this.props.containers ? this.builderSubmit(this.props.containers.question) : undefined,
                handleCategories: this.props.containers ? this.handleCategories(this.props.containers.question) : undefined,
                sendAction: this.choiceAction,
                data: this.state.builder.data,
            }
        ];
        
        return (
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Grid container spacing={16}>
                    <Grid sm={6} md={8} item>
                        <Paper elevation={1} className={classes.tabOffset}>
                            <Tabs value={this.state.tab} fullWidth onChange={this.tabChanged} scrollable scrollButtons={"auto"}>
                                <Tab label={"Home"} />
                                <Tab label={"Create Question"} />
                                <Tab label={"Create Lists"} disabled />
                                <Tab label={"Settings"} disabled />
                            </Tabs>
                        </Paper>

                        {React.createElement(tabs[this.state.tab], {
                            ...tabsProps[this.state.tab]
                        })}
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
                        
                        <QuestionListPanel 
                            onSelected={this.questionSelected}
                            questions={this.state.questions}
                        />
                    </Grid>
                </Grid>
            </main>
        );
    }
    
    public questionSelected = (evt, target) => {
        if (this.state.errors.length > 0) {
            return;
        }
        if (this.state.questions) {
            const qs = this.state.questions;
            if (qs.currentQuestions) {
                const questions = qs.currentQuestions.questions;
                const targetQuestion = questions.find(q => q._id === target);
                let builder = this.state.builder;
                if (targetQuestion) {
                    builder.data = Object.assign({}, targetQuestion);
                }
                this.setState({builder, tab: 1});
            }
        }
    }

    public builderStateChanged = (evt, key, value) => {
        let builder = this.state.builder;
        if (typeof builder.data === "undefined") {
            builder.data = {};
        }
        builder.data[key] = value;
        this.setState({builder});
    }

    public handleCategories = (container?:QuestionContainer) => {
        if (container) {
            return (evt:SyntheticEvent) => {
                //console.log(container)
                return [
                    {
                        label: "A",
                        value: "B"
                    }
                ]
            }
        }
        return undefined;
    }

    public builderSubmit = (container:QuestionContainer) => {
        if (container && this.state.builder.data) {
            const {data} = this.state.builder;
            return (evt:SyntheticEvent) => {
                evt.preventDefault();
                evt.stopPropagation();
                if (data) {
                    container.create(data);
                }
                //if (this.props.data)
                    //container.create(this.props.data)
            }
        }
        return undefined;
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
    builder: {
        data: Partial<Question>;
    };
    errors: Array<{
        type: string;
        message: string;
    }>
}


export default withStyles(styles, {withTheme: true})(withContainer(Questions, [UserContainer, QuestionContainer]));