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

    // Portugiesisch => Deutsch - Capítulo 8: Restaurante & Saúde
    const chapter = {
      title: 'Restaurante & Saúde',
      description: 'Restaurante, alimentos e saúde',
      order: 8,
      subchapters: [
        {
          title: 'No Restaurante',
          description: 'Comer fora e fazer pedidos',
          order: 1,
          vocabulary: [
            { word: 'cardápio', translation: 'Speisekarte', example: 'Posso ver o cardápio?', translatedExample: 'Darf ich die Speisekarte sehen?', order: 1 },
            { word: 'entrada', translation: 'Vorspeise', example: 'Como entrada, vou pedir a sopa.', translatedExample: 'Als Vorspeise nehme ich die Suppe.', order: 2 },
            { word: 'prato principal', translation: 'Hauptgericht', example: 'O prato principal é muito gostoso.', translatedExample: 'Das Hauptgericht ist sehr lecker.', order: 3 },
            { word: 'sobremesa', translation: 'Dessert', example: 'De sobremesa vou querer sorvete.', translatedExample: 'Zum Dessert nehme ich Eis.', order: 4 },
            { word: 'conta', translation: 'Rechnung', example: 'Pode trazer a conta por favor?', translatedExample: 'Kann ich bitte die Rechnung haben?', order: 5 },
            { word: 'pedir/encomendar', translation: 'bestellen', example: 'Eu gostaria de pedir.', translatedExample: 'Ich möchte bestellen.', order: 6 },
            { word: 'mesa', translation: 'Tisch', example: 'Eu reservei uma mesa.', translatedExample: 'Ich habe einen Tisch reserviert.', order: 7 },
            { word: 'garçom', translation: 'Kellner', example: 'Garçom, por favor!', translatedExample: 'Herr Kellner, bitte!', order: 8 },
            { word: 'gorjeta', translation: 'Trinkgeld', example: 'Nós demos uma boa gorjeta.', translatedExample: 'Wir haben ein gutes Trinkgeld gegeben.', order: 9 },
            { word: 'reserva', translation: 'Reservierung', example: 'Tenho uma reserva no nome de Müller.', translatedExample: 'Ich habe eine Reservierung auf den Namen Müller.', order: 10 },
          ],
        },
        {
          title: 'Alimentos & Ingredientes',
          description: 'Comida e culinária',
          order: 2,
          vocabulary: [
            { word: 'farinha', translation: 'Mehl', example: 'Eu preciso de farinha para o bolo.', translatedExample: 'Ich brauche Mehl für den Kuchen.', order: 1 },
            { word: 'açúcar', translation: 'Zucker', example: 'Você coloca açúcar no café?', translatedExample: 'Tust du Zucker in den Kaffee?', order: 2 },
            { word: 'sal', translation: 'Salz', example: 'A comida precisa de mais sal.', translatedExample: 'Das Essen braucht mehr Salz.', order: 3 },
            { word: 'óleo/azeite', translation: 'Öl', example: 'Eu frito o legume no azeite.', translatedExample: 'Ich brate das Gemüse in Öl.', order: 4 },
            { word: 'manteiga', translation: 'Butter', example: 'Eu como torrada com manteiga.', translatedExample: 'Ich esse Toast mit Butter.', order: 5 },
            { word: 'tempero/especiaria', translation: 'Gewürz', example: 'Este tempero cheira bem.', translatedExample: 'Dieses Gewürz riecht gut.', order: 6 },
            { word: 'alho', translation: 'Knoblauch', example: 'Eu gosto de comida com muito alho.', translatedExample: 'Ich mag Essen mit viel Knoblauch.', order: 7 },
            { word: 'cebola', translation: 'Zwiebel', example: 'A cebola me faz chorar.', translatedExample: 'Die Zwiebel macht mich weinen.', order: 8 },
            { word: 'tomate', translation: 'Tomate', example: 'Eu compro tomates frescos.', translatedExample: 'Ich kaufe frische Tomaten.', order: 9 },
            { word: 'cenoura', translation: 'Karotte', example: 'Cenouras são saudáveis.', translatedExample: 'Karotten sind gesund.', order: 10 },
          ],
        },
        {
          title: 'Saudável & Doente',
          description: 'Saúde e doença',
          order: 3,
          vocabulary: [
            { word: 'tosse', translation: 'Husten', example: 'Eu tenho tosse forte.', translatedExample: 'Ich habe starken Husten.', order: 1 },
            { word: 'febre', translation: 'Fieber', example: 'A criança está com febre.', translatedExample: 'Das Kind hat Fieber.', order: 2 },
            { word: 'dor', translation: 'Schmerzen', example: 'Eu tenho dores nas costas.', translatedExample: 'Ich habe Schmerzen im Rücken.', order: 3 },
            { word: 'resfriado', translation: 'Erkältung', example: 'Eu estou resfriado.', translatedExample: 'Ich habe eine Erkältung.', order: 4 },
            { word: 'alergia', translation: 'Allergie', example: 'Eu tenho alergia a pólen.', translatedExample: 'Ich habe eine Allergie gegen Pollen.', order: 5 },
            { word: 'doente', translation: 'krank', example: 'Eu me sinto doente.', translatedExample: 'Ich fühle mich krank.', order: 6 },
            { word: 'saudável', translation: 'gesund', example: 'O esporte faz bem à saúde.', translatedExample: 'Sport macht gesund.', order: 7 },
            { word: 'cansado', translation: 'müde', example: 'Eu estou muito cansado.', translatedExample: 'Ich bin sehr müde.', order: 8 },
            { word: 'dor de cabeça', translation: 'Kopfschmerzen', example: 'Eu tenho dor de cabeça.', translatedExample: 'Ich habe Kopfschmerzen.', order: 9 },
            { word: 'dor de barriga', translation: 'Bauchschmerzen', example: 'A criança tem dor de barriga.', translatedExample: 'Das Kind hat Bauchschmerzen.', order: 10 },
          ],
        },
        {
          title: 'No Médico',
          description: 'A consulta médica',
          order: 4,
          vocabulary: [
            { word: 'consulta/agendamento', translation: 'Termin', example: 'Eu tenho uma consulta no médico.', translatedExample: 'Ich habe einen Termin beim Arzt.', order: 1 },
            { word: 'receita médica', translation: 'Rezept', example: 'O médico me dá uma receita.', translatedExample: 'Der Arzt gibt mir ein Rezept.', order: 2 },
            { word: 'diagnóstico', translation: 'Diagnose', example: 'O diagnóstico foi surpreendente.', translatedExample: 'Die Diagnose war überraschend.', order: 3 },
            { word: 'comprimido', translation: 'Tablette', example: 'Eu tomo dois comprimidos por dia.', translatedExample: 'Ich nehme zwei Tabletten täglich.', order: 4 },
            { word: 'farmácia', translation: 'Apotheke', example: 'Eu pego o remédio na farmácia.', translatedExample: 'Ich hole das Medikament in der Apotheke.', order: 5 },
            { word: 'exame/consulta', translation: 'Untersuchung', example: 'O exame foi rápido.', translatedExample: 'Die Untersuchung war kurz.', order: 6 },
            { word: 'sangue', translation: 'Blut', example: 'O médico coleta sangue.', translatedExample: 'Der Arzt nimmt Blut ab.', order: 7 },
            { word: 'plano de saúde', translation: 'Krankenversicherung', example: 'Eu tenho um bom plano de saúde.', translatedExample: 'Ich habe eine gute Krankenversicherung.', order: 8 },
            { word: 'hospital', translation: 'Krankenhaus', example: 'Ele está internado no hospital.', translatedExample: 'Er liegt im Krankenhaus.', order: 9 },
            { word: 'pronto-socorro', translation: 'Notaufnahme', example: 'Vamos ao pronto-socorro.', translatedExample: 'Wir gehen in die Notaufnahme.', order: 10 },
          ],
        },
        {
          title: 'Esporte & Bem-estar',
          description: 'Saúde e bem-estar',
          order: 5,
          vocabulary: [
            { word: 'dieta', translation: 'Diät', example: 'Eu estou fazendo dieta.', translatedExample: 'Ich mache gerade eine Diät.', order: 1 },
            { word: 'vitamina', translation: 'Vitamin', example: 'Eu tomo vitaminas diariamente.', translatedExample: 'Ich nehme täglich Vitamine.', order: 2 },
            { word: 'sono', translation: 'Schlaf', example: 'Um bom sono é importante.', translatedExample: 'Guter Schlaf ist wichtig.', order: 3 },
            { word: 'estresse', translation: 'Stress', example: 'Eu tenho muito estresse no trabalho.', translatedExample: 'Ich habe viel Stress auf der Arbeit.', order: 4 },
            { word: 'relaxar', translation: 'entspannen', example: 'No fim de semana eu relaxo.', translatedExample: 'Am Wochenende entspanne ich mich.', order: 5 },
            { word: 'massagem', translation: 'Massage', example: 'Uma massagem ajuda nas dores nas costas.', translatedExample: 'Eine Massage hilft bei Rückenschmerzen.', order: 6 },
            { word: 'meditação', translation: 'Meditation', example: 'Eu faço meditação toda manhã.', translatedExample: 'Ich mache jeden Morgen Meditation.', order: 7 },
            { word: 'alimentação/nutrição', translation: 'Ernährung', example: 'Uma boa alimentação é importante.', translatedExample: 'Eine gute Ernährung ist wichtig.', order: 8 },
            { word: 'exercício/movimento', translation: 'Bewegung', example: 'Exercício regular faz bem à saúde.', translatedExample: 'Regelmäßige Bewegung ist gesund.', order: 9 },
            { word: 'peso', translation: 'Gewicht', example: 'Eu quero manter meu peso.', translatedExample: 'Ich möchte mein Gewicht halten.', order: 10 },
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
