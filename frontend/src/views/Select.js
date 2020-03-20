import React, { Component } from 'react';
import Squares from '../components/squares';
import Button from "react-bootstrap/Button";
import config from '../constants';

// Replaces old host page

class Select extends Component {
    backendAddress = config.backendAddress;

    constructor() {
        super();
        this.state = {
            name: "<placeholder>",
            spotifyId: "",
            parties: [],
            genres: "",
            playlistName: "",
            duration: ""
        }
    }

    componentDidMount() {
        console.log('Component mounted');
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
            .catch(err => console.log(err));
    }

    handleChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value,
        });
    };

    newParty = event => {
        event.preventDefault();
        fetch(`${this.backendAddress}/newParty`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                genres: this.state.genres,
                playlistName: this.state.playlistName,
                duration: this.state.duration
            })
        })
            .then(res => { return res.json(); })
            .then(res => {
                this.props.history.push(`/party/${res.playlistId}`);
            });
    }

    render() {
        return (
            <div>
                <div className="square-container">
                    <Squares />
                    <div className="content-container">
                        <div id="create">
                            <h1>Welcome, {this.state.name}</h1>
                            <h2>What do you want to hear?</h2>
                            <form onSubmit={this.newParty}>
                                <input
                                    name="genres"
                                    type="text"
                                    value={this.state.genres}
                                    onChange={this.handleChange}
                                    placeholder="genre1/genre2/genre3"
                                />
                                <br></br>
                                <input
                                    name="playlistName"
                                    type="text"
                                    value={this.state.playlistName}
                                    onChange={this.handleChange}
                                    placeholder="playlist name"
                                />
                                <br></br>
                                <input
                                    name="duration"
                                    type="text"
                                    value={this.state.duration}
                                    onChange={this.handleChange}
                                    placeholder="playlist duration (min)"
                                />
                                <br></br>
                                <Button className="cssbutton" type="submit">
                                    Go!
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Select;