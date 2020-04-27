import React, { Component } from 'react';
import "../../views/Styles.css";
import step1 from "../../images/step1.png";
import step2 from "../../images/step2.png";
import step3 from "../../images/step3.png";

class Step extends Component {
    state = {}
    render() {
        const source = this.props.picture;
        var picture;
        switch (source) {
            case "step1":
                picture = <img src={step1} className="stepPicture" />;
                break;
            case "step2":
                picture = <img src={step2} className="stepPicture" />;
                break;
            case "step3":
                picture = <img src={step3} className="stepPicture" />;
                break;
        }

        // style={{ height: "200px", width: "200px" }}
        return (<div style={{
            borderColor: "white",
            borderWidth: "5px",
            textAlign: "center",
            display: "inline-block",
            height: "300px",
            width: "280px",
            margin: "50px",
            marginTop: "15vh"
        }}>
            {picture}
            <h3 style={{ marginBottom: "10px" }}>{this.props.number}. {this.props.title}</h3>
            <p style={{ display: "inline-block" }}>{this.props.content}</p>
        </div>);
    }
}

export default Step;