import { CreatePost } from '@/components/feed/CreatePost';
import { FeedTabs } from '@/components/feed/FeedTabs';
import { PostCards } from '@/components/feed/PostCards';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from 'lucide-react';
import React, { useState } from 'react'

export const Home = () => {
    const posts = [
        {
            id: 1,
            user: {
                name: "John Doe",
                username: "johndoe",
                role: "Full Stack Developer",
                avatar: "image-url",
            },
            content: "Just built a new portfolio...",
            image: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            likes: 24,
            comments: 6,
            createdAt: "2h",
        },
        {
            id: 2,
            user: {
                name: "jane Doe",
                username: "johndoe",
                role: "Software Developer",
                avatar: "image-url",
            },
            content: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.  sit amet consectetur, adipisicing elit sit amet consectetur, adipisicing elit sit amet consectetur, adipisicing elit Corrupti, earum.",
            image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            likes: 244,
            comments: 56,
            createdAt: "3m",
        },
        {
            id: 3,
            user: {
                name: "Sumit Jindal",
                username: "Sumit Jindal",
                role: "Software Developer",
                avatar: "image-url",
            },
            content: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.  sit amet consectetur, adipisicing elit sit amet consectetur, adipisicing elit sit amet consectetur, adipisicing elit Corrupti, earum.",
            image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            likes: 244,
            comments: 56,
            createdAt: "3m",
        },
    ];


    return (
            <SidebarProvider>
        <div className='mx-4'>
                <Navbar />
            <FeedTabs />
            <CreatePost />
            <PostCards posts={posts} />



        </div>
            </SidebarProvider>
    )
}
