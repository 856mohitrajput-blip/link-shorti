const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB URI - Update this with your connection string
const MONGODB_URI = "mongodb+srv://linkSorti:dummy@cluster0.i2sorie.mongodb.net/LinkShorti";

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

async function createAdmin() {
  try {
    console.log('🔵 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const phoneNumber = '8059238407';
    const password = 'A';
    const name = 'Super Admin';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ phoneNumber });
    if (existingAdmin) {
      console.log('⚠️  Admin with this phone number already exists');
      console.log('📱 Phone:', existingAdmin.phoneNumber);
      console.log('👤 Name:', existingAdmin.name);
      
      // Update password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      existingAdmin.password = hashedPassword;
      existingAdmin.loginAttempts = 0;
      existingAdmin.lockedUntil = null;
      await existingAdmin.save();
      console.log('✅ Admin password updated successfully');
    } else {
      // Hash password
      console.log('🔵 Hashing password...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create admin
      console.log('🔵 Creating admin account...');
      const admin = new Admin({
        phoneNumber,
        password: hashedPassword,
        name,
        loginAttempts: 0,
      });

      await admin.save();
      console.log('✅ Admin account created successfully!');
    }

    console.log('\n📋 Admin Credentials:');
    console.log('   Phone Number: 8059238407');
    console.log('   Password: A');
    console.log('\n🔗 Login URL: http://localhost:3000/admin/login');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAdmin();
