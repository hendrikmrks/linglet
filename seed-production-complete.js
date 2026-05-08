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

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || ''),
  database: process.env.DB_NAME || 'linglet',
};

const client = new Client(DB_CONFIG);

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

async function seedFaqs() {
  console.log('\n❓ Seeding premium FAQ entries...\n');

  const faqClient = new Client(DB_CONFIG);
  const starterFaqs = [
    {
      question: 'Welche Vorteile habe ich mit Premium?',
      answer: 'Mit Premium bekommst du Zugriff auf alle Premium-Funktionen wie erweiterte Inhalte, priorisierten Support und zusätzliche Lernoptionen.',
      order: 0,
      language: 'de',
      isActive: true,
    },
    {
      question: 'Wie viel kostet Premium?',
      answer: 'Der Premium-Plan kostet aktuell 9,99 € pro Monat. Details erhältst du nach deiner Anfrage im Upgrade-Bereich.',
      order: 1,
      language: 'de',
      isActive: true,
    },
    {
      question: 'Wie funktioniert die Kündigung?',
      answer: 'Du kannst dein Premium-Abo jederzeit zum Ende der aktuellen Laufzeit kündigen. Wende dich dafür einfach an den Support.',
      order: 2,
      language: 'de',
      isActive: true,
    },
    {
      question: 'Gibt es eine Testphase?',
      answer: 'Falls wir gerade eine Testphase anbieten, informieren wir dich direkt nach deiner Premium-Anfrage über die genauen Konditionen.',
      order: 3,
      language: 'de',
      isActive: true,
    },
    {
      question: 'Wie schnell wird mein Upgrade aktiviert?',
      answer: 'Wir prüfen deine Premium-Anfrage manuell. Nach der Freigabe wird dein Account so schnell wie möglich auf Premium umgestellt.',
      order: 4,
      language: 'de',
      isActive: true,
    },
  ];

  try {
    await faqClient.connect();

    for (const faq of starterFaqs) {
      const existingFaq = await faqClient.query(
        'SELECT id FROM "Faq" WHERE question = $1 AND language = $2 LIMIT 1',
        [faq.question, faq.language]
      );

      if (existingFaq.rows.length > 0) {
        console.log(`⚠️  FAQ already exists: ${faq.question}`);
        continue;
      }

      await faqClient.query(
        `INSERT INTO "Faq" (id, question, answer, "order", language, "isActive", "createdAt", "updatedAt")
         VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, NOW(), NOW())`,
        [faq.question, faq.answer, faq.order, faq.language, faq.isActive]
      );

      console.log(`✅ FAQ seeded: ${faq.question}`);
    }
  } catch (error) {
    console.error('❌ Error seeding FAQs:', error.message);
    throw error;
  } finally {
    await faqClient.end();
  }
}

async function seedChapters() {
  console.log('\n📚 Seeding Portuguese-German chapters...\n');

  try {
    execSync(`node seed-all-pt-de.js`, {
      stdio: 'inherit',
      env: process.env
    });
  } catch (error) {
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
    console.log('STEP 2: Seeding Premium FAQ');
    console.log(`${'='.repeat(60)}\n`);

    await seedFaqs();

    console.log(`\n${'='.repeat(60)}`);
    console.log('STEP 3: Seeding Language Content');
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
