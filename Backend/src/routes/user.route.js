import { Router } from "express";
import { registerUser, loginUser, logOutUser, refreshAccessToken , editUserDetails, getProfiles, followController, unFollowController } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "User route working"
  });
});

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// protected routes
router.route("/editprofile").patch(verifyJWT , editUserDetails);
router.route("/getprofiles").get(verifyJWT , getProfiles);
router.route("/:_id/follow").post(verifyJWT , followController);
router.route("/:_id/unfollow").delete(verifyJWT , unFollowController);


router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
