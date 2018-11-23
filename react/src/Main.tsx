import * as React from 'react';
import {
    Container,
    Row,
    Col,
} from "reactstrap";
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.css';

//import logo from './images/logo.svg';
import {Link} from "react-router-dom";

class Main extends React.Component {
  public render() {
    return (
      <Container className={"mt-3"}>
          <Row>
              <Col sm={{size: 6}} className={"mx-auto"}>
                  <Link to={'/manage'} className={"btn btn-block btn-info"}>Manage Games</Link>
                  <Link to={'/list'} className={"btn btn-block btn-success"}>Game List</Link>
                  <Link to={'/test/game123'} className={"btn btn-block btn-warning"}>Testing</Link>
              </Col>
              <Col>
              </Col>
          </Row>
      </Container>
    );
  }
}

export default Main;
