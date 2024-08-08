import express from "express";
import {
  requireSignin,
  canEditDeletePost,
  isAdmin,
} from "../middlewares/auth.js";
import formidable from "express-formidable";
import {
  createPost,
  uploadImage,
  postsByUser,
  userPost,
  updatePost,
  deletePost,
  newsFeed,
  likePost,
  unlikePost,
  addComment,
  removeComment,
  totalPosts,
  posts,
  getPost,
} from "../controllers/postController.js";
const router = express.Router();

router.post("/create-post", requireSignin, createPost);
router.post(
  "/upload-image",
  requireSignin,
  formidable({ maxFileSize: 32 * 1024 * 1024 }),
  uploadImage
);
router.get("/user-posts", requireSignin, postsByUser);
router.get("/user-post/:_id", requireSignin, userPost);
router.put("/update-post/:_id", requireSignin, canEditDeletePost, updatePost);
//canEditDeletePost is a middleware that checks if the user is the owner of the post or not vrna koi bhi change krlega after logging in

router.delete(
  "/delete-post/:_id",
  requireSignin,
  canEditDeletePost,
  deletePost
);

router.get("/news-feed/:page", requireSignin, newsFeed);
router.put("/like-post", requireSignin, likePost);
router.put("/unlike-post", requireSignin, unlikePost);

router.put("/add-comment", requireSignin, addComment);
router.put("/remove-comment", requireSignin, removeComment);
router.get("/total-posts", totalPosts);

router.get("/posts", posts);

router.get("/post/:_id", getPost);
//for SEO h ye jb home se kisiblog pr click krkr vaha jaaenge

//admin access keliye to delete post
router.delete("/admin/delete-post/:_id", requireSignin, isAdmin, deletePost);

export default router;
