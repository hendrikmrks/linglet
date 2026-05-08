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

    // Portugiesisch => Deutsch - Kapitel 3: Casa
    const chapter = {
      title: 'Casa',
      description: 'Vocabulário sobre casa e moradia',
      order: 3,
      subchapters: [
        {
          title: 'Cômodos',
          description: 'Diferentes cômodos da casa',
          order: 1,
          vocabulary: [
            { word: 'Quarto', translation: 'Zimmer', example: 'O quarto é grande e claro.', translatedExample: 'Das Zimmer ist groß und hell.', order: 1 },
            { word: 'Cozinha', translation: 'Küche', example: 'A cozinha é muito moderna.', translatedExample: 'Die Küche ist sehr modern.', order: 2 },
            { word: 'Banheiro', translation: 'Badezimmer', example: 'O banheiro está limpo.', translatedExample: 'Das Badezimmer ist sauber.', order: 3 },
            { word: 'Sala de estar', translation: 'Wohnzimmer', example: 'Nós sentamos na sala de estar.', translatedExample: 'Wir sitzen im Wohnzimmer.', order: 4 },
            { word: 'Quarto de dormir', translation: 'Schlafzimmer', example: 'Meu quarto de dormir é aconchegante.', translatedExample: 'Mein Schlafzimmer ist gemütlich.', order: 5 },
            { word: 'Jardim', translation: 'Garten', example: 'O jardim tem muitas flores.', translatedExample: 'Der Garten hat viele Blumen.', order: 6 },
            { word: 'Varanda', translation: 'Balkon', example: 'Na varanda há plantas.', translatedExample: 'Auf dem Balkon stehen Pflanzen.', order: 7 },
            { word: 'Porão', translation: 'Keller', example: 'No porão está fresco.', translatedExample: 'Im Keller ist es kühl.', order: 8 },
            { word: 'Sótão', translation: 'Dachboden', example: 'O sótão está empoeirado.', translatedExample: 'Der Dachboden ist staubig.', order: 9 },
            { word: 'Garagem', translation: 'Garage', example: 'O carro está na garagem.', translatedExample: 'Das Auto steht in der Garage.', order: 10 },
          ],
        },
        {
          title: 'Móveis',
          description: 'Móveis domésticos',
          order: 2,
          vocabulary: [
            { word: 'Mesa', translation: 'Tisch', example: 'A mesa é de madeira.', translatedExample: 'Der Tisch ist aus Holz.', order: 1 },
            { word: 'Cadeira', translation: 'Stuhl', example: 'A cadeira é confortável.', translatedExample: 'Der Stuhl ist bequem.', order: 2 },
            { word: 'Cama', translation: 'Bett', example: 'A cama é macia.', translatedExample: 'Das Bett ist weich.', order: 3 },
            { word: 'Sofá', translation: 'Sofa', example: 'O sofá é muito confortável.', translatedExample: 'Das Sofa ist sehr gemütlich.', order: 4 },
            { word: 'Armário', translation: 'Schrank', example: 'No armário estão minhas roupas.', translatedExample: 'Im Schrank hängen meine Kleider.', order: 5 },
            { word: 'Estante', translation: 'Regal', example: 'A estante está cheia de livros.', translatedExample: 'Das Regal ist voller Bücher.', order: 6 },
            { word: 'Lâmpada', translation: 'Lampe', example: 'A lâmpada brilha forte.', translatedExample: 'Die Lampe leuchtet hell.', order: 7 },
            { word: 'Espelho', translation: 'Spiegel', example: 'O espelho está pendurado na parede.', translatedExample: 'Der Spiegel hängt an der Wand.', order: 8 },
            { word: 'Tapete', translation: 'Teppich', example: 'O tapete é macio e quente.', translatedExample: 'Der Teppich ist weich und warm.', order: 9 },
            { word: 'Cortina', translation: 'Vorhang', example: 'As cortinas estão fechadas.', translatedExample: 'Die Vorhänge sind geschlossen.', order: 10 },
          ],
        },
        {
          title: 'Eletrodomésticos',
          description: 'Aparelhos elétricos domésticos',
          order: 3,
          vocabulary: [
            { word: 'Geladeira', translation: 'Kühlschrank', example: 'A geladeira está cheia.', translatedExample: 'Der Kühlschrank ist voll.', order: 1 },
            { word: 'Fogão', translation: 'Herd', example: 'Eu cozinho no fogão.', translatedExample: 'Ich koche auf dem Herd.', order: 2 },
            { word: 'Forno', translation: 'Backofen', example: 'O bolo está no forno.', translatedExample: 'Der Kuchen ist im Backofen.', order: 3 },
            { word: 'Micro-ondas', translation: 'Mikrowelle', example: 'O micro-ondas aquece a comida.', translatedExample: 'Die Mikrowelle wärmt das Essen.', order: 4 },
            { word: 'Máquina de lavar', translation: 'Waschmaschine', example: 'A máquina de lavar está funcionando.', translatedExample: 'Die Waschmaschine läuft.', order: 5 },
            { word: 'Televisão', translation: 'Fernseher', example: 'A televisão está ligada.', translatedExample: 'Der Fernseher ist eingeschaltet.', order: 6 },
            { word: 'Aspirador', translation: 'Staubsauger', example: 'Eu aspiro com o aspirador.', translatedExample: 'Ich sauge mit dem Staubsauger.', order: 7 },
            { word: 'Ferro de passar', translation: 'Bügeleisen', example: 'O ferro de passar está quente.', translatedExample: 'Das Bügeleisen ist heiß.', order: 8 },
            { word: 'Torradeira', translation: 'Toaster', example: 'A torradeira deixa o pão crocante.', translatedExample: 'Der Toaster macht das Brot knusprig.', order: 9 },
            { word: 'Cafeteira', translation: 'Kaffeemaschine', example: 'A cafeteira faz café.', translatedExample: 'Die Kaffeemaschine brüht Kaffee.', order: 10 },
          ],
        },
        {
          title: 'Louças',
          description: 'Louças e talheres',
          order: 4,
          vocabulary: [
            { word: 'Prato', translation: 'Teller', example: 'O prato está limpo.', translatedExample: 'Der Teller ist sauber.', order: 1 },
            { word: 'Xícara', translation: 'Tasse', example: 'A xícara está cheia de café.', translatedExample: 'Die Tasse ist voller Kaffee.', order: 2 },
            { word: 'Copo', translation: 'Glas', example: 'O copo está vazio.', translatedExample: 'Das Glas ist leer.', order: 3 },
            { word: 'Tigela', translation: 'Schüssel', example: 'A tigela contém salada.', translatedExample: 'Die Schüssel enthält Salat.', order: 4 },
            { word: 'Faca', translation: 'Messer', example: 'A faca está afiada.', translatedExample: 'Das Messer ist scharf.', order: 5 },
            { word: 'Garfo', translation: 'Gabel', example: 'Eu como com o garfo.', translatedExample: 'Ich esse mit der Gabel.', order: 6 },
            { word: 'Colher', translation: 'Löffel', example: 'A colher é de metal.', translatedExample: 'Der Löffel ist aus Metall.', order: 7 },
            { word: 'Frigideira', translation: 'Pfanne', example: 'Eu frito ovos na frigideira.', translatedExample: 'Ich brate Eier in der Pfanne.', order: 8 },
            { word: 'Panela', translation: 'Topf', example: 'A panela ferve no fogão.', translatedExample: 'Der Topf kocht auf dem Herd.', order: 9 },
            { word: 'Talheres', translation: 'Besteck', example: 'Os talheres estão na mesa.', translatedExample: 'Das Besteck liegt auf dem Tisch.', order: 10 },
          ],
        },
        {
          title: 'Tarefas domésticas',
          description: 'Atividades do lar',
          order: 5,
          vocabulary: [
            { word: 'Limpar', translation: 'Putzen', example: 'Eu preciso limpar a casa.', translatedExample: 'Ich muss das Haus putzen.', order: 1 },
            { word: 'Cozinhar', translation: 'Kochen', example: 'Eu gosto de cozinhar.', translatedExample: 'Ich koche gerne.', order: 2 },
            { word: 'Lavar', translation: 'Waschen', example: 'Eu lavo a roupa.', translatedExample: 'Ich wasche die Wäsche.', order: 3 },
            { word: 'Passar roupa', translation: 'Bügeln', example: 'Eu ainda preciso passar roupa.', translatedExample: 'Ich muss noch bügeln.', order: 4 },
            { word: 'Arrumar', translation: 'Aufräumen', example: 'Eu arrumo meu quarto.', translatedExample: 'Ich räume mein Zimmer auf.', order: 5 },
            { word: 'Lavar louça', translation: 'Abwaschen', example: 'Depois de comer eu preciso lavar louça.', translatedExample: 'Nach dem Essen muss ich abwaschen.', order: 6 },
            { word: 'Aspirar', translation: 'Staubsaugen', example: 'Eu aspiro todos os dias.', translatedExample: 'Ich sauge jeden Tag Staub.', order: 7 },
            { word: 'Limpar janelas', translation: 'Fenster putzen', example: 'As janelas estão sujas, eu as limpo.', translatedExample: 'Die Fenster sind schmutzig, ich putze sie.', order: 8 },
            { word: 'Tirar o lixo', translation: 'Müll rausbringen', example: 'Eu tiro o lixo.', translatedExample: 'Ich bringe den Müll raus.', order: 9 },
            { word: 'Regar', translation: 'Gießen', example: 'Eu rego as flores.', translatedExample: 'Ich gieße die Blumen.', order: 10 },
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
