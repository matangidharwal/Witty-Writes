import jwt from "jsonwebtoken";
import Post from "../models/post.js";
import User from "../models/user.js";
const requireSignin = async (req, res, next) => {
  const token = req.header("token");
  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified;
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
  next();
};

const canEditDeletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params._id);

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(400).json({ error: "Unauthorized" });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== "Admin") {
      return res.status(400).json({ error: "Unauthorized" });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export { requireSignin, canEditDeletePost, isAdmin };
