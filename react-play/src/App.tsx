import * as React from 'react';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "unstated";
import {PlayerContainer, SocketContainer, StorageContainer} from "./containers";
import Router from "./Router";

class App extends React.Component<any, AppState> {
    public constructor(props:any) {
        super(props);
        this.state = {
            storageContainer: new StorageContainer(),
            playerContainer: new PlayerContainer(),
            socketContainer: new SocketContainer(),
            ready: false,
        }

        this.state.playerContainer.attachStorage(this.state.storageContainer);
    }

    componentDidMount(): void {
        import(/* webpackChunkName: "fa" */"./FontAwesome")
            .then(fa => fa.default())
            .then(() => this.setState({ready:true}))
            .catch(err => console.error(err));
    }

    public render() {
        const {storageContainer, playerContainer, socketContainer, ready} = this.state;
        return (
            <BrowserRouter>
                <Provider inject={[storageContainer, playerContainer, socketContainer]}>
                    <React.Suspense fallback={""} >
                        {ready && (<Router />)}
                    </React.Suspense>
                </Provider>
            </BrowserRouter>
        )
    }
}

interface AppState {
    storageContainer: StorageContainer;
    playerContainer: PlayerContainer;
    socketContainer: SocketContainer;
    ready: boolean;
}

export default App;
