import React from "react";
// import logo from "./new_logo.png";
import Button from "react-bootstrap/Button";
import "./Styles.css";
import Logo from "../components/logo";

function App() {
  return (
    <div className="app">
      <div className="square-container">
        <div className="squares square1" />
        <div className="squares square2" />
        <div className="squares square3" />
        <div className="squares square4" />
        <div className="squares square5" />
        <div className="squares square6" />
        <div className="squares square7" />
        <div className="content-container">
          <header className="app-header">
            <Button id="join" href={"http://localhost:3000/login"}>
              Join the party.
            </Button>
          </header>
        </div>
      </div>
    </div>
  );
}

export default App;
