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

    // Deutsch => Portugiesisch - Kapitel 7: Berufe & Ausbildung
    const chapter = {
      title: 'Berufe & Ausbildung',
      description: 'Berufe, Schule und Arbeitsleben',
      order: 7,
      subchapters: [
        {
          title: 'Berufe I',
          description: 'Wichtige Berufsbilder',
          order: 1,
          vocabulary: [
            { word: 'Arzt', translation: 'médico', example: 'Der Arzt untersucht den Patienten.', translatedExample: 'O médico examina o paciente.', order: 1 },
            { word: 'Lehrerin', translation: 'professora', example: 'Die Lehrerin erklärt die Aufgabe.', translatedExample: 'A professora explica a tarefa.', order: 2 },
            { word: 'Koch', translation: 'cozinheiro', example: 'Der Koch bereitet das Essen zu.', translatedExample: 'O cozinheiro prepara a comida.', order: 3 },
            { word: 'Ingenieur', translation: 'engenheiro', example: 'Der Ingenieur plant das Gebäude.', translatedExample: 'O engenheiro planeja o edifício.', order: 4 },
            { word: 'Kellner', translation: 'garçom', example: 'Der Kellner bringt die Rechnung.', translatedExample: 'O garçom traz a conta.', order: 5 },
            { word: 'Polizist', translation: 'policial', example: 'Der Polizist hilft den Bürgern.', translatedExample: 'O policial ajuda os cidadãos.', order: 6 },
            { word: 'Krankenschwester', translation: 'enfermeira', example: 'Die Krankenschwester pflegt die Patienten.', translatedExample: 'A enfermeira cuida dos pacientes.', order: 7 },
            { word: 'Mechaniker', translation: 'mecânico', example: 'Der Mechaniker repariert das Auto.', translatedExample: 'O mecânico conserta o carro.', order: 8 },
            { word: 'Rechtsanwalt', translation: 'advogado', example: 'Der Rechtsanwalt vertritt seinen Mandanten.', translatedExample: 'O advogado representa seu cliente.', order: 9 },
            { word: 'Architekt', translation: 'arquiteto', example: 'Der Architekt zeichnet die Pläne.', translatedExample: 'O arquiteto desenha os planos.', order: 10 },
          ],
        },
        {
          title: 'Berufe II',
          description: 'Weitere Berufsbilder',
          order: 2,
          vocabulary: [
            { word: 'Journalist', translation: 'jornalista', example: 'Der Journalist schreibt Artikel.', translatedExample: 'O jornalista escreve artigos.', order: 1 },
            { word: 'Musiker', translation: 'músico', example: 'Der Musiker spielt Gitarre.', translatedExample: 'O músico toca violão.', order: 2 },
            { word: 'Pilot', translation: 'piloto', example: 'Der Pilot fliegt das Flugzeug.', translatedExample: 'O piloto voa o avião.', order: 3 },
            { word: 'Wissenschaftler', translation: 'cientista', example: 'Der Wissenschaftler forscht im Labor.', translatedExample: 'O cientista pesquisa no laboratório.', order: 4 },
            { word: 'Künstler', translation: 'artista', example: 'Der Künstler malt Bilder.', translatedExample: 'O artista pinta quadros.', order: 5 },
            { word: 'Psychologe', translation: 'psicólogo', example: 'Der Psychologe hört seinem Patienten zu.', translatedExample: 'O psicólogo ouve seu paciente.', order: 6 },
            { word: 'Apotheker', translation: 'farmacêutico', example: 'Der Apotheker gibt die Medizin aus.', translatedExample: 'O farmacêutico entrega o remédio.', order: 7 },
            { word: 'Elektriker', translation: 'eletricista', example: 'Der Elektriker repariert die Leitung.', translatedExample: 'O eletricista conserta a fiação.', order: 8 },
            { word: 'Manager', translation: 'gerente', example: 'Der Manager leitet das Team.', translatedExample: 'O gerente lidera a equipe.', order: 9 },
            { word: 'Programmierer', translation: 'programador', example: 'Der Programmierer schreibt Code.', translatedExample: 'O programador escreve código.', order: 10 },
          ],
        },
        {
          title: 'Schule & Bildung',
          description: 'Der schulische Alltag',
          order: 3,
          vocabulary: [
            { word: 'Klasse', translation: 'turma/série', example: 'Ich bin in der fünften Klasse.', translatedExample: 'Estou no quinto ano.', order: 1 },
            { word: 'Prüfung', translation: 'prova/exame', example: 'Die Prüfung war schwer.', translatedExample: 'A prova foi difícil.', order: 2 },
            { word: 'Hausaufgaben', translation: 'lição de casa', example: 'Hast du deine Hausaufgaben gemacht?', translatedExample: 'Você fez a lição de casa?', order: 3 },
            { word: 'Pause', translation: 'recreio/intervalo', example: 'In der Pause spielen wir draußen.', translatedExample: 'No recreio brincamos lá fora.', order: 4 },
            { word: 'Zeugnis', translation: 'boletim escolar', example: 'Mein Zeugnis ist gut.', translatedExample: 'Meu boletim é bom.', order: 5 },
            { word: 'Schüler', translation: 'aluno', example: 'Die Schüler lernen fleißig.', translatedExample: 'Os alunos estudam com dedicação.', order: 6 },
            { word: 'Note', translation: 'nota', example: 'Ich habe eine gute Note bekommen.', translatedExample: 'Eu recebi uma boa nota.', order: 7 },
            { word: 'Stundenplan', translation: 'grade horária', example: 'Mein Stundenplan ist voll.', translatedExample: 'Minha grade horária está cheia.', order: 8 },
            { word: 'Fach', translation: 'disciplina/matéria', example: 'Mein Lieblingsfach ist Mathematik.', translatedExample: 'Minha disciplina favorita é matemática.', order: 9 },
            { word: 'Tafel', translation: 'lousa/quadro-negro', example: 'Die Lehrerin schreibt an die Tafel.', translatedExample: 'A professora escreve na lousa.', order: 10 },
          ],
        },
        {
          title: 'Universität',
          description: 'Das Studium und Hochschulleben',
          order: 4,
          vocabulary: [
            { word: 'Student', translation: 'estudante universitário', example: 'Ich bin Student im ersten Semester.', translatedExample: 'Sou estudante no primeiro semestre.', order: 1 },
            { word: 'Vorlesung', translation: 'aula/palestra', example: 'Die Vorlesung beginnt um neun Uhr.', translatedExample: 'A aula começa às nove horas.', order: 2 },
            { word: 'Seminar', translation: 'seminário', example: 'Das Seminar dauert zwei Stunden.', translatedExample: 'O seminário dura duas horas.', order: 3 },
            { word: 'Bibliothek', translation: 'biblioteca', example: 'Ich lerne in der Bibliothek.', translatedExample: 'Eu estudo na biblioteca.', order: 4 },
            { word: 'Studiengang', translation: 'curso universitário', example: 'Ich studiere Informatik.', translatedExample: 'Eu faço o curso de informática.', order: 5 },
            { word: 'Abschluss', translation: 'diploma/conclusão', example: 'Ich mache meinen Abschluss dieses Jahr.', translatedExample: 'Eu concluo meu curso este ano.', order: 6 },
            { word: 'Professor', translation: 'professor universitário', example: 'Der Professor erklärt die Theorie.', translatedExample: 'O professor explica a teoria.', order: 7 },
            { word: 'Campus', translation: 'campus', example: 'Der Campus ist sehr groß.', translatedExample: 'O campus é muito grande.', order: 8 },
            { word: 'Stipendium', translation: 'bolsa de estudos', example: 'Ich habe ein Stipendium bekommen.', translatedExample: 'Eu recebi uma bolsa de estudos.', order: 9 },
            { word: 'Praktikum', translation: 'estágio', example: 'Ich mache ein Praktikum im Sommer.', translatedExample: 'Eu faço um estágio no verão.', order: 10 },
          ],
        },
        {
          title: 'Arbeitsplatz',
          description: 'Der Alltag im Büro',
          order: 5,
          vocabulary: [
            { word: 'Chef', translation: 'chefe', example: 'Mein Chef ist sehr streng.', translatedExample: 'Meu chefe é muito rigoroso.', order: 1 },
            { word: 'Kollege', translation: 'colega de trabalho', example: 'Meine Kollegen sind nett.', translatedExample: 'Meus colegas de trabalho são legais.', order: 2 },
            { word: 'Besprechung', translation: 'reunião', example: 'Wir haben um zehn Uhr eine Besprechung.', translatedExample: 'Temos uma reunião às dez horas.', order: 3 },
            { word: 'Gehalt', translation: 'salário', example: 'Mein Gehalt wird nächsten Monat erhöht.', translatedExample: 'Meu salário será aumentado no próximo mês.', order: 4 },
            { word: 'Büro', translation: 'escritório', example: 'Ich arbeite im Büro.', translatedExample: 'Eu trabalho no escritório.', order: 5 },
            { word: 'Vertrag', translation: 'contrato', example: 'Ich habe einen neuen Vertrag unterschrieben.', translatedExample: 'Eu assinei um novo contrato.', order: 6 },
            { word: 'Bewerbung', translation: 'candidatura/inscrição', example: 'Ich habe eine Bewerbung geschickt.', translatedExample: 'Eu enviei uma candidatura.', order: 7 },
            { word: 'Überstunden', translation: 'horas extras', example: 'Ich mache heute Überstunden.', translatedExample: 'Eu faço horas extras hoje.', order: 8 },
            { word: 'Feierabend', translation: 'fim do expediente', example: 'Wann ist dein Feierabend?', translatedExample: 'Quando é o seu fim do expediente?', order: 9 },
            { word: 'Kantine', translation: 'cantina/refeitório', example: 'Wir essen in der Kantine zu Mittag.', translatedExample: 'Almoçamos na cantina.', order: 10 },
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
