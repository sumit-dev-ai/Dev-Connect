import React, { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dot, Ellipsis, Heart, MessageCircle, Share2 } from 'lucide-react';

export const PostCards = ({posts}) => {
    const [openMenuId, setOpenMenuId] = useState(null)
    //for shuting menu down when mose clicked outside
    const dropdownRef = useRef(null)

    //for shuting menu down when mose clicked outside
    useEffect(() => {

        const handleClickOutside = (e) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setOpenMenuId(null);
            }

        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }

    }, [])

    return (
        <div>
            <div className='flex flex-col gap-2 mt-2' >
                {posts.map((post) => (
                    <div key={post.id} className='border p-4 rounded-md'>
                        {/* post top menu */}
                        <div className='flex items-center justify-between gap-2 md:gap-5'>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>

                            <div className='flex-1'>
                                <div className='grid grid-cols-[auto_1fr_auto_auto] items-center gap-1 w-full md:w-fit text-sm md:text-base'>
                                    <div className=' font-bold whitespace-nowrap '>{post?.user.name}</div>
                                    <div className='text-gray-500 min-w-0 truncate'> @{post?.user.username}</div>
                                    <div className='text-gray-500 flex items-center'><Dot />{post?.createdAt}</div>
                                    <div className='col-span-3 text-gray-500'> {post?.user.role} </div>
                                </div>
                            </div>

                            <div className='relative' ref={openMenuId === post.id ? dropdownRef : null} >
                                <button onClick={() => setOpenMenuId(
                                    openMenuId === post.id ? null : post.id
                                )}>
                                    <Ellipsis />
                                </button>
                                {openMenuId === post.id && <div className=' z-10 absolute right-0 top-full gap-1 mt-2 w-25 md:w-40 text-sm md:text-base rounded-xl border bg-background shadow-md flex flex-col'>
                                    <button className='cursor-pointer border-b '>Edit</button>
                                    <button className='cursor-pointer border-b '>Delete</button>
                                    <button className='cursor-pointer border-b '>Copy Link</button>
                                    <button className='cursor-pointer border-b '>Share</button>
                                </div>}
                            </div>
                        </div>

                        {/* content div */}
                        <div>
                            {/* content */}
                            <div className='mt-4 text-sm md:text-base'>{post?.content}</div>
                            {/* image content */}
                            {post?.image &&
                                <div className='mt-3 overflow-hidden rounded-md md:rounded-xl border'>
                                    <img src={post?.image} alt="" className='w-full object-cover max-h-125' />
                                </div>}
                        </div>

                        {/* Intercation Menu */}
                        <div className='flex items-center justify-between my-4 md:w-2/3 mx-3 text-sm md:text-base'>
                            <div >
                                <button className='flex gap-2 items-center'><Heart className='cursor-pointer w-5 h-5 md:h-7 md:w-7' /> {post?.likes}</button>
                            </div>
                            <div >
                                <button className='flex gap-2 items-center'><MessageCircle className='cursor-pointer w-5 h-5 md:h-7 md:w-7'/>{post?.comments}</button>
                            </div>
                            <div >
                                <button className='flex gap-2 items-center'><Share2 className='cursor-pointer w-5 h-5 md:h-7 md:w-7'/>Share</button>
                            </div>
                        </div>
                    </div>
                ))
                }
            </div>
        </div>
    )
}
