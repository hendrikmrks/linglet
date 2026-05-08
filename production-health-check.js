/**
 * Production Health Check
 * 
 * Dieses Skript testet nach dem Deployment, ob alle kritischen Komponenten funktionieren.
 * 
 * Ausführung: node production-health-check.js
 */

const { Client } = require('pg');

// ANSI-Farbcodes für schöne Ausgabe
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function success(message) {
  console.log(`${colors.green}✓${colors.reset} ${message}`);
}

function error(message) {
  console.log(`${colors.red}✗${colors.reset} ${message}`);
}

function info(message) {
  console.log(`${colors.blue}ℹ${colors.reset} ${message}`);
}

function section(message) {
  console.log(`\n${colors.cyan}▶${colors.reset} ${message}`);
}

let testsPassed = 0;
let testsFailed = 0;
let warnings = 0;

async function checkDatabaseConnection() {
  section('Teste Datenbankverbindung...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    success('Datenbankverbindung erfolgreich');
    
    // Teste einfache Query
    const result = await client.query('SELECT NOW()');
    success(`Datenbank antwortet: ${result.rows[0].now}`);
    testsPassed += 2;
    
    await client.end();
  } catch (err) {
    error(`Datenbankverbindung fehlgeschlagen: ${err.message}`);
    testsFailed += 2;
    throw err;
  }
}

async function checkDatabaseSchema() {
  section('Prüfe Datenbank-Schema...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    // Prüfe ob alle wichtigen Tabellen existieren
    const requiredTables = ['User', 'Session', 'Chapter', 'Subchapter', 'Vocabulary', 'ShopItem', 'UserPurchase'];
    
    for (const table of requiredTables) {
      const result = await client.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )`,
        [table]
      );
      
      if (result.rows[0].exists) {
        success(`Tabelle "${table}" existiert`);
        testsPassed++;
      } else {
        error(`Tabelle "${table}" fehlt!`);
        testsFailed++;
      }
    }

    await client.end();
  } catch (err) {
    error(`Schema-Prüfung fehlgeschlagen: ${err.message}`);
    testsFailed++;
    throw err;
  }
}

async function checkAdminUser() {
  section('Prüfe Admin-User...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    // Prüfe ob Admin-User existiert
    const result = await client.query(
      'SELECT id, email, "isAdmin", plan FROM "User" WHERE "isAdmin" = true LIMIT 1'
    );
    
    if (result.rows.length > 0) {
      const admin = result.rows[0];
      success(`Admin-User gefunden: ${admin.email}`);
      
      if (admin.plan === 'PREMIUM') {
        success('Admin hat PREMIUM-Plan');
        testsPassed++;
      } else {
        error(`Admin hat falschen Plan: ${admin.plan}`);
        testsFailed++;
      }
      
      testsPassed++;
    } else {
      error('Kein Admin-User gefunden! Führen Sie "npm run db:seed:production" aus.');
      testsFailed += 2;
    }

    await client.end();
  } catch (err) {
    error(`Admin-Prüfung fehlgeschlagen: ${err.message}`);
    testsFailed++;
  }
}

async function checkEnvironmentVariables() {
  section('Prüfe Umgebungsvariablen...');
  
  const requiredEnvVars = [
    'DATABASE_URL',
    'AUTH_SECRET',
    'NEXT_PUBLIC_APP_URL',
    'NODE_ENV',
  ];

  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      success(`${envVar} ist gesetzt`);
      testsPassed++;
      
      // Warne bei unsicheren Werten
      if (envVar === 'AUTH_SECRET' && process.env[envVar].includes('dev_only')) {
        error(`⚠ ${envVar} enthält noch den Dev-Wert! Ändern Sie dies sofort!`);
        warnings++;
      }
      
      if (envVar === 'NODE_ENV' && process.env[envVar] !== 'production') {
        error(`⚠ NODE_ENV ist "${process.env[envVar]}", sollte aber "production" sein`);
        warnings++;
      }
    } else {
      error(`${envVar} fehlt!`);
      testsFailed++;
    }
  }
}

async function checkDataExists() {
  section('Prüfe ob Daten existieren...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    // Prüfe User
    const userCount = await client.query('SELECT COUNT(*) FROM "User"');
    const count = parseInt(userCount.rows[0].count);
    
    if (count > 0) {
      success(`${count} User in der Datenbank`);
      testsPassed++;
    } else {
      info('Keine User in der Datenbank (nur bei Erstinstallation OK)');
    }

    // Prüfe Chapters (optional, da production möglicherweise ohne Seed-Daten läuft)
    const chapterCount = await client.query('SELECT COUNT(*) FROM "Chapter"');
    const chCount = parseInt(chapterCount.rows[0].count);
    
    if (chCount > 0) {
      info(`${chCount} Kapitel in der Datenbank`);
    } else {
      info('Keine Kapitel in der Datenbank (Content muss noch hinzugefügt werden)');
    }

    await client.end();
  } catch (err) {
    error(`Daten-Prüfung fehlgeschlagen: ${err.message}`);
    testsFailed++;
  }
}

async function checkApplicationRunning() {
  section('Prüfe Anwendungsverfügbarkeit...');
  
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  try {
    // Nur informativ - fetch ist in Node.js 18+ verfügbar
    if (typeof fetch === 'undefined') {
      info(`Überspringe HTTP-Check (Node.js version zu alt)`);
      return;
    }

    const response = await fetch(appUrl, { 
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      success(`Anwendung erreichbar unter ${appUrl}`);
      testsPassed++;
    } else {
      error(`Anwendung antwortet mit Status ${response.status}`);
      testsFailed++;
    }
  } catch (err) {
    error(`Anwendung nicht erreichbar: ${err.message}`);
    info(`Überprüfen Sie: pm2 status`);
    testsFailed++;
  }
}

async function runAllChecks() {
  console.log('\n' + '='.repeat(60));
  console.log('  LINGLET APP - PRODUCTION HEALTH CHECK');
  console.log('='.repeat(60));

  try {
    await checkEnvironmentVariables();
    await checkDatabaseConnection();
    await checkDatabaseSchema();
    await checkAdminUser();
    await checkDataExists();
    
    // HTTP-Check nur wenn fetch verfügbar ist
    if (typeof fetch !== 'undefined') {
      await checkApplicationRunning();
    }

  } catch (err) {
    // Kritischer Fehler - beende frühzeitig
  }

  // Zusammenfassung
  console.log('\n' + '='.repeat(60));
  console.log('  ZUSAMMENFASSUNG');
  console.log('='.repeat(60));
  console.log(`${colors.green}Erfolgreich:${colors.reset} ${testsPassed}`);
  console.log(`${colors.red}Fehlgeschlagen:${colors.reset} ${testsFailed}`);
  
  if (warnings > 0) {
    console.log(`${colors.yellow}Warnungen:${colors.reset} ${warnings}`);
  }

  if (testsFailed === 0 && warnings === 0) {
    console.log(`\n${colors.green}✓ Alle Tests bestanden! Die Anwendung ist bereit.${colors.reset}\n`);
    process.exit(0);
  } else if (testsFailed === 0 && warnings > 0) {
    console.log(`\n${colors.yellow}⚠ Tests bestanden, aber es gibt Warnungen. Bitte beheben Sie diese.${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${colors.red}✗ Es gibt Fehler! Bitte beheben Sie diese vor dem Produktivbetrieb.${colors.reset}\n`);
    process.exit(1);
  }
}

// Starte Health Check
runAllChecks().catch((err) => {
  console.error(`\n${colors.red}Kritischer Fehler:${colors.reset}`, err.message);
  process.exit(1);
});
