import React from 'react'
import { Navbar } from './Navbar'
import { Outlet } from 'react-router-dom'
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "../ui/sidebar"
import { AppSidebar } from './AppSidebar'
import { MobileFooterNavbar } from './MobileFooterNavbar'




export const AppLayout = () => {
  return (
  
    <SidebarProvider defaultOpen={true} >

      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <SidebarInset>



        <main className='min-h-screen' >
          <Outlet />
        </main>
        <MobileFooterNavbar className="shrink-0" />

      </SidebarInset>

    </SidebarProvider>
  )
}
