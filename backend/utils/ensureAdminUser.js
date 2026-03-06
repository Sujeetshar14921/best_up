const User = require('../models/User');

const ensureAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log('Admin bootstrap skipped: ADMIN_EMAIL or ADMIN_PASSWORD is not set.');
    return;
  }

  const existing = await User.findOne({ email: adminEmail }).select('+password');

  if (existing) {
    let changed = false;

    if (existing.role !== 'admin') {
      existing.role = 'admin';
      changed = true;
    }

    if (!existing.isActive) {
      existing.isActive = true;
      changed = true;
    }

    // Keep credential in sync with env to avoid production drift.
    existing.password = adminPassword;
    changed = true;

    if (changed) {
      await existing.save();
      console.log('Admin bootstrap: existing user updated as admin.');
    } else {
      console.log('Admin bootstrap: existing admin is up to date.');
    }

    return;
  }

  await User.create({
    name: 'Admin User',
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
    isActive: true,
  });

  console.log('Admin bootstrap: admin user created.');
};

module.exports = ensureAdminUser;
