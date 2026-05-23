import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Image, Code, Vote, CircleArrowUp } from 'lucide-react'
import { createPost } from '@/services/postServices'
import toast from 'react-hot-toast'
import { usePostContext } from '@/context/postContext'

export const CreatePost = () => {

    // Text content
    const [content, setContent] = useState("")
    const {loading , setLoading} = usePostContext();
    // Type of post
    const [postType, setPostType] = useState("text")

    // Image file
    const [images, setImages] = useState([])

    const handleImageChange=(e)=>{
        const imgs= Array.from(e.target.files);
        setImages(imgs);
    }

    const handleCreatePost= async(e)=>{
        e.preventDefault();
        const formData = new FormData();

        try {
            setLoading(true)
            formData.append("content" , content)

            images?.forEach((image)=>{
                formData.append("images", image)
            })

            const data = await createPost(formData);
            toast.success("Post created succesfully")
            setContent("");
            setImages([])
            

    
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "Something went wrong ");
        }finally{
            setLoading(false)
        }

    }

    return (

        <div className='grid grid-cols-1 border border-gray-300 rounded-md mt-2 p-2'>

            {/* TOP SECTION */}
            <div className='flex gap-2'>

                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className='flex-1 outline-none'
                />

            </div>

            {/* DYNAMIC SECTION */}

            {
                postType === "image" && (

                    <div className='mt-3'>

                        <input
                            type='file'
                            multiple
                            accept='image/*'
                            onChange={ handleImageChange }
                            
                        />
                    </div>
                )
            }

            {
                postType === "code" && (

                    <textarea
                        placeholder='Paste your code...'
                        className='border mt-3 p-2 rounded-md'
                    />

                )
            }

            {
                postType === "poll" && (

                    <div className='flex flex-col gap-2 mt-3'>

                        <input
                            type='text'
                            placeholder='Option 1'
                            className='border p-2 rounded-md'
                        />

                        <input
                            type='text'
                            placeholder='Option 2'
                            className='border p-2 rounded-md'
                        />

                    </div>
                )
            }

            <div className='border-t md:mx-5 my-2'></div>

            {/* OPTIONS */}

            <div className='flex items-center justify-between mx-4'>

                <div className='flex items-center gap-4'>

                    {/* IMAGE BUTTON */}
                    <button
                        onClick={() => setPostType("image")}
                        className='flex gap-2 cursor-pointer'
                    >
                        <Image />
                        Image
                    </button>

                    {/* CODE BUTTON */}
                    <button
                        onClick={() => setPostType("code")}
                        className='flex gap-2 cursor-pointer'
                    >
                        <Code />
                        Code
                    </button>

                    {/* POLL BUTTON */}
                    <button
                        onClick={() => setPostType("poll")}
                        className='flex gap-2 cursor-pointer'
                    >
                        <Vote />
                        Poll
                    </button>

                </div>

                {/* SUBMIT BUTTON */}

                <button disabled={loading} onClick={handleCreatePost}>
                    <CircleArrowUp className='cursor-pointer hover:scale-105' />
                </button>

            </div>

        </div>
    )
}