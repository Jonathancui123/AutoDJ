import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Player from "../components/player";
import Members from "../components/members";

import "./Styles.css";

class Host extends React.Component {
  state = {};

  serverAddress = "http://localhost:3000"

  constructor() {
    super();
    this.state = {
      users: [],
      playlistID: "",
      playlistName: "",
      playlistDuration: null
    };
  }

  componentDidMount() {
    fetch(this.serverAddress + "/clientRegisterUser")
    .then(

      fetch("http://localhost:3000/getInfo")
      .then(response => {
        return response.json();
      })
      .then(response => {
        this.setState({
          users: response.users,
          playlistID: response.playlistID,
          playlistName: response.playlistName,
          duration: response.playlistDur
        });
      })

    )
   
  }

  callUpdate = () => {
    alert("FETCHING UPDATE")
    fetch("http://localhost:3000/updatePlaylist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify({
      //   genres: this.state.genres
      // })
    }).then(res => {
      alert("RESPONSE RECEIVED")
      this.props.history.push("/host");
    });
  };

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
                  <Player playlistID={this.state.playlistID} />
                </div>
              </Col>
              <Col xs={5}>
                <div className="membersPanel">
                  <h1>{this.state.playlistName}</h1>
                  <Members users={this.state.users} />
                  <Button id="join" onClick={this.callUpdate}>
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

export default Host;
