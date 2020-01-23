import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import './Styles.css';

class Create extends React.Component {
    serverAddress = "http://localhost:3000"

    constructor(){
        super()
        this.state = {
            pop: false,
            rap: false,
            rock: false,
            hip_hop: false, 
            playlistURI: "Null"
        }
    }

    componentDidMount(){
        fetch(this.serverAddress + "/login")
        .then(res => res.json())
        .then((data) => {
        console.log(data)
          this.setState({ playlistURI: data.URI })
        })
        // .catch(console.log)
    }

    changeHandler = event => {
        const id = event.target.id
        const isChecked = event.target.checked
        this.setState({
            [id]: isChecked
        })
        // alert("Pop is " + this.state.pop + ", rap is " + this.state.rap)
    }

    createPlaylist = event => {}

    render() {
        return (
            <div className="App">
                <div className="Create">
                    <Container>
                        <Row>
                            <Col></Col>
                            <Col xs={6}>
                                <div className="Header">
                                    Welcome {this.props.user}!
                                </div>
                                <div className="Subtitle">
                                    Choose the genres you would like to include:
                                </div>
                            </Col>
                            <Col></Col>
                        </Row>
                        <Row>
                            <Col></Col>
                            <Col xs={4}>
                                <div className="Form">
                                    <Form>
                                        <Row>
                                            <Col>
                                                <div className="Checkbox">
                                                    <Form.Check
                                                        custom
                                                        type="checkbox"
                                                        id="pop"
                                                        label="pop"
                                                        checked = {this.state.pop}
                                                        onChange = {this.changeHandler}
                                                    />

                                                    <Form.Check
                                                        custom
                                                        type="checkbox"
                                                        id="rap"
                                                        label="rap"
                                                        checked = {this.state.rap}
                                                        onChange = {this.changeHandler}
                                                    />
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className="Checkbox">
                                                    <Form.Check
                                                        custom
                                                        type="checkbox"
                                                        id="rock"
                                                        label="rock"
                                                        checked = {this.state.rock}
                                                        onChange = {this.changeHandler}
                                                    />
                                                </div>

                                                <div className="mb-3">
                                                    <Form.Check
                                                        custom
                                                        type="checkbox"
                                                        id="hip_hop"
                                                        label="hip hop"
                                                        checked = {this.state.hip_hop}
                                                        onChange = {this.changeHandler}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                            </Col>
                            <Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="Playlist">
                                Playlist URI: {this.state.playlistURI}
                            </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col> 
                            <Button variant="primary" onClick = {this.createPlaylist}> Create! </Button>
                            </Col>

                        </Row>
                    </Container>
                </div>
            </div>
        )
    }
}

export default Create;