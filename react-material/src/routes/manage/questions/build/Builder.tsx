import * as React from "react";
import {RefObject, SyntheticEvent} from "react";
import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardMedia,
    Divider,
    Grid,
    Paper,
    Step,
    StepButton,
    Stepper,
    TextField,
    Theme,
    Typography,
    withStyles
} from "@material-ui/core";

import "../style.css";
import AutoSelect from "../../../../components/autoselect/AutoSelect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Question} from "../../../../containers";
import MultipleChoice from "./MultipleChoice";
import withContainer from "../../../../containers/withContainer";
import QuestionContainer from "../../../../containers/QuestionContainer";

const styles = (theme:Theme) => {
    return {
        questionTypeCls: {
            height: 100,
            [theme.breakpoints.up("md")]: {
                height: 200
            }
        },
        buildContainer: {
            marginTop: 0,
            [theme.breakpoints.up("md")]: {
                minHeight: 500
            }
        },
        buildStep: {
            padding: "0 1rem"
        },
        imageUploader: {
            display: "flex",
            flexGrow: 1,
            margin: "auto",
            minHeight: 140
        },
        imagesContainer: {
            flexDirection: "column",
            display: "flex",
            minHeight: 60
        },
        image: {
            height: 140
        },
        centered: {
            textAlign: "center"
        },
        choiceList: {
            //height: 150,
            height: 240,
            overflow: "auto"
        },
        choiceBody: {
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
        },
        paperMargin: {
            marginBottom: "1rem"
        }
    }
};


class Builder extends React.Component<BuilderProps, BuilderState> {
    inputFields: {
        question: RefObject<HTMLInputElement>;
        points: RefObject<HTMLInputElement>;
        timeLimit: RefObject<HTMLInputElement>;
    };

    public constructor(props) {
        super(props);
        this.state = {
            stage: 0,
            data: {}
        } as BuilderState;

        this.inputFields = {
            question: React.createRef(),
            points: React.createRef(),
            timeLimit: React.createRef(),
        }
        
    }

    public componentWillMount(): void {
        if (this.props.selectedId) {
            this.setNewQuestion(this.props.selectedId);
        }
    }

    public componentWillUpdate(nextProps: Readonly<BuilderProps>, nextState: Readonly<BuilderState>, nextContext: any): void {
    }

    public componentWillReceiveProps(nextProps: Readonly<BuilderProps>, nextContext: any): void {
        if (typeof nextProps.selectedId !== "undefined") {
            this.setNewQuestion(nextProps.selectedId);
        }
    }

    public render() {
        // console.log("Builder Rendered");
        let {classes} = this.props;
        const {stage, data} = this.state;
        const {type} = data;
        let Body;


        switch (stage) {
            case 0:
                Body = <QType className={classes.questionTypeCls} onChange={this.onChange}/>;
                break;
            case 1:
                Body = <QDetails
                    classes={classes}
                    onChange={this.onChange}
                    handleAutoSelect={this.handleAutoSelect}
                    handleMultipleChoice={this.handleMultipleChoice}
                    sendAction={this.props.sendAction}
                    choiceChanged={this.choiceChanged}
                    container={this.props.containers ? this.props.containers.question : []}
                    data={data}
                />;
                break;
            case 2:
                Body = <QSummary/>;
                break;
            default:
                Body = null;
        }

        return (
            <div>
                <Paper className={classes.paperMargin}>
                    <StageIdentifier type={type} hasId={typeof data._id !== "undefined"} onClick={this.stageClicked}
                                     step={stage}/>
                </Paper>
                <Paper>
                    <Grid className={classes.buildContainer} spacing={16} container alignContent={"space-between"}>
                        <Grid item xs={12}/>
                        <Grid item xs={12}>
                            {Body}
                        </Grid>

                        <Grid item xs={12}>
                            <div className={"builder-action-buttons"}>
                                <Button
                                    data-step={0}
                                    onClick={this.reset}
                                    className={"builder-action-button"}
                                    color={"secondary"} variant={"text"}
                                >
                                    Reset
                                </Button>
                                <Button
                                    disabled={typeof stage === "number" ? stage === 0 : true}
                                    onClick={this.onChange}
                                    data-step={typeof stage === "number" ? stage - 1 : 0}
                                    className={"builder-action-button"}
                                    variant={"contained"}
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={typeof stage === "number" ?
                                        stage === 2 ?
                                            this.onSubmit : this.onChange
                                        : this.onChange}
                                    data-step={typeof stage === "number" ? stage + 1 : 0}
                                    className={"builder-action-button"} color={"primary"}
                                    variant={"contained"}
                                >
                                    {typeof stage === "number" ? stage === 2 ? "Finish" : "Next" : "Next"}
                                </Button>
                            </div>
                        </Grid>

                    </Grid>
                </Paper>
            </div>
        );
    }

