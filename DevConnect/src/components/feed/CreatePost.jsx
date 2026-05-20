import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Image, Code, Vote, CircleArrowUp } from 'lucide-react';



export const CreatePost = () => {
    const [content, setContent] = useState("");

    const postOptions = [
        { name: "Image", icon: Image },
        { name: "Code", icon: Code },
        { name: "Poll", icon: Vote },
    ]
    return (
        <div className='grid grid-cols-1 border border-gray-300 rounded-md mt-2 p-2'>
            {/* Avatar and text area div 1 */}
            <div className='flex gap-2 '>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className='flex-1'
                />
            </div>
            <div className='border-t md:mx-5 my-2'></div>
            {/* Div2 options  */}
            <div className='flex items-center justify-between mx-4'>
            <div className='flex items-center justify-between md:w-1/3 '>
                {postOptions.map((option) => {
                    const Icon = option.icon;
                    return(
                    <div key={option.name} className='border-r px-2 md:px-5 text-sm md:text-base  border-gray-300 '>
                        <button className='flex gap-2 cursor-pointer '> <Icon /> {option.name}</button>
                    </div>
                    )
                })}
                </div>
                {/* post button */}
                <div>
                <CircleArrowUp className='cursor-pointer hover:scale-105'/>
                </div>

            </div>

        </div>
    )
}
