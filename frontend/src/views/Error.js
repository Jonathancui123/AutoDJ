import React, { Component } from 'react';
import Squares from "../components/squares";
import photo from "../images/error.jpg";

class Error extends Component {
    state = {
        messages: {
            0: "0: Default error",
            1: "1: Playlist was deleted/doesn't exist",
            2: "2: Could not verify login",
            3: "3: Could not join the party",
            4: "4: Could not retrieve user info",
            5: "5: Could not create party"
        },
        code: 0
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("Component mounted");
        this.setState({
            code: this.props.location.state[this.state.code]
        });
    }

    render() {
        return (
            <div class="error">
                <div className="square-container">
                    <Squares />
                    <div className="content-container" style={{ paddingTop: "15vh" }}>
                        <h1>Error!</h1>
                        <h2>{this.state.messages.code}</h2>
                        <img src={photo} alt="gg" />
                    </div>
                </div>
            </div>);
    }
}

export default Error;