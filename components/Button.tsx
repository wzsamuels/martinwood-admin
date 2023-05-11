import React, {ReactNode} from "react";

interface ButtonProps {
  children: ReactNode
  className?: string
  variation?: string
  [key: string]: any
}

const Button = ({children, className, variation,...props}: ButtonProps) => {
  return (
    <button
      {...props}
      className={`hover:opacity-80 disabled:opacity-30 font-light disabled:cursor-not-allowed px-4 py-2 rounded border-2 border-red  bg-grey text-white ${className}`}
    >
      {children}
    </button>
  )
}

export default Button