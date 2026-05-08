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

    // Deutsch => Portugiesisch - Kapitel 3: Zu Hause
    const chapter = {
      title: 'Zu Hause',
      description: 'Wortschatz rund um Haus und Wohnung',
      order: 3,
      subchapters: [
        {
          title: 'Räume',
          description: 'Verschiedene Räume im Haus',
          order: 1,
          vocabulary: [
            { word: 'Zimmer', translation: 'Quarto', example: 'Das Zimmer ist groß und hell.', translatedExample: 'O quarto é grande e claro.', order: 1 },
            { word: 'Küche', translation: 'Cozinha', example: 'Die Küche ist sehr modern.', translatedExample: 'A cozinha é muito moderna.', order: 2 },
            { word: 'Badezimmer', translation: 'Banheiro', example: 'Das Badezimmer ist sauber.', translatedExample: 'O banheiro está limpo.', order: 3 },
            { word: 'Wohnzimmer', translation: 'Sala de estar', example: 'Wir sitzen im Wohnzimmer.', translatedExample: 'Nós sentamos na sala de estar.', order: 4 },
            { word: 'Schlafzimmer', translation: 'Quarto de dormir', example: 'Mein Schlafzimmer ist gemütlich.', translatedExample: 'Meu quarto de dormir é aconchegante.', order: 5 },
            { word: 'Garten', translation: 'Jardim', example: 'Der Garten hat viele Blumen.', translatedExample: 'O jardim tem muitas flores.', order: 6 },
            { word: 'Balkon', translation: 'Varanda', example: 'Auf dem Balkon stehen Pflanzen.', translatedExample: 'Na varanda há plantas.', order: 7 },
            { word: 'Keller', translation: 'Porão', example: 'Im Keller ist es kühl.', translatedExample: 'No porão está fresco.', order: 8 },
            { word: 'Dachboden', translation: 'Sótão', example: 'Der Dachboden ist staubig.', translatedExample: 'O sótão está empoeirado.', order: 9 },
            { word: 'Garage', translation: 'Garagem', example: 'Das Auto steht in der Garage.', translatedExample: 'O carro está na garagem.', order: 10 },
          ],
        },
        {
          title: 'Möbel',
          description: 'Möbelstücke im Haushalt',
          order: 2,
          vocabulary: [
            { word: 'Tisch', translation: 'Mesa', example: 'Der Tisch ist aus Holz.', translatedExample: 'A mesa é de madeira.', order: 1 },
            { word: 'Stuhl', translation: 'Cadeira', example: 'Der Stuhl ist bequem.', translatedExample: 'A cadeira é confortável.', order: 2 },
            { word: 'Bett', translation: 'Cama', example: 'Das Bett ist weich.', translatedExample: 'A cama é macia.', order: 3 },
            { word: 'Sofa', translation: 'Sofá', example: 'Das Sofa ist sehr gemütlich.', translatedExample: 'O sofá é muito confortável.', order: 4 },
            { word: 'Schrank', translation: 'Armário', example: 'Im Schrank hängen meine Kleider.', translatedExample: 'No armário estão minhas roupas.', order: 5 },
            { word: 'Regal', translation: 'Estante', example: 'Das Regal ist voller Bücher.', translatedExample: 'A estante está cheia de livros.', order: 6 },
            { word: 'Lampe', translation: 'Lâmpada', example: 'Die Lampe leuchtet hell.', translatedExample: 'A lâmpada brilha forte.', order: 7 },
            { word: 'Spiegel', translation: 'Espelho', example: 'Der Spiegel hängt an der Wand.', translatedExample: 'O espelho está pendurado na parede.', order: 8 },
            { word: 'Teppich', translation: 'Tapete', example: 'Der Teppich ist weich und warm.', translatedExample: 'O tapete é macio e quente.', order: 9 },
            { word: 'Vorhang', translation: 'Cortina', example: 'Die Vorhänge sind geschlossen.', translatedExample: 'As cortinas estão fechadas.', order: 10 },
          ],
        },
        {
          title: 'Haushaltsgeräte',
          description: 'Elektrische Geräte im Haushalt',
          order: 3,
          vocabulary: [
            { word: 'Kühlschrank', translation: 'Geladeira', example: 'Der Kühlschrank ist voll.', translatedExample: 'A geladeira está cheia.', order: 1 },
            { word: 'Herd', translation: 'Fogão', example: 'Ich koche auf dem Herd.', translatedExample: 'Eu cozinho no fogão.', order: 2 },
            { word: 'Backofen', translation: 'Forno', example: 'Der Kuchen ist im Backofen.', translatedExample: 'O bolo está no forno.', order: 3 },
            { word: 'Mikrowelle', translation: 'Micro-ondas', example: 'Die Mikrowelle wärmt das Essen.', translatedExample: 'O micro-ondas aquece a comida.', order: 4 },
            { word: 'Waschmaschine', translation: 'Máquina de lavar', example: 'Die Waschmaschine läuft.', translatedExample: 'A máquina de lavar está funcionando.', order: 5 },
            { word: 'Fernseher', translation: 'Televisão', example: 'Der Fernseher ist eingeschaltet.', translatedExample: 'A televisão está ligada.', order: 6 },
            { word: 'Staubsauger', translation: 'Aspirador', example: 'Ich sauge mit dem Staubsauger.', translatedExample: 'Eu aspiro com o aspirador.', order: 7 },
            { word: 'Bügeleisen', translation: 'Ferro de passar', example: 'Das Bügeleisen ist heiß.', translatedExample: 'O ferro de passar está quente.', order: 8 },
            { word: 'Toaster', translation: 'Torradeira', example: 'Der Toaster macht das Brot knusprig.', translatedExample: 'A torradeira deixa o pão crocante.', order: 9 },
            { word: 'Kaffeemaschine', translation: 'Cafeteira', example: 'Die Kaffeemaschine brüht Kaffee.', translatedExample: 'A cafeteira faz café.', order: 10 },
          ],
        },
        {
          title: 'Geschirr',
          description: 'Geschirr und Besteck',
          order: 4,
          vocabulary: [
            { word: 'Teller', translation: 'Prato', example: 'Der Teller ist sauber.', translatedExample: 'O prato está limpo.', order: 1 },
            { word: 'Tasse', translation: 'Xícara', example: 'Die Tasse ist voller Kaffee.', translatedExample: 'A xícara está cheia de café.', order: 2 },
            { word: 'Glas', translation: 'Copo', example: 'Das Glas ist leer.', translatedExample: 'O copo está vazio.', order: 3 },
            { word: 'Schüssel', translation: 'Tigela', example: 'Die Schüssel enthält Salat.', translatedExample: 'A tigela contém salada.', order: 4 },
            { word: 'Messer', translation: 'Faca', example: 'Das Messer ist scharf.', translatedExample: 'A faca está afiada.', order: 5 },
            { word: 'Gabel', translation: 'Garfo', example: 'Ich esse mit der Gabel.', translatedExample: 'Eu como com o garfo.', order: 6 },
            { word: 'Löffel', translation: 'Colher', example: 'Der Löffel ist aus Metall.', translatedExample: 'A colher é de metal.', order: 7 },
            { word: 'Pfanne', translation: 'Frigideira', example: 'Ich brate Eier in der Pfanne.', translatedExample: 'Eu frito ovos na frigideira.', order: 8 },
            { word: 'Topf', translation: 'Panela', example: 'Der Topf kocht auf dem Herd.', translatedExample: 'A panela ferve no fogão.', order: 9 },
            { word: 'Besteck', translation: 'Talheres', example: 'Das Besteck liegt auf dem Tisch.', translatedExample: 'Os talheres estão na mesa.', order: 10 },
          ],
        },
        {
          title: 'Hausarbeit',
          description: 'Tätigkeiten im Haushalt',
          order: 5,
          vocabulary: [
            { word: 'Putzen', translation: 'Limpar', example: 'Ich muss das Haus putzen.', translatedExample: 'Eu preciso limpar a casa.', order: 1 },
            { word: 'Kochen', translation: 'Cozinhar', example: 'Ich koche gerne.', translatedExample: 'Eu gosto de cozinhar.', order: 2 },
            { word: 'Waschen', translation: 'Lavar', example: 'Ich wasche die Wäsche.', translatedExample: 'Eu lavo a roupa.', order: 3 },
            { word: 'Bügeln', translation: 'Passar roupa', example: 'Ich muss noch bügeln.', translatedExample: 'Eu ainda preciso passar roupa.', order: 4 },
            { word: 'Aufräumen', translation: 'Arrumar', example: 'Ich räume mein Zimmer auf.', translatedExample: 'Eu arrumo meu quarto.', order: 5 },
            { word: 'Abwaschen', translation: 'Lavar louça', example: 'Nach dem Essen muss ich abwaschen.', translatedExample: 'Depois de comer eu preciso lavar louça.', order: 6 },
            { word: 'Staubsaugen', translation: 'Aspirar', example: 'Ich sauge jeden Tag Staub.', translatedExample: 'Eu aspiro todos os dias.', order: 7 },
            { word: 'Fenster putzen', translation: 'Limpar janelas', example: 'Die Fenster sind schmutzig, ich putze sie.', translatedExample: 'As janelas estão sujas, eu as limpo.', order: 8 },
            { word: 'Müll rausbringen', translation: 'Tirar o lixo', example: 'Ich bringe den Müll raus.', translatedExample: 'Eu tiro o lixo.', order: 9 },
            { word: 'Gießen', translation: 'Regar', example: 'Ich gieße die Blumen.', translatedExample: 'Eu rego as flores.', order: 10 },
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
