const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bestup');
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL }).select('+password');

    if (existingAdmin) {
      let changed = false;

      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        changed = true;
      }

      if (!existingAdmin.isActive) {
        existingAdmin.isActive = true;
        changed = true;
      }

      // Keep password in sync with env for predictable admin login in local dev.
      if (process.env.ADMIN_PASSWORD) {
        existingAdmin.password = process.env.ADMIN_PASSWORD;
        changed = true;
      }

      if (changed) {
        await existingAdmin.save();
        console.log('✅ Existing user promoted/updated as admin successfully!');
      } else {
        console.log('Admin user already exists and is up to date!');
      }

      console.log('Email: ' + process.env.ADMIN_EMAIL);
      console.log('Password: ' + process.env.ADMIN_PASSWORD);
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD, // Will be hashed by the model's pre-save hook
      role: 'admin',
      isActive: true,
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: ' + process.env.ADMIN_EMAIL);
    console.log('Password: ' + process.env.ADMIN_PASSWORD);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
