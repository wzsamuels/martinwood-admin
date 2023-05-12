import Spinner from "@/components/common/Spinner/Spinner";
import React from "react";

const Loading = () => {
  return (
    <div className='flex flex-col items-center'>
      <div className='mb-8'>Loading...</div>
      <div><Spinner/></div>
    </div>
  )
}

export default Loading;