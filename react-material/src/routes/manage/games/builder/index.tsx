import * as React from "react";
import {SyntheticEvent} from "react";
import classnames from "classnames";
import {
    Button,
    Divider,
    Grid,
    Paper,
    Step,
    StepButton,
    Stepper,
    TextField,
    Typography,
    withStyles
} from "@material-ui/core";
import QuestionListPanel from "../../questions/QuestionListPanel";
import QuestionContainer from "../../../../containers/QuestionContainer";
import UserContainer from "../../../../containers/UserContainer";
import withContainer from "../../../../containers/withContainer";
import {Question} from "../../../../containers";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const styles = theme => ({
    paper: {
        margin: `0 0 ${theme.spacing.unit * 2}px 0`
    },
    padded: {
        padding: theme.spacing.unit * 2
    },
    margin: {
        margin: theme.spacing.unit * 2
    },

    fieldCls: {
        marginBottom: theme.spacing.unit,
    }
});


class Builder extends React.Component<BuilderProps, BuilderState> {
    public questionsListener: any;

    public constructor(props: BuilderProps) {
        super(props);
        this.state = {
            step: 0,
            forms: {
                basic: {
                    // title: "Help me"
                },
                questions: [],
            }
        } as BuilderState;

        console.log(props.containers)
    }

    componentWillMount(): void {
        const {containers} = this.props;
        if (containers) {
            const {question, user} = containers;
            question.init({token: user.token()})
                .then(() => {
                    question.get();

                    // const func = () => {
                    //     const {currentQuestions} = question.state;
                    //     const questions = {
                    //         currentQuestions
                    //     };
                    // };
                    //
                    // this.questionsListener = func;
                    //
                    // question.subscribe(func);
                });

        }
    }

    public render() {
        const {classes} = this.props;
        const {step} = this.state;

        return (
            <div>
                <Paper className={classes.paper}>
                    <StageIdentifier step={step} onClick={this.setStage}/>
                </Paper>
                <Paper className={classnames(classes.paper, {
                    [classes.padded]: true
                })}>

                    {this.stageSelection()}
                    <Divider className={classes.margin}/>
                    <Button onClick={this.setStage} value={step === 0 ? 0 : step - 1}>Go Back</Button>
                    <Button onClick={step === 2 ? this.sendGame : this.setStage}
                            value={step === 2 ? undefined : step + 1}>{step === 2 ? "Save" : "Continue"}</Button>
                </Paper>
            </div>
        );
    }

    public sendGame = (evt: SyntheticEvent) => {
        console.log("Saving Game Here!")
    };

    public setStage = (evt: SyntheticEvent) => {
        const target = evt.currentTarget as HTMLDivElement;
        const stage = target.getAttribute("data-value") || target.getAttribute("value") || "0";
        // console.log(stage);
        this.setState({step: Number.parseInt(stage)})
    };

    public stageSelection = () => {
        const {classes, theme, containers} = this.props;
        const {step, forms} = this.state;
        let question: QuestionContainer;
        if (containers) {
            question = containers.question
        }
        let questions = [] as any;
        // @ts-ignore
        if (question) {
            if (question.state.currentQuestions) {
                questions = question.state.currentQuestions.questions;
            }
        }

        switch (step) {
            case 0:
                return <BasicInfo
                    spacing={theme.spacing.unit}
                    className={classes.fieldCls}
                    form={forms.basic}
                    onChange={this.basicChanges}
                />;

            case 1:

                return <QuestionSelection
                    select={this.addQuestion}
                    unselect={this.removeQuestion}
                    selectedQuestions={forms.questions}
                    questions={questions}/>;

            case 2:
                return <Summary spacing={theme.spacing.unit * 2} forms={forms}/>;

            default:
                return "No Stage Selected";
        }
    };

    public addQuestion = (evt, id) => {
        const {containers} = this.props;
        const {forms} = this.state;
        if (containers) {
            if (containers.question.state.currentQuestions) {
                const allQuestions = containers.question.state.currentQuestions.questions;
                const question = Object.assign({}, allQuestions.find(q => q._id === id));
                if (question) {
                    const exists = forms.questions.findIndex(q => q._id === id);
                    if (exists >= 0) {
                        question._id = question._id + "-" + (Math.random() * 100)
                    }

                    forms.questions.push(question);

                    // console.log(forms.questions)
                    this.setState({forms});
                }
            }
        }

    };

    public removeQuestion = (evt, id) => {
        const {forms} = this.state;
        const question = forms.questions.findIndex(q => q._id === id);
        // console.log(id, question);
        if (question >= 0) {

            forms.questions.splice(question, 1);
            this.setState({forms});
        }
    };

    public basicChanges = (evt: SyntheticEvent) => {
        const target = evt.currentTarget as HTMLInputElement;

        const {forms} = this.state;
        forms.basic[target.name] = target.value;

        this.setState({forms});
        // console.log(target.name, target.value, this.state.forms.basic[target.name]);
    }

}

