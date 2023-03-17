import React from "react";
import TextInput from "./base/TextInput";
import { AiOutlineSearch } from "react-icons/ai";

const Search = ({textChange, iconClick}) => {
  return (
    <TextInput
      placeholder="r-address..."
      icon={<AiOutlineSearch size="30" color="rgba(48,118,234,1)" onClick={iconClick}/>}
      textChange={textChange}
      type="text"
    />
  );
};

export default Search;
