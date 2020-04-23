import React, { Component } from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import config from "../constants.js";



class LoginModal extends Component {
    // alert("HELLO!!!")
    constructor(props) {
        super(props);
        console.log("Props are: ", this.props)
        this.state = { backendAddress: config.backendAddress }
    }
    title = {
        select: "Log in with Spotify to proceed",
        party: "You're invited to an AutoDJ party!"
    }
    body = {
        select: "AutoDJ will create your playlist on your account using Spotify's information about your musical tastes",
        party: "Log in with Spotify for your musical tastes to be reflected in the playlist"
    }

    render() {
        return (
            <div>
                <Modal
                    // {...this.props}
                    show={true} onHide={() => { }} redirect={"select"}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {this.title[this.props.currentPage]}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            {this.body[this.props.currentPage]}
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => { window.location.href = `${this.state.backendAddress}/login?redirect=${this.props.redirect}` }}>
                            Login with Spotify</Button>
                    </Modal.Footer>
                </Modal >
            </div>

        );
    }
}

export default LoginModal;
