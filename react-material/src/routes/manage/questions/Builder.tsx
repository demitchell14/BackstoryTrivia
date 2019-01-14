import * as React from "react";
import {
    Button,
    Grid,
    Step, StepButton, Stepper, Theme, Typography,
    withStyles
} from "@material-ui/core";
import {SyntheticEvent} from "react";

import "./style.css";

const styles = (theme:Theme) => {
    return {
        questionTypeCls: {
            height: 100,
            [theme.breakpoints.up("md")]: {
                height: 200
            }
        },
        buildContainer: {
            [theme.breakpoints.up("md")]: {
                minHeight: 500
            }
        }
    }
};


class Builder extends React.Component<BuilderProps, BuilderState> {
    public constructor(props) {
        super(props);
        this.state = {
            stage: 0
        } as BuilderState
        
    }

    componentWillUpdate(nextProps: Readonly<BuilderProps>, nextState: Readonly<BuilderState>, nextContext: any): void {
        //console.log(nextProps);
    }

    public onChange = (evt:SyntheticEvent) => {
        if (this.props.onChange) {
            const target = evt.currentTarget as HTMLElement;
            const stepper = target.getAttribute("data-step");
            const value = target.getAttribute("value");
            const name = target.getAttribute("name");
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
        const {classes} = this.props;
        const {stage} = this.state;
        //if (this)
        return (
            <Grid className={classes.buildContainer} spacing={16} container alignContent={"space-between"}>
                <Grid item xs={12}>
                    <StageIdentifier type={"Open Ended"} onClick={this.stageClicked} step={stage} />
                </Grid>

                <Grid item xs={12}>
                    {this.StageContainer(stage)}
                </Grid>

                <Grid item xs={12}>
                    <div className={"builder-action-buttons"}>
                        <Button className={"builder-action-button"} color={"secondary"} variant={"text"}>Reset</Button>
                        <Button disabled className={"builder-action-button"} variant={"contained"}>Back</Button>
                        <Button disabled className={"builder-action-button"} color={"primary"} variant={"contained"}>
                            Next
                        </Button>
                    </div>
                </Grid>

            </Grid>
        );
    }

    StageContainer = (step) => {
        const {classes} = this.props;
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
                            <Button onClick={this.onChange} value={"Open Ended"} name={"type"} data-step={2}
                                    fullWidth variant={"contained"} className={classes.questionTypeCls}>
                                <Typography variant={"h6"}>
                                    Open<br/>Ended
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                );
            default:
                return (
                    <Grid container>
                        <Typography>Unfinished tab</Typography>
                    </Grid>
                )
        }

    }
}

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
    data?: any;
    onChange?: (evt, key, value) => void;
    onError?: any;
    classes?: any;
    theme?: any;

}

interface BuilderState {
    stage?: number;
    stagesComplete?: boolean[];

}

export default withStyles(styles, {withTheme: true})(Builder);