import React from 'react';

const InputBox = (props) => {
  return (
    <div>
      <input type="url" /> <button onClick={props.addInputBox} value="retail-form" type="button">+</button> <button value="retail-form" type="button">-</button>
    </div>
  )
};

export default InputBox;