import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';



import './Styles.css';

class Create extends React.Component {
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
                            <Col xs={6}>
                                <div className="Form">
                                    <Form>
                                        <Row>
                                            <Col>
                                                <div className="Checkbox">
                                                    <Form.Check
                                                        custom
                                                        type="checkbox"
                                                        id="id1"
                                                        label="pop"
                                                    />
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className="mb-3">
                                                    <Form.Check
                                                        custom
                                                        type="checkbox"
                                                        id="id2"
                                                        label="rap"
                                                    />
                                                </div>
                                            </Col>
                                        </Row>



                                        <Row>
                                            <Col>
                                                <div className="Checkbox">
                                                    <Form.Check
                                                        custom
                                                        type="checkbox"
                                                        id="id1"
                                                        label="rock"
                                                    />
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className="mb-3">
                                                    <Form.Check
                                                        custom
                                                        type="checkbox"
                                                        id="id2"
                                                        label="hip hop"
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
                        <Col> <Button variant="primary" href="/create"> Create! </Button></Col>
                       
                        </Row>
                    </Container>
                </div>
            </div>
        )
    }
}

export default Create;