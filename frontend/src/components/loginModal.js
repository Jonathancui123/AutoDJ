import React, { Component } from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import config from "../constants.js";



class loginModal extends Component {
    state = { backendAddress: config.backendAddress }
    // alert("HELLO!!!")
    constructor(props) {
        super(props);
        console.log("Props are: ", this.props)

        // INFO IS INHERITED FROM PARTY.JS THROUGH PROPS
    }


    render() {
        return (
            <Modal
                // {...this.props}
                show={true} onHide={() => { }} redirect={"select"}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Please Login To Continue!
          </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Please Login To Continue!</h4>
                    <p>
                        This feature requires you to be logged in to your Spotify account
          </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { window.location.href = `${this.state.backendAddress}/login?redirect=${this.props.redirect}` }}>
                        Login with Spotify</Button>
                </Modal.Footer>
            </Modal >
        );
    }
}

export default loginModal
