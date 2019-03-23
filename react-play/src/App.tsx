import * as React from 'react';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "unstated";
import {PlayerContainer, SocketContainer, StorageContainer} from "./containers";
import Router from "./Router";

class App extends React.Component<any, any> {
    public constructor(props:any) {
        super(props);
        this.state = {
            storageContainer: new StorageContainer(),
            playerContainer: new PlayerContainer(),
            socketContainer: new SocketContainer(),
        }
    }

    componentDidMount(): void {
        
    }

    public render() {
        const {storageContainer, playerContainer, socketContainer} = this.state;
        return (
            <BrowserRouter>
                <Provider inject={[storageContainer, playerContainer, socketContainer]}>
                    <React.Suspense fallback={""} >
                        <Router />
                    </React.Suspense>
                </Provider>
            </BrowserRouter>
        )
    }
}

export default App;
