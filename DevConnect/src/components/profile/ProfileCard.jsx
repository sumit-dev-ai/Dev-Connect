import React from 'react'
import { Calendar, Link2, MapPin, Share2 } from 'lucide-react';
import useAuthContext from '@/context/authContext';
import { useNavigate } from 'react-router-dom';

export const ProfileCard = ({ posts }) => {
    const { user }= useAuthContext();

    const formattedDate= new Date(user?.createdAt).toLocaleDateString();
    const Navigate = useNavigate();
    return (
        <div>
            <div className='relative'>
                <div><img src={user?.coverPicture} alt="" className='max-h-50 w-full object-cover rounded-md' /></div>
                <div className='absolute left-15 top-22'><img src={user?.profilePicture} alt="" className='w-40 h-40 rounded-full border-2' /></div>
            </div>
            <div className='mt-12 flex flex-col items-start'>
                <div className='font-bold text-3xl mx-15'>{user?.fullName}</div>
                <div className='text-base text-gray-400 mx-15'>@{user?.userName}</div>
                <div className='text-base text-gray-700 mx-5 mt-2'>{user?.bio}</div>
            </div>

            <div className='flex items-center justify-between mt-4 px-4 w-4/5 text-gray-500'>
                <div className='flex items-center cursor-pointer'><MapPin />{user?.location}</div>
                <div className='flex items-center cursor-pointer'><Link2 />{user?.website}</div>
                <div className='flex items-center cursor-pointer'><Calendar />Joined {formattedDate}</div>
            </div>

            <div className='flex items-center justify-between mt-4 px-4 w-4/5 font-semibold'>
                <div className='flex flex-col items-center'>{posts[0].user?.postsCount} <div className='font-normal text-gray-500'>Posts</div></div>
                <div className='flex flex-col items-center'>{posts[0].user?.Followers} <div className='font-normal text-gray-500'>Followers</div></div>
                <div className='flex flex-col items-center'>{posts[0].user?.Following} <div className='font-normal text-gray-500'>Following</div> </div>
            </div>

            <div className='flex items-center mt-4  w-4/5 gap-4'>
                <button className='profile-button px-6 w-1/2 cursor-pointer'onClick={()=>Navigate("/editprofile")}>Edit Profile</button>
                <button className='border rounded-md p-2'><Share2 /></button>
            </div>
        </div>
    )
}
