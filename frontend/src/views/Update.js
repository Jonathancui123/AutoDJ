import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Squares from '../components/squares';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import config from '../constants';
import enforceLogin from '../components/enforceLogin';
import PlaylistOptions from '../components/playlistOptions';

import loginModal from '../components/loginModal';

// Replaces old host page

class Update extends Component {
    backendAddress = config.backendAddress;

    constructor(props) {
        super(props);
        this.state = {
            name: "<placeholder>",
            spotifyId: "",
            parties: [],
            // playlistId: "",
            loggedIn: true

        }
        this.redirectFunction = this.redirectFunction.bind(this);

    }

    redirectFunction(url) {
        this.props.history.push(url);
    }


    componentDidMount() {
        console.log('Component mounted');
        enforceLogin("update")
            .then(loggedInBool => {

                this.setState({
                    loggedIn: loggedInBool
                })
            })
            .catch(err => {
                console.log('Could not verify login');
                this.props.history.push("/error", {
                    code: 2
                });
            });

        fetch(`${this.backendAddress}/getPartyInfo/${this.props.location.state.playlistId}`, {
            method: "GET",
            credentials: "include"
        })
            .then(res => {
                return res.json();
            })
            .then(res => {
                console.log(res);
                this.setState({
                    genres: res.genres,
                    playlistName: res.playlistName,
                    duration: res.duration / 60000
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
                console.log(res);
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

    handleChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value,
        });
    };

    updatePlaylist = event => {
        event.preventDefault();
        fetch(`${this.backendAddress}/updatePlaylist`, {
            headers: { "Content-Type": "application/json" },
            method: "PUT",
            credentials: "include",
            body: JSON.stringify({
                genres: this.state.genres,
                playlistName: this.state.playlistName,
                duration: this.state.duration,
                playlistId: this.props.location.state.playlistId
            })
        })
            .then(res => { return res.json(); })
            .then(res => {
                this.props.history.push(`/party/${this.props.location.state.playlistId}`);
            })
            .catch(err => {
                console.log(err);
                this.props.history.push("/error", {
                    code: 1
                });
            })
    }

    render() {

        return (

            <div>
                <div className="square-container">
                    <Squares />
                    <div className="content-container">

                        <div id="updateBlock">
                            <h1>Update Playlist: {this.state.playlistName}</h1>
                            <PlaylistOptions redirectFunction={this.redirectFunction} />
                        </div>
                    </div>
                </div>
            </div>



        );
    }
}

export default withRouter(Update);