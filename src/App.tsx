import firebase from "firebase";
import React, { Component } from "react";
import { UserContext } from "./Connexion/UserContext";
import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import { Add } from "./AddPage/Add";
import { Home } from "./HomePage/Home";
import { Recipe } from "./RecipePage/Recipe";

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
          <header className="h-20 bg-purple-900 text-white">
            <nav className="flex h-full items-end">
              <ul className="flex mb-2">
                <li className="ml-6">
                  <NavLink
                    to="/"
                    exact
                    className="hover:text-pink-500 hover:border-b hover:border-pink-500 hover:border-b"
                    activeClassName="text-pink-500 border-b border-pink-500"
                  >
                    Home
                  </NavLink>
                </li>
                <li className="ml-6">
                  <NavLink
                    to="/add"
                    exact
                    className="hover:text-pink-500 hover:border-b hover:border-pink-500"
                    activeClassName="text-pink-500 border-b border-pink-500"
                  >
                    Add
                  </NavLink>
                </li>
              </ul>
            </nav>
          </header>
          <Switch>
            <Route path="/add">
              <Add />
            </Route>
            <Route path="/recipe/:id">
              <Recipe />
            </Route>
            <Route>
              <Home />
            </Route>
          </Switch>
          <footer className="h-20 bg-purple-900 text-white" />
        </UserContext.Provider>
      </BrowserRouter>
    );
  }
}
