import {SyntheticEvent} from "react";
import * as React from "react";
import * as ReactGA from "react-ga";
import {RouteProps, RouterProps} from "react-router";
import {Container, Loading, Snackbar} from "../../components";
import {PlayerContainer, SocketContainer, StorageContainer} from "../../containers";
import {ActivityStream, GameNav, TeamView, WaitView} from "./";
import FAIcon from "../../FontAwesome";

import "./live.css";

export class Live extends React.Component<LiveProps, LiveState> {
    public constructor(props:LiveProps) {
        super(props);
        this.state = {
            joining: true,
            view: "loading",
            loading: props.containers.socket.state.status !== "authenticated",
            tab: props.location && props.location.hash ? props.location.hash : "#",
        } as LiveState

        props.containers.player.attachStorage(props.containers.storage);

    }

    // tabs = {
    //     "#info": (<div className={"wait-view"}>a</div>),
    //     "#teams": (props:TeamViewProps) => (<TeamView {...props} />)
    // };



    componentDidMount(): void {
        const {player, socket} = this.props.containers;

        console.log(socket)

        player.check()
            .then((success:boolean) => {
                if (success) {
                    this.initiate()
                        .catch(err => {
                            if (this.props.location) {
                                const lnk = this.props.location.pathname;
                                this.props.history.push("/?ref=" + lnk.substr(1), {lnk});
                            } else {
                                this.props.history.push("/");
                            }
                        })
                } else {
                    if (this.props.location) {
                        const lnk = this.props.location.pathname;
                        this.props.history.push("/?ref=" + lnk.substr(1), {lnk});
                    } else {
                        this.props.history.push("/")
                    }
                }
            })
            .catch(err => console.log(err))

    }

    initiate = async () => {
        console.log("Initiated")
        const {socket, player, storage} = this.props.containers;
        if (socket.state.status !== "authenticated") {
            // TODO Check to see if we already have stored values and cross check
            // TODO so we do not have to reauthorize access

            console.debug("Socket not authenticated, so authenticate!");

            if (!socket.connected())
                await socket.connect()

            if (player.hasSession()) {
                // console.log(storage.getToken(), storage.getGameID(), storage.getTeamKey())
                const success = await socket.authenticate(storage.getToken(), storage.getGameID(), storage.getTeamKey());
                if (!success) {
                    throw success;
                }
            }
            // this.props.history.push("/");
        }

        if (socket.state.status === "authenticated") {
            // TODO Initiate game
            if (typeof socket.state.game === "undefined") {
                const response = await socket.requestGame(storage.getGameID());
                if (response.success) {
                    this.setState({
                        loading: false,
                        view: "waiting",
                    })
                }
            } else {
                this.setState({
                    loading: false, view: "waiting"
                })
            }
            // socket.subscribe(this.handleGameState);
            socket.requestState(storage.getGameID());
        } else {
            throw false
        }
    }

    handleGameState = () => {
        const {socket} = this.props.containers;
        // const {} = this.state
        console.log(socket.state);
    }

    componentWillReceiveProps(nextProps: Readonly<LiveProps>, nextContext: any): void {
        if (nextProps.location) {
            if (nextProps.location.hash && nextProps.location.hash !== this.state.tab) {
                // if (this.tabs[nextProps.location.hash])
                ReactGA.event({
                    category: "Game Session",
                    action: "View Tab",
                    label: nextProps.location.hash
                });
                this.setState({tab: nextProps.location.hash});
            }
        }
    }

    handleNotification = (evt?:SyntheticEvent) => {
        if (evt)
            evt.preventDefault()
        const {socket} = this.props.containers;
        if (typeof socket.state.showNotification !== "undefined") {
            if (typeof socket.state.showNotification === "number")
                clearTimeout(socket.state.showNotification);
            if (typeof socket.state.showNotification === "number"
                || typeof socket.state.showNotification === "boolean")
                socket.setState({showNotification: false, notification: undefined});
        }
    }

    generateStatus = () => {
        const {socket} = this.props.containers;
        if (socket.state.game) {
            if (socket.state.game.started) {
                if (socket.state.game.paused) {
                    return {
                        status: "Waiting for question...",
                        icon: <FAIcon className={"ico"} fixedWidth icon={["fas", "lock"]}/>
                    };
                } else {
                    // TODO handle active question Activity Streamer
                    if (socket.state.question) {
                        return {
                            status: "Active Question!",
                            timer: {
                                limit: socket.state.question.timeLimit,
                                timeLeft: socket.state.question.timeLeft,
                                showNumber: true
                            },
                            // icon: <FAIcon className={"ico"} fixedWidth icon={["fas", "lock"]}/>
                        };
                    } else {
                        return {
                            status: "Loading question...!",
                            icon: <FAIcon className={"ico"} fixedWidth icon={["fas", "lock"]}/>
                        };
                    }
                }
            }
        }
        return {
            status: "Waiting for game...",
            icon: <FAIcon className={"ico"} fixedWidth icon={["fas", "lock"]}/>
        };
    }

    public render() {
        const {socket} = this.props.containers;
        const {loading, view, tab} = this.state;
        let content:React.ReactNode;
        switch (view) {
            case "waiting":
                content = <WaitView data={socket.state.game} />;
                break;
            default:
                content = <WaitView data={socket.state.game} />;
        }

        if (this.state.tab !== "#") {
            const {socket} = this.props.containers;
            switch (this.state.tab) {
                case "#teams":
                    if (socket.state.game && socket.state.gameStatus) {
                        content = <TeamView game={socket.state.game} teams={socket.state.gameStatus.teams}/>
                        // content = this.tabs[this.state.tab]({
                        //     game: socket.state.game,
                        //     teams: socket.state.gameStatus.teams
                        // })
                    }
                    break;
                case "#info":
                    break;
                case "#history":
                    break;
            }
        }

        return (
            <Container className={"head-pad px-0 no-overflow-y"}
                fullWidth
                display={"flex"}
                direction={"column"}
                align={{
                    items: "center",
                    //content: "center"
                }}
                justifyContent={"between"}
                flex={{grow:1}}>

                <Loading visible={loading} full />

                {/*<ActivityStream*/}
                {/*    icon={<FAIcon className={"ico"} fixedWidth icon={["fas", "lock"]}/>}*/}
                {/*    status={"Waiting for game..."} minimized={false}*/}
                {/*/>*/}

                <ActivityStream
                    {...this.generateStatus()}  minimized={false}
                />

                {loading ? (<div/>) : content}

                {socket.state.notification && socket.state.showNotification && (
                    <Snackbar variant={"info"} position={"bottom"} onClose={this.handleNotification}>
                        <p>{socket.state.notification}</p>
                    </Snackbar>
                )}

                <GameNav
                    active={tab} tabs={[
                    {
                        text: "Play",
                        to: "#",
                        icon: ["far", "play"]
                    },
                    {
                        text: "Info",
                        to: "#info",
                        icon: ["far", "info"]
                    },
                    {
                        text: "Teams",
                        to: "#teams",
                        icon: ["far", "users"]
                    },
                    {
                        text: "History",
                        to: "#history",
                        icon: ["far", "history"]
                    },
                ]} />
            </Container>
        );
    }
}

interface LiveProps extends RouterProps, RouteProps {
    state?: LiveState;
    containers: {
        storage: StorageContainer;
        player: PlayerContainer;
        socket: SocketContainer;
    }
}

interface LiveState {
    joining: boolean;
    view: string;
    loading: boolean;
    tab: string;
}

export default Live