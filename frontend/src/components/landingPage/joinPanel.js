import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import config from '../../constants';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "../../views/Styles.css";

class JoinPanel extends Component {
    state = {}

    constructor(props) {
        super(props);
        this.state = {
            link: ""
        }
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleInputChange = event => {
        this.setState({
            link: event.target.value
        });
    }

    handleKeyPress(target) {
        if (target.charCode == 13) {
            var link = this.state.link.split("/party")[1];
            this.props.history.push(`party${link}`);
        }
    }

    render() {
        return (<div className="panel">
            <h2>Join a Party</h2>
            <p style={{ marginBottom: "13%" }}>Share your music with the crowd! Paste the party link below and press ENTER to begin:</p>
            <input
                name="link"
                type="text"
                class="joinLink"
                value={this.state.link}
                onChange={this.handleInputChange}
                onKeyPress={this.handleKeyPress}
            />
        </div >);
    }
}

export default withRouter(JoinPanel);