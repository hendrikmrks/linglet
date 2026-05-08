const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'linglet',
});

// Generate unique IDs
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}`;

async function seedChapter() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Deutsch => Portugiesisch - Kapitel 5: Körper & Kleidung
    const chapter = {
      title: 'Körper & Kleidung',
      description: 'Körperteile, Kleidung und Erscheinungsbild',
      order: 5,
      subchapters: [
        {
          title: 'Körperteile',
          description: 'Bezeichnungen für Körperteile',
          order: 1,
          vocabulary: [
            { word: 'Kopf', translation: 'Cabeça', example: 'Ich habe Kopfschmerzen.', translatedExample: 'Eu tenho dor de cabeça.', order: 1 },
            { word: 'Auge', translation: 'Olho', example: 'Sie hat blaue Augen.', translatedExample: 'Ela tem olhos azuis.', order: 2 },
            { word: 'Nase', translation: 'Nariz', example: 'Meine Nase ist kalt.', translatedExample: 'Meu nariz está frio.', order: 3 },
            { word: 'Mund', translation: 'Boca', example: 'Öffne den Mund bitte.', translatedExample: 'Abra a boca por favor.', order: 4 },
            { word: 'Ohr', translation: 'Orelha', example: 'Ich kann dich nicht hören.', translatedExample: 'Eu não consigo te ouvir.', order: 5 },
            { word: 'Arm', translation: 'Braço', example: 'Er hat starke Arme.', translatedExample: 'Ele tem braços fortes.', order: 6 },
            { word: 'Hand', translation: 'Mão', example: 'Gib mir deine Hand.', translatedExample: 'Me dá a sua mão.', order: 7 },
            { word: 'Bein', translation: 'Perna', example: 'Mein Bein tut weh.', translatedExample: 'Minha perna dói.', order: 8 },
            { word: 'Fuß', translation: 'Pé', example: 'Meine Füße sind müde.', translatedExample: 'Meus pés estão cansados.', order: 9 },
            { word: 'Bauch', translation: 'Barriga', example: 'Mein Bauch knurrt.', translatedExample: 'Minha barriga está roncando.', order: 10 },
          ],
        },
        {
          title: 'Kleidung',
          description: 'Verschiedene Kleidungsstücke',
          order: 2,
          vocabulary: [
            { word: 'Hemd', translation: 'Camisa', example: 'Er trägt ein weißes Hemd.', translatedExample: 'Ele usa uma camisa branca.', order: 1 },
            { word: 'Hose', translation: 'Calça', example: 'Diese Hose ist zu eng.', translatedExample: 'Esta calça está muito apertada.', order: 2 },
            { word: 'Kleid', translation: 'Vestido', example: 'Sie trägt ein rotes Kleid.', translatedExample: 'Ela usa um vestido vermelho.', order: 3 },
            { word: 'Jacke', translation: 'Jaqueta', example: 'Nimm eine Jacke mit, es ist kalt.', translatedExample: 'Leva uma jaqueta, está frio.', order: 4 },
            { word: 'Schuhe', translation: 'Sapatos', example: 'Diese Schuhe sind neu.', translatedExample: 'Estes sapatos são novos.', order: 5 },
            { word: 'Socken', translation: 'Meias', example: 'Ich brauche neue Socken.', translatedExample: 'Eu preciso de meias novas.', order: 6 },
            { word: 'Pullover', translation: 'Suéter', example: 'Dieser Pullover ist warm.', translatedExample: 'Este suéter é quente.', order: 7 },
            { word: 'Rock', translation: 'Saia', example: 'Sie trägt einen kurzen Rock.', translatedExample: 'Ela usa uma saia curta.', order: 8 },
            { word: 'Mantel', translation: 'Casaco', example: 'Im Winter brauche ich einen Mantel.', translatedExample: 'No inverno eu preciso de um casaco.', order: 9 },
            { word: 'Mütze', translation: 'Gorro', example: 'Ich trage eine Mütze im Winter.', translatedExample: 'Eu uso um gorro no inverno.', order: 10 },
          ],
        },
        {
          title: 'Farben & Aussehen',
          description: 'Farben und Beschreibung des Äußeren',
          order: 3,
          vocabulary: [
            { word: 'groß', translation: 'alto/grande', example: 'Er ist sehr groß.', translatedExample: 'Ele é muito alto.', order: 1 },
            { word: 'klein', translation: 'baixo/pequeno', example: 'Das Kind ist noch klein.', translatedExample: 'A criança ainda é pequena.', order: 2 },
            { word: 'lang', translation: 'longo', example: 'Sie hat langes Haar.', translatedExample: 'Ela tem cabelo longo.', order: 3 },
            { word: 'kurz', translation: 'curto', example: 'Er hat kurze Haare.', translatedExample: 'Ele tem cabelo curto.', order: 4 },
            { word: 'dünn', translation: 'magro/fino', example: 'Das Buch ist sehr dünn.', translatedExample: 'O livro é muito fino.', order: 5 },
            { word: 'dick', translation: 'gordo/grosso', example: 'Der Baum ist dick.', translatedExample: 'A árvore é grossa.', order: 6 },
            { word: 'jung', translation: 'jovem', example: 'Sie sieht sehr jung aus.', translatedExample: 'Ela parece muito jovem.', order: 7 },
            { word: 'alt', translation: 'velho/idoso', example: 'Er ist schon alt.', translatedExample: 'Ele já é velho.', order: 8 },
            { word: 'schön', translation: 'bonito/lindo', example: 'Das ist eine schöne Aussicht.', translatedExample: 'Essa é uma vista linda.', order: 9 },
            { word: 'hässlich', translation: 'feio', example: 'Der Film war hässlich.', translatedExample: 'O filme foi feio.', order: 10 },
          ],
        },
        {
          title: 'Zahlen 11–20',
          description: 'Zahlen von elf bis zwanzig',
          order: 4,
          vocabulary: [
            { word: 'elf', translation: 'onze', example: 'Ich bin elf Jahre alt.', translatedExample: 'Eu tenho onze anos.', order: 1 },
            { word: 'zwölf', translation: 'doze', example: 'Es ist zwölf Uhr.', translatedExample: 'São doze horas.', order: 2 },
            { word: 'dreizehn', translation: 'treze', example: 'Der Bus kommt um dreizehn Uhr.', translatedExample: 'O ônibus vem às treze horas.', order: 3 },
            { word: 'vierzehn', translation: 'catorze', example: 'Sie wohnt in Nummer vierzehn.', translatedExample: 'Ela mora no número catorze.', order: 4 },
            { word: 'fünfzehn', translation: 'quinze', example: 'Ich warte seit fünfzehn Minuten.', translatedExample: 'Estou esperando há quinze minutos.', order: 5 },
            { word: 'sechzehn', translation: 'dezesseis', example: 'Er ist sechzehn Jahre alt.', translatedExample: 'Ele tem dezesseis anos.', order: 6 },
            { word: 'siebzehn', translation: 'dezessete', example: 'Der Zug fährt um siebzehn Uhr.', translatedExample: 'O trem parte às dezessete horas.', order: 7 },
            { word: 'achtzehn', translation: 'dezoito', example: 'Mit achtzehn darf man wählen.', translatedExample: 'Com dezoito anos pode-se votar.', order: 8 },
            { word: 'neunzehn', translation: 'dezenove', example: 'Es ist neunzehn Grad draußen.', translatedExample: 'Estão dezenove graus lá fora.', order: 9 },
            { word: 'zwanzig', translation: 'vinte', example: 'Ich habe zwanzig Euro.', translatedExample: 'Eu tenho vinte euros.', order: 10 },
          ],
        },
        {
          title: 'Große Zahlen',
          description: 'Zahlen ab einundzwanzig',
          order: 5,
          vocabulary: [
            { word: 'einundzwanzig', translation: 'vinte e um', example: 'Ich bin einundzwanzig Jahre alt.', translatedExample: 'Eu tenho vinte e um anos.', order: 1 },
            { word: 'dreißig', translation: 'trinta', example: 'Er ist dreißig Jahre alt.', translatedExample: 'Ele tem trinta anos.', order: 2 },
            { word: 'vierzig', translation: 'quarenta', example: 'Sie arbeitet seit vierzig Jahren.', translatedExample: 'Ela trabalha há quarenta anos.', order: 3 },
            { word: 'fünfzig', translation: 'cinquenta', example: 'Das kostet fünfzig Euro.', translatedExample: 'Isso custa cinquenta euros.', order: 4 },
            { word: 'sechzig', translation: 'sessenta', example: 'Er ist sechzig Jahre alt.', translatedExample: 'Ele tem sessenta anos.', order: 5 },
            { word: 'siebzig', translation: 'setenta', example: 'Mein Opa ist siebzig.', translatedExample: 'Meu avô tem setenta anos.', order: 6 },
            { word: 'achtzig', translation: 'oitenta', example: 'Der Opa wurde achtzig.', translatedExample: 'O avô completou oitenta anos.', order: 7 },
            { word: 'neunzig', translation: 'noventa', example: 'Sie läuft neunzig Kilometer pro Woche.', translatedExample: 'Ela corre noventa quilômetros por semana.', order: 8 },
            { word: 'hundert', translation: 'cem', example: 'Das Buch kostet hundert Euro.', translatedExample: 'O livro custa cem euros.', order: 9 },
            { word: 'tausend', translation: 'mil', example: 'Das Auto kostet tausend Euro.', translatedExample: 'O carro custa mil euros.', order: 10 },
          ],
        },
      ],
    };

    console.log(`\n📚 Creating DE => PT-BR: ${chapter.title}`);
    const chapterId = generateId('ch-de-pt');
    console.log(`  Creating chapter: ${chapter.title}`);

    await client.query(
      `INSERT INTO "Chapter" 
       (id, title, description, "order", language, "sourceLanguage", "targetLanguage", "isFeatured", "isLocked", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
      [chapterId, chapter.title, chapter.description, chapter.order, 'pt-br', 'de', 'pt-br', false, false]
    );

    for (const subchapter of chapter.subchapters) {
      const subchapterId = generateId('sub-de-pt');
      console.log(`    Creating subchapter: ${subchapter.title}`);

      await client.query(
        `INSERT INTO "Subchapter"
         (id, "chapterId", title, description, "order", "isLocked", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [subchapterId, chapterId, subchapter.title, subchapter.description, subchapter.order, false]
      );

      for (const vocab of subchapter.vocabulary) {
        const vocabId = generateId('voc-de-pt');
        await client.query(
          `INSERT INTO "Vocabulary"
           (id, "subchapterId", word, translation, example, "translatedExample", "order", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
          [vocabId, subchapterId, vocab.word, vocab.translation, vocab.example, vocab.translatedExample, vocab.order]
        );
      }
    }

    console.log(`\n✅ Successfully seeded: ${chapter.title}`);
    console.log(`   - ${chapter.subchapters.length} subchapters`);
    console.log(`   - ${chapter.subchapters.reduce((sum, sub) => sum + sub.vocabulary.length, 0)} vocabulary items`);

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedChapter();
