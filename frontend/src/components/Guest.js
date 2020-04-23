import React, { Component } from "react";
import Squares from './squares';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Player from "./player";
import Members from "./members";
import config from "../constants.js";


import "../views/Styles.css";

class Guest extends React.Component {
    state = {};

    backendAddress = config.backendAddress;

    constructor(props) {
        super(props);
        console.log("Props are: ", this.props)

        // INFO IS INHERITED FROM PARTY.JS THROUGH PROPS
    }

    refreshPage() {
        window.location.reload(true);
    }

    componentDidMount() {
        console.log("State is: ", this.state);
    }

    render() {
        return (
            <div class="host">
                <div className="square-container">
                    <Squares />
                    <div className="content-container">
                        <Row>
                            <Col xs={7}>
                                <div className="playerPanel">
                                    <Player playlistID={this.props.playlistID} />
                                </div>
                            </Col>
                            <Col xs={5}>
                                <div className="membersPanel">
                                    <h1 style={{ marginBottom: "10px" }}>{this.props.playlistName}</h1>
                                    <Members users={this.props.users} />
                                    <br></br>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}

export default Guest;
