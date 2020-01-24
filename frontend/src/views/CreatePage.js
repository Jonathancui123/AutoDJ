import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./styles.css";

class Create extends React.Component {
  serverAddress = "http://localhost:3000";

  constructor() {
    super();
    this.state = {
      genres: [],
      playlistURI: "Null"
    };
  }

  componentDidMount() {
    fetch(this.serverAddress + "/login")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({ playlistURI: data.URI });
      });
    // .catch(console.log)
  }

  changeHandler = event => {
    const id = event.target.id;
    const isChecked = event.target.checked;
    this.setState({
      [id]: isChecked
    });
    // alert("Pop is " + this.state.pop + ", rap is " + this.state.rap)
  };

  createPlaylist = event => {
    fetch("http://localhost:3000/createPlaylist")
      .then(res => res.json())
      .then(body => {
        this.setState({
          playlistURI: body.playlistURI
        });
      });
  };

  render() {
    return (
      <div id="create">
        <h1>What do you want to hear?</h1>
        <form action={this.createPlaylist}>
          <input name="genres" type="text" />
          <br></br>
          <Button className="cssbutton" type="submit">
            Go!
          </Button>
        </form>
      </div>
    );
  }
}

export default Create;
