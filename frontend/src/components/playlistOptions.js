import React, { Component } from 'react';
import Button from "react-bootstrap/Button";
import config from '../constants';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

class PlaylistOptions extends Component {
    backendAddress = config.backendAddress;
    constructor() {
        super();
        this.state = {
            playlistName: "",
            duration: 20,
            genres: [],
            others: ""
        }
    }

    handleChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value,
        });
        console.log(this.state);
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
        setTimeout(() => {
            console.log(this.state.genres);
        }, 500);

    }

    newParty = event => {
        event.preventDefault();
        fetch(`${this.backendAddress}/newParty`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                genres: this.state.genres,
                playlistName: this.state.playlistName,
                duration: this.state.duration,
                others: this.state.others
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

    render() {
        var checkboxes = [["pop", "hip hop"], ["rap", "country"], ["r&b", "rock"], ["edm", "classical"]].map(row => (
            <Form.Row style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }} key={row[0]}>
                <Form.Group as={Col} style={{ textAlign: 'left' }}>
                    <Form.Check
                        // checked={this.state.genres.includes(row[0])}
                        type="checkbox"
                        id={row[0]}
                        label={row[0]}
                        onChange={this.handleGenres}
                    />
                </Form.Group>
                <Form.Group as={Col} style={{ textAlign: 'left' }}>
                    <Form.Check
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
            <div style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
                <Form onSubmit={this.newParty}>
                    <br></br>
                    <input
                        style={{ display: this.props.allowName ? "inline" : "none" }}
                        name="playlistName"
                        type="text"
                        value={this.state.playlistName}
                        onChange={this.handleChange}
                        placeholder="playlist name"
                    />
                    <br></br>
                    <h2>Select genres:</h2>
                    {checkboxes}
                    <input
                        name="others"
                        type="text"
                        value={this.state.others}
                        onChange={this.handleChange}
                        placeholder="k-pop, indie, yodeling"
                    />
                    <br></br>
                    <Form.Label>playlist duration (mins)</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Group controlId="formBasicRangeCustom">
                            <Form.Control name="duration" type="range" min="3" max="100" value={this.state.duration} onChange={this.handleChange} custom />
                        </Form.Group>
                        <InputGroup.Append>
                            <Form.Control name="duration" type="number" min="3" max="100" value={this.state.duration} onChange={this.handleChange}></Form.Control >
                        </InputGroup.Append>
                    </InputGroup>
                    <Button className="cssbutton" type="submit">
                        Go!
                            </Button>
                </Form>
            </div>
        )
    }


}

export default PlaylistOptions;