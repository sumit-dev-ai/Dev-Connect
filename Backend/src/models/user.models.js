import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        index: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: 6,
    },
    bio: {
        type: String,
        default: "",
        maxlength: 200,
    },

    location: {
        type: String,
        default: "India",
    },

    profilePicture: {
        type: String,
        default: "https://github.com/shadcn.png",
    },

    coverPicture: {
        type: String,
        default: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },

    website: {
        type: String,
        default: "",
    },

    // SOCIAL LINKS
    socialLinks: {
        github: {
            type: String,
            default: "",
        },

        linkedin: {
            type: String,
            default: "",
        },

        twitter: {
            type: String,
            default: "",
        },
    },
    // RELATIONS
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],

    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],

    refreshToken: {
        type: String,
    }


}, { timestamps: true })

//tokens
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

//hashing password
userSchema.pre("save", async function () {
    // ONLY HASH IF PASSWORD MODIFIED
    if (!this.isModified("password")) {
        return ;
    }
    // HASH PASSWORD
    this.password = await bcrypt.hash(this.password, 10);
    
});
userSchema.methods.isPasswordCorrect =
async function (password) {

  return await bcrypt.compare(
    password,
    this.password
  );
};

export const User = mongoose.model("User", userSchema);