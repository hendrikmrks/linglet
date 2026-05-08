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

    // Portugiesisch => Deutsch - Kapitel 2: Dia a dia
    const chapter = {
      title: 'Dia a dia',
      description: 'Vocabulário para uso diário',
      order: 2,
      subchapters: [
        {
          title: 'Comida',
          description: 'Alimentos e comidas comuns',
          order: 1,
          vocabulary: [
            { word: 'Pão', translation: 'Brot', example: 'Eu gosto de comer pão no café da manhã.', translatedExample: 'Ich esse gerne Brot zum Frühstück.', order: 1 },
            { word: 'Água', translation: 'Wasser', example: 'Eu bebo muita água.', translatedExample: 'Ich trinke viel Wasser.', order: 2 },
            { word: 'Carne', translation: 'Fleisch', example: 'A carne está macia.', translatedExample: 'Das Fleisch ist zart.', order: 3 },
            { word: 'Peixe', translation: 'Fisch', example: 'Peixe é muito saudável.', translatedExample: 'Fisch ist sehr gesund.', order: 4 },
            { word: 'Legumes', translation: 'Gemüse', example: 'Eu como legumes todos os dias.', translatedExample: 'Ich esse jeden Tag Gemüse.', order: 5 },
            { word: 'Frutas', translation: 'Obst', example: 'Frutas são gostosas e saudáveis.', translatedExample: 'Obst ist lecker und gesund.', order: 6 },
            { word: 'Arroz', translation: 'Reis', example: 'Arroz combina bem com feijão.', translatedExample: 'Reis passt gut zu Bohnen.', order: 7 },
            { word: 'Queijo', translation: 'Käse', example: 'Este queijo é excelente.', translatedExample: 'Dieser Käse schmeckt ausgezeichnet.', order: 8 },
            { word: 'Ovo', translation: 'Ei', example: 'Eu como um ovo no café da manhã.', translatedExample: 'Ich esse ein Ei zum Frühstück.', order: 9 },
            { word: 'Leite', translation: 'Milch', example: 'Eu bebo leite com café.', translatedExample: 'Ich trinke Milch mit Kaffee.', order: 10 },
          ],
        },
        {
          title: 'Bebidas',
          description: 'Diferentes bebidas',
          order: 2,
          vocabulary: [
            { word: 'Café', translation: 'Kaffee', example: 'Eu tomo café toda manhã.', translatedExample: 'Ich trinke jeden Morgen Kaffee.', order: 1 },
            { word: 'Chá', translation: 'Tee', example: 'Chá me ajuda a relaxar.', translatedExample: 'Tee hilft mir beim Entspannen.', order: 2 },
            { word: 'Suco', translation: 'Saft', example: 'Suco de laranja é meu suco favorito.', translatedExample: 'Orangensaft ist mein Lieblingssaft.', order: 3 },
            { word: 'Cerveja', translation: 'Bier', example: 'Uma cerveja gelada no verão é perfeita.', translatedExample: 'Ein kaltes Bier im Sommer ist perfekt.', order: 4 },
            { word: 'Vinho', translation: 'Wein', example: 'Vinho tinto combina bem com carne.', translatedExample: 'Rotwein passt gut zu Fleisch.', order: 5 },
            { word: 'Limonada', translation: 'Limonade', example: 'Esta limonada é muito refrescante.', translatedExample: 'Diese Limonade ist sehr erfrischend.', order: 6 },
            { word: 'Água mineral', translation: 'Mineralwasser', example: 'Prefiro beber água mineral a água da torneira.', translatedExample: 'Ich trinke lieber Mineralwasser als Leitungswasser.', order: 7 },
            { word: 'Chá gelado', translation: 'Eistee', example: 'No verão eu gosto de beber chá gelado.', translatedExample: 'Im Sommer trinke ich gerne Eistee.', order: 8 },
            { word: 'Chocolate quente', translation: 'Kakao', example: 'No inverno eu amo chocolate quente.', translatedExample: 'Im Winter liebe ich heißen Kakao.', order: 9 },
            { word: 'Smoothie', translation: 'Smoothie', example: 'Um smoothie é saudável e gostoso.', translatedExample: 'Ein Smoothie ist gesund und lecker.', order: 10 },
          ],
        },
        {
          title: 'Compras',
          description: 'Vocabulário sobre compras',
          order: 3,
          vocabulary: [
            { word: 'Loja', translation: 'Geschäft', example: 'A loja fica na esquina.', translatedExample: 'Das Geschäft ist um die Ecke.', order: 1 },
            { word: 'Supermercado', translation: 'Supermarkt', example: 'Eu vou ao supermercado.', translatedExample: 'Ich gehe zum Supermarkt.', order: 2 },
            { word: 'Preço', translation: 'Preis', example: 'Qual é o preço?', translatedExample: 'Was ist der Preis?', order: 3 },
            { word: 'Caixa', translation: 'Kasse', example: 'Por favor, pague no caixa.', translatedExample: 'Bitte zahlen Sie an der Kasse.', order: 4 },
            { word: 'Carrinho de compras', translation: 'Einkaufswagen', example: 'O carrinho de compras está cheio.', translatedExample: 'Der Einkaufswagen ist voll.', order: 5 },
            { word: 'Dinheiro', translation: 'Geld', example: 'Eu não tenho dinheiro.', translatedExample: 'Ich habe kein Geld dabei.', order: 6 },
            { word: 'Cartão de crédito', translation: 'Kreditkarte', example: 'Posso pagar com cartão de crédito?', translatedExample: 'Kann ich mit Kreditkarte zahlen?', order: 7 },
            { word: 'Vendedor', translation: 'Verkäufer', example: 'O vendedor é muito simpático.', translatedExample: 'Der Verkäufer ist sehr freundlich.', order: 8 },
            { word: 'Sacola', translation: 'Tasche', example: 'Eu preciso de uma sacola.', translatedExample: 'Ich brauche eine Tasche.', order: 9 },
            { word: 'Desconto', translation: 'Rabatt', example: 'Há algum desconto?', translatedExample: 'Gibt es einen Rabatt?', order: 10 },
          ],
        },
        {
          title: 'Clima',
          description: 'Clima e estações do ano',
          order: 4,
          vocabulary: [
            { word: 'Sol', translation: 'Sonne', example: 'O sol brilha forte.', translatedExample: 'Die Sonne scheint hell.', order: 1 },
            { word: 'Chuva', translation: 'Regen', example: 'Está chovendo hoje.', translatedExample: 'Es regnet heute.', order: 2 },
            { word: 'Neve', translation: 'Schnee', example: 'No inverno cai neve.', translatedExample: 'Im Winter fällt Schnee.', order: 3 },
            { word: 'Vento', translation: 'Wind', example: 'O vento está frio.', translatedExample: 'Der Wind ist kalt.', order: 4 },
            { word: 'Nuvem', translation: 'Wolke', example: 'As nuvens estão escuras.', translatedExample: 'Die Wolken sind dunkel.', order: 5 },
            { word: 'Inverno', translation: 'Winter', example: 'No inverno está frio e escuro.', translatedExample: 'Im Winter ist es kalt und dunkel.', order: 6 },
            { word: 'Frio', translation: 'Kalt', example: 'Ontem estava frio.', translatedExample: 'Gestern war es kalt.', order: 7 },
            { word: 'Primavera', translation: 'Frühling', example: 'Na primavera as flores florescem.', translatedExample: 'Im Frühling blühen die Blumen.', order: 8 },
            { word: 'Verão', translation: 'Sommer', example: 'O verão é minha estação favorita.', translatedExample: 'Der Sommer ist meine Lieblingsjahreszeit.', order: 9 },
            { word: 'Outono', translation: 'Herbst', example: 'No outono as folhas caem.', translatedExample: 'Im Herbst fallen die Blätter.', order: 10 },
          ],
        },
        {
          title: 'Transporte',
          description: 'Meios de transporte e locomoção',
          order: 5,
          vocabulary: [
            { word: 'Carro', translation: 'Auto', example: 'Meu carro é novo.', translatedExample: 'Mein Auto ist neu.', order: 1 },
            { word: 'Ônibus', translation: 'Bus', example: 'Eu vou de ônibus.', translatedExample: 'Ich fahre mit dem Bus.', order: 2 },
            { word: 'Trem', translation: 'Zug', example: 'O trem está no horário.', translatedExample: 'Der Zug ist pünktlich.', order: 3 },
            { word: 'Avião', translation: 'Flugzeug', example: 'O avião voa alto.', translatedExample: 'Das Flugzeug fliegt hoch.', order: 4 },
            { word: 'Bicicleta', translation: 'Fahrrad', example: 'Eu gosto de andar de bicicleta.', translatedExample: 'Ich fahre gerne Fahrrad.', order: 5 },
            { word: 'Táxi', translation: 'Taxi', example: 'Nós pegamos um táxi.', translatedExample: 'Wir nehmen ein Taxi.', order: 6 },
            { word: 'Rua', translation: 'Straße', example: 'A rua é larga.', translatedExample: 'Die Straße ist breit.', order: 7 },
            { word: 'Ponto', translation: 'Haltestelle', example: 'O ponto é aqui.', translatedExample: 'Die Haltestelle ist hier.', order: 8 },
            { word: 'Bilhete', translation: 'Ticket', example: 'Eu compro um bilhete.', translatedExample: 'Ich kaufe ein Ticket.', order: 9 },
            { word: 'Estação', translation: 'Bahnhof', example: 'A estação é grande.', translatedExample: 'Der Bahnhof ist groß.', order: 10 },
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
