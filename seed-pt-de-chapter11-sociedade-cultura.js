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

    // Portugiesisch => Deutsch - Capítulo 11: Sociedade & Cultura
    const chapter = {
      title: 'Sociedade & Cultura',
      description: 'Festas, arte e sociedade',
      order: 11,
      subchapters: [
        {
          title: 'Festas & Feriados',
          description: 'Festas e celebrações',
          order: 1,
          vocabulary: [
            { word: 'Natal', translation: 'Weihnachten', example: 'Natal é meu feriado favorito.', translatedExample: 'Weihnachten ist mein Lieblingsfest.', order: 1 },
            { word: 'Ano Novo', translation: 'Neujahr', example: 'Eu festejo o Ano Novo com amigos.', translatedExample: 'Ich feiere Neujahr mit Freunden.', order: 2 },
            { word: 'aniversário', translation: 'Geburtstag', example: 'Hoje é meu aniversário.', translatedExample: 'Heute ist mein Geburtstag.', order: 3 },
            { word: 'presente', translation: 'Geschenk', example: 'Eu embrulho o presente.', translatedExample: 'Ich verpacke das Geschenk.', order: 4 },
            { word: 'vela', translation: 'Kerze', example: 'Eu apago as velas do bolo.', translatedExample: 'Ich blase die Kerzen aus.', order: 5 },
            { word: 'fogos de artifício', translation: 'Feuerwerk', example: 'Os fogos de artifício são lindos.', translatedExample: 'Das Feuerwerk ist wunderschön.', order: 6 },
            { word: 'desfile/procissão', translation: 'Umzug', example: 'O desfile passa pela rua principal.', translatedExample: 'Der Umzug geht durch die Hauptstraße.', order: 7 },
            { word: 'tradicional', translation: 'traditionell', example: 'Este prato é muito tradicional.', translatedExample: 'Dieses Gericht ist sehr traditionell.', order: 8 },
            { word: 'celebrar/comemorar', translation: 'feiern', example: 'Nós celebramos nossa vitória.', translatedExample: 'Wir feiern unseren Sieg.', order: 9 },
            { word: 'convite', translation: 'Einladung', example: 'Eu recebi um convite para a festa.', translatedExample: 'Ich habe eine Einladung zur Party bekommen.', order: 10 },
          ],
        },
        {
          title: 'Arte & Música',
          description: 'Arte, música e cultura',
          order: 2,
          vocabulary: [
            { word: 'exposição', translation: 'Ausstellung', example: 'A exposição está aberta até sábado.', translatedExample: 'Die Ausstellung ist bis Samstag geöffnet.', order: 1 },
            { word: 'quadro/pintura', translation: 'Gemälde', example: 'Esse quadro é muito valioso.', translatedExample: 'Dieses Gemälde ist sehr wertvoll.', order: 2 },
            { word: 'escultura', translation: 'Skulptur', example: 'A escultura fica na praça.', translatedExample: 'Die Skulptur steht auf dem Platz.', order: 3 },
            { word: 'instrumento musical', translation: 'Musikinstrument', example: 'Eu toco um instrumento musical.', translatedExample: 'Ich spiele ein Musikinstrument.', order: 4 },
            { word: 'concerto', translation: 'Konzert', example: 'O concerto dura duas horas.', translatedExample: 'Das Konzert dauert zwei Stunden.', order: 5 },
            { word: 'letra de música', translation: 'Liedtext', example: 'Eu aprendo a letra de cor.', translatedExample: 'Ich lerne den Liedtext auswendig.', order: 6 },
            { word: 'ritmo', translation: 'Rhythmus', example: 'Este ritmo é difícil.', translatedExample: 'Dieser Rhythmus ist schwierig.', order: 7 },
            { word: 'peça de teatro', translation: 'Theaterstück', example: 'A peça de teatro foi emocionante.', translatedExample: 'Das Theaterstück war bewegend.', order: 8 },
            { word: 'apresentação/atuação', translation: 'Aufführung', example: 'A apresentação começa às oito.', translatedExample: 'Die Aufführung beginnt um acht Uhr.', order: 9 },
            { word: 'artista', translation: 'Künstler/Künstlerin', example: 'Ela é uma artista famosa.', translatedExample: 'Sie ist eine bekannte Künstlerin.', order: 10 },
          ],
        },
        {
          title: 'História & Política',
          description: 'História e política',
          order: 3,
          vocabulary: [
            { word: 'história', translation: 'Geschichte', example: 'Eu adoro aulas de história.', translatedExample: 'Ich liebe Geschichtsstunden.', order: 1 },
            { word: 'guerra', translation: 'Krieg', example: 'A guerra trouxe muita dor.', translatedExample: 'Der Krieg brachte viel Leid.', order: 2 },
            { word: 'paz', translation: 'Frieden', example: 'Todos desejam a paz.', translatedExample: 'Alle wünschen sich Frieden.', order: 3 },
            { word: 'democracia', translation: 'Demokratie', example: 'A democracia é fundamental.', translatedExample: 'Demokratie ist grundlegend.', order: 4 },
            { word: 'governo', translation: 'Regierung', example: 'O governo apresenta novas leis.', translatedExample: 'Die Regierung stellt neue Gesetze vor.', order: 5 },
            { word: 'eleição', translation: 'Wahl', example: 'As eleições são em outubro.', translatedExample: 'Die Wahl ist im Oktober.', order: 6 },
            { word: 'parlamento', translation: 'Parlament', example: 'O parlamento decide as leis.', translatedExample: 'Das Parlament beschließt die Gesetze.', order: 7 },
            { word: 'presidente', translation: 'Präsident/Präsidentin', example: 'O presidente faz um discurso.', translatedExample: 'Der Präsident hält eine Rede.', order: 8 },
            { word: 'lei', translation: 'Gesetz', example: 'A nova lei entra em vigor amanhã.', translatedExample: 'Das neue Gesetz tritt morgen in Kraft.', order: 9 },
            { word: 'direitos humanos', translation: 'Menschenrechte', example: 'Os direitos humanos são universais.', translatedExample: 'Menschenrechte sind universell.', order: 10 },
          ],
        },
        {
          title: 'Língua & Comunicação',
          description: 'Língua e comunicação',
          order: 4,
          vocabulary: [
            { word: 'idioma/língua', translation: 'Sprache', example: 'Eu aprendo um novo idioma.', translatedExample: 'Ich lerne eine neue Sprache.', order: 1 },
            { word: 'sotaque', translation: 'Akzent', example: 'Ele tem um sotaque estrangeiro.', translatedExample: 'Er hat einen ausländischen Akzent.', order: 2 },
            { word: 'dialeto', translation: 'Dialekt', example: 'Este dialeto é difícil de entender.', translatedExample: 'Dieser Dialekt ist schwer zu verstehen.', order: 3 },
            { word: 'tradução', translation: 'Übersetzung', example: 'A tradução foi perfeita.', translatedExample: 'Die Übersetzung war perfekt.', order: 4 },
            { word: 'intérprete', translation: 'Dolmetscher/Dolmetscherin', example: 'O intérprete traduz em tempo real.', translatedExample: 'Der Dolmetscher übersetzt in Echtzeit.', order: 5 },
            { word: 'vocabulário', translation: 'Wortschatz', example: 'Eu expando meu vocabulário diariamente.', translatedExample: 'Ich erweitere täglich meinen Wortschatz.', order: 6 },
            { word: 'gramática', translation: 'Grammatik', example: 'A gramática alemã é complexa.', translatedExample: 'Die deutsche Grammatik ist komplex.', order: 7 },
            { word: 'pronúncia', translation: 'Aussprache', example: 'Minha pronúncia melhora com prática.', translatedExample: 'Meine Aussprache verbessert sich durch Übung.', order: 8 },
            { word: 'entender/compreender', translation: 'verstehen', example: 'Eu não entendo essa palavra.', translatedExample: 'Ich verstehe dieses Wort nicht.', order: 9 },
            { word: 'bilíngue', translation: 'zweisprachig', example: 'Ela cresceu bilíngue.', translatedExample: 'Sie ist zweisprachig aufgewachsen.', order: 10 },
          ],
        },
        {
          title: 'Viagens & Interculturalidade',
          description: 'Viagens e intercâmbio cultural',
          order: 5,
          vocabulary: [
            { word: 'cultura', translation: 'Kultur', example: 'Cada país tem sua cultura única.', translatedExample: 'Jedes Land hat seine einzigartige Kultur.', order: 1 },
            { word: 'costume/hábito', translation: 'Brauch/Gewohnheit', example: 'Esse costume é muito antigo.', translatedExample: 'Dieser Brauch ist sehr alt.', order: 2 },
            { word: 'fronteira', translation: 'Grenze', example: 'A fronteira está a duas horas.', translatedExample: 'Die Grenze ist zwei Stunden entfernt.', order: 3 },
            { word: 'visto', translation: 'Visum', example: 'Eu solicito um visto de turista.', translatedExample: 'Ich beantrage ein Touristenvisum.', order: 4 },
            { word: 'embaixada', translation: 'Botschaft', example: 'A embaixada fica no centro.', translatedExample: 'Die Botschaft liegt im Zentrum.', order: 5 },
            { word: 'intercâmbio', translation: 'Austausch', example: 'Ele vai fazer um intercâmbio na Alemanha.', translatedExample: 'Er macht einen Austausch in Deutschland.', order: 6 },
            { word: 'souvenir/lembrança', translation: 'Souvenir', example: 'Eu compro souvenirs para a família.', translatedExample: 'Ich kaufe Souvenirs für die Familie.', order: 7 },
            { word: 'guia turístico', translation: 'Reiseführer', example: 'O guia turístico explica a história.', translatedExample: 'Der Reiseführer erklärt die Geschichte.', order: 8 },
            { word: 'fuseau horário', translation: 'Zeitzone', example: 'Há um fuso horário de seis horas.', translatedExample: 'Es gibt einen Zeitunterschied von sechs Stunden.', order: 9 },
            { word: 'choque cultural', translation: 'Kulturschock', example: 'Muitos viajantes sofrem choque cultural.', translatedExample: 'Viele Reisende erleben einen Kulturschock.', order: 10 },
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
