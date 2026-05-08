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

    // Portugiesisch => Deutsch - Kapitel 1: Fundamentos
    const chapter = {
      title: 'Fundamentos',
      description: 'Aprenda os fundamentos básicos da língua alemã',
      order: 1,
      subchapters: [
        {
          title: 'Saudações',
          description: 'Saudações e despedidas básicas',
          order: 1,
          vocabulary: [
            { word: 'Olá', translation: 'Hallo', example: 'Olá, como você está?', translatedExample: 'Hallo, wie geht es dir?', order: 1 },
            { word: 'Bom dia', translation: 'Guten Morgen', example: 'Bom dia! Você dormiu bem?', translatedExample: 'Guten Morgen! Hast du gut geschlafen?', order: 2 },
            { word: 'Boa tarde', translation: 'Guten Tag', example: 'Boa tarde, tempo bonito hoje.', translatedExample: 'Guten Tag, schönes Wetter heute.', order: 3 },
            { word: 'Boa noite', translation: 'Guten Abend', example: 'Boa noite, aproveite sua estadia!', translatedExample: 'Guten Abend, angenehmen Aufenthalt!', order: 4 },
            { word: 'Tchau', translation: 'Tschüss', example: 'Tchau, até amanhã!', translatedExample: 'Tschüss, bis morgen!', order: 5 },
            { word: 'Até logo', translation: 'Auf Wiedersehen', example: 'Até logo, tenha um bom dia!', translatedExample: 'Auf Wiedersehen, schönen Tag noch!', order: 6 },
            { word: 'Obrigado', translation: 'Danke', example: 'Obrigado pela sua ajuda!', translatedExample: 'Danke für deine Hilfe!', order: 7 },
            { word: 'Por favor', translation: 'Bitte', example: 'Por favor, me dê o sal.', translatedExample: 'Bitte gib mir das Salz.', order: 8 },
            { word: 'Desculpe', translation: 'Entschuldigung', example: 'Desculpe, eu me atrasei.', translatedExample: 'Entschuldigung, ich habe mich verspätet.', order: 9 },
            { word: 'Sim', translation: 'Ja', example: 'Sim, eu entendo.', translatedExample: 'Ja, ich verstehe.', order: 10 },
          ],
        },
        {
          title: 'Família',
          description: 'Membros da família e parentesco',
          order: 2,
          vocabulary: [
            { word: 'Família', translation: 'Familie', example: 'Minha família é muito grande.', translatedExample: 'Meine Familie ist sehr groß.', order: 1 },
            { word: 'Mãe', translation: 'Mutter', example: 'Minha mãe cozinha muito bem.', translatedExample: 'Meine Mutter kocht sehr gut.', order: 2 },
            { word: 'Pai', translation: 'Vater', example: 'Meu pai trabalha como professor.', translatedExample: 'Mein Vater arbeitet als Lehrer.', order: 3 },
            { word: 'Irmão', translation: 'Bruder', example: 'Meu irmão joga futebol.', translatedExample: 'Mein Bruder spielt Fußball.', order: 4 },
            { word: 'Irmã', translation: 'Schwester', example: 'Minha irmã estuda medicina.', translatedExample: 'Meine Schwester studiert Medizin.', order: 5 },
            { word: 'Avó', translation: 'Großmutter', example: 'Minha avó conta histórias legais.', translatedExample: 'Meine Großmutter erzählt tolle Geschichten.', order: 6 },
            { word: 'Avô', translation: 'Großvater', example: 'Meu avô ama seu jardim.', translatedExample: 'Mein Großvater liebt seinen Garten.', order: 7 },
            { word: 'Filho', translation: 'Sohn', example: 'O filho tem cinco anos.', translatedExample: 'Der Sohn ist fünf Jahre alt.', order: 8 },
            { word: 'Filha', translation: 'Tochter', example: 'A filha dela vai à escola.', translatedExample: 'Ihre Tochter geht in die Schule.', order: 9 },
            { word: 'Pais', translation: 'Eltern', example: 'Meus pais moram em Berlim.', translatedExample: 'Meine Eltern wohnen in Berlin.', order: 10 },
          ],
        },
        {
          title: 'Números',
          description: 'Números de 1 a 10',
          order: 3,
          vocabulary: [
            { word: 'Um', translation: 'Eins', example: 'Eu tenho um filho.', translatedExample: 'Ich habe ein Kind.', order: 1 },
            { word: 'Dois', translation: 'Zwei', example: 'Eu tenho dois irmãos.', translatedExample: 'Ich habe zwei Brüder.', order: 2 },
            { word: 'Três', translation: 'Drei', example: 'Há três maçãs na cesta.', translatedExample: 'Es sind drei Äpfel im Korb.', order: 3 },
            { word: 'Quatro', translation: 'Vier', example: 'A mesa tem quatro pernas.', translatedExample: 'Der Tisch hat vier Beine.', order: 4 },
            { word: 'Cinco', translation: 'Fünf', example: 'Eu venho às cinco horas.', translatedExample: 'Ich komme um fünf Uhr.', order: 5 },
            { word: 'Seis', translation: 'Sechs', example: 'O bebê tem seis meses.', translatedExample: 'Das Baby ist sechs Monate alt.', order: 6 },
            { word: 'Sete', translation: 'Sieben', example: 'A semana tem sete dias.', translatedExample: 'Die Woche hat sieben Tage.', order: 7 },
            { word: 'Oito', translation: 'Acht', example: 'Eu acordo às oito horas.', translatedExample: 'Ich stehe um acht Uhr auf.', order: 8 },
            { word: 'Nove', translation: 'Neun', example: 'O curso começa às nove.', translatedExample: 'Der Kurs beginnt um neun.', order: 9 },
            { word: 'Dez', translation: 'Zehn', example: 'Eu tenho dez dedos.', translatedExample: 'Ich habe zehn Finger.', order: 10 },
          ],
        },
        {
          title: 'Cores',
          description: 'As cores mais importantes',
          order: 4,
          vocabulary: [
            { word: 'Vermelho', translation: 'Rot', example: 'A rosa é vermelha.', translatedExample: 'Die Rose ist rot.', order: 1 },
            { word: 'Azul', translation: 'Blau', example: 'O céu é azul.', translatedExample: 'Der Himmel ist blau.', order: 2 },
            { word: 'Verde', translation: 'Grün', example: 'A grama é verde.', translatedExample: 'Das Gras ist grün.', order: 3 },
            { word: 'Amarelo', translation: 'Gelb', example: 'A banana é amarela.', translatedExample: 'Die Banane ist gelb.', order: 4 },
            { word: 'Preto', translation: 'Schwarz', example: 'Meu carro é preto.', translatedExample: 'Mein Auto ist schwarz.', order: 5 },
            { word: 'Branco', translation: 'Weiß', example: 'A parede é branca.', translatedExample: 'Die Wand ist weiß.', order: 6 },
            { word: 'Laranja', translation: 'Orange', example: 'O pôr do sol é laranja.', translatedExample: 'Der Sonnenuntergang ist orange.', order: 7 },
            { word: 'Rosa', translation: 'Rosa', example: 'O vestido dela é rosa.', translatedExample: 'Ihr Kleid ist rosa.', order: 8 },
            { word: 'Marrom', translation: 'Braun', example: 'A mesa é marrom.', translatedExample: 'Der Tisch ist braun.', order: 9 },
            { word: 'Cinza', translation: 'Grau', example: 'As nuvens são cinzas.', translatedExample: 'Die Wolken sind grau.', order: 10 },
          ],
        },
        {
          title: 'Dias da semana & Tempo',
          description: 'Os sete dias da semana e expressões de tempo importantes',
          order: 5,
          vocabulary: [
            { word: 'Segunda-feira', translation: 'Montag', example: 'Na segunda-feira começa a semana.', translatedExample: 'Am Montag beginnt die Woche.', order: 1 },
            { word: 'Terça-feira', translation: 'Dienstag', example: 'Na terça-feira eu tenho um compromisso.', translatedExample: 'Am Dienstag habe ich einen Termin.', order: 2 },
            { word: 'Quarta-feira', translation: 'Mittwoch', example: 'Quarta-feira é meio da semana.', translatedExample: 'Mittwoch ist mitte der Woche.', order: 3 },
            { word: 'Quinta-feira', translation: 'Donnerstag', example: 'Na quinta-feira eu vou às compras.', translatedExample: 'Am Donnerstag gehe ich einkaufen.', order: 4 },
            { word: 'Sexta-feira', translation: 'Freitag', example: 'Sexta-feira é meu dia favorito.', translatedExample: 'Freitag ist mein Lieblingstag.', order: 5 },
            { word: 'Sábado', translation: 'Samstag', example: 'No sábado eu durmo até tarde.', translatedExample: 'Am Samstag schlafe ich lange.', order: 6 },
            { word: 'Domingo', translation: 'Sonntag', example: 'No domingo eu visito minha família.', translatedExample: 'Am Sonntag besuche ich meine Familie.', order: 7 },
            { word: 'Hoje', translation: 'Heute', example: 'Hoje é um dia bonito.', translatedExample: 'Heute ist ein schöner Tag.', order: 8 },
            { word: 'Amanhã', translation: 'Morgen', example: 'Amanhã eu vou para Berlim.', translatedExample: 'Morgen fahre ich nach Berlin.', order: 9 },
            { word: 'Ontem', translation: 'Gestern', example: 'Ontem foi domingo.', translatedExample: 'Gestern war Sonntag.', order: 10 },
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
