import * as React from "react";
import {ReactElement} from "react";
import {Api} from "./api";
import {Session, User} from "./session";
import {apiRequest} from "./fetch";
import Timeout = NodeJS.Timeout;


let api = Api();

let reloader = false;
class GameGate extends React.Component<GameGateProps, GameGateState> {
    
    public constructor(props) {
        super(props);
        if (typeof props.gameToken === "undefined") {
            throw Error("Game token required.");
        }
        const api = Api();
        
        
        let reloadTimer = setInterval(() => {
            if (reloader) {
                this.getData();
                reloader = false;
            }
        }, 500);
        
        this.state = {
            api: api,
            session: api.session,
            user: api.session.user,
            //actiove: false,
            current: (<div>_</div>),
            loaded: false,
            reloader: reloadTimer,
        };
        
        
    }
    
    componentWillUnmount() {
        clearInterval(this.state.reloader);
    }


    public static reload() {
        reloader = true;
    }

    public componentWillMount() {
        this.getData();
    }

    private getData() {
        const promise = apiRequest("game", {
            path: this.props.path || undefined,
            headers: {
                token: api.session.teamKey(),
                game: this.props.gameToken
            }
        });

        promise.then(async (res) => {
            if (this.props.onLoad) {
                this.props.onLoad(await res.json());
            }
            this.setState({loaded: true});
        })
    }

    public render() {
        if (this.state.loaded)
            return this.props.children;
        else
            return (<div>Loading!!!</div>)
    }
}


interface GameGateProps {
    //email?:string;
    //session?:string;
    gameToken:string;
    path?:string;
    
    onLoad?:(data:any) => any;
    onReload?:(callback:any) => any;

    state?: GameGateState;
    children: ReactElement<any>;
}

interface GameGateState {
    api: any;
    session:Session;
    user:User;
    current:any;
    loaded:boolean;
    reloader:Timeout;
}

export default GameGate;