import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPostController, getFeedPosts } from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();


router.get("/", verifyJWT, getFeedPosts);

router.post(
  "/create-post",
  verifyJWT,
  upload.array("images", 5),  //5 images allowed
  createPostController
);

export default router;
