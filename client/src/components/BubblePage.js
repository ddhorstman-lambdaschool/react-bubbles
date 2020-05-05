import React from "react";

import axiosWithAuth from "../api/axiosWithAuth";

import Bubbles from "./Bubbles";
import ColorList from "./ColorList";

export default function BubblePage() {
  const [colorList, setColorList] = React.useState([]);

  React.useEffect(() => getColorData(), []);

  const getColorData = () => {
    axiosWithAuth()
      .get("/colors")
      .then(r => setColorList(r.data))
      .catch(console.error);
  };

  return (
    <>
      <ColorList colors={colorList} getColorData={getColorData} />
      <Bubbles colors={colorList} />
    </>
  );
}
