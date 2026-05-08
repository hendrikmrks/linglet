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

    // Portugiesisch => Deutsch - Capítulo 12: Sentimentos & Relacionamentos
    const chapter = {
      title: 'Sentimentos & Relacionamentos',
      description: 'Emoções e relacionamentos interpessoais',
      order: 12,
      subchapters: [
        {
          title: 'Emoções',
          description: 'Sentimentos e emoções',
          order: 1,
          vocabulary: [
            { word: 'feliz', translation: 'glücklich', example: 'Estou muito feliz hoje.', translatedExample: 'Ich bin heute sehr glücklich.', order: 1 },
            { word: 'triste', translation: 'traurig', example: 'Por que você está triste?', translatedExample: 'Warum bist du traurig?', order: 2 },
            { word: 'com raiva/bravo', translation: 'wütend', example: 'Ele ficou com raiva.', translatedExample: 'Er wurde wütend.', order: 3 },
            { word: 'com medo/assustado', translation: 'ängstlich', example: 'Ela ficou com medo no escuro.', translatedExample: 'Sie war ängstlich im Dunkeln.', order: 4 },
            { word: 'surpreso', translation: 'überrascht', example: 'Eu fiquei surpreso com a notícia.', translatedExample: 'Ich war von der Neuigkeit überrascht.', order: 5 },
            { word: 'orgulhoso', translation: 'stolz', example: 'Estou orgulhoso de você.', translatedExample: 'Ich bin stolz auf dich.', order: 6 },
            { word: 'envergonhado', translation: 'beschämt', example: 'Ele ficou envergonhado diante de todos.', translatedExample: 'Er schämte sich vor allen.', order: 7 },
            { word: 'entediado', translation: 'gelangweilt', example: 'Os alunos estavam entediados.', translatedExample: 'Die Schüler waren gelangweilt.', order: 8 },
            { word: 'animado/empolgado', translation: 'aufgeregt', example: 'Estou animado com a viagem.', translatedExample: 'Ich bin aufgeregt wegen der Reise.', order: 9 },
            { word: 'aliviado', translation: 'erleichtert', example: 'Fiquei aliviado ao passar no exame.', translatedExample: 'Ich war erleichtert, die Prüfung bestanden zu haben.', order: 10 },
          ],
        },
        {
          title: 'Características de Personalidade',
          description: 'Traços de personalidade',
          order: 2,
          vocabulary: [
            { word: 'simpático/amigável', translation: 'freundlich', example: 'Ela é muito simpática.', translatedExample: 'Sie ist sehr freundlich.', order: 1 },
            { word: 'honesto', translation: 'ehrlich', example: 'Ele é sempre honesto.', translatedExample: 'Er ist immer ehrlich.', order: 2 },
            { word: 'criativo', translation: 'kreativ', example: 'Ela é muito criativa.', translatedExample: 'Sie ist sehr kreativ.', order: 3 },
            { word: 'preguiçoso', translation: 'faul', example: 'Ele é muito preguiçoso.', translatedExample: 'Er ist sehr faul.', order: 4 },
            { word: 'trabalhador/esforçado', translation: 'fleißig', example: 'Ela é uma aluna muito trabalhadora.', translatedExample: 'Sie ist eine sehr fleißige Schülerin.', order: 5 },
            { word: 'tímido', translation: 'schüchtern', example: 'O menino é muito tímido.', translatedExample: 'Der Junge ist sehr schüchtern.', order: 6 },
            { word: 'extrovertido', translation: 'extrovertiert', example: 'Ela é muito extrovertida.', translatedExample: 'Sie ist sehr extrovertiert.', order: 7 },
            { word: 'curioso', translation: 'neugierig', example: 'As crianças são muito curiosas.', translatedExample: 'Kinder sind sehr neugierig.', order: 8 },
            { word: 'paciente', translation: 'geduldig', example: 'Você precisa ser mais paciente.', translatedExample: 'Du musst geduldiger sein.', order: 9 },
            { word: 'corajoso', translation: 'mutig', example: 'Ele foi muito corajoso.', translatedExample: 'Er war sehr mutig.', order: 10 },
          ],
        },
        {
          title: 'Relacionamentos & Família',
          description: 'Relacionamentos familiares e sociais',
          order: 3,
          vocabulary: [
            { word: 'namoro/relacionamento', translation: 'Beziehung', example: 'Eles têm um namoro feliz.', translatedExample: 'Sie führen eine glückliche Beziehung.', order: 1 },
            { word: 'casal', translation: 'Paar', example: 'São um casal bonito.', translatedExample: 'Sie sind ein schönes Paar.', order: 2 },
            { word: 'casamento', translation: 'Hochzeit', example: 'O casamento foi muito bonito.', translatedExample: 'Die Hochzeit war sehr schön.', order: 3 },
            { word: 'divórcio', translation: 'Scheidung', example: 'O divórcio foi difícil para os filhos.', translatedExample: 'Die Scheidung war schwer für die Kinder.', order: 4 },
            { word: 'amizade', translation: 'Freundschaft', example: 'Nossa amizade dura há muitos anos.', translatedExample: 'Unsere Freundschaft besteht seit vielen Jahren.', order: 5 },
            { word: 'colega', translation: 'Kollege/Kollegin', example: 'Meu colega me ajudou muito.', translatedExample: 'Mein Kollege hat mir sehr geholfen.', order: 6 },
            { word: 'vizinho', translation: 'Nachbar/Nachbarin', example: 'Meu vizinho é muito simpático.', translatedExample: 'Mein Nachbar ist sehr nett.', order: 7 },
            { word: 'primo', translation: 'Cousin/Cousine', example: 'Meu primo mora em São Paulo.', translatedExample: 'Mein Cousin wohnt in São Paulo.', order: 8 },
            { word: 'sogro/sogra', translation: 'Schwiegervater/Schwiegermutter', example: 'Minha sogra cozinha muito bem.', translatedExample: 'Meine Schwiegermutter kocht sehr gut.', order: 9 },
            { word: 'cunhado/cunhada', translation: 'Schwager/Schwägerin', example: 'Meu cunhado trabalha como médico.', translatedExample: 'Mein Schwager arbeitet als Arzt.', order: 10 },
          ],
        },
        {
          title: 'Vida Social',
          description: 'Vida social e interações',
          order: 4,
          vocabulary: [
            { word: 'encontro/data', translation: 'Verabredung', example: 'Eu tenho um encontro amanhã.', translatedExample: 'Ich habe morgen eine Verabredung.', order: 1 },
            { word: 'festa/balada', translation: 'Party', example: 'A festa foi divertidíssima.', translatedExample: 'Die Party war sehr lustig.', order: 2 },
            { word: 'convidar', translation: 'einladen', example: 'Eu convido você para jantar.', translatedExample: 'Ich lade dich zum Abendessen ein.', order: 3 },
            { word: 'recusar/declinar', translation: 'ablehnen', example: 'Ele recusou o convite.', translatedExample: 'Er lehnte die Einladung ab.', order: 4 },
            { word: 'cumprimentar', translation: 'begrüßen', example: 'Eu cumprimento meu vizinho.', translatedExample: 'Ich begrüße meinen Nachbarn.', order: 5 },
            { word: 'abraço', translation: 'Umarmung', example: 'Ela me deu um abraço caloroso.', translatedExample: 'Sie gab mir eine herzliche Umarmung.', order: 6 },
            { word: 'beijo', translation: 'Kuss', example: 'Ele deu um beijo de boa noite.', translatedExample: 'Er gab einen Gutenachtkuss.', order: 7 },
            { word: 'aperto de mão', translation: 'Handschlag', example: 'Nós nos cumprimentamos com aperto de mão.', translatedExample: 'Wir begrüßten uns mit Handschlag.', order: 8 },
            { word: 'conversa', translation: 'Gespräch', example: 'Tivemos uma boa conversa.', translatedExample: 'Wir hatten ein gutes Gespräch.', order: 9 },
            { word: 'discussão/briga', translation: 'Streit', example: 'Eles tiveram uma discussão.', translatedExample: 'Sie hatten einen Streit.', order: 10 },
          ],
        },
        {
          title: 'Conflitos & Comunicação',
          description: 'Conflitos e formas de comunicação',
          order: 5,
          vocabulary: [
            { word: 'mal-entendido', translation: 'Missverständnis', example: 'Foi apenas um mal-entendido.', translatedExample: 'Es war nur ein Missverständnis.', order: 1 },
            { word: 'pedir desculpas/se desculpar', translation: 'sich entschuldigen', example: 'Eu me desculpei por meu erro.', translatedExample: 'Ich entschuldigte mich für meinen Fehler.', order: 2 },
            { word: 'perdoar', translation: 'vergeben', example: 'Ela me perdoou.', translatedExample: 'Sie hat mir vergeben.', order: 3 },
            { word: 'criticar', translation: 'kritisieren', example: 'Ele me criticou em público.', translatedExample: 'Er kritisierte mich öffentlich.', order: 4 },
            { word: 'elogiar', translation: 'loben', example: 'O professor elogiou o aluno.', translatedExample: 'Der Lehrer lobte den Schüler.', order: 5 },
            { word: 'reclamar/se queixar', translation: 'sich beschweren', example: 'Ela se reclamou do barulho.', translatedExample: 'Sie beschwerte sich über den Lärm.', order: 6 },
            { word: 'acordo/compromisso', translation: 'Kompromiss', example: 'Chegamos a um acordo.', translatedExample: 'Wir haben einen Kompromiss gefunden.', order: 7 },
            { word: 'resolver', translation: 'lösen', example: 'Nós resolvemos o problema juntos.', translatedExample: 'Wir haben das Problem gemeinsam gelöst.', order: 8 },
            { word: 'apoiar/suportar', translation: 'unterstützen', example: 'Minha família me apoia muito.', translatedExample: 'Meine Familie unterstützt mich sehr.', order: 9 },
            { word: 'confiar', translation: 'vertrauen', example: 'Eu confio em você.', translatedExample: 'Ich vertraue dir.', order: 10 },
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
