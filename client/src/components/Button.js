"use client";
import { useState } from "react";

const handleClick = ([signUp, setSignUp]) => {
  if (signUp === true) {
    return setSignUp(false);
  } else {
    return setSignUp(true);
  }
};

const Button = ({ className, onClick, label }) => {
  const [signUp, setSignUp] = useState(false);

  return (
    <div className={className} onClick={handleClick([signUp, setSignUp])}>
      {label}
    </div>
  );
};

export default Button;
