import React, { Component } from "react";

class Player extends Component {
  state = {};
  render() {
    return (
      <iframe
        src={"https://open.spotify.com/embed/playlist/" + this.props.playlistID}
        width="100%"
        height="100%"
        frameborder="0"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>
    );
  }
}

export default Player;
