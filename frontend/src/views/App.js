import React from "react";
import Squares from '../components/squares';
import Button from "react-bootstrap/Button";
import "./Styles.css";
import Logo from "../components/logo";
import config from "../constants.js";

function App() {
  return (
    <div className="app">
      <div className="square-container">
        <Squares />
        <div className="content-container">
          <header className="app-header">
            {/* <Button id="join" href={config.backendAddress + "/login"}>
              Join the party.
            </Button> */}
            <Button className="bigWhiteButton" href={config.backendAddress + "/login"}>
              Join the party.
            </Button>

          </header>

        </div>
      </div>
    </div>
  );
}

export default App;
