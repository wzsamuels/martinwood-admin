import React from "react";

interface InputWrapperProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}
const InputWrapper = ({ children, onClick, className }: InputWrapperProps) => {
  return (
      <div className={`flex flex-wrap ${className}`} onClick={onClick}>
        {children}
      </div>
    )
}

export default InputWrapper;