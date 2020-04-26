import React, { Component } from "react";
import Squares from './squares';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Player from "./player";
import Members from "./members";
import config from "../constants.js";
import Update from "../views/Update";
import { withRouter } from "react-router-dom";
import CopyLink from "./copyLink.js"
import ShareLink from "./shareLink.js"


import "../views/Styles.css";

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
    this.props.history.push(`/update/${this.props.playlistID}`);
  };

 

  render() {
    let share;
    if (navigator.share){
      share = <ShareLink link={this.props.shareLink} playlistName={this.props.playlistName}/>;
    }else {
      share = <CopyLink link={this.props.shareLink} />;
    }

    if (this.props.renderMobile) {
      return (
        <div className="host">
          <div className="square-container">
            <Squares />
            <div className="content-container">
              <div className="partyPage">
                <div className="mobileTopPanel">
                  <h2 style={{ marginBottom: "10px" }}>{this.props.playlistName}</h2>
                  {share}
                  <div className="playerPanel">
                    <Player playlistID={this.props.playlistID} />
                  </div>
                </div>
                <div style={{marginBottom: "20px"}}>
                <Members users={this.props.users} />
                </div>
                <Button id="update" className="bigWhiteButton" onClick={this.callUpdate}>
                  Update
                    </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }
    if (!this.props.renderMobile) {
      return (
        <div className="host">
          <div className="square-container">
            <Squares />
            <div className="content-container">
              <Row className="partyPage">
                <Col md={7} style={{ height: "100%" }}>
                  <div className="playerPanel">
                    <Player playlistID={this.props.playlistID} />
                  </div>
                </Col>
                <Col md={5} className="rightPanel">
                  <div className="membersPanel">
                    <h1 style={{ marginBottom: "10px" }}>{this.props.playlistName}</h1>
                    <Members users={this.props.users} />
                  </div>
                  <div className="hostPanel">
                    <CopyLink link={this.props.shareLink} />
                    <Button id="update" className="bigWhiteButton" onClick={this.callUpdate}>
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
}

export default withRouter(Host);
