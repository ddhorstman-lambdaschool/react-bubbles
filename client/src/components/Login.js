import React from "react";

import { axiosWithoutAuth } from "../api/axiosWithAuth";

const initialState = {
  username: "",
  password: "",
  isLoading: false,
};

export default class Login extends React.Component {
  state = initialState;

  constructor(props) {
    super(props);
    this.handleChanges = this.handleChanges.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChanges({ target: { name, value } }) {
    this.setState({ [name]: value });
  }

  handleReset(e) {
    e && e.preventDefault();
    this.setState(initialState);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ isLoading: true });
    axiosWithoutAuth()
      .post("/login", this.state)
      .then(r => this.props.setToken(r.data.payload))
      .then(() => this.setState({isLoading:false}))
      .then(() => this.props.history.push("/bubbles"))
      .catch(console.error);
  }

  render() {
    return (
      <>
        <h2>Log in:</h2>
        <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
          <label>
            Username:
            <input
              name='username'
              value={this.state.username}
              onChange={this.handleChanges}
            />
          </label>
          <label>
            Password:
            <input
              type='password'
              name='password'
              value={this.state.password}
              onChange={this.handleChanges}
            />
          </label>
          <div>
            <input type='submit' disabled={this.state.isLoading} />
            <input type='reset' />
          </div>
        </form>
      </>
    );
  }
}
