import React from "react";
// import logo from "./new_logo.png";
import Button from "react-bootstrap/Button";
import "./styles.css";
import Logo from "../components/logo";

function App() {
  return (
    <div className="app">
      {/* <Logo className="logo" /> */}
      <header className="app-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/*         
        <div className="content-center brand">
            <h1 className="h1-seo">AutoDJ</h1>
            <h3 className="d-none d-sm-block">
            Using spotify profiles to curate a playlist perfect for your party
              </h3>
        </div> */}

        <Button id="join" href={"http://localhost:3000/login"}>
          Join the party.
        </Button>
      </header>
    </div>
  );
}

export default App;
