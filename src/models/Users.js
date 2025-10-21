import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false // Not required for OAuth users
  },
  googleId: {
    type: String,
    default: null
  },
  profileImage: {
    type: String,
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationOTP: {
    type: String,
    default: null
  },
  emailOTPExpires:  {
    type: Date,
    default: null
  },
});

const UserModel = mongoose.models?.User || mongoose.model('User', userSchema);

export default UserModel;
