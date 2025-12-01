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
  tempPassword: {
    type: String,
    default: null
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockedAt: {
    type: Date,
    default: null
  },
  blockedReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

const UserModel = mongoose.models?.User || mongoose.model('User', userSchema);

export default UserModel;
