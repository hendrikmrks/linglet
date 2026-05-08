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

    // Portugiesisch => Deutsch - Capítulo 14: Trabalho & Economia
    const chapter = {
      title: 'Trabalho & Economia',
      description: 'Trabalho, carreira e economia',
      order: 14,
      subchapters: [
        {
          title: 'Candidatura',
          description: 'Processo de candidatura a emprego',
          order: 1,
          vocabulary: [
            { word: 'currículo', translation: 'Lebenslauf', example: 'Eu atualizo meu currículo.', translatedExample: 'Ich aktualisiere meinen Lebenslauf.', order: 1 },
            { word: 'carta de apresentação', translation: 'Anschreiben', example: 'A carta de apresentação deve ser personalizada.', translatedExample: 'Das Anschreiben sollte individuell sein.', order: 2 },
            { word: 'entrevista de emprego', translation: 'Vorstellungsgespräch', example: 'A entrevista de emprego foi ontem.', translatedExample: 'Das Vorstellungsgespräch war gestern.', order: 3 },
            { word: 'vaga/anúncio de emprego', translation: 'Stellenanzeige', example: 'Encontrei uma vaga interessante.', translatedExample: 'Ich habe eine interessante Stellenanzeige gefunden.', order: 4 },
            { word: 'candidatar-se', translation: 'sich bewerben', example: 'Eu me candidato a vários empregos.', translatedExample: 'Ich bewerbe mich auf mehrere Stellen.', order: 5 },
            { word: 'referência/recomendação', translation: 'Referenz', example: 'Meu ex-chefe me deu uma referência.', translatedExample: 'Mein ehemaliger Chef gab mir eine Referenz.', order: 6 },
            { word: 'qualificação', translation: 'Qualifikation', example: 'Minhas qualificações são relevantes.', translatedExample: 'Meine Qualifikationen sind relevant.', order: 7 },
            { word: 'experiência profissional', translation: 'Berufserfahrung', example: 'Tenho cinco anos de experiência profissional.', translatedExample: 'Ich habe fünf Jahre Berufserfahrung.', order: 8 },
            { word: 'contratado/aceito', translation: 'eingestellt werden', example: 'Fui contratado na semana passada.', translatedExample: 'Ich wurde letzte Woche eingestellt.', order: 9 },
            { word: 'período de experiência', translation: 'Probezeit', example: 'O período de experiência dura três meses.', translatedExample: 'Die Probezeit dauert drei Monate.', order: 10 },
          ],
        },
        {
          title: 'No Trabalho',
          description: 'Ambiente e rotina de trabalho',
          order: 2,
          vocabulary: [
            { word: 'reunião', translation: 'Besprechung/Meeting', example: 'A reunião começa às nove.', translatedExample: 'Die Besprechung beginnt um neun Uhr.', order: 1 },
            { word: 'prazo/deadline', translation: 'Frist/Deadline', example: 'O prazo é amanhã.', translatedExample: 'Die Frist ist morgen.', order: 2 },
            { word: 'projeto', translation: 'Projekt', example: 'Estamos trabalhando em um projeto importante.', translatedExample: 'Wir arbeiten an einem wichtigen Projekt.', order: 3 },
            { word: 'colega de trabalho', translation: 'Arbeitskollege', example: 'Meu colega de trabalho é muito prestativo.', translatedExample: 'Mein Arbeitskollege ist sehr hilfsbereit.', order: 4 },
            { word: 'chefe/superior', translation: 'Vorgesetzte/r', example: 'Meu chefe está muito satisfeito.', translatedExample: 'Mein Vorgesetzter ist sehr zufrieden.', order: 5 },
            { word: 'home office/trabalho remoto', translation: 'Homeoffice', example: 'Eu trabalho em home office às sextas.', translatedExample: 'Ich arbeite freitags im Homeoffice.', order: 6 },
            { word: 'hora extra', translation: 'Überstunde', example: 'Fiz horas extras esta semana.', translatedExample: 'Ich habe diese Woche Überstunden gemacht.', order: 7 },
            { word: 'avaliação de desempenho', translation: 'Leistungsbeurteilung', example: 'A avaliação de desempenho foi positiva.', translatedExample: 'Die Leistungsbeurteilung war positiv.', order: 8 },
            { word: 'promoção', translation: 'Beförderung', example: 'Recebi uma promoção este ano.', translatedExample: 'Ich habe dieses Jahr eine Beförderung bekommen.', order: 9 },
            { word: 'demissão', translation: 'Kündigung', example: 'Recebi a carta de demissão ontem.', translatedExample: 'Ich habe gestern das Kündigungsschreiben bekommen.', order: 10 },
          ],
        },
        {
          title: 'Economia & Mercado',
          description: 'Economia e mercado de trabalho',
          order: 3,
          vocabulary: [
            { word: 'economia', translation: 'Wirtschaft', example: 'A economia cresce lentamente.', translatedExample: 'Die Wirtschaft wächst langsam.', order: 1 },
            { word: 'mercado', translation: 'Markt', example: 'O mercado está instável.', translatedExample: 'Der Markt ist instabil.', order: 2 },
            { word: 'concorrência', translation: 'Wettbewerb', example: 'A concorrência é muito alta.', translatedExample: 'Der Wettbewerb ist sehr hoch.', order: 3 },
            { word: 'oferta e demanda', translation: 'Angebot und Nachfrage', example: 'Oferta e demanda determinam o preço.', translatedExample: 'Angebot und Nachfrage bestimmen den Preis.', order: 4 },
            { word: 'inflação', translation: 'Inflation', example: 'A inflação subiu este ano.', translatedExample: 'Die Inflation ist dieses Jahr gestiegen.', order: 5 },
            { word: 'recessão', translation: 'Rezession', example: 'O país entrou em recessão.', translatedExample: 'Das Land ist in eine Rezession geraten.', order: 6 },
            { word: 'crescimento econômico', translation: 'Wirtschaftswachstum', example: 'O crescimento econômico foi de 2%.', translatedExample: 'Das Wirtschaftswachstum betrug 2%.', order: 7 },
            { word: 'desemprego', translation: 'Arbeitslosigkeit', example: 'O desemprego diminuiu.', translatedExample: 'Die Arbeitslosigkeit ist gesunken.', order: 8 },
            { word: 'salário mínimo', translation: 'Mindestlohn', example: 'O salário mínimo foi aumentado.', translatedExample: 'Der Mindestlohn wurde erhöht.', order: 9 },
            { word: 'empresa', translation: 'Unternehmen', example: 'A empresa tem 200 funcionários.', translatedExample: 'Das Unternehmen hat 200 Mitarbeiter.', order: 10 },
          ],
        },
        {
          title: 'Finanças & Impostos',
          description: 'Finanças pessoais e impostos',
          order: 4,
          vocabulary: [
            { word: 'conta bancária', translation: 'Bankkonto', example: 'Eu abro uma conta bancária.', translatedExample: 'Ich eröffne ein Bankkonto.', order: 1 },
            { word: 'transferência bancária', translation: 'Überweisung', example: 'Eu faço uma transferência bancária.', translatedExample: 'Ich mache eine Überweisung.', order: 2 },
            { word: 'imposto de renda', translation: 'Einkommensteuer', example: 'Eu declaro meu imposto de renda.', translatedExample: 'Ich mache meine Einkommensteuererklärung.', order: 3 },
            { word: 'declaração de imposto', translation: 'Steuererklärung', example: 'A declaração de imposto vence em abril.', translatedExample: 'Die Steuererklärung ist im April fällig.', order: 4 },
            { word: 'aposentadoria/pensão', translation: 'Rente', example: 'Ele se aposenta em cinco anos.', translatedExample: 'Er geht in fünf Jahren in Rente.', order: 5 },
            { word: 'seguro desemprego', translation: 'Arbeitslosengeld', example: 'Ele recebe seguro desemprego.', translatedExample: 'Er bekommt Arbeitslosengeld.', order: 6 },
            { word: 'investimento', translation: 'Investition', example: 'Este investimento é arriscado.', translatedExample: 'Diese Investition ist riskant.', order: 7 },
            { word: 'ações', translation: 'Aktien', example: 'Eu compro ações na bolsa.', translatedExample: 'Ich kaufe Aktien an der Börse.', order: 8 },
            { word: 'dívida', translation: 'Schulden', example: 'Ele tem muitas dívidas.', translatedExample: 'Er hat viele Schulden.', order: 9 },
            { word: 'poupança', translation: 'Ersparnisse', example: 'Ela guarda suas poupanças com cuidado.', translatedExample: 'Sie verwaltet ihre Ersparnisse sorgfältig.', order: 10 },
          ],
        },
        {
          title: 'Globalização & Digitalização',
          description: 'Globalização e transformação digital',
          order: 5,
          vocabulary: [
            { word: 'globalização', translation: 'Globalisierung', example: 'A globalização conecta os mercados.', translatedExample: 'Die Globalisierung verbindet Märkte.', order: 1 },
            { word: 'digitalização', translation: 'Digitalisierung', example: 'A digitalização transforma o trabalho.', translatedExample: 'Die Digitalisierung verändert die Arbeit.', order: 2 },
            { word: 'inteligência artificial', translation: 'Künstliche Intelligenz', example: 'A inteligência artificial muda muitos setores.', translatedExample: 'Künstliche Intelligenz verändert viele Branchen.', order: 3 },
            { word: 'automação', translation: 'Automatisierung', example: 'A automação substitui alguns empregos.', translatedExample: 'Automatisierung ersetzt manche Jobs.', order: 4 },
            { word: 'startup', translation: 'Start-up', example: 'Ela fundou uma startup de tecnologia.', translatedExample: 'Sie hat ein Technologie-Start-up gegründet.', order: 5 },
            { word: 'trabalho remoto', translation: 'Remote-Arbeit', example: 'O trabalho remoto cresce após a pandemia.', translatedExample: 'Remote-Arbeit wächst nach der Pandemie.', order: 6 },
            { word: 'comércio eletrônico', translation: 'E-Commerce', example: 'O comércio eletrônico cresceu muito.', translatedExample: 'E-Commerce ist stark gewachsen.', order: 7 },
            { word: 'cadeia de suprimentos', translation: 'Lieferkette', example: 'A cadeia de suprimentos foi interrompida.', translatedExample: 'Die Lieferkette wurde unterbrochen.', order: 8 },
            { word: 'exportação', translation: 'Export', example: 'A exportação de café aumentou.', translatedExample: 'Der Kaffeeexport ist gestiegen.', order: 9 },
            { word: 'importação', translation: 'Import', example: 'A importação de eletrônicos é alta.', translatedExample: 'Der Import von Elektronik ist hoch.', order: 10 },
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
