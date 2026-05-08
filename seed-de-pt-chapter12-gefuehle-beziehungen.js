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

    // Deutsch => Portugiesisch - Kapitel 12: Gefühle & Beziehungen
    const chapter = {
      title: 'Gefühle & Beziehungen',
      description: 'Emotionen und zwischenmenschliche Beziehungen',
      order: 12,
      subchapters: [
        {
          title: 'Emotionen',
          description: 'Gefühle ausdrücken',
          order: 1,
          vocabulary: [
            { word: 'glücklich', translation: 'feliz', example: 'Ich bin sehr glücklich heute.', translatedExample: 'Estou muito feliz hoje.', order: 1 },
            { word: 'traurig', translation: 'triste', example: 'Er ist traurig, weil er verloren hat.', translatedExample: 'Ele está triste porque perdeu.', order: 2 },
            { word: 'wütend', translation: 'bravo/com raiva', example: 'Sie ist wütend auf ihren Bruder.', translatedExample: 'Ela está brava com o irmão.', order: 3 },
            { word: 'ängstlich', translation: 'com medo/ansioso', example: 'Ich bin ängstlich vor dem Examen.', translatedExample: 'Estou ansioso antes do exame.', order: 4 },
            { word: 'überrascht', translation: 'surpreso', example: 'Ich war sehr überrascht.', translatedExample: 'Fui muito surpreendido.', order: 5 },
            { word: 'einsam', translation: 'solitário', example: 'Er fühlt sich einsam in der Großstadt.', translatedExample: 'Ele se sente solitário na cidade grande.', order: 6 },
            { word: 'verliebt', translation: 'apaixonado', example: 'Sie ist verliebt in ihn.', translatedExample: 'Ela está apaixonada por ele.', order: 7 },
            { word: 'stolz', translation: 'orgulhoso', example: 'Ich bin stolz auf meine Kinder.', translatedExample: 'Estou orgulhoso dos meus filhos.', order: 8 },
            { word: 'neidisch', translation: 'com inveja', example: 'Er ist neidisch auf seinen Kollegen.', translatedExample: 'Ele tem inveja do colega.', order: 9 },
            { word: 'erleichtert', translation: 'aliviado', example: 'Ich bin erleichtert, dass alles gut gegangen ist.', translatedExample: 'Estou aliviado que tudo correu bem.', order: 10 },
          ],
        },
        {
          title: 'Charaktereigenschaften',
          description: 'Persönlichkeitsmerkmale',
          order: 2,
          vocabulary: [
            { word: 'freundlich', translation: 'simpático/amigável', example: 'Sie ist sehr freundlich.', translatedExample: 'Ela é muito simpática.', order: 1 },
            { word: 'geduldig', translation: 'paciente', example: 'Der Lehrer ist sehr geduldig.', translatedExample: 'O professor é muito paciente.', order: 2 },
            { word: 'ehrlich', translation: 'honesto', example: 'Er ist immer ehrlich.', translatedExample: 'Ele é sempre honesto.', order: 3 },
            { word: 'mutig', translation: 'corajoso', example: 'Sie ist sehr mutig.', translatedExample: 'Ela é muito corajosa.', order: 4 },
            { word: 'neugierig', translation: 'curioso', example: 'Kinder sind von Natur aus neugierig.', translatedExample: 'Crianças são naturalmente curiosas.', order: 5 },
            { word: 'faul', translation: 'preguiçoso', example: 'Er ist leider faul.', translatedExample: 'Infelizmente ele é preguiçoso.', order: 6 },
            { word: 'fleißig', translation: 'dedicado/trabalhador', example: 'Sie ist sehr fleißig in der Schule.', translatedExample: 'Ela é muito dedicada na escola.', order: 7 },
            { word: 'kreativ', translation: 'criativo', example: 'Er hat eine kreative Persönlichkeit.', translatedExample: 'Ele tem uma personalidade criativa.', order: 8 },
            { word: 'humorvoll', translation: 'bem-humorado', example: 'Sie ist immer humorvoll.', translatedExample: 'Ela é sempre bem-humorada.', order: 9 },
            { word: 'zuverlässig', translation: 'confiável', example: 'Er ist ein zuverlässiger Freund.', translatedExample: 'Ele é um amigo confiável.', order: 10 },
          ],
        },
        {
          title: 'Beziehungen & Familie',
          description: 'Zwischenmenschliche Beziehungen',
          order: 3,
          vocabulary: [
            { word: 'Freundschaft', translation: 'amizade', example: 'Unsere Freundschaft ist sehr stark.', translatedExample: 'Nossa amizade é muito forte.', order: 1 },
            { word: 'Liebe', translation: 'amor', example: 'Liebe ist das Wichtigste.', translatedExample: 'O amor é o mais importante.', order: 2 },
            { word: 'Vertrauen', translation: 'confiança', example: 'Vertrauen ist die Basis jeder Beziehung.', translatedExample: 'A confiança é a base de todo relacionamento.', order: 3 },
            { word: 'Respekt', translation: 'respeito', example: 'Gegenseitiger Respekt ist wichtig.', translatedExample: 'O respeito mútuo é importante.', order: 4 },
            { word: 'Eifersucht', translation: 'ciúme', example: 'Eifersucht kann eine Beziehung zerstören.', translatedExample: 'O ciúme pode destruir um relacionamento.', order: 5 },
            { word: 'Treue', translation: 'fidelidade', example: 'Treue ist sehr wichtig für ihn.', translatedExample: 'A fidelidade é muito importante para ele.', order: 6 },
            { word: 'Partnerschaft', translation: 'parceria/relacionamento', example: 'Eine gute Partnerschaft basiert auf Respekt.', translatedExample: 'Uma boa parceria é baseada no respeito.', order: 7 },
            { word: 'Verständnis', translation: 'compreensão', example: 'Ich brauche dein Verständnis.', translatedExample: 'Preciso da sua compreensão.', order: 8 },
            { word: 'Bindung', translation: 'vínculo', example: 'Wir haben eine starke Bindung.', translatedExample: 'Temos um vínculo forte.', order: 9 },
            { word: 'Zuneigung', translation: 'afeto/carinho', example: 'Ich zeige ihr meine Zuneigung.', translatedExample: 'Eu demonstro meu carinho por ela.', order: 10 },
          ],
        },
        {
          title: 'Soziales Leben',
          description: 'Gesellschaft und soziale Kontakte',
          order: 4,
          vocabulary: [
            { word: 'Verabredung', translation: 'encontro/compromisso', example: 'Ich habe eine Verabredung um 19 Uhr.', translatedExample: 'Tenho um encontro às 19 horas.', order: 1 },
            { word: 'Einladung', translation: 'convite', example: 'Danke für die Einladung!', translatedExample: 'Obrigado pelo convite!', order: 2 },
            { word: 'Besuch', translation: 'visita', example: 'Wir bekommen Besuch am Wochenende.', translatedExample: 'Recebemos visita no fim de semana.', order: 3 },
            { word: 'Smalltalk', translation: 'bate-papo/conversa casual', example: 'Smalltalk ist wichtig auf Partys.', translatedExample: 'Bate-papo é importante em festas.', order: 4 },
            { word: 'Höflichkeit', translation: 'educação/cortesia', example: 'Höflichkeit öffnet viele Türen.', translatedExample: 'A cortesia abre muitas portas.', order: 5 },
            { word: 'Kompliment', translation: 'elogio', example: 'Er macht ihr immer Komplimente.', translatedExample: 'Ele sempre faz elogios a ela.', order: 6 },
            { word: 'Netzwerk', translation: 'rede de contatos', example: 'Ein gutes Netzwerk ist beruflich wichtig.', translatedExample: 'Uma boa rede de contatos é importante profissionalmente.', order: 7 },
            { word: 'Gastgeber', translation: 'anfitrião', example: 'Der Gastgeber war sehr aufmerksam.', translatedExample: 'O anfitrião foi muito atencioso.', order: 8 },
            { word: 'Gast', translation: 'convidado/hóspede', example: 'Wir haben viele Gäste eingeladen.', translatedExample: 'Convidamos muitos convidados.', order: 9 },
            { word: 'Gesellschaft', translation: 'companhia/sociedade', example: 'Ich genieße deine Gesellschaft.', translatedExample: 'Eu aprecio sua companhia.', order: 10 },
          ],
        },
        {
          title: 'Konflikte & Kommunikation',
          description: 'Konflikte lösen und kommunizieren',
          order: 5,
          vocabulary: [
            { word: 'Streit', translation: 'briga/discussão', example: 'Wir hatten einen kleinen Streit.', translatedExample: 'Tivemos uma pequena discussão.', order: 1 },
            { word: 'Entschuldigung', translation: 'desculpa/pedido de desculpas', example: 'Ich bitte um Entschuldigung.', translatedExample: 'Peço desculpas.', order: 2 },
            { word: 'Kompromiss', translation: 'acordo/meio-termo', example: 'Wir fanden einen guten Kompromiss.', translatedExample: 'Encontramos um bom acordo.', order: 3 },
            { word: 'Meinung', translation: 'opinião', example: 'Das ist meine persönliche Meinung.', translatedExample: 'Essa é minha opinião pessoal.', order: 4 },
            { word: 'Diskussion', translation: 'discussão/debate', example: 'Wir hatten eine interessante Diskussion.', translatedExample: 'Tivemos um debate interessante.', order: 5 },
            { word: 'Missverständnis', translation: 'mal-entendido', example: 'Das war ein Missverständnis.', translatedExample: 'Foi um mal-entendido.', order: 6 },
            { word: 'kritisieren', translation: 'criticar', example: 'Er kritisiert alles.', translatedExample: 'Ele critica tudo.', order: 7 },
            { word: 'loben', translation: 'elogiar/louvar', example: 'Die Lehrerin lobt die Schüler.', translatedExample: 'A professora elogia os alunos.', order: 8 },
            { word: 'Argument', translation: 'argumento', example: 'Das ist ein gutes Argument.', translatedExample: 'Esse é um bom argumento.', order: 9 },
            { word: 'Lösung', translation: 'solução', example: 'Wir haben eine Lösung gefunden.', translatedExample: 'Encontramos uma solução.', order: 10 },
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
