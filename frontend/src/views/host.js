import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Player from "../components/player";
import Members from "../components/members";

import "./Styles.css";

class Host extends Component {
  state = {};
  render() {
    return (
      <div class="host">
        <div className="square-container">
          <div className="squares square1" />
          <div className="squares square2" />
          <div className="squares square3" />
          <div className="squares square4" />
          <div className="squares square5" />
          <div className="squares square6" />
          <div className="squares square7" />
          <div className="content-container">
            <Row>
              <Col xs={7}>
                <div className="playerPanel">
                  <Player />
                </div>
              </Col>
              <Col xs={5}>
                <div className="membersPanel">
                  <Members />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default Host;
