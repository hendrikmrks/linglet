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

    // Portugiesisch => Deutsch - Capítulo 5: Corpo & Roupas
    const chapter = {
      title: 'Corpo & Roupas',
      description: 'Partes do corpo, roupas e aparência',
      order: 5,
      subchapters: [
        {
          title: 'Partes do Corpo',
          description: 'Nomes das partes do corpo',
          order: 1,
          vocabulary: [
            { word: 'Cabeça', translation: 'Kopf', example: 'Eu tenho dor de cabeça.', translatedExample: 'Ich habe Kopfschmerzen.', order: 1 },
            { word: 'Olho', translation: 'Auge', example: 'Ela tem olhos azuis.', translatedExample: 'Sie hat blaue Augen.', order: 2 },
            { word: 'Nariz', translation: 'Nase', example: 'Meu nariz está frio.', translatedExample: 'Meine Nase ist kalt.', order: 3 },
            { word: 'Boca', translation: 'Mund', example: 'Abra a boca por favor.', translatedExample: 'Öffne den Mund bitte.', order: 4 },
            { word: 'Orelha', translation: 'Ohr', example: 'Eu não consigo te ouvir.', translatedExample: 'Ich kann dich nicht hören.', order: 5 },
            { word: 'Braço', translation: 'Arm', example: 'Ele tem braços fortes.', translatedExample: 'Er hat starke Arme.', order: 6 },
            { word: 'Mão', translation: 'Hand', example: 'Me dá a sua mão.', translatedExample: 'Gib mir deine Hand.', order: 7 },
            { word: 'Perna', translation: 'Bein', example: 'Minha perna dói.', translatedExample: 'Mein Bein tut weh.', order: 8 },
            { word: 'Pé', translation: 'Fuß', example: 'Meus pés estão cansados.', translatedExample: 'Meine Füße sind müde.', order: 9 },
            { word: 'Barriga', translation: 'Bauch', example: 'Minha barriga está roncando.', translatedExample: 'Mein Bauch knurrt.', order: 10 },
          ],
        },
        {
          title: 'Roupas',
          description: 'Diferentes peças de roupa',
          order: 2,
          vocabulary: [
            { word: 'Camisa', translation: 'Hemd', example: 'Ele usa uma camisa branca.', translatedExample: 'Er trägt ein weißes Hemd.', order: 1 },
            { word: 'Calça', translation: 'Hose', example: 'Esta calça está muito apertada.', translatedExample: 'Diese Hose ist zu eng.', order: 2 },
            { word: 'Vestido', translation: 'Kleid', example: 'Ela usa um vestido vermelho.', translatedExample: 'Sie trägt ein rotes Kleid.', order: 3 },
            { word: 'Jaqueta', translation: 'Jacke', example: 'Leva uma jaqueta, está frio.', translatedExample: 'Nimm eine Jacke mit, es ist kalt.', order: 4 },
            { word: 'Sapatos', translation: 'Schuhe', example: 'Estes sapatos são novos.', translatedExample: 'Diese Schuhe sind neu.', order: 5 },
            { word: 'Meias', translation: 'Socken', example: 'Eu preciso de meias novas.', translatedExample: 'Ich brauche neue Socken.', order: 6 },
            { word: 'Suéter', translation: 'Pullover', example: 'Este suéter é quente.', translatedExample: 'Dieser Pullover ist warm.', order: 7 },
            { word: 'Saia', translation: 'Rock', example: 'Ela usa uma saia curta.', translatedExample: 'Sie trägt einen kurzen Rock.', order: 8 },
            { word: 'Casaco', translation: 'Mantel', example: 'No inverno eu preciso de um casaco.', translatedExample: 'Im Winter brauche ich einen Mantel.', order: 9 },
            { word: 'Gorro', translation: 'Mütze', example: 'Eu uso um gorro no inverno.', translatedExample: 'Ich trage eine Mütze im Winter.', order: 10 },
          ],
        },
        {
          title: 'Cores & Aparência',
          description: 'Cores e descrição da aparência',
          order: 3,
          vocabulary: [
            { word: 'alto/grande', translation: 'groß', example: 'Ele é muito alto.', translatedExample: 'Er ist sehr groß.', order: 1 },
            { word: 'baixo/pequeno', translation: 'klein', example: 'A criança ainda é pequena.', translatedExample: 'Das Kind ist noch klein.', order: 2 },
            { word: 'longo', translation: 'lang', example: 'Ela tem cabelo longo.', translatedExample: 'Sie hat langes Haar.', order: 3 },
            { word: 'curto', translation: 'kurz', example: 'Ele tem cabelo curto.', translatedExample: 'Er hat kurze Haare.', order: 4 },
            { word: 'magro/fino', translation: 'dünn', example: 'O livro é muito fino.', translatedExample: 'Das Buch ist sehr dünn.', order: 5 },
            { word: 'gordo/grosso', translation: 'dick', example: 'A árvore é grossa.', translatedExample: 'Der Baum ist dick.', order: 6 },
            { word: 'jovem', translation: 'jung', example: 'Ela parece muito jovem.', translatedExample: 'Sie sieht sehr jung aus.', order: 7 },
            { word: 'velho/idoso', translation: 'alt', example: 'Ele já é velho.', translatedExample: 'Er ist schon alt.', order: 8 },
            { word: 'bonito/lindo', translation: 'schön', example: 'Essa é uma vista linda.', translatedExample: 'Das ist eine schöne Aussicht.', order: 9 },
            { word: 'feio', translation: 'hässlich', example: 'O filme foi feio.', translatedExample: 'Der Film war hässlich.', order: 10 },
          ],
        },
        {
          title: 'Números 11–20',
          description: 'Números de onze a vinte',
          order: 4,
          vocabulary: [
            { word: 'onze', translation: 'elf', example: 'Eu tenho onze anos.', translatedExample: 'Ich bin elf Jahre alt.', order: 1 },
            { word: 'doze', translation: 'zwölf', example: 'São doze horas.', translatedExample: 'Es ist zwölf Uhr.', order: 2 },
            { word: 'treze', translation: 'dreizehn', example: 'O ônibus vem às treze horas.', translatedExample: 'Der Bus kommt um dreizehn Uhr.', order: 3 },
            { word: 'catorze', translation: 'vierzehn', example: 'Ela mora no número catorze.', translatedExample: 'Sie wohnt in Nummer vierzehn.', order: 4 },
            { word: 'quinze', translation: 'fünfzehn', example: 'Estou esperando há quinze minutos.', translatedExample: 'Ich warte seit fünfzehn Minuten.', order: 5 },
            { word: 'dezesseis', translation: 'sechzehn', example: 'Ele tem dezesseis anos.', translatedExample: 'Er ist sechzehn Jahre alt.', order: 6 },
            { word: 'dezessete', translation: 'siebzehn', example: 'O trem parte às dezessete horas.', translatedExample: 'Der Zug fährt um siebzehn Uhr.', order: 7 },
            { word: 'dezoito', translation: 'achtzehn', example: 'Com dezoito anos pode-se votar.', translatedExample: 'Mit achtzehn darf man wählen.', order: 8 },
            { word: 'dezenove', translation: 'neunzehn', example: 'Estão dezenove graus lá fora.', translatedExample: 'Es ist neunzehn Grad draußen.', order: 9 },
            { word: 'vinte', translation: 'zwanzig', example: 'Eu tenho vinte euros.', translatedExample: 'Ich habe zwanzig Euro.', order: 10 },
          ],
        },
        {
          title: 'Números Grandes',
          description: 'Números a partir de vinte e um',
          order: 5,
          vocabulary: [
            { word: 'vinte e um', translation: 'einundzwanzig', example: 'Eu tenho vinte e um anos.', translatedExample: 'Ich bin einundzwanzig Jahre alt.', order: 1 },
            { word: 'trinta', translation: 'dreißig', example: 'Ele tem trinta anos.', translatedExample: 'Er ist dreißig Jahre alt.', order: 2 },
            { word: 'quarenta', translation: 'vierzig', example: 'Ela trabalha há quarenta anos.', translatedExample: 'Sie arbeitet seit vierzig Jahren.', order: 3 },
            { word: 'cinquenta', translation: 'fünfzig', example: 'Isso custa cinquenta euros.', translatedExample: 'Das kostet fünfzig Euro.', order: 4 },
            { word: 'sessenta', translation: 'sechzig', example: 'Ele tem sessenta anos.', translatedExample: 'Er ist sechzig Jahre alt.', order: 5 },
            { word: 'setenta', translation: 'siebzig', example: 'Meu avô tem setenta anos.', translatedExample: 'Mein Opa ist siebzig.', order: 6 },
            { word: 'oitenta', translation: 'achtzig', example: 'O avô completou oitenta anos.', translatedExample: 'Der Opa wurde achtzig.', order: 7 },
            { word: 'noventa', translation: 'neunzig', example: 'Ela corre noventa quilômetros por semana.', translatedExample: 'Sie läuft neunzig Kilometer pro Woche.', order: 8 },
            { word: 'cem', translation: 'hundert', example: 'O livro custa cem euros.', translatedExample: 'Das Buch kostet hundert Euro.', order: 9 },
            { word: 'mil', translation: 'tausend', example: 'O carro custa mil euros.', translatedExample: 'Das Auto kostet tausend Euro.', order: 10 },
          ],
        },
      ],
    };

    console.log(`\n📚 Creating PT-BR => DE: ${chapter.title}`);
    const chapterId = generateId('ch-pt-de');
    console.log(`  Creating chapter: ${chapter.title}`);

    await client.query(
      `INSERT INTO "Chapter" 
       (id, title, description, "order", language, "sourceLanguage", "targetLanguage", "isFeatured", "isLocked", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
      [chapterId, chapter.title, chapter.description, chapter.order, 'de', 'pt-br', 'de', false, false]
    );

    for (const subchapter of chapter.subchapters) {
      const subchapterId = generateId('sub-pt-de');
      console.log(`    Creating subchapter: ${subchapter.title}`);

      await client.query(
        `INSERT INTO "Subchapter"
         (id, "chapterId", title, description, "order", "isLocked", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [subchapterId, chapterId, subchapter.title, subchapter.description, subchapter.order, false]
      );

      for (const vocab of subchapter.vocabulary) {
        const vocabId = generateId('voc-pt-de');
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
