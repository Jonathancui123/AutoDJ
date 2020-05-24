import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Host from "../components/Host";
import Guest from "../components/Guest";
import config from "../constants.js";
import { Redirect } from "react-router-dom";
import enforceLogin from '../components/enforceLogin';
import LoginModal from '../components/loginModal';
import io from 'socket.io-client';


class Party extends Component {
  state = {};

  backendAddress = config.backendAddress;
  frontendAddress = config.frontendAddress;

  constructor(props) {
    super(props);
    this.state = {
      isHost: false,
      users: [],
      playlistID: "",
      playlistName: "",
      playlistDuration: null,
      loggedIn: false,
      renderMobile: window.innerWidth < 768,
    };

    const { match: { params } } = this.props;
    this.state.playlistID = params.playlistID;
    this.redirectString = `party/${this.state.playlistID}`;
    this.handleResize = this.handleResize.bind(this);

    const socket = io(`${this.backendAddress}?playlistID=${params.playlistID}`);
    socket.on('updatedPlaylist', () => { this.props.history.push(`/party/${this.state.playlistID}`); this.refreshPage(); console.log("RECEIVED SOCKET UPDATE") })
  }

  refreshPage() {
    window.location.reload(true);
  }

  handleResize() {
    this.setState({ renderMobile: (window.innerWidth < 768) });
  }

  async loadPartyPage() {
    // Below assumes that the user is logged in
    console.log("Sending request to: " + `${this.backendAddress}/isPartyHost/${this.state.playlistID}`)
    await fetch(`${this.backendAddress}/isPartyHost/${this.state.playlistID}`, {
      method: "GET",
      credentials: "include"
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        if (!response.isHost) {
          fetch(`${this.backendAddress}/joinParty/${this.state.playlistID}`, {
            method: "POST",
            credentials: "include"
          });
        }
        this.setState({
          isHost: response.isHost,
          users: response.members,
          playlistName: response.playlistName,
          playlistDuration: response.playlistDuration
        });
        console.log(this.state);
      })
      .catch(() => {
        console.log("Failed to enter party");
        this.props.history.push("/error", {
          code: 3
        });
      })
  }


  componentDidMount() {
    enforceLogin(`party/${this.state.playlistID}`)
      .then(loggedInBool => {
        this.setState({
          loggedIn: loggedInBool
        })
        if (loggedInBool) {
          this.loadPartyPage();
        }
      })
      .catch(err => {
        console.log('Could not verify login');
        this.props.history.push("/error", {
          code: 2
        });
      });
    window.addEventListener('resize', this.handleResize);

  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }


  render() {
    if (!this.state.loggedIn) {
      // alert('User not logged in!');
      return (
        <div> <Guest
          shareLink={this.frontendAddress + "/party/" + this.state.playlistID}
          users={this.state.users}
          playlistID={this.state.playlistID}
          playlistName={this.state.playlistName}
          playlistDuration={this.state.playlistDuration}
          renderMobile={this.state.renderMobile}
        />
          <div><LoginModal redirect={this.redirectString} currentPage="party" /></div></div>

      )
    } else if (this.state.isHost) {
      return (<Host
        shareLink={this.frontendAddress + "/party/" + this.state.playlistID}
        users={this.state.users}
        playlistID={this.state.playlistID}
        playlistName={this.state.playlistName}
        playlistDuration={this.state.playlistDuration}
        renderMobile={this.state.renderMobile}
      />);
    } else {
      return (
        <Guest
          shareLink={this.frontendAddress + "/party/" + this.state.playlistID}
          users={this.state.users}
          playlistID={this.state.playlistID}
          playlistName={this.state.playlistName}
          playlistDuration={this.state.playlistDuration}
          renderMobile={this.state.renderMobile}
        />
      )
    }


  }
}

export default withRouter(Party);