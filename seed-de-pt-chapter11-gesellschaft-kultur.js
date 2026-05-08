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

    // Deutsch => Portugiesisch - Kapitel 11: Gesellschaft & Kultur
    const chapter = {
      title: 'Gesellschaft & Kultur',
      description: 'Feste, Kunst und Gesellschaft',
      order: 11,
      subchapters: [
        {
          title: 'Feste & Feiertage',
          description: 'Feste und Feiertage',
          order: 1,
          vocabulary: [
            { word: 'Weihnachten', translation: 'Natal', example: 'Weihnachten feiern wir mit der Familie.', translatedExample: 'Celebramos o Natal com a família.', order: 1 },
            { word: 'Geburtstag', translation: 'aniversário', example: 'Herzlichen Glückwunsch zum Geburtstag!', translatedExample: 'Feliz aniversário!', order: 2 },
            { word: 'Hochzeit', translation: 'casamento', example: 'Die Hochzeit war wunderschön.', translatedExample: 'O casamento foi lindo.', order: 3 },
            { word: 'Neujahr', translation: 'Ano Novo', example: 'Prost auf das neue Jahr!', translatedExample: 'Saúde pelo Ano Novo!', order: 4 },
            { word: 'Ostern', translation: 'Páscoa', example: 'An Ostern suchen die Kinder Eier.', translatedExample: 'Na Páscoa as crianças procuram ovos.', order: 5 },
            { word: 'feiern', translation: 'comemorar/festejar', example: 'Wir feiern heute meinen Geburtstag.', translatedExample: 'Hoje festejamos meu aniversário.', order: 6 },
            { word: 'Geschenk', translation: 'presente', example: 'Ich kaufe ein Geschenk für meine Mutter.', translatedExample: 'Eu compro um presente para minha mãe.', order: 7 },
            { word: 'Einladung', translation: 'convite', example: 'Ich habe eine Einladung bekommen.', translatedExample: 'Eu recebi um convite.', order: 8 },
            { word: 'Kerze', translation: 'vela', example: 'Wir zünden Kerzen an.', translatedExample: 'Nós acendemos velas.', order: 9 },
            { word: 'Glückwunsch', translation: 'parabéns/felicitações', example: 'Herzlichen Glückwunsch!', translatedExample: 'Parabéns!', order: 10 },
          ],
        },
        {
          title: 'Kunst & Musik',
          description: 'Kunst und Musik',
          order: 2,
          vocabulary: [
            { word: 'Gemälde', translation: 'pintura/quadro', example: 'Das Gemälde hängt im Museum.', translatedExample: 'A pintura está no museu.', order: 1 },
            { word: 'Ausstellung', translation: 'exposição', example: 'Die Ausstellung ist sehr interessant.', translatedExample: 'A exposição é muito interessante.', order: 2 },
            { word: 'Skulptur', translation: 'escultura', example: 'Die Skulptur ist sehr modern.', translatedExample: 'A escultura é muito moderna.', order: 3 },
            { word: 'Konzert', translation: 'show/concerto', example: 'Das Konzert war begeisternd.', translatedExample: 'O show foi emocionante.', order: 4 },
            { word: 'Orchester', translation: 'orquestra', example: 'Das Orchester spielt Beethoven.', translatedExample: 'A orquestra toca Beethoven.', order: 5 },
            { word: 'Instrument', translation: 'instrumento', example: 'Er spielt mehrere Instrumente.', translatedExample: 'Ele toca vários instrumentos.', order: 6 },
            { word: 'Bühne', translation: 'palco', example: 'Die Sängerin betritt die Bühne.', translatedExample: 'A cantora entra no palco.', order: 7 },
            { word: 'Applaus', translation: 'aplauso', example: 'Das Publikum klatschte Applaus.', translatedExample: 'O público aplaudiu.', order: 8 },
            { word: 'Künstler', translation: 'artista', example: 'Der Künstler ist sehr bekannt.', translatedExample: 'O artista é muito famoso.', order: 9 },
            { word: 'Galerie', translation: 'galeria', example: 'Ich besuche die Kunstgalerie.', translatedExample: 'Eu visito a galeria de arte.', order: 10 },
          ],
        },
        {
          title: 'Geschichte & Politik',
          description: 'Geschichte und politische Begriffe',
          order: 3,
          vocabulary: [
            { word: 'König', translation: 'rei', example: 'Der König regierte das Land.', translatedExample: 'O rei governou o país.', order: 1 },
            { word: 'Revolution', translation: 'revolução', example: 'Die Revolution veränderte alles.', translatedExample: 'A revolução mudou tudo.', order: 2 },
            { word: 'Krieg', translation: 'guerra', example: 'Krieg bringt nur Leid.', translatedExample: 'A guerra só traz sofrimento.', order: 3 },
            { word: 'Frieden', translation: 'paz', example: 'Wir wünschen uns Frieden.', translatedExample: 'Desejamos paz.', order: 4 },
            { word: 'Demokratie', translation: 'democracia', example: 'Demokratie schützt die Rechte der Bürger.', translatedExample: 'A democracia protege os direitos dos cidadãos.', order: 5 },
            { word: 'Wahl', translation: 'eleição', example: 'Die Wahl ist im Herbst.', translatedExample: 'A eleição é no outono.', order: 6 },
            { word: 'Partei', translation: 'partido político', example: 'Welcher Partei gehörst du an?', translatedExample: 'A qual partido você pertence?', order: 7 },
            { word: 'Parlament', translation: 'parlamento', example: 'Das Parlament verabschiedet Gesetze.', translatedExample: 'O parlamento aprova as leis.', order: 8 },
            { word: 'Geschichte', translation: 'história', example: 'Geschichte ist mein Lieblingsfach.', translatedExample: 'História é minha matéria favorita.', order: 9 },
            { word: 'Bürger', translation: 'cidadão', example: 'Die Bürger haben das Recht zu wählen.', translatedExample: 'Os cidadãos têm o direito de votar.', order: 10 },
          ],
        },
        {
          title: 'Sprache & Kommunikation',
          description: 'Sprache und Kommunikation',
          order: 4,
          vocabulary: [
            { word: 'Dialekt', translation: 'dialeto', example: 'Bayern hat einen starken Dialekt.', translatedExample: 'A Baviera tem um dialeto forte.', order: 1 },
            { word: 'Akzent', translation: 'sotaque', example: 'Sie hat einen starken Akzent.', translatedExample: 'Ela tem um sotaque forte.', order: 2 },
            { word: 'Übersetzung', translation: 'tradução', example: 'Die Übersetzung ist nicht perfekt.', translatedExample: 'A tradução não é perfeita.', order: 3 },
            { word: 'Sprichwort', translation: 'provérbio', example: 'Kennst du dieses Sprichwort?', translatedExample: 'Você conhece este provérbio?', order: 4 },
            { word: 'Tradition', translation: 'tradição', example: 'Diese Tradition ist sehr alt.', translatedExample: 'Esta tradição é muito antiga.', order: 5 },
            { word: 'Brauch', translation: 'costume/tradição', example: 'Das ist ein alter Brauch.', translatedExample: 'Isso é um costume antigo.', order: 6 },
            { word: 'Gastfreundschaft', translation: 'hospitalidade', example: 'Die deutsche Gastfreundschaft ist bekannt.', translatedExample: 'A hospitalidade alemã é conhecida.', order: 7 },
            { word: 'Wert', translation: 'valor', example: 'Familie ist ein wichtiger Wert.', translatedExample: 'Família é um valor importante.', order: 8 },
            { word: 'Identität', translation: 'identidade', example: 'Sprache ist Teil unserer Identität.', translatedExample: 'A língua é parte de nossa identidade.', order: 9 },
            { word: 'Kultur', translation: 'cultura', example: 'Ich interessiere mich für andere Kulturen.', translatedExample: 'Eu me interesso por outras culturas.', order: 10 },
          ],
        },
        {
          title: 'Reisen & Interkulturell',
          description: 'Reisen und interkulturelle Begegnungen',
          order: 5,
          vocabulary: [
            { word: 'Grenze', translation: 'fronteira', example: 'Wir überqueren die Grenze.', translatedExample: 'Nós cruzamos a fronteira.', order: 1 },
            { word: 'Zoll', translation: 'alfândega', example: 'Am Zoll müssen wir warten.', translatedExample: 'Na alfândega temos que esperar.', order: 2 },
            { word: 'Botschaft', translation: 'embaixada', example: 'Ich gehe zur deutschen Botschaft.', translatedExample: 'Eu vou à embaixada alemã.', order: 3 },
            { word: 'Visum', translation: 'visto', example: 'Ich brauche ein Visum für Brasilien.', translatedExample: 'Eu preciso de visto para o Brasil.', order: 4 },
            { word: 'Währung', translation: 'moeda', example: 'Die Währung Brasiliens ist der Real.', translatedExample: 'A moeda do Brasil é o real.', order: 5 },
            { word: 'Zeitzone', translation: 'fuso horário', example: 'Deutschland und Brasilien haben verschiedene Zeitzonen.', translatedExample: 'Alemanha e Brasil têm fusos horários diferentes.', order: 6 },
            { word: 'Jetlag', translation: 'jet lag', example: 'Ich habe nach dem Flug Jetlag.', translatedExample: 'Eu fico com jet lag depois do voo.', order: 7 },
            { word: 'Reiseführer', translation: 'guia turístico', example: 'Ich kaufe einen Reiseführer.', translatedExample: 'Eu compro um guia turístico.', order: 8 },
            { word: 'Hostel', translation: 'hostel', example: 'Ich übernachte im Hostel.', translatedExample: 'Eu me hospedo no hostel.', order: 9 },
            { word: 'Rucksack', translation: 'mochila', example: 'Ich reise mit dem Rucksack.', translatedExample: 'Eu viajo com a mochila.', order: 10 },
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
