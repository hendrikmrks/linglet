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

    // Portugiesisch => Deutsch - Capítulo 6: Tempo & Linguagem
    const chapter = {
      title: 'Tempo & Linguagem',
      description: 'Meses, horários e verbos importantes',
      order: 6,
      subchapters: [
        {
          title: 'Meses I',
          description: 'Os primeiros dez meses',
          order: 1,
          vocabulary: [
            { word: 'janeiro', translation: 'Januar', example: 'Em janeiro está frio.', translatedExample: 'Im Januar ist es kalt.', order: 1 },
            { word: 'fevereiro', translation: 'Februar', example: 'Fevereiro tem 28 dias.', translatedExample: 'Der Februar hat 28 Tage.', order: 2 },
            { word: 'março', translation: 'März', example: 'Em março começa a primavera.', translatedExample: 'Im März beginnt der Frühling.', order: 3 },
            { word: 'abril', translation: 'April', example: 'Em abril chove bastante.', translatedExample: 'Im April regnet es oft.', order: 4 },
            { word: 'maio', translation: 'Mai', example: 'Em maio as flores desabrocham.', translatedExample: 'Im Mai blühen die Blumen.', order: 5 },
            { word: 'junho', translation: 'Juni', example: 'Em junho começa o verão.', translatedExample: 'Im Juni ist Sommeranfang.', order: 6 },
            { word: 'julho', translation: 'Juli', example: 'Julho é o mês mais quente.', translatedExample: 'Juli ist der heißeste Monat.', order: 7 },
            { word: 'agosto', translation: 'August', example: 'Em agosto muitos vão de férias.', translatedExample: 'Im August fahren viele in den Urlaub.', order: 8 },
            { word: 'setembro', translation: 'September', example: 'Em setembro a escola recomeça.', translatedExample: 'Im September beginnt die Schule wieder.', order: 9 },
            { word: 'outubro', translation: 'Oktober', example: 'Em outubro as folhas caem.', translatedExample: 'Im Oktober fallen die Blätter.', order: 10 },
          ],
        },
        {
          title: 'Meses II & Datas',
          description: 'Os últimos meses e datas',
          order: 2,
          vocabulary: [
            { word: 'novembro', translation: 'November', example: 'Em novembro está nebuloso.', translatedExample: 'Im November ist es neblig.', order: 1 },
            { word: 'dezembro', translation: 'Dezember', example: 'Em dezembro celebramos o Natal.', translatedExample: 'Im Dezember feiern wir Weihnachten.', order: 2 },
            { word: 'data', translation: 'Datum', example: 'Qual é a data de hoje?', translatedExample: 'Welches Datum ist heute?', order: 3 },
            { word: 'aniversário', translation: 'Geburtstag', example: 'Quando é o seu aniversário?', translatedExample: 'Wann ist dein Geburtstag?', order: 4 },
            { word: 'aniversário de casamento', translation: 'Jahrestag', example: 'Hoje é nosso aniversário de casamento.', translatedExample: 'Heute ist unser Jahrestag.', order: 5 },
            { word: 'feriado', translation: 'Feiertag', example: 'Amanhã é feriado.', translatedExample: 'Morgen ist Feiertag.', order: 6 },
            { word: 'século', translation: 'Jahrhundert', example: 'O século 21 começou.', translatedExample: 'Das 21. Jahrhundert hat begonnen.', order: 7 },
            { word: 'década', translation: 'Jahrzehnt', example: 'Em uma década acontece muito.', translatedExample: 'In einem Jahrzehnt passiert viel.', order: 8 },
            { word: 'estação do ano', translation: 'Jahreszeit', example: 'Qual estação do ano você prefere?', translatedExample: 'Welche Jahreszeit magst du am liebsten?', order: 9 },
            { word: 'trimestre', translation: 'Quartal', example: 'O primeiro trimestre foi bem-sucedido.', translatedExample: 'Das erste Quartal war erfolgreich.', order: 10 },
          ],
        },
        {
          title: 'Horários',
          description: 'Horas e períodos do dia',
          order: 3,
          vocabulary: [
            { word: 'hora/relógio', translation: 'Uhr', example: 'Que horas são?', translatedExample: 'Wie viel Uhr ist es?', order: 1 },
            { word: 'quinze para', translation: 'Viertel vor', example: 'São quinze para as três.', translatedExample: 'Es ist Viertel vor drei.', order: 2 },
            { word: 'meia', translation: 'halb', example: 'São uma e meia.', translatedExample: 'Es ist halb zwei.', order: 3 },
            { word: 'e quinze', translation: 'Viertel nach', example: 'São cinco e quinze.', translatedExample: 'Es ist Viertel nach fünf.', order: 4 },
            { word: 'meia-noite', translation: 'Mitternacht', example: 'À meia-noite festejamos.', translatedExample: 'Um Mitternacht feiern wir.', order: 5 },
            { word: 'meio-dia', translation: 'Mittag', example: 'Ao meio-dia almoçamos juntos.', translatedExample: 'Um Mittag essen wir zusammen.', order: 6 },
            { word: 'cedo', translation: 'früh', example: 'Eu acordo cedo.', translatedExample: 'Ich stehe früh auf.', order: 7 },
            { word: 'tarde', translation: 'spät', example: 'Já é tarde.', translatedExample: 'Es ist schon spät.', order: 8 },
            { word: 'pontual', translation: 'pünktlich', example: 'Por favor, seja pontual!', translatedExample: 'Sei bitte pünktlich!', order: 9 },
            { word: 'hora', translation: 'Stunde', example: 'A viagem dura uma hora.', translatedExample: 'Die Fahrt dauert eine Stunde.', order: 10 },
          ],
        },
        {
          title: 'Verbos Importantes I',
          description: 'Verbos básicos',
          order: 4,
          vocabulary: [
            { word: 'ser/estar', translation: 'sein', example: 'Eu estou cansado.', translatedExample: 'Ich bin müde.', order: 1 },
            { word: 'ter', translation: 'haben', example: 'Eu tenho um cachorro.', translatedExample: 'Ich habe einen Hund.', order: 2 },
            { word: 'vir', translation: 'kommen', example: 'De onde você vem?', translatedExample: 'Woher kommst du?', order: 3 },
            { word: 'ir/andar', translation: 'gehen', example: 'Eu vou para a escola.', translatedExample: 'Ich gehe zur Schule.', order: 4 },
            { word: 'fazer', translation: 'machen', example: 'O que você faz hoje?', translatedExample: 'Was machst du heute?', order: 5 },
            { word: 'dizer', translation: 'sagen', example: 'O que você diz?', translatedExample: 'Was sagst du?', order: 6 },
            { word: 'ver', translation: 'sehen', example: 'Eu te vejo.', translatedExample: 'Ich sehe dich.', order: 7 },
            { word: 'dar', translation: 'geben', example: 'Me dá isso por favor.', translatedExample: 'Gib mir das bitte.', order: 8 },
            { word: 'pegar/tomar', translation: 'nehmen', example: 'Eu pego o ônibus.', translatedExample: 'Ich nehme den Bus.', order: 9 },
            { word: 'saber', translation: 'wissen', example: 'Eu não sei.', translatedExample: 'Ich weiß es nicht.', order: 10 },
          ],
        },
        {
          title: 'Verbos Importantes II',
          description: 'Mais verbos importantes',
          order: 5,
          vocabulary: [
            { word: 'falar', translation: 'sprechen', example: 'Você fala alemão?', translatedExample: 'Sprichst du Deutsch?', order: 1 },
            { word: 'comer', translation: 'essen', example: 'Nós jantamos.', translatedExample: 'Wir essen zu Abend.', order: 2 },
            { word: 'beber', translation: 'trinken', example: 'Eu bebo café.', translatedExample: 'Ich trinke Kaffee.', order: 3 },
            { word: 'dirigir/andar', translation: 'fahren', example: 'Eu dirijo.', translatedExample: 'Ich fahre Auto.', order: 4 },
            { word: 'morar', translation: 'wohnen', example: 'Onde você mora?', translatedExample: 'Wo wohnst du?', order: 5 },
            { word: 'escrever', translation: 'schreiben', example: 'Eu escrevo uma carta.', translatedExample: 'Ich schreibe einen Brief.', order: 6 },
            { word: 'ler', translation: 'lesen', example: 'Ele gosta de ler livros.', translatedExample: 'Er liest gerne Bücher.', order: 7 },
            { word: 'ouvir', translation: 'hören', example: 'Eu ouço música.', translatedExample: 'Ich höre Musik.', order: 8 },
            { word: 'dormir', translation: 'schlafen', example: 'Eu durmo oito horas.', translatedExample: 'Ich schlafe acht Stunden.', order: 9 },
            { word: 'trabalhar', translation: 'arbeiten', example: 'Ela trabalha muito.', translatedExample: 'Sie arbeitet viel.', order: 10 },
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
