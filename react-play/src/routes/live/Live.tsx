import * as React from "react";
import {RouteProps, RouterProps} from "react-router";
import {Container, Loading} from "../../components";
import {PlayerContainer, SocketContainer, StorageContainer} from "../../containers";
import {ActivityStream, GameNav} from "..";

import "./live.css";
import FAIcon from "../../FontAwesome";
import WaitView from "./WaitView";

class Live extends React.Component<LiveProps, LiveState> {
    public constructor(props:LiveProps) {
        super(props);
        this.state = {
            joining: true,
            view: "loading",
            loading: true,
        } as LiveState

        props.containers.player.attachStorage(props.containers.storage)
    }



    componentDidMount(): void {
        const {player} = this.props.containers;

        player.check()
            .then((success:boolean) => {
                if (success) {
                    this.initiate()
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
        const {socket, player, storage} = this.props.containers;
        if (socket.state.status !== "authenticated") {
            // TODO Check to see if we already have stored values and cross check
            // TODO so we do not have to reauthorize access

            if (!socket.connected())
                await socket.connect()

            if (player.hasSession()) {
                console.log(storage.getToken(), storage.getGameID(), storage.getTeamKey())
                const success = await socket.authenticate(storage.getToken(), storage.getGameID(), storage.getTeamKey());
                if (!success) {
                    throw success;
                }
            }
            // this.props.history.push("/");
        }

        if (socket.state.status === "authenticated") {
            // TODO Initiate game
            const response = await socket.requestGame(storage.getGameID());
            if (response.success) {
                this.setState({
                    loading: false,
                    view: "waiting",
                    game: response.game,
                })
            }

            // Currently Wait View Only
            console.log(socket);
        }
    }

    public render() {
        const {loading, view} = this.state;
        let content:React.ReactNode;
        switch (view) {
            default:
                content = <WaitView />
        }
        return (
            <Container className={"head-pad"}
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

                <ActivityStream
                    icon={<FAIcon className={"ico"} fixedWidth icon={["fas", "lock"]}/>}
                    status={"Waiting for game..."}
                />

                {loading ? (<div/>) : content}

                <GameNav />
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
    game?: {
        name: string;
        token: string;

        started: boolean;
        paused?: boolean;

        teams: number;
        questions: number;

        currentQuestion?: number;

        startTime: string;

        description?: string;
        image?: string;

    }
}

export default Live