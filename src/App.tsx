import { User } from "firebase/auth";
import React, { Component } from "react";
import { UserContext } from "./Connexion/UserContext";
import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import { Add } from "./AddPage/Add";
import { Home } from "./HomePage/Home";
import { Recipe } from "./RecipePage/Recipe";
import { IngredientProvider } from "./IngredientProvider";
import { RecipeProvider } from "./RecipeProvider";
import { Admin } from "./AdminPage/Admin";
import { getAuth } from "firebase/auth";
import { Connexion } from "./Connexion/Connexion";

const auth = getAuth();
interface IAppState {
  user: User | null;
}

export class App extends Component<{}, IAppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      user: auth.currentUser
    };

    auth.onAuthStateChanged(user => this.setState({ user: user || null }));
  }

  public render() {
    return (
      <BrowserRouter>
        <UserContext.Provider value={this.state.user}>
          <IngredientProvider>
            <RecipeProvider>
              <header className="h-20 bg-purple-900 text-white">
                <nav className="flex h-full items-center justify-between px-4">
                  <ul className="flex mb-2">
                    <li>
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
                    <li className="ml-6">
                      <NavLink
                        to="/admin"
                        exact
                        className="hover:text-pink-500 hover:border-b hover:border-pink-500"
                        activeClassName="text-pink-500 border-b border-pink-500"
                      >
                        Admin
                      </NavLink>
                    </li>
                  </ul>
                  <Connexion />
                </nav>
              </header>
              {this.state.user ? (
                <Switch>
                  <Route path="/add">
                    <Add />
                  </Route>
                  <Route path="/admin">
                    <Admin />
                  </Route>
                  <Route path="/recipe/:id">
                    <Recipe />
                  </Route>
                  <Route>
                    <Home />
                  </Route>
                </Switch>
              ) : (
                <div className="h-64 flex items-center justify-center">Please login</div>
              )}
              <footer className="h-20 bg-purple-900 text-white" />
            </RecipeProvider>
          </IngredientProvider>
        </UserContext.Provider>
      </BrowserRouter>
    );
  }
}
