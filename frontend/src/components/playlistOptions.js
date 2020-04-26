import React, { Component } from 'react';
import Button from "react-bootstrap/Button";
import config from '../constants';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'


class PlaylistOptions extends Component {
    backendAddress = config.backendAddress;
    constructor() {
        super();
        this.state = {
            playlistName: "",
            duration: 20,
            genres: [],
            
        }
    }

    handleChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value,
        });
        // console.log(this.state);
    };

    handleGenres = event => {
        var id = event.target.id;
        var checked = event.target.checked;
        // state.genres.filter(function (value) { return (value !== id) })
        function checkVal(value) {
            return (value !== id)
        }
        if (!checked) {
            this.setState((state, props) => {
                return { genres: state.genres.filter(checkVal) };
            })
        } else {
            this.setState((state, props) => {
                return { genres: state.genres.concat([id]) };
            })
        }
    }

    updatePlaylist = event => {
        event.preventDefault();
        console.log(`Sending update request to ${this.backendAddress}/updatePlaylist with the following state (playlistName and playlistID are sent from props):`)
        console.log(this.state);

        fetch(`${this.backendAddress}/updatePlaylist`, {
            headers: { "Content-Type": "application/json" },
            method: "PUT",
            credentials: "include",
            body: JSON.stringify({
                genres: this.state.genres,
                playlistName: this.props.playlistName,
                duration: this.state.duration,
                playlistId: this.props.playlistID
            })
        })
            .then(res => { return res.json(); })
            .then(res => {
                this.props.redirectFunction(`/party/${this.props.playlistID}`);
            })
            .catch(err => {
                console.log(err);
                this.props.redirectFunction("/error", {
                    code: 1
                });
            })
    }


    newParty = event => {
        
        console.log("state at submission: ", this.state)
        event.preventDefault();
        fetch(`${this.backendAddress}/newParty`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                genres: this.state.genres,
                playlistName: this.state.playlistName,
                duration: this.state.duration,
                
            })
        })
            .then(res => { return res.json(); })
            .then(res => {
                this.props.redirectFunction(`/party/${res.playlistId}`);
            })
            .catch(err => {
                console.log(err);
                this.props.redirectFunction("/error", {
                    code: 5
                });
            })
    }

    submitBehaviors = {
        newParty: this.newParty,
        updatePlaylist: this.updatePlaylist
    }

    render() {
        var checkboxes = [["pop", "hip hop"], ["rap", "country"], ["r&b", "rock"], ["edm", "classical"]].map(row => (
            <Form.Row style={{ marginLeft: 'auto', marginRight: 'auto' }} key={row[0]}>

                <Form.Group as={Col} style={{ textAlign: 'left' }} >
                    <Form.Check custom
                        // checked={this.state.genres.includes(row[0])}
                        type="checkbox"
                        id={row[0]}
                        label={row[0]}
                        onChange={this.handleGenres}
                    />
                </Form.Group>
                <Form.Group as={Col} style={{ textAlign: 'left' }}>
                    <Form.Check custom
                        // checked={this.state.genres.includes(row[1])}
                        inline={true}
                        type="checkbox"
                        id={row[1]}
                        label={row[1]}
                        onChange={this.handleGenres}
                    />
                </Form.Group>

            </Form.Row>
        ))

        return (
            <Container className="noPaddingContainer" fluid>
                <Row className="formRow">
                    <Col className="formCol"></Col>
                    <Col className="formContent">

                        <h3>{this.props.title}</h3>
                        <Form onSubmit={this.submitBehaviors[this.props.onSubmit]}>
                            <input
                                style={{ display: this.props.allowName ? "inline" : "none", width: "100%" }}
                                name="playlistName"
                                type="text"
                                value={this.state.playlistName}
                                onChange={this.handleChange}
                                placeholder="Playlist Name"
                            />
                            <div style={{ paddingTop: "15px" }}>
                                <h4 style={{ marginBottom: "10px" }}>Select genres to include:</h4>
                                <Row>
                                    <Col md={2}></Col>
                                    <Col md={10}>{checkboxes}</Col>

                                </Row>
                            </div>
                            <div>
                                <h4 style={{ marginBottom: "10px" }}>Playlist duration (mins):</h4>
                                <Row>
                                    <Col xs={8} md={10} style={{ paddingTop: "0.5em" }}>
                                        <Form.Control name="duration" type="range" min="3" max="100" value={this.state.duration} onChange={this.handleChange} custom />
                                    </Col>
                                    <Col xs={4} md={2}>
                                        <Form.Control name="duration" type="number" min="3" max="100" value={this.state.duration} onChange={this.handleChange}></Form.Control >
                                    </Col>
                                </Row>
                            </div>
                            <Button className="cssbutton" type="submit">
                                Go!
                            </Button>
                        </Form>
                        {/* </div> */}
                    </Col>
                    <Col className="formCol"></Col>
                </Row>
            </Container>
        )
    }


}

export default PlaylistOptions;