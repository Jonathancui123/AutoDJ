import React, { Component } from "react";

class NowPlaying extends Component {
  state = {
    songs: [
      {
        title: "gucci gang",
        artist: "gg"
      },
      {
        title: "gangnam style",
        artist: "spy"
      }
    ]
  };
  render() {
    return (
      <div>
        <table></table>
      </div>
    );
  }
}

export default NowPlaying;
