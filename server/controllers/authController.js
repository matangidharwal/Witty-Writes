import User from "../models/user.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

const register = async (req, res) => {
  const { name, email, password, secret } = req.body;
  if (!name) return res.json({ error: "Name is required" });
  if (!password || password.length < 6)
    return res.json({
      error: "Password is required and should be min 6 characters long",
    });
  if (!secret) return res.json({ error: "Answer is required" });
  if (!email) return res.json({ error: "Email is required" });

  //find tries to find the users(all users) with the  same email in entire database
  //findOne return the first user with the email

  //findone is better in performance

  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.json({ error: "Email is taken" });

    const hashedPassword = await hashPassword(password);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      secret,
      username: nanoid(6),
    });
    try {
      await user.save();
      return res.json({ ok: true });
    } catch (err) {
      console.log("Register failed", err);
      return res.json({ error: "Try again" });
    }
  } catch (err) {
    console.log("Error", errmessage);
    return res.status(400).send("Error. Try again.");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ error: "No user found" });

    const match = await comparePassword(password, user.password);
    if (!match) return res.json({ error: "Wrong password" });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    user.password = undefined;
    user.secret = undefined;
    res.json({ token, user });
  } catch (err) {
    console.log("Login failed", err);
    return res.status(400).send("Signin failed");
  }
};

const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.json({ error: "No user found" });
    res.json({ ok: true });
  } catch (err) {
    console.log("Current User failed", err);
    res.sendStatus(400);
  }
};

const forgotPassword = async (req, res) => {
  const { email, newPassword, secret } = req.body;
  if (!newPassword || newPassword.length < 6)
    return res.json({
      error: "Password is required and should be min 6 characters long",
    });
  if (!secret) return res.json({ error: "Answer is required" });
  try {
    const user = await User.findOne({ email, secret });
    if (!user) return res.json({ error: "Email or Answer is wrong" });
    const hashed = await hashPassword(newPassword);
    // await user.save(); another trika
    await User.findByIdAndUpdate(user._id, { password: hashed });
    return res.json({
      success: "Congrats, Now you can login with your new password",
    });
  } catch (err) {
    console.log("Forgot password failed", err);
    return res.status(400).send("Error. Try again.");
  }
};

const profileUpdate = async (req, res) => {
  try {
    const data = {};
    if (req.body.name) data.name = req.body.name;
    if (req.body.secret) data.secret = req.body.secret;
    if (req.body.about) data.about = req.body.about;
    if (req.body.username) data.username = req.body.username;
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.json({
          error: "Password must be atleast 6 characters long",
        });
      }
      data.password = await hashPassword(req.body.password);
    }
    if (req.body.image) data.image = req.body.image;
    const user = await User.findByIdAndUpdate(req.user._id, data, {
      new: true,
    });
    user.password = undefined;
    user.secret = undefined;
    res.json(user);
  } catch (err) {
    console.log("Profile update failed", err);
    if (err.code === 11000) {
      return res.json({ error: "Duplicate username" });
    }
    return res.status(400).send("Profile update failed");
  }
};

const findPeople = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const following = user.following;
    following.push(user._id);
    const people = await User.find({ _id: { $nin: following } })
      .select("-secret -password")
      .limit(10);
    // $nin means not including

    res.json(people);
  } catch (err) {
    console.log("Find People failed", err);
  }
};

const addFollower = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body._id, {
      $addToSet: { followers: req.user._id }, //addToSet is used to add unique values in array
    });
    next();
  } catch (err) {
    console.log("Add follower failed", err);
  }
};

const userFollow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { following: req.body._id },
      },
      { new: true }
    ).select("-password -secret");
    res.json(user);
  } catch (err) {
    console.log("User follow failed", err);
  }
};

const userFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const following = await User.find({ _id: user.following }).limit(100);
    res.json(following);
  } catch (err) {
    console.log("User following failed", err);
  }
};

const userUnfollow = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body._id },
      },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    console.log("User unfollow failed", err);
  }
};

const removeFollower = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body._id, {
      $pull: { followers: req.user._id },
    });
    next();
  } catch (err) {
    console.log("Remove follower failed", err);
  }
};

const searchUser = async (req, res) => {
  const { query } = req.params;
  if (!query) return;
  try {
    const user = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    }).select("-password -secret");

    //regex here is special to mongodb...query ko case insensitive banane keliye here
    res.json(user);
  } catch (err) {
    console.log("Search user failed", err);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password -secret"
    );
    res.json(user);
  } catch (err) {
    console.log("Get user failed", err);
  }
};

export {
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
};
