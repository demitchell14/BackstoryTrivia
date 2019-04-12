import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {RefObject, SyntheticEvent} from "react";
import * as React from "react";
import {RouterProps} from "react-router";
import {animated} from 'react-spring/renderprops';
import {Container, Loading, Snackbar} from "../../components";
import {PlayerContainer, SocketContainer, StorageContainer} from "../../containers";
import {BrowserQRCodeReader} from "@zxing/library";
import logger from "../../util/logger";
import Timeout = NodeJS.Timeout;

export class Play extends React.Component<PlayProps, PlayState> {
    qr:BrowserQRCodeReader;
    cameraRef:RefObject<HTMLVideoElement>;

    public constructor(props:PlayProps) {
        super(props);
        this.state = {
            view: "find",
            game: "",
            loading: false, 
            showError: false,
            activeCameraId: 0,
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

        this.checkStorage()

        this.sendViewSettings();
    }

    checkStorage = async () => {
        const {storage, socket, player} = this.props.containers;
        if (storage.hasGameID() && storage.hasTeamKey() && storage.hasToken()) {
            this.setState({loading: true});
            const status = await player.getGameStatus(storage.getGameID())
            if (!status) {
                this.setState({
                    error: "Unable to find selected game.",
                    loading: false,
                    showError: setTimeout(() => this.reset(), 5000),
                })
                return;
            }

            if (!status.completed) {
                await socket.connect();
                const request = await socket.requestGame(storage.getGameID()) as any;
                if (request.success) {
                    // await socket.authenticate(storage.getToken(), storage.getGameID(), storage.getTeamKey())
                    this.setState({
                        loading: false, gameData: request.game, game: request.game.token,
                        view: "join", proceed: setTimeout(this.onJoin, 5000),
                    });
                    if (socket.state.status === "authenticated") {
                        logger.log(this.state)
                    }
                }
            } else {
                // TODO Uncomment to clear session when game is complete
                // storage.clearTeamKey();
                // storage.clearGameID()

                this.setState({
                    loading: false,
                    message: (
                        <div className={"alert alert-secondary"}>
                            <span onClick={() => this.setState({message: undefined})} className={"close"}><FontAwesomeIcon icon={["far", "times"]} /></span>
                            <p className={"mb-0 pr-3"}>The last game you were a part of has been completed.</p>
                        </div>
                    )
                })
            }
        }
    }

    sendViewSettings = () => {
        if (this.state.view === "find") {
            this.qr.getVideoInputDevices()
                .then(controllers => {
                    if (controllers.length > 0) {
                        // this.setState({activeCameraId: controllers.length-1})
                        const targetController = controllers[this.state.activeCameraId];
                        this.setState({camera: targetController.deviceId});
                        if (this.cameraRef.current) {
                            this.qr.decodeFromInputVideoDevice(targetController.deviceId, this.cameraRef.current)
                                .then(res => {
                                    this.setState({game: res.getText()});
                                    this.onJoin();
                                    this.sendViewSettings();
                                })
                                .catch(err => this.setState({camera: undefined}))
                        }
                    }
                })
        } else {
            if (this.cameraRef.current) {
                this.qr.unbindVideoSrc(this.cameraRef.current);
            }
            this.qr.reset();
        }
    }

    switchCamera = (evt:SyntheticEvent) => {
        evt.preventDefault();
        let index = this.state.activeCameraId;
        this.qr.getVideoInputDevices()
            .then(controllers => {
                if (index + 1 > controllers.length)
                    index = 0;
                else index++;
                this.setState({activeCameraId: index});
                this.sendViewSettings()
            });
    }

    findView = (props:any) => (
        <form onSubmit={props.onJoin}>
            {this.state.message}
            {props.withCamera ? (
                <div>
                    <p className={"mb-0"}>We detected a camera on your device.</p>
                    <p>Since you are not currently connected to an active game session,
                    if there is a QR Code present, please scan it with the built in scanner provided here. If there is a problem
                    or we have detected a camera that is not working, please enter the game code provided by the game administrator.</p>
                    <video ref={this.cameraRef} id={"camera-view"} width={"100%"} height={"200"} style={{border: "1px solid white"}}>Video is not available</video>
                    <button onClick={this.switchCamera} className={"btn btn-primary"}>Switch Camera</button>
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
                <input value={this.state.game} onChange={props.onChange} name={"game"} type={"text"} className={"form-control"} />
            </div>
            <button type={"submit"} className={"btn btn-block btn-primary"}>Join</button>
        </form>
    );

    joinView = (props:any) => (
        <div className={"card-primary"}>
            <button onClick={this.reset} className={"close btn btn-secondary-outline-primary"}><FontAwesomeIcon icon={["far", "times"]} /></button>
            <div className={"card-body"}>
                <h4>Joining Game...</h4>
                <p>Trying to join `{props.response.name || "Unknown Name"}`</p>
                <div>
                    <p>If this is the game you are trying to join, Simply wait 5 seconds or click the button below.</p>
                    <button type={"button"} className={"btn btn-block btn-primary"} onClick={props.onJoin}>Proceed</button>
                </div>
            </div>
        </div>
    )

    componentWillUnmount(): void {
        const {socket} = this.props.containers;
        if (socket.connected() && this.state.proceed !== true) {
            logger.debug("Socket Disconnecting");
            socket.disconnect();
        }
        this.setState({view: ""});
        this.sendViewSettings();
    }

    public render() {
        // @ts-ignore
        const AnimatedContainer = animated(Container)
        let content;
        switch (this.state.view) {
            case "find":
                content = this.findView({
                    withCamera: typeof this.state.camera !== "undefined",
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
                flex={{grow:1}}
                className={"play"}
                style={this.props.style}
            >

                {content}

                <Loading dark visible={this.state.loading} />

                {this.state.error && this.state.showError && (
                    <Snackbar variant={"danger"} position={"bottom"} onClose={this.handleSnackbar}>
                        <p>{this.state.error}</p>
                    </Snackbar>
                )}

            </Container>
        );
    }

    reset = (evt?:SyntheticEvent) => {
        const {socket, storage} = this.props.containers;
        if (typeof this.state.proceed === "object")
            clearTimeout(this.state.proceed);
        if (typeof this.state.showError === "object")
            clearTimeout(this.state.showError);
        this.setState({
            view: "find",
            game: "",
            loading: false,
            showError: false,
            gameData: undefined,
            connected: undefined,
            error: undefined,
        })
        if (socket.connected()) {
            socket.disconnect();
            socket.setState({
                status: "", activeKey: undefined, room: undefined
            })
            socket.connect();
        }
        if (storage.hasTeamKey())
            storage.clearTeamKey();
        if (storage.hasGameID())
            storage.clearGameID();
    }

    handleSnackbar = (reset?:SyntheticEvent|boolean, resetPlayer?:boolean):any => {
        if (this.state.showError)
            clearTimeout(this.state.showError);
        this.setState({showError: false, error: undefined});

        if (typeof reset === "boolean") {
            if (reset) {
                this.reset();
            }
        }
        if (resetPlayer) {
            this.props.containers.player.reset();
        }
    }

    onGameChange = (evt:SyntheticEvent) => {
        const target = evt.currentTarget as HTMLInputElement;
        // if (Math.abs(target.value.length - this.state.game.length) > 1)
        this.setState({game: target.value});
    }

    onJoin = async (evt?:SyntheticEvent) => {
        if (evt)
            evt.preventDefault();
        if (this.state.proceed && typeof this.state.proceed !== "boolean") {
            clearTimeout(this.state.proceed);
            this.setState({proceed: false});
        }

        const {storage, socket, player} = this.props.containers;


        await socket.connect()
            .catch((err) => this.setState({error: err}));

        if (this.state.game) {
            if (this.state.view === "find") {
                // Send game off and get response
                this.setState({loading: true});

                const status = await player.getGameStatus(this.state.game)

                if (!status) {
                    this.setState({
                        error: "Unable to find selected game.",
                        loading: false,
                        showError: setTimeout(() => this.reset(), 5000),
                    })
                    return;
                }

                if (status.completed) {
                    this.setState({
                        loading: false,
                        message: (
                            <div className={"alert alert-danger"}>
                                <span onClick={() => this.setState({message: undefined})} className={"close"}><FontAwesomeIcon icon={["far", "times"]} /></span>
                                <p className={"mb-0 pr-4"}>The game you are searching for has already been completed.</p>
                            </div>
                        )
                    });
                    socket.disconnect();
                    // this.reset();
                    return;
                }

                if (storage.hasToken()) {
                    const response = await socket.requestGame(this.state.game.toLowerCase()) as any;
                    //logger.log(response)
                    if (response.success) {
                        this.setState({
                            gameData: response.game,
                            view: "join",
                            loading: false,
                            proceed: setTimeout(this.onJoin, 5000),
                        });
                    } else {
                        this.setState({
                            loading: false, 
                            showError: setTimeout(this.handleSnackbar, 5000),
                            error: response.message,
                        })
                    }
                    // socket.subscribe(this.handleSocket)
                }

            } else
            if (this.state.view === "join") {
                // Send to game instance
                logger.log(this);
                this.setState({loading: true});
                socket.authenticate(storage.getToken(), this.state.game.toLowerCase())
                    .then((success:boolean) => {
                        if (success) {
                            storage.setGameID(socket.state.room || "");
                            storage.setTeamKey(socket.state.activeKey || "");
                            this.setState({proceed: true, loading: false});
                            this.props.history.replace("/" + socket.state.room);
                        } else {
                            this.setState({
                                loading: false,
                                showError: setTimeout(() => {
                                    if (socket.state.activeKey === "Team not found") {
                                        this.reset();
                                        this.props.history.push("/");
                                        return;
                                    }
                                    this.handleSnackbar(true);
                                }, 5000),
                                error: socket.state.activeKey
                            })
                        }
                    });
            }
        }
    }

    handleSocket = () => {
        const {socket} = this.props.containers;
        if (socket.state.status === "authenticated") {
            if (socket.state.room && socket.state.activeKey) {

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
    style?: any;
}

interface PlayState {
    camera?: string;
    loading:boolean;
    view: string;
    game: string;
    gameData?: any;
    error?: any
    showError: Timeout|false;
    proceed?: Timeout|boolean;
    connected?: boolean;
    activeCameraId: number;
    message?: React.ReactNode|string;
}

export default Play