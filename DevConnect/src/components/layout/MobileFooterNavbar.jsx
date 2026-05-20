import { BadgePlus, Bell, House, Search, User } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

export const MobileFooterNavbar = () => {
  
  return (
    <div className=' px-5 sticky bottom-0 bg-background z-10'>
        <div className='flex items-center justify-between md:hidden text-xs pt-4 border-t '>
            <Link to="/" className={`flex flex-col items-center gap-1`}><House />Home</Link>
            <Link to="/explore" className={`flex flex-col items-center gap-1`}><Search />Explore</Link>
            <Link to="/create-post" className={`flex flex-col items-center gap-1`}><BadgePlus color="#b62add" />Post</Link>
            <Link to="/Notifications" className={`flex flex-col items-center gap-1`}><Bell />Notification</Link>
            <Link to="/Profile" className={`flex flex-col items-center gap-1`}><User />Profile</Link>
        </div>
    </div>
  )
}
