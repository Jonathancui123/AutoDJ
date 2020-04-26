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
        let player, members;
        if (this.props.playlistID) {
            player = <div className="playerPanel">
                <Player playlistID={this.props.playlistID} />
            </div>;
        } else {
            player = "";
        }

        if (this.props.users && this.props.playlistName) {
            members = <div className="membersPanel">
                <h1 style={{ marginBottom: "10px" }}>{this.props.playlistName}</h1>
                <Members users={this.props.users} />
                <br></br>
            </div>
        } else {
            members = "";
        }


        return (
            <div className="host">
                <div className="square-container">
                    <Squares />
                    <div className="content-container">
                        <Row className="partyPage">
                            <Col xs={7}>
                                {player}
                            </Col>
                            <Col xs={5} className="rightPanel">
                                {members}
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}

export default Guest;
