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

    // Portugiesisch => Deutsch - Capítulo 7: Profissões & Educação
    const chapter = {
      title: 'Profissões & Educação',
      description: 'Profissões, escola e trabalho',
      order: 7,
      subchapters: [
        {
          title: 'Profissões I',
          description: 'Profissões importantes',
          order: 1,
          vocabulary: [
            { word: 'médico', translation: 'Arzt', example: 'O médico examina o paciente.', translatedExample: 'Der Arzt untersucht den Patienten.', order: 1 },
            { word: 'professora', translation: 'Lehrerin', example: 'A professora explica a tarefa.', translatedExample: 'Die Lehrerin erklärt die Aufgabe.', order: 2 },
            { word: 'cozinheiro', translation: 'Koch', example: 'O cozinheiro prepara a comida.', translatedExample: 'Der Koch bereitet das Essen zu.', order: 3 },
            { word: 'engenheiro', translation: 'Ingenieur', example: 'O engenheiro planeja o edifício.', translatedExample: 'Der Ingenieur plant das Gebäude.', order: 4 },
            { word: 'garçom', translation: 'Kellner', example: 'O garçom traz a conta.', translatedExample: 'Der Kellner bringt die Rechnung.', order: 5 },
            { word: 'policial', translation: 'Polizist', example: 'O policial ajuda os cidadãos.', translatedExample: 'Der Polizist hilft den Bürgern.', order: 6 },
            { word: 'enfermeira', translation: 'Krankenschwester', example: 'A enfermeira cuida dos pacientes.', translatedExample: 'Die Krankenschwester pflegt die Patienten.', order: 7 },
            { word: 'mecânico', translation: 'Mechaniker', example: 'O mecânico conserta o carro.', translatedExample: 'Der Mechaniker repariert das Auto.', order: 8 },
            { word: 'advogado', translation: 'Rechtsanwalt', example: 'O advogado representa seu cliente.', translatedExample: 'Der Rechtsanwalt vertritt seinen Mandanten.', order: 9 },
            { word: 'arquiteto', translation: 'Architekt', example: 'O arquiteto desenha os planos.', translatedExample: 'Der Architekt zeichnet die Pläne.', order: 10 },
          ],
        },
        {
          title: 'Profissões II',
          description: 'Mais profissões',
          order: 2,
          vocabulary: [
            { word: 'jornalista', translation: 'Journalist', example: 'O jornalista escreve artigos.', translatedExample: 'Der Journalist schreibt Artikel.', order: 1 },
            { word: 'músico', translation: 'Musiker', example: 'O músico toca violão.', translatedExample: 'Der Musiker spielt Gitarre.', order: 2 },
            { word: 'piloto', translation: 'Pilot', example: 'O piloto voa o avião.', translatedExample: 'Der Pilot fliegt das Flugzeug.', order: 3 },
            { word: 'cientista', translation: 'Wissenschaftler', example: 'O cientista pesquisa no laboratório.', translatedExample: 'Der Wissenschaftler forscht im Labor.', order: 4 },
            { word: 'artista', translation: 'Künstler', example: 'O artista pinta quadros.', translatedExample: 'Der Künstler malt Bilder.', order: 5 },
            { word: 'psicólogo', translation: 'Psychologe', example: 'O psicólogo ouve seu paciente.', translatedExample: 'Der Psychologe hört seinem Patienten zu.', order: 6 },
            { word: 'farmacêutico', translation: 'Apotheker', example: 'O farmacêutico entrega o remédio.', translatedExample: 'Der Apotheker gibt die Medizin aus.', order: 7 },
            { word: 'eletricista', translation: 'Elektriker', example: 'O eletricista conserta a fiação.', translatedExample: 'Der Elektriker repariert die Leitung.', order: 8 },
            { word: 'gerente', translation: 'Manager', example: 'O gerente lidera a equipe.', translatedExample: 'Der Manager leitet das Team.', order: 9 },
            { word: 'programador', translation: 'Programmierer', example: 'O programador escreve código.', translatedExample: 'Der Programmierer schreibt Code.', order: 10 },
          ],
        },
        {
          title: 'Escola & Educação',
          description: 'O cotidiano escolar',
          order: 3,
          vocabulary: [
            { word: 'turma/série', translation: 'Klasse', example: 'Estou no quinto ano.', translatedExample: 'Ich bin in der fünften Klasse.', order: 1 },
            { word: 'prova/exame', translation: 'Prüfung', example: 'A prova foi difícil.', translatedExample: 'Die Prüfung war schwer.', order: 2 },
            { word: 'lição de casa', translation: 'Hausaufgaben', example: 'Você fez a lição de casa?', translatedExample: 'Hast du deine Hausaufgaben gemacht?', order: 3 },
            { word: 'recreio/intervalo', translation: 'Pause', example: 'No recreio brincamos lá fora.', translatedExample: 'In der Pause spielen wir draußen.', order: 4 },
            { word: 'boletim escolar', translation: 'Zeugnis', example: 'Meu boletim é bom.', translatedExample: 'Mein Zeugnis ist gut.', order: 5 },
            { word: 'aluno', translation: 'Schüler', example: 'Os alunos estudam com dedicação.', translatedExample: 'Die Schüler lernen fleißig.', order: 6 },
            { word: 'nota', translation: 'Note', example: 'Eu recebi uma boa nota.', translatedExample: 'Ich habe eine gute Note bekommen.', order: 7 },
            { word: 'grade horária', translation: 'Stundenplan', example: 'Minha grade horária está cheia.', translatedExample: 'Mein Stundenplan ist voll.', order: 8 },
            { word: 'disciplina/matéria', translation: 'Fach', example: 'Minha disciplina favorita é matemática.', translatedExample: 'Mein Lieblingsfach ist Mathematik.', order: 9 },
            { word: 'lousa/quadro-negro', translation: 'Tafel', example: 'A professora escreve na lousa.', translatedExample: 'Die Lehrerin schreibt an die Tafel.', order: 10 },
          ],
        },
        {
          title: 'Universidade',
          description: 'A vida universitária',
          order: 4,
          vocabulary: [
            { word: 'estudante universitário', translation: 'Student', example: 'Sou estudante no primeiro semestre.', translatedExample: 'Ich bin Student im ersten Semester.', order: 1 },
            { word: 'aula/palestra', translation: 'Vorlesung', example: 'A aula começa às nove horas.', translatedExample: 'Die Vorlesung beginnt um neun Uhr.', order: 2 },
            { word: 'seminário', translation: 'Seminar', example: 'O seminário dura duas horas.', translatedExample: 'Das Seminar dauert zwei Stunden.', order: 3 },
            { word: 'biblioteca', translation: 'Bibliothek', example: 'Eu estudo na biblioteca.', translatedExample: 'Ich lerne in der Bibliothek.', order: 4 },
            { word: 'curso universitário', translation: 'Studiengang', example: 'Eu faço o curso de informática.', translatedExample: 'Ich studiere Informatik.', order: 5 },
            { word: 'diploma/conclusão', translation: 'Abschluss', example: 'Eu concluo meu curso este ano.', translatedExample: 'Ich mache meinen Abschluss dieses Jahr.', order: 6 },
            { word: 'professor universitário', translation: 'Professor', example: 'O professor explica a teoria.', translatedExample: 'Der Professor erklärt die Theorie.', order: 7 },
            { word: 'campus', translation: 'Campus', example: 'O campus é muito grande.', translatedExample: 'Der Campus ist sehr groß.', order: 8 },
            { word: 'bolsa de estudos', translation: 'Stipendium', example: 'Eu recebi uma bolsa de estudos.', translatedExample: 'Ich habe ein Stipendium bekommen.', order: 9 },
            { word: 'estágio', translation: 'Praktikum', example: 'Eu faço um estágio no verão.', translatedExample: 'Ich mache ein Praktikum im Sommer.', order: 10 },
          ],
        },
        {
          title: 'Local de Trabalho',
          description: 'O cotidiano no trabalho',
          order: 5,
          vocabulary: [
            { word: 'chefe', translation: 'Chef', example: 'Meu chefe é muito rigoroso.', translatedExample: 'Mein Chef ist sehr streng.', order: 1 },
            { word: 'colega de trabalho', translation: 'Kollege', example: 'Meus colegas de trabalho são legais.', translatedExample: 'Meine Kollegen sind nett.', order: 2 },
            { word: 'reunião', translation: 'Besprechung', example: 'Temos uma reunião às dez horas.', translatedExample: 'Wir haben um zehn Uhr eine Besprechung.', order: 3 },
            { word: 'salário', translation: 'Gehalt', example: 'Meu salário será aumentado no próximo mês.', translatedExample: 'Mein Gehalt wird nächsten Monat erhöht.', order: 4 },
            { word: 'escritório', translation: 'Büro', example: 'Eu trabalho no escritório.', translatedExample: 'Ich arbeite im Büro.', order: 5 },
            { word: 'contrato', translation: 'Vertrag', example: 'Eu assinei um novo contrato.', translatedExample: 'Ich habe einen neuen Vertrag unterschrieben.', order: 6 },
            { word: 'candidatura/inscrição', translation: 'Bewerbung', example: 'Eu enviei uma candidatura.', translatedExample: 'Ich habe eine Bewerbung geschickt.', order: 7 },
            { word: 'horas extras', translation: 'Überstunden', example: 'Eu faço horas extras hoje.', translatedExample: 'Ich mache heute Überstunden.', order: 8 },
            { word: 'fim do expediente', translation: 'Feierabend', example: 'Quando é o seu fim do expediente?', translatedExample: 'Wann ist dein Feierabend?', order: 9 },
            { word: 'cantina/refeitório', translation: 'Kantine', example: 'Almoçamos na cantina.', translatedExample: 'Wir essen in der Kantine zu Mittag.', order: 10 },
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
