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

// Deutsch => Portugiesisch (DE -> PT-BR)
const deToPortugueseContent = [
  {
    title: 'Grundlagen',
    description: 'Lerne die wichtigsten Grundlagen der portugiesischen Sprache',
    order: 1,
    subchapters: [
      {
        title: 'Begrüßungen',
        description: 'Grundlegende Begrüßungen und Verabschiedungen',
        order: 1,
        vocabulary: [
          { word: 'Hallo', translation: 'Olá', example: 'Hallo, wie geht es dir?', translatedExample: 'Olá, como você está?', order: 1 },
          { word: 'Guten Morgen', translation: 'Bom dia', example: 'Guten Morgen! Hast du gut geschlafen?', translatedExample: 'Bom dia! Você dormiu bem?', order: 2 },
          { word: 'Guten Tag', translation: 'Boa tarde', example: 'Guten Tag, schönes Wetter heute.', translatedExample: 'Boa tarde, tempo bonito hoje.', order: 3 },
          { word: 'Guten Abend', translation: 'Boa noite', example: 'Guten Abend, angenehmen Aufenthalt!', translatedExample: 'Boa noite, aproveite sua estadia!', order: 4 },
          { word: 'Tschüss', translation: 'Tchau', example: 'Tschüss, bis morgen!', translatedExample: 'Tchau, até amanhã!', order: 5 },
          { word: 'Auf Wiedersehen', translation: 'Até logo', example: 'Auf Wiedersehen, schönen Tag noch!', translatedExample: 'Até logo, tenha um bom dia!', order: 6 },
          { word: 'Danke', translation: 'Obrigado', example: 'Danke für deine Hilfe!', translatedExample: 'Obrigado pela sua ajuda!', order: 7 },
          { word: 'Bitte', translation: 'Por favor', example: 'Bitte gib mir das Salz.', translatedExample: 'Por favor, me dê o sal.', order: 8 },
          { word: 'Entschuldigung', translation: 'Desculpe', example: 'Entschuldigung, ich habe mich verspätet.', translatedExample: 'Desculpe, eu me atrasei.', order: 9 },
          { word: 'Ja', translation: 'Sim', example: 'Ja, ich verstehe.', translatedExample: 'Sim, eu entendo.', order: 10 },
        ],
      },
      {
        title: 'Familie',
        description: 'Familienmitglieder und Verwandtschaft',
        order: 2,
        vocabulary: [
          { word: 'Familie', translation: 'Família', example: 'Meine Familie ist sehr groß.', translatedExample: 'Minha família é muito grande.', order: 1 },
          { word: 'Mutter', translation: 'Mãe', example: 'Meine Mutter kocht sehr gut.', translatedExample: 'Minha mãe cozinha muito bem.', order: 2 },
          { word: 'Vater', translation: 'Pai', example: 'Mein Vater arbeitet als Lehrer.', translatedExample: 'Meu pai trabalha como professor.', order: 3 },
          { word: 'Bruder', translation: 'Irmão', example: 'Mein Bruder spielt Fußball.', translatedExample: 'Meu irmão joga futebol.', order: 4 },
          { word: 'Schwester', translation: 'Irmã', example: 'Meine Schwester studiert Medizin.', translatedExample: 'Minha irmã estuda medicina.', order: 5 },
          { word: 'Großmutter', translation: 'Avó', example: 'Meine Großmutter erzählt tolle Geschichten.', translatedExample: 'Minha avó conta histórias legais.', order: 6 },
          { word: 'Großvater', translation: 'Avô', example: 'Mein Großvater liebt seinen Garten.', translatedExample: 'Meu avô ama seu jardim.', order: 7 },
          { word: 'Sohn', translation: 'Filho', example: 'Der Sohn ist fünf Jahre alt.', translatedExample: 'O filho tem cinco anos.', order: 8 },
          { word: 'Tochter', translation: 'Filha', example: 'Ihre Tochter geht in die Schule.', translatedExample: 'A filha dela vai à escola.', order: 9 },
          { word: 'Eltern', translation: 'Pais', example: 'Meine Eltern wohnen in Berlin.', translatedExample: 'Meus pais moram em Berlim.', order: 10 },
        ],
      },
      {
        title: 'Zahlen',
        description: 'Zahlen von 1 bis 10',
        order: 3,
        vocabulary: [
          { word: 'Eins', translation: 'Um', example: 'Ich habe ein Kind.', translatedExample: 'Eu tenho um filho.', order: 1 },
          { word: 'Zwei', translation: 'Dois', example: 'Ich habe zwei Brüder.', translatedExample: 'Eu tenho dois irmãos.', order: 2 },
          { word: 'Drei', translation: 'Três', example: 'Es sind drei Äpfel im Korb.', translatedExample: 'Há três maçãs na cesta.', order: 3 },
          { word: 'Vier', translation: 'Quatro', example: 'Der Tisch hat vier Beine.', translatedExample: 'A mesa tem quatro pernas.', order: 4 },
          { word: 'Fünf', translation: 'Cinco', example: 'Ich komme um fünf Uhr.', translatedExample: 'Eu venho às cinco horas.', order: 5 },
          { word: 'Sechs', translation: 'Seis', example: 'Das Baby ist sechs Monate alt.', translatedExample: 'O bebê tem seis meses.', order: 6 },
          { word: 'Sieben', translation: 'Sete', example: 'Die Woche hat sieben Tage.', translatedExample: 'A semana tem sete dias.', order: 7 },
          { word: 'Acht', translation: 'Oito', example: 'Ich stehe um acht Uhr auf.', translatedExample: 'Eu acordo às oito horas.', order: 8 },
          { word: 'Neun', translation: 'Nove', example: 'Der Kurs beginnt um neun.', translatedExample: 'O curso começa às nove.', order: 9 },
          { word: 'Zehn', translation: 'Dez', example: 'Ich habe zehn Finger.', translatedExample: 'Eu tenho dez dedos.', order: 10 },
        ],
      },
      {
        title: 'Farben',
        description: 'Die wichtigsten Farben',
        order: 4,
        vocabulary: [
          { word: 'Rot', translation: 'Vermelho', example: 'Die Rose ist rot.', translatedExample: 'A rosa é vermelha.', order: 1 },
          { word: 'Blau', translation: 'Azul', example: 'Der Himmel ist blau.', translatedExample: 'O céu é azul.', order: 2 },
          { word: 'Grün', translation: 'Verde', example: 'Das Gras ist grün.', translatedExample: 'A grama é verde.', order: 3 },
          { word: 'Gelb', translation: 'Amarelo', example: 'Die Banane ist gelb.', translatedExample: 'A banana é amarela.', order: 4 },
          { word: 'Schwarz', translation: 'Preto', example: 'Mein Auto ist schwarz.', translatedExample: 'Meu carro é preto.', order: 5 },
          { word: 'Weiß', translation: 'Branco', example: 'Die Wand ist weiß.', translatedExample: 'A parede é branca.', order: 6 },
          { word: 'Orange', translation: 'Laranja', example: 'Die Orange ist orange.', translatedExample: 'A laranja é laranja.', order: 7 },
          { word: 'Rosa', translation: 'Rosa', example: 'Ihr Kleid ist rosa.', translatedExample: 'O vestido dela é rosa.', order: 8 },
          { word: 'Braun', translation: 'Marrom', example: 'Der Tisch ist braun.', translatedExample: 'A mesa é marrom.', order: 9 },
          { word: 'Grau', translation: 'Cinza', example: 'Die Wolken sind grau.', translatedExample: 'As nuvens são cinzas.', order: 10 },
        ],
      },
      {
        title: 'Wochentage',
        description: 'Die sieben Tage der Woche',
        order: 5,
        vocabulary: [
          { word: 'Montag', translation: 'Segunda-feira', example: 'Am Montag beginnt die Woche.', translatedExample: 'Na segunda-feira começa a semana.', order: 1 },
          { word: 'Dienstag', translation: 'Terça-feira', example: 'Am Dienstag habe ich einen Termin.', translatedExample: 'Na terça-feira eu tenho um compromisso.', order: 2 },
          { word: 'Mittwoch', translation: 'Quarta-feira', example: 'Mittwoch ist mitte der Woche.', translatedExample: 'Quarta-feira é meio da semana.', order: 3 },
          { word: 'Donnerstag', translation: 'Quinta-feira', example: 'Am Donnerstag gehe ich einkaufen.', translatedExample: 'Na quinta-feira eu vou às compras.', order: 4 },
          { word: 'Freitag', translation: 'Sexta-feira', example: 'Freitag ist mein Lieblingstag.', translatedExample: 'Sexta-feira é meu dia favorito.', order: 5 },
          { word: 'Samstag', translation: 'Sábado', example: 'Am Samstag schlafe ich lange.', translatedExample: 'No sábado eu durmo até tarde.', order: 6 },
          { word: 'Sonntag', translation: 'Domingo', example: 'Am Sonntag besuche ich meine Familie.', translatedExample: 'No domingo eu visito minha família.', order: 7 },
          { word: 'Heute', translation: 'Hoje', example: 'Heute ist ein schöner Tag.', translatedExample: 'Hoje é um dia bonito.', order: 8 },
          { word: 'Morgen', translation: 'Amanhã', example: 'Morgen fahre ich nach Berlin.', translatedExample: 'Amanhã eu vou para Berlim.', order: 9 },
          { word: 'Gestern', translation: 'Ontem', example: 'Gestern war Sonntag.', translatedExample: 'Ontem foi domingo.', order: 10 },
        ],
      },
    ],
  },
  {
    title: 'Alltag',
    description: 'Vokabeln für den täglichen Gebrauch',
    order: 2,
    subchapters: [
      {
        title: 'Essen',
        description: 'Häufige Lebensmittel und Speisen',
        order: 1,
        vocabulary: [
          { word: 'Brot', translation: 'Pão', example: 'Ich esse gerne Brot zum Frühstück.', translatedExample: 'Eu gosto de comer pão no café da manhã.', order: 1 },
          { word: 'Wasser', translation: 'Água', example: 'Ich trinke viel Wasser.', translatedExample: 'Eu bebo muita água.', order: 2 },
          { word: 'Fleisch', translation: 'Carne', example: 'Das Fleisch ist zart.', translatedExample: 'A carne está macia.', order: 3 },
          { word: 'Fisch', translation: 'Peixe', example: 'Fisch ist sehr gesund.', translatedExample: 'Peixe é muito saudável.', order: 4 },
          { word: 'Gemüse', translation: 'Legumes', example: 'Ich esse jeden Tag Gemüse.', translatedExample: 'Eu como legumes todos os dias.', order: 5 },
          { word: 'Obst', translation: 'Frutas', example: 'Obst ist lecker und gesund.', translatedExample: 'Frutas são gostosas e saudáveis.', order: 6 },
          { word: 'Reis', translation: 'Arroz', example: 'Reis passt gut zu Bohnen.', translatedExample: 'Arroz combina bem com feijão.', order: 7 },
          { word: 'Käse', translation: 'Queijo', example: 'Dieser Käse schmeckt ausgezeichnet.', translatedExample: 'Este queijo é excelente.', order: 8 },
          { word: 'Ei', translation: 'Ovo', example: 'Ich esse ein Ei zum Frühstück.', translatedExample: 'Eu como um ovo no café da manhã.', order: 9 },
          { word: 'Milch', translation: 'Leite', example: 'Ich trinke Milch mit Kaffee.', translatedExample: 'Eu bebo leite com café.', order: 10 },
        ],
      },
      {
        title: 'Getränke',
        description: 'Verschiedene Getränke',
        order: 2,
        vocabulary: [
          { word: 'Kaffee', translation: 'Café', example: 'Ich trinke jeden Morgen Kaffee.', translatedExample: 'Eu tomo café toda manhã.', order: 1 },
          { word: 'Tee', translation: 'Chá', example: 'Tee hilft mir beim Entspannen.', translatedExample: 'Chá me ajuda a relaxar.', order: 2 },
          { word: 'Saft', translation: 'Suco', example: 'Orangensaft ist mein Lieblingssaft.', translatedExample: 'Suco de laranja é meu suco favorito.', order: 3 },
          { word: 'Bier', translation: 'Cerveja', example: 'Ein kaltes Bier im Sommer ist perfekt.', translatedExample: 'Uma cerveja gelada no verão é perfeita.', order: 4 },
          { word: 'Wein', translation: 'Vinho', example: 'Rotwein passt gut zu Fleisch.', translatedExample: 'Vinho tinto combina bem com carne.', order: 5 },
          { word: 'Limonade', translation: 'Limonada', example: 'Diese Limonade ist sehr erfrischend.', translatedExample: 'Esta limonada é muito refrescante.', order: 6 },
          { word: 'Wasser', translation: 'Água', example: 'Wasser ist lebenswichtig.', translatedExample: 'Água é vital.', order: 7 },
          { word: 'Milch', translation: 'Leite', example: 'Warme Milch hilft beim Schlafen.', translatedExample: 'Leite quente ajuda a dormir.', order: 8 },
          { word: 'Kakao', translation: 'Chocolate quente', example: 'Im Winter liebe ich heißen Kakao.', translatedExample: 'No inverno eu amo chocolate quente.', order: 9 },
          { word: 'Smoothie', translation: 'Smoothie', example: 'Ein Smoothie ist gesund und lecker.', translatedExample: 'Um smoothie é saudável e gostoso.', order: 10 },
        ],
      },
      {
        title: 'Einkaufen',
        description: 'Vokabeln rund ums Einkaufen',
        order: 3,
        vocabulary: [
          { word: 'Geschäft', translation: 'Loja', example: 'Das Geschäft ist um die Ecke.', translatedExample: 'A loja fica na esquina.', order: 1 },
          { word: 'Supermarkt', translation: 'Supermercado', example: 'Ich gehe zum Supermarkt.', translatedExample: 'Eu vou ao supermercado.', order: 2 },
          { word: 'Preis', translation: 'Preço', example: 'Was ist der Preis?', translatedExample: 'Qual é o preço?', order: 3 },
          { word: 'Kasse', translation: 'Caixa', example: 'Bitte zahlen Sie an der Kasse.', translatedExample: 'Por favor, pague no caixa.', order: 4 },
          { word: 'Einkaufswagen', translation: 'Carrinho de compras', example: 'Der Einkaufswagen ist voll.', translatedExample: 'O carrinho de compras está cheio.', order: 5 },
          { word: 'Geld', translation: 'Dinheiro', example: 'Ich habe kein Geld dabei.', translatedExample: 'Eu não tenho dinheiro.', order: 6 },
          { word: 'Kreditkarte', translation: 'Cartão de crédito', example: 'Kann ich mit Kreditkarte zahlen?', translatedExample: 'Posso pagar com cartão de crédito?', order: 7 },
          { word: 'Verkäufer', translation: 'Vendedor', example: 'Der Verkäufer ist sehr freundlich.', translatedExample: 'O vendedor é muito simpático.', order: 8 },
          { word: 'Tasche', translation: 'Sacola', example: 'Ich brauche eine Tasche.', translatedExample: 'Eu preciso de uma sacola.', order: 9 },
          { word: 'Rabatt', translation: 'Desconto', example: 'Gibt es einen Rabatt?', translatedExample: 'Há algum desconto?', order: 10 },
        ],
      },
      {
        title: 'Wetter',
        description: 'Wetter und Jahreszeiten',
        order: 4,
        vocabulary: [
          { word: 'Sonne', translation: 'Sol', example: 'Die Sonne scheint hell.', translatedExample: 'O sol brilha forte.', order: 1 },
          { word: 'Regen', translation: 'Chuva', example: 'Es regnet heute.', translatedExample: 'Está chovendo hoje.', order: 2 },
          { word: 'Schnee', translation: 'Neve', example: 'Im Winter fällt Schnee.', translatedExample: 'No inverno cai neve.', order: 3 },
          { word: 'Wind', translation: 'Vento', example: 'Der Wind ist kalt.', translatedExample: 'O vento está frio.', order: 4 },
          { word: 'Wolke', translation: 'Nuvem', example: 'Die Wolken sind dunkel.', translatedExample: 'As nuvens estão escuras.', order: 5 },
          { word: 'Warm', translation: 'Quente', example: 'Heute ist es warm.', translatedExample: 'Hoje está quente.', order: 6 },
          { word: 'Kalt', translation: 'Frio', example: 'Gestern war es kalt.', translatedExample: 'Ontem estava frio.', order: 7 },
          { word: 'Frühling', translation: 'Primavera', example: 'Im Frühling blühen die Blumen.', translatedExample: 'Na primavera as flores florescem.', order: 8 },
          { word: 'Sommer', translation: 'Verão', example: 'Der Sommer ist meine Lieblingsjahreszeit.', translatedExample: 'O verão é minha estação favorita.', order: 9 },
          { word: 'Herbst', translation: 'Outono', example: 'Im Herbst fallen die Blätter.', translatedExample: 'No outono as folhas caem.', order: 10 },
        ],
      },
      {
        title: 'Verkehr',
        description: 'Verkehrsmittel und Fortbewegung',
        order: 5,
        vocabulary: [
          { word: 'Auto', translation: 'Carro', example: 'Mein Auto ist neu.', translatedExample: 'Meu carro é novo.', order: 1 },
          { word: 'Bus', translation: 'Ônibus', example: 'Ich fahre mit dem Bus.', translatedExample: 'Eu vou de ônibus.', order: 2 },
          { word: 'Zug', translation: 'Trem', example: 'Der Zug ist pünktlich.', translatedExample: 'O trem está no horário.', order: 3 },
          { word: 'Flugzeug', translation: 'Avião', example: 'Das Flugzeug fliegt hoch.', translatedExample: 'O avião voa alto.', order: 4 },
          { word: 'Fahrrad', translation: 'Bicicleta', example: 'Ich fahre gerne Fahrrad.', translatedExample: 'Eu gosto de andar de bicicleta.', order: 5 },
          { word: 'Taxi', translation: 'Táxi', example: 'Wir nehmen ein Taxi.', translatedExample: 'Nós pegamos um táxi.', order: 6 },
          { word: 'Straße', translation: 'Rua', example: 'Die Straße ist breit.', translatedExample: 'A rua é larga.', order: 7 },
          { word: 'Haltestelle', translation: 'Ponto', example: 'Die Haltestelle ist hier.', translatedExample: 'O ponto é aqui.', order: 8 },
          { word: 'Ticket', translation: 'Bilhete', example: 'Ich kaufe ein Ticket.', translatedExample: 'Eu compro um bilhete.', order: 9 },
          { word: 'Bahnhof', translation: 'Estação', example: 'Der Bahnhof ist groß.', translatedExample: 'A estação é grande.', order: 10 },
        ],
      },
    ],
  },
];

