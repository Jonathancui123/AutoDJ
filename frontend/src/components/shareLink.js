import React, { Component } from "react";
import InputGroup from 'react-bootstrap/InputGroup'
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";

import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import notif from "../images/purple-circle-png.png"

class ShareLink extends Component {

    renderTooltip = (props) => {
        return (
            <Tooltip id="button-tooltip" {...props}>
                Guests' favorite songs will show up once they join!
            </Tooltip>
        );
    }

    render() {
        return (
            <div>
                <OverlayTrigger
                    placement="top"
                    flip={true}
                    overlay={this.renderTooltip}
                >
                    <div id="copy-label-div">
                        <label id="copyLabel">Share your party invite link:</label>
                    </div>
                </OverlayTrigger>
                <img src={notif} id="notif-circle" />
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