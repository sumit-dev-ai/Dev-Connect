import { useCommentContext } from '@/context/commentContext'

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Heart } from 'lucide-react';

export const CommentList = ({ postId }) => {
    const { loading, comments } = useCommentContext();
    const postComments = comments[postId] || []

    if (loading && postComments.length === 0) {
        return (
            <div className="py-3 text-sm text-gray-500">
                Loading comments...
            </div>
        );
    }
    if (postComments.length === 0) {
        return (
            <div className="py-3 text-sm text-gray-500">
                No comments yet. Be the first to comment.
            </div>
        );
    }

    return (
        <div>
            <div className='flex flex-col'>
                {postComments.map((comment) => {
                    const formattedDate = new Date(comment.createdAt);
                    const now = new Date();
                    const diffInMs = now - formattedDate;

                    const minutes = Math.floor(diffInMs / (1000 * 60));
                    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
                    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

                    let commentTime = "";

                    if (minutes < 60) {
                        commentTime = `${minutes}m ago`;
                    } else if (hours < 24) {
                        commentTime = `${hours}h ago`;
                    } else {
                        commentTime = `${days}d ago`;
                    }
                    return (
                        <div key={comment._id} className="flex gap-3">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={comment?.authorDetails?.profilePicture} />
                                <AvatarFallback>
                                    {comment?.authorDetails?.fullName?.toUpperCase()?.[0] || "U"}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                                <div className="bg-muted/40 rounded-lg px-3 py-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-sm font-semibold">
                                            {comment?.authorDetails?.fullName || "Unknown User"}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            @{comment?.authorDetails?.userName || "unknown"}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            · {commentTime}
                                        </p>
                                    </div>

                                    <p className="text-sm mt-1">
                                        {comment?.content}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 mt-1 ml-2 text-xs text-gray-500">
                                    <button className="flex items-center gap-1">
                                        <Heart
                                            className={`w-3 h-3 ${comment?.isCommentLiked
                                                ? "fill-red-500 text-red-500"
                                                : ""
                                                }`}
                                        />
                                        {comment?.likesCount || 0}
                                    </button>

                                    <button>Reply</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>



        </div>

    )
}
