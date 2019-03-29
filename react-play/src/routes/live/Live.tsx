import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import {SyntheticEvent} from "react";
import {RouteProps,RouterProps} from "react-router";
import {animated, Transition} from 'react-spring/renderprops';
import {Container, Loading, Snackbar} from "../../components";
import {PlayerContainer, SocketContainer, StorageContainer} from "../../containers";
import logger from "../../util/logger";
import {ActivityStream, GameNav, InfoView, PlayView, TeamView, WaitView} from "./";

import "./live.css";

export class Live extends React.Component<LiveProps, LiveState> {
    public constructor(props:LiveProps) {
        super(props);
        this.state = {
            joining: true,
            view: "loading",
            loading: props.containers.socket.state.status !== "authenticated",
            tab: props.location && props.location.hash ? props.location.hash : "#",
        } as LiveState;

        props.containers.player.attachStorage(props.containers.storage);

    }

    // tabs = {
    //     "#info": (<div className={"wait-view"}>a</div>),
    //     "#teams": (props:TeamViewProps) => (<TeamView {...props} />)
    // };



    componentDidMount(): void {
        const {player, socket} = this.props.containers;

        logger.log(socket);

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
            .catch(err => logger.log(err))

    }

    initiate = async () => {
        logger.log("Initiated");
        const {socket, player, storage} = this.props.containers;
        if (socket.state.status !== "authenticated") {
            // TODO Check to see if we already have stored values and cross check
            // TODO so we do not have to reauthorize access

            logger.debug("Socket not authenticated, so authenticate!");

            if (!socket.connected()) {
                await socket.connect();
            }

            if (player.hasSession()) {
                // logger.log(storage.getToken(), storage.getGameID(), storage.getTeamKey())
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
                logger.debug("Live is requesting Game Data");
                const response = await socket.requestGame(storage.getGameID());
                if (response.success) {
                    this.setState({
                        loading: false,
                        view: socket.state.gameStatus && socket.state.gameStatus.started && !socket.state.gameStatus.paused ? "playing" : "waiting",
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
    };

    handleGameState = () => {
        const {socket} = this.props.containers;
        // const {} = this.state
        logger.log(socket.state);
    };

    componentWillReceiveProps(nextProps: Readonly<LiveProps>, nextContext: any): void {
        // logger.log("Props Received", nextProps);
        if (nextProps.location) {
            if (nextProps.location.hash !== this.state.tab) {
                // if (this.tabs[nextProps.location.hash])
                this.setState({tab: nextProps.location.hash || "#"});
                logger.log(this.state)
            }
        }
        const {socket} = nextProps.containers;
        if (socket.state.game && socket.state.gameStatus) {
            if (socket.state.game.started
                && !socket.state.game.paused
                && socket.state.gameStatus.started
                && !socket.state.gameStatus.paused) {
                if (this.state.view !== "playing") {
                    logger.debug("Question is playing, setting view");
                    this.setState({view: "playing"});
                }
            } else {
                if (this.state.view === "playing") {
                    logger.debug("Question stopped, resetting view");
                    this.setState({view: "waiting"});
                }
            }
        }
    }

    handleNotification = (evt?:SyntheticEvent) => {
        if (evt) {
            evt.preventDefault();
        }
        const {socket} = this.props.containers;
        if (typeof socket.state.showNotification !== "undefined") {
            if (typeof socket.state.showNotification === "number")
                clearTimeout(socket.state.showNotification);
            if (typeof socket.state.showNotification === "number"
                || typeof socket.state.showNotification === "boolean")
                socket.setState({showNotification: false, notification: undefined});
        }
    };

    generateStatus = () => {
        const {socket} = this.props.containers;
        if (socket.state.game) {
            if (socket.state.game.started) {
                if (socket.state.game.paused) {
                    return {
                        status: "Waiting for question...",
                        icon: <FontAwesomeIcon className={"ico"} fixedWidth icon={["fas", "lock"]}/>
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
                            // icon: <FontAwesomeIcon className={"ico"} fixedWidth icon={["fas", "lock"]}/>
                        };
                    } else {
                        return {
                            status: "Loading question...!",
                            icon: <FontAwesomeIcon className={"ico"} fixedWidth icon={["fas", "lock"]}/>
                        };
                    }
                }
            }
        }
        return {
            status: "Waiting for game...",
            icon: <FontAwesomeIcon className={"ico"} fixedWidth icon={["fas", "lock"]}/>
        };
    };


    views = (socket:SocketContainer) => [
        {
            key: "#",
            component: socket.state.game
            && socket.state.game.started
            && !socket.state.game.paused
            && socket.state.gameStatus
            && socket.state.gameStatus.started
            && !socket.state.gameStatus.paused ? PlayView : WaitView,

            props: {socket, data: socket.state.game}
        },
        {
            key: "#teams",
            component: TeamView,
            props: {
                game: socket.state.game,
                teams: socket.state.gameStatus ? socket.state.gameStatus.teams : []
            }
        },
        {
            key: "#info",
            component: InfoView,
            props: {
                game: socket.state.game
            }
        },
        {
            key: "#history",
            component: WaitView, // TODO Create View
            props: {data:socket.state.game}
        },
    ]


    public render() {
        // @ts-ignore
        const AnimatedContainer = animated(Container) as any;
        const {socket} = this.props.containers;
        const {loading, tab} = this.state;
        const {location} = this.props;

        const views = this.views(socket);

        // logger.log(views, tab,);

        return (
            <Container className={"head-pad px-0 no-overflow-x"}
                fullWidth
                display={"flex"}
                direction={"column"}
                align={{
                    items: "center",
                    //content: "center"
                }}
                justifyContent={"between"}
                flex={{grow:1}}
                style={this.props.style}
            >

                <Loading visible={loading} full />

                {/*<ActivityStream*/}
                {/*    icon={<FontAwesomeIcon className={"ico"} fixedWidth icon={["fas", "lock"]}/>}*/}
                {/*    status={"Waiting for game..."} minimized={false}*/}
                {/*/>*/}

                <ActivityStream
                    {...this.generateStatus()}
                    onClick={(evt) => this.props.history.push("#")}
                    minimized={false}
                />

                {!loading && location && (
                    <Transition unique
                        // native
                        items={views.find(v => v.key === tab)}
                        key={tab}
                        keys={(v:any) => v.key}
                        from={{ position: "absolute", transform: 'translateX(200px)', opacity: 0 }}
                        enter={{ position: "relative", transform: 'translateX(0px)', opacity: 1 }}
                        leave={{ position: "absolute", transform: 'translateX(-200px)', opacity: 0 }}
                    >
                        {(view, state, index) => style => {
                            // logger.log({loc, state, style});
                            // logger.log({view, state, style, index});
                            return React.createElement(view.component, {...view.props, style})
                            // return views.map((view, key) => {
                            //     // @ts-ignore
                            //     return React.createElement(view.component, {...view.props, style, key})
                            // })
                        }}
                    </Transition>
                )}

                {/*<Transition*/}
                {/*    items={content}*/}
                {/*    from={{opacity: 0}}*/}
                {/*    enter={{opacity: 1}}*/}
                {/*    leave={{opacity: 0}}*/}
                {/*>*/}
                {/*    {show => (show && ContentComponent && !loading) && (style => (*/}
                {/*        <ContentComponent style={style} {...content.props} />))}*/}
                {/*</Transition>*/}



                {/*{loading || typeof content.component === "undefined" ? (<div/>) : <ContentComponent {...content.props} />}*/}

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
    style?: any;
}

interface LiveState {
    joining: boolean;
    view: string;
    loading: boolean;
    tab: string;
}

export default Live