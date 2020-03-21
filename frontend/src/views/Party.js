import React, { Component } from 'react';
import Host from "./Host";
import Guest from "./Guest";
import config from "../constants.js";
import { Redirect } from "react-router-dom";

class Party extends Component {
  state = {};

  backendAddress = config.backendAddress;

  constructor() {
    super();
    this.state = {
      isHost: null,
      users: [],
      playlistId: "",
      playlistName: "",
      playlistDuration: null,
      login: true
    };

    this.handleUpdate = this.handleUpdate.bind(this)
  }

  refreshPage() {
    window.location.reload(true);
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    this.state.playlistId = params.playlistId;

    // Check if the user is logged in here
    fetch(`${this.backendAddress}/checkLogin`, {
      method: "GET",
      credentials: "include"
    }).then(res => {
      return res.json();
    })
      .then(res => {
        console.log(`Response from /checkLogin: ${res}`);
        if (!res) {
          console.log('User not logged in');
          this.setState({
            login: false
          });
          fetch(`${this.backendAddress}/login/${this.state.playlistId}`, {
            method: "GET",
            credentials: "include"
          });
        } else {
          // Below assumes that the user is logged in
          console.log("Sending request to: " + `${this.backendAddress}/isPartyHost/${this.state.playlistId}`)
          fetch(`${this.backendAddress}/isPartyHost/${this.state.playlistId}`, {
            method: "GET",
            credentials: "include"
          })
            .then(response => {
              return response.json();
            })
            .then(response => {
              if (!response.isHost) {
                fetch(`${this.backendAddress}/joinParty/${this.state.playlistId}`, {
                  method: "GET",
                  credentials: "include"
                });
              }
              this.setState({
                isHost: response.isHost,
                users: response.members,
                playlistID: response.playlistId,
                playlistName: response.playlistName,
                playlistDuration: response.playlistDuration
              });
              console.log(this.state);
            });
        }
      }).catch(err => {
        console.log('Could not verify login');
      });


  }


  handleUpdate() {
    //Change backend to handle update requests first

    // fetch(this.backendAddress + "/updatePlaylist", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    // }).then(res => {
    //     this.refreshPage();
    // });
    alert("Party component should send update request to server now")
  }

  render() {
    if (!this.state.login) {
      alert('User not logged in!');
    } else if (this.state.isHost) {
      return (<Host
        users={this.state.users}
        playlistID={this.state.playlistID}
        playlistName={this.state.playlistName}
        playlistDuration={this.state.playlistDuration}
        handleUpdate={this.handleUpdate}
      />);
    } else {
      return (
        <Guest
          users={this.state.users}
          playlistID={this.state.playlistID}
          playlistName={this.state.playlistName}
          playlistDuration={this.state.playlistDuration}
        // handleUpdate={this.handleUpdate}
        />
      )
    }


  }
}

export default Party;