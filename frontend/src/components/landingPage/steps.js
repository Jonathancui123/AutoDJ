import React, { Component } from 'react';
import "../../views/Styles.css";
import Step from "./step";

class Steps extends Component {
    state = {
        steps: [
            {
                number: "1",
                title: "Connect your Spotify account",
                content: "Import your top tracks by logging into your Spotify account. We don't take any of your personal information.",
                picture: "step1"
            },
            {
                number: "2",
                title: "Select what you want to hear",
                content: "Choose from Spotify's most popular genres or input your own. Give your playlist a title and duration.",
                picture: "step2"
            },
            {
                number: "3",
                title: "He/She do be vibin' tho 😎",
                content: "Play the playlist we build for you, in the web browser or in Spotify. Hit UPDATE when someone new joins or when you want to change it up.",
                picture: "step3"
            }
        ]
    }
    render() {
        var steps = this.state.steps.map((step) =>
            <Step
                number={step.number}
                title={step.title}
                content={step.content}
                picture={step.picture}
            />);
        return (<div style={{
            backgroundColor: "#282c34",
            height: "65vh",
            width: "100vw",
            color: "white",
            paddingTop: "4%"
        }}>
            {steps}
        </div>);
    }
}

export default Steps;