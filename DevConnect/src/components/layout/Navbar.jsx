import { Bell, Menu } from 'lucide-react'
import React from 'react'
import logo from '../../assets/ui/logo.png'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'



export const Navbar = () => {
  return (
    <div className='px-4 sticky top-0 bg-white z-20 border-b'>
      {/* Main nav div container */}
      <div className='flex items-center justify-between h-16'>



        {/* Logo */}
        <div className='flex md:items-center justify-start'>
          <img src={logo} className=' h-16 w-16 md:h-24 md:w-24 md:hidden' alt="" />
          
          <SidebarTrigger className={'hidden  md:hidden lg:block'}/>
          
        </div>

        {/* Searchbar */}
        <div className='hidden md:flex md:flex-1'>

          <form className="w-1/3 mx-auto">
            <label htmlFor="search" className="block mb-2.5 text-sm font-medium text-heading sr-only ">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" /></svg>
              </div>
              <input type="search" id="search" className="block w-full p-3 ps-9 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body" placeholder="Search" required />
              <button type="button" className="absolute inset-e-1.5 bottom-1.5 text-white bg-blue-500 bg-brand hover:bg-brand-strong  box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded text-xs px-3 py-1.5 focus:outline-none">Search</button>
            </div>
          </form>


        </div>

        {/*  NOtifications*/}
        <div>
          <Bell />
        </div>
      </div>
       
    </div>
  )
}
