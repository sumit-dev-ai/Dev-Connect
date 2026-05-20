import { Code, Image, Vote, X } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const CreatePost = () => {
  const [content , setContent]=useState("")
  const navigate=useNavigate();
    const postOptions = [
        { name: "Image", icon: Image },
        { name: "Code", icon: Code },
        { name: "Poll", icon: Vote },
    ]

  return (
    <div className='mx-4 mb-4'>
      <div className='sticky top-0 z-10 bg-background p-1'>
        <div className='relative flex items-center border-b p-1'><X onClick={()=>navigate("/")}/> <div className='absolute left-1/2 -translate-x-1/2'>Create Post</div></div>
      </div>
      <div>
        <textarea 
           value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className='w-full h-90 p-2 border'
        ></textarea>
         <div className='grid grid-cols-1 '>
                {postOptions.map((option) => {
                    const Icon = option.icon;
                    return(
                    <div key={option.name} className='border-r px-2 md:px-5 text-sm md:text-base  border-gray-300 '>
                        <button className='flex gap-2 p-1 cursor-pointer border-b w-full '> <Icon /> {option.name}</button>
                    </div>
                    )
                })}
            </div>

          <div>
            <button className='w-full bg-linear-to-r text-white from-purple-800 to-purple-600 rounded-sm my-2 p-2'>Post</button>
          </div>

      </div>
    </div>
  )
}
