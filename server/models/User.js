import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // hides password in queries by default
    },
    role: {
        type: String,
        enum: ['owner', 'user'],
        default: 'user'
    },
    image: {
      type: String,
      default: ''
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
