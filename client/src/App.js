import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import useLocalStorage from "./hooks/useLocalStorage";

import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import BubblePage from "./components/BubblePage";
import "./styles.scss";

export default function App() {
  const [token, setToken] = useLocalStorage("token");
  return (
    <Router>
      <div className='App'>
        <Route
          exact
          path='/'
          render={params => <Login {...params} setToken={setToken} />}
        />
        <PrivateRoute
          exact
          path='/bubbles'
          component={BubblePage}
          redirectPath={"/"}
        />
      </div>
    </Router>
  );
}
