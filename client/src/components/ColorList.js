import React, { useState } from "react";

import axiosWithAuth from "../api/axiosWithAuth";

import setForegroundColor from "../utils/setForegroundColor";

const initialColor = {
  color: "",
  code: { hex: "#" },
};

const ColorList = ({ colors, triggerUpdate }) => {
  //console.log(colors);
  const [editing, setEditing] = useState(null);
  const [colorToEdit, setColorToEdit] = useState(initialColor);

  const editColor = color => {
    setEditing("existing");
    setColorToEdit(color);
  };

  const addNew = e => {
    e.preventDefault();
    setColorToEdit(initialColor);
    setEditing("new");
  };

  const saveEdit = e => {
    e.preventDefault();
    axiosWithAuth()
      .put(`/colors/${colorToEdit.id}`, colorToEdit)
      .then(() => setEditing(null))
      .then(triggerUpdate)
      .catch(console.error);
  };

  const saveNewColor = e => {
    e.preventDefault();
    axiosWithAuth()
      .post(`/colors`, colorToEdit)
      .then(() => setEditing(null))
      .then(triggerUpdate)
      .catch(console.error);
  };

  const deleteColor = ({ id }) => {
    axiosWithAuth()
      .delete(`/colors/${id}`)
      .then(triggerUpdate)
      .catch(console.error);
  };

  return (
    <div className='colors-wrap'>
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span
                className='delete'
                onClick={e => {
                  e.stopPropagation();
                  deleteColor(color);
                }}
              >
                x
              </span>{" "}
              {color.color}
            </span>
            <div
              className='color-box'
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      <div className='button-row'>
        <button onClick={addNew}>Add new</button>
      </div>
      {editing === "existing" && (
        <form onSubmit={saveEdit}>
          <legend
            style={{
              backgroundColor: colorToEdit.code.hex,
              color: setForegroundColor(colorToEdit.code.hex),
            }}
          >{`editing ${colorToEdit.color}`}</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value },
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className='button-row'>
            <button type='submit'>save</button>
            <button type='button' onClick={() => setEditing(null)}>
              cancel
            </button>
          </div>
        </form>
      )}
      {editing === "new" && (
        <form onSubmit={saveNewColor}>
          <legend
            style={{
              backgroundColor: colorToEdit.code.hex,
              color: setForegroundColor(colorToEdit.code.hex),
            }}
          >
            new color
          </legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value },
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className='button-row'>
            <button type='submit'>save</button>
            <button type='button' onClick={() => setEditing(false)}>
              cancel
            </button>
          </div>
        </form>
      )}
      <div className='spacer' />
    </div>
  );
};

export default ColorList;
