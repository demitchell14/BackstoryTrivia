import * as React from "react";
import {SyntheticEvent} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Paper,
    Tab,
    Tabs,
    withStyles,
} from "@material-ui/core";
import QuestionContainer from "../../../containers/QuestionContainer";
import UserContainer from "../../../containers/UserContainer";
import withContainer from "../../../containers/withContainer";
import {Api, Question} from "../../../containers";

import QuestionListPanel from "./QuestionListPanel";
import Builder from "./build/Builder";
import Home from "./home/Home";

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
            deleteModalActive: false,
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
                            };
                            this.setState({
                                questions
                            });
                        };

                        this.questionSubscription = func;

                        question.subscribe(func);
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
                            c.correct = false;
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
                this.setState({selectedTarget: undefined, deleteModalActive: false, deleteTarget: undefined});
                // this.setState({builder});
                return;
        }
    };

    public render() {
        const {classes} = this.props;

        const tabs = [
            Home,
            Builder
        ];


        const tabsProps = [
            {},
            {
                // onChange: this.builderStateChanged,
                onSubmit: this.props.containers ? this.builderSubmit(this.props.containers.question) : undefined,
                handleCategories: this.props.containers ? this.handleCategories(this.props.containers.question) : undefined,
                sendAction: this.choiceAction,
                selectedId: this.state.selectedTarget ? this.state.selectedTarget : undefined
                // data: this.state.builder.data,
            }
        ];
        
        return (
            <main className={classes.content}>

                <Dialog
                    open={this.state.deleteModalActive}
                    onClose={() => this.setState({deleteModalActive: false})}
                >
                    <DialogTitle>Are you sure you want to delete this question?</DialogTitle>
                    <DialogContent>
                        {this.state.deleteTarget ? this.state.deleteTarget.component : undefined}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({deleteModalActive: false})}>Cancel</Button>
                        <Button
                            onClick={this.deleteQuestion(this.state.deleteTarget ? this.state.deleteTarget.target : undefined)}
                            color={"primary"}>Continue</Button>
                    </DialogActions>
                </Dialog>

                <div className={classes.toolbar} />
                <Grid container spacing={16}>
                    <Grid sm={6} md={7} item>
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

                    <Grid sm={6} md={5} item>
                        <QuestionListPanel showSearch showActions
                            onSelected={this.questionSelected}
                            onDeleted={this.questionDeleted}
                            onCloned={this.questionCloned}
                            questions={this.state.questions}
                        />
                    </Grid>
                </Grid>
            </main>
        );
    }
    
    public questionSelected = (evt, target) => {
        if (this.state.errors.length > 0) {
            console.error(this.state.errors);
            return;
        }
        this.setState({selectedTarget: target, tab: 1});
    };

    public questionCloned = (evt, target: string) => {
        if (this.state.errors.length > 0) {
            console.error(this.state.errors);
            return;
        }
        this.setState({selectedTarget: `__${target}`, tab: 1});
    };

    public questionDeleted = (evt, target: string) => {
        const questionObject = this.state.questions;
        if (questionObject && questionObject.currentQuestions) {
            const {questions} = questionObject.currentQuestions;
            const question = questions.find(q => q._id === target);
            if (question) {
                const modal = (
                    <div>
                        <DialogContentText>You're about to delete the question,
                            "<span>{question.question}</span>"</DialogContentText>
                        <DialogContentText>Deleting questions from your collection is a permanent action and cannot be
                            undone!</DialogContentText>
                    </div>
                );
                console.log("Trying to delete " + target);
                this.setState({
                    deleteTarget: {
                        component: modal, target
                    },
                    deleteModalActive: true
                });
            }
        }

    };

    public deleteQuestion = (target?: string) => {
        return (evt) => {
            if (target) {
                if (this.props.containers) {
                    const {question} = this.props.containers;
                    if (question) {
                        question.delete(target)
                            .then((success) => {
                                this.setState({deleteModalActive: false})
                            })
                    }
                }
            }
        }
    };

    public builderStateChanged = (evt, key, value) => {
        let builder = this.state.builder;
        if (typeof builder.data === "undefined") {
            builder.data = {};
        }
        builder.data[key] = value;
        this.setState({builder});
    };

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
    };

    public builderSubmit = (container:QuestionContainer) => {
        if (container) {
            return (evt: SyntheticEvent, data) => {
                evt.preventDefault();
                evt.stopPropagation();

                if (data) {
                    if (data._id) {
                        container.update(data);
                    } else {
                        container.create(data);
                    }
                }
                //if (this.props.data)
                    //container.create(this.props.data)
            }
        }
        return undefined;
    };

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
    }>;
    selectedTarget?: any;
    deleteTarget?: {
        target: string;
        component: any;
    };
    deleteModalActive: boolean;
}


export default withStyles(styles, {withTheme: true})(withContainer(Questions, [UserContainer, QuestionContainer]));