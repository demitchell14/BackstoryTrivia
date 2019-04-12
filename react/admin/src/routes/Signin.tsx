import * as React from "react";
import {
    Avatar, Button, Checkbox,
    FormControlLabel,
    Paper, TextField,
    Typography,
    withStyles,
    Zoom
} from "@material-ui/core";
import LockIcon from '@material-ui/icons/LockOutlined';
import {Link, withRouter} from "react-router-dom";
import {RouteProps, RouterProps} from "react-router";
import {SyntheticEvent} from "react";
import UserContainer from "../containers/UserContainer";
import {Subscribe} from "unstated";
// import {TransitionGroup} from "react-transition-group";



const styles = theme => ({
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        //flexGrow: 1,
        margin: "0 auto",
        padding: theme.spacing.unit * 3,
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
        //transition: "all 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms !important",
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
    register: {
        marginTop: theme.spacing.unit * 2
    }
});

// @ts-ignore
class Signin extends React.Component<SigninProps, SigninState> {


    public constructor(props) {
        super(props);
        this.state = {
            show: true,
            inputs: {
                email: "",
                emailConfirm: "",
                password: "",
                passwordConfirm: "",
                rememberMe: false,
            }
        } as SigninState
    }
    componentWillMount(): void {
        if (this.props.location) {
            this.setState({mode: this.props.location.pathname});
        }
    }

    componentWillUpdate(nextProps: Readonly<SigninProps>, nextState: Readonly<SigninState>, nextContext: any): void {
        if (nextProps.location) {
            if (nextState.mode !== nextProps.location.pathname) {
                this.setState({mode: nextProps.location.pathname})
            }
        }
    }

    componentWillReceiveProps(nextProps: Readonly<SigninProps>, nextContext: any): void {
        if (this.props.location && nextProps.location) {
            const path = this.props.location.pathname;
            if (path !== nextProps.location.pathname) {
                this.setState({inputs: {
                        email: "",
                        emailConfirm: "",
                        password: "",
                        passwordConfirm: "",
                        rememberMe: false
                    }, mode: path})
            }
        }
    }

    public render() {
        const {classes} = this.props;
        const mode  = this.state.mode === "/signin";
        // @ts-ignore
        const query = this.props.location ? this.props.location.search.substr(1).split("&") : undefined;
        // const {show} = this.state;
        return (
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Zoom in>
                        <Paper className={classes.paper}>
                            <Avatar className={classes.avatar}>
                                <LockIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                {mode ? "Sign in" : "Register"}
                            </Typography>
                            <Subscribe to={[UserContainer]}>
                                {(user:UserContainer) => (mode ? this.signin(user) : this.register(user))}
                            </Subscribe>
                            <Typography className={classes.register} variant={"subtitle1"}>
                                {mode ? (<span>No account? <Link to={"/register"}>Register now</Link>!</span>) :
                                    (<span>Have an account? <Link to={"/signin"}>Sign in</Link>!</span>)}
                            </Typography>
                        </Paper>
                    </Zoom>

                </main>
        );
    }

    onSubmit(evt) {
        evt.preventDefault();
        // @ts-ignore
        const user = this.user as UserContainer;
        // @ts-ignore
        const _this = this.render as Signin;

        const {mode, inputs} = _this.state;
        let action:Promise<UserContainer>;
        switch (mode) {
            case "/signin":
                const {email, password, rememberMe} = inputs;
                action = user.login({email, password, autologin: rememberMe})
                break;
            case "/register":
                action = user.register(inputs);
                break;
        }
        // @ts-ignore
        if (action) {
            action.then(user => {
                if (user.state.email === inputs.email && user.state.token) {
                    user.setState({verified: true});
                    _this.props.history.push("/");
                }
            })
        }
    }

    onChange = (evt:SyntheticEvent) => {
        const input = evt.currentTarget as HTMLInputElement
        let name, value;
        if (input.name.indexOf("-") >= 0) {
            let tmp = input.name.split("-");
            tmp = tmp.map((d, i) => i !== 0 ? `${d.charAt(0).toUpperCase()}${d.substr(1)}` : d);
            name = tmp.join("");
        } else name = input.name
        if (input.type === "checkbox")
            value = Boolean(input.checked)
        else
            value = input.value

        const curr = this.state.inputs;
        curr[name] = value;
        this.setState({inputs: curr});
    }

    public register(user:UserContainer) {
        const {classes} = this.props;
        const {email, emailConfirm, password, passwordConfirm} = this.state.inputs;
        return (
            <form className={classes.form} onSubmit={this.onSubmit.bind({render:this, user})}>
                <TextField fullWidth required autoFocus
                           id={"email"}
                           name={"email"}
                           label={"Email address"}
                           margin={"normal"}
                           type={"email"}
                           autoComplete={"email"}
                           value={email}
                           onChange={this.onChange}
                />
                <TextField fullWidth required
                           id={"email-confirm"}
                           name={"email-confirm"}
                           label={"Confirm email address"}
                           margin={"normal"}
                           type={"email"}
                           value={emailConfirm}
                           onChange={this.onChange}
                />
                <TextField fullWidth required
                           id={"password"}
                           name={"password"}
                           label={"Password"}
                           margin={"normal"}
                           type={"password"}
                           autoComplete={"current-password"}
                           value={password}
                           onChange={this.onChange}
                />
                <TextField fullWidth required
                           id={"password-confirm"}
                           name={"password-confirm"}
                           label={"Confirm Password"}
                           margin={"normal"}
                           type={"password"}
                           value={passwordConfirm}
                           onChange={this.onChange}
                />

                <Button type={"submit"} fullWidth variant={"contained"} color={"primary"} className={classes.submit}>Register</Button>
            </form>
        )
    }

    public signin(user:UserContainer) {
        const {classes} = this.props;
        const {email, password, rememberMe} = this.state.inputs;
        return (
            <form className={classes.form} onSubmit={this.onSubmit.bind({render:this, user})}>
                <TextField fullWidth required autoFocus
                           id={"email"}
                           name={"email"}
                           label={"Email address"}
                           margin={"normal"}
                           type={"email"}
                           autoComplete={"email"}
                           value={email}
                           onChange={this.onChange}
                />
                <TextField fullWidth required
                           id={"password"}
                           name={"password"}
                           label={"Password"}
                           margin={"normal"}
                           type={"password"}
                           autoComplete={"current-password"}
                           value={password}
                           onChange={this.onChange}
                />
                <FormControlLabel
                    control={<Checkbox name={"rememberMe"} checked={rememberMe} onChange={this.onChange} value="remember" color="primary" />}
                    label="Remember me"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Sign in
                </Button>
            </form>
        )
    }
}

interface SigninProps extends RouteProps,RouterProps {
    state?: SigninState;
    classes?: any;
}

interface SigninState {
    show: boolean;
    mode: string;
    inputs: {
        email: string;
        emailConfirm: string;
        password: string;
        passwordConfirm: string;
        rememberMe: boolean;
    }
}

// @ts-ignore
export default withStyles(styles, {withTheme: true})(withRouter(Signin))