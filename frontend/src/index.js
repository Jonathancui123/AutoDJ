import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import HttpsRedirect from "react-https-redirect";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as serviceWorker from "./serviceWorker";

import App from "./views/App";
import Create from "./views/CreatePage";
import Party from "./views/Party";
import Select from "./views/Select";
import Update from "./views/Update";
import Error from "./views/Error";

// DONT FORGET TO SET CURR_ENV=development for development

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/home" render={props =>
        <HttpsRedirect>
          <App {...props} />
        </HttpsRedirect>
      } />
      <Route path="/create" render={props => <Create {...props} />} />
      <Route path="/select" render={props => <Select {...props} />} />
      <Route path="/update/:playlistID" render={props => <Update {...props} />} />
      <Route path="/party/:playlistID" render={props => <Party {...props} />} />
      <Route path="/error" render={props => <Error {...props} />} />
      <Redirect from="/" to="/home" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);

if (process.env.NODE_ENV !== "development") {
  console.log = () => { };
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();