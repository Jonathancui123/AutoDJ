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
            <div style={{
              display: "block",
              height: "100%",
              paddingTop: "10%"
            }}>
              <h1>🎸</h1>
              <h1 style={{
                marginBottom: "30px"
              }}>AutoDJ</h1>
              <CreatePanel />
              <JoinPanel />
            </div>
            <div style={{
              display: "block"
            }}>
              <Steps />
            </div>
            <div style={{
              display: "block"
            }}>
              <Listening />
            </div>
            <div style={{
              display: "block"
            }}>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
