import React, {ReactNode} from "react";

interface LabelProps {
  children?: ReactNode;
  className?: string;
}

const Label = ({ children, className }: LabelProps) => {
  return (
    <label className={`basis-[150px] ${className}`}>
      {children}
    </label>
  )
}

export default Label;