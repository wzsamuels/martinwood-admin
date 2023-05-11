import React from 'react';

interface InputProps {
  className?: string;
  [key: string]: any;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        {...props}
        ref={ref}
        className={`bg-black border-b border-b-grey focus:border-b-white focus:outline-0 ${className}`}/>
    )
  })
Input.displayName = 'Input';
export default Input