import {RefObject, SyntheticEvent} from "react";
import * as React from "react";
import {RouterProps} from "react-router";
import {animated} from 'react-spring/renderprops';
import {Card, CardBody, Container, Loading, Snackbar} from "../../components";
import {PlayerContainer, SocketContainer, StorageContainer} from "../../containers";
import {BrowserQRCodeReader} from "@zxing/library";
import FAIcon from "../../FontAwesome";
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
            showError: false
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
        const {storage, socket} = this.props.containers;
        if (storage.hasGameID() && storage.hasTeamKey() && storage.hasToken()) {
            this.setState({loading: true});
            await socket.connect();
            const request = await socket.requestGame(storage.getGameID()) as any;
            if (request.success) {
                // await socket.authenticate(storage.getToken(), storage.getGameID(), storage.getTeamKey())
                this.setState({
                    loading: false, gameData: request.game, game: request.game.token,
                    view: "join", proceed: setTimeout(this.onJoin, 5000),
                });
                if (socket.state.status === "authenticated") {
                    console.log(this.state)
                }
            }
        }
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
                <button onClick={this.reset} className={"close btn btn-secondary-outline-primary"}><FAIcon icon={["far", "times"]} /></button>
                <div>
                    <p>If this is the game you are trying to join, Simply wait 5 seconds or click the button below.</p>
                    <button type={"button"} className={"btn btn-block btn-primary"} onClick={props.onJoin}>Proceed</button>
                </div>
            </CardBody>
        </Card>
    )

    componentWillUnmount(): void {
        const {socket} = this.props.containers;
        if (socket.connected() && this.state.proceed !== true) {
            console.debug("Socket Disconnecting");
            socket.disconnect();
        }
    }


    public render() {
        // @ts-ignore
        const AnimatedContainer = animated(Container)
        let content;
        switch (this.state.view) {
            case "find":
                content = this.findView({
                    withCamera: typeof this.state.camera !== "undefined",
                    game: this.state.game || (this.state.gameData && this.state.gameData.token) ,
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

    reset = (evt:SyntheticEvent) => {
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

    handleSnackbar = (evt?:SyntheticEvent):any => {
        if (this.state.showError)
            clearTimeout(this.state.showError);
        this.setState({showError: false, error: undefined});
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


        const {storage, socket} = this.props.containers;

        await socket.connect()
            .catch((err) => this.setState({error: err}));

        if (this.state.game) {
            if (this.state.view === "find") {
                // Send game off and get response
                this.setState({loading: true});

                if (storage.hasToken()) {
                    const response = await socket.requestGame(this.state.game) as any;
                    //console.log(response)
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
                
                socket.authenticate(storage.getToken(), this.state.game)
                    .then((success:boolean) => {
                        if (success) {
                            storage.setGameID(socket.state.room || "");
                            storage.setTeamKey(socket.state.activeKey || "");
                            this.setState({proceed: true});
                            this.props.history.replace("/" + socket.state.room);
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
}

export default Play