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

    // Portugiesisch => Deutsch - Capítulo 13: Meio Ambiente & Sustentabilidade
    const chapter = {
      title: 'Meio Ambiente & Sustentabilidade',
      description: 'Meio ambiente, animais e sustentabilidade',
      order: 13,
      subchapters: [
        {
          title: 'Problemas Ambientais',
          description: 'Problemas e desafios ambientais',
          order: 1,
          vocabulary: [
            { word: 'mudança climática', translation: 'Klimawandel', example: 'A mudança climática é uma ameaça global.', translatedExample: 'Der Klimawandel ist eine globale Bedrohung.', order: 1 },
            { word: 'aquecimento global', translation: 'Erderwärmung', example: 'O aquecimento global aumenta os desastres.', translatedExample: 'Die Erderwärmung verstärkt Katastrophen.', order: 2 },
            { word: 'poluição', translation: 'Verschmutzung', example: 'A poluição do ar é perigosa.', translatedExample: 'Die Luftverschmutzung ist gefährlich.', order: 3 },
            { word: 'emissões de CO2', translation: 'CO2-Ausstoß', example: 'Precisamos reduzir as emissões de CO2.', translatedExample: 'Wir müssen den CO2-Ausstoß reduzieren.', order: 4 },
            { word: 'desmatamento', translation: 'Abholzung', example: 'O desmatamento destrói habitats.', translatedExample: 'Die Abholzung zerstört Lebensräume.', order: 5 },
            { word: 'seca', translation: 'Dürre', example: 'A seca afeta as colheitas.', translatedExample: 'Die Dürre schadet der Ernte.', order: 6 },
            { word: 'enchente/inundação', translation: 'Überschwemmung', example: 'As inundações destruíram muitas casas.', translatedExample: 'Die Überschwemmungen zerstörten viele Häuser.', order: 7 },
            { word: 'buraco na camada de ozônio', translation: 'Ozonloch', example: 'O buraco na camada de ozônio ainda existe.', translatedExample: 'Das Ozonloch existiert noch immer.', order: 8 },
            { word: 'espécie em extinção', translation: 'bedrohte Tierart', example: 'O panda-gigante é uma espécie em extinção.', translatedExample: 'Der Riesenpanda ist eine bedrohte Tierart.', order: 9 },
            { word: 'lixo/resíduos', translation: 'Müll/Abfall', example: 'O lixo plástico polui os oceanos.', translatedExample: 'Plastikmüll verschmutzt die Ozeane.', order: 10 },
          ],
        },
        {
          title: 'Animais & Natureza',
          description: 'Animais e elementos da natureza',
          order: 2,
          vocabulary: [
            { word: 'mamífero', translation: 'Säugetier', example: 'Baleias são mamíferos.', translatedExample: 'Wale sind Säugetiere.', order: 1 },
            { word: 'réptil', translation: 'Reptil', example: 'Cobras são répteis.', translatedExample: 'Schlangen sind Reptilien.', order: 2 },
            { word: 'ave/pássaro', translation: 'Vogel', example: 'As aves migram no inverno.', translatedExample: 'Vögel wandern im Winter.', order: 3 },
            { word: 'inseto', translation: 'Insekt', example: 'As abelhas são insetos importantes.', translatedExample: 'Bienen sind wichtige Insekten.', order: 4 },
            { word: 'selva/floresta tropical', translation: 'Regenwald', example: 'A selva amazônica é enorme.', translatedExample: 'Der Amazonas-Regenwald ist riesig.', order: 5 },
            { word: 'savana', translation: 'Savanne', example: 'Leões vivem na savana.', translatedExample: 'Löwen leben in der Savanne.', order: 6 },
            { word: 'oceano', translation: 'Ozean', example: 'O oceano cobre grande parte da Terra.', translatedExample: 'Der Ozean bedeckt einen Großteil der Erde.', order: 7 },
            { word: 'recife de coral', translation: 'Korallenriff', example: 'O recife de coral está em perigo.', translatedExample: 'Das Korallenriff ist in Gefahr.', order: 8 },
            { word: 'glaciar', translation: 'Gletscher', example: 'Os glaciares estão derretendo.', translatedExample: 'Die Gletscher schmelzen.', order: 9 },
            { word: 'espécie/raça', translation: 'Art/Rasse', example: 'Existem muitas espécies de borboletas.', translatedExample: 'Es gibt viele Schmetterlingsarten.', order: 10 },
          ],
        },
        {
          title: 'Energia & Recursos',
          description: 'Energia e recursos naturais',
          order: 3,
          vocabulary: [
            { word: 'energia solar', translation: 'Solarenergie', example: 'A energia solar é limpa.', translatedExample: 'Solarenergie ist sauber.', order: 1 },
            { word: 'energia eólica', translation: 'Windenergie', example: 'A energia eólica cresce muito.', translatedExample: 'Windenergie wächst stark.', order: 2 },
            { word: 'combustível fóssil', translation: 'fossiler Brennstoff', example: 'Os combustíveis fósseis poluem muito.', translatedExample: 'Fossile Brennstoffe verschmutzen stark.', order: 3 },
            { word: 'energia nuclear', translation: 'Kernenergie', example: 'A energia nuclear é controversa.', translatedExample: 'Kernenergie ist umstritten.', order: 4 },
            { word: 'petróleo', translation: 'Erdöl', example: 'O preço do petróleo subiu.', translatedExample: 'Der Erdölpreis ist gestiegen.', order: 5 },
            { word: 'gás natural', translation: 'Erdgas', example: 'O gás natural é mais limpo que o carvão.', translatedExample: 'Erdgas ist sauberer als Kohle.', order: 6 },
            { word: 'carvão', translation: 'Kohle', example: 'O carvão é um recurso limitado.', translatedExample: 'Kohle ist eine begrenzte Ressource.', order: 7 },
            { word: 'eficiência energética', translation: 'Energieeffizienz', example: 'A eficiência energética é importante.', translatedExample: 'Energieeffizienz ist wichtig.', order: 8 },
            { word: 'água potável', translation: 'Trinkwasser', example: 'A água potável é escassa.', translatedExample: 'Trinkwasser ist knapp.', order: 9 },
            { word: 'recursos naturais', translation: 'natürliche Ressourcen', example: 'Os recursos naturais são limitados.', translatedExample: 'Natürliche Ressourcen sind begrenzt.', order: 10 },
          ],
        },
        {
          title: 'Sustentabilidade',
          description: 'Práticas sustentáveis',
          order: 4,
          vocabulary: [
            { word: 'reciclagem', translation: 'Recycling', example: 'A reciclagem protege o meio ambiente.', translatedExample: 'Recycling schützt die Umwelt.', order: 1 },
            { word: 'separar o lixo', translation: 'Müll trennen', example: 'Eu separo o lixo diariamente.', translatedExample: 'Ich trenne täglich den Müll.', order: 2 },
            { word: 'consumo consciente', translation: 'bewusster Konsum', example: 'O consumo consciente é essencial.', translatedExample: 'Bewusster Konsum ist wichtig.', order: 3 },
            { word: 'pegada de carbono', translation: 'CO2-Fußabdruck', example: 'Quero reduzir minha pegada de carbono.', translatedExample: 'Ich möchte meinen CO2-Fußabdruck reduzieren.', order: 4 },
            { word: 'produtos orgânicos', translation: 'Bio-Produkte', example: 'Eu compro produtos orgânicos sempre que possível.', translatedExample: 'Ich kaufe Bio-Produkte wann immer möglich.', order: 5 },
            { word: 'vegetariano', translation: 'vegetarisch', example: 'Eu como vegetariano às segundas-feiras.', translatedExample: 'Ich esse montags vegetarisch.', order: 6 },
            { word: 'reutilizar', translation: 'wiederverwenden', example: 'Eu reutilizo sacolas plásticas.', translatedExample: 'Ich verwende Plastiktüten wieder.', order: 7 },
            { word: 'composto', translation: 'Kompost', example: 'Eu faço composto dos restos de comida.', translatedExample: 'Ich mache Kompost aus Essensresten.', order: 8 },
            { word: 'desenvolvimento sustentável', translation: 'nachhaltige Entwicklung', example: 'O desenvolvimento sustentável é a meta.', translatedExample: 'Nachhaltige Entwicklung ist das Ziel.', order: 9 },
            { word: 'proteção do clima', translation: 'Klimaschutz', example: 'A proteção do clima exige ação imediata.', translatedExample: 'Klimaschutz erfordert sofortiges Handeln.', order: 10 },
          ],
        },
        {
          title: 'Experiências na Natureza',
          description: 'Atividades ao ar livre e na natureza',
          order: 5,
          vocabulary: [
            { word: 'caminhada/trilha', translation: 'Wanderung', example: 'Fazemos uma caminhada na montanha.', translatedExample: 'Wir machen eine Wanderung in den Bergen.', order: 1 },
            { word: 'parque nacional', translation: 'Nationalpark', example: 'O parque nacional é protegido.', translatedExample: 'Der Nationalpark ist geschützt.', order: 2 },
            { word: 'observação de pássaros', translation: 'Vogelbeobachtung', example: 'Eu adoro observação de pássaros.', translatedExample: 'Ich liebe Vogelbeobachtung.', order: 3 },
            { word: 'acampamento/camping', translation: 'Camping', example: 'Nós fazemos camping todo verão.', translatedExample: 'Wir machen jeden Sommer Camping.', order: 4 },
            { word: 'canoagem', translation: 'Kanufahren', example: 'Eu pratico canoagem no rio.', translatedExample: 'Ich fahre auf dem Fluss Kanu.', order: 5 },
            { word: 'escalada', translation: 'Klettern', example: 'Escalada exige muita força.', translatedExample: 'Klettern erfordert viel Kraft.', order: 6 },
            { word: 'mergulho', translation: 'Tauchen', example: 'Eu mergulho no recife de coral.', translatedExample: 'Ich tauche am Korallenriff.', order: 7 },
            { word: 'fotografia da natureza', translation: 'Naturfotografie', example: 'A fotografia da natureza é minha paixão.', translatedExample: 'Naturfotografie ist meine Leidenschaft.', order: 8 },
            { word: 'reflorestamento', translation: 'Aufforstung', example: 'O projeto de reflorestamento planta árvores.', translatedExample: 'Das Aufforstungsprojekt pflanzt Bäume.', order: 9 },
            { word: 'reserva natural', translation: 'Naturschutzgebiet', example: 'Visito uma reserva natural no fim de semana.', translatedExample: 'Ich besuche am Wochenende ein Naturschutzgebiet.', order: 10 },
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
