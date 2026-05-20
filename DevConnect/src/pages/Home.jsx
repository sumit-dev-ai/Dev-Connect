import { CreatePost } from '@/components/feed/CreatePost';
import { FeedTabs } from '@/components/feed/FeedTabs';
import { PostCards } from '@/components/feed/PostCards';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from 'lucide-react';
import React, { useState } from 'react'

export const Home = () => {
    

    return (
            <SidebarProvider>
        <div className='mx-4 max-w-screen'>
                <Navbar />
            <FeedTabs />
            <CreatePost />
            <PostCards />



        </div>
            </SidebarProvider>
    )
}
