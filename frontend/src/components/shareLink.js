import React, { Component } from "react";
import InputGroup from 'react-bootstrap/InputGroup'
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";



class ShareLink extends Component {

    render() {
        return (
            <div>
                <label id="copyLabel">Share your party invite link:</label>
                <InputGroup className="mb-3">
                    <FormControl id="copyField"
                        readOnly defaultValue={this.props.link}
                    />
                    <InputGroup.Append>
                        <Button id="shareButton" className="cssbutton" onClick={
                            navigator.share({
                                title: (this.props.playlistName + " on AutoDJ"),
                                url: this.props.link
                        })}>
                            Share
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
            </div>
        )

    }
}

export default ShareLink;