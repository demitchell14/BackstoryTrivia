import * as React from "react";
import {
    Button,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary, Grid, Paper, TextField,
    Theme,
    Typography,
    withStyles
} from "@material-ui/core";
import QuestionContainer from "../../../../containers/QuestionContainer";
import withContainer from "../../../../containers/withContainer";
import {RefObject, SyntheticEvent, useEffect, useState} from "react";
import UserContainer from "../../../../containers/UserContainer";

const styles = (theme:Theme) => ({
    expanseTitle: {
        fontSize: theme.typography.pxToRem(18),
        flexBasis: "33.33%",
        flexShrink: 0
    },
    expanseSubTitle: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    expanseSum: {
        alignItems: "center",
    },
});

// @ts-ignore
function ListInput(props) {
    const [value, setValue] = useState('');
    // @ts-ignore
    const [isActive, setActive] = useState(false);
    const {classes, onClose, onOpen, inputName} = props;
    const input = React.createRef() as RefObject<HTMLInputElement>;
    const handleClick = (evt) => {
        const status = onOpen();
        setActive(!isActive);
        if (status.current === status.target) {
            onClose(inputName, value)
        }

        evt.currentTarget.querySelector('input[name="' + inputName + '"]').focus()
    }

    const handleChange = (evt) => {
        const inp = evt.currentTarget as HTMLInputElement;
        setValue(inp.value);
    }

    useEffect(() => {
        // console.log(inputName, isActive)
    })

    return (
        <ExpansionPanel expanded={isActive} onClick={handleClick}>
            <ExpansionPanelSummary classes={{
                content: classes.expanseSum
            }}>
                <Typography className={classes.expanseTitle}>List Name: </Typography>
                <Typography className={classes.expanseSubTitle}>No list name set</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <TextField
                    inputRef={input}
                    name={inputName}
                    value={value}
                    onChange={handleChange}
                    label={"List Name"}
                    placeholder={"List Name"}
                    helperText={"If all the questions you are importing are related, you can group them together in a list. This will make it easier to keep track of questions, however it is completely optional. You may leave this blank if you do not want to group the questions."}
                />
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
}

function Importer(props:ImporterProps) {
    // @ts-ignore
    const [form, setForm] = useState({} as ImportForm);
    const [filePlaceholder, setFilePlaceholder] = useState('');

    const inputFile = React.createRef() as RefObject<HTMLInputElement>;

    const onSubmit = (evt:SyntheticEvent) => {
        evt.preventDefault();
        props.containers.question.import(props.containers.user.state.token, form);
    }

    return (
        <div>
            <Paper style={{padding: "1rem"}}>
                <Typography variant={"h3"} style={{marginBottom: "1rem"}}>Import Questions</Typography>

                <Grid container spacing={16}>
                    <form onSubmit={onSubmit}>
                        <Grid item md={8}>
                            <TextField
                                value={form.listName}
                                onChange={(evt) => {
                                    const f = Object.create(form);
                                    f.listName = evt.currentTarget.value;
                                    setForm(f);
                                }}
                                name={"listName"}
                                label={"List Name"}
                                placeholder={"List Name"}
                                helperText={"If all the questions you are importing are related, you can group them together in a list. This will make it easier to keep track of questions, however it is completely optional. You may leave this blank if you do not want to group the questions."}
                            />
                        </Grid>
                        <Grid item md={8}>
                            <input style={{display: "none"}}
                                ref={inputFile}
                                type={"file"}
                                name={"csv"}
                                onChange={(evt) => {
                                    const target = evt.currentTarget as HTMLInputElement;
                                    if (target.files) {
                                        const f = Object.create(form);
                                        f.csv = target.files[0];
                                        setForm(f);
                                        setFilePlaceholder(target.files[0].name)
                                    }
                                }}
                            />
                            <TextField
                                name={"csv_file"}
                                label={"CSV File"}
                                value={filePlaceholder}
                                onClick={() => inputFile.current ? inputFile.current.click() : undefined}
                                placeholder={"CSV File"}
                                helperText={"Select a file to import questions from. This file must be in CSV Format."}
                            />
                        </Grid>

                        <Button type={"submit"}>Submit</Button>
                    </form>
                </Grid>
            </Paper>
        </div>
    )
}

export interface ImportForm {
    csv?: any;
    listName?: string;
}

export interface ImporterProps {
    classes: any;
    theme: any;
    containers: {
        user: UserContainer;
        question: QuestionContainer
    }
}

// @ts-ignore
export default withStyles(styles, {withTheme: true})(withContainer(Importer, [UserContainer, QuestionContainer]));