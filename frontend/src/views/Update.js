import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Squares from '../components/squares';
import LoginModal from '../components/loginModal';

import config from '../constants';
import enforceLogin from '../components/enforceLogin';
import PlaylistOptions from '../components/playlistOptions';

// Replaces old host page

class Update extends Component {
    backendAddress = config.backendAddress;

    constructor(props) {
        super(props);
        this.state = {
            name: "<placeholder>",
            isHost: true,
            spotifyId: "",
            parties: [],
            // playlistId: "",
            loggedIn: true
        }
        this.redirectFunction = this.redirectFunction.bind(this);

        const { match: { params } } = this.props;
        this.state.playlistID = params.playlistID;
    }

    redirectFunction(url) {
        this.props.history.push(url);
    }

    loadUpdatePage() {

        fetch(`${this.backendAddress}/isPartyHost/${this.state.playlistID}`, {
            method: "GET",
            credentials: "include"
        })
            .then(res => {
                return res.json();
            })
            .then(res => {
                console.log("isPartyHost: ", res);
                if (!res.isHost) {
                    this.props.history.push(`/party/${this.props.playlistID}`)
                }
                this.setState({
                    isHost: res.isHost,
                    playlistName: res.playlistName,
                    playlistDuration: res.playlistDuration
                })
            })
            .catch(err => {
                console.log("ERROR: User may have deleted playlist");
                this.props.history.push("/error", {
                    code: 1
                });
            });
        // TODO: MAKE ERROR PAGE

        fetch(`${this.backendAddress}/getUserInfo`, {
            method: "GET",
            credentials: "include"
        })
            .then(res => {
                return res.json();
            })
            .then(res => {
                console.log("GetUserInfo: ", res);
                this.setState({
                    name: res.name,
                    spotifyId: res.spotifyId,
                    parties: res.parties
                });
            })
            .catch(err => {
                console.log(err)
                this.props.history.push("/error", {
                    code: 4
                });
            });

    }

    componentDidMount() {
        console.log('Update Component mounted');
        console.log('componentDidMount playlistID in state: ', this.state.playlistID);
        enforceLogin("update")
            .then(loggedInBool => {
                this.setState({
                    loggedIn: loggedInBool
                })
                if (loggedInBool) {
                    this.loadUpdatePage();
                }
            })


            .catch(err => {
                console.log('Could not verify login');
                this.props.history.push("/error", {
                    code: 2
                });
            });

    }

    render() {
        console.log("Current playlistID from state: ", this.state.playlistID);
        console.log("Current playlistName from state: ", this.state.playlistName);
        if (!this.state.loggedIn) {

            // alert('User not logged in!');
            return (

                <div><LoginModal redirect={this.redirectString} currentPage="party" /></div>

            )
        }
        else {
            return (

                <div>
                    <div className="square-container">
                        <Squares />
                        <div className="content-container">

                            <div className="playlistOptionsPage" >
                                <PlaylistOptions 
                                title={"Update Playlist: " + this.state.playlistName} 
                                redirectFunction={this.redirectFunction} 
                                playlistID={this.state.playlistID} 
                                playlistName={this.state.playlistName}
                                onSubmit="updatePlaylist" />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default withRouter(Update);