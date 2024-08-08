import express from "express";
import {
  register,
  login,
  currentUser,
  forgotPassword,
  profileUpdate,
  findPeople,
  userFollow,
  addFollower,
  userFollowing,
  userUnfollow,
  removeFollower,
  searchUser,
  getUser,
} from "../controllers/authController.js";
import { isAdmin, requireSignin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/current-user", requireSignin, currentUser);
//made this current user jisse hr koi local storage me kuch bhi daalkr dashboard  pr na jaa ske...agr token sahi h..to hi jaane do kuch bhi kaam keliye kahi bhi even after login

router.post("/forgot-password", forgotPassword);
router.put("/profile-update", requireSignin, profileUpdate);
router.get("/find-people", requireSignin, findPeople);
router.put("/user-follow", requireSignin, addFollower, userFollow);
router.get("/user-following", requireSignin, userFollowing);
router.put("/user-unfollow", requireSignin, removeFollower, userUnfollow);
router.get("/search-user/:query", searchUser);

router.get("/user/:username", getUser);

router.get("/current-admin", requireSignin, isAdmin, currentUser);

export default router;
