import {Container} from "unstated";
import conf from  "../../config"
//import {AuthTemplate} from "./Authorization";

class TeamAuthorization extends Container<TeamState> /*implements AuthTemplate */ {

    public hasToken(): boolean {
        return sessionStorage.getItem(conf.teamToken) !== null;
    }

}

interface TeamState {
    test:string;
}

export default TeamAuthorization;