import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);  
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY || process.env.CLOUDINARY_API_SECRET
};

cloudinary.config(cloudinaryConfig);

const hasCloudinaryConfig = () =>
    cloudinaryConfig.cloud_name &&
    cloudinaryConfig.api_key &&
    cloudinaryConfig.api_secret;

    export const uploadOnCloudinary = async (localFilePath)=>{
        try {
            if (!localFilePath) {
                return null;
            }
            if (!hasCloudinaryConfig()) {
                throw new Error("Cloudinary configuration is missing. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_SECRET_KEY in Backend/.env");
            }
            //upload file
            const response = await cloudinary.uploader.upload(localFilePath ,
                {
                    resource_type : "auto"
                }
            )
            // file has been uploaded 
            return response;

        } catch (error) {
            if (localFilePath && fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);   //remove locally saved temp. files as the upload option failed
            }
            throw error
        }
    }
