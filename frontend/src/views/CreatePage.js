import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./Styles.css";

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
    alert("called create playlist");
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

      <div className="square-container">
        <div className="squares square1" />
        <div className="squares square2" />
        <div className="squares square3" />
        <div className="squares square4" />
        <div className="squares square5" />
        <div className="squares square6" />
        <div className="squares square7" />
        {/* <Logo className="logo" /> */}
        <div className="content-container">


          <div id="create">
            <h1>What do you want to hear?</h1>
            <form onSubmit={this.createPlaylist} >
              <input name="genres" type="text" placeholder="genres" />
              <br></br>
              <input name="playlist" type="text" placeholder="playlist" />
              <br></br>
              <Button className="cssbutton" type="submit">
                Go!
            </Button>
            </form>
          </div>
        </div>
      </div>


    );
  }
}

export default Create;
