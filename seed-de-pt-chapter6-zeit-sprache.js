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

    // Deutsch => Portugiesisch - Kapitel 6: Zeit & Sprache
    const chapter = {
      title: 'Zeit & Sprache',
      description: 'Monate, Uhrzeiten und wichtige Verben',
      order: 6,
      subchapters: [
        {
          title: 'Monate I',
          description: 'Die ersten zehn Monate',
          order: 1,
          vocabulary: [
            { word: 'Januar', translation: 'janeiro', example: 'Im Januar ist es kalt.', translatedExample: 'Em janeiro está frio.', order: 1 },
            { word: 'Februar', translation: 'fevereiro', example: 'Der Februar hat 28 Tage.', translatedExample: 'Fevereiro tem 28 dias.', order: 2 },
            { word: 'März', translation: 'março', example: 'Im März beginnt der Frühling.', translatedExample: 'Em março começa a primavera.', order: 3 },
            { word: 'April', translation: 'abril', example: 'Im April regnet es oft.', translatedExample: 'Em abril chove bastante.', order: 4 },
            { word: 'Mai', translation: 'maio', example: 'Im Mai blühen die Blumen.', translatedExample: 'Em maio as flores desabrocham.', order: 5 },
            { word: 'Juni', translation: 'junho', example: 'Im Juni ist Sommeranfang.', translatedExample: 'Em junho começa o verão.', order: 6 },
            { word: 'Juli', translation: 'julho', example: 'Juli ist der heißeste Monat.', translatedExample: 'Julho é o mês mais quente.', order: 7 },
            { word: 'August', translation: 'agosto', example: 'Im August fahren viele in den Urlaub.', translatedExample: 'Em agosto muitos vão de férias.', order: 8 },
            { word: 'September', translation: 'setembro', example: 'Im September beginnt die Schule wieder.', translatedExample: 'Em setembro a escola recomeça.', order: 9 },
            { word: 'Oktober', translation: 'outubro', example: 'Im Oktober fallen die Blätter.', translatedExample: 'Em outubro as folhas caem.', order: 10 },
          ],
        },
        {
          title: 'Monate II & Daten',
          description: 'Die letzten Monate und Datumsangaben',
          order: 2,
          vocabulary: [
            { word: 'November', translation: 'novembro', example: 'Im November ist es neblig.', translatedExample: 'Em novembro está nebuloso.', order: 1 },
            { word: 'Dezember', translation: 'dezembro', example: 'Im Dezember feiern wir Weihnachten.', translatedExample: 'Em dezembro celebramos o Natal.', order: 2 },
            { word: 'Datum', translation: 'data', example: 'Welches Datum ist heute?', translatedExample: 'Qual é a data de hoje?', order: 3 },
            { word: 'Geburtstag', translation: 'aniversário', example: 'Wann ist dein Geburtstag?', translatedExample: 'Quando é o seu aniversário?', order: 4 },
            { word: 'Jahrestag', translation: 'aniversário de casamento', example: 'Heute ist unser Jahrestag.', translatedExample: 'Hoje é nosso aniversário de casamento.', order: 5 },
            { word: 'Feiertag', translation: 'feriado', example: 'Morgen ist Feiertag.', translatedExample: 'Amanhã é feriado.', order: 6 },
            { word: 'Jahrhundert', translation: 'século', example: 'Das 21. Jahrhundert hat begonnen.', translatedExample: 'O século 21 começou.', order: 7 },
            { word: 'Jahrzehnt', translation: 'década', example: 'In einem Jahrzehnt passiert viel.', translatedExample: 'Em uma década acontece muito.', order: 8 },
            { word: 'Jahreszeit', translation: 'estação do ano', example: 'Welche Jahreszeit magst du am liebsten?', translatedExample: 'Qual estação do ano você prefere?', order: 9 },
            { word: 'Quartal', translation: 'trimestre', example: 'Das erste Quartal war erfolgreich.', translatedExample: 'O primeiro trimestre foi bem-sucedido.', order: 10 },
          ],
        },
        {
          title: 'Uhrzeiten',
          description: 'Uhrzeit und Tageszeiten',
          order: 3,
          vocabulary: [
            { word: 'Uhr', translation: 'hora/relógio', example: 'Wie viel Uhr ist es?', translatedExample: 'Que horas são?', order: 1 },
            { word: 'Viertel vor', translation: 'quinze para', example: 'Es ist Viertel vor drei.', translatedExample: 'São quinze para as três.', order: 2 },
            { word: 'halb', translation: 'meia', example: 'Es ist halb zwei.', translatedExample: 'São uma e meia.', order: 3 },
            { word: 'Viertel nach', translation: 'e quinze', example: 'Es ist Viertel nach fünf.', translatedExample: 'São cinco e quinze.', order: 4 },
            { word: 'Mitternacht', translation: 'meia-noite', example: 'Um Mitternacht feiern wir.', translatedExample: 'À meia-noite festejamos.', order: 5 },
            { word: 'Mittag', translation: 'meio-dia', example: 'Um Mittag essen wir zusammen.', translatedExample: 'Ao meio-dia almoçamos juntos.', order: 6 },
            { word: 'früh', translation: 'cedo', example: 'Ich stehe früh auf.', translatedExample: 'Eu acordo cedo.', order: 7 },
            { word: 'spät', translation: 'tarde', example: 'Es ist schon spät.', translatedExample: 'Já é tarde.', order: 8 },
            { word: 'pünktlich', translation: 'pontual', example: 'Sei bitte pünktlich!', translatedExample: 'Por favor, seja pontual!', order: 9 },
            { word: 'Stunde', translation: 'hora', example: 'Die Fahrt dauert eine Stunde.', translatedExample: 'A viagem dura uma hora.', order: 10 },
          ],
        },
        {
          title: 'Wichtige Verben I',
          description: 'Grundlegende Verben',
          order: 4,
          vocabulary: [
            { word: 'sein', translation: 'ser/estar', example: 'Ich bin müde.', translatedExample: 'Eu estou cansado.', order: 1 },
            { word: 'haben', translation: 'ter', example: 'Ich habe einen Hund.', translatedExample: 'Eu tenho um cachorro.', order: 2 },
            { word: 'kommen', translation: 'vir', example: 'Woher kommst du?', translatedExample: 'De onde você vem?', order: 3 },
            { word: 'gehen', translation: 'ir/andar', example: 'Ich gehe zur Schule.', translatedExample: 'Eu vou para a escola.', order: 4 },
            { word: 'machen', translation: 'fazer', example: 'Was machst du heute?', translatedExample: 'O que você faz hoje?', order: 5 },
            { word: 'sagen', translation: 'dizer', example: 'Was sagst du?', translatedExample: 'O que você diz?', order: 6 },
            { word: 'sehen', translation: 'ver', example: 'Ich sehe dich.', translatedExample: 'Eu te vejo.', order: 7 },
            { word: 'geben', translation: 'dar', example: 'Gib mir das bitte.', translatedExample: 'Me dá isso por favor.', order: 8 },
            { word: 'nehmen', translation: 'pegar/tomar', example: 'Ich nehme den Bus.', translatedExample: 'Eu pego o ônibus.', order: 9 },
            { word: 'wissen', translation: 'saber', example: 'Ich weiß es nicht.', translatedExample: 'Eu não sei.', order: 10 },
          ],
        },
        {
          title: 'Wichtige Verben II',
          description: 'Weitere wichtige Verben',
          order: 5,
          vocabulary: [
            { word: 'sprechen', translation: 'falar', example: 'Sprichst du Deutsch?', translatedExample: 'Você fala alemão?', order: 1 },
            { word: 'essen', translation: 'comer', example: 'Wir essen zu Abend.', translatedExample: 'Nós jantamos.', order: 2 },
            { word: 'trinken', translation: 'beber', example: 'Ich trinke Kaffee.', translatedExample: 'Eu bebo café.', order: 3 },
            { word: 'fahren', translation: 'dirigir/andar', example: 'Ich fahre Auto.', translatedExample: 'Eu dirijo.', order: 4 },
            { word: 'wohnen', translation: 'morar', example: 'Wo wohnst du?', translatedExample: 'Onde você mora?', order: 5 },
            { word: 'schreiben', translation: 'escrever', example: 'Ich schreibe einen Brief.', translatedExample: 'Eu escrevo uma carta.', order: 6 },
            { word: 'lesen', translation: 'ler', example: 'Er liest gerne Bücher.', translatedExample: 'Ele gosta de ler livros.', order: 7 },
            { word: 'hören', translation: 'ouvir', example: 'Ich höre Musik.', translatedExample: 'Eu ouço música.', order: 8 },
            { word: 'schlafen', translation: 'dormir', example: 'Ich schlafe acht Stunden.', translatedExample: 'Eu durmo oito horas.', order: 9 },
            { word: 'arbeiten', translation: 'trabalhar', example: 'Sie arbeitet viel.', translatedExample: 'Ela trabalha muito.', order: 10 },
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
