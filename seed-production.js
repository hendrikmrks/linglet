require('dotenv').config();
const { Client } = require('pg');
const bcryptjs = require('bcryptjs');

function hydrateDbEnvFromDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    return;
  }

  try {
    const parsedUrl = new URL(process.env.DATABASE_URL);
    process.env.DB_HOST = process.env.DB_HOST || parsedUrl.hostname;
    process.env.DB_PORT = process.env.DB_PORT || parsedUrl.port || '5432';
    process.env.DB_USER = process.env.DB_USER || decodeURIComponent(parsedUrl.username || '');
    process.env.DB_PASSWORD = process.env.DB_PASSWORD || decodeURIComponent(parsedUrl.password || '');
    process.env.DB_NAME = process.env.DB_NAME || parsedUrl.pathname.replace(/^\//, '');
  } catch (error) {
    throw new Error(`Invalid DATABASE_URL: ${error.message}`);
  }
}

hydrateDbEnvFromDatabaseUrl();

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || ''),
  database: process.env.DB_NAME || 'linglet',
});

async function main() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Admin credentials - set via environment variables before running
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@linglet.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    if (!ADMIN_PASSWORD) {
      throw new Error('ADMIN_PASSWORD environment variable must be set before running this seed script');
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(ADMIN_PASSWORD, 10);

    // Check if admin already exists
    const existingAdmin = await client.query(
      'SELECT id FROM "User" WHERE email = $1',
      [ADMIN_EMAIL]
    );

    if (existingAdmin.rows.length > 0) {
      console.log('⚠️  Admin user already exists. Skipping creation.');
      return;
    }

    // Create ADMIN user
    await client.query(
      `INSERT INTO "User"
       (id, email, "passwordHash", name, plan, "isAdmin", language, "learningLanguage", xp, "streakCount", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
      ['admin-001', ADMIN_EMAIL, passwordHash, 'Admin', 'PREMIUM', true, 'de', 'en', 0, 0]
    );

    console.log('✅ Admin user created successfully');
    console.log('');
    console.log('🔐 Login credentials:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log('');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
    console.log('');

  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
