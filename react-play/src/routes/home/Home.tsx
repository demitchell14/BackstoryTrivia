import * as React from "react";
import {RouterProps} from "react-router";
import {Link} from "react-router-dom";
import {Container, SplashOption} from "../../components";
import {PlayerContainer, SocketContainer, StorageContainer} from "../../containers";

export class Home extends React.Component<HomeProps, HomeState> {
    public constructor(props:any) {
        super(props);
        this.state = {show: false} as HomeState

        props.containers.player.attachStorage(props.containers.storage);
    }


    componentWillMount(): void {

        const {player, socket} = this.props.containers;
        const check = player.check()
        check.then(res => {
            console.log(res)
            if (res) {
                this.props.history.replace("/play");
            } else {
                this.setState({show: true});
            }
        });
        if (socket.connected()) {
            socket.disconnect();
        }
        console.log(this)
    }

    public render() {
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

                {this.state.show && [
                    <SplashOption key={"new"} reverse
                                  title={<h4 key={"h4"}>Are you new?</h4>}
                                  button={<Link key={"button"} to={"/register"} className={"btn btn-block btn-primary"}>Register to Play</Link>}
                    />,
                    <SplashOption key={"return"}
                    title={<h4 key={"h4"}>Returning player?</h4>}
                    button={<Link key={"button"} to={"/login"} className={"btn btn-block btn-primary"}>Login</Link>}
                    />
                ]}

            </Container>
        );
    }
}

interface HomeProps extends RouterProps{
    containers: {
        storage: StorageContainer;
        player: PlayerContainer;
        socket: SocketContainer;
    }
    state?: HomeState;
}

interface HomeState {
    show: boolean;
}

export default Home;