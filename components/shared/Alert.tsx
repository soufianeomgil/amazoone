import React from 'react'

const Alert = ({message}: {
    message:string
}) => {
  return (
    <div role="alert" className='w-full bg-[#fdf0d5] py-3 min-h-[50px] mt-5 px-5 flex items-center justify-center'>
    <p className='text-[#ff5921] text-center font-medium'>
       {message}
    </p>
  </div>
  )
}

export default Alert