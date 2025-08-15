import bcrypt from "bcryptjs";                // For password hashing
import { z } from "zod";                    // For input validation
import User from "../models/user_model.js";       // Mongoose User model (adjust path as needed)
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from 'cloudinary';



const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Register a new user
// @route   POST /api/v1/users/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      bio,
      location,
      interests,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !bio || !location)
      return res.status(400).json({ message: "All required fields must be filled." });

    if (bio.length < 20)
      return res.status(400).json({ message: "Bio should be at least 20 characters." });

    if (!Array.isArray(interests) || interests.length < 3)
      return res.status(400).json({ message: "Select at least 3 interests." });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered." });
      
      if (!req.files || Object.keys(req.files).length === 0) {
  return res.status(400).json({ message: "No file uploaded" });
}

const { image } = req.files; // ✅ Safe now
console.log("req.files:", req.files);
console.log("image.tempFilePath:", req.files?.image?.tempFilePath);


         const allowedExtensions = ['image/jpeg', 'image/png' , 'image/webp' ];
        if (!allowedExtensions.includes(image.mimetype)) {
          return res.status(400).json({
            errors: "Invalid file type. Only JPG and PNG are allowed.",
          });
        }
    
try {
  console.log("📤 Uploading to Cloudinary...");
  const cloudinaryResponse = await cloudinary.uploader.upload(image.tempFilePath);
  console.log("✅ Cloudinary upload success:", cloudinaryResponse);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
    bio,
    location,
    interests: Array.isArray(interests) ? interests : [interests],
    image: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  console.log("💾 Saving user...");
  await newUser.save();
  console.log("✅ User saved successfully");

  const token = generateToken(newUser);

  return res.status(201).json({
    message: "User created successfully",
    token,
    user: {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      bio: newUser.bio,
      location: newUser.location,
      interests: newUser.interests,
      profilePicture: newUser.image,
    },
  });
} catch (error) {
  console.error("❌ Signup Error:", error);
  return res.status(500).json({ message: "Server error. Please try again." });
}
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      bio,
      location,
      interests,
      image: {
        public_id: cloudinaryResponse.public_id, // store the Cloudinary public ID
        url: cloudinaryResponse.secure_url, // store the Cloudinary URL
      } 
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        bio: newUser.bio,
        location: newUser.location,
        interests: newUser.interests,
        image: newUser.image,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};


//login 
// @desc    Login user
// @route   POST /api/v1/users/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(401).json({ message: "Invalid email or password." });

    // Compare passwords (IMPORTANT: await this)
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password." });

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio,
        location: user.location,
        interests: user.interests,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    return res.status(500).json({ message: "Server error during login." });
  }
};

//logout controller 
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ errors: "Error in logout" });
    console.log("Error in logout", error);
  }
};

// controllers/userController.js
export const getAllTravelersExceptMe = async (req, res) => {
  try {
    const { id: currentUserId } = req.user;
    const travelers = await User.find({ _id: { $ne: currentUserId } });
    res.status(200).json({ data: travelers });
  } catch (error) {
    console.error("Error fetching travelers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio, location, interests } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { bio, location, interests },
      { new: true }
    );

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};


export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.files?.image)
      return res.status(400).json({ message: "No file uploaded" });

    const cloudinaryResponse = await cloudinary.uploader.upload(req.files.image.tempFilePath);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        image: {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        },
      },
      { new: true }
    );

    res.status(200).json({ message: "Profile picture updated", image: updatedUser.image });
  } catch (error) {
    res.status(500).json({ message: "Failed to update image" });
  }
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.status(200).json(user);
};

export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.clearCookie("jwt");
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete account" });
  }
};

export const getUsersByIds = async (req, res) => {
  try {
    const { id } = req.params; // array of user IDs
    const user = await User.findById(id).select("-password");
    res.json({ success: true, data: user });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

