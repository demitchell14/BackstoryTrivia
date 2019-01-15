import * as React from "react";
import {
    Button, Card, CardActionArea, CardActions, CardMedia, Divider,
    Grid, Paper,
    Step, StepButton, Stepper, TextField, Theme, Typography,
    withStyles
} from "@material-ui/core";
import {RefObject, SyntheticEvent} from "react";

import "../style.css";
import AutoSelect from "../../../../components/autoselect/AutoSelect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Question} from "../../../../containers";
import MultipleChoice from "./MultipleChoice";

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
    }
    public constructor(props) {
        super(props);
        this.state = {
            stage: 0,
        } as BuilderState

        this.inputFields = {
            question: React.createRef(),
            points: React.createRef(),
            timeLimit: React.createRef(),
        }
        
    }

    componentWillMount(): void {
        if (this.props.data) {
            if (this.props.data._id) {
                this.setState({stage: 1, lastId: this.props.data._id});
            }
        }
    }

    componentWillUpdate(nextProps: Readonly<BuilderProps>, nextState: Readonly<BuilderState>, nextContext: any): void {
    }

    public onChange = (evt:SyntheticEvent, obj?:any) => {
        if (obj) {
            if (this.props.onChange) {
                this.props.onChange(null, evt, obj);
            }
            return;
        }
        if (this.props.onChange) {
            const target = evt.currentTarget as HTMLInputElement;
            const format = (val:string) => {
                if (target.type.toLowerCase() === "number")
                    return Number.parseInt(val);
                return val;
            }
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

            this.props.onChange(target, name, value);
            if (stepper) {
                this.setState({stage: Number.parseInt(stepper)})
            }
        }
    }

    public stageClicked = (evt:SyntheticEvent) => {
        const target = evt.currentTarget
        const value = target.getAttribute("data-value") || "0";
        this.setState({stage: Number.parseInt(value)})
    }

    public render() {
        let {classes,data} = this.props;
        const {stage} = this.state;
        data = data || {} as Question;
        const {type} = data;
        //if (this)
        return (
            <div>
                <Paper className={classes.paperMargin}>
                    <StageIdentifier type={type} onClick={this.stageClicked} step={stage} />
                </Paper>
                <Paper>
                    <Grid className={classes.buildContainer} spacing={16} container alignContent={"space-between"}>
                        <Grid item xs={12}/>
                        <Grid item xs={12}>
                            {this.StageContainer(stage)}
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
                                    disabled={stage ? stage === 0 : true}
                                    onClick={this.onChange}
                                    data-step={stage ? stage - 1 : 0}
                                    className={"builder-action-button"}
                                    variant={"contained"}
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={stage ?
                                        stage === 2 ?
                                            this.onSubmit : this.onChange
                                        : this.onChange}
                                    data-step={stage ? stage + 1 : 0}
                                    className={"builder-action-button"} color={"primary"}
                                    variant={"contained"}
                                >
                                    {stage ? stage === 2 ? "Finish" : "Next" : "Next"}
                                </Button>
                            </div>
                        </Grid>

                    </Grid>
                </Paper>
            </div>
        );
    }

    onSubmit = (evt:SyntheticEvent) => {
        if (this.props.onSubmit) {
            this.props.onSubmit(evt);
        }
    }

    public reset = () => {
        if (this.props.sendAction) {
            this.props.sendAction("reset")
            this.setState({stage: 0});
        }
    }

    choiceChanged = (evt) => {

    }

    addChoice = (evt:SyntheticEvent) => {
        if (this.props.sendAction) {
            this.props.sendAction("add");
        }
    }

    getCategories = () => {
        if (this.props.handleCategories) {
            this.props.handleCategories();
        }
        return [
            {
                label: "A",
                value: "A"
            }
        ]
    }

    StageContainer = (step) => {
        const {classes,data} = this.props;
        // @ts-ignore
        const {_id, questionImage, answer, questionDetails, type, category, choices, points, question, timeLimit} = data || {} as any;
        //console.log(data)
        switch(step) {
            case 0:
                return (
                    <Grid container justify={"space-around"}>
                        <Grid item md={3}>
                            <Button onClick={this.onChange} value={"Multiple Choice"} name={"type"} data-step={1}
                                    fullWidth variant={"contained"} className={classes.questionTypeCls}>
                                <Typography variant={"h6"}>
                                    Multiple<br/>Choice
                                </Typography>
                            </Button>
                        </Grid>
                        <Grid item md={3}>
                            <Button onClick={this.onChange} value={"Open Ended"} name={"type"} data-step={1}
                                    fullWidth variant={"contained"} className={classes.questionTypeCls}>
                                <Typography variant={"h6"}>
                                    Open<br/>Ended
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                );

            case 1:
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
                                onChange={this.onChange}
                            />
                        </Grid>
                        {type === "Open Ended" ?
                            <OpenEnded
                                onChange={this.onChange}
                                required name={"answer"}
                                value={answer || ""}
                                fullWidth label={"Answer"} placeholder={"Austin"}
                                helperText={"Using open ended responses requires the moderator of the game to manually check whether each answer is correct or not."}
                            />
                            :
                            <MultipleChoice
                                classes={classes}
                                choices={choices}
                                correctChanged={this.choiceChanged}
                                sendAction={this.props.sendAction}
                                addChoice={this.addChoice}
                            />
                        }
                        <Grid item xs={12}><Divider variant={"fullWidth"}  /></Grid>
                        <Grid item xs={12} lg={3}>

                            <TextField
                                fullWidth
                                type={"number"}
                                label={"Point Value"}
                                placeholder={"0"}
                                name={"points"}
                                value={points || ""}
                                onChange={this.onChange}
                            />
                        </Grid>
                        <Grid item xs={12} lg={3}>
                            <TextField fullWidth
                                type={"number"}
                                label={"Time Limit (seconds)"}
                                placeholder={"90"}
                                name={"timeLimit"} defaultValue={timeLimit}
                                onChange={this.onChange}
                            />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <AutoSelect
                                onChange={this.onChange}
                                defaultValue={category || []}
                                options={this.getCategories()}
                                label={"Category"} name={"category"}
                                placeholder={"Select categories to assign"}
                            />
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <Card className={classes.imagesContainer}>
                                <CardActionArea className={classes.imageUploader}>
                                    {this.props.data && this.props.data.questionImage ? (
                                        <CardMedia className={classes.image} image={this.props.data.questionImage} />
                                    ) : (
                                        <div>
                                            <div className={classes.centered}><FontAwesomeIcon size={"3x"} icon={["far", "image"]}/></div>
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
                        <Grid item xs={12} lg={8}>
                            <TextField
                                rows={6} fullWidth
                                multiline rowsMax={8} label={"Description"}
                                placeholder={"Enter a description or extended details about the question if required"}
                                name={"questionDetails"}
                                value={questionDetails || ""}
                                onChange={this.onChange}
                            />
                        </Grid>

                    </Grid>
                );

            case 2:
                return (
                    <div style={{textAlign: "center"}}>
                        <Typography variant={"h3"} component={"div"}>To Be Finished</Typography>
                        <Typography variant={"subtitle1"} component={"div"}>This will be a page that will show a demo of the live question for you to look at
                        and see if it is what you want.</Typography>
                    </div>
                )
            default:
                return (
                    <Grid container>
                        <Typography>Unfinished tab</Typography>
                    </Grid>
                )
        }

    }
}

const OpenEnded = props => (
    <Grid xs={12} item>
        <TextField {...props}/>
    </Grid>
)


const StageIdentifier = props => (
    <Stepper alternativeLabel activeStep={props.step} >
        <Step>
            <StepButton data-value={0} onClick={props.onClick}>
                <span>Question Type</span>
                {props.step > 0 ? (<span className={"build-stage-subtext"}><br/>{props.type}</span>) : undefined}
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
)

interface BuilderProps {
    state?: BuilderState;
    data?: Question;
    onSubmit?: (evt) => void;
    onChange?: (evt, key, value) => void;
    onError?: any;
    classes?: any;
    theme?: any;
    sendAction?: (action:string, target?:number) => any;
    handleCategories?: (evt?) => void;

}

interface BuilderState {
    stage?: number;
    stagesComplete?: boolean[];
    lastId?: any;
}

// @ts-ignore
export default withStyles(styles, {withTheme: true})(Builder);