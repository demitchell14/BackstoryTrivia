import * as React from 'react';
import {Link} from "react-router-dom";

class Dashboard extends React.Component {
    public render() {
        return (
            <div>
                <p>I'm the Dashboard!</p>
                <p>Visit the <Link to={"/questions"}>Questions Page</Link> as its currently the only one available right now :(</p>
            </div>
        );
    }
}

export default Dashboard;