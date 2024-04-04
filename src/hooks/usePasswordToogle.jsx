import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function usePasswordToogle(){
  const [visible, setVisible] = useState(false);

  const Icon = (
    visible ? <FaRegEyeSlash onClick={()=>(setVisible(visbility => !visbility))}/>:<FaRegEye onClick={()=>(setVisible(visbility => !visbility))}/>)
    ; 

  const InputType = visible ? "text" : "password";

  return [InputType, Icon];
};