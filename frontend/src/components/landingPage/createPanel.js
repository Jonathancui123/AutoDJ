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
            <p style={{ marginBottom: "30px" }}> Make a party and invite friends for a curated playlist based on everyone's Spotify profiles!</p>
            <Button className="createButton" href={`${config.backendAddress}/login`}>Get started</Button>
        </div >);
    }
}

export default CreatePanel;