import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js"
import { User } from "../models/user.models.js"
import jwt from "jsonwebtoken"
import mongoose, { mongo } from "mongoose";
function isValidEmail(email) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return emailRegex.test(email)
}

// generate access and refresh token
const generateAccessAndRefreshToken = async (userID) => {
    try {
        const user = await User.findById(userID);

        if (!user) {
            throw new ApiError(404, "user not found")
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;     //storing in databse
        await user.save({ validateBeforeSave: false });           //saving

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, error?.message || "error occured while generating tokens")
    }
}


// Register User
export const registerUser = asyncHandler(async (req, res) => {
    // steps breaking the problem
    //receving data from frontend req.body
    //validate : data isnt empty or invalid
    //user already exists or not : check if unique data {username , email} is given for unique field 
    //image validation =we will write it later
    //create user object and enter it in db
    // remove password and refresh token from request
    // check for user creation
    // return response


    // step1 //receving data from backend
    const { fullName, userName, email, password } = req.body;
    console.log(fullName, userName, email, password)
    // step2 validation 
    if ([fullName, userName, email, password].some((field) => (field?.trim() === ""))) {
        throw new ApiError(400, "all fields are required")
    }
    //step 2.1 normalizing the data
    const normalizedEmail = email.toLowerCase();
    const normalizedUsername = userName.toLowerCase();

    // step 2.2 checking for valid email or not
    if (!isValidEmail(normalizedEmail)) {
        throw new ApiError(400, "Invalid Email");
    }

    // step 3 User existence
    const existedUser = await User.findOne({
        $or: [{ email: normalizedEmail }, { userName: normalizedUsername }]
        , _id: { $ne: userID }
    })

    if (existedUser) {
        throw new ApiError(409, "User with this email or username already exists");
    }
    console.log(existedUser)
    //step - 4 -creation and entry in db
    const user = await User.create({
        userName: normalizedUsername,
        fullName,
        password,
        email: normalizedEmail
    })

    //removing password and refreshToken
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // user creation check
    if (!createdUser) {
        throw new ApiError(500, "Failed to register User")
    }

    //response
    return res.status(201).json(new ApiResponse(201, createdUser, "User Registered Succesfully"))



})

// Login User 
export const loginUser = asyncHandler(async (req, res) => {
    // req.body -> data
    //  username,or email  //empty or not
    //find the user
    //password check
    // access and refresh token generate
    //send them in cookie

    // step 1 req.boy -> data
    const { userName, email, password } = req.body;
    if (!userName && !email) {
        throw new ApiError(400, "username or email is required")
    }
    //step 3 finding user
    const user = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User doesn't exist ")
    }

    // password check
    if (!password) {
        throw new ApiError(400, "Password is required")
    }
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User Password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // sending tokens in cookies
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }

    //response
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, {
                user: loggedInUser, accessToken, refreshToken
            },
                "User logged in Succesfully"
            )
        )


})

//Logout user

export const logOutUser = asyncHandler(async (req, res) => {
    // req.user we got from verifyJWT method will help in finding user
    // find by id and update the refreshToken
    // clear cookies
    // send response

    //step1
    const user = await User.findByIdAndUpdate(req.user?._id
        , {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    // sending tokens in cookies
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out Succesfully"));
})

//
export const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        // get the incoming refresh token 
        // check if incoming token is valid
        // verify token tp get _id
        // check if user exists
        //user also has access token we difined in schema so lets match them

        const InComingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!InComingRefreshToken) {
            throw new ApiError(401, "Unauthorized request")
        }
        const decodedToken = jwt.verify(InComingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invlid Refresh Token")
        }

        if (user?.refreshToken !== InComingRefreshToken) {
            throw new ApiError(401, "Refresh Token is Expired")
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        }
        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200,
                    { accessToken, refreshToken }
                    ,
                    "refresh token generated Succesfully"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh Token")
    }

})