    public componentWillUnmount(): void {
        if (this.props.containers) {
//            this.props.containers.question.resetCategory
        }
    }


    public onChange = (evt: SyntheticEvent, obj?: any) => {

        const target = evt.currentTarget as HTMLInputElement;
        const format = (val: string) => {
            if (target.type.toLowerCase() === "number")
                return Number.parseInt(val);
            return val;
        };
        const stepper = target.getAttribute("data-step");
        let value, name;
        if (target.value) {
            value = format(target.value);
        } else {
            value = target.getAttribute("value");
        }
        if (target.name) {
            name = target.name;
        } else {
            name = target.getAttribute("name");
        }

        let data = this.state.data;
        data[name] = value;
        this.setState({data});

        if (stepper) {
            this.setState({stage: Number.parseInt(stepper)})
        }
    };

    public stageClicked = (evt: SyntheticEvent) => {
        const target = evt.currentTarget;
        const value = target.getAttribute("data-value") || "0";
        this.setState({stage: Number.parseInt(value)})
    };

    public setNewQuestion = (target?: string, clone?: boolean) => {
        if (target && target.startsWith("__")) {
            target = target.substring(2);
            clone = true;
        }
        if (this.props.containers) {
            const container = this.props.containers.question.state.currentQuestions;
            if (container) {
                let question = container.questions.find(q => q._id === target);
                if (question) {
                    question = Object.assign({}, question);
                    if (clone) {
                        delete question._id;
                        delete question._creator;
                    }
                    console.log("New Question Received");
                    this.setState({data: question, lastId: question._id, stage: 1});
                }
            }
        }
    };


    public handleAutoSelect = (name: string, value: Array<{ label: string, value: any }>) => {
        if (this.state.data) {
            const question = this.state.data;
            question.category = value.filter(v => typeof v === "object").map(v => v.value);
            this.setState({data: question});
        }
        console.log(this.state)
    };

    public handleMultipleChoice = (action: string, id: number, data?: any) => {
        console.log(action, id, data);
        const question = this.state.data;
        if (typeof question === "undefined") {
            return;
        }
        if (question.type !== "Multiple Choice") {
            return;
        }
        switch (action) {
            case "add":
                if (!(question.choices instanceof Array)) {
                    question.choices = [];
                }
                question.choices.push(Object.assign({}, data));
                break;
            case "update":
                if (question.choices instanceof Array) {
                    question.choices[id] = Object.assign({}, data);
                }
                break;
            case "remove":
                if (question.choices instanceof Array) {
                    question.choices.splice(id, 1);
                }
                break;
            case "correct":
                if (question.choices instanceof Array) {
                    question.choices.map(c => c.correct = false);
                    question.choices[id].correct = true;
                }
                break;
        }

        this.setState({data: question});
    };

    public onSubmit = (evt: SyntheticEvent) => {
        if (this.props.onSubmit) {
            this.props.onSubmit(evt, this.state.data);
        }
    };

    public reset = () => {
        this.setState({stage: 0, data: {}});
        if (this.props.sendAction) {
            this.props.sendAction("reset")
        }
    };

    public choiceChanged = (evt) => {

    }

}

const QType = props => (
    <Grid container justify={"space-around"}>
        <Grid item md={3}>
            <Button onClick={props.onChange} value={"Multiple Choice"} name={"type"} data-step={1}
                    fullWidth variant={"contained"} className={props.className}>
                <Typography variant={"h6"}>
                    Multiple<br/>Choice
                </Typography>
            </Button>
        </Grid>
        <Grid item md={3}>
            <Button onClick={props.onChange} value={"Open Ended"} name={"type"} data-step={1}
                    fullWidth variant={"contained"} className={props.className}>
                <Typography variant={"h6"}>
                    Open<br/>Ended
                </Typography>
            </Button>
        </Grid>
    </Grid>
);

