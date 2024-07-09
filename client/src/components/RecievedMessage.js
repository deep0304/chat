import React from 'react'

const RecievedMessage = ({message,className}) => {
  return (
    <div className='bg-slate-300  mr-auto ml-5 mt-3 max-w-[60%] rounded-br-md rounded-bl-md min-w-[30%] rounded-tr-md justify-self-start lg:max-w-[40%] '>
        <div className="h-full mr-3 py-4 ml-3 text-sm  ">{message}</div>
    </div>
  )
}

export default RecievedMessage