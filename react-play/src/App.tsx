import * as React from 'react';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "unstated";
import {StorageContainer} from "./containers";
import Router from "./Router";

class App extends React.Component<any, any> {
    public constructor(props:any) {
        super(props);
        this.state = {
            storageContainer: new StorageContainer()
        }
    }

    componentDidMount(): void {
        import("./FontAwesome")
            .then(fa => fa.init())
            .then(() => this.forceUpdate());
    }

    public render() {
        const {storageContainer} = this.state;
        return (
            <BrowserRouter>
                <Provider inject={[storageContainer]}>
                    <React.Suspense fallback={""} >
                        <Router />
                    </React.Suspense>
                </Provider>
            </BrowserRouter>
        )
    }
}

export default App;
