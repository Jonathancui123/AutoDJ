import React, { Component } from 'react';
import "../../views/Styles.css";
import Step from "./step";

class Steps extends Component {
    state = {
        steps: [
            {
                number: "1",
                title: "Connect your Spotify account",
                content: "Log into Spotify to let us analyze your tastes and make a new playlist. Your information and existing playlists will be left alone.",
                picture: "step1"
            },
            {
                number: "2",
                title: "Select what you want to hear",
                content: "Choose from Spotify's most popular genres and give your playlist a title and duration.",
                picture: "step2"
            },
            {
                number: "3",
                title: "Start vibing 😎",
                content: "Invite your friends and watch their top tracks pop up in your playlist. Play the playlist on AutoDJ or in your Spotify app",
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
        return (<div id="steps">
            {steps}
        </div>);
    }
}

export default Steps;