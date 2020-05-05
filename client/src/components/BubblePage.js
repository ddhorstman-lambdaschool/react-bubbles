import React from "react";

import axiosWithAuth from "../api/axiosWithAuth";

import Bubbles from "./Bubbles";
import ColorList from "./ColorList";

export default class BubblePage extends React.Component {
  state = {
    colorList: [],
  };

  componentDidMount(){
    this.getColorData();
  }

  getColorData = () => {
    axiosWithAuth()
      .get("/colors")
      .then(r => this.setState({colorList:r.data}))
      .catch(console.error);
  };
  render() {
    return (
      <>
        <ColorList colors={this.state.colorList} getColorData={this.getColorData} />
        <Bubbles colors={this.state.colorList} />
      </>
    );
  }
}