const BasicInfo = (props) => {
    const {className, spacing, onChange} = props;
    const form = props.form as IBasicForm;

    return (
        <Grid container spacing={spacing}>
            <Grid item md={8} xs={12}>
                <TextField
                    fullWidth
                    className={className}
                    label={"Game Title"}
                    helperText={"This will be the name of the trivia game and should be how you identify the game."}
                    name={"title"}
                    onChange={onChange}
                    defaultValue={form.title}
                />

                <TextField
                    multiline fullWidth
                    rows={2} rowsMax={4}
                    className={className}
                    label={"Game Description"}
                    helperText={"If your game requires any kind of notes, or you would like to tell the players ahead of time what the game covers, this is where you should do so."}
                    name={"description"}
                    onChange={onChange}
                    defaultValue={form.description}
                />
            </Grid>
            <Grid item md={4} xs={12}>
                <TextField
                    fullWidth
                    className={className}
                    label={"Start Time"}
                    type={"datetime-local"}
                    helperText={"This is simply used to show the players when the game is scheduled to start."}
                    name={"startDate"}
                    onChange={onChange}
                    defaultValue={form.startDate}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <TextField
                    fullWidth
                    className={className}
                    label={"Image"}
                    helperText={"Soon we will be able to upload images directly, however for now, if you want an image for attention grabbing purposes, you'll need to copy/paste the image link here."}
                    name={"image"}
                    onChange={onChange}
                    defaultValue={form.image}
                />

            </Grid>
        </Grid>
    )
};

const QuestionSelection = (props) => {
    // const questions = props.questions as Question[];
    const {selectedQuestions, questions} = props;
    return (
        <Grid container>
            <Grid item xs={12} md={5}>
                <QuestionListPanel
                    contentStyles={{maxHeight: 400}}
                    questions={selectedQuestions}
                    showUnselect
                    onUnselected={props.unselect}
                    title={"Selected Questions"}
                    emptyMessage={"Select questions from the menu on the right and they will be added here!"}
                />
            </Grid>
            <Grid style={{alignSelf: "center", justifyContent: "center", display: "flex"}} item xs={12} md={2}>
                <FontAwesomeIcon size={"3x"} icon={["fal", "arrow-from-right"]}/>
            </Grid>
            <Grid item xs={12} md={5}>
                <QuestionListPanel
                    questions={questions}
                    onSelected={props.select}
                    showSearch showSelect
                    contentStyles={{maxHeight: 400}}/>
            </Grid>
        </Grid>
    )
};

const Summary = (props) => {
    const {forms, spacing} = props;
    const basic = forms.basic as IBasicForm;
    const questions = forms.questions as Question[];

    return (
        <Grid container spacing={spacing}>
            <Grid item xs={false} md={1}/>
            <Grid item xs={12} md={4}>
                <Paper elevation={2} style={{padding: spacing}}>
                    <Grid container spacing={spacing}>
                        <Grid item xs={12}>
                            <Typography variant={"title"}>Game Name:</Typography>
                            <Typography variant={"subtitle1"}>{basic.title || "No Name Set"}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant={"title"}>Game Description:</Typography>
                            <Typography variant={"subtitle1"}>{basic.description || "No Description Set"}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant={"title"}>Game Start Time:</Typography>
                            <Typography
                                variant={"subtitle1"}>{basic.startDate ? new Date(basic.startDate).toDateString() : "No Start Set"}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant={"title"}>Game Image:</Typography>
                            {basic.image && (
                                <img src={basic.image}/>
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <QuestionListPanel
                    styles={{maxHeight: 800}}
                    questions={questions}
                    title={"Selected Questions"}
                    emptyMessage={"Please go back and select a few questions before submitting the game!"}
                />
            </Grid>
        </Grid>
    )
};

const StageIdentifier = (props) => {

    return (
        <Stepper alternativeLabel activeStep={props.step}>
            <Step>
                <StepButton data-value={0} onClick={props.onClick}>
                    <span>Basic Information</span>
                </StepButton>
            </Step>
            <Step>
                <StepButton data-value={1} onClick={props.onClick}>
                    Question Selection
                </StepButton>
            </Step>
            <Step>
                <StepButton data-value={2} onClick={props.onClick}>
                    Summary
                </StepButton>
            </Step>
        </Stepper>
    )
};

interface BuilderProps {
    state?: BuilderState;
    classes?: any;
    theme?: any;
    containers: {
        question: QuestionContainer;
        user: UserContainer;
    }
}

interface BuilderState {
    step: number;
    forms: {
        basic: IBasicForm
        questions: Question[];
    }
}

interface IBasicForm {
    title?: string;
    description?: string;
    startDate?: string;
    image?: string;
}

// @ts-ignore
export default withStyles(styles, {withTheme: true})(withContainer(Builder, [QuestionContainer, UserContainer]))