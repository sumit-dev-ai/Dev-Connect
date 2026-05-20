import React, { useState } from 'react'

export const FeedTabs = () => {
    const [activeTab, setActiveTab] = useState("for-you")
    const tabs = [
        "For You", "Following", "Trending"
    ]

    return (
        <div>
            {/* tabs selection */}
            <div className='flex items-center  justify-between md:w-1/3 p-2 border-gray-200'>
                {tabs.map((tab) => (
                    <div key={tab}>
                        <button onClick={() => setActiveTab(tab.toLowerCase().replace(" ", "-"))}
                            className={`
                ${activeTab === tab.toLowerCase().replace(" ", "-")
                                    ? "border-b-3 font-semibold"
                                    : "text-muted-foreground"}
                  cursor-pointer
              `}
                        >{tab}</button>
                    </div>


                ))}
            </div>
        </div>
    )
}
