import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

/**
 * Idempotent Admin Account Seeding Script.
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from validated environment variables.
 * Creates an initial admin account if not already present.
 */
export const seedAdmin = async (): Promise<void> => {
  try {
    console.log('🌱 Starting admin seed process...');
    await connectDatabase();

    const adminEmail = env.ADMIN_EMAIL;
    const adminPassword = env.ADMIN_PASSWORD;

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`ℹ️ Admin account already exists for: ${adminEmail} (Role: ${existingAdmin.role})`);
      return;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

    const newAdmin = await User.create({
      name: 'System Admin',
      email: adminEmail,
      passwordHash,
      role: 'admin',
    });

    console.log(`✅ Admin account successfully seeded: ${newAdmin.email} (Role: ${newAdmin.role})`);
  } catch (error) {
    console.error('❌ Failed to seed admin account:', error instanceof Error ? error.message : error);
    throw error;
  } finally {
    await disconnectDatabase();
  }
};

// Check if executed directly via CLI
seedAdmin()
  .then(() => {
    console.log('🌱 Admin seed script completed.');
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
