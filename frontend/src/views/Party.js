import React, { Component } from 'react';
import Host from "./Host";
import Guest from "./Guest";
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

        this.handleUpdate = this.handleUpdate.bind(this)
      }
    
      refreshPage() {
        window.location.reload(true);
      }
    
      componentDidMount() {
        // Check if the user is logged in here

        // Below assumes that the user is logged in
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


    handleUpdate(){
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
        if (this.state.isHost){
            return ( <Host 
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