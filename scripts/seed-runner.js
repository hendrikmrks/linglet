const { execFileSync } = require('child_process');
const path = require('path');
const { Client } = require('pg');

const SEED_HISTORY_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS _seed_history (
    name TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    seeded_at TIMESTAMPTZ DEFAULT NOW()
  );
`;

const DEV_TRUNCATE_TABLES = [
  '"VocabularyReport"',
  '"Vocabulary"',
  '"Subchapter"',
  '"Chapter"',
  '"UserPurchase"',
  '"ShopItem"',
  '"PremiumRequest"',
  '"Session"',
  '"UserLevelProgress"',
  '"UserBadge"',
  '"Badge"',
  '"LearningLevel"',
  '"LearningChapter"',
  '"User"',
];

function parseEnvFlag(argv) {
  const envFlagIndex = argv.indexOf('--env');

  if (envFlagIndex === -1 || !argv[envFlagIndex + 1]) {
    throw new Error('Missing required --env flag. Use --env prod or --env dev.');
  }

  const environment = argv[envFlagIndex + 1];

  if (environment !== 'prod' && environment !== 'dev') {
    throw new Error(`Invalid --env value "${environment}". Use prod or dev.`);
  }

  return environment;
}

function hydrateDbEnvFromDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable must be set before running this seed runner');
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

function ensureRequiredEnv() {
  if (!process.env.ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD environment variable must be set before running this seed runner');
  }

  process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@linglet.de';
}

function createClient() {
  return new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD || ''),
    database: process.env.DB_NAME || 'linglet',
  });
}

async function ensureSeedHistoryTable(client) {
  await client.query(SEED_HISTORY_TABLE_SQL);
}

async function isProductionAlreadySeeded(client) {
  const result = await client.query(
    `SELECT 1 FROM _seed_history WHERE name = $1 AND status = $2 LIMIT 1`,
    ['initial', 'completed']
  );

  return result.rows.length > 0;
}

async function markProductionSeedCompleted(client) {
  await client.query(
    `INSERT INTO _seed_history (name, status)
     VALUES ($1, $2)
     ON CONFLICT (name)
     DO UPDATE SET status = EXCLUDED.status, seeded_at = NOW()`,
    ['initial', 'completed']
  );
}

async function truncateDevData(client) {
  console.log('Cleaning development data...');
  await client.query(`TRUNCATE TABLE ${DEV_TRUNCATE_TABLES.join(', ')} CASCADE;`);
}

function runProductionSeedScript() {
  const seedScriptPath = path.resolve(__dirname, '..', 'seed-production-complete.js');

  console.log(`Running seed script: ${path.basename(seedScriptPath)}`);
  execFileSync(process.execPath, [seedScriptPath], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit',
    env: process.env,
  });
}

async function runProdSeed() {
  const client = createClient();

  try {
    await client.connect();
    await ensureSeedHistoryTable(client);

    if (await isProductionAlreadySeeded(client)) {
      console.log('Already seeded, skipping.');
      return;
    }
  } finally {
    await client.end();
  }

  runProductionSeedScript();

  const historyClient = createClient();

  try {
    await historyClient.connect();
    await ensureSeedHistoryTable(historyClient);
    await markProductionSeedCompleted(historyClient);
    console.log('Production seed marked as completed.');
  } finally {
    await historyClient.end();
  }
}

async function runDevSeed() {
  const client = createClient();

  try {
    await client.connect();
    await ensureSeedHistoryTable(client);
    await truncateDevData(client);
  } finally {
    await client.end();
  }

  runProductionSeedScript();
}

async function main() {
  const environment = parseEnvFlag(process.argv.slice(2));

  hydrateDbEnvFromDatabaseUrl();
  ensureRequiredEnv();

  console.log(`Starting seed runner for ${environment}...`);

  if (environment === 'prod') {
    await runProdSeed();
  } else {
    await runDevSeed();
  }

  console.log('Seeding completed successfully.');
}

main().catch((error) => {
  console.error('Seed runner failed:', error.message);
  process.exit(1);
});
