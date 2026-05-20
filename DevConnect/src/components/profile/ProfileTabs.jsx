import React, { useState } from 'react'

export const ProfileTabs = () => {
    const [activeTab,setActiveTab]=useState("posts")
    const options=[
        "Posts" , "About" , "Activity"
    ]
  return (
    <div className='border-t border-b mt-4 p-2'>

    <div className='flex items-center justify-around gap- w-4/5  '>
        {options.map((option)=>(
            <div key={option}>
                <button className={` ${activeTab===option.toLowerCase()? "font-bold border-b-2": "text-gray-600"}  cursor-pointer`}
            onClick={()=>setActiveTab(option.toLowerCase())}>

                {option}
            </button>
                </div>
        ))}
    </div>
    </div>
  )
}
