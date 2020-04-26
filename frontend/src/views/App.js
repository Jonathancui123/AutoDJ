import React from "react";
import Squares from '../components/squares';
import Button from "react-bootstrap/Button";
import "./Styles.css";
import Logo from "../components/logo";
import config from "../constants.js";
import CreatePanel from "../components/landingPage/createPanel";
import JoinPanel from "../components/landingPage/joinPanel";
import Steps from "../components/landingPage/steps";
import Listening from "../components/landingPage/listeningRightNow";
import Footer from "../components/landingPage/footer";

function App() {
  return (
    <div className="app">
      <div className="square-container">
        <Squares />
        <div className="content-container" style={{
          overflowY: "scroll",
          overflowX: "hidden"
        }}>
          <div className="app-header" style={{
            display: "block"
          }}>
            <div className="landingHeader">
              <h1>🎸</h1>
              <h1 style={{
                marginBottom: "30px"
              }}>AutoDJ</h1>
              <div className="panelDiv">       
              <CreatePanel />
              <JoinPanel /></div>

            </div>
            <div style={{
              display: "block"
            }}>
              <Steps />
            </div>
            <div className="albumsAndFooter" style={{
              display: "block"
            }}>
              <Listening />
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
