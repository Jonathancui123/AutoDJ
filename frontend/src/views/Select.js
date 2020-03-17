import React, { Component } from 'react';
import config from '../constants';

class Select extends Component {
    backendAddress = config.backendAddress;

    constructor() {
        super();
        this.state = {
            name: "<placeholder>",
            spotifyId: "",
            parties: []
        }
    }

    componentDidMount() {
        console.log('Component mounted');
        fetch(`${this.backendAddress}/getUserInfo`)
            .then(res => { return res.json() })
            .then(res => {
                console.log(res);
                this.setState({
                    name: res.name,
                    spotifyId: res.spotifyId,
                    parties: res.parties
                })
            })
    }

    newParty() {
        fetch(`${this.backendAddress}/newParty`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                spotifyId: this.state.spotifyId
            })
        })
            .then(console.log('* newParty called to backend'))
            .catch((err) => console.log('Error when calling newParty: ' + err));
    }

    render() {
        return (
            <div>
                <h1>Temp select screen</h1>
                <h2>Hello, {this.state.name}</h2>
                <h3><a href='/create' onClick={this.newParty}>New party - Go to create screen (sets role to host)</a></h3>
            </div>
        );
    }
}

export default Select;