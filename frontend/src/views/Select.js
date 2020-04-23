import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Squares from '../components/squares';
import Button from "react-bootstrap/Button";
import config from '../constants';
import enforceLogin from '../components/enforceLogin';
import LoginModal from '../components/loginModal';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'

// Replaces old host page

class Select extends Component {
    backendAddress = config.backendAddress;

    constructor() {
        super();
        this.state = {
            name: "",
            spotifyId: "",
            parties: [],
            playlistName: "",
            duration: "",
            playlistId: "",
            loggedIn: false,
            genres: []
            // {
            //     pop: false,
            //     hip_hop: false,
            //     rap: false,
            //     country: false,
            //     rnb: false,
            //     rock: false,
            //     edm: false,
            //     classical: false
            // }
        }
    }

    loadSelectPage() {
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
                console.log(err);
                this.props.history.push("/error", {
                    code: 4
                });
            });
    }

    componentDidMount() {
        console.log('Component mounted');
        enforceLogin("select")
            .then(loggedInBool => {
                this.setState({
                    loggedIn: loggedInBool
                })
                if (this.state.loggedIn) {
                    this.loadSelectPage();
                }
            })
            .catch(err => {
                console.log('Could not verify login');
                this.props.history.push("/error", {
                    code: 2
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

    handleGenres = event => {
        var id = event.target.id;
        var checked = event.target.checked;
        console.log(checked)
        // state.genres.filter(function (value) { return (value !== id) })
        function checkVal(value) {
            return (value != id)
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
                duration: this.state.duration
            })
        })
            .then(res => { return res.json(); })
            .then(res => {
                this.props.history.push(`/party/${res.playlistId}`);
            })
            .catch(err => {
                console.log(err);
                this.props.history.push("/error", {
                    code: 5
                });
            })
    }

    // value = { this.state.genres }
    // onChange = { this.handleChange }

    render() {
        var checkboxes = [["pop", "hip hop"], ["rap", "country"], ["r&b", "rock"], ["edm", "classical"]].map(row => (
            <Form.Row style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
                <Form.Group as={Col}>
                    <Form.Check
                        // checked={this.state.genres.includes(row[0])}
                        type="checkbox"
                        id={row[0]}
                        label={row[0]}
                        onChange={this.handleGenres}
                    />
                </Form.Group>
                <Form.Group as={Col} >
                    <Form.Check style={{ display: 'inline' }}
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
        var selectPage = (<div>
            <div className="square-container">
                <Squares />
                <div className="content-container">

                    <div id="create">
                        <h1>Welcome, {this.state.name}</h1>
                        <h2>What do you want to hear?</h2>
                        <div style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
                            <Form onSubmit={this.newParty}>
                                {checkboxes}


                                {/* <input
                                name="genres"
                                type="text"
                                value={this.state.genres}
                                onChange={this.handleChange}
                                placeholder="genre1/genre2/genre3"
                            /> */}
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
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )

        if (!this.state.loggedIn) {
            return (
                <div> {selectPage}
                    < div > <LoginModal redirect="select" currentPage="select" /></div >
                </div >
            )
        }
        else {
            return (
                <div>{selectPage}</div>
            );
        }
    }

}

export default withRouter(Select);