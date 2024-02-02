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
import { logout } from "./firebase/configuration";

const auth = getAuth();

let fakeUser: User | null = null;
// fakeUser = {
//   uid: "abcdef",
//   email: "aaa@gmail.com",
//   emailVerified: true,
//   displayName: "Nebounet84",
//   isAnonymous: false,
//   photoURL: "https://lh3.googleusercontent.com/a-/AAuE7mCdTQTyvbsurMjpTQ-gktLCaozRvVcMESh4DSmF",
//   providerData: [
//     {
//       providerId: "google.com",
//       uid: "sqdqsdqsd",
//       displayName: "Nebounet84",
//       email: "aaa@gmail.com",
//       phoneNumber: null,
//       photoURL: "https://lh3.googleusercontent.com/a/ACg8ocL20B1FZTePSH4q8ak8ENoP5h0GbG1xjzKIpcOhkO2FVg=s96-c"
//     }
//   ]
// };
interface IAppState {
  user: User | null;
}

export class App extends Component<{}, IAppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      user: fakeUser || auth.currentUser
    };

    auth.onAuthStateChanged(user => {
      if (user?.uid === "nLkRYqLLuThdLvdzoPjxr818bxu2" || user?.uid === "2ZtCDixdMuORBuXJSni620UJV1o1") {
        this.setState({ user: fakeUser || user });
      } else {
        logout();
        this.setState({ user: null });
      }
    });
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
                    <Recipe readOnly={false} />
                  </Route>
                  <Route path="/view/:id">
                    <Recipe readOnly />
                  </Route>
                  <Route>
                    <Home />
                  </Route>
                </Switch>
              ) : (
                <Switch>
                  <Route path="/view/:id">
                    <Recipe readOnly />
                  </Route>
                  <Route>
                    <div className="h-64 flex items-center justify-center">Please login</div>
                  </Route>
                </Switch>
              )}
              <footer className="h-20 bg-purple-900 text-white" />
            </RecipeProvider>
          </IngredientProvider>
        </UserContext.Provider>
      </BrowserRouter>
    );
  }
}
