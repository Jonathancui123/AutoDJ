import React, { Component } from 'react';

class Footer extends Component {
    state = {}
    render() {
        return (<div id="footer">
            <h6 style={{ marginBottom: "18px" }}>___________</h6>
            <h6>Built by Jonathan Cui and Oustan Ding using NodeJS/Express, ReactJS, MongoDB and Spotify API. 🥳🥳</h6>
        </div>);
    }
}

export default Footer;