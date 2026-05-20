import useAuthContext from '@/context/authContext'
import { followController, getProfiles, unFollowController } from '@/services/AuthServices'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export const Explore = () => {
  const [activeTab, setActiveTab] = useState("users")
  const [loading, setLoading] = useState(false)
  const { user, profiles, setProfiles } = useAuthContext();
  const options = [
    "users", "posts", "tags"
  ]
  const handleFollow = async (profileid) => {
    try {
      const data = await followController(profileid);
      await handleClick("users")
      toast.success(data?.message)


    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to follow user";
      toast.error(message)
    }
  }
  const handleUnfollow = async (profileid) => {
    try {
      const data = await unFollowController(profileid);
      await handleClick("users")
      toast.success(data?.message)


    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to unfollow user";
      toast.error(message)
    }
  }

  const handleClick = async (option) => {

    try {
      if (option === "users") {

        const data = await getProfiles();
        setProfiles(data.data.profiles)
        console.log(profiles);


      }

    } catch (error) {
      console.log(error);

      toast.error("failed to load users")
    }
  }
  useEffect(() => {
    handleClick("users");
  }, [])

  return (
    <div className='m-4'>
      <div className='flex flex-1'>

        <form className="md:w-1/3 mx-auto">
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

      <div className='flex items-center justify-between my-4 md:max-w-3/4 md:p-2 '>
        {options.map((option) => (
          <div key={option} >
            <button type='button' className={`cursor-pointer ${activeTab === option ? "border-b-2 font-bold border-gray-500" : ""}    `}
              onClick={() => { setActiveTab(option.toLowerCase()); handleClick(option) }} >{option}</button>
          </div>
        ))}
      </div>

      <div>
        {activeTab === "users" && (
          <div>
            {profiles?.map((profile) => {
              const isFollowing = profile.followers?.some(
                (id) => id.toString() === user?._id?.toString()
              );

              return (
                <div key={profile?._id}>
                  <div className='flex items-center justify-between md:max-w-3/4 border rounded-md gap-2 m-1 p-2'>
                    <div>
                      <img
                        src={profile?.profilePicture}
                        alt=""
                        className='w-10 h-10 rounded-full'
                      />
                    </div>

                    <div className='flex-1 flex flex-col justify-start'>
                      <div className='text-sm md:text-base font-semibold'>
                        {profile?.fullName}
                      </div>
                      <div className='text-xs text-gray-500'>
                        @{profile?.userName}
                      </div>
                    </div>

                    <div>
                      <button
                        type='button'
                        className={`border border-blue-400 font-semibold rounded-full p-1 w-20 cursor-pointer ${isFollowing ? "bg-linear-to-r from-blue-600 to-blue-400 text-white": " bg-blue-50 text-blue-600"}`}
                        onClick={() =>
                          isFollowing
                            ? handleUnfollow(profile?._id)
                            : handleFollow(profile?._id)
                        }
                      >
                        {isFollowing ? "Unfollow" : "Follow"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {activeTab === "posts" && (
          <div>
            <h2></h2>
            {/* show posts here */}
          </div>
        )}
      </div>
    </div>
  )
}
