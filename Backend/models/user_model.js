import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Invalid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Don't return password by default
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
      minlength: 20,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    interests: {
      type: [String],
      validate: [(val) => val.length >= 3, "Select at least 3 interests"],
    },
    image: {
     public_id: { type: String, required: true }, // Cloudinary public ID
     url: { type: String, required: true } // Cloudinary URL  
    },

    // 👇 Added for tracking joined activities
    joinedActivities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity", // Ensure this matches your activity schema model name
      }
    ]
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);

