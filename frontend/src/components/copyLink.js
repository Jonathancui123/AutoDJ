import React, { Component } from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import InputGroup from 'react-bootstrap/InputGroup'
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";



class CopyLink extends Component {
    state = {
        copied: false,
    };
    render() {
        return (
            <div>
                <InputGroup className="mb-3">
                    <FormControl
                        plaintext readOnly defaultValue={this.props.link}
                    />
                    <InputGroup.Append>
                        <CopyToClipboard text={this.props.link}
                            onCopy={() => this.setState({ copied: true })}>
                            <Button>Copy</Button>
                        </CopyToClipboard>
                    </InputGroup.Append>
                </InputGroup>
            </div>
        )

    }
}

export default CopyLink;