import React, { Component } from 'react';
import '../views/Styles.css'

class Squares extends Component {
    state = {}
    render() {
        return (
            <div>
                <div className="squares square1" />
                <div className="squares square2" />
                <div className="squares square3" />
                <div className="squares square4" />
                <div className="squares square5" />
                <div className="squares square6" />
                <div className="squares square7" />
            </div>
        );
    }
}

export default Squares;