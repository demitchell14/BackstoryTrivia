import {RefObject, SyntheticEvent} from "react";
import * as React from "react";
import {RouterProps} from "react-router";
import {Card, CardBody, Container, Loading} from "../../components";
import {PlayerContainer, SocketContainer, StorageContainer} from "../../containers";
import {BrowserQRCodeReader} from "@zxing/library";

export class Play extends React.Component<PlayProps, PlayState> {
    qr:BrowserQRCodeReader;
    cameraRef:RefObject<HTMLVideoElement>;
    public constructor(props:PlayProps) {
        super(props);
        this.state = {
            view: "find",
            game: "",
            loading: false,
        } as PlayState
        props.containers.player.attachStorage(props.containers.storage);

        this.qr = new BrowserQRCodeReader();
        this.cameraRef = React.createRef();
    }

    componentDidMount(): void {
        const {player} = this.props.containers;

        const check = player.check();
        check.then(res => {
            if (typeof res === "boolean" && !res) {
                this.props.history.replace("/");
            }
        });

        this.sendViewSettings();
    }

    sendViewSettings = () => {
        if (this.state.view === "find") {
            this.qr.getVideoInputDevices()
                .then(controllers => {
                    if (controllers.length > 0) {
                        const targetController = controllers[controllers.length-1];
                        this.setState({camera: targetController.deviceId});
                        if (this.cameraRef.current) {
                            this.qr.decodeFromInputVideoDevice(targetController.deviceId, this.cameraRef.current)
                                .then(res => {
                                    this.setState({game: res.getText()});
                                    this.onJoin();
                                    this.sendViewSettings();
                                })
                                .catch(err => {
                                    alert(err);
                                })
                        }
                    }
                })
        } else {
            if (this.cameraRef.current) {
                this.qr.unbindVideoSrc(this.cameraRef.current);
            }
        }
    }

    findView = (props:any) => (
        <form onSubmit={props.onJoin}>
            {props.withCamera ? (
                <div>
                    <p className={"mb-0"}>We detected a camera on your device.</p>
                    <p>Since you are not currently connected to an active game session,
                    if there is a QR Code present, please scan it with the built in scanner provided here. If there is a problem
                    or we have detected a camera that is not working, please enter the game code provided by the game administrator.</p>
                    <video ref={this.cameraRef} id={"camera-view"} width={"100%"} height={"200"} style={{border: "1px solid white"}}>Video is not available</video>
                </div>
            ) : (
                <div>
                    <p className={"mb-0"}>We could not detect a camera on your device.</p>
                    <p>Since you are not currently connected to an active game session, please enter the game code provided by
                    the game administrator to continue.</p>
                </div>
            )}
            <div className={"form-group"}>
                <label>Enter Code:</label>
                <input value={props.game} onChange={props.onChange} name={"game"} type={"text"} className={"form-control"} />
            </div>
            <button type={"submit"} className={"btn btn-block btn-primary"}>Join</button>
        </form>
    );

    joinView = (props:any) => (
        <Card rounded theme={"dark"} className={"p-3 card-dark"}>
            <CardBody>
                <h4>Joining Game...</h4>
                <p>Trying to join `{props.response.name || "Unknown Name"}`</p>
                <div>
                    <p>If this is the game you are trying to join, Simply wait 5 seconds or click the button below.</p>
                    <button type={"button"} className={"btn btn-block btn-primary"} onClick={props.onJoin}>Proceed</button>
                </div>
            </CardBody>
        </Card>
    )

    componentWillUnmount(): void {
        console.log("Unmounting");
        const {socket} = this.props.containers;
        if (socket.connected()) {
            console.log("Disconnecting");
            socket.disconnect();
        }
    }


    public render() {
        let content;
        switch (this.state.view) {
            case "find":
                content = this.findView({
                    withCamera: typeof this.state.camera !== "undefined",
                    game: this.state.game,
                    onChange: this.onGameChange,
                    onJoin: this.onJoin,
                });
                break;
            case "join":
                content = this.joinView({
                    response: this.state.gameData,
                    game: this.state.game,
                    onJoin: this.onJoin,
                })
                break;
            default:
                content = (<div>Unknown</div>)
                break;
        }

        return (
            <Container
                fullWidth
                display={"flex"}
                direction={"column"}
                align={{
                    items: "center",
                    //content: "center"
                }}
                justifyContent={"around"}
                flex={{grow:1}}>

                {content}
                <Loading dark visible={this.state.loading} />

            </Container>
        );
    }

    onGameChange = (evt:SyntheticEvent) => {
        const target = evt.currentTarget as HTMLInputElement;
        this.setState({game: target.value});
    }

    onJoin = (evt?:SyntheticEvent) => {
        if (evt)
            evt.preventDefault();
        if (this.state.game) {
            if (this.state.view === "find") {
                // Send game off and get response
                this.setState({loading: true});
                const {socket, storage} = this.props.containers;
                if (storage.hasToken()) {
                    const promise = socket.connect(storage.getToken(), this.state.game);
                    promise.then(() => {
                        socket.startPolling();
                    })
                }

            }
            if (this.state.view === "join") {
                // Send to game instance
                console.log("Send to Game Instance");
            }
        }
    }
}

interface PlayProps extends RouterProps {
    state?: PlayState;
    containers: {
        storage: StorageContainer;
        player: PlayerContainer;
        socket:SocketContainer;
    }
}

interface PlayState {
    camera?: string;
    loading:boolean;
    view: string;
    game: string;
    gameData?: any;
}

export default Play