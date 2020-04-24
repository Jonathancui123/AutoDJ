import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Squares from '../components/squares';
import config from '../constants';
import enforceLogin from '../components/enforceLogin';
import LoginModal from '../components/loginModal';
import PlaylistOptions from '../components/playlistOptions';

// Replaces old host page

class Select extends Component {
    backendAddress = config.backendAddress;

    constructor() {
        super();
        this.state = {
            name: "",
            spotifyId: "",
            parties: [],
            playlistId: "",
            loggedIn: false,
        }
        this.redirectFunction = this.redirectFunction.bind(this);

    }

    loadSelectPage() {
        fetch(`${this.backendAddress}/getUserInfo`, {
            method: "GET",
            credentials: "include"
        })
            .then(res => {
                return res.json();
            })
            .then(res => {
                console.log(res);
                this.setState({
                    name: res.name,
                    spotifyId: res.spotifyId,
                    parties: res.parties
                });
            })
            .catch(err => {
                console.log(err);
                this.props.history.push("/error", {
                    code: 4
                });
            });
    }

    redirectFunction(url) {
        this.props.history.push(url);
    }

    componentDidMount() {
        console.log('Component mounted');
        enforceLogin("select")
            .then(loggedInBool => {
                this.setState({
                    loggedIn: loggedInBool
                })
                if (this.state.loggedIn) {
                    this.loadSelectPage();
                }
            })
            .catch(err => {
                console.log('Could not verify login');
                this.props.history.push("/error", {
                    code: 2
                });
            });



    }


    // value = { this.state.genres }
    // onChange = { this.handleChange }

    render() {

        var selectPage = (<div>
            <div className="square-container">
                <Squares />
                <div className="content-container">

                    <div id="create">
                        <h1>Welcome, {this.state.name}</h1>
                        <PlaylistOptions allowName={true} redirectFunction={this.redirectFunction} />
                    </div>
                </div>
            </div>
        </div>
        )

        if (!this.state.loggedIn) {
            return (
                <div> {selectPage}
                    < div > <LoginModal redirect="select" currentPage="select" /></div >
                </div >
            )
        }
        else {
            return (
                <div>{selectPage}</div>
            );
        }
    }

}

export default withRouter(Select);