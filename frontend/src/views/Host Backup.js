import React, { Component } from "react";
import Squares from '../components/squares';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Player from "../components/player";
import Members from "../components/members";
import config from "../constants.js";


import "./Styles.css";

class Host extends React.Component {
  state = {};

  backendAddress = config.backendAddress;

  constructor() {
    super();
    this.state = {
      users: [],
      playlistId: "",
      playlistName: "",
      playlistDuration: null
    };
  }

  refreshPage() {
    window.location.reload(true);
  }

  componentDidMount() {
    console.log(this.props)
    const { match: { params } } = this.props;
    this.state.playlistId = params.playlistId;
    fetch(`${this.backendAddress}/getPartyInfo/${this.state.playlistId}`)
      .then(response => {
        return response.json();
      })
      .then(response => {
        this.setState({
          users: response.members,
          playlistID: response.playlistId,
          playlistName: response.playlistName
        });
      });
    console.log(this.state);
  }

  callUpdate = () => {
    fetch(this.backendAddress + "/updatePlaylist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).then(res => {
      this.refreshPage();
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
                  <Player playlistID={this.state.playlistId} />
                </div>
              </Col>
              <Col xs={5}>
                <div className="membersPanel">
                  <h1 style={{ marginBottom: "10px" }}>{this.state.playlistName}</h1>
                  <Members users={this.state.users} />
                  <br></br>
                  {/* Temporarily removed update functionality while migrating to database */}
                  {/* <Button id="update" onClick={this.callUpdate}>
                    Update
                  </Button> */}
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
