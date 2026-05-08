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

    // Deutsch => Portugiesisch - Kapitel 2: Alltag
    const chapter = {
      title: 'Alltag',
      description: 'Vokabeln für den täglichen Gebrauch',
      order: 2,
      subchapters: [
        {
          title: 'Essen',
          description: 'Häufige Lebensmittel und Speisen',
          order: 1,
          vocabulary: [
            { word: 'Brot', translation: 'Pão', example: 'Ich esse gerne Brot zum Frühstück.', translatedExample: 'Eu gosto de comer pão no café da manhã.', order: 1 },
            { word: 'Wasser', translation: 'Água', example: 'Ich trinke viel Wasser.', translatedExample: 'Eu bebo muita água.', order: 2 },
            { word: 'Fleisch', translation: 'Carne', example: 'Das Fleisch ist zart.', translatedExample: 'A carne está macia.', order: 3 },
            { word: 'Fisch', translation: 'Peixe', example: 'Fisch ist sehr gesund.', translatedExample: 'Peixe é muito saudável.', order: 4 },
            { word: 'Gemüse', translation: 'Legumes', example: 'Ich esse jeden Tag Gemüse.', translatedExample: 'Eu como legumes todos os dias.', order: 5 },
            { word: 'Obst', translation: 'Frutas', example: 'Obst ist lecker und gesund.', translatedExample: 'Frutas são gostosas e saudáveis.', order: 6 },
            { word: 'Reis', translation: 'Arroz', example: 'Reis passt gut zu Bohnen.', translatedExample: 'Arroz combina bem com feijão.', order: 7 },
            { word: 'Käse', translation: 'Queijo', example: 'Dieser Käse schmeckt ausgezeichnet.', translatedExample: 'Este queijo é excelente.', order: 8 },
            { word: 'Ei', translation: 'Ovo', example: 'Ich esse ein Ei zum Frühstück.', translatedExample: 'Eu como um ovo no café da manhã.', order: 9 },
            { word: 'Milch', translation: 'Leite', example: 'Ich trinke Milch mit Kaffee.', translatedExample: 'Eu bebo leite com café.', order: 10 },
          ],
        },
        {
          title: 'Getränke',
          description: 'Verschiedene Getränke',
          order: 2,
          vocabulary: [
            { word: 'Kaffee', translation: 'Café', example: 'Ich trinke jeden Morgen Kaffee.', translatedExample: 'Eu tomo café toda manhã.', order: 1 },
            { word: 'Tee', translation: 'Chá', example: 'Tee hilft mir beim Entspannen.', translatedExample: 'Chá me ajuda a relaxar.', order: 2 },
            { word: 'Saft', translation: 'Suco', example: 'Orangensaft ist mein Lieblingssaft.', translatedExample: 'Suco de laranja é meu suco favorito.', order: 3 },
            { word: 'Bier', translation: 'Cerveja', example: 'Ein kaltes Bier im Sommer ist perfekt.', translatedExample: 'Uma cerveja gelada no verão é perfeita.', order: 4 },
            { word: 'Wein', translation: 'Vinho', example: 'Rotwein passt gut zu Fleisch.', translatedExample: 'Vinho tinto combina bem com carne.', order: 5 },
            { word: 'Limonade', translation: 'Limonada', example: 'Diese Limonade ist sehr erfrischend.', translatedExample: 'Esta limonada é muito refrescante.', order: 6 },
            { word: 'Mineralwasser', translation: 'Água mineral', example: 'Ich trinke lieber Mineralwasser als Leitungswasser.', translatedExample: 'Prefiro beber água mineral a água da torneira.', order: 7 },
            { word: 'Eistee', translation: 'Chá gelado', example: 'Im Sommer trinke ich gerne Eistee.', translatedExample: 'No verão eu gosto de beber chá gelado.', order: 8 },
            { word: 'Kakao', translation: 'Chocolate quente', example: 'Im Winter liebe ich heißen Kakao.', translatedExample: 'No inverno eu amo chocolate quente.', order: 9 },
            { word: 'Smoothie', translation: 'Smoothie', example: 'Ein Smoothie ist gesund und lecker.', translatedExample: 'Um smoothie é saudável e gostoso.', order: 10 },
          ],
        },
        {
          title: 'Einkaufen',
          description: 'Vokabeln rund ums Einkaufen',
          order: 3,
          vocabulary: [
            { word: 'Geschäft', translation: 'Loja', example: 'Das Geschäft ist um die Ecke.', translatedExample: 'A loja fica na esquina.', order: 1 },
            { word: 'Supermarkt', translation: 'Supermercado', example: 'Ich gehe zum Supermarkt.', translatedExample: 'Eu vou ao supermercado.', order: 2 },
            { word: 'Preis', translation: 'Preço', example: 'Was ist der Preis?', translatedExample: 'Qual é o preço?', order: 3 },
            { word: 'Kasse', translation: 'Caixa', example: 'Bitte zahlen Sie an der Kasse.', translatedExample: 'Por favor, pague no caixa.', order: 4 },
            { word: 'Einkaufswagen', translation: 'Carrinho de compras', example: 'Der Einkaufswagen ist voll.', translatedExample: 'O carrinho de compras está cheio.', order: 5 },
            { word: 'Geld', translation: 'Dinheiro', example: 'Ich habe kein Geld dabei.', translatedExample: 'Eu não tenho dinheiro.', order: 6 },
            { word: 'Kreditkarte', translation: 'Cartão de crédito', example: 'Kann ich mit Kreditkarte zahlen?', translatedExample: 'Posso pagar com cartão de crédito?', order: 7 },
            { word: 'Verkäufer', translation: 'Vendedor', example: 'Der Verkäufer ist sehr freundlich.', translatedExample: 'O vendedor é muito simpático.', order: 8 },
            { word: 'Tasche', translation: 'Sacola', example: 'Ich brauche eine Tasche.', translatedExample: 'Eu preciso de uma sacola.', order: 9 },
            { word: 'Rabatt', translation: 'Desconto', example: 'Gibt es einen Rabatt?', translatedExample: 'Há algum desconto?', order: 10 },
          ],
        },
        {
          title: 'Wetter',
          description: 'Wetter und Jahreszeiten',
          order: 4,
          vocabulary: [
            { word: 'Sonne', translation: 'Sol', example: 'Die Sonne scheint hell.', translatedExample: 'O sol brilha forte.', order: 1 },
            { word: 'Regen', translation: 'Chuva', example: 'Es regnet heute.', translatedExample: 'Está chovendo hoje.', order: 2 },
            { word: 'Schnee', translation: 'Neve', example: 'Im Winter fällt Schnee.', translatedExample: 'No inverno cai neve.', order: 3 },
            { word: 'Wind', translation: 'Vento', example: 'Der Wind ist kalt.', translatedExample: 'O vento está frio.', order: 4 },
            { word: 'Wolke', translation: 'Nuvem', example: 'Die Wolken sind dunkel.', translatedExample: 'As nuvens estão escuras.', order: 5 },
            { word: 'Winter', translation: 'Inverno', example: 'Im Winter ist es kalt und dunkel.', translatedExample: 'No inverno está frio e escuro.', order: 6 },
            { word: 'Kalt', translation: 'Frio', example: 'Gestern war es kalt.', translatedExample: 'Ontem estava frio.', order: 7 },
            { word: 'Frühling', translation: 'Primavera', example: 'Im Frühling blühen die Blumen.', translatedExample: 'Na primavera as flores florescem.', order: 8 },
            { word: 'Sommer', translation: 'Verão', example: 'Der Sommer ist meine Lieblingsjahreszeit.', translatedExample: 'O verão é minha estação favorita.', order: 9 },
            { word: 'Herbst', translation: 'Outono', example: 'Im Herbst fallen die Blätter.', translatedExample: 'No outono as folhas caem.', order: 10 },
          ],
        },
        {
          title: 'Verkehr',
          description: 'Verkehrsmittel und Fortbewegung',
          order: 5,
          vocabulary: [
            { word: 'Auto', translation: 'Carro', example: 'Mein Auto ist neu.', translatedExample: 'Meu carro é novo.', order: 1 },
            { word: 'Bus', translation: 'Ônibus', example: 'Ich fahre mit dem Bus.', translatedExample: 'Eu vou de ônibus.', order: 2 },
            { word: 'Zug', translation: 'Trem', example: 'Der Zug ist pünktlich.', translatedExample: 'O trem está no horário.', order: 3 },
            { word: 'Flugzeug', translation: 'Avião', example: 'Das Flugzeug fliegt hoch.', translatedExample: 'O avião voa alto.', order: 4 },
            { word: 'Fahrrad', translation: 'Bicicleta', example: 'Ich fahre gerne Fahrrad.', translatedExample: 'Eu gosto de andar de bicicleta.', order: 5 },
            { word: 'Taxi', translation: 'Táxi', example: 'Wir nehmen ein Taxi.', translatedExample: 'Nós pegamos um táxi.', order: 6 },
            { word: 'Straße', translation: 'Rua', example: 'Die Straße ist breit.', translatedExample: 'A rua é larga.', order: 7 },
            { word: 'Haltestelle', translation: 'Ponto', example: 'Die Haltestelle ist hier.', translatedExample: 'O ponto é aqui.', order: 8 },
            { word: 'Ticket', translation: 'Bilhete', example: 'Ich kaufe ein Ticket.', translatedExample: 'Eu compro um bilhete.', order: 9 },
            { word: 'Bahnhof', translation: 'Estação', example: 'Der Bahnhof ist groß.', translatedExample: 'A estação é grande.', order: 10 },
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
