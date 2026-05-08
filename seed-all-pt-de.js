const { execSync } = require('child_process');

console.log('🚀 Starting Portuguese-German content seeding...\n');

const seedFiles = [
  { file: 'seed-de-pt-chapter1-grundlagen.js', name: 'DE→PT: Grundlagen' },
  { file: 'seed-de-pt-chapter2-alltag.js', name: 'DE→PT: Alltag' },
  { file: 'seed-de-pt-chapter3-zu-hause.js', name: 'DE→PT: Zu Hause' },
  { file: 'seed-de-pt-chapter4-freizeit.js', name: 'DE→PT: Freizeit' },
  { file: 'seed-de-pt-chapter5-koerper-kleidung.js', name: 'DE→PT: Körper & Kleidung' },
  { file: 'seed-de-pt-chapter6-zeit-sprache.js', name: 'DE→PT: Zeit & Sprache' },
  { file: 'seed-de-pt-chapter7-berufe-ausbildung.js', name: 'DE→PT: Berufe & Ausbildung' },
  { file: 'seed-de-pt-chapter8-essen-gesundheit.js', name: 'DE→PT: Essen gehen & Gesundheit' },
  { file: 'seed-de-pt-chapter9-stadt-orientierung.js', name: 'DE→PT: Stadt & Orientierung' },
  { file: 'seed-de-pt-chapter10-technologie-medien.js', name: 'DE→PT: Technologie & Medien' },
  { file: 'seed-de-pt-chapter11-gesellschaft-kultur.js', name: 'DE→PT: Gesellschaft & Kultur' },
  { file: 'seed-de-pt-chapter12-gefuehle-beziehungen.js', name: 'DE→PT: Gefühle & Beziehungen' },
  { file: 'seed-de-pt-chapter13-umwelt-nachhaltigkeit.js', name: 'DE→PT: Umwelt & Nachhaltigkeit' },
  { file: 'seed-de-pt-chapter14-arbeit-wirtschaft.js', name: 'DE→PT: Arbeit & Wirtschaft' },
  { file: 'seed-pt-de-chapter1-fundamentos.js', name: 'PT→DE: Fundamentos' },
  { file: 'seed-pt-de-chapter2-dia-a-dia.js', name: 'PT→DE: Dia a dia' },
  { file: 'seed-pt-de-chapter3-casa.js', name: 'PT→DE: Casa' },
  { file: 'seed-pt-de-chapter4-lazer.js', name: 'PT→DE: Lazer' },
  { file: 'seed-pt-de-chapter5-corpo-roupas.js', name: 'PT→DE: Corpo & Roupas' },
  { file: 'seed-pt-de-chapter6-tempo-linguagem.js', name: 'PT→DE: Tempo & Linguagem' },
  { file: 'seed-pt-de-chapter7-profissoes-educacao.js', name: 'PT→DE: Profissões & Educação' },
  { file: 'seed-pt-de-chapter8-restaurante-saude.js', name: 'PT→DE: Restaurante & Saúde' },
  { file: 'seed-pt-de-chapter9-cidade-orientacao.js', name: 'PT→DE: Cidade & Orientação' },
  { file: 'seed-pt-de-chapter10-tecnologia-midia.js', name: 'PT→DE: Tecnologia & Mídia' },
  { file: 'seed-pt-de-chapter11-sociedade-cultura.js', name: 'PT→DE: Sociedade & Cultura' },
  { file: 'seed-pt-de-chapter12-sentimentos-relacionamentos.js', name: 'PT→DE: Sentimentos & Relacionamentos' },
  { file: 'seed-pt-de-chapter13-meio-ambiente.js', name: 'PT→DE: Meio Ambiente & Sustentabilidade' },
  { file: 'seed-pt-de-chapter14-trabalho-economia.js', name: 'PT→DE: Trabalho & Economia' },
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
console.log('📊 SEEDING COMPLETE');
console.log(`${'='.repeat(60)}`);
console.log(`✅ Successfully seeded: ${successCount}/${seedFiles.length} chapters`);
if (failCount > 0) {
  console.log(`❌ Failed: ${failCount}/${seedFiles.length} chapters`);
}
console.log('\n📚 Total content created:');
console.log('   - 28 chapters (14 per language direction)');
console.log('   - 140 subchapters (5 per chapter)');
console.log('   - 1400 vocabulary items (10 per subchapter)');
console.log('');

if (failCount > 0) {
  process.exit(1);
}
