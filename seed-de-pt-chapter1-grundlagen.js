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

    // Deutsch => Portugiesisch - Kapitel 1: Grundlagen
    const chapter = {
      title: 'Grundlagen',
      description: 'Lerne die wichtigsten Grundlagen der portugiesischen Sprache',
      order: 1,
      subchapters: [
        {
          title: 'Begrüßungen',
          description: 'Grundlegende Begrüßungen und Verabschiedungen',
          order: 1,
          vocabulary: [
            { word: 'Hallo', translation: 'Olá', example: 'Hallo, wie geht es dir?', translatedExample: 'Olá, como você está?', order: 1 },
            { word: 'Guten Morgen', translation: 'Bom dia', example: 'Guten Morgen! Hast du gut geschlafen?', translatedExample: 'Bom dia! Você dormiu bem?', order: 2 },
            { word: 'Guten Tag', translation: 'Boa tarde', example: 'Guten Tag, schönes Wetter heute.', translatedExample: 'Boa tarde, tempo bonito hoje.', order: 3 },
            { word: 'Guten Abend', translation: 'Boa noite', example: 'Guten Abend, angenehmen Aufenthalt!', translatedExample: 'Boa noite, aproveite sua estadia!', order: 4 },
            { word: 'Tschüss', translation: 'Tchau', example: 'Tschüss, bis morgen!', translatedExample: 'Tchau, até amanhã!', order: 5 },
            { word: 'Auf Wiedersehen', translation: 'Até logo', example: 'Auf Wiedersehen, schönen Tag noch!', translatedExample: 'Até logo, tenha um bom dia!', order: 6 },
            { word: 'Danke', translation: 'Obrigado', example: 'Danke für deine Hilfe!', translatedExample: 'Obrigado pela sua ajuda!', order: 7 },
            { word: 'Bitte', translation: 'Por favor', example: 'Bitte gib mir das Salz.', translatedExample: 'Por favor, me dê o sal.', order: 8 },
            { word: 'Entschuldigung', translation: 'Desculpe', example: 'Entschuldigung, ich habe mich verspätet.', translatedExample: 'Desculpe, eu me atrasei.', order: 9 },
            { word: 'Ja', translation: 'Sim', example: 'Ja, ich verstehe.', translatedExample: 'Sim, eu entendo.', order: 10 },
          ],
        },
        {
          title: 'Familie',
          description: 'Familienmitglieder und Verwandtschaft',
          order: 2,
          vocabulary: [
            { word: 'Familie', translation: 'Família', example: 'Meine Familie ist sehr groß.', translatedExample: 'Minha família é muito grande.', order: 1 },
            { word: 'Mutter', translation: 'Mãe', example: 'Meine Mutter kocht sehr gut.', translatedExample: 'Minha mãe cozinha muito bem.', order: 2 },
            { word: 'Vater', translation: 'Pai', example: 'Mein Vater arbeitet als Lehrer.', translatedExample: 'Meu pai trabalha como professor.', order: 3 },
            { word: 'Bruder', translation: 'Irmão', example: 'Mein Bruder spielt Fußball.', translatedExample: 'Meu irmão joga futebol.', order: 4 },
            { word: 'Schwester', translation: 'Irmã', example: 'Meine Schwester studiert Medizin.', translatedExample: 'Minha irmã estuda medicina.', order: 5 },
            { word: 'Großmutter', translation: 'Avó', example: 'Meine Großmutter erzählt tolle Geschichten.', translatedExample: 'Minha avó conta histórias legais.', order: 6 },
            { word: 'Großvater', translation: 'Avô', example: 'Mein Großvater liebt seinen Garten.', translatedExample: 'Meu avô ama seu jardim.', order: 7 },
            { word: 'Sohn', translation: 'Filho', example: 'Der Sohn ist fünf Jahre alt.', translatedExample: 'O filho tem cinco anos.', order: 8 },
            { word: 'Tochter', translation: 'Filha', example: 'Ihre Tochter geht in die Schule.', translatedExample: 'A filha dela vai à escola.', order: 9 },
            { word: 'Eltern', translation: 'Pais', example: 'Meine Eltern wohnen in Berlin.', translatedExample: 'Meus pais moram em Berlim.', order: 10 },
          ],
        },
        {
          title: 'Zahlen',
          description: 'Zahlen von 1 bis 10',
          order: 3,
          vocabulary: [
            { word: 'Eins', translation: 'Um', example: 'Ich habe ein Kind.', translatedExample: 'Eu tenho um filho.', order: 1 },
            { word: 'Zwei', translation: 'Dois', example: 'Ich habe zwei Brüder.', translatedExample: 'Eu tenho dois irmãos.', order: 2 },
            { word: 'Drei', translation: 'Três', example: 'Es sind drei Äpfel im Korb.', translatedExample: 'Há três maçãs na cesta.', order: 3 },
            { word: 'Vier', translation: 'Quatro', example: 'Der Tisch hat vier Beine.', translatedExample: 'A mesa tem quatro pernas.', order: 4 },
            { word: 'Fünf', translation: 'Cinco', example: 'Ich komme um fünf Uhr.', translatedExample: 'Eu venho às cinco horas.', order: 5 },
            { word: 'Sechs', translation: 'Seis', example: 'Das Baby ist sechs Monate alt.', translatedExample: 'O bebê tem seis meses.', order: 6 },
            { word: 'Sieben', translation: 'Sete', example: 'Die Woche hat sieben Tage.', translatedExample: 'A semana tem sete dias.', order: 7 },
            { word: 'Acht', translation: 'Oito', example: 'Ich stehe um acht Uhr auf.', translatedExample: 'Eu acordo às oito horas.', order: 8 },
            { word: 'Neun', translation: 'Nove', example: 'Der Kurs beginnt um neun.', translatedExample: 'O curso começa às nove.', order: 9 },
            { word: 'Zehn', translation: 'Dez', example: 'Ich habe zehn Finger.', translatedExample: 'Eu tenho dez dedos.', order: 10 },
          ],
        },
        {
          title: 'Farben',
          description: 'Die wichtigsten Farben',
          order: 4,
          vocabulary: [
            { word: 'Rot', translation: 'Vermelho', example: 'Die Rose ist rot.', translatedExample: 'A rosa é vermelha.', order: 1 },
            { word: 'Blau', translation: 'Azul', example: 'Der Himmel ist blau.', translatedExample: 'O céu é azul.', order: 2 },
            { word: 'Grün', translation: 'Verde', example: 'Das Gras ist grün.', translatedExample: 'A grama é verde.', order: 3 },
            { word: 'Gelb', translation: 'Amarelo', example: 'Die Banane ist gelb.', translatedExample: 'A banana é amarela.', order: 4 },
            { word: 'Schwarz', translation: 'Preto', example: 'Mein Auto ist schwarz.', translatedExample: 'Meu carro é preto.', order: 5 },
            { word: 'Weiß', translation: 'Branco', example: 'Die Wand ist weiß.', translatedExample: 'A parede é branca.', order: 6 },
            { word: 'Orange', translation: 'Laranja', example: 'Der Sonnenuntergang ist orange.', translatedExample: 'O pôr do sol é laranja.', order: 7 },
            { word: 'Rosa', translation: 'Rosa', example: 'Ihr Kleid ist rosa.', translatedExample: 'O vestido dela é rosa.', order: 8 },
            { word: 'Braun', translation: 'Marrom', example: 'Der Tisch ist braun.', translatedExample: 'A mesa é marrom.', order: 9 },
            { word: 'Grau', translation: 'Cinza', example: 'Die Wolken sind grau.', translatedExample: 'As nuvens são cinzas.', order: 10 },
          ],
        },
        {
          title: 'Zeit & Wochentage',
          description: 'Die sieben Tage der Woche und wichtige Zeitausdrücke',
          order: 5,
          vocabulary: [
            { word: 'Montag', translation: 'Segunda-feira', example: 'Am Montag beginnt die Woche.', translatedExample: 'Na segunda-feira começa a semana.', order: 1 },
            { word: 'Dienstag', translation: 'Terça-feira', example: 'Am Dienstag habe ich einen Termin.', translatedExample: 'Na terça-feira eu tenho um compromisso.', order: 2 },
            { word: 'Mittwoch', translation: 'Quarta-feira', example: 'Mittwoch ist mitte der Woche.', translatedExample: 'Quarta-feira é meio da semana.', order: 3 },
            { word: 'Donnerstag', translation: 'Quinta-feira', example: 'Am Donnerstag gehe ich einkaufen.', translatedExample: 'Na quinta-feira eu vou às compras.', order: 4 },
            { word: 'Freitag', translation: 'Sexta-feira', example: 'Freitag ist mein Lieblingstag.', translatedExample: 'Sexta-feira é meu dia favorito.', order: 5 },
            { word: 'Samstag', translation: 'Sábado', example: 'Am Samstag schlafe ich lange.', translatedExample: 'No sábado eu durmo até tarde.', order: 6 },
            { word: 'Sonntag', translation: 'Domingo', example: 'Am Sonntag besuche ich meine Familie.', translatedExample: 'No domingo eu visito minha família.', order: 7 },
            { word: 'Heute', translation: 'Hoje', example: 'Heute ist ein schöner Tag.', translatedExample: 'Hoje é um dia bonito.', order: 8 },
            { word: 'Morgen', translation: 'Amanhã', example: 'Morgen fahre ich nach Berlin.', translatedExample: 'Amanhã eu vou para Berlim.', order: 9 },
            { word: 'Gestern', translation: 'Ontem', example: 'Gestern war Sonntag.', translatedExample: 'Ontem foi domingo.', order: 10 },
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
