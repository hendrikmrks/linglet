require('dotenv').config();
const { Client } = require('pg');
const bcryptjs = require('bcryptjs');
const { execSync } = require('child_process');

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

async function createAdmin() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

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
    } else {
      // Create ADMIN user
      await client.query(
        `INSERT INTO "User"
         (id, email, "passwordHash", name, plan, "isAdmin", language, "learningLanguage", xp, "streakCount", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
        ['admin-001', ADMIN_EMAIL, passwordHash, 'Admin', 'PREMIUM', true, 'de', 'pt-br', 0, 0]
      );

      console.log('✅ Admin user created successfully');
      console.log('');
      console.log('🔐 Login credentials:');
      console.log(`   Email: ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
      console.log('');
      console.log('⚠️  IMPORTANT: Change this password after first login!');
    }

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

async function seedChapters() {
  console.log('\n📚 Seeding Portuguese-German chapters...\n');

  const seedFiles = [
    { file: 'seed-de-pt-chapter1-grundlagen.js', name: 'DE→PT: Grundlagen' },
    { file: 'seed-de-pt-chapter2-alltag.js', name: 'DE→PT: Alltag' },
    { file: 'seed-de-pt-chapter3-zu-hause.js', name: 'DE→PT: Zu Hause' },
    { file: 'seed-de-pt-chapter4-freizeit.js', name: 'DE→PT: Freizeit' },
    { file: 'seed-pt-de-chapter1-fundamentos.js', name: 'PT→DE: Fundamentos' },
    { file: 'seed-pt-de-chapter2-dia-a-dia.js', name: 'PT→DE: Dia a dia' },
    { file: 'seed-pt-de-chapter3-casa.js', name: 'PT→DE: Casa' },
    { file: 'seed-pt-de-chapter4-lazer.js', name: 'PT→DE: Lazer' },
  ];

  let successCount = 0;
  let failCount = 0;

  for (const { file, name } of seedFiles) {
    try {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📖 Seeding: ${name}`);
      console.log(`${'='.repeat(60)}`);
      
      execSync(`node ${file}`, { 
        stdio: 'inherit',
        env: process.env 
      });
      
      successCount++;
    } catch (error) {
      console.error(`\n❌ Failed to seed ${name}`);
      failCount++;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 CHAPTER SEEDING COMPLETE');
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ Successfully seeded: ${successCount}/${seedFiles.length} chapters`);
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount}/${seedFiles.length} chapters`);
  }
  console.log('\n📚 Total content created:');
  console.log('   - 8 chapters (4 per language direction)');
  console.log('   - 40 subchapters (5 per chapter)');
  console.log('   - 400 vocabulary items (10 per subchapter)');
  console.log('');

  if (failCount > 0) {
    throw new Error('Some chapters failed to seed');
  }
}

async function main() {
  try {
    console.log('🚀 Starting Production Database Seeding...\n');
    console.log(`${'='.repeat(60)}`);
    console.log('STEP 1: Creating Admin User');
    console.log(`${'='.repeat(60)}\n`);

    await createAdmin();

    console.log(`\n${'='.repeat(60)}`);
    console.log('STEP 2: Seeding Language Content');
    console.log(`${'='.repeat(60)}\n`);

    await seedChapters();

    console.log(`\n${'='.repeat(60)}`);
    console.log('✅ PRODUCTION SEEDING COMPLETE!');
    console.log(`${'='.repeat(60)}\n`);
    console.log('Your database is now ready for production use.');
    console.log('');

  } catch (error) {
    console.error('\n❌ Production seeding failed:', error.message);
    process.exit(1);
  }
}

main();