// Portugiesisch => Deutsch (PT-BR -> DE)
const portugueseToGermanContent = [
  {
    title: 'Fundamentos',
    description: 'Aprenda os fundamentos básicos da língua alemã',
    order: 1,
    subchapters: [
      {
        title: 'Saudações',
        description: 'Saudações e despedidas básicas',
        order: 1,
        vocabulary: [
          { word: 'Olá', translation: 'Hallo', example: 'Olá, como você está?', translatedExample: 'Hallo, wie geht es dir?', order: 1 },
          { word: 'Bom dia', translation: 'Guten Morgen', example: 'Bom dia! Você dormiu bem?', translatedExample: 'Guten Morgen! Hast du gut geschlafen?', order: 2 },
          { word: 'Boa tarde', translation: 'Guten Tag', example: 'Boa tarde, tempo bonito hoje.', translatedExample: 'Guten Tag, schönes Wetter heute.', order: 3 },
          { word: 'Boa noite', translation: 'Guten Abend', example: 'Boa noite, aproveite sua estadia!', translatedExample: 'Guten Abend, angenehmen Aufenthalt!', order: 4 },
          { word: 'Tchau', translation: 'Tschüss', example: 'Tchau, até amanhã!', translatedExample: 'Tschüss, bis morgen!', order: 5 },
          { word: 'Até logo', translation: 'Auf Wiedersehen', example: 'Até logo, tenha um bom dia!', translatedExample: 'Auf Wiedersehen, schönen Tag noch!', order: 6 },
          { word: 'Obrigado', translation: 'Danke', example: 'Obrigado pela sua ajuda!', translatedExample: 'Danke für deine Hilfe!', order: 7 },
          { word: 'Por favor', translation: 'Bitte', example: 'Por favor, me dê o sal.', translatedExample: 'Bitte gib mir das Salz.', order: 8 },
          { word: 'Desculpe', translation: 'Entschuldigung', example: 'Desculpe, eu me atrasei.', translatedExample: 'Entschuldigung, ich habe mich verspätet.', order: 9 },
          { word: 'Sim', translation: 'Ja', example: 'Sim, eu entendo.', translatedExample: 'Ja, ich verstehe.', order: 10 },
        ],
      },
      {
        title: 'Família',
        description: 'Membros da família e parentesco',
        order: 2,
        vocabulary: [
          { word: 'Família', translation: 'Familie', example: 'Minha família é muito grande.', translatedExample: 'Meine Familie ist sehr groß.', order: 1 },
          { word: 'Mãe', translation: 'Mutter', example: 'Minha mãe cozinha muito bem.', translatedExample: 'Meine Mutter kocht sehr gut.', order: 2 },
          { word: 'Pai', translation: 'Vater', example: 'Meu pai trabalha como professor.', translatedExample: 'Mein Vater arbeitet als Lehrer.', order: 3 },
          { word: 'Irmão', translation: 'Bruder', example: 'Meu irmão joga futebol.', translatedExample: 'Mein Bruder spielt Fußball.', order: 4 },
          { word: 'Irmã', translation: 'Schwester', example: 'Minha irmã estuda medicina.', translatedExample: 'Meine Schwester studiert Medizin.', order: 5 },
          { word: 'Avó', translation: 'Großmutter', example: 'Minha avó conta histórias legais.', translatedExample: 'Meine Großmutter erzählt tolle Geschichten.', order: 6 },
          { word: 'Avô', translation: 'Großvater', example: 'Meu avô ama seu jardim.', translatedExample: 'Mein Großvater liebt seinen Garten.', order: 7 },
          { word: 'Filho', translation: 'Sohn', example: 'O filho tem cinco anos.', translatedExample: 'Der Sohn ist fünf Jahre alt.', order: 8 },
          { word: 'Filha', translation: 'Tochter', example: 'A filha dela vai à escola.', translatedExample: 'Ihre Tochter geht in die Schule.', order: 9 },
          { word: 'Pais', translation: 'Eltern', example: 'Meus pais moram em Berlim.', translatedExample: 'Meine Eltern wohnen in Berlin.', order: 10 },
        ],
      },
      {
        title: 'Números',
        description: 'Números de 1 a 10',
        order: 3,
        vocabulary: [
          { word: 'Um', translation: 'Eins', example: 'Eu tenho um filho.', translatedExample: 'Ich habe ein Kind.', order: 1 },
          { word: 'Dois', translation: 'Zwei', example: 'Eu tenho dois irmãos.', translatedExample: 'Ich habe zwei Brüder.', order: 2 },
          { word: 'Três', translation: 'Drei', example: 'Há três maçãs na cesta.', translatedExample: 'Es sind drei Äpfel im Korb.', order: 3 },
          { word: 'Quatro', translation: 'Vier', example: 'A mesa tem quatro pernas.', translatedExample: 'Der Tisch hat vier Beine.', order: 4 },
          { word: 'Cinco', translation: 'Fünf', example: 'Eu venho às cinco horas.', translatedExample: 'Ich komme um fünf Uhr.', order: 5 },
          { word: 'Seis', translation: 'Sechs', example: 'O bebê tem seis meses.', translatedExample: 'Das Baby ist sechs Monate alt.', order: 6 },
          { word: 'Sete', translation: 'Sieben', example: 'A semana tem sete dias.', translatedExample: 'Die Woche hat sieben Tage.', order: 7 },
          { word: 'Oito', translation: 'Acht', example: 'Eu acordo às oito horas.', translatedExample: 'Ich stehe um acht Uhr auf.', order: 8 },
          { word: 'Nove', translation: 'Neun', example: 'O curso começa às nove.', translatedExample: 'Der Kurs beginnt um neun.', order: 9 },
          { word: 'Dez', translation: 'Zehn', example: 'Eu tenho dez dedos.', translatedExample: 'Ich habe zehn Finger.', order: 10 },
        ],
      },
      {
        title: 'Cores',
        description: 'As cores mais importantes',
        order: 4,
        vocabulary: [
          { word: 'Vermelho', translation: 'Rot', example: 'A rosa é vermelha.', translatedExample: 'Die Rose ist rot.', order: 1 },
          { word: 'Azul', translation: 'Blau', example: 'O céu é azul.', translatedExample: 'Der Himmel ist blau.', order: 2 },
          { word: 'Verde', translation: 'Grün', example: 'A grama é verde.', translatedExample: 'Das Gras ist grün.', order: 3 },
          { word: 'Amarelo', translation: 'Gelb', example: 'A banana é amarela.', translatedExample: 'Die Banane ist gelb.', order: 4 },
          { word: 'Preto', translation: 'Schwarz', example: 'Meu carro é preto.', translatedExample: 'Mein Auto ist schwarz.', order: 5 },
          { word: 'Branco', translation: 'Weiß', example: 'A parede é branca.', translatedExample: 'Die Wand ist weiß.', order: 6 },
          { word: 'Laranja', translation: 'Orange', example: 'A laranja é laranja.', translatedExample: 'Die Orange ist orange.', order: 7 },
          { word: 'Rosa', translation: 'Rosa', example: 'O vestido dela é rosa.', translatedExample: 'Ihr Kleid ist rosa.', order: 8 },
          { word: 'Marrom', translation: 'Braun', example: 'A mesa é marrom.', translatedExample: 'Der Tisch ist braun.', order: 9 },
          { word: 'Cinza', translation: 'Grau', example: 'As nuvens são cinzas.', translatedExample: 'Die Wolken sind grau.', order: 10 },
        ],
      },
      {
        title: 'Dias da semana',
        description: 'Os sete dias da semana',
        order: 5,
        vocabulary: [
          { word: 'Segunda-feira', translation: 'Montag', example: 'Na segunda-feira começa a semana.', translatedExample: 'Am Montag beginnt die Woche.', order: 1 },
          { word: 'Terça-feira', translation: 'Dienstag', example: 'Na terça-feira eu tenho um compromisso.', translatedExample: 'Am Dienstag habe ich einen Termin.', order: 2 },
          { word: 'Quarta-feira', translation: 'Mittwoch', example: 'Quarta-feira é meio da semana.', translatedExample: 'Mittwoch ist mitte der Woche.', order: 3 },
          { word: 'Quinta-feira', translation: 'Donnerstag', example: 'Na quinta-feira eu vou às compras.', translatedExample: 'Am Donnerstag gehe ich einkaufen.', order: 4 },
          { word: 'Sexta-feira', translation: 'Freitag', example: 'Sexta-feira é meu dia favorito.', translatedExample: 'Freitag ist mein Lieblingstag.', order: 5 },
          { word: 'Sábado', translation: 'Samstag', example: 'No sábado eu durmo até tarde.', translatedExample: 'Am Samstag schlafe ich lange.', order: 6 },
          { word: 'Domingo', translation: 'Sonntag', example: 'No domingo eu visito minha família.', translatedExample: 'Am Sonntag besuche ich meine Familie.', order: 7 },
          { word: 'Hoje', translation: 'Heute', example: 'Hoje é um dia bonito.', translatedExample: 'Heute ist ein schöner Tag.', order: 8 },
          { word: 'Amanhã', translation: 'Morgen', example: 'Amanhã eu vou para Berlim.', translatedExample: 'Morgen fahre ich nach Berlin.', order: 9 },
          { word: 'Ontem', translation: 'Gestern', example: 'Ontem foi domingo.', translatedExample: 'Gestern war Sonntag.', order: 10 },
        ],
      },
    ],
  },
  {
    title: 'Dia a dia',
    description: 'Vocabulário para uso diário',
    order: 2,
    subchapters: [
      {
        title: 'Comida',
        description: 'Alimentos e comidas comuns',
        order: 1,
        vocabulary: [
          { word: 'Pão', translation: 'Brot', example: 'Eu gosto de comer pão no café da manhã.', translatedExample: 'Ich esse gerne Brot zum Frühstück.', order: 1 },
          { word: 'Água', translation: 'Wasser', example: 'Eu bebo muita água.', translatedExample: 'Ich trinke viel Wasser.', order: 2 },
          { word: 'Carne', translation: 'Fleisch', example: 'A carne está macia.', translatedExample: 'Das Fleisch ist zart.', order: 3 },
          { word: 'Peixe', translation: 'Fisch', example: 'Peixe é muito saudável.', translatedExample: 'Fisch ist sehr gesund.', order: 4 },
          { word: 'Legumes', translation: 'Gemüse', example: 'Eu como legumes todos os dias.', translatedExample: 'Ich esse jeden Tag Gemüse.', order: 5 },
          { word: 'Frutas', translation: 'Obst', example: 'Frutas são gostosas e saudáveis.', translatedExample: 'Obst ist lecker und gesund.', order: 6 },
          { word: 'Arroz', translation: 'Reis', example: 'Arroz combina bem com feijão.', translatedExample: 'Reis passt gut zu Bohnen.', order: 7 },
          { word: 'Queijo', translation: 'Käse', example: 'Este queijo é excelente.', translatedExample: 'Dieser Käse schmeckt ausgezeichnet.', order: 8 },
          { word: 'Ovo', translation: 'Ei', example: 'Eu como um ovo no café da manhã.', translatedExample: 'Ich esse ein Ei zum Frühstück.', order: 9 },
          { word: 'Leite', translation: 'Milch', example: 'Eu bebo leite com café.', translatedExample: 'Ich trinke Milch mit Kaffee.', order: 10 },
        ],
      },
      {
        title: 'Bebidas',
        description: 'Diferentes bebidas',
        order: 2,
        vocabulary: [
          { word: 'Café', translation: 'Kaffee', example: 'Eu tomo café toda manhã.', translatedExample: 'Ich trinke jeden Morgen Kaffee.', order: 1 },
          { word: 'Chá', translation: 'Tee', example: 'Chá me ajuda a relaxar.', translatedExample: 'Tee hilft mir beim Entspannen.', order: 2 },
          { word: 'Suco', translation: 'Saft', example: 'Suco de laranja é meu suco favorito.', translatedExample: 'Orangensaft ist mein Lieblingssaft.', order: 3 },
          { word: 'Cerveja', translation: 'Bier', example: 'Uma cerveja gelada no verão é perfeita.', translatedExample: 'Ein kaltes Bier im Sommer ist perfekt.', order: 4 },
          { word: 'Vinho', translation: 'Wein', example: 'Vinho tinto combina bem com carne.', translatedExample: 'Rotwein passt gut zu Fleisch.', order: 5 },
          { word: 'Limonada', translation: 'Limonade', example: 'Esta limonada é muito refrescante.', translatedExample: 'Diese Limonade ist sehr erfrischend.', order: 6 },
          { word: 'Água', translation: 'Wasser', example: 'Água é vital.', translatedExample: 'Wasser ist lebenswichtig.', order: 7 },
          { word: 'Leite', translation: 'Milch', example: 'Leite quente ajuda a dormir.', translatedExample: 'Warme Milch hilft beim Schlafen.', order: 8 },
          { word: 'Chocolate quente', translation: 'Kakao', example: 'No inverno eu amo chocolate quente.', translatedExample: 'Im Winter liebe ich heißen Kakao.', order: 9 },
          { word: 'Smoothie', translation: 'Smoothie', example: 'Um smoothie é saudável e gostoso.', translatedExample: 'Ein Smoothie ist gesund und lecker.', order: 10 },
        ],
      },
      {
        title: 'Compras',
        description: 'Vocabulário sobre compras',
        order: 3,
        vocabulary: [
          { word: 'Loja', translation: 'Geschäft', example: 'A loja fica na esquina.', translatedExample: 'Das Geschäft ist um die Ecke.', order: 1 },
          { word: 'Supermercado', translation: 'Supermarkt', example: 'Eu vou ao supermercado.', translatedExample: 'Ich gehe zum Supermarkt.', order: 2 },
          { word: 'Preço', translation: 'Preis', example: 'Qual é o preço?', translatedExample: 'Was ist der Preis?', order: 3 },
          { word: 'Caixa', translation: 'Kasse', example: 'Por favor, pague no caixa.', translatedExample: 'Bitte zahlen Sie an der Kasse.', order: 4 },
          { word: 'Carrinho de compras', translation: 'Einkaufswagen', example: 'O carrinho de compras está cheio.', translatedExample: 'Der Einkaufswagen ist voll.', order: 5 },
          { word: 'Dinheiro', translation: 'Geld', example: 'Eu não tenho dinheiro.', translatedExample: 'Ich habe kein Geld dabei.', order: 6 },
          { word: 'Cartão de crédito', translation: 'Kreditkarte', example: 'Posso pagar com cartão de crédito?', translatedExample: 'Kann ich mit Kreditkarte zahlen?', order: 7 },
          { word: 'Vendedor', translation: 'Verkäufer', example: 'O vendedor é muito simpático.', translatedExample: 'Der Verkäufer ist sehr freundlich.', order: 8 },
          { word: 'Sacola', translation: 'Tasche', example: 'Eu preciso de uma sacola.', translatedExample: 'Ich brauche eine Tasche.', order: 9 },
          { word: 'Desconto', translation: 'Rabatt', example: 'Há algum desconto?', translatedExample: 'Gibt es einen Rabatt?', order: 10 },
        ],
      },
      {
        title: 'Clima',
        description: 'Clima e estações do ano',
        order: 4,
        vocabulary: [
          { word: 'Sol', translation: 'Sonne', example: 'O sol brilha forte.', translatedExample: 'Die Sonne scheint hell.', order: 1 },
          { word: 'Chuva', translation: 'Regen', example: 'Está chovendo hoje.', translatedExample: 'Es regnet heute.', order: 2 },
          { word: 'Neve', translation: 'Schnee', example: 'No inverno cai neve.', translatedExample: 'Im Winter fällt Schnee.', order: 3 },
          { word: 'Vento', translation: 'Wind', example: 'O vento está frio.', translatedExample: 'Der Wind ist kalt.', order: 4 },
          { word: 'Nuvem', translation: 'Wolke', example: 'As nuvens estão escuras.', translatedExample: 'Die Wolken sind dunkel.', order: 5 },
          { word: 'Quente', translation: 'Warm', example: 'Hoje está quente.', translatedExample: 'Heute ist es warm.', order: 6 },
          { word: 'Frio', translation: 'Kalt', example: 'Ontem estava frio.', translatedExample: 'Gestern war es kalt.', order: 7 },
          { word: 'Primavera', translation: 'Frühling', example: 'Na primavera as flores florescem.', translatedExample: 'Im Frühling blühen die Blumen.', order: 8 },
          { word: 'Verão', translation: 'Sommer', example: 'O verão é minha estação favorita.', translatedExample: 'Der Sommer ist meine Lieblingsjahreszeit.', order: 9 },
          { word: 'Outono', translation: 'Herbst', example: 'No outono as folhas caem.', translatedExample: 'Im Herbst fallen die Blätter.', order: 10 },
        ],
      },
      {
        title: 'Transporte',
        description: 'Meios de transporte e locomoção',
        order: 5,
        vocabulary: [
          { word: 'Carro', translation: 'Auto', example: 'Meu carro é novo.', translatedExample: 'Mein Auto ist neu.', order: 1 },
          { word: 'Ônibus', translation: 'Bus', example: 'Eu vou de ônibus.', translatedExample: 'Ich fahre mit dem Bus.', order: 2 },
          { word: 'Trem', translation: 'Zug', example: 'O trem está no horário.', translatedExample: 'Der Zug ist pünktlich.', order: 3 },
          { word: 'Avião', translation: 'Flugzeug', example: 'O avião voa alto.', translatedExample: 'Das Flugzeug fliegt hoch.', order: 4 },
          { word: 'Bicicleta', translation: 'Fahrrad', example: 'Eu gosto de andar de bicicleta.', translatedExample: 'Ich fahre gerne Fahrrad.', order: 5 },
          { word: 'Táxi', translation: 'Taxi', example: 'Nós pegamos um táxi.', translatedExample: 'Wir nehmen ein Taxi.', order: 6 },
          { word: 'Rua', translation: 'Straße', example: 'A rua é larga.', translatedExample: 'Die Straße ist breit.', order: 7 },
          { word: 'Ponto', translation: 'Haltestelle', example: 'O ponto é aqui.', translatedExample: 'Die Haltestelle ist hier.', order: 8 },
          { word: 'Bilhete', translation: 'Ticket', example: 'Eu compro um bilhete.', translatedExample: 'Ich kaufe ein Ticket.', order: 9 },
          { word: 'Estação', translation: 'Bahnhof', example: 'A estação é grande.', translatedExample: 'Der Bahnhof ist groß.', order: 10 },
        ],
      },
    ],
  },
];

async function seedChapters() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Seed Deutsch => Portugiesisch (de => pt-br)
    console.log('\n📚 Creating German => Portuguese content...');
    for (const chapter of deToPortugueseContent) {
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
    }

    // Seed Portugiesisch => Deutsch (pt-br => de)
    console.log('\n📚 Creating Portuguese => German content...');
    for (const chapter of portugueseToGermanContent) {
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
    }

    console.log('\n✅ Successfully seeded Portuguese-German content!');
    console.log('');
    console.log('📊 Summary:');
    console.log('  - 2 chapters for DE => PT-BR');
    console.log('  - 2 chapters for PT-BR => DE');
    console.log('  - 5 subchapters per chapter (10 total per language pair)');
    console.log('  - 10 vocabulary items per subchapter (100 total per language pair)');
    console.log('');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedChapters();
