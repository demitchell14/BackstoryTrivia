import * as React from "react";
import {SyntheticEvent} from "react";
import {
    Avatar,
    Checkbox,
    Chip,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    TextField,
    Theme,
    Tooltip,
    Typography
} from "@material-ui/core";

const FAIcon = React.lazy(() => import("../../../../FontAwesome"));

class MultipleChoice extends React.Component<MultipleChoiceProps, MultipleChoiceState> {

    public constructor(iprops) {
        super(iprops);
        this.state = {
            //selected: 0
            active: {
                answer: "",
                correct: false,
            },
            error: {}
        } as MultipleChoiceState


    }

    chipClicked = (id?:number) => {
        return (evt:SyntheticEvent) => {
            if (this.props.onChange && typeof id === "number" && !this.state.active.correct) {
                this.props.onChange("correct", id);
                return;
            }
            let {active} = this.state;
            active.correct = !active.correct;
            this.setState({active})
        }
    };

    correctChanged = (id:number) => {
        return (evt:SyntheticEvent) => {
            evt.stopPropagation();
            if (this.props.onChange) {
                this.props.onChange("correct", id);
            }
        }
    };

    answerChanged = (id?:number) => {
        //console.log(id);
        return (evt:SyntheticEvent) => {
            const target = evt.currentTarget as HTMLInputElement;
            const {active} = this.state;
            active.answer = target.value;
            this.setState({active, error: {}});
        }
    };

    addChoice = (id?:number) => {
        return (evt:SyntheticEvent) => {
            //console.log(this.state);

            if (this.state.active.answer === "") {
                this.setState({error: {answer: "Answer is required"}});
                return;
            }

            if (this.props.onChange) {
                this.props.onChange(typeof id === "number" ? "update" : "add", id, this.state.active);
                this.reset();
            }

            // if (this.props.sendAction) {
            //     this.props.sendAction("add", id, {
            //
            //     });
            // }

        }
    };

    removeChoice = (id?:number) => {
        if (id) {
            return (evt: SyntheticEvent) => {
                if (this.props.onChange) {
                    this.props.onChange("remove", id);
                }
            }
        }
        return undefined;
    };

    changeSelected = (id:number) => {
        return (evt:SyntheticEvent) => {
            if (this.props.choices) {
                this.setState({selected:id, active: Object.assign({}, this.props.choices[id])});
            }
        }
    };

    reset = (evt?:any) => {
        let active = this.state.active;
        active.answer = "";
        active.correct = false;
        this.setState({active, selected: undefined});
    };

    public render() {
        // console.log(this.state);
        let {classes, choices} = this.props;
        const {selected, active} = this.state;
        return (
            <Grid xs={12} item>
                <Grid container direction={window.innerWidth > 425 ? "row" : "row-reverse"} spacing={8}>
                    <Grid item xs={12} md={6}>
                        <List dense className={classes.choiceList}>
                            {choices && choices.length > 0 ? choices.map((opt, i) => (
                                <ListItem key={i} selected={selected === i} dense button divider onClick={this.changeSelected(i)}>
                                    <Checkbox checked={opt.correct || false} onClick={this.correctChanged(i)}
                                              icon={<FAIcon icon={["fas", "times-circle"]}/>}
                                              checkedIcon={<FAIcon icon={["fas", "check-circle"]}/>}
                                    />
                                    <Typography>{opt.answer}</Typography>
                                    {selected === i ? (
                                        <ListItemSecondaryAction>
                                            <IconButton onClick={this.reset}>
                                                <FAIcon fixedWidth icon={["fal", "unlink"]}/>
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    ) : undefined}
                                </ListItem>
                            )) : (
                                <ListItem>
                                    <Typography>No answer choices</Typography>
                                </ListItem>
                            )}
                        </List>
                    </Grid>
                    <Grid item xs={12} md={6} className={classes.choiceBody}>
                        <div style={{textAlign:"right"}}>
                            <Chip
                                style={{marginTop: ".5rem"}}
                                clickable
                                avatar={<Avatar>{active.correct ? <FAIcon icon={["far", "check"]}/> :
                                    <FAIcon icon={["far", "times"]}/>}</Avatar>}
                                onClick={this.chipClicked(selected)}
                                color={active.correct ? "primary" : "secondary"}
                                label={active.correct ? "Choice is correct!" : "Choice is wrong!"}
                            />
                            <Divider style={{margin: ".5rem 0", backgroundColor: "transparent"}}/>
                            <TextField
                                fullWidth multiline
                                rows={3} rowsMax={6}
                                error={typeof this.state.error.answer !== "undefined"}
                                helperText={typeof this.state.error.answer !== "undefined" ? (
                                    this.state.error.answer
                                ) : (typeof selected === "number" ? `This is answer choice #${(selected + 1) || 0}.` : `No Answer is selected`)}
                                placeholder={"Austin"}
                                onChange={this.answerChanged(selected)}
                                label={"Answer Choice"}
                                value={active.answer}
                            />
                        </div>
                        <div style={{textAlign:"right"}}>
                            <Tooltip placement={"top"} title={<span>{typeof selected === "number" ? "Edit" : "Add"} Choice</span>}>
                                <IconButton onClick={this.addChoice(selected)} color={"primary"}>
                                    <FAIcon icon={["fal", typeof selected === "number" ? "edit" : "file"]} fixedWidth/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip placement={"top"} title={<span>Delete Choice</span>}>
                                <IconButton onClick={this.removeChoice(selected)} color={"secondary"}>
                                    <FAIcon icon={["fal", "trash"]} fixedWidth/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

interface MultipleChoiceProps {
    state?: MultipleChoiceState;
    choices?: Array<{
        answer: string;
        correct: boolean;
    }>;
    onChange?: (a, b, c?) => any;
    classes?: any;
    theme?: Theme;
}

interface MultipleChoiceState {
    selected?: number;
    active: {
        answer: string;
        correct: boolean;
    }
    error: {
        [T:string]: string;
    }
}

export default MultipleChoice