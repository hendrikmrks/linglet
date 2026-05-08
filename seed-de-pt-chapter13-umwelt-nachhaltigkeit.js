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

    // Deutsch => Portugiesisch - Kapitel 13: Umwelt & Nachhaltigkeit
    const chapter = {
      title: 'Umwelt & Nachhaltigkeit',
      description: 'Umwelt, Tiere und Nachhaltigkeit',
      order: 13,
      subchapters: [
        {
          title: 'Umweltprobleme',
          description: 'Ökologische Herausforderungen',
          order: 1,
          vocabulary: [
            { word: 'Klimawandel', translation: 'mudança climática', example: 'Der Klimawandel ist ein globales Problem.', translatedExample: 'A mudança climática é um problema global.', order: 1 },
            { word: 'Luftverschmutzung', translation: 'poluição do ar', example: 'Luftverschmutzung ist gefährlich für die Gesundheit.', translatedExample: 'A poluição do ar é perigosa para a saúde.', order: 2 },
            { word: 'Abfall', translation: 'lixo/resíduo', example: 'Wir müssen weniger Abfall produzieren.', translatedExample: 'Precisamos produzir menos lixo.', order: 3 },
            { word: 'Dürre', translation: 'seca', example: 'Die Dürre zerstört die Ernte.', translatedExample: 'A seca destrói a colheita.', order: 4 },
            { word: 'Überschwemmung', translation: 'inundação/enchente', example: 'Die Überschwemmung hat viel zerstört.', translatedExample: 'A enchente destruiu muito.', order: 5 },
            { word: 'Erderwärmung', translation: 'aquecimento global', example: 'Die Erderwärmung steigt weiter.', translatedExample: 'O aquecimento global continua aumentando.', order: 6 },
            { word: 'Artensterben', translation: 'extinção de espécies', example: 'Das Artensterben ist alarmierend.', translatedExample: 'A extinção de espécies é alarmante.', order: 7 },
            { word: 'Abholzung', translation: 'desmatamento', example: 'Die Abholzung des Regenwaldes muss gestoppt werden.', translatedExample: 'O desmatamento da floresta deve ser interrompido.', order: 8 },
            { word: 'Plastikmüll', translation: 'lixo plástico', example: 'Plastikmüll verschmutzt die Ozeane.', translatedExample: 'O lixo plástico polui os oceanos.', order: 9 },
            { word: 'Lärm', translation: 'barulho/poluição sonora', example: 'Lärm ist eine Form der Umweltverschmutzung.', translatedExample: 'O barulho é uma forma de poluição.', order: 10 },
          ],
        },
        {
          title: 'Tiere & Natur',
          description: 'Tiere und die Natur',
          order: 2,
          vocabulary: [
            { word: 'Hund', translation: 'cachorro', example: 'Der Hund ist der beste Freund des Menschen.', translatedExample: 'O cachorro é o melhor amigo do homem.', order: 1 },
            { word: 'Katze', translation: 'gato', example: 'Unsere Katze schläft viel.', translatedExample: 'Nossa gata dorme muito.', order: 2 },
            { word: 'Vogel', translation: 'pássaro', example: 'Der Vogel singt am Morgen.', translatedExample: 'O pássaro canta de manhã.', order: 3 },
            { word: 'Pferd', translation: 'cavalo', example: 'Er reitet gerne auf dem Pferd.', translatedExample: 'Ele gosta de andar a cavalo.', order: 4 },
            { word: 'Kuh', translation: 'vaca', example: 'Die Kuh gibt Milch.', translatedExample: 'A vaca dá leite.', order: 5 },
            { word: 'Löwe', translation: 'leão', example: 'Der Löwe ist der König der Tiere.', translatedExample: 'O leão é o rei dos animais.', order: 6 },
            { word: 'Elefant', translation: 'elefante', example: 'Elefanten haben ein gutes Gedächtnis.', translatedExample: 'Os elefantes têm boa memória.', order: 7 },
            { word: 'Delfin', translation: 'golfinho', example: 'Delfine sind sehr intelligent.', translatedExample: 'Os golfinhos são muito inteligentes.', order: 8 },
            { word: 'Schmetterling', translation: 'borboleta', example: 'Der Schmetterling ist sehr bunt.', translatedExample: 'A borboleta é muito colorida.', order: 9 },
            { word: 'Biene', translation: 'abelha', example: 'Bienen sind wichtig für die Umwelt.', translatedExample: 'As abelhas são importantes para o meio ambiente.', order: 10 },
          ],
        },
        {
          title: 'Energie & Ressourcen',
          description: 'Energie und natürliche Ressourcen',
          order: 3,
          vocabulary: [
            { word: 'Strom', translation: 'eletricidade/energia elétrica', example: 'Der Strom kommt aus erneuerbaren Quellen.', translatedExample: 'A eletricidade vem de fontes renováveis.', order: 1 },
            { word: 'Solar', translation: 'solar', example: 'Wir haben Solarmodule auf dem Dach.', translatedExample: 'Temos painéis solares no telhado.', order: 2 },
            { word: 'Wind', translation: 'vento', example: 'Wind erzeugt saubere Energie.', translatedExample: 'O vento gera energia limpa.', order: 3 },
            { word: 'Öl', translation: 'petróleo', example: 'Öl ist eine endliche Ressource.', translatedExample: 'O petróleo é um recurso finito.', order: 4 },
            { word: 'Gas', translation: 'gás', example: 'Gas wird zum Heizen genutzt.', translatedExample: 'O gás é usado para aquecimento.', order: 5 },
            { word: 'Kohle', translation: 'carvão', example: 'Kohle ist sehr umweltschädlich.', translatedExample: 'O carvão é muito prejudicial ao meio ambiente.', order: 6 },
            { word: 'erneuerbar', translation: 'renovável', example: 'Wir brauchen mehr erneuerbare Energien.', translatedExample: 'Precisamos de mais energias renováveis.', order: 7 },
            { word: 'Kraftwerk', translation: 'usina/central elétrica', example: 'Das Kraftwerk liefert Strom für die Stadt.', translatedExample: 'A usina fornece eletricidade para a cidade.', order: 8 },
            { word: 'Verbrauch', translation: 'consumo', example: 'Wir müssen unseren Energieverbrauch reduzieren.', translatedExample: 'Precisamos reduzir nosso consumo de energia.', order: 9 },
            { word: 'Ressource', translation: 'recurso', example: 'Natürliche Ressourcen sind begrenzt.', translatedExample: 'Os recursos naturais são limitados.', order: 10 },
          ],
        },
        {
          title: 'Nachhaltigkeit',
          description: 'Nachhaltiges Leben und Handeln',
          order: 4,
          vocabulary: [
            { word: 'recyceln', translation: 'reciclar', example: 'Wir sollten mehr recyceln.', translatedExample: 'Deveríamos reciclar mais.', order: 1 },
            { word: 'kompostieren', translation: 'compostar/fazer compostagem', example: 'Ich kompostiere meinen Küchenabfall.', translatedExample: 'Eu composto meu lixo de cozinha.', order: 2 },
            { word: 'Fahrrad', translation: 'bicicleta', example: 'Ich fahre mit dem Fahrrad zur Arbeit.', translatedExample: 'Eu vou de bicicleta ao trabalho.', order: 3 },
            { word: 'Bioprodukt', translation: 'produto orgânico', example: 'Ich kaufe lieber Bioprodukte.', translatedExample: 'Prefiro comprar produtos orgânicos.', order: 4 },
            { word: 'vegan', translation: 'vegano', example: 'Ich lebe vegan.', translatedExample: 'Eu sou vegano.', order: 5 },
            { word: 'Fußabdruck', translation: 'pegada (ecológica/carbono)', example: 'Ich möchte meinen CO₂-Fußabdruck reduzieren.', translatedExample: 'Quero reduzir minha pegada de carbono.', order: 6 },
            { word: 'nachhaltig', translation: 'sustentável', example: 'Nachhaltiges Leben ist möglich.', translatedExample: 'Viver de forma sustentável é possível.', order: 7 },
            { word: 'umweltfreundlich', translation: 'ecologicamente correto', example: 'Wähle umweltfreundliche Produkte.', translatedExample: 'Escolha produtos ecologicamente corretos.', order: 8 },
            { word: 'sparen', translation: 'poupar/economizar', example: 'Ich spare Wasser und Strom.', translatedExample: 'Eu economizo água e energia.', order: 9 },
            { word: 'Müllvermeidung', translation: 'redução de lixo', example: 'Müllvermeidung beginnt beim Einkauf.', translatedExample: 'A redução de lixo começa na hora das compras.', order: 10 },
          ],
        },
        {
          title: 'Natur erleben',
          description: 'Erfahrungen in der Natur',
          order: 5,
          vocabulary: [
            { word: 'Wanderweg', translation: 'trilha', example: 'Dieser Wanderweg ist sehr schön.', translatedExample: 'Esta trilha é muito bonita.', order: 1 },
            { word: 'Aussichtspunkt', translation: 'mirante', example: 'Vom Aussichtspunkt hat man eine tolle Sicht.', translatedExample: 'Do mirante a vista é incrível.', order: 2 },
            { word: 'Wildnis', translation: 'natureza selvagem', example: 'Wir wandern durch die Wildnis.', translatedExample: 'Caminhamos pela natureza selvagem.', order: 3 },
            { word: 'Nationalpark', translation: 'parque nacional', example: 'Der Nationalpark ist unter Schutz.', translatedExample: 'O parque nacional está protegido.', order: 4 },
            { word: 'Campingplatz', translation: 'camping/área de acampamento', example: 'Wir zelten auf einem Campingplatz.', translatedExample: 'Acampamos em um camping.', order: 5 },
            { word: 'Zelt', translation: 'barraca de camping', example: 'Ich schlafe im Zelt.', translatedExample: 'Eu durmo na barraca de camping.', order: 6 },
            { word: 'Schlafsack', translation: 'saco de dormir', example: 'Mein Schlafsack ist warm.', translatedExample: 'Meu saco de dormir é quente.', order: 7 },
            { word: 'Kompass', translation: 'bússola', example: 'Wir brauchen einen Kompass.', translatedExample: 'Precisamos de uma bússola.', order: 8 },
            { word: 'Fernglas', translation: 'binóculo', example: 'Mit dem Fernglas sehe ich weit.', translatedExample: 'Com o binóculo eu enxergo longe.', order: 9 },
            { word: 'Lagerfeuer', translation: 'fogueira', example: 'Wir sitzen am Lagerfeuer.', translatedExample: 'Sentamos ao redor da fogueira.', order: 10 },
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
