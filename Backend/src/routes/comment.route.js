import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createComment, getComments } from "../controllers/comment.controller.js";

const router = Router();

router.route("/:postId/create-comment").post(verifyJWT,createComment);
router.route("/:postId/comments").get(verifyJWT,getComments);


export default router;