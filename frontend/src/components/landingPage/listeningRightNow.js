import React, { Component } from 'react';
import Album from "./album";
import "../../views/Styles.css";
import config from "../../constants";

class ListeningRightNow extends Component {
    state = {}

    constructor() {
        super()
        this.state = {
            albums: [],
            users: 0,
            parties: 0
        }
    }

    componentDidMount() {
        fetch(`${config.backendAddress}/getPopularAlbums`)
            .then(res => {
                return res.json();
            })
            .then(res => {
                this.setState({
                    albums: res
                })
            })
            .catch(err => console.log("Could not retrieve popular albums"));
        fetch(`${config.backendAddress}/getCurrentStats`)
            .then(res => {
                return res.json()
            })
            .then(res => {
                this.setState({
                    users: res.users,
                    parties: res.parties
                });
            })
            .catch(err => console.log("Could not retrieve current stats"));
    }

    render() {
        var i = 1;
        var albums = this.state.albums.map((album, index) =>
            <Album info={album} place={index + 1} />
        )
        return (
            <div id="listeningRightNow">
                <h1 style={{ fontSize: "3.5em" }}>Top albums right now</h1>
                <h3>(With {this.state.users} users listening in {this.state.parties} parties)</h3>
                <div id="listeningRightNowAlbums">
                    {albums}
                </div>
            </div >


        );
    }
}

export default ListeningRightNow;