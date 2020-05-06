import React from "react";
import { Route, Redirect } from "react-router-dom";
/**
 * A Route that will prevent access by logged out users by redirecting them
 * to "/login" (or a custom redirectPath as specified in the component's props).
 * Checks for login status by reading a token from localStorage.
 * @param {*} props Any Route props, plus an optional redirectPath to define where to
 * send a logged out user (default path is "/login").
 */
export default function PrivateRoute({ redirectPath = "/login", ...props }) {
  const token = localStorage.getItem("token");
  //null indicates that no entry for token can be found
  //"null" indicates that the token has been set to null, e.g. by useLocalStorage
  const isLoggedIn = !(token === null || token === "null");
  return isLoggedIn ? <Route {...props} /> : <Redirect to={redirectPath} />;
}
