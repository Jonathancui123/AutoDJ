import React, { Component } from 'react';
import "../../views/Styles.css";
import { catchClause } from '@babel/types';

class Album extends Component {
    state = {}
    render() {
        return (<div className="albumArt">
            <div className="albumPic">
                <img src={this.props.info.art} style={{
                    height: "100%",
                    width: "100%",
                    margin: "0px",
                    padding: "0px",
                    border: "0px"
                }} />
            </div>
            <a href={this.props.info.link} target="_blank">
                <div className="albumInfo">
                    <h5 style={{ fontSize: "1em" }}>{this.props.place}</h5>
                    <h5 style={{ fontSize: "1.15em" }}>{this.props.info.name}</h5>
                    <h5 style={{ fontSize: "1em" }}>{this.props.info.artist}</h5>
                    <h5 style={{ fontSize: "1em" }}>{this.props.info.count} ✌</h5>
                </div>
            </a>
        </div >);
    }
}

export default Album;