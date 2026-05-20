import { ProfileCard } from '@/components/profile/ProfileCard';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import useAuthContext from '@/context/authContext';
import React from 'react'

export const Profile = () => {
    const {user}= useAuthContext();
      const posts = [
        {
            id: 1,
            user: {
                name: "John Doe",
                username: "johndoe",
                role: "Full Stack Developer",
                profileDetails: "Full Stack Developer | open source enthusist | Coffee Lover ",
                avatar: "https://github.com/shadcn.png",
                location:"India",
                profileLink:"https://ke.linkedin.com/in/paul-simiyu",
                joinedDate:"23-June-2024",
                postsCount:"300",
                Following:"278",
                Followers:"340k"

            },
            content: "Just built a new portfolio...",
            image: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            likes: 24,
            comments: 6,
            createdAt: "2h",
        },
     
    ];

  return (
    <div className='mx-4'>
      <ProfileCard posts={posts} />
      <ProfileTabs />
    </div>

    
  )
}
