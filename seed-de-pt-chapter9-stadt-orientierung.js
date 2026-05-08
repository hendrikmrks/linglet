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

    // Deutsch => Portugiesisch - Kapitel 9: Stadt & Orientierung
    const chapter = {
      title: 'Stadt & Orientierung',
      description: 'Orte in der Stadt und Wegbeschreibung',
      order: 9,
      subchapters: [
        {
          title: 'Orte in der Stadt',
          description: 'Wichtige Orte in der Stadt',
          order: 1,
          vocabulary: [
            { word: 'Rathaus', translation: 'prefeitura', example: 'Das Rathaus ist sehr alt.', translatedExample: 'A prefeitura é muito antiga.', order: 1 },
            { word: 'Krankenhaus', translation: 'hospital', example: 'Das Krankenhaus ist in der Stadtmitte.', translatedExample: 'O hospital fica no centro da cidade.', order: 2 },
            { word: 'Apotheke', translation: 'farmácia', example: 'Wo ist die nächste Apotheke?', translatedExample: 'Onde fica a farmácia mais próxima?', order: 3 },
            { word: 'Bibliothek', translation: 'biblioteca', example: 'Ich lese in der Bibliothek.', translatedExample: 'Eu leio na biblioteca.', order: 4 },
            { word: 'Bahnhof', translation: 'estação de trem', example: 'Der Bahnhof ist sehr groß.', translatedExample: 'A estação de trem é muito grande.', order: 5 },
            { word: 'Flughafen', translation: 'aeroporto', example: 'Ich fahre zum Flughafen.', translatedExample: 'Eu vou ao aeroporto.', order: 6 },
            { word: 'Museum', translation: 'museu', example: 'Das Museum ist kostenlos am Sonntag.', translatedExample: 'O museu é gratuito aos domingos.', order: 7 },
            { word: 'Kirche', translation: 'igreja', example: 'Die Kirche ist sehr schön.', translatedExample: 'A igreja é muito bonita.', order: 8 },
            { word: 'Marktplatz', translation: 'praça do mercado', example: 'Der Marktplatz ist belebt.', translatedExample: 'A praça do mercado é animada.', order: 9 },
            { word: 'Einkaufszentrum', translation: 'shopping center', example: 'Das Einkaufszentrum schließt um 20 Uhr.', translatedExample: 'O shopping fecha às 20 horas.', order: 10 },
          ],
        },
        {
          title: 'Wegbeschreibung',
          description: 'Den Weg erklären',
          order: 2,
          vocabulary: [
            { word: 'links', translation: 'à esquerda', example: 'Biegen Sie links ab.', translatedExample: 'Vire à esquerda.', order: 1 },
            { word: 'rechts', translation: 'à direita', example: 'Das Geschäft ist rechts.', translatedExample: 'A loja fica à direita.', order: 2 },
            { word: 'geradeaus', translation: 'em frente/reto', example: 'Gehen Sie geradeaus.', translatedExample: 'Siga em frente.', order: 3 },
            { word: 'um die Ecke', translation: 'na esquina', example: 'Das Café ist um die Ecke.', translatedExample: 'O café fica na esquina.', order: 4 },
            { word: 'neben', translation: 'ao lado de', example: 'Die Bank ist neben dem Supermarkt.', translatedExample: 'O banco fica ao lado do supermercado.', order: 5 },
            { word: 'gegenüber', translation: 'em frente a', example: 'Das Hotel ist gegenüber dem Bahnhof.', translatedExample: 'O hotel fica em frente à estação.', order: 6 },
            { word: 'hinter', translation: 'atrás de', example: 'Der Parkplatz ist hinter dem Gebäude.', translatedExample: 'O estacionamento fica atrás do prédio.', order: 7 },
            { word: 'vor', translation: 'na frente de/antes de', example: 'Warte vor dem Eingang.', translatedExample: 'Espere na frente da entrada.', order: 8 },
            { word: 'zwischen', translation: 'entre', example: 'Das Restaurant ist zwischen der Bäckerei und dem Kino.', translatedExample: 'O restaurante fica entre a padaria e o cinema.', order: 9 },
            { word: 'Ampel', translation: 'semáforo', example: 'Warten Sie bei der Ampel.', translatedExample: 'Espere no semáforo.', order: 10 },
          ],
        },
        {
          title: 'Wohnen & Unterkunft',
          description: 'Wohnung und Unterkunft',
          order: 3,
          vocabulary: [
            { word: 'Wohnung', translation: 'apartamento', example: 'Ich suche eine neue Wohnung.', translatedExample: 'Eu procuro um novo apartamento.', order: 1 },
            { word: 'Miete', translation: 'aluguel', example: 'Die Miete ist sehr hoch.', translatedExample: 'O aluguel é muito caro.', order: 2 },
            { word: 'Vermieter', translation: 'locador/proprietário', example: 'Mein Vermieter ist sehr nett.', translatedExample: 'Meu locador é muito gentil.', order: 3 },
            { word: 'Nachbar', translation: 'vizinho', example: 'Mein Nachbar macht Lärm.', translatedExample: 'Meu vizinho faz barulho.', order: 4 },
            { word: 'Etage', translation: 'andar', example: 'Ich wohne im dritten Etage.', translatedExample: 'Eu moro no terceiro andar.', order: 5 },
            { word: 'Aufzug', translation: 'elevador', example: 'Der Aufzug ist kaputt.', translatedExample: 'O elevador está quebrado.', order: 6 },
            { word: 'Klingel', translation: 'campainha', example: 'Drück die Klingel.', translatedExample: 'Toque a campainha.', order: 7 },
            { word: 'Briefkasten', translation: 'caixa de correio', example: 'Ich hole die Post aus dem Briefkasten.', translatedExample: 'Eu pego o correio da caixa.', order: 8 },
            { word: 'Haustür', translation: 'porta de entrada', example: 'Vergiss nicht die Haustür abzuschließen.', translatedExample: 'Não se esqueça de trancar a porta de entrada.', order: 9 },
            { word: 'Schlüssel', translation: 'chave', example: 'Ich habe meinen Schlüssel verloren.', translatedExample: 'Eu perdi minha chave.', order: 10 },
          ],
        },
        {
          title: 'Bank & Post',
          description: 'Bankgeschäfte und Post',
          order: 4,
          vocabulary: [
            { word: 'Konto', translation: 'conta bancária', example: 'Ich habe ein Konto bei der Sparkasse.', translatedExample: 'Eu tenho uma conta no banco.', order: 1 },
            { word: 'Überweisung', translation: 'transferência bancária', example: 'Ich mache eine Überweisung.', translatedExample: 'Eu faço uma transferência.', order: 2 },
            { word: 'Bargeld', translation: 'dinheiro em espécie', example: 'Ich zahle mit Bargeld.', translatedExample: 'Eu pago em dinheiro.', order: 3 },
            { word: 'Geldautomat', translation: 'caixa eletrônico', example: 'Wo ist der nächste Geldautomat?', translatedExample: 'Onde fica o caixa eletrônico mais próximo?', order: 4 },
            { word: 'Kreditkarte', translation: 'cartão de crédito', example: 'Ich zahle mit Kreditkarte.', translatedExample: 'Eu pago com cartão de crédito.', order: 5 },
            { word: 'Brief', translation: 'carta', example: 'Ich schreibe einen Brief.', translatedExample: 'Eu escrevo uma carta.', order: 6 },
            { word: 'Paket', translation: 'pacote/encomenda', example: 'Ich schicke ein Paket.', translatedExample: 'Eu envio um pacote.', order: 7 },
            { word: 'Briefmarke', translation: 'selo', example: 'Ich brauche eine Briefmarke.', translatedExample: 'Eu preciso de um selo.', order: 8 },
            { word: 'Formular', translation: 'formulário', example: 'Fülle das Formular aus.', translatedExample: 'Preencha o formulário.', order: 9 },
            { word: 'Personalausweis', translation: 'carteira de identidade', example: 'Zeigen Sie Ihren Personalausweis.', translatedExample: 'Mostre sua carteira de identidade.', order: 10 },
          ],
        },
        {
          title: 'Verkehr & Reisen',
          description: 'Mobilität und Reisen',
          order: 5,
          vocabulary: [
            { word: 'Fahrkarte', translation: 'passagem/bilhete', example: 'Ich kaufe eine Fahrkarte.', translatedExample: 'Eu compro uma passagem.', order: 1 },
            { word: 'Abfahrt', translation: 'partida', example: 'Die Abfahrt ist um 10 Uhr.', translatedExample: 'A partida é às 10 horas.', order: 2 },
            { word: 'Ankunft', translation: 'chegada', example: 'Die Ankunft ist um 14 Uhr.', translatedExample: 'A chegada é às 14 horas.', order: 3 },
            { word: 'Verspätung', translation: 'atraso', example: 'Der Zug hat Verspätung.', translatedExample: 'O trem está com atraso.', order: 4 },
            { word: 'Umsteigen', translation: 'baldeação/fazer conexão', example: 'Ich muss in Frankfurt umsteigen.', translatedExample: 'Eu preciso fazer baldeação em Frankfurt.', order: 5 },
            { word: 'Taxi', translation: 'táxi', example: 'Ich nehme ein Taxi zum Flughafen.', translatedExample: 'Eu pego um táxi para o aeroporto.', order: 6 },
            { word: 'U-Bahn', translation: 'metrô', example: 'Die U-Bahn ist schnell.', translatedExample: 'O metrô é rápido.', order: 7 },
            { word: 'Stau', translation: 'engarrafamento', example: 'Es gibt viel Stau auf der Autobahn.', translatedExample: 'Tem muito engarrafamento na rodovia.', order: 8 },
            { word: 'Parkplatz', translation: 'estacionamento', example: 'Ich suche einen Parkplatz.', translatedExample: 'Eu procuro um estacionamento.', order: 9 },
            { word: 'Tankstelle', translation: 'posto de combustível', example: 'Ich tanke an der Tankstelle.', translatedExample: 'Eu abasteco no posto.', order: 10 },
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
