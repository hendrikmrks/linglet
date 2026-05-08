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

    // Deutsch => Portugiesisch - Kapitel 8: Essen gehen & Gesundheit
    const chapter = {
      title: 'Essen gehen & Gesundheit',
      description: 'Restaurant, Lebensmittel und Gesundheit',
      order: 8,
      subchapters: [
        {
          title: 'Im Restaurant',
          description: 'Essen gehen und bestellen',
          order: 1,
          vocabulary: [
            { word: 'Speisekarte', translation: 'cardápio', example: 'Darf ich die Speisekarte sehen?', translatedExample: 'Posso ver o cardápio?', order: 1 },
            { word: 'Vorspeise', translation: 'entrada', example: 'Als Vorspeise nehme ich die Suppe.', translatedExample: 'Como entrada, vou pedir a sopa.', order: 2 },
            { word: 'Hauptgericht', translation: 'prato principal', example: 'Das Hauptgericht ist sehr lecker.', translatedExample: 'O prato principal é muito gostoso.', order: 3 },
            { word: 'Dessert', translation: 'sobremesa', example: 'Zum Dessert nehme ich Eis.', translatedExample: 'De sobremesa vou querer sorvete.', order: 4 },
            { word: 'Rechnung', translation: 'conta', example: 'Kann ich bitte die Rechnung haben?', translatedExample: 'Pode trazer a conta por favor?', order: 5 },
            { word: 'bestellen', translation: 'pedir/encomendar', example: 'Ich möchte bestellen.', translatedExample: 'Eu gostaria de pedir.', order: 6 },
            { word: 'Tisch', translation: 'mesa', example: 'Ich habe einen Tisch reserviert.', translatedExample: 'Eu reservei uma mesa.', order: 7 },
            { word: 'Kellner', translation: 'garçom', example: 'Herr Kellner, bitte!', translatedExample: 'Garçom, por favor!', order: 8 },
            { word: 'Trinkgeld', translation: 'gorjeta', example: 'Wir haben ein gutes Trinkgeld gegeben.', translatedExample: 'Nós demos uma boa gorjeta.', order: 9 },
            { word: 'Reservierung', translation: 'reserva', example: 'Ich habe eine Reservierung auf den Namen Müller.', translatedExample: 'Tenho uma reserva no nome de Müller.', order: 10 },
          ],
        },
        {
          title: 'Lebensmittel & Zutaten',
          description: 'Essen und Kochen',
          order: 2,
          vocabulary: [
            { word: 'Mehl', translation: 'farinha', example: 'Ich brauche Mehl für den Kuchen.', translatedExample: 'Eu preciso de farinha para o bolo.', order: 1 },
            { word: 'Zucker', translation: 'açúcar', example: 'Tust du Zucker in den Kaffee?', translatedExample: 'Você coloca açúcar no café?', order: 2 },
            { word: 'Salz', translation: 'sal', example: 'Das Essen braucht mehr Salz.', translatedExample: 'A comida precisa de mais sal.', order: 3 },
            { word: 'Öl', translation: 'óleo/azeite', example: 'Ich brate das Gemüse in Öl.', translatedExample: 'Eu frito o legume no azeite.', order: 4 },
            { word: 'Butter', translation: 'manteiga', example: 'Ich esse Toast mit Butter.', translatedExample: 'Eu como torrada com manteiga.', order: 5 },
            { word: 'Gewürz', translation: 'tempero/especiaria', example: 'Dieses Gewürz riecht gut.', translatedExample: 'Este tempero cheira bem.', order: 6 },
            { word: 'Knoblauch', translation: 'alho', example: 'Ich mag Essen mit viel Knoblauch.', translatedExample: 'Eu gosto de comida com muito alho.', order: 7 },
            { word: 'Zwiebel', translation: 'cebola', example: 'Die Zwiebel macht mich weinen.', translatedExample: 'A cebola me faz chorar.', order: 8 },
            { word: 'Tomate', translation: 'tomate', example: 'Ich kaufe frische Tomaten.', translatedExample: 'Eu compro tomates frescos.', order: 9 },
            { word: 'Karotte', translation: 'cenoura', example: 'Karotten sind gesund.', translatedExample: 'Cenouras são saudáveis.', order: 10 },
          ],
        },
        {
          title: 'Gesund & Krank',
          description: 'Gesundheit und Krankheit',
          order: 3,
          vocabulary: [
            { word: 'Husten', translation: 'tosse', example: 'Ich habe starken Husten.', translatedExample: 'Eu tenho tosse forte.', order: 1 },
            { word: 'Fieber', translation: 'febre', example: 'Das Kind hat Fieber.', translatedExample: 'A criança está com febre.', order: 2 },
            { word: 'Schmerzen', translation: 'dor', example: 'Ich habe Schmerzen im Rücken.', translatedExample: 'Eu tenho dores nas costas.', order: 3 },
            { word: 'Erkältung', translation: 'resfriado', example: 'Ich habe eine Erkältung.', translatedExample: 'Eu estou resfriado.', order: 4 },
            { word: 'Allergie', translation: 'alergia', example: 'Ich habe eine Allergie gegen Pollen.', translatedExample: 'Eu tenho alergia a pólen.', order: 5 },
            { word: 'krank', translation: 'doente', example: 'Ich fühle mich krank.', translatedExample: 'Eu me sinto doente.', order: 6 },
            { word: 'gesund', translation: 'saudável', example: 'Sport macht gesund.', translatedExample: 'O esporte faz bem à saúde.', order: 7 },
            { word: 'müde', translation: 'cansado', example: 'Ich bin sehr müde.', translatedExample: 'Eu estou muito cansado.', order: 8 },
            { word: 'Kopfschmerzen', translation: 'dor de cabeça', example: 'Ich habe Kopfschmerzen.', translatedExample: 'Eu tenho dor de cabeça.', order: 9 },
            { word: 'Bauchschmerzen', translation: 'dor de barriga', example: 'Das Kind hat Bauchschmerzen.', translatedExample: 'A criança tem dor de barriga.', order: 10 },
          ],
        },
        {
          title: 'Beim Arzt',
          description: 'Der Arztbesuch',
          order: 4,
          vocabulary: [
            { word: 'Termin', translation: 'consulta/agendamento', example: 'Ich habe einen Termin beim Arzt.', translatedExample: 'Eu tenho uma consulta no médico.', order: 1 },
            { word: 'Rezept', translation: 'receita médica', example: 'Der Arzt gibt mir ein Rezept.', translatedExample: 'O médico me dá uma receita.', order: 2 },
            { word: 'Diagnose', translation: 'diagnóstico', example: 'Die Diagnose war überraschend.', translatedExample: 'O diagnóstico foi surpreendente.', order: 3 },
            { word: 'Tablette', translation: 'comprimido', example: 'Ich nehme zwei Tabletten täglich.', translatedExample: 'Eu tomo dois comprimidos por dia.', order: 4 },
            { word: 'Apotheke', translation: 'farmácia', example: 'Ich hole das Medikament in der Apotheke.', translatedExample: 'Eu pego o remédio na farmácia.', order: 5 },
            { word: 'Untersuchung', translation: 'exame/consulta', example: 'Die Untersuchung war kurz.', translatedExample: 'O exame foi rápido.', order: 6 },
            { word: 'Blut', translation: 'sangue', example: 'Der Arzt nimmt Blut ab.', translatedExample: 'O médico coleta sangue.', order: 7 },
            { word: 'Krankenversicherung', translation: 'plano de saúde', example: 'Ich habe eine gute Krankenversicherung.', translatedExample: 'Eu tenho um bom plano de saúde.', order: 8 },
            { word: 'Krankenhaus', translation: 'hospital', example: 'Er liegt im Krankenhaus.', translatedExample: 'Ele está internado no hospital.', order: 9 },
            { word: 'Notaufnahme', translation: 'pronto-socorro', example: 'Wir gehen in die Notaufnahme.', translatedExample: 'Vamos ao pronto-socorro.', order: 10 },
          ],
        },
        {
          title: 'Sport & Wellness',
          description: 'Gesundheit und Wohlbefinden',
          order: 5,
          vocabulary: [
            { word: 'Diät', translation: 'dieta', example: 'Ich mache gerade eine Diät.', translatedExample: 'Eu estou fazendo dieta.', order: 1 },
            { word: 'Vitamin', translation: 'vitamina', example: 'Ich nehme täglich Vitamine.', translatedExample: 'Eu tomo vitaminas diariamente.', order: 2 },
            { word: 'Schlaf', translation: 'sono', example: 'Guter Schlaf ist wichtig.', translatedExample: 'Um bom sono é importante.', order: 3 },
            { word: 'Stress', translation: 'estresse', example: 'Ich habe viel Stress auf der Arbeit.', translatedExample: 'Eu tenho muito estresse no trabalho.', order: 4 },
            { word: 'entspannen', translation: 'relaxar', example: 'Am Wochenende entspanne ich mich.', translatedExample: 'No fim de semana eu relaxo.', order: 5 },
            { word: 'Massage', translation: 'massagem', example: 'Eine Massage hilft bei Rückenschmerzen.', translatedExample: 'Uma massagem ajuda nas dores nas costas.', order: 6 },
            { word: 'Meditation', translation: 'meditação', example: 'Ich mache jeden Morgen Meditation.', translatedExample: 'Eu faço meditação toda manhã.', order: 7 },
            { word: 'Ernährung', translation: 'alimentação/nutrição', example: 'Eine gute Ernährung ist wichtig.', translatedExample: 'Uma boa alimentação é importante.', order: 8 },
            { word: 'Bewegung', translation: 'exercício/movimento', example: 'Regelmäßige Bewegung ist gesund.', translatedExample: 'Exercício regular faz bem à saúde.', order: 9 },
            { word: 'Gewicht', translation: 'peso', example: 'Ich möchte mein Gewicht halten.', translatedExample: 'Eu quero manter meu peso.', order: 10 },
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
