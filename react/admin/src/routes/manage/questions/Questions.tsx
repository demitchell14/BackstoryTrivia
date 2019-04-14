import * as React from "react";
import {SyntheticEvent} from "react";
import {
    BottomNavigation, BottomNavigationAction,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Drawer,
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
import Importer from "./import/Importer";

// const Builder = React.lazy(() => import ("./build/Builder"));
// const Importer = React.lazy(() => import ("./import/Importer"));

import Home from "./home/Home";

// @ts-ignore
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {match as MatchProps, RouteProps, RouterProps, withRouter} from "react-router";

const drawerWidth = 400;

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
        marginRight: 400
    },
    inputRoot: {
        //margin: "6px 8px 2px",
        marginBottom: theme.spacing.unit,
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: "auto",
    },
    drawerPaper: {
        paddingTop: "4rem",
        width: drawerWidth,
    },
    mainContainer: {
        // display: "flex",
        // flexDirection: "column"
    },
    questionsDrawer: {
        // marginTop: "3rem",
        width: drawerWidth,
        flexShrink: 0
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

    public tabs = (self:this) => [
        {
            component: Home,
            label: "Home",
            path: "/manage/questions",
            props: {}
        },
        {
            component: Builder,
            label: "Builder",
            path: "/manage/questions/builder",
            props: {
                // onChange: this.builderStateChanged,
                onSubmit: self.props.containers ? self.builderSubmit(self.props.containers.question) : undefined,
                handleCategories: self.props.containers ? self.handleCategories(self.props.containers.question) : undefined,
                sendAction: self.choiceAction,
                selectedId: self.state.selectedTarget ? self.state.selectedTarget : undefined
                // data: this.state.builder.data,
            }
        },
        {
            component: Importer,
            label: "Import",
            path: "/manage/questions/import",
            props: {}
        }
    ]

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

        // [
        //     {label: "Home", icon: <FontAwesomeIcon className={classes.navIcon} fixedWidth icon={["far", "home"]} />},
        //     {label: "Games", icon: <FontAwesomeIcon className={classes.navIcon} fixedWidth icon={["fal", "clipboard-list-check"]} />},
        //     {label: "Builder", icon: <FontAwesomeIcon className={classes.navIcon} fixedWidth icon={["fas", "plus-circle"]} />},
        //     //{label: "Home", icon: <FontAwesomeIcon className={classes.navIcon} icon={["far", "home"]} />}
        // ]
        const {classes, match} = this.props;
        const tabs = this.tabs(this);

        // {React.createElement(this.tabs[this.state.tab], {
        //     ...tabsProps[this.state.tab]
        // })}

        const target = tabs.find(t => t.path === match.url);
        if (target) {
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


                    <div className={classes.toolbar}/>
                    <Navigator style={{marginBottom: 0}}
                               classes={classes}
                               active={target.label}
                               tabs={tabs.map(tab => ({
                                   label: tab.label,
                                   icon: <span/>
                               }))}
                               onChange={this.handleTabChange}
                    />
                    <div className={classes.mainContainer}>
                        <div style={{position: "relative"}}>
                            {target && React.createElement(target.component, {
                                ...target.props
                            })}
                            {/*<TransitionGroup>*/}
                            {/*<CSSTransition key={target ? target.name : -1} timeout={500} classNames={"slide-down"}>*/}
                            {/**/}
                            {/*</CSSTransition>*/}
                            {/*</TransitionGroup>*/}
                        </div>

                        <Drawer
                            anchor={"right"}
                            className={classes.questionsDrawer}
                            classes={{
                                paper: classes.drawerPaper
                            }}
                            variant={"permanent"}
                        >
                            <QuestionListPanel
                                showSearch showActions contentStyles={{maxHeight: "100%"}}
                                onSelected={this.questionSelected}
                                onDeleted={this.questionDeleted}
                                onCloned={this.questionCloned}
                                questions={this.state.questions}
                            />
                        </Drawer>

                        {/*<Drawer variant={"permanent"}*/}
                        {/*        className={classes.questionsDrawer}*/}
                        {/*        classes={{*/}
                        {/*            paper: classes.drawerPaper*/}
                        {/*        }}*/}
                        {/*>*/}
                        {/*    */}
                        {/*</Drawer>*/}
                    </div>
                </main>
            );
        } else {
            return (<span />)
        }
    }

    handleTabChange = (evt, n) => {
        const {history, match} = this.props;
        const tabs = this.tabs(this);
        const target = tabs.find(t => t.label === n);
        if (target && match.url !== target.path) {
            history.push(target.path);
        }
    };

    public render2() {
        const {classes} = this.props;

        const tabs = this.tabs(this);


        // const tabsProps = [
        //     {},
        //     {
        //         // onChange: this.builderStateChanged,
        //         onSubmit: this.props.containers ? this.builderSubmit(this.props.containers.question) : undefined,
        //         handleCategories: this.props.containers ? this.handleCategories(this.props.containers.question) : undefined,
        //         sendAction: this.choiceAction,
        //         selectedId: this.state.selectedTarget ? this.state.selectedTarget : undefined
        //         // data: this.state.builder.data,
        //     }
        // ];
        
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

                <Paper elevation={1} className={classes.tabOffset}>
                    <Tabs value={this.state.tab} fullWidth onChange={this.tabChanged}>
                        <Tab label={"Home"}/>
                        <Tab label={"Create Question"}/>
                        <Tab label={"Create Lists"} disabled/>
                    </Tabs>
                </Paper>

                {/*{React.createElement(this.tabs[this.state.tab], {*/}
                {/*    ...tabsProps[this.state.tab]*/}
                {/*})}*/}

                {React.createElement(tabs[this.state.tab].component, {...tabs[this.state.tab].props})}

                <Drawer variant={"permanent"}
                        className={classes.questionsDrawer}
                        classes={{
                            paper: classes.drawerPaper
                        }}
                >
                    <QuestionListPanel showSearch showActions contentStyles={{maxHeight: "100%"}}
                                       onSelected={this.questionSelected}
                                       onDeleted={this.questionDeleted}
                                       onCloned={this.questionCloned}
                                       questions={this.state.questions}
                    />
                </Drawer>
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

interface QuestionsProps extends RouterProps, RouteProps {
    state?: QuestionsState;
    containers?: {
        question:QuestionContainer;
        user:UserContainer;
    }
    classes?: any;
    match: MatchProps;
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

const Navigator = props => {
    const {classes, tabs, active, onChange, style} = props;
    if (window.innerWidth > 425) {
        return (
            <Paper elevation={1} className={classes.tabOffset}>
                <Tabs value={active} variant={"fullWidth"} onChange={onChange}
                      classes={{scrollable: classes.scroller}} style={style}>
                    {tabs ? tabs.map((tab, id) => <Tab key={id} value={tab.label} label={tab.label}
                                                       icon={tab.icon}/>) : undefined}
                </Tabs>
            </Paper>
        )
    }
    return (
        <BottomNavigation value={active} className={props.classes.bottomNav} onChange={onChange}>
            {tabs ? tabs.map((tab, id) => <BottomNavigationAction key={id} value={tab.label} label={tab.label}
                                                                  icon={tab.icon}/>) : undefined}
        </BottomNavigation>
    )
};


// @ts-ignore
export default withStyles(styles, {withTheme: true})(withRouter(withContainer(Questions, [UserContainer, QuestionContainer])));