import React from "react";

import axiosWithAuth from "../api/axiosWithAuth";

import Bubbles from "./Bubbles";
import ColorList from "./ColorList";

const BubblePage = () => {
  const [colorList, setColorList] = React.useState([]);
  const [edits, setEdits] = React.useState(0);

  React.useEffect(() => {
    axiosWithAuth()
      .get("/colors")
      .then(r => setColorList(r.data))
      .catch(console.error);
  }, [edits]);

  function triggerUpdate() {
    setEdits(edits + 1);
  }

  return (
    <>
      <ColorList
        colors={colorList}
        updateColors={setColorList}
        triggerUpdate={triggerUpdate}
      />
      <Bubbles colors={colorList} />
    </>
  );
};

export default BubblePage;
