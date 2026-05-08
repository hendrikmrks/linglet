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

    // Portugiesisch => Deutsch - Capítulo 9: Cidade & Orientação
    const chapter = {
      title: 'Cidade & Orientação',
      description: 'Lugares na cidade e como se orientar',
      order: 9,
      subchapters: [
        {
          title: 'Lugares na Cidade',
          description: 'Lugares importantes na cidade',
          order: 1,
          vocabulary: [
            { word: 'prefeitura', translation: 'Rathaus', example: 'A prefeitura é muito antiga.', translatedExample: 'Das Rathaus ist sehr alt.', order: 1 },
            { word: 'hospital', translation: 'Krankenhaus', example: 'O hospital fica no centro da cidade.', translatedExample: 'Das Krankenhaus ist in der Stadtmitte.', order: 2 },
            { word: 'farmácia', translation: 'Apotheke', example: 'Onde fica a farmácia mais próxima?', translatedExample: 'Wo ist die nächste Apotheke?', order: 3 },
            { word: 'biblioteca', translation: 'Bibliothek', example: 'Eu leio na biblioteca.', translatedExample: 'Ich lese in der Bibliothek.', order: 4 },
            { word: 'estação de trem', translation: 'Bahnhof', example: 'A estação de trem é muito grande.', translatedExample: 'Der Bahnhof ist sehr groß.', order: 5 },
            { word: 'aeroporto', translation: 'Flughafen', example: 'Eu vou ao aeroporto.', translatedExample: 'Ich fahre zum Flughafen.', order: 6 },
            { word: 'museu', translation: 'Museum', example: 'O museu é gratuito aos domingos.', translatedExample: 'Das Museum ist kostenlos am Sonntag.', order: 7 },
            { word: 'igreja', translation: 'Kirche', example: 'A igreja é muito bonita.', translatedExample: 'Die Kirche ist sehr schön.', order: 8 },
            { word: 'praça do mercado', translation: 'Marktplatz', example: 'A praça do mercado é animada.', translatedExample: 'Der Marktplatz ist belebt.', order: 9 },
            { word: 'shopping center', translation: 'Einkaufszentrum', example: 'O shopping fecha às 20 horas.', translatedExample: 'Das Einkaufszentrum schließt um 20 Uhr.', order: 10 },
          ],
        },
        {
          title: 'Como Chegar',
          description: 'Como dar direções',
          order: 2,
          vocabulary: [
            { word: 'à esquerda', translation: 'links', example: 'Vire à esquerda.', translatedExample: 'Biegen Sie links ab.', order: 1 },
            { word: 'à direita', translation: 'rechts', example: 'A loja fica à direita.', translatedExample: 'Das Geschäft ist rechts.', order: 2 },
            { word: 'em frente/reto', translation: 'geradeaus', example: 'Siga em frente.', translatedExample: 'Gehen Sie geradeaus.', order: 3 },
            { word: 'na esquina', translation: 'um die Ecke', example: 'O café fica na esquina.', translatedExample: 'Das Café ist um die Ecke.', order: 4 },
            { word: 'ao lado de', translation: 'neben', example: 'O banco fica ao lado do supermercado.', translatedExample: 'Die Bank ist neben dem Supermarkt.', order: 5 },
            { word: 'em frente a', translation: 'gegenüber', example: 'O hotel fica em frente à estação.', translatedExample: 'Das Hotel ist gegenüber dem Bahnhof.', order: 6 },
            { word: 'atrás de', translation: 'hinter', example: 'O estacionamento fica atrás do prédio.', translatedExample: 'Der Parkplatz ist hinter dem Gebäude.', order: 7 },
            { word: 'na frente de/antes de', translation: 'vor', example: 'Espere na frente da entrada.', translatedExample: 'Warte vor dem Eingang.', order: 8 },
            { word: 'entre', translation: 'zwischen', example: 'O restaurante fica entre a padaria e o cinema.', translatedExample: 'Das Restaurant ist zwischen der Bäckerei und dem Kino.', order: 9 },
            { word: 'semáforo', translation: 'Ampel', example: 'Espere no semáforo.', translatedExample: 'Warten Sie bei der Ampel.', order: 10 },
          ],
        },
        {
          title: 'Moradia & Hospedagem',
          description: 'Moradia e hospedagem',
          order: 3,
          vocabulary: [
            { word: 'apartamento', translation: 'Wohnung', example: 'Eu procuro um novo apartamento.', translatedExample: 'Ich suche eine neue Wohnung.', order: 1 },
            { word: 'aluguel', translation: 'Miete', example: 'O aluguel é muito caro.', translatedExample: 'Die Miete ist sehr hoch.', order: 2 },
            { word: 'locador/proprietário', translation: 'Vermieter', example: 'Meu locador é muito gentil.', translatedExample: 'Mein Vermieter ist sehr nett.', order: 3 },
            { word: 'vizinho', translation: 'Nachbar', example: 'Meu vizinho faz barulho.', translatedExample: 'Mein Nachbar macht Lärm.', order: 4 },
            { word: 'andar', translation: 'Etage', example: 'Eu moro no terceiro andar.', translatedExample: 'Ich wohne im dritten Etage.', order: 5 },
            { word: 'elevador', translation: 'Aufzug', example: 'O elevador está quebrado.', translatedExample: 'Der Aufzug ist kaputt.', order: 6 },
            { word: 'campainha', translation: 'Klingel', example: 'Toque a campainha.', translatedExample: 'Drück die Klingel.', order: 7 },
            { word: 'caixa de correio', translation: 'Briefkasten', example: 'Eu pego o correio da caixa.', translatedExample: 'Ich hole die Post aus dem Briefkasten.', order: 8 },
            { word: 'porta de entrada', translation: 'Haustür', example: 'Não se esqueça de trancar a porta de entrada.', translatedExample: 'Vergiss nicht die Haustür abzuschließen.', order: 9 },
            { word: 'chave', translation: 'Schlüssel', example: 'Eu perdi minha chave.', translatedExample: 'Ich habe meinen Schlüssel verloren.', order: 10 },
          ],
        },
        {
          title: 'Banco & Correios',
          description: 'Serviços bancários e correios',
          order: 4,
          vocabulary: [
            { word: 'conta bancária', translation: 'Konto', example: 'Eu tenho uma conta no banco.', translatedExample: 'Ich habe ein Konto bei der Sparkasse.', order: 1 },
            { word: 'transferência bancária', translation: 'Überweisung', example: 'Eu faço uma transferência.', translatedExample: 'Ich mache eine Überweisung.', order: 2 },
            { word: 'dinheiro em espécie', translation: 'Bargeld', example: 'Eu pago em dinheiro.', translatedExample: 'Ich zahle mit Bargeld.', order: 3 },
            { word: 'caixa eletrônico', translation: 'Geldautomat', example: 'Onde fica o caixa eletrônico mais próximo?', translatedExample: 'Wo ist der nächste Geldautomat?', order: 4 },
            { word: 'cartão de crédito', translation: 'Kreditkarte', example: 'Eu pago com cartão de crédito.', translatedExample: 'Ich zahle mit Kreditkarte.', order: 5 },
            { word: 'carta', translation: 'Brief', example: 'Eu escrevo uma carta.', translatedExample: 'Ich schreibe einen Brief.', order: 6 },
            { word: 'pacote/encomenda', translation: 'Paket', example: 'Eu envio um pacote.', translatedExample: 'Ich schicke ein Paket.', order: 7 },
            { word: 'selo', translation: 'Briefmarke', example: 'Eu preciso de um selo.', translatedExample: 'Ich brauche eine Briefmarke.', order: 8 },
            { word: 'formulário', translation: 'Formular', example: 'Preencha o formulário.', translatedExample: 'Fülle das Formular aus.', order: 9 },
            { word: 'carteira de identidade', translation: 'Personalausweis', example: 'Mostre sua carteira de identidade.', translatedExample: 'Zeigen Sie Ihren Personalausweis.', order: 10 },
          ],
        },
        {
          title: 'Transporte & Viagem',
          description: 'Mobilidade e viagem',
          order: 5,
          vocabulary: [
            { word: 'passagem/bilhete', translation: 'Fahrkarte', example: 'Eu compro uma passagem.', translatedExample: 'Ich kaufe eine Fahrkarte.', order: 1 },
            { word: 'partida', translation: 'Abfahrt', example: 'A partida é às 10 horas.', translatedExample: 'Die Abfahrt ist um 10 Uhr.', order: 2 },
            { word: 'chegada', translation: 'Ankunft', example: 'A chegada é às 14 horas.', translatedExample: 'Die Ankunft ist um 14 Uhr.', order: 3 },
            { word: 'atraso', translation: 'Verspätung', example: 'O trem está com atraso.', translatedExample: 'Der Zug hat Verspätung.', order: 4 },
            { word: 'baldeação/fazer conexão', translation: 'Umsteigen', example: 'Eu preciso fazer baldeação em Frankfurt.', translatedExample: 'Ich muss in Frankfurt umsteigen.', order: 5 },
            { word: 'táxi', translation: 'Taxi', example: 'Eu pego um táxi para o aeroporto.', translatedExample: 'Ich nehme ein Taxi zum Flughafen.', order: 6 },
            { word: 'metrô', translation: 'U-Bahn', example: 'O metrô é rápido.', translatedExample: 'Die U-Bahn ist schnell.', order: 7 },
            { word: 'engarrafamento', translation: 'Stau', example: 'Tem muito engarrafamento na rodovia.', translatedExample: 'Es gibt viel Stau auf der Autobahn.', order: 8 },
            { word: 'estacionamento', translation: 'Parkplatz', example: 'Eu procuro um estacionamento.', translatedExample: 'Ich suche einen Parkplatz.', order: 9 },
            { word: 'posto de combustível', translation: 'Tankstelle', example: 'Eu abasteco no posto.', translatedExample: 'Ich tanke an der Tankstelle.', order: 10 },
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
