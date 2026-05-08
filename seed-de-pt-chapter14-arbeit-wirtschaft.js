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

    // Deutsch => Portugiesisch - Kapitel 14: Arbeit & Wirtschaft
    const chapter = {
      title: 'Arbeit & Wirtschaft',
      description: 'Arbeit, Karriere und Wirtschaft',
      order: 14,
      subchapters: [
        {
          title: 'Bewerbung',
          description: 'Bewerbungsprozess und Karriere',
          order: 1,
          vocabulary: [
            { word: 'Lebenslauf', translation: 'currículo', example: 'Ich schreibe meinen Lebenslauf.', translatedExample: 'Eu escrevo meu currículo.', order: 1 },
            { word: 'Vorstellungsgespräch', translation: 'entrevista de emprego', example: 'Das Vorstellungsgespräch war schwierig.', translatedExample: 'A entrevista de emprego foi difícil.', order: 2 },
            { word: 'Bewerbungsschreiben', translation: 'carta de apresentação', example: 'Ich schicke mein Bewerbungsschreiben ab.', translatedExample: 'Eu envio minha carta de apresentação.', order: 3 },
            { word: 'Qualifikation', translation: 'qualificação', example: 'Diese Stelle erfordert hohe Qualifikationen.', translatedExample: 'Esta vaga exige altas qualificações.', order: 4 },
            { word: 'Erfahrung', translation: 'experiência', example: 'Ich habe viel Erfahrung in diesem Bereich.', translatedExample: 'Tenho muita experiência nessa área.', order: 5 },
            { word: 'Referenz', translation: 'referência/carta de recomendação', example: 'Kann ich Sie als Referenz angeben?', translatedExample: 'Posso indicá-lo como referência?', order: 6 },
            { word: 'Fähigkeit', translation: 'habilidade/competência', example: 'Teamarbeit ist eine wichtige Fähigkeit.', translatedExample: 'Trabalho em equipe é uma habilidade importante.', order: 7 },
            { word: 'Einstellung', translation: 'contratação', example: 'Die Einstellung beginnt nächsten Monat.', translatedExample: 'A contratação começa no próximo mês.', order: 8 },
            { word: 'Probezeit', translation: 'período de experiência', example: 'Ich bin noch in der Probezeit.', translatedExample: 'Ainda estou no período de experiência.', order: 9 },
            { word: 'Stelle', translation: 'vaga/cargo', example: 'Ich bewerbe mich auf diese Stelle.', translatedExample: 'Me candidato a esta vaga.', order: 10 },
          ],
        },
        {
          title: 'Im Job',
          description: 'Der Arbeitsalltag',
          order: 2,
          vocabulary: [
            { word: 'Gehaltserhöhung', translation: 'aumento de salário', example: 'Ich möchte eine Gehaltserhöhung bekommen.', translatedExample: 'Quero receber um aumento de salário.', order: 1 },
            { word: 'Beförderung', translation: 'promoção', example: 'Er hat eine Beförderung bekommen.', translatedExample: 'Ele foi promovido.', order: 2 },
            { word: 'Kündigung', translation: 'demissão/rescisão', example: 'Er hat seine Kündigung bekommen.', translatedExample: 'Ele recebeu sua demissão.', order: 3 },
            { word: 'Urlaub', translation: 'férias', example: 'Ich nehme nächsten Monat Urlaub.', translatedExample: 'Tiro férias no próximo mês.', order: 4 },
            { word: 'Krankmeldung', translation: 'atestado médico', example: 'Ich reiche meine Krankmeldung ein.', translatedExample: 'Eu entrego meu atestado médico.', order: 5 },
            { word: 'Team', translation: 'equipe', example: 'Unser Team ist sehr gut.', translatedExample: 'Nossa equipe é muito boa.', order: 6 },
            { word: 'Projekt', translation: 'projeto', example: 'Das Projekt ist fast fertig.', translatedExample: 'O projeto está quase pronto.', order: 7 },
            { word: 'Deadline', translation: 'prazo/deadline', example: 'Die Deadline ist morgen.', translatedExample: 'O prazo é amanhã.', order: 8 },
            { word: 'Präsentation', translation: 'apresentação', example: 'Ich halte eine Präsentation.', translatedExample: 'Eu faço uma apresentação.', order: 9 },
            { word: 'Feedback', translation: 'feedback/retorno', example: 'Ich brauche dein Feedback.', translatedExample: 'Preciso do seu feedback.', order: 10 },
          ],
        },
        {
          title: 'Wirtschaft & Markt',
          description: 'Wirtschaft und Markt',
          order: 3,
          vocabulary: [
            { word: 'Firma', translation: 'empresa/firma', example: 'Ich arbeite für eine große Firma.', translatedExample: 'Trabalho para uma grande empresa.', order: 1 },
            { word: 'Markt', translation: 'mercado', example: 'Der Markt ist sehr wettbewerbsintensiv.', translatedExample: 'O mercado é muito competitivo.', order: 2 },
            { word: 'Konkurrenz', translation: 'concorrência', example: 'Die Konkurrenz ist groß.', translatedExample: 'A concorrência é grande.', order: 3 },
            { word: 'Angebot', translation: 'oferta', example: 'Das Angebot ist gut.', translatedExample: 'A oferta é boa.', order: 4 },
            { word: 'Nachfrage', translation: 'demanda/procura', example: 'Die Nachfrage nach IT-Fachkräften ist hoch.', translatedExample: 'A demanda por profissionais de TI é alta.', order: 5 },
            { word: 'Gewinn', translation: 'lucro', example: 'Das Unternehmen macht großen Gewinn.', translatedExample: 'A empresa tem grande lucro.', order: 6 },
            { word: 'Verlust', translation: 'prejuízo/perda', example: 'Das Unternehmen hat einen Verlust gemacht.', translatedExample: 'A empresa teve prejuízo.', order: 7 },
            { word: 'Investition', translation: 'investimento', example: 'Wir brauchen neue Investitionen.', translatedExample: 'Precisamos de novos investimentos.', order: 8 },
            { word: 'Aktie', translation: 'ação (financeira)', example: 'Ich kaufe Aktien an der Börse.', translatedExample: 'Eu compro ações na bolsa.', order: 9 },
            { word: 'Krise', translation: 'crise', example: 'Die Wirtschaftskrise hat viele getroffen.', translatedExample: 'A crise econômica afetou muitos.', order: 10 },
          ],
        },
        {
          title: 'Finanzen & Steuern',
          description: 'Finanzen und Steuern',
          order: 4,
          vocabulary: [
            { word: 'Steuer', translation: 'imposto', example: 'Ich zahle hohe Steuern.', translatedExample: 'Pago impostos altos.', order: 1 },
            { word: 'Versicherung', translation: 'seguro', example: 'Ich habe eine Krankenversicherung.', translatedExample: 'Eu tenho um seguro saúde.', order: 2 },
            { word: 'Kredit', translation: 'crédito/empréstimo', example: 'Ich nehme einen Kredit auf.', translatedExample: 'Eu faço um empréstimo.', order: 3 },
            { word: 'Schulden', translation: 'dívidas', example: 'Ich habe keine Schulden.', translatedExample: 'Eu não tenho dívidas.', order: 4 },
            { word: 'Budget', translation: 'orçamento', example: 'Wir müssen das Budget einhalten.', translatedExample: 'Precisamos cumprir o orçamento.', order: 5 },
            { word: 'Sparkonto', translation: 'conta poupança', example: 'Ich spare Geld auf meinem Sparkonto.', translatedExample: 'Eu poupe dinheiro na conta poupança.', order: 6 },
            { word: 'Rente', translation: 'aposentadoria/pensão', example: 'Ich zahle in die Rentenversicherung ein.', translatedExample: 'Eu contribuo para a previdência.', order: 7 },
            { word: 'Zinsen', translation: 'juros', example: 'Die Zinsen sind derzeit niedrig.', translatedExample: 'Os juros estão baixos no momento.', order: 8 },
            { word: 'Prämie', translation: 'prêmio/bônus', example: 'Ich bekomme eine Jahresprämie.', translatedExample: 'Eu recebo um bônus anual.', order: 9 },
            { word: 'Steuererklärung', translation: 'declaração de imposto de renda', example: 'Ich mache meine Steuererklärung im April.', translatedExample: 'Faço minha declaração de IR em abril.', order: 10 },
          ],
        },
        {
          title: 'Globalisierung & Digitalisierung',
          description: 'Globalisierung und digitale Wirtschaft',
          order: 5,
          vocabulary: [
            { word: 'Export', translation: 'exportação', example: 'Deutschland exportiert viele Autos.', translatedExample: 'A Alemanha exporta muitos carros.', order: 1 },
            { word: 'Import', translation: 'importação', example: 'Brasilien importiert Maschinen.', translatedExample: 'O Brasil importa máquinas.', order: 2 },
            { word: 'multinational', translation: 'multinacional', example: 'Ich arbeite für ein multinationales Unternehmen.', translatedExample: 'Trabalho para uma empresa multinacional.', order: 3 },
            { word: 'Handelspartner', translation: 'parceiro comercial', example: 'Deutschland ist ein wichtiger Handelspartner.', translatedExample: 'A Alemanha é um importante parceiro comercial.', order: 4 },
            { word: 'Lieferkette', translation: 'cadeia de fornecimento', example: 'Die Lieferkette wurde unterbrochen.', translatedExample: 'A cadeia de fornecimento foi interrompida.', order: 5 },
            { word: 'Outsourcing', translation: 'terceirização/outsourcing', example: 'Das Unternehmen nutzt Outsourcing.', translatedExample: 'A empresa usa terceirização.', order: 6 },
            { word: 'Fachkraft', translation: 'profissional especializado', example: 'Wir brauchen mehr Fachkräfte.', translatedExample: 'Precisamos de mais profissionais especializados.', order: 7 },
            { word: 'Homeoffice', translation: 'home office/trabalho remoto', example: 'Ich arbeite drei Tage im Homeoffice.', translatedExample: 'Trabalho três dias em home office.', order: 8 },
            { word: 'Digitalisierung', translation: 'digitalização', example: 'Die Digitalisierung verändert die Arbeitswelt.', translatedExample: 'A digitalização transforma o mundo do trabalho.', order: 9 },
            { word: 'Innovation', translation: 'inovação', example: 'Innovation ist der Schlüssel zum Erfolg.', translatedExample: 'A inovação é a chave para o sucesso.', order: 10 },
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
