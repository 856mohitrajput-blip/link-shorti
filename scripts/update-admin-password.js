const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Admin Schema
const adminSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockedUntil: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

async function updateAdminPassword() {
  try {
    console.log('🔵 Connecting to MongoDB...');
    
    // Use MONGODB_URI from environment or fallback
    const mongoUri = process.env.MONGODB_URI || "mongodb+srv://linkSorti:dummy@cluster0.i2sorie.mongodb.net/LinkShorti";
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const phoneNumber = '8059238407';
    const newPassword = 'Mohit@Rajput';

    // Find admin by phone number
    const admin = await Admin.findOne({ phoneNumber });
    
    if (!admin) {
      console.error('❌ Admin with phone number', phoneNumber, 'not found');
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log('📱 Found admin:', admin.name);
    console.log('📞 Phone:', admin.phoneNumber);
    
    // Hash new password
    console.log('🔵 Hashing new password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password and reset login attempts
    admin.password = hashedPassword;
    admin.loginAttempts = 0;
    admin.lockedUntil = null;
    await admin.save();
    
    console.log('✅ Admin password updated successfully!');
    console.log('\n📋 Updated Admin Credentials:');
    console.log('   Phone Number:', phoneNumber);
    console.log('   New Password:', newPassword);
    console.log('\n🔗 Login URL: http://localhost:3000/admin/login');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

updateAdminPassword();

