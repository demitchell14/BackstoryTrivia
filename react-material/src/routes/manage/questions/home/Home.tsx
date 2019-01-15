import * as React from "react";
import {
    Divider,
    ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary,
    Grid,
    List, ListItem, ListItemText,
    Typography,
    withStyles
} from "@material-ui/core";

const styles = theme => ({
    homeContainer: {
        minHeight: 400,
        padding: "0 1.5rem"
    },
    verticalMargin: {
        marginTop: "1rem",
        marginBottom: "1rem",
    }
})

class Home extends React.Component<MainProps, MainState> {
    public constructor(props) {
        super(props);
        this.state = {} as MainState
    }

    public render() {
        const {classes} = this.props;
        return (
            <div>
                <ExpansionPanel elevation={4}>
                    <ExpansionPanelSummary disableRipple={false}>
                        <Typography variant={"h6"}>Creating/Changing Questions</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid container>
                            <Grid xs={12} item>
                                <Typography>You are able to create questions in either Open Ended or Multiple Choice options.
                                    Each type has several other fields that are required, and some that are optional to enhance the view.
                                    The fields you may enter are as follows...</Typography>
                                <Divider className={classes.verticalMargin} variant={"middle"} />
                            </Grid>
                            <Grid lg={6} item>
                                <Typography variant={"h6"}>Required Fields:</Typography>
                                <List>
                                    <ListItem>
                                        <ListItemText primary={"Question"} secondary={"The question is required for any question, of course."}/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={"Answer/Choices"} secondary={"Depending on if you are creating a multiple choice or an open ended question, an answer, or answer choices will be required."}/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={"Points"} secondary={"A point value you are required to give to each question."}/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={"Time Limit"} secondary={"A number of seconds that the question will run for in game."}/>
                                    </ListItem>
                                </List>
                            </Grid>
                            <Grid lg={6} item>
                                <Typography variant={"h6"}>Optional Fields:</Typography>
                                <List>
                                    <ListItem>
                                        <ListItemText primary={"Category"} secondary={"You may select/enter zero or many categories. these are used to help organize your collection."}/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={"Description"} secondary={"The description is used in conjunction with the question while the game is running. You will see how it's used in the summary of question creation"}/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={"Image"} secondary={"Just as description is used in conjunction with the question, so is the image."}/>
                                    </ListItem>
                                </List>
                            </Grid>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                    <ExpansionPanelSummary disableRipple={false}>
                        <Typography variant={"h6"}>Create / Manage Lists</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid container>
                            <Grid xs={12} item>
                                <Typography>Another Paragraph</Typography>
                            </Grid>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        );
    }
}

interface MainProps {
    state?: MainState;
    classes?: any;
}

interface MainState {

}

export default withStyles(styles, {withTheme: true})(Home)