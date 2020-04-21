import React, { Component } from "react";
import Squares from '../components/squares';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Player from "../components/player";
import Members from "../components/members";
import config from "../constants.js";
import Update from "./Update";
import { withRouter } from "react-router-dom";

import "./Styles.css";

class Host extends React.Component {
  state = {};

  backendAddress = config.backendAddress;

  constructor(props) {
    super(props);
    console.log("Props are: ", this.props)

    // INFO IS INHERITED FROM PARTY.JS THROUGH PROPS
  }

  refreshPage() {
    window.location.reload(true);
  }

  componentDidMount() {
    console.log("State is: ", this.state);
  }

  callUpdate = () => {
    this.props.history.push("/update", {
      playlistId: this.props.playlistID
    });
  };

  render() {
    return (
      <div class="host">
        <div className="square-container">
          <Squares />
          <div className="content-container">
            <Row>
              <Col xs={7}>
                <div className="playerPanel">
                  <Player playlistID={this.props.playlistID} />
                </div>
              </Col>
              <Col xs={5}>
                <div className="membersPanel">
                  <h1 style={{ marginBottom: "10px" }}>{this.props.playlistName}</h1>
                  <Members users={this.props.users} />
                  <br></br>
                  {/* Temporarily removed update functionality while migrating to database */}
                  <Button id="update" onClick={this.callUpdate}>
                    Update
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Host);
