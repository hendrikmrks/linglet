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

    // Portugiesisch => Deutsch - Kapitel 4: Lazer
    const chapter = {
      title: 'Lazer',
      description: 'Hobbies, esportes e atividades de lazer',
      order: 4,
      subchapters: [
        {
          title: 'Hobbies',
          description: 'Passatempos populares',
          order: 1,
          vocabulary: [
            { word: 'Ler', translation: 'Lesen', example: 'Eu gosto de ler livros.', translatedExample: 'Ich lese gerne Bücher.', order: 1 },
            { word: 'Música', translation: 'Musik', example: 'Eu gosto de ouvir música.', translatedExample: 'Ich höre gerne Musik.', order: 2 },
            { word: 'Pintar', translation: 'Malen', example: 'Ela pinta quadros bonitos.', translatedExample: 'Sie malt schöne Bilder.', order: 3 },
            { word: 'Fotografar', translation: 'Fotografieren', example: 'Eu fotografo a natureza.', translatedExample: 'Ich fotografiere die Natur.', order: 4 },
            { word: 'Dançar', translation: 'Tanzen', example: 'Nós dançamos no fim de semana.', translatedExample: 'Wir tanzen am Wochenende.', order: 5 },
            { word: 'Cantar', translation: 'Singen', example: 'Ele canta muito bem.', translatedExample: 'Er singt sehr gut.', order: 6 },
            { word: 'Desenhar', translation: 'Zeichnen', example: 'Eu gosto de desenhar retratos.', translatedExample: 'Ich zeichne gerne Porträts.', order: 7 },
            { word: 'Jardinagem', translation: 'Gärtnern', example: 'Minha avó ama jardinagem.', translatedExample: 'Meine Oma liebt Gärtnern.', order: 8 },
            { word: 'Fazer artesanato', translation: 'Basteln', example: 'As crianças gostam de fazer artesanato.', translatedExample: 'Die Kinder basteln gerne.', order: 9 },
            { word: 'Colecionar', translation: 'Sammeln', example: 'Eu coleciono selos.', translatedExample: 'Ich sammle Briefmarken.', order: 10 },
          ],
        },
        {
          title: 'Esportes',
          description: 'Diferentes tipos de esporte',
          order: 2,
          vocabulary: [
            { word: 'Futebol', translation: 'Fußball', example: 'Eu jogo futebol no clube.', translatedExample: 'Ich spiele Fußball im Verein.', order: 1 },
            { word: 'Tênis', translation: 'Tennis', example: 'Tênis é divertido.', translatedExample: 'Tennis macht Spaß.', order: 2 },
            { word: 'Natação', translation: 'Schwimmen', example: 'No verão eu vou nadar.', translatedExample: 'Im Sommer gehe ich schwimmen.', order: 3 },
            { word: 'Corrida', translation: 'Laufen', example: 'Eu corro toda manhã.', translatedExample: 'Ich gehe jeden Morgen laufen.', order: 4 },
            { word: 'Ciclismo', translation: 'Radfahren', example: 'Ciclismo é saudável.', translatedExample: 'Radfahren ist gesund.', order: 5 },
            { word: 'Yoga', translation: 'Yoga', example: 'Ela faz yoga três vezes por semana.', translatedExample: 'Sie macht dreimal pro Woche Yoga.', order: 6 },
            { word: 'Basquete', translation: 'Basketball', example: 'Ele gosta de jogar basquete.', translatedExample: 'Er spielt gerne Basketball.', order: 7 },
            { word: 'Vôlei', translation: 'Volleyball', example: 'Nós jogamos vôlei na praia.', translatedExample: 'Wir spielen Volleyball am Strand.', order: 8 },
            { word: 'Academia', translation: 'Fitness', example: 'Eu vou à academia.', translatedExample: 'Ich gehe ins Fitness-Studio.', order: 9 },
            { word: 'Caminhada', translation: 'Wandern', example: 'No fim de semana nós vamos caminhar.', translatedExample: 'Am Wochenende gehen wir wandern.', order: 10 },
          ],
        },
        {
          title: 'Entretenimento',
          description: 'Entretenimento e mídia',
          order: 3,
          vocabulary: [
            { word: 'Filme', translation: 'Film', example: 'Eu gosto de assistir filmes.', translatedExample: 'Ich schaue gerne Filme.', order: 1 },
            { word: 'Série', translation: 'Serie', example: 'Esta série é emocionante.', translatedExample: 'Diese Serie ist spannend.', order: 2 },
            { word: 'Livro', translation: 'Buch', example: 'O livro é interessante.', translatedExample: 'Das Buch ist interessant.', order: 3 },
            { word: 'Show', translation: 'Konzert', example: 'Nós vamos a um show.', translatedExample: 'Wir gehen zu einem Konzert.', order: 4 },
            { word: 'Teatro', translation: 'Theater', example: 'O teatro está esgotado hoje.', translatedExample: 'Das Theater ist heute ausverkauft.', order: 5 },
            { word: 'Cinema', translation: 'Kino', example: 'Vamos ao cinema?', translatedExample: 'Gehen wir ins Kino?', order: 6 },
            { word: 'Museu', translation: 'Museum', example: 'O museu é grátis aos domingos.', translatedExample: 'Das Museum ist sonntags gratis.', order: 7 },
            { word: 'Jogo', translation: 'Spiel', example: 'Nós jogamos um jogo.', translatedExample: 'Wir spielen ein Spiel.', order: 8 },
            { word: 'Festa', translation: 'Party', example: 'Hoje à noite tem uma festa.', translatedExample: 'Heute Abend ist eine Party.', order: 9 },
            { word: 'Festival', translation: 'Festival', example: 'O festival é no verão.', translatedExample: 'Das Festival ist im Sommer.', order: 10 },
          ],
        },
        {
          title: 'Natureza',
          description: 'Lugares na natureza',
          order: 4,
          vocabulary: [
            { word: 'Parque', translation: 'Park', example: 'Nós vamos ao parque.', translatedExample: 'Wir gehen in den Park.', order: 1 },
            { word: 'Praia', translation: 'Strand', example: 'A praia é bonita.', translatedExample: 'Der Strand ist schön.', order: 2 },
            { word: 'Floresta', translation: 'Wald', example: 'Na floresta é tranquilo.', translatedExample: 'Im Wald ist es ruhig.', order: 3 },
            { word: 'Montanha', translation: 'Berg', example: 'A montanha é muito alta.', translatedExample: 'Der Berg ist sehr hoch.', order: 4 },
            { word: 'Lago', translation: 'See', example: 'O lago é claro e limpo.', translatedExample: 'Der See ist klar und sauber.', order: 5 },
            { word: 'Rio', translation: 'Fluss', example: 'O rio passa pela cidade.', translatedExample: 'Der Fluss fließt durch die Stadt.', order: 6 },
            { word: 'Prado', translation: 'Wiese', example: 'No prado crescem flores.', translatedExample: 'Auf der Wiese wachsen Blumen.', order: 7 },
            { word: 'Árvore', translation: 'Baum', example: 'A árvore é muito velha.', translatedExample: 'Der Baum ist sehr alt.', order: 8 },
            { word: 'Flor', translation: 'Blume', example: 'As flores têm um bom cheiro.', translatedExample: 'Die Blumen duften gut.', order: 9 },
            { word: 'Animal', translation: 'Tier', example: 'No zoológico vemos muitos animais.', translatedExample: 'Im Zoo sehen wir viele Tiere.', order: 10 },
          ],
        },
        {
          title: 'Viagens',
          description: 'Férias e viagens',
          order: 5,
          vocabulary: [
            { word: 'Férias', translation: 'Urlaub', example: 'Eu vou de férias.', translatedExample: 'Ich fahre in den Urlaub.', order: 1 },
            { word: 'Viagem', translation: 'Reise', example: 'A viagem foi maravilhosa.', translatedExample: 'Die Reise war wunderbar.', order: 2 },
            { word: 'Hotel', translation: 'Hotel', example: 'O hotel é muito confortável.', translatedExample: 'Das Hotel ist sehr komfortabel.', order: 3 },
            { word: 'Mala', translation: 'Koffer', example: 'Eu faço minha mala.', translatedExample: 'Ich packe meinen Koffer.', order: 4 },
            { word: 'Passaporte', translation: 'Pass', example: 'Eu preciso do meu passaporte.', translatedExample: 'Ich brauche meinen Pass.', order: 5 },
            { word: 'Mapa', translation: 'Karte', example: 'Eu tenho um mapa da cidade.', translatedExample: 'Ich habe eine Karte der Stadt.', order: 6 },
            { word: 'Foto', translation: 'Foto', example: 'Eu tiro muitas fotos.', translatedExample: 'Ich mache viele Fotos.', order: 7 },
            { word: 'Lembrança', translation: 'Souvenir', example: 'Eu compro uma lembrança.', translatedExample: 'Ich kaufe ein Souvenir.', order: 8 },
            { word: 'Passeio', translation: 'Ausflug', example: 'Nós fazemos um passeio.', translatedExample: 'Wir machen einen Ausflug.', order: 9 },
            { word: 'Ponto turístico', translation: 'Sehenswürdigkeit', example: 'Este ponto turístico é famoso.', translatedExample: 'Diese Sehenswürdigkeit ist berühmt.', order: 10 },
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
