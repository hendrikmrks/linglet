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

    // Deutsch => Portugiesisch - Kapitel 10: Technologie & Medien
    const chapter = {
      title: 'Technologie & Medien',
      description: 'Computer, Internet und Medien',
      order: 10,
      subchapters: [
        {
          title: 'Computer & Internet',
          description: 'Digitale Geräte und Internet',
          order: 1,
          vocabulary: [
            { word: 'Laptop', translation: 'notebook', example: 'Mein Laptop ist neu.', translatedExample: 'Meu notebook é novo.', order: 1 },
            { word: 'Bildschirm', translation: 'tela/monitor', example: 'Der Bildschirm ist sehr hell.', translatedExample: 'A tela é muito brilhante.', order: 2 },
            { word: 'Tastatur', translation: 'teclado', example: 'Meine Tastatur ist kaputt.', translatedExample: 'Meu teclado está quebrado.', order: 3 },
            { word: 'Maus', translation: 'mouse', example: 'Die Maus funktioniert nicht.', translatedExample: 'O mouse não funciona.', order: 4 },
            { word: 'Drucker', translation: 'impressora', example: 'Der Drucker druckt langsam.', translatedExample: 'A impressora imprime devagar.', order: 5 },
            { word: 'herunterladen', translation: 'baixar/fazer download', example: 'Ich lade die Datei herunter.', translatedExample: 'Eu baixo o arquivo.', order: 6 },
            { word: 'hochladen', translation: 'enviar/fazer upload', example: 'Ich lade das Foto hoch.', translatedExample: 'Eu envio a foto.', order: 7 },
            { word: 'Passwort', translation: 'senha', example: 'Vergiss dein Passwort nicht.', translatedExample: 'Não esqueça sua senha.', order: 8 },
            { word: 'WLAN', translation: 'Wi-Fi', example: 'Wie ist das WLAN-Passwort?', translatedExample: 'Qual é a senha do Wi-Fi?', order: 9 },
            { word: 'Browser', translation: 'navegador', example: 'Ich nutze einen modernen Browser.', translatedExample: 'Eu uso um navegador moderno.', order: 10 },
          ],
        },
        {
          title: 'Smartphone & Apps',
          description: 'Mobiltelefon und Anwendungen',
          order: 2,
          vocabulary: [
            { word: 'anrufen', translation: 'ligar/telefonar', example: 'Ich rufe dich später an.', translatedExample: 'Eu te ligo mais tarde.', order: 1 },
            { word: 'SMS', translation: 'mensagem de texto', example: 'Ich schreibe eine SMS.', translatedExample: 'Eu escrevo uma mensagem de texto.', order: 2 },
            { word: 'Akku', translation: 'bateria', example: 'Mein Akku ist leer.', translatedExample: 'Minha bateria está descarregada.', order: 3 },
            { word: 'App', translation: 'aplicativo', example: 'Diese App ist sehr praktisch.', translatedExample: 'Este aplicativo é muito prático.', order: 4 },
            { word: 'Kamera', translation: 'câmera', example: 'Die Kamera macht gute Fotos.', translatedExample: 'A câmera tira boas fotos.', order: 5 },
            { word: 'Lautsprecher', translation: 'alto-falante', example: 'Der Lautsprecher ist kaputt.', translatedExample: 'O alto-falante está quebrado.', order: 6 },
            { word: 'Kopfhörer', translation: 'fone de ouvido', example: 'Ich höre Musik mit Kopfhörern.', translatedExample: 'Eu ouço música com fone de ouvido.', order: 7 },
            { word: 'Ladekabel', translation: 'cabo de carregamento', example: 'Hast du ein Ladekabel dabei?', translatedExample: 'Você tem um cabo de carregamento?', order: 8 },
            { word: 'Sprachnachricht', translation: 'mensagem de voz', example: 'Ich schicke eine Sprachnachricht.', translatedExample: 'Eu mando uma mensagem de voz.', order: 9 },
            { word: 'Benachrichtigung', translation: 'notificação', example: 'Ich bekomme viele Benachrichtigungen.', translatedExample: 'Eu recebo muitas notificações.', order: 10 },
          ],
        },
        {
          title: 'Soziale Medien',
          description: 'Soziale Netzwerke und Online-Kommunikation',
          order: 3,
          vocabulary: [
            { word: 'Profil', translation: 'perfil', example: 'Ich erstelle ein neues Profil.', translatedExample: 'Eu crio um novo perfil.', order: 1 },
            { word: 'Follower', translation: 'seguidor', example: 'Ich habe viele Follower.', translatedExample: 'Eu tenho muitos seguidores.', order: 2 },
            { word: 'posten', translation: 'postar/publicar', example: 'Ich poste täglich Fotos.', translatedExample: 'Eu posto fotos diariamente.', order: 3 },
            { word: 'teilen', translation: 'compartilhar', example: 'Ich teile diesen Artikel.', translatedExample: 'Eu compartilho este artigo.', order: 4 },
            { word: 'kommentieren', translation: 'comentar', example: 'Er kommentiert jedes Foto.', translatedExample: 'Ele comenta cada foto.', order: 5 },
            { word: 'liken', translation: 'curtir', example: 'Ich like dein Foto.', translatedExample: 'Eu curto a sua foto.', order: 6 },
            { word: 'streamen', translation: 'transmitir ao vivo/fazer stream', example: 'Sie streamt jeden Abend.', translatedExample: 'Ela faz stream todo fim de tarde.', order: 7 },
            { word: 'Abonnement', translation: 'assinatura', example: 'Ich kündige mein Abonnement.', translatedExample: 'Eu cancelo minha assinatura.', order: 8 },
            { word: 'Direktnachricht', translation: 'mensagem direta/direct', example: 'Ich schicke eine Direktnachricht.', translatedExample: 'Eu mando uma mensagem direta.', order: 9 },
            { word: 'Hashtag', translation: 'hashtag', example: 'Nutze den richtigen Hashtag.', translatedExample: 'Use a hashtag certa.', order: 10 },
          ],
        },
        {
          title: 'Nachrichten & Medien',
          description: 'Medien und Informationen',
          order: 4,
          vocabulary: [
            { word: 'Zeitung', translation: 'jornal', example: 'Ich lese die Zeitung morgens.', translatedExample: 'Eu leio o jornal de manhã.', order: 1 },
            { word: 'Nachricht', translation: 'notícia/mensagem', example: 'Hast du die Nachrichten gehört?', translatedExample: 'Você ouviu as notícias?', order: 2 },
            { word: 'Schlagzeile', translation: 'manchete', example: 'Die Schlagzeile ist erschreckend.', translatedExample: 'A manchete é assustadora.', order: 3 },
            { word: 'Bericht', translation: 'reportagem/relatório', example: 'Der Bericht war sehr detailliert.', translatedExample: 'A reportagem foi muito detalhada.', order: 4 },
            { word: 'Interview', translation: 'entrevista', example: 'Das Interview war interessant.', translatedExample: 'A entrevista foi interessante.', order: 5 },
            { word: 'Podcast', translation: 'podcast', example: 'Ich höre täglich Podcasts.', translatedExample: 'Eu ouço podcasts diariamente.', order: 6 },
            { word: 'Sendung', translation: 'programa/transmissão', example: 'Die Sendung beginnt um 20 Uhr.', translatedExample: 'O programa começa às 20 horas.', order: 7 },
            { word: 'Werbung', translation: 'propaganda/publicidade', example: 'Es gibt zu viel Werbung im Fernsehen.', translatedExample: 'Tem muita publicidade na televisão.', order: 8 },
            { word: 'Dokumentation', translation: 'documentário', example: 'Ich schaue gerne Dokumentationen.', translatedExample: 'Eu gosto de assistir documentários.', order: 9 },
            { word: 'Kanal', translation: 'canal', example: 'Ich folge diesem Kanal auf YouTube.', translatedExample: 'Eu sigo este canal no YouTube.', order: 10 },
          ],
        },
        {
          title: 'Technik im Alltag',
          description: 'Alltägliche Technologie',
          order: 5,
          vocabulary: [
            { word: 'Fernbedienung', translation: 'controle remoto', example: 'Wo ist die Fernbedienung?', translatedExample: 'Onde está o controle remoto?', order: 1 },
            { word: 'Steckdose', translation: 'tomada', example: 'Die Steckdose ist kaputt.', translatedExample: 'A tomada está quebrada.', order: 2 },
            { word: 'Kabel', translation: 'cabo', example: 'Das Kabel ist zu kurz.', translatedExample: 'O cabo é muito curto.', order: 3 },
            { word: 'Router', translation: 'roteador', example: 'Der Router muss neu gestartet werden.', translatedExample: 'O roteador precisa ser reiniciado.', order: 4 },
            { word: 'Smart-TV', translation: 'Smart-TV', example: 'Mein Smart-TV hat viele Apps.', translatedExample: 'Meu Smart-TV tem muitos aplicativos.', order: 5 },
            { word: 'Spielkonsole', translation: 'console de videogame', example: 'Er spielt täglich auf der Spielkonsole.', translatedExample: 'Ele joga no console todos os dias.', order: 6 },
            { word: 'Kopfhörer', translation: 'fone de ouvido', example: 'Gute Kopfhörer kosten viel.', translatedExample: 'Bons fones de ouvido custam caro.', order: 7 },
            { word: 'Drucker', translation: 'impressora', example: 'Der Drucker braucht neue Tinte.', translatedExample: 'A impressora precisa de tinta nova.', order: 8 },
            { word: 'Thermostat', translation: 'termostato', example: 'Ich stelle den Thermostat auf 20 Grad.', translatedExample: 'Eu ajusto o termostato para 20 graus.', order: 9 },
            { word: 'Smartwatch', translation: 'smartwatch', example: 'Meine Smartwatch misst meinen Puls.', translatedExample: 'Meu smartwatch mede meu pulso.', order: 10 },
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
