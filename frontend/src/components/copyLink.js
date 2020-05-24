import React, { Component } from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import InputGroup from 'react-bootstrap/InputGroup'
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import notif from "../images/purple-circle-png.png"



class CopyLink extends Component {
    state = {
        copied: false,
    };

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
                    placement="top-end"
                    flip={true}
                    overlay={this.renderTooltip}
                >

                    <label id="copyLabel">Share your party invite link:</label>

                </OverlayTrigger>
                <img src={notif} id="notif-circle" />

                <InputGroup className="mb-3">
                    <FormControl id="copyField"
                        readOnly defaultValue={this.props.link}
                    />
                    <InputGroup.Append>
                        <CopyToClipboard text={this.props.link}
                            onCopy={() => {
                                this.setState({ copied: true })
                                setTimeout(() => {
                                    this.setState({ copied: false })
                                }, 3000)
                            }}>
                            <Button id="copyButton" className="cssbutton">
                                {this.state.copied ? "Copied!" : "Copy"}
                            </Button>
                        </CopyToClipboard>
                    </InputGroup.Append>
                </InputGroup>
            </div>
        )

    }
}

export default CopyLink;