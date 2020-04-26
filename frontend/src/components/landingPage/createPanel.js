import React, { Component } from 'react';
import config from '../../constants';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "../../views/Styles.css";

class CreatePanel extends Component {
    state = {}

    constructor() {
        super();
    }

    render() {
        return (<div className="panel">
            <h2>Host a Party</h2>
            <p style={{ marginBottom: "30px" }}>Gather your friends and load up the jukebox. It's party time.</p>
            <Button className="createButton" href={`${config.backendAddress}/login`}>Create a Playlist</Button>
        </div >);
    }
}

export default CreatePanel;