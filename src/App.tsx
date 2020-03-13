import firebase from "firebase";
import React, { Component } from "react";
import "./App.css";
import { UserContext } from "./Connexion/UserContext";
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";
import { Add } from "./AddPage/Add";

interface IAppState {
  user?: firebase.User;
}

export class App extends Component<{}, IAppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      user: undefined
    };

    // firebase
    //   .auth()
    //   .onAuthStateChanged(user => this.setState({ user: user || undefined }));
  }

  public render() {
    return (
      <BrowserRouter>
        <UserContext.Provider value={this.state.user}>
          {/*<Connexion />*/}
          <header className="h-20 bg-purple-900 text-white">
            <Link to="/add">Add</Link>
          </header>
          <Switch>
            <Route path="/add">
              <Add />
            </Route>
            <Route>
              <div>Home</div>
            </Route>
          </Switch>
        </UserContext.Provider>
      </BrowserRouter>
    );
  }
}
