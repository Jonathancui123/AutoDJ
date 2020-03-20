import React, { Component } from 'react';
import Host from "./Host";
import config from "../constants.js";


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
          playlistDuration: null
        };
      }
    
      refreshPage() {
        window.location.reload(true);
      }
    
      componentDidMount() {
        const { match: { params } } = this.props;
        this.state.playlistId = params.playlistId;
        console.log("Sending request to: " + `${this.backendAddress}/isPartyHost/${this.state.playlistId}`)
        fetch(`${this.backendAddress}/isPartyHost/${this.state.playlistId}`, {
            method: "GET",
            credentials: "include"
        })
          .then(response => {
            return response.json();
          })
          .then(response => {
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

    render() { 
        const element = <h1>isHost: {this.state.isHost}</h1>;

        return ( element  );
    }
}
 
export default Party;