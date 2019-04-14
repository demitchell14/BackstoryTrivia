import * as React from "react";
import {
    Divider,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Grid,
    List,
    ListItem,
    ListItemText,
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
});

class Home extends React.Component<MainProps, MainState> {
    public constructor(props) {
        super(props);
        this.state = {} as MainState
    }

    public render() {
        const {classes} = this.props;
        return (
            <div>
                <ExpansionPanel defaultExpanded>
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
                                <Typography paragraph>Lists are just another way to sort your collection of questions,
                                    just like categories.
                                    The primary difference is, however, that lists are supposed to be used directly with
                                    game building,
                                    whereas categories are just a way to group your questions while you search through
                                    them.</Typography>
                                <Typography paragraph>Another key difference is that lists are stored <b>On Your
                                    Device</b>, unlike categories
                                    which are stored along with the question itself inside our databases. In the future,
                                    you will be able
                                    export your lists of questions if that is something that you wish.</Typography>
                                <Typography paragraph>A drawback of lists being stored on device is that you will not be
                                    able to share them across devices.
                                    This sucks, but it is a consequence of the that that talking to databases can be
                                    expensive and
                                    if I'm being honest, I'm not entirely sure how powerful the current database is so I
                                    don't want to strain in too bad.
                                    In the future I may relook at this and add it to our storage, however.</Typography>
                                <Typography>Every item consists of a few components.</Typography>
                                <Divider className={classes.verticalMargin} variant={"middle"}/>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant={"h6"}>Required Fields:</Typography>
                                <List>
                                    <ListItem><ListItemText primary={"List Name"}
                                                            secondary={"This is something for your reference"}/></ListItem>
                                </List>
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