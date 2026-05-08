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

    // Portugiesisch => Deutsch - Capítulo 10: Tecnologia & Mídia
    const chapter = {
      title: 'Tecnologia & Mídia',
      description: 'Computadores, internet e mídia',
      order: 10,
      subchapters: [
        {
          title: 'Computador & Internet',
          description: 'Dispositivos digitais e internet',
          order: 1,
          vocabulary: [
            { word: 'notebook', translation: 'Laptop', example: 'Meu notebook é novo.', translatedExample: 'Mein Laptop ist neu.', order: 1 },
            { word: 'tela/monitor', translation: 'Bildschirm', example: 'A tela é muito brilhante.', translatedExample: 'Der Bildschirm ist sehr hell.', order: 2 },
            { word: 'teclado', translation: 'Tastatur', example: 'Meu teclado está quebrado.', translatedExample: 'Meine Tastatur ist kaputt.', order: 3 },
            { word: 'mouse', translation: 'Maus', example: 'O mouse não funciona.', translatedExample: 'Die Maus funktioniert nicht.', order: 4 },
            { word: 'impressora', translation: 'Drucker', example: 'A impressora imprime devagar.', translatedExample: 'Der Drucker druckt langsam.', order: 5 },
            { word: 'baixar/fazer download', translation: 'herunterladen', example: 'Eu baixo o arquivo.', translatedExample: 'Ich lade die Datei herunter.', order: 6 },
            { word: 'enviar/fazer upload', translation: 'hochladen', example: 'Eu envio a foto.', translatedExample: 'Ich lade das Foto hoch.', order: 7 },
            { word: 'senha', translation: 'Passwort', example: 'Não esqueça sua senha.', translatedExample: 'Vergiss dein Passwort nicht.', order: 8 },
            { word: 'Wi-Fi', translation: 'WLAN', example: 'Qual é a senha do Wi-Fi?', translatedExample: 'Wie ist das WLAN-Passwort?', order: 9 },
            { word: 'navegador', translation: 'Browser', example: 'Eu uso um navegador moderno.', translatedExample: 'Ich nutze einen modernen Browser.', order: 10 },
          ],
        },
        {
          title: 'Smartphone & Aplicativos',
          description: 'Celular e aplicativos',
          order: 2,
          vocabulary: [
            { word: 'ligar/telefonar', translation: 'anrufen', example: 'Eu te ligo mais tarde.', translatedExample: 'Ich rufe dich später an.', order: 1 },
            { word: 'mensagem de texto', translation: 'SMS', example: 'Eu escrevo uma mensagem de texto.', translatedExample: 'Ich schreibe eine SMS.', order: 2 },
            { word: 'bateria', translation: 'Akku', example: 'Minha bateria está descarregada.', translatedExample: 'Mein Akku ist leer.', order: 3 },
            { word: 'aplicativo', translation: 'App', example: 'Este aplicativo é muito prático.', translatedExample: 'Diese App ist sehr praktisch.', order: 4 },
            { word: 'câmera', translation: 'Kamera', example: 'A câmera tira boas fotos.', translatedExample: 'Die Kamera macht gute Fotos.', order: 5 },
            { word: 'alto-falante', translation: 'Lautsprecher', example: 'O alto-falante está quebrado.', translatedExample: 'Der Lautsprecher ist kaputt.', order: 6 },
            { word: 'fone de ouvido', translation: 'Kopfhörer', example: 'Eu ouço música com fone de ouvido.', translatedExample: 'Ich höre Musik mit Kopfhörern.', order: 7 },
            { word: 'cabo de carregamento', translation: 'Ladekabel', example: 'Você tem um cabo de carregamento?', translatedExample: 'Hast du ein Ladekabel dabei?', order: 8 },
            { word: 'mensagem de voz', translation: 'Sprachnachricht', example: 'Eu mando uma mensagem de voz.', translatedExample: 'Ich schicke eine Sprachnachricht.', order: 9 },
            { word: 'notificação', translation: 'Benachrichtigung', example: 'Eu recebo muitas notificações.', translatedExample: 'Ich bekomme viele Benachrichtigungen.', order: 10 },
          ],
        },
        {
          title: 'Redes Sociais',
          description: 'Redes sociais e comunicação online',
          order: 3,
          vocabulary: [
            { word: 'perfil', translation: 'Profil', example: 'Eu crio um novo perfil.', translatedExample: 'Ich erstelle ein neues Profil.', order: 1 },
            { word: 'seguidor', translation: 'Follower', example: 'Eu tenho muitos seguidores.', translatedExample: 'Ich habe viele Follower.', order: 2 },
            { word: 'postar/publicar', translation: 'posten', example: 'Eu posto fotos diariamente.', translatedExample: 'Ich poste täglich Fotos.', order: 3 },
            { word: 'compartilhar', translation: 'teilen', example: 'Eu compartilho este artigo.', translatedExample: 'Ich teile diesen Artikel.', order: 4 },
            { word: 'comentar', translation: 'kommentieren', example: 'Ele comenta cada foto.', translatedExample: 'Er kommentiert jedes Foto.', order: 5 },
            { word: 'curtir', translation: 'liken', example: 'Eu curto a sua foto.', translatedExample: 'Ich like dein Foto.', order: 6 },
            { word: 'transmitir ao vivo/fazer stream', translation: 'streamen', example: 'Ela faz stream todo fim de tarde.', translatedExample: 'Sie streamt jeden Abend.', order: 7 },
            { word: 'assinatura', translation: 'Abonnement', example: 'Eu cancelo minha assinatura.', translatedExample: 'Ich kündige mein Abonnement.', order: 8 },
            { word: 'mensagem direta/direct', translation: 'Direktnachricht', example: 'Eu mando uma mensagem direta.', translatedExample: 'Ich schicke eine Direktnachricht.', order: 9 },
            { word: 'hashtag', translation: 'Hashtag', example: 'Use a hashtag certa.', translatedExample: 'Nutze den richtigen Hashtag.', order: 10 },
          ],
        },
        {
          title: 'Notícias & Mídia',
          description: 'Mídia e informações',
          order: 4,
          vocabulary: [
            { word: 'jornal', translation: 'Zeitung', example: 'Eu leio o jornal de manhã.', translatedExample: 'Ich lese die Zeitung morgens.', order: 1 },
            { word: 'notícia/mensagem', translation: 'Nachricht', example: 'Você ouviu as notícias?', translatedExample: 'Hast du die Nachrichten gehört?', order: 2 },
            { word: 'manchete', translation: 'Schlagzeile', example: 'A manchete é assustadora.', translatedExample: 'Die Schlagzeile ist erschreckend.', order: 3 },
            { word: 'reportagem/relatório', translation: 'Bericht', example: 'A reportagem foi muito detalhada.', translatedExample: 'Der Bericht war sehr detailliert.', order: 4 },
            { word: 'entrevista', translation: 'Interview', example: 'A entrevista foi interessante.', translatedExample: 'Das Interview war interessant.', order: 5 },
            { word: 'podcast', translation: 'Podcast', example: 'Eu ouço podcasts diariamente.', translatedExample: 'Ich höre täglich Podcasts.', order: 6 },
            { word: 'programa/transmissão', translation: 'Sendung', example: 'O programa começa às 20 horas.', translatedExample: 'Die Sendung beginnt um 20 Uhr.', order: 7 },
            { word: 'propaganda/publicidade', translation: 'Werbung', example: 'Tem muita publicidade na televisão.', translatedExample: 'Es gibt zu viel Werbung im Fernsehen.', order: 8 },
            { word: 'documentário', translation: 'Dokumentation', example: 'Eu gosto de assistir documentários.', translatedExample: 'Ich schaue gerne Dokumentationen.', order: 9 },
            { word: 'canal', translation: 'Kanal', example: 'Eu sigo este canal no YouTube.', translatedExample: 'Ich folge diesem Kanal auf YouTube.', order: 10 },
          ],
        },
        {
          title: 'Tecnologia no Dia a Dia',
          description: 'Tecnologia no cotidiano',
          order: 5,
          vocabulary: [
            { word: 'controle remoto', translation: 'Fernbedienung', example: 'Onde está o controle remoto?', translatedExample: 'Wo ist die Fernbedienung?', order: 1 },
            { word: 'tomada', translation: 'Steckdose', example: 'A tomada está quebrada.', translatedExample: 'Die Steckdose ist kaputt.', order: 2 },
            { word: 'cabo', translation: 'Kabel', example: 'O cabo é muito curto.', translatedExample: 'Das Kabel ist zu kurz.', order: 3 },
            { word: 'roteador', translation: 'Router', example: 'O roteador precisa ser reiniciado.', translatedExample: 'Der Router muss neu gestartet werden.', order: 4 },
            { word: 'Smart-TV', translation: 'Smart-TV', example: 'Meu Smart-TV tem muitos aplicativos.', translatedExample: 'Mein Smart-TV hat viele Apps.', order: 5 },
            { word: 'console de videogame', translation: 'Spielkonsole', example: 'Ele joga no console todos os dias.', translatedExample: 'Er spielt täglich auf der Spielkonsole.', order: 6 },
            { word: 'fone de ouvido', translation: 'Kopfhörer', example: 'Bons fones de ouvido custam caro.', translatedExample: 'Gute Kopfhörer kosten viel.', order: 7 },
            { word: 'impressora', translation: 'Drucker', example: 'A impressora precisa de tinta nova.', translatedExample: 'Der Drucker braucht neue Tinte.', order: 8 },
            { word: 'termostato', translation: 'Thermostat', example: 'Eu ajusto o termostato para 20 graus.', translatedExample: 'Ich stelle den Thermostat auf 20 Grad.', order: 9 },
            { word: 'smartwatch', translation: 'Smartwatch', example: 'Meu smartwatch mede meu pulso.', translatedExample: 'Meine Smartwatch misst meinen Puls.', order: 10 },
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
