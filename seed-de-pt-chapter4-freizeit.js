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

    // Deutsch => Portugiesisch - Kapitel 4: Freizeit
    const chapter = {
      title: 'Freizeit',
      description: 'Hobbys, Sport und Freizeitaktivitäten',
      order: 4,
      subchapters: [
        {
          title: 'Hobbys',
          description: 'Beliebte Freizeitbeschäftigungen',
          order: 1,
          vocabulary: [
            { word: 'Lesen', translation: 'Ler', example: 'Ich lese gerne Bücher.', translatedExample: 'Eu gosto de ler livros.', order: 1 },
            { word: 'Musik', translation: 'Música', example: 'Ich höre gerne Musik.', translatedExample: 'Eu gosto de ouvir música.', order: 2 },
            { word: 'Malen', translation: 'Pintar', example: 'Sie malt schöne Bilder.', translatedExample: 'Ela pinta quadros bonitos.', order: 3 },
            { word: 'Fotografieren', translation: 'Fotografar', example: 'Ich fotografiere die Natur.', translatedExample: 'Eu fotografo a natureza.', order: 4 },
            { word: 'Tanzen', translation: 'Dançar', example: 'Wir tanzen am Wochenende.', translatedExample: 'Nós dançamos no fim de semana.', order: 5 },
            { word: 'Singen', translation: 'Cantar', example: 'Er singt sehr gut.', translatedExample: 'Ele canta muito bem.', order: 6 },
            { word: 'Zeichnen', translation: 'Desenhar', example: 'Ich zeichne gerne Porträts.', translatedExample: 'Eu gosto de desenhar retratos.', order: 7 },
            { word: 'Gärtnern', translation: 'Jardinagem', example: 'Meine Oma liebt Gärtnern.', translatedExample: 'Minha avó ama jardinagem.', order: 8 },
            { word: 'Basteln', translation: 'Fazer artesanato', example: 'Die Kinder basteln gerne.', translatedExample: 'As crianças gostam de fazer artesanato.', order: 9 },
            { word: 'Sammeln', translation: 'Colecionar', example: 'Ich sammle Briefmarken.', translatedExample: 'Eu coleciono selos.', order: 10 },
          ],
        },
        {
          title: 'Sport',
          description: 'Verschiedene Sportarten',
          order: 2,
          vocabulary: [
            { word: 'Fußball', translation: 'Futebol', example: 'Ich spiele Fußball im Verein.', translatedExample: 'Eu jogo futebol no clube.', order: 1 },
            { word: 'Tennis', translation: 'Tênis', example: 'Tennis macht Spaß.', translatedExample: 'Tênis é divertido.', order: 2 },
            { word: 'Schwimmen', translation: 'Natação', example: 'Im Sommer gehe ich schwimmen.', translatedExample: 'No verão eu vou nadar.', order: 3 },
            { word: 'Laufen', translation: 'Corrida', example: 'Ich gehe jeden Morgen laufen.', translatedExample: 'Eu corro toda manhã.', order: 4 },
            { word: 'Radfahren', translation: 'Ciclismo', example: 'Radfahren ist gesund.', translatedExample: 'Ciclismo é saudável.', order: 5 },
            { word: 'Yoga', translation: 'Yoga', example: 'Sie macht dreimal pro Woche Yoga.', translatedExample: 'Ela faz yoga três vezes por semana.', order: 6 },
            { word: 'Basketball', translation: 'Basquete', example: 'Er spielt gerne Basketball.', translatedExample: 'Ele gosta de jogar basquete.', order: 7 },
            { word: 'Volleyball', translation: 'Vôlei', example: 'Wir spielen Volleyball am Strand.', translatedExample: 'Nós jogamos vôlei na praia.', order: 8 },
            { word: 'Fitness', translation: 'Academia', example: 'Ich gehe ins Fitness-Studio.', translatedExample: 'Eu vou à academia.', order: 9 },
            { word: 'Wandern', translation: 'Caminhada', example: 'Am Wochenende gehen wir wandern.', translatedExample: 'No fim de semana nós vamos caminhar.', order: 10 },
          ],
        },
        {
          title: 'Unterhaltung',
          description: 'Unterhaltung und Medien',
          order: 3,
          vocabulary: [
            { word: 'Film', translation: 'Filme', example: 'Ich schaue gerne Filme.', translatedExample: 'Eu gosto de assistir filmes.', order: 1 },
            { word: 'Serie', translation: 'Série', example: 'Diese Serie ist spannend.', translatedExample: 'Esta série é emocionante.', order: 2 },
            { word: 'Buch', translation: 'Livro', example: 'Das Buch ist interessant.', translatedExample: 'O livro é interessante.', order: 3 },
            { word: 'Konzert', translation: 'Show', example: 'Wir gehen zu einem Konzert.', translatedExample: 'Nós vamos a um show.', order: 4 },
            { word: 'Theater', translation: 'Teatro', example: 'Das Theater ist heute ausverkauft.', translatedExample: 'O teatro está esgotado hoje.', order: 5 },
            { word: 'Kino', translation: 'Cinema', example: 'Gehen wir ins Kino?', translatedExample: 'Vamos ao cinema?', order: 6 },
            { word: 'Museum', translation: 'Museu', example: 'Das Museum ist sonntags gratis.', translatedExample: 'O museu é grátis aos domingos.', order: 7 },
            { word: 'Spiel', translation: 'Jogo', example: 'Wir spielen ein Spiel.', translatedExample: 'Nós jogamos um jogo.', order: 8 },
            { word: 'Party', translation: 'Festa', example: 'Heute Abend ist eine Party.', translatedExample: 'Hoje à noite tem uma festa.', order: 9 },
            { word: 'Festival', translation: 'Festival', example: 'Das Festival ist im Sommer.', translatedExample: 'O festival é no verão.', order: 10 },
          ],
        },
        {
          title: 'Natur',
          description: 'Orte in der Natur',
          order: 4,
          vocabulary: [
            { word: 'Park', translation: 'Parque', example: 'Wir gehen in den Park.', translatedExample: 'Nós vamos ao parque.', order: 1 },
            { word: 'Strand', translation: 'Praia', example: 'Der Strand ist schön.', translatedExample: 'A praia é bonita.', order: 2 },
            { word: 'Wald', translation: 'Floresta', example: 'Im Wald ist es ruhig.', translatedExample: 'Na floresta é tranquilo.', order: 3 },
            { word: 'Berg', translation: 'Montanha', example: 'Der Berg ist sehr hoch.', translatedExample: 'A montanha é muito alta.', order: 4 },
            { word: 'See', translation: 'Lago', example: 'Der See ist klar und sauber.', translatedExample: 'O lago é claro e limpo.', order: 5 },
            { word: 'Fluss', translation: 'Rio', example: 'Der Fluss fließt durch die Stadt.', translatedExample: 'O rio passa pela cidade.', order: 6 },
            { word: 'Wiese', translation: 'Prado', example: 'Auf der Wiese wachsen Blumen.', translatedExample: 'No prado crescem flores.', order: 7 },
            { word: 'Baum', translation: 'Árvore', example: 'Der Baum ist sehr alt.', translatedExample: 'A árvore é muito velha.', order: 8 },
            { word: 'Blume', translation: 'Flor', example: 'Die Blumen duften gut.', translatedExample: 'As flores têm um bom cheiro.', order: 9 },
            { word: 'Tier', translation: 'Animal', example: 'Im Zoo sehen wir viele Tiere.', translatedExample: 'No zoológico vemos muitos animais.', order: 10 },
          ],
        },
        {
          title: 'Reisen',
          description: 'Urlaub und Reisen',
          order: 5,
          vocabulary: [
            { word: 'Urlaub', translation: 'Férias', example: 'Ich fahre in den Urlaub.', translatedExample: 'Eu vou de férias.', order: 1 },
            { word: 'Reise', translation: 'Viagem', example: 'Die Reise war wunderbar.', translatedExample: 'A viagem foi maravilhosa.', order: 2 },
            { word: 'Hotel', translation: 'Hotel', example: 'Das Hotel ist sehr komfortabel.', translatedExample: 'O hotel é muito confortável.', order: 3 },
            { word: 'Koffer', translation: 'Mala', example: 'Ich packe meinen Koffer.', translatedExample: 'Eu faço minha mala.', order: 4 },
            { word: 'Pass', translation: 'Passaporte', example: 'Ich brauche meinen Pass.', translatedExample: 'Eu preciso do meu passaporte.', order: 5 },
            { word: 'Karte', translation: 'Mapa', example: 'Ich habe eine Karte der Stadt.', translatedExample: 'Eu tenho um mapa da cidade.', order: 6 },
            { word: 'Foto', translation: 'Foto', example: 'Ich mache viele Fotos.', translatedExample: 'Eu tiro muitas fotos.', order: 7 },
            { word: 'Souvenir', translation: 'Lembrança', example: 'Ich kaufe ein Souvenir.', translatedExample: 'Eu compro uma lembrança.', order: 8 },
            { word: 'Ausflug', translation: 'Passeio', example: 'Wir machen einen Ausflug.', translatedExample: 'Nós fazemos um passeio.', order: 9 },
            { word: 'Sehenswürdigkeit', translation: 'Ponto turístico', example: 'Diese Sehenswürdigkeit ist berühmt.', translatedExample: 'Este ponto turístico é famoso.', order: 10 },
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