const QDetails = props => {
    const {classes} = props;
    // @ts-ignore
    const {_id, questionImage, answer, questionDetails, type, category, choices, points, question, timeLimit} = props.data || {} as any;

    console.log(category);

    return (
        <Grid container className={classes.buildStep} justify={"flex-start"} spacing={16}>
            <Grid xs={12} item>
                <TextField
                    variant={"standard"}
                    placeholder={"What is the capitol of Texas?"}
                    fullWidth multiline required
                    rows={2} rowsMax={4} label={"Enter Question"}
                    name={"question"}
                    value={question || ""}
                    onChange={props.onChange}
                />
            </Grid>
            {type ? type === "Open Ended" ?
                <OpenEnded
                    onChange={props.onChange}
                    required name={"answer"}
                    value={answer || ""}
                    fullWidth label={"Answer"} placeholder={"Austin"}
                    helperText={"Using open ended responses requires the moderator of the game to manually check whether each answer is correct or not."}
                />
                :
                <MultipleChoice
                    classes={classes}
                    choices={choices}
                    onChange={props.handleMultipleChoice}
                />
                :
                <Typography>No Question Type set</Typography>
            }
            <Grid item xs={12}><Divider variant={"fullWidth"}/></Grid>
            <Grid item xs={12} lg={3}>

                <TextField
                    fullWidth
                    type={"number"}
                    label={"Point Value"}
                    placeholder={"0"}
                    name={"points"}
                    value={points || ""}
                    onChange={props.onChange}
                />
            </Grid>
            <Grid item xs={12} lg={3}>
                <TextField fullWidth
                           type={"number"}
                           label={"Time Limit (seconds)"}
                           placeholder={"90"}
                           name={"timeLimit"} defaultValue={timeLimit}
                           onChange={props.onChange}
                />
            </Grid>
            <Grid item xs={12} lg={6}>
                <AutoSelect
                    onChange={props.handleAutoSelect}
                    defaultValue={category || []}
                    options={props.categories}
                    label={"Category"} name={"category"}
                    placeholder={"Select categories to assign"}
                    values={(val, c) => {
                        if (props.container) {
                            const container = props.container as QuestionContainer;
                            console.log(container.state.categories);
                            // if (container.state.categories && container.state.categories.length > 0) {
                            //     c(container.state.categories.map(c => ({label: c, value: c})));
                            // } else {
                            //     container.buildCategoryList("")
                            //         .then(() => {
                            //             c((val) => {
                            //                 container.state.categories
                            //                     .filter(c => c)
                            //                     .map(c => ({label: c, value: c}))
                            //             });
                            //         }).catch(err => console.error(err));
                            // }
                        }
                        console.log(val);
                    }}
                />

            </Grid>
            <Grid item xs={12} lg={5}>
                <Card className={classes.imagesContainer}>
                    <CardActionArea className={classes.imageUploader}>
                        {props.data && props.data.questionImage ? (
                            <CardMedia className={classes.image} image={props.data.questionImage}/>
                        ) : (
                            <div>
                                <div className={classes.centered}><FontAwesomeIcon size={"3x"} icon={["far", "image"]}/>
                                </div>
                                <Typography>Upload question image (optional)</Typography>
                            </div>
                        )}
                    </CardActionArea>
                    <CardActions>
                        <Button size={"small"}>
                            Upload
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
            <Grid item xs={12} lg={7}>
                <TextField
                    rows={6} fullWidth
                    multiline rowsMax={8} label={"Description"}
                    placeholder={"Enter a description or extended details about the question if required"}
                    name={"questionDetails"}
                    value={questionDetails || ""}
                    onChange={props.onChange}
                />
            </Grid>

        </Grid>
    )
};

const QSummary = props => {
    return (
        <div style={{textAlign: "center"}}>
            <Typography variant={"h3"} component={"div"}>To Be Finished</Typography>
            <Typography variant={"subtitle1"} component={"div"}>This will be a page that will show a demo of the live
                question for you to look at
                and see if it is what you want.</Typography>
        </div>
    )
};

const OpenEnded = props => (
    <Grid xs={12} item>
        <TextField {...props}/>
    </Grid>
);


const StageIdentifier = props => (
    <Stepper alternativeLabel activeStep={props.step} >
        <Step>
            <StepButton data-value={0} onClick={props.onClick}>
                <span>Question Type</span>
                {props.step > 0 || props.hasId ? (
                    <span className={"build-stage-subtext"}><br/>{props.type}</span>) : undefined}
            </StepButton>
        </Step>
        <Step>
            <StepButton data-value={1} onClick={props.onClick}>
                Details
            </StepButton>
        </Step>
        <Step>
            <StepButton data-value={2} onClick={props.onClick}>
                Summary
            </StepButton>
        </Step>
    </Stepper>
);

interface BuilderProps {
    state?: BuilderState;
    //data?: Question;
    onSubmit?: (evt, data) => void;
    // onChange?: (evt, key, value) => void;
    onError?: any;
    classes?: any;
    theme?: any;
    sendAction?: (action:string, target?:number) => any;
    handleCategories?: (evt?) => void;
    containers?: {
        question: QuestionContainer;
    }
    selectedId?: any;

}

interface BuilderState {
    stage?: number;
    stagesComplete?: boolean[];
    lastId?: any;
    data: Partial<Question>;
}

// @ts-ignore
export default withStyles(styles, {withTheme: true})(withContainer(Builder, [QuestionContainer]));