export const editUserDetails = asyncHandler(async (req, res) => {
    // get data 
    // validate data 
    const { fullName, userName, bio, location, website } = req.body
    const userID = req.user._id;
    const user = await User.findById(userID);

    if (!user) {
        throw new ApiError(400, "User not found")
    }

    const cleanData = {
        fullName: fullName?.trim(),
        userName: userName?.toLowerCase().trim(),

        bio: bio?.trim(),
        location: location?.trim(),
        website: website?.trim(),
    }
    Object.keys(cleanData).forEach((key) => {
        if (cleanData[key] === "") {
            delete cleanData[key];
        }
    });

    if (
        cleanData.userName !== undefined &&
        cleanData.userName.length < 3
    ) {
        throw new ApiError(400, "username must have atleast 3 characters");
    }

    if (
        cleanData.fullName !== undefined &&
        cleanData.fullName.length < 3
    ) {
        throw new ApiError(400, "fullname must have atleast 3 characters");
    }
    if (cleanData.userName !== undefined) {

        const existingUser = await User.findOne({
            userName: cleanData.userName,
            _id: { $ne: userID }
        })

        if (existingUser) {
            throw new ApiError(400, "username is already taken")
        }
    }

    //modifying data only change what user axtually changed 

    if (cleanData.fullName !== undefined) {
        user.fullName = cleanData.fullName;
    }

    if (cleanData.userName !== undefined) {
        user.userName = cleanData.userName;
    }

    if (cleanData.bio !== undefined) {
        user.bio = cleanData.bio;
    }

    if (cleanData.location !== undefined) {
        user.location = cleanData.location;
    }

    if (cleanData.website !== undefined) {
        user.website = cleanData.website;
    }
    await user.save()

    return res.status(200).json(new ApiResponse(200, { user }, "user updated succesfully"))

})

// getUsers
export const getProfiles = asyncHandler(async (req, res) => {
    const currentUserId = req.user?._id
    const profiles = await User.find({
        _id: { $ne: currentUserId }
    }).select("-password -refreshToken")

    if (profiles.length === 0) {
        throw new ApiError(400, "failed to fetch profiles");
    }

    return res.status(200).json(new ApiResponse(200, { profiles }, "users profile fetched succesfully"))
})

export const followController = asyncHandler(async (req, res) => {
    // const session = await mongoose.startSession();

    try {
        // session.startTransaction();

        const currentUserId = req.user?._id;
        const targetUserId = req.params?._id;


        //vaildate mongo id .isValid

        if (!mongoose.Types.ObjectId.isValid(targetUserId)) {

            throw new ApiError(400, "Invalid user id");
        }
        if (!currentUserId) {
            throw new ApiError(400, "Unauthorized request")
        }
        //prevent self follow


        if (currentUserId.toString() === targetUserId.toString()) {
            throw new ApiError(400, "you can't follow yourself");
        }

        const targetUser = await User.findById(targetUserId);

        if (!targetUser) {
            throw new ApiError(404, "User not found")
        }

        //following and follower updata

        await User.findByIdAndUpdate(
            currentUserId,
            {
                $addToSet: {
                    following: targetUserId,
                }
            },
            // { session }
        )
        await User.findByIdAndUpdate(
            targetUserId,
            {
                $addToSet: {
                    followers: currentUserId,
                }
            },
            // { session }
        )

        //comit transaction
        // await session.commitTransaction();

        return res.status(200).json(new ApiResponse(200, {
            targetUserId,
            isFollowing: true
        }, `you are now following ${targetUser?.fullName}`))



    } catch (error) {
        // await session.abortTransaction();
        throw error
    } finally {
        //   session.endSession();
    }

})


export const unFollowController = asyncHandler(async (req, res) => {
    try {
        const currentUserId = req.user?._id;
        const targetUserId = req.params?._id;
        if (!mongoose.Types.ObjectId.isValid(targetUserId)) {

            throw new ApiError(400, "Invalid user id");
        }
        if (!currentUserId) {
            throw new ApiError(400, "Unauthorized request")
        }

        const targetUser = await User.findById(targetUserId);

        if (!targetUser) {
            throw new ApiError(404, "User not found")
        }
        if (currentUserId.toString() === targetUserId.toString()) {
            throw new ApiError(400, "You can't unfollow yourself");
        }

        await User.findByIdAndUpdate(
            currentUserId,
            {
                $pull: {
                    following: targetUserId,
                }
            },
            // { session }
        )
        await User.findByIdAndUpdate(
            targetUserId,
            {
                $pull: {
                    followers: currentUserId,
                }
            },
            // { session }
        )

        return res.status(200).json(new ApiResponse(200, {
            targetUserId,
            isFollowing: false
        }, `unfollowed  ${targetUser?.fullName}`))






    } catch (error) {
        throw error
    }
})