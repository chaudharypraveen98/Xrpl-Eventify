import React from "react";
import "../../styles/base/TextInput.css";

//Base Input Component
//Usage: <Input width='550px' height='30px' />

const TextInput = ({
  width = "80%",
  height = "auto",
  placeholder = "default input",
  icon = null,
  type,
  textChange,
  maxLength = 0
}) => {
  return (
    <div className="search-wrapper">
      <div
        className="search-container"
        style={{
          width: `${width}`,
          height: `${height}`,
          background: `radial-gradient(
                    circle,
                    rgba(255, 255, 255, 0.05) 0%,
                    rgba(48,118,234,0.2) 0%,
                    rgba(255, 255, 255, 0.05) 70%
                )`,
        }}
      >
        <input
          id={placeholder}
          className="inputBox"
          placeholder={placeholder}
          type={type}
          onChange={textChange}
          maxLength={maxLength ? maxLength : 20}
        />
        {icon && icon}
      </div>
    </div>
  );
};

export default TextInput;
