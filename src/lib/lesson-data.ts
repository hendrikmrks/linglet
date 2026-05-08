export type Exercise =
  | {
      type: 'mc';
      prompt: string;
      options: string[];
      answer: string;
    }
  | {
      type: 'match';
      pairs: { left: string; right: string }[];
    };

export interface LessonContent {
  exercises: Exercise[];
}

export const LESSONS: Record<string, Record<'de' | 'en' | 'pt-br', LessonContent>> = {
  'level-1-1': {
    en: {
      exercises: [
        {
          type: 'mc',
          prompt: 'I',
          options: ['I', 'you', 'he', 'we'],
          answer: 'I',
        },
        {
          type: 'mc',
          prompt: 'you',
          options: ['you', 'I', 'she', 'they'],
          answer: 'you',
        },
        {
          type: 'match',
          pairs: [
            { left: 'he', right: 'he' },
            { left: 'she', right: 'she' },
            { left: 'it', right: 'it' },
          ],
        },
        {
          type: 'mc',
          prompt: 'we',
          options: ['we', 'you', 'they', 'I'],
          answer: 'we',
        },
        {
          type: 'mc',
          prompt: 'they',
          options: ['they', 'we', 'you', 'he'],
          answer: 'they',
        },
        {
          type: 'mc',
          prompt: 'man',
          options: ['man', 'woman', 'child', 'boy'],
          answer: 'man',
        },
        {
          type: 'mc',
          prompt: 'woman',
          options: ['woman', 'man', 'girl', 'child'],
          answer: 'woman',
        },
        {
          type: 'match',
          pairs: [
            { left: 'child', right: 'child' },
            { left: 'boy', right: 'boy' },
            { left: 'girl', right: 'girl' },
            { left: 'person', right: 'person' },
          ],
        },
        {
          type: 'mc',
          prompt: 'yes',
          options: ['yes', 'no', 'maybe', 'okay'],
          answer: 'yes',
        },
        {
          type: 'mc',
          prompt: 'no',
          options: ['no', 'yes', 'not', 'never'],
          answer: 'no',
        },
        {
          type: 'mc',
          prompt: 'the',
          options: ['the', 'a', 'an', 'this'],
          answer: 'the',
        },
        {
          type: 'mc',
          prompt: 'a',
          options: ['a', 'an', 'the', 'one'],
          answer: 'a',
        },
        {
          type: 'match',
          pairs: [
            { left: 'this', right: 'this' },
            { left: 'that', right: 'that' },
            { left: 'here', right: 'here' },
          ],
        },
        {
          type: 'mc',
          prompt: 'what',
          options: ['what', 'who', 'where', 'when'],
          answer: 'what',
        },
        {
          type: 'mc',
          prompt: 'who',
          options: ['who', 'what', 'where', 'which'],
          answer: 'who',
        },
      ],
    },
    de: {
      exercises: [
        {
          type: 'mc',
          prompt: 'ich',
          options: ['ich', 'du', 'er', 'wir'],
          answer: 'ich',
        },
        {
          type: 'mc',
          prompt: 'du',
          options: ['du', 'ich', 'sie', 'ihr'],
          answer: 'du',
        },
        {
          type: 'match',
          pairs: [
            { left: 'er', right: 'er' },
            { left: 'sie', right: 'sie' },
            { left: 'es', right: 'es' },
          ],
        },
        {
          type: 'mc',
          prompt: 'wir',
          options: ['wir', 'ihr', 'sie', 'ich'],
          answer: 'wir',
        },
        {
          type: 'mc',
          prompt: 'sie',
          options: ['sie', 'wir', 'ihr', 'er'],
          answer: 'sie',
        },
        {
          type: 'mc',
          prompt: 'Mann',
          options: ['Mann', 'Frau', 'Kind', 'Junge'],
          answer: 'Mann',
        },
        {
          type: 'mc',
          prompt: 'Frau',
          options: ['Frau', 'Mann', 'Maedchen', 'Kind'],
          answer: 'Frau',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Kind', right: 'Kind' },
            { left: 'Junge', right: 'Junge' },
            { left: 'Maedchen', right: 'Maedchen' },
            { left: 'Person', right: 'Person' },
          ],
        },
        {
          type: 'mc',
          prompt: 'ja',
          options: ['ja', 'nein', 'vielleicht', 'okay'],
          answer: 'ja',
        },
        {
          type: 'mc',
          prompt: 'nein',
          options: ['nein', 'ja', 'nicht', 'nie'],
          answer: 'nein',
        },
        {
          type: 'mc',
          prompt: 'der',
          options: ['der', 'die', 'das', 'dem'],
          answer: 'der',
        },
        {
          type: 'mc',
          prompt: 'ein',
          options: ['ein', 'eine', 'der', 'eins'],
          answer: 'ein',
        },
        {
          type: 'match',
          pairs: [
            { left: 'dies', right: 'dies' },
            { left: 'das', right: 'das' },
            { left: 'hier', right: 'hier' },
          ],
        },
        {
          type: 'mc',
          prompt: 'was',
          options: ['was', 'wer', 'wo', 'wann'],
          answer: 'was',
        },
        {
          type: 'mc',
          prompt: 'wer',
          options: ['wer', 'was', 'wo', 'welch'],
          answer: 'wer',
        },
      ],
    },
    'pt-br': {
      exercises: [
        {
          type: 'mc',
          prompt: 'eu',
          options: ['eu', 'voce', 'ele', 'nos'],
          answer: 'eu',
        },
        {
          type: 'mc',
          prompt: 'voce',
          options: ['voce', 'eu', 'ela', 'eles'],
          answer: 'voce',
        },
        {
          type: 'match',
          pairs: [
            { left: 'ele', right: 'ele' },
            { left: 'ela', right: 'ela' },
            { left: 'nos', right: 'nos' },
          ],
        },
        {
          type: 'mc',
          prompt: 'nos',
          options: ['nos', 'voces', 'eles', 'eu'],
          answer: 'nos',
        },
        {
          type: 'mc',
          prompt: 'eles',
          options: ['eles', 'nos', 'voces', 'ele'],
          answer: 'eles',
        },
        {
          type: 'mc',
          prompt: 'homem',
          options: ['homem', 'mulher', 'crianca', 'menino'],
          answer: 'homem',
        },
        {
          type: 'mc',
          prompt: 'mulher',
          options: ['mulher', 'homem', 'menina', 'crianca'],
          answer: 'mulher',
        },
        {
          type: 'match',
          pairs: [
            { left: 'crianca', right: 'crianca' },
            { left: 'menino', right: 'menino' },
            { left: 'menina', right: 'menina' },
            { left: 'pessoa', right: 'pessoa' },
          ],
        },
        {
          type: 'mc',
          prompt: 'sim',
          options: ['sim', 'nao', 'talvez', 'ok'],
          answer: 'sim',
        },
        {
          type: 'mc',
          prompt: 'nao',
          options: ['nao', 'sim', 'nunca', 'jamais'],
          answer: 'nao',
        },
        {
          type: 'mc',
          prompt: 'o',
          options: ['o', 'a', 'um', 'uma'],
          answer: 'o',
        },
        {
          type: 'mc',
          prompt: 'um',
          options: ['um', 'uma', 'o', 'a'],
          answer: 'um',
        },
        {
          type: 'match',
          pairs: [
            { left: 'este', right: 'este' },
            { left: 'esse', right: 'esse' },
            { left: 'aqui', right: 'aqui' },
          ],
        },
        {
          type: 'mc',
          prompt: 'o que',
          options: ['o que', 'quem', 'onde', 'quando'],
          answer: 'o que',
        },
        {
          type: 'mc',
          prompt: 'quem',
          options: ['quem', 'o que', 'onde', 'qual'],
          answer: 'quem',
        },
      ],
    },
  },
  'level-1-2': {
    en: {
      exercises: [
        {
          type: 'mc',
          prompt: 'yes',
          options: ['yes', 'no', 'maybe', 'sorry'],
          answer: 'yes',
        },
        {
          type: 'mc',
          prompt: 'sorry',
          options: ['sorry', 'please', 'hello', 'thanks'],
          answer: 'sorry',
        },
        {
          type: 'match',
          pairs: [
            { left: 'no', right: 'no' },
            { left: 'please', right: 'please' },
            { left: 'welcome', right: 'welcome' },
          ],
        },
        {
          type: 'mc',
          prompt: 'no',
          options: ['no', 'yes', 'ok', 'sure'],
          answer: 'no',
        },
        {
          type: 'mc',
          prompt: 'hello',
          options: ['hello', 'goodbye', 'night', 'morning'],
          answer: 'hello',
        },
        {
          type: 'mc',
          prompt: 'goodbye',
          options: ['goodbye', 'hello', 'welcome', 'thanks'],
          answer: 'goodbye',
        },
        {
          type: 'mc',
          prompt: 'please',
          options: ['please', 'thanks', 'sorry', 'excuse'],
          answer: 'please',
        },
        {
          type: 'match',
          pairs: [
            { left: 'good morning', right: 'good morning' },
            { left: 'good night', right: 'good night' },
            { left: 'see you', right: 'see you' },
            { left: 'excuse me', right: 'excuse me' },
          ],
        },
        {
          type: 'mc',
          prompt: 'thanks',
          options: ['thanks', 'please', 'sorry', 'welcome'],
          answer: 'thanks',
        },
        {
          type: 'mc',
          prompt: 'welcome',
          options: ['welcome', 'goodbye', 'hello', 'sorry'],
          answer: 'welcome',
        },
        {
          type: 'mc',
          prompt: 'excuse me',
          options: ['excuse me', 'sorry', 'please', 'thanks'],
          answer: 'excuse me',
        },
        {
          type: 'mc',
          prompt: 'good morning',
          options: ['good morning', 'good night', 'goodbye', 'hello'],
          answer: 'good morning',
        },
        {
          type: 'match',
          pairs: [
            { left: 'good afternoon', right: 'good afternoon' },
            { left: 'good evening', right: 'good evening' },
            { left: 'have a nice day', right: 'have a nice day' },
          ],
        },
        {
          type: 'mc',
          prompt: 'see you',
          options: ['see you', 'hello', 'goodbye', 'welcome'],
          answer: 'see you',
        },
        {
          type: 'mc',
          prompt: 'how are you',
          options: ['how are you', 'thank you', 'goodbye', 'hello'],
          answer: 'how are you',
        },
      ],
    },
    de: {
      exercises: [
        {
          type: 'mc',
          prompt: 'ja',
          options: ['ja', 'nein', 'vielleicht', 'entschuldigung'],
          answer: 'ja',
        },
        {
          type: 'mc',
          prompt: 'entschuldigung',
          options: ['entschuldigung', 'bitte', 'hallo', 'danke'],
          answer: 'entschuldigung',
        },
        {
          type: 'match',
          pairs: [
            { left: 'nein', right: 'nein' },
            { left: 'bitte', right: 'bitte' },
            { left: 'willkommen', right: 'willkommen' },
          ],
        },
        {
          type: 'mc',
          prompt: 'nein',
          options: ['nein', 'ja', 'ok', 'sicher'],
          answer: 'nein',
        },
        {
          type: 'mc',
          prompt: 'hallo',
          options: ['hallo', 'tschuess', 'nacht', 'morgen'],
          answer: 'hallo',
        },
        {
          type: 'mc',
          prompt: 'tschuess',
          options: ['tschuess', 'hallo', 'willkommen', 'danke'],
          answer: 'tschuess',
        },
        {
          type: 'mc',
          prompt: 'bitte',
          options: ['bitte', 'danke', 'entschuldigung', 'verzeihung'],
          answer: 'bitte',
        },
        {
          type: 'match',
          pairs: [
            { left: 'guten morgen', right: 'guten morgen' },
            { left: 'gute nacht', right: 'gute nacht' },
            { left: 'bis bald', right: 'bis bald' },
            { left: 'verzeihung', right: 'verzeihung' },
          ],
        },
        {
          type: 'mc',
          prompt: 'danke',
          options: ['danke', 'bitte', 'entschuldigung', 'willkommen'],
          answer: 'danke',
        },
        {
          type: 'mc',
          prompt: 'willkommen',
          options: ['willkommen', 'tschuess', 'hallo', 'entschuldigung'],
          answer: 'willkommen',
        },
        {
          type: 'mc',
          prompt: 'verzeihung',
          options: ['verzeihung', 'entschuldigung', 'bitte', 'danke'],
          answer: 'verzeihung',
        },
        {
          type: 'mc',
          prompt: 'guten morgen',
          options: ['guten morgen', 'gute nacht', 'tschuess', 'hallo'],
          answer: 'guten morgen',
        },
        {
          type: 'match',
          pairs: [
            { left: 'guten tag', right: 'guten tag' },
            { left: 'guten abend', right: 'guten abend' },
            { left: 'schoenen tag', right: 'schoenen tag' },
          ],
        },
        {
          type: 'mc',
          prompt: 'bis bald',
          options: ['bis bald', 'hallo', 'tschuess', 'willkommen'],
          answer: 'bis bald',
        },
        {
          type: 'mc',
          prompt: 'wie geht es dir',
          options: ['wie geht es dir', 'danke', 'tschuess', 'hallo'],
          answer: 'wie geht es dir',
        },
      ],
    },
    'pt-br': {
      exercises: [
        {
          type: 'mc',
          prompt: 'sim',
          options: ['sim', 'nao', 'talvez', 'desculpe'],
          answer: 'sim',
        },
        {
          type: 'mc',
          prompt: 'desculpe',
          options: ['desculpe', 'por favor', 'ola', 'obrigado'],
          answer: 'desculpe',
        },
        {
          type: 'match',
          pairs: [
            { left: 'nao', right: 'nao' },
            { left: 'por favor', right: 'por favor' },
            { left: 'bem-vindo', right: 'bem-vindo' },
          ],
        },
        {
          type: 'mc',
          prompt: 'nao',
          options: ['nao', 'sim', 'ok', 'claro'],
          answer: 'nao',
        },
        {
          type: 'mc',
          prompt: 'ola',
          options: ['ola', 'tchau', 'noite', 'manha'],
          answer: 'ola',
        },
        {
          type: 'mc',
          prompt: 'tchau',
          options: ['tchau', 'ola', 'bem-vindo', 'obrigado'],
          answer: 'tchau',
        },
        {
          type: 'mc',
          prompt: 'por favor',
          options: ['por favor', 'obrigado', 'desculpe', 'com licenca'],
          answer: 'por favor',
        },
        {
          type: 'match',
          pairs: [
            { left: 'bom dia', right: 'bom dia' },
            { left: 'boa noite', right: 'boa noite' },
            { left: 'ate logo', right: 'ate logo' },
            { left: 'com licenca', right: 'com licenca' },
          ],
        },
        {
          type: 'mc',
          prompt: 'obrigado',
          options: ['obrigado', 'por favor', 'desculpe', 'bem-vindo'],
          answer: 'obrigado',
        },
        {
          type: 'mc',
          prompt: 'bem-vindo',
          options: ['bem-vindo', 'tchau', 'ola', 'desculpe'],
          answer: 'bem-vindo',
        },
        {
          type: 'mc',
          prompt: 'com licenca',
          options: ['com licenca', 'desculpe', 'por favor', 'obrigado'],
          answer: 'com licenca',
        },
        {
          type: 'mc',
          prompt: 'bom dia',
          options: ['bom dia', 'boa noite', 'tchau', 'ola'],
          answer: 'bom dia',
        },
        {
          type: 'match',
          pairs: [
            { left: 'boa tarde', right: 'boa tarde' },
            { left: 'boa noite', right: 'boa noite' },
            { left: 'tenha um bom dia', right: 'tenha um bom dia' },
          ],
        },
        {
          type: 'mc',
          prompt: 'ate logo',
          options: ['ate logo', 'ola', 'tchau', 'bem-vindo'],
          answer: 'ate logo',
        },
        {
          type: 'mc',
          prompt: 'como vai',
          options: ['como vai', 'obrigado', 'tchau', 'ola'],
          answer: 'como vai',
        },
      ],
    },
  },
  'level-1-3': {
    en: {
      exercises: [
        {
          type: 'mc',
          prompt: 'one',
          options: ['one', 'two', 'three', 'ten'],
          answer: 'one',
        },
        {
          type: 'mc',
          prompt: 'ten',
          options: ['ten', 'one', 'four', 'eight'],
          answer: 'ten',
        },
        {
          type: 'match',
          pairs: [
            { left: 'two', right: 'two' },
            { left: 'three', right: 'three' },
            { left: 'time', right: 'time' },
          ],
        },
        {
          type: 'mc',
          prompt: 'two',
          options: ['two', 'three', 'five', 'seven'],
          answer: 'two',
        },
        {
          type: 'mc',
          prompt: 'three',
          options: ['three', 'four', 'six', 'nine'],
          answer: 'three',
        },
        {
          type: 'mc',
          prompt: 'four',
          options: ['four', 'five', 'two', 'eight'],
          answer: 'four',
        },
        {
          type: 'mc',
          prompt: 'five',
          options: ['five', 'six', 'three', 'nine'],
          answer: 'five',
        },
        {
          type: 'match',
          pairs: [
            { left: 'six', right: 'six' },
            { left: 'seven', right: 'seven' },
            { left: 'eight', right: 'eight' },
            { left: 'nine', right: 'nine' },
          ],
        },
        {
          type: 'mc',
          prompt: 'six',
          options: ['six', 'seven', 'four', 'ten'],
          answer: 'six',
        },
        {
          type: 'mc',
          prompt: 'seven',
          options: ['seven', 'eight', 'five', 'two'],
          answer: 'seven',
        },
        {
          type: 'mc',
          prompt: 'eight',
          options: ['eight', 'nine', 'six', 'three'],
          answer: 'eight',
        },
        {
          type: 'mc',
          prompt: 'nine',
          options: ['nine', 'ten', 'seven', 'four'],
          answer: 'nine',
        },
        {
          type: 'match',
          pairs: [
            { left: 'zero', right: 'zero' },
            { left: 'eleven', right: 'eleven' },
            { left: 'twelve', right: 'twelve' },
          ],
        },
        {
          type: 'mc',
          prompt: 'zero',
          options: ['zero', 'one', 'two', 'ten'],
          answer: 'zero',
        },
        {
          type: 'mc',
          prompt: 'time',
          options: ['time', 'hour', 'minute', 'second'],
          answer: 'time',
        },
      ],
    },
    de: {
      exercises: [
        {
          type: 'mc',
          prompt: 'eins',
          options: ['eins', 'zwei', 'drei', 'zehn'],
          answer: 'eins',
        },
        {
          type: 'mc',
          prompt: 'zehn',
          options: ['zehn', 'eins', 'vier', 'acht'],
          answer: 'zehn',
        },
        {
          type: 'match',
          pairs: [
            { left: 'zwei', right: 'zwei' },
            { left: 'drei', right: 'drei' },
            { left: 'zeit', right: 'zeit' },
          ],
        },
        {
          type: 'mc',
          prompt: 'zwei',
          options: ['zwei', 'drei', 'fuenf', 'sieben'],
          answer: 'zwei',
        },
        {
          type: 'mc',
          prompt: 'drei',
          options: ['drei', 'vier', 'sechs', 'neun'],
          answer: 'drei',
        },
        {
          type: 'mc',
          prompt: 'vier',
          options: ['vier', 'fuenf', 'zwei', 'acht'],
          answer: 'vier',
        },
        {
          type: 'mc',
          prompt: 'fuenf',
          options: ['fuenf', 'sechs', 'drei', 'neun'],
          answer: 'fuenf',
        },
        {
          type: 'match',
          pairs: [
            { left: 'sechs', right: 'sechs' },
            { left: 'sieben', right: 'sieben' },
            { left: 'acht', right: 'acht' },
            { left: 'neun', right: 'neun' },
          ],
        },
        {
          type: 'mc',
          prompt: 'sechs',
          options: ['sechs', 'sieben', 'vier', 'zehn'],
          answer: 'sechs',
        },
        {
          type: 'mc',
          prompt: 'sieben',
          options: ['sieben', 'acht', 'fuenf', 'zwei'],
          answer: 'sieben',
        },
        {
          type: 'mc',
          prompt: 'acht',
          options: ['acht', 'neun', 'sechs', 'drei'],
          answer: 'acht',
        },
        {
          type: 'mc',
          prompt: 'neun',
          options: ['neun', 'zehn', 'sieben', 'vier'],
          answer: 'neun',
        },
        {
          type: 'match',
          pairs: [
            { left: 'null', right: 'null' },
            { left: 'elf', right: 'elf' },
            { left: 'zwoelf', right: 'zwoelf' },
          ],
        },
        {
          type: 'mc',
          prompt: 'null',
          options: ['null', 'eins', 'zwei', 'zehn'],
          answer: 'null',
        },
        {
          type: 'mc',
          prompt: 'zeit',
          options: ['zeit', 'stunde', 'minute', 'sekunde'],
          answer: 'zeit',
        },
      ],
    },
    'pt-br': {
      exercises: [
        {
          type: 'mc',
          prompt: 'um',
          options: ['um', 'dois', 'tres', 'dez'],
          answer: 'um',
        },
        {
          type: 'mc',
          prompt: 'dez',
          options: ['dez', 'um', 'quatro', 'oito'],
          answer: 'dez',
        },
        {
          type: 'match',
          pairs: [
            { left: 'dois', right: 'dois' },
            { left: 'tres', right: 'tres' },
            { left: 'hora', right: 'hora' },
          ],
        },
        {
          type: 'mc',
          prompt: 'dois',
          options: ['dois', 'tres', 'cinco', 'sete'],
          answer: 'dois',
        },
        {
          type: 'mc',
          prompt: 'tres',
          options: ['tres', 'quatro', 'seis', 'nove'],
          answer: 'tres',
        },
        {
          type: 'mc',
          prompt: 'quatro',
          options: ['quatro', 'cinco', 'dois', 'oito'],
          answer: 'quatro',
        },
        {
          type: 'mc',
          prompt: 'cinco',
          options: ['cinco', 'seis', 'tres', 'nove'],
          answer: 'cinco',
        },
        {
          type: 'match',
          pairs: [
            { left: 'seis', right: 'seis' },
            { left: 'sete', right: 'sete' },
            { left: 'oito', right: 'oito' },
            { left: 'nove', right: 'nove' },
          ],
        },
        {
          type: 'mc',
          prompt: 'seis',
          options: ['seis', 'sete', 'quatro', 'dez'],
          answer: 'seis',
        },
        {
          type: 'mc',
          prompt: 'sete',
          options: ['sete', 'oito', 'cinco', 'dois'],
          answer: 'sete',
        },
        {
          type: 'mc',
          prompt: 'oito',
          options: ['oito', 'nove', 'seis', 'tres'],
          answer: 'oito',
        },
        {
          type: 'mc',
          prompt: 'nove',
          options: ['nove', 'dez', 'sete', 'quatro'],
          answer: 'nove',
        },
        {
          type: 'match',
          pairs: [
            { left: 'zero', right: 'zero' },
            { left: 'onze', right: 'onze' },
            { left: 'doze', right: 'doze' },
          ],
        },
        {
          type: 'mc',
          prompt: 'zero',
          options: ['zero', 'um', 'dois', 'dez'],
          answer: 'zero',
        },
        {
          type: 'mc',
          prompt: 'hora',
          options: ['hora', 'tempo', 'minuto', 'segundo'],
          answer: 'hora',
        },
      ],
    },
  },
  'level-1-4': {
    en: {
      exercises: [
        {
          type: 'mc',
          prompt: 'my name is',
          options: ['my name is', 'your name is', 'his name is', 'I am'],
          answer: 'my name is',
        },
        {
          type: 'mc',
          prompt: 'how are you',
          options: ['how are you', 'who are you', 'where are you', 'what is this'],
          answer: 'how are you',
        },
        {
          type: 'match',
          pairs: [
            { left: 'nice to meet you', right: 'nice to meet you' },
            { left: 'where are you from', right: 'where are you from' },
            { left: 'I am from', right: 'I am from' },
          ],
        },
        {
          type: 'mc',
          prompt: 'I am fine',
          options: ['I am fine', 'I am tired', 'I am sad', 'I am hungry'],
          answer: 'I am fine',
        },
        {
          type: 'mc',
          prompt: 'and you',
          options: ['and you', 'and me', 'and him', 'and us'],
          answer: 'and you',
        },
        {
          type: 'mc',
          prompt: 'what is your name',
          options: ['what is your name', 'what is his name', 'who is this', 'where is it'],
          answer: 'what is your name',
        },
        {
          type: 'mc',
          prompt: 'where do you live',
          options: ['where do you live', 'where do you work', 'when do you sleep', 'why do you ask'],
          answer: 'where do you live',
        },
        {
          type: 'match',
          pairs: [
            { left: 'I live in', right: 'I live in' },
            { left: 'I come from', right: 'I come from' },
            { left: 'I speak', right: 'I speak' },
            { left: 'do you speak', right: 'do you speak' },
          ],
        },
        {
          type: 'mc',
          prompt: 'pleased to meet you',
          options: ['pleased to meet you', 'goodbye', 'see you later', 'thank you'],
          answer: 'pleased to meet you',
        },
        {
          type: 'mc',
          prompt: 'how old are you',
          options: ['how old are you', 'how are you', 'how many', 'how much'],
          answer: 'how old are you',
        },
        {
          type: 'mc',
          prompt: 'I am',
          options: ['I am', 'you are', 'he is', 'we are'],
          answer: 'I am',
        },
        {
          type: 'mc',
          prompt: 'years old',
          options: ['years old', 'months old', 'days old', 'hours old'],
          answer: 'years old',
        },
        {
          type: 'match',
          pairs: [
            { left: 'see you soon', right: 'see you soon' },
            { left: 'have a nice day', right: 'have a nice day' },
            { left: 'take care', right: 'take care' },
          ],
        },
        {
          type: 'mc',
          prompt: 'my pleasure',
          options: ['my pleasure', 'your pleasure', 'no problem', 'of course'],
          answer: 'my pleasure',
        },
        {
          type: 'mc',
          prompt: 'see you later',
          options: ['see you later', 'see you now', 'see you never', 'see you yesterday'],
          answer: 'see you later',
        },
      ],
    },
    de: {
      exercises: [
        {
          type: 'mc',
          prompt: 'mein name ist',
          options: ['mein name ist', 'dein name ist', 'sein name ist', 'ich bin'],
          answer: 'mein name ist',
        },
        {
          type: 'mc',
          prompt: 'wie geht es dir',
          options: ['wie geht es dir', 'wer bist du', 'wo bist du', 'was ist das'],
          answer: 'wie geht es dir',
        },
        {
          type: 'match',
          pairs: [
            { left: 'freut mich', right: 'freut mich' },
            { left: 'woher kommst du', right: 'woher kommst du' },
            { left: 'ich komme aus', right: 'ich komme aus' },
          ],
        },
        {
          type: 'mc',
          prompt: 'mir geht es gut',
          options: ['mir geht es gut', 'ich bin muede', 'ich bin traurig', 'ich habe hunger'],
          answer: 'mir geht es gut',
        },
        {
          type: 'mc',
          prompt: 'und dir',
          options: ['und dir', 'und mir', 'und ihm', 'und uns'],
          answer: 'und dir',
        },
        {
          type: 'mc',
          prompt: 'wie heisst du',
          options: ['wie heisst du', 'wie heisst er', 'wer ist das', 'wo ist es'],
          answer: 'wie heisst du',
        },
        {
          type: 'mc',
          prompt: 'wo wohnst du',
          options: ['wo wohnst du', 'wo arbeitest du', 'wann schlaefst du', 'warum fragst du'],
          answer: 'wo wohnst du',
        },
        {
          type: 'match',
          pairs: [
            { left: 'ich wohne in', right: 'ich wohne in' },
            { left: 'ich komme aus', right: 'ich komme aus' },
            { left: 'ich spreche', right: 'ich spreche' },
            { left: 'sprichst du', right: 'sprichst du' },
          ],
        },
        {
          type: 'mc',
          prompt: 'angenehm',
          options: ['angenehm', 'tschuess', 'bis spaeter', 'danke'],
          answer: 'angenehm',
        },
        {
          type: 'mc',
          prompt: 'wie alt bist du',
          options: ['wie alt bist du', 'wie geht es dir', 'wie viele', 'wie viel'],
          answer: 'wie alt bist du',
        },
        {
          type: 'mc',
          prompt: 'ich bin',
          options: ['ich bin', 'du bist', 'er ist', 'wir sind'],
          answer: 'ich bin',
        },
        {
          type: 'mc',
          prompt: 'jahre alt',
          options: ['jahre alt', 'monate alt', 'tage alt', 'stunden alt'],
          answer: 'jahre alt',
        },
        {
          type: 'match',
          pairs: [
            { left: 'bis bald', right: 'bis bald' },
            { left: 'schoenen tag noch', right: 'schoenen tag noch' },
            { left: 'pass auf dich auf', right: 'pass auf dich auf' },
          ],
        },
        {
          type: 'mc',
          prompt: 'gern geschehen',
          options: ['gern geschehen', 'dein vergnuegen', 'kein problem', 'natuerlich'],
          answer: 'gern geschehen',
        },
        {
          type: 'mc',
          prompt: 'bis spaeter',
          options: ['bis spaeter', 'bis jetzt', 'bis nie', 'bis gestern'],
          answer: 'bis spaeter',
        },
      ],
    },
    'pt-br': {
      exercises: [
        {
          type: 'mc',
          prompt: 'meu nome e',
          options: ['meu nome e', 'seu nome e', 'o nome dele e', 'eu sou'],
          answer: 'meu nome e',
        },
        {
          type: 'mc',
          prompt: 'como vai',
          options: ['como vai', 'quem e voce', 'onde voce esta', 'o que e isso'],
          answer: 'como vai',
        },
        {
          type: 'match',
          pairs: [
            { left: 'prazer em conhece-lo', right: 'prazer em conhece-lo' },
            { left: 'de onde voce e', right: 'de onde voce e' },
            { left: 'eu sou de', right: 'eu sou de' },
          ],
        },
        {
          type: 'mc',
          prompt: 'estou bem',
          options: ['estou bem', 'estou cansado', 'estou triste', 'estou com fome'],
          answer: 'estou bem',
        },
        {
          type: 'mc',
          prompt: 'e voce',
          options: ['e voce', 'e eu', 'e ele', 'e nos'],
          answer: 'e voce',
        },
        {
          type: 'mc',
          prompt: 'qual e seu nome',
          options: ['qual e seu nome', 'qual e o nome dele', 'quem e este', 'onde esta'],
          answer: 'qual e seu nome',
        },
        {
          type: 'mc',
          prompt: 'onde voce mora',
          options: ['onde voce mora', 'onde voce trabalha', 'quando voce dorme', 'por que voce pergunta'],
          answer: 'onde voce mora',
        },
        {
          type: 'match',
          pairs: [
            { left: 'eu moro em', right: 'eu moro em' },
            { left: 'eu venho de', right: 'eu venho de' },
            { left: 'eu falo', right: 'eu falo' },
            { left: 'voce fala', right: 'voce fala' },
          ],
        },
        {
          type: 'mc',
          prompt: 'muito prazer',
          options: ['muito prazer', 'tchau', 'ate logo', 'obrigado'],
          answer: 'muito prazer',
        },
        {
          type: 'mc',
          prompt: 'quantos anos voce tem',
          options: ['quantos anos voce tem', 'como voce esta', 'quantos', 'quanto'],
          answer: 'quantos anos voce tem',
        },
        {
          type: 'mc',
          prompt: 'eu tenho',
          options: ['eu tenho', 'voce tem', 'ele tem', 'nos temos'],
          answer: 'eu tenho',
        },
        {
          type: 'mc',
          prompt: 'anos',
          options: ['anos', 'meses', 'dias', 'horas'],
          answer: 'anos',
        },
        {
          type: 'match',
          pairs: [
            { left: 'ate breve', right: 'ate breve' },
            { left: 'tenha um bom dia', right: 'tenha um bom dia' },
            { left: 'se cuida', right: 'se cuida' },
          ],
        },
        {
          type: 'mc',
          prompt: 'de nada',
          options: ['de nada', 'seu prazer', 'sem problema', 'claro'],
          answer: 'de nada',
        },
        {
          type: 'mc',
          prompt: 'ate mais tarde',
          options: ['ate mais tarde', 'ate agora', 'ate nunca', 'ate ontem'],
          answer: 'ate mais tarde',
        },
      ],
    },
  },
  'level-1-5': {
    en: {
      exercises: [
        {
          type: 'mc',
          prompt: 'red',
          options: ['red', 'blue', 'green', 'yellow'],
          answer: 'red',
        },
        {
          type: 'mc',
          prompt: 'blue',
          options: ['blue', 'red', 'green', 'black'],
          answer: 'blue',
        },
        {
          type: 'match',
          pairs: [
            { left: 'yellow', right: 'yellow' },
            { left: 'green', right: 'green' },
            { left: 'white', right: 'white' },
          ],
        },
        {
          type: 'mc',
          prompt: 'black',
          options: ['black', 'white', 'gray', 'brown'],
          answer: 'black',
        },
        {
          type: 'mc',
          prompt: 'white',
          options: ['white', 'black', 'red', 'blue'],
          answer: 'white',
        },
        {
          type: 'mc',
          prompt: 'orange',
          options: ['orange', 'purple', 'pink', 'brown'],
          answer: 'orange',
        },
        {
          type: 'mc',
          prompt: 'purple',
          options: ['purple', 'pink', 'orange', 'gray'],
          answer: 'purple',
        },
        {
          type: 'match',
          pairs: [
            { left: 'pink', right: 'pink' },
            { left: 'brown', right: 'brown' },
            { left: 'gray', right: 'gray' },
            { left: 'color', right: 'color' },
          ],
        },
        {
          type: 'mc',
          prompt: 'big',
          options: ['big', 'small', 'tall', 'short'],
          answer: 'big',
        },
        {
          type: 'mc',
          prompt: 'small',
          options: ['small', 'big', 'tiny', 'large'],
          answer: 'small',
        },
        {
          type: 'mc',
          prompt: 'new',
          options: ['new', 'old', 'young', 'fresh'],
          answer: 'new',
        },
        {
          type: 'mc',
          prompt: 'old',
          options: ['old', 'new', 'ancient', 'modern'],
          answer: 'old',
        },
        {
          type: 'match',
          pairs: [
            { left: 'good', right: 'good' },
            { left: 'bad', right: 'bad' },
            { left: 'nice', right: 'nice' },
          ],
        },
        {
          type: 'mc',
          prompt: 'hot',
          options: ['hot', 'cold', 'warm', 'cool'],
          answer: 'hot',
        },
        {
          type: 'mc',
          prompt: 'cold',
          options: ['cold', 'hot', 'warm', 'freezing'],
          answer: 'cold',
        },
      ],
    },
    de: {
      exercises: [
        {
          type: 'mc',
          prompt: 'rot',
          options: ['rot', 'blau', 'gruen', 'gelb'],
          answer: 'rot',
        },
        {
          type: 'mc',
          prompt: 'blau',
          options: ['blau', 'rot', 'gruen', 'schwarz'],
          answer: 'blau',
        },
        {
          type: 'match',
          pairs: [
            { left: 'gelb', right: 'gelb' },
            { left: 'gruen', right: 'gruen' },
            { left: 'weiss', right: 'weiss' },
          ],
        },
        {
          type: 'mc',
          prompt: 'schwarz',
          options: ['schwarz', 'weiss', 'grau', 'braun'],
          answer: 'schwarz',
        },
        {
          type: 'mc',
          prompt: 'weiss',
          options: ['weiss', 'schwarz', 'rot', 'blau'],
          answer: 'weiss',
        },
        {
          type: 'mc',
          prompt: 'orange',
          options: ['orange', 'lila', 'rosa', 'braun'],
          answer: 'orange',
        },
        {
          type: 'mc',
          prompt: 'lila',
          options: ['lila', 'rosa', 'orange', 'grau'],
          answer: 'lila',
        },
        {
          type: 'match',
          pairs: [
            { left: 'rosa', right: 'rosa' },
            { left: 'braun', right: 'braun' },
            { left: 'grau', right: 'grau' },
            { left: 'farbe', right: 'farbe' },
          ],
        },
        {
          type: 'mc',
          prompt: 'gross',
          options: ['gross', 'klein', 'hoch', 'kurz'],
          answer: 'gross',
        },
        {
          type: 'mc',
          prompt: 'klein',
          options: ['klein', 'gross', 'winzig', 'riesig'],
          answer: 'klein',
        },
        {
          type: 'mc',
          prompt: 'neu',
          options: ['neu', 'alt', 'jung', 'frisch'],
          answer: 'neu',
        },
        {
          type: 'mc',
          prompt: 'alt',
          options: ['alt', 'neu', 'antik', 'modern'],
          answer: 'alt',
        },
        {
          type: 'match',
          pairs: [
            { left: 'gut', right: 'gut' },
            { left: 'schlecht', right: 'schlecht' },
            { left: 'schoen', right: 'schoen' },
          ],
        },
        {
          type: 'mc',
          prompt: 'heiss',
          options: ['heiss', 'kalt', 'warm', 'kuhl'],
          answer: 'heiss',
        },
        {
          type: 'mc',
          prompt: 'kalt',
          options: ['kalt', 'heiss', 'warm', 'eisig'],
          answer: 'kalt',
        },
      ],
    },
    'pt-br': {
      exercises: [
        {
          type: 'mc',
          prompt: 'vermelho',
          options: ['vermelho', 'azul', 'verde', 'amarelo'],
          answer: 'vermelho',
        },
        {
          type: 'mc',
          prompt: 'azul',
          options: ['azul', 'vermelho', 'verde', 'preto'],
          answer: 'azul',
        },
        {
          type: 'match',
          pairs: [
            { left: 'amarelo', right: 'amarelo' },
            { left: 'verde', right: 'verde' },
            { left: 'branco', right: 'branco' },
          ],
        },
        {
          type: 'mc',
          prompt: 'preto',
          options: ['preto', 'branco', 'cinza', 'marrom'],
          answer: 'preto',
        },
        {
          type: 'mc',
          prompt: 'branco',
          options: ['branco', 'preto', 'vermelho', 'azul'],
          answer: 'branco',
        },
        {
          type: 'mc',
          prompt: 'laranja',
          options: ['laranja', 'roxo', 'rosa', 'marrom'],
          answer: 'laranja',
        },
        {
          type: 'mc',
          prompt: 'roxo',
          options: ['roxo', 'rosa', 'laranja', 'cinza'],
          answer: 'roxo',
        },
        {
          type: 'match',
          pairs: [
            { left: 'rosa', right: 'rosa' },
            { left: 'marrom', right: 'marrom' },
            { left: 'cinza', right: 'cinza' },
            { left: 'cor', right: 'cor' },
          ],
        },
        {
          type: 'mc',
          prompt: 'grande',
          options: ['grande', 'pequeno', 'alto', 'baixo'],
          answer: 'grande',
        },
        {
          type: 'mc',
          prompt: 'pequeno',
          options: ['pequeno', 'grande', 'minusculo', 'enorme'],
          answer: 'pequeno',
        },
        {
          type: 'mc',
          prompt: 'novo',
          options: ['novo', 'velho', 'jovem', 'fresco'],
          answer: 'novo',
        },
        {
          type: 'mc',
          prompt: 'velho',
          options: ['velho', 'novo', 'antigo', 'moderno'],
          answer: 'velho',
        },
        {
          type: 'match',
          pairs: [
            { left: 'bom', right: 'bom' },
            { left: 'mau', right: 'mau' },
            { left: 'bonito', right: 'bonito' },
          ],
        },
        {
          type: 'mc',
          prompt: 'quente',
          options: ['quente', 'frio', 'morno', 'fresco'],
          answer: 'quente',
        },
        {
          type: 'mc',
          prompt: 'frio',
          options: ['frio', 'quente', 'morno', 'gelado'],
          answer: 'frio',
        },
      ],
    },
  },
  'level-1-6': {
    en: {
      exercises: [
        {
          type: 'mc',
          prompt: 'Monday',
          options: ['Monday', 'Tuesday', 'Sunday', 'Friday'],
          answer: 'Monday',
        },
        {
          type: 'mc',
          prompt: 'Tuesday',
          options: ['Tuesday', 'Monday', 'Wednesday', 'Thursday'],
          answer: 'Tuesday',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Wednesday', right: 'Wednesday' },
            { left: 'Thursday', right: 'Thursday' },
            { left: 'Friday', right: 'Friday' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Saturday',
          options: ['Saturday', 'Sunday', 'Friday', 'Monday'],
          answer: 'Saturday',
        },
        {
          type: 'mc',
          prompt: 'Sunday',
          options: ['Sunday', 'Saturday', 'Monday', 'Tuesday'],
          answer: 'Sunday',
        },
        {
          type: 'mc',
          prompt: 'today',
          options: ['today', 'tomorrow', 'yesterday', 'now'],
          answer: 'today',
        },
        {
          type: 'mc',
          prompt: 'tomorrow',
          options: ['tomorrow', 'today', 'yesterday', 'next week'],
          answer: 'tomorrow',
        },
        {
          type: 'match',
          pairs: [
            { left: 'yesterday', right: 'yesterday' },
            { left: 'week', right: 'week' },
            { left: 'day', right: 'day' },
            { left: 'month', right: 'month' },
          ],
        },
        {
          type: 'mc',
          prompt: 'January',
          options: ['January', 'February', 'March', 'December'],
          answer: 'January',
        },
        {
          type: 'mc',
          prompt: 'February',
          options: ['February', 'January', 'March', 'April'],
          answer: 'February',
        },
        {
          type: 'mc',
          prompt: 'March',
          options: ['March', 'April', 'May', 'June'],
          answer: 'March',
        },
        {
          type: 'mc',
          prompt: 'April',
          options: ['April', 'March', 'May', 'June'],
          answer: 'April',
        },
        {
          type: 'match',
          pairs: [
            { left: 'May', right: 'May' },
            { left: 'June', right: 'June' },
            { left: 'July', right: 'July' },
          ],
        },
        {
          type: 'mc',
          prompt: 'August',
          options: ['August', 'July', 'September', 'October'],
          answer: 'August',
        },
        {
          type: 'mc',
          prompt: 'December',
          options: ['December', 'November', 'January', 'February'],
          answer: 'December',
        },
      ],
    },
    de: {
      exercises: [
        {
          type: 'mc',
          prompt: 'Montag',
          options: ['Montag', 'Dienstag', 'Sonntag', 'Freitag'],
          answer: 'Montag',
        },
        {
          type: 'mc',
          prompt: 'Dienstag',
          options: ['Dienstag', 'Montag', 'Mittwoch', 'Donnerstag'],
          answer: 'Dienstag',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Mittwoch', right: 'Mittwoch' },
            { left: 'Donnerstag', right: 'Donnerstag' },
            { left: 'Freitag', right: 'Freitag' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Samstag',
          options: ['Samstag', 'Sonntag', 'Freitag', 'Montag'],
          answer: 'Samstag',
        },
        {
          type: 'mc',
          prompt: 'Sonntag',
          options: ['Sonntag', 'Samstag', 'Montag', 'Dienstag'],
          answer: 'Sonntag',
        },
        {
          type: 'mc',
          prompt: 'heute',
          options: ['heute', 'morgen', 'gestern', 'jetzt'],
          answer: 'heute',
        },
        {
          type: 'mc',
          prompt: 'morgen',
          options: ['morgen', 'heute', 'gestern', 'naechste woche'],
          answer: 'morgen',
        },
        {
          type: 'match',
          pairs: [
            { left: 'gestern', right: 'gestern' },
            { left: 'woche', right: 'woche' },
            { left: 'tag', right: 'tag' },
            { left: 'monat', right: 'monat' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Januar',
          options: ['Januar', 'Februar', 'Maerz', 'Dezember'],
          answer: 'Januar',
        },
        {
          type: 'mc',
          prompt: 'Februar',
          options: ['Februar', 'Januar', 'Maerz', 'April'],
          answer: 'Februar',
        },
        {
          type: 'mc',
          prompt: 'Maerz',
          options: ['Maerz', 'April', 'Mai', 'Juni'],
          answer: 'Maerz',
        },
        {
          type: 'mc',
          prompt: 'April',
          options: ['April', 'Maerz', 'Mai', 'Juni'],
          answer: 'April',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Mai', right: 'Mai' },
            { left: 'Juni', right: 'Juni' },
            { left: 'Juli', right: 'Juli' },
          ],
        },
        {
          type: 'mc',
          prompt: 'August',
          options: ['August', 'Juli', 'September', 'Oktober'],
          answer: 'August',
        },
        {
          type: 'mc',
          prompt: 'Dezember',
          options: ['Dezember', 'November', 'Januar', 'Februar'],
          answer: 'Dezember',
        },
      ],
    },
    'pt-br': {
      exercises: [
        {
          type: 'mc',
          prompt: 'segunda-feira',
          options: ['segunda-feira', 'terca-feira', 'domingo', 'sexta-feira'],
          answer: 'segunda-feira',
        },
        {
          type: 'mc',
          prompt: 'terca-feira',
          options: ['terca-feira', 'segunda-feira', 'quarta-feira', 'quinta-feira'],
          answer: 'terca-feira',
        },
        {
          type: 'match',
          pairs: [
            { left: 'quarta-feira', right: 'quarta-feira' },
            { left: 'quinta-feira', right: 'quinta-feira' },
            { left: 'sexta-feira', right: 'sexta-feira' },
          ],
        },
        {
          type: 'mc',
          prompt: 'sabado',
          options: ['sabado', 'domingo', 'sexta-feira', 'segunda-feira'],
          answer: 'sabado',
        },
        {
          type: 'mc',
          prompt: 'domingo',
          options: ['domingo', 'sabado', 'segunda-feira', 'terca-feira'],
          answer: 'domingo',
        },
        {
          type: 'mc',
          prompt: 'hoje',
          options: ['hoje', 'amanha', 'ontem', 'agora'],
          answer: 'hoje',
        },
        {
          type: 'mc',
          prompt: 'amanha',
          options: ['amanha', 'hoje', 'ontem', 'proxima semana'],
          answer: 'amanha',
        },
        {
          type: 'match',
          pairs: [
            { left: 'ontem', right: 'ontem' },
            { left: 'semana', right: 'semana' },
            { left: 'dia', right: 'dia' },
            { left: 'mes', right: 'mes' },
          ],
        },
        {
          type: 'mc',
          prompt: 'janeiro',
          options: ['janeiro', 'fevereiro', 'marco', 'dezembro'],
          answer: 'janeiro',
        },
        {
          type: 'mc',
          prompt: 'fevereiro',
          options: ['fevereiro', 'janeiro', 'marco', 'abril'],
          answer: 'fevereiro',
        },
        {
          type: 'mc',
          prompt: 'marco',
          options: ['marco', 'abril', 'maio', 'junho'],
          answer: 'marco',
        },
        {
          type: 'mc',
          prompt: 'abril',
          options: ['abril', 'marco', 'maio', 'junho'],
          answer: 'abril',
        },
        {
          type: 'match',
          pairs: [
            { left: 'maio', right: 'maio' },
            { left: 'junho', right: 'junho' },
            { left: 'julho', right: 'julho' },
          ],
        },
        {
          type: 'mc',
          prompt: 'agosto',
          options: ['agosto', 'julho', 'setembro', 'outubro'],
          answer: 'agosto',
        },
        {
          type: 'mc',
          prompt: 'dezembro',
          options: ['dezembro', 'novembro', 'janeiro', 'fevereiro'],
          answer: 'dezembro',
        },
      ],
    },
  },
  'level-1-7': {
    en: {
      exercises: [
        {
          type: 'mc',
          prompt: 'sunny',
          options: ['sunny', 'rainy', 'cloudy', 'windy'],
          answer: 'sunny',
        },
        {
          type: 'mc',
          prompt: 'rainy',
          options: ['rainy', 'sunny', 'snowy', 'foggy'],
          answer: 'rainy',
        },
        {
          type: 'match',
          pairs: [
            { left: 'cloudy', right: 'cloudy' },
            { left: 'windy', right: 'windy' },
            { left: 'snowy', right: 'snowy' },
          ],
        },
        {
          type: 'mc',
          prompt: 'weather',
          options: ['weather', 'climate', 'temperature', 'forecast'],
          answer: 'weather',
        },
        {
          type: 'mc',
          prompt: 'warm',
          options: ['warm', 'hot', 'cold', 'cool'],
          answer: 'warm',
        },
        {
          type: 'mc',
          prompt: 'cool',
          options: ['cool', 'warm', 'cold', 'freezing'],
          answer: 'cool',
        },
        {
          type: 'mc',
          prompt: 'spring',
          options: ['spring', 'summer', 'autumn', 'winter'],
          answer: 'spring',
        },
        {
          type: 'match',
          pairs: [
            { left: 'summer', right: 'summer' },
            { left: 'autumn', right: 'autumn' },
            { left: 'winter', right: 'winter' },
            { left: 'season', right: 'season' },
          ],
        },
        {
          type: 'mc',
          prompt: 'rain',
          options: ['rain', 'snow', 'sun', 'wind'],
          answer: 'rain',
        },
        {
          type: 'mc',
          prompt: 'snow',
          options: ['snow', 'rain', 'hail', 'ice'],
          answer: 'snow',
        },
        {
          type: 'mc',
          prompt: 'sun',
          options: ['sun', 'moon', 'star', 'cloud'],
          answer: 'sun',
        },
        {
          type: 'mc',
          prompt: 'wind',
          options: ['wind', 'breeze', 'storm', 'hurricane'],
          answer: 'wind',
        },
        {
          type: 'match',
          pairs: [
            { left: 'storm', right: 'storm' },
            { left: 'fog', right: 'fog' },
            { left: 'ice', right: 'ice' },
          ],
        },
        {
          type: 'mc',
          prompt: 'beautiful',
          options: ['beautiful', 'ugly', 'nice', 'terrible'],
          answer: 'beautiful',
        },
        {
          type: 'mc',
          prompt: 'terrible',
          options: ['terrible', 'beautiful', 'awful', 'bad'],
          answer: 'terrible',
        },
      ],
    },
    de: {
      exercises: [
        {
          type: 'mc',
          prompt: 'sonnig',
          options: ['sonnig', 'regnerisch', 'wolkig', 'windig'],
          answer: 'sonnig',
        },
        {
          type: 'mc',
          prompt: 'regnerisch',
          options: ['regnerisch', 'sonnig', 'schneeig', 'neblig'],
          answer: 'regnerisch',
        },
        {
          type: 'match',
          pairs: [
            { left: 'wolkig', right: 'wolkig' },
            { left: 'windig', right: 'windig' },
            { left: 'schneeig', right: 'schneeig' },
          ],
        },
        {
          type: 'mc',
          prompt: 'wetter',
          options: ['wetter', 'klima', 'temperatur', 'vorhersage'],
          answer: 'wetter',
        },
        {
          type: 'mc',
          prompt: 'warm',
          options: ['warm', 'heiss', 'kalt', 'kuhl'],
          answer: 'warm',
        },
        {
          type: 'mc',
          prompt: 'kuhl',
          options: ['kuhl', 'warm', 'kalt', 'eisig'],
          answer: 'kuhl',
        },
        {
          type: 'mc',
          prompt: 'fruehling',
          options: ['fruehling', 'sommer', 'herbst', 'winter'],
          answer: 'fruehling',
        },
        {
          type: 'match',
          pairs: [
            { left: 'sommer', right: 'sommer' },
            { left: 'herbst', right: 'herbst' },
            { left: 'winter', right: 'winter' },
            { left: 'jahreszeit', right: 'jahreszeit' },
          ],
        },
        {
          type: 'mc',
          prompt: 'regen',
          options: ['regen', 'schnee', 'sonne', 'wind'],
          answer: 'regen',
        },
        {
          type: 'mc',
          prompt: 'schnee',
          options: ['schnee', 'regen', 'hagel', 'eis'],
          answer: 'schnee',
        },
        {
          type: 'mc',
          prompt: 'sonne',
          options: ['sonne', 'mond', 'stern', 'wolke'],
          answer: 'sonne',
        },
        {
          type: 'mc',
          prompt: 'wind',
          options: ['wind', 'brise', 'sturm', 'orkan'],
          answer: 'wind',
        },
        {
          type: 'match',
          pairs: [
            { left: 'sturm', right: 'sturm' },
            { left: 'nebel', right: 'nebel' },
            { left: 'eis', right: 'eis' },
          ],
        },
        {
          type: 'mc',
          prompt: 'schoen',
          options: ['schoen', 'haesslich', 'nett', 'schrecklich'],
          answer: 'schoen',
        },
        {
          type: 'mc',
          prompt: 'schrecklich',
          options: ['schrecklich', 'schoen', 'furchtbar', 'schlecht'],
          answer: 'schrecklich',
        },
      ],
    },
    'pt-br': {
      exercises: [
        {
          type: 'mc',
          prompt: 'ensolarado',
          options: ['ensolarado', 'chuvoso', 'nublado', 'ventoso'],
          answer: 'ensolarado',
        },
        {
          type: 'mc',
          prompt: 'chuvoso',
          options: ['chuvoso', 'ensolarado', 'nevando', 'nebuloso'],
          answer: 'chuvoso',
        },
        {
          type: 'match',
          pairs: [
            { left: 'nublado', right: 'nublado' },
            { left: 'ventoso', right: 'ventoso' },
            { left: 'nevando', right: 'nevando' },
          ],
        },
        {
          type: 'mc',
          prompt: 'tempo',
          options: ['tempo', 'clima', 'temperatura', 'previsao'],
          answer: 'tempo',
        },
        {
          type: 'mc',
          prompt: 'morno',
          options: ['morno', 'quente', 'frio', 'fresco'],
          answer: 'morno',
        },
        {
          type: 'mc',
          prompt: 'fresco',
          options: ['fresco', 'morno', 'frio', 'gelado'],
          answer: 'fresco',
        },
        {
          type: 'mc',
          prompt: 'primavera',
          options: ['primavera', 'verao', 'outono', 'inverno'],
          answer: 'primavera',
        },
        {
          type: 'match',
          pairs: [
            { left: 'verao', right: 'verao' },
            { left: 'outono', right: 'outono' },
            { left: 'inverno', right: 'inverno' },
            { left: 'estacao', right: 'estacao' },
          ],
        },
        {
          type: 'mc',
          prompt: 'chuva',
          options: ['chuva', 'neve', 'sol', 'vento'],
          answer: 'chuva',
        },
        {
          type: 'mc',
          prompt: 'neve',
          options: ['neve', 'chuva', 'granizo', 'gelo'],
          answer: 'neve',
        },
        {
          type: 'mc',
          prompt: 'sol',
          options: ['sol', 'lua', 'estrela', 'nuvem'],
          answer: 'sol',
        },
        {
          type: 'mc',
          prompt: 'vento',
          options: ['vento', 'brisa', 'tempestade', 'furacao'],
          answer: 'vento',
        },
        {
          type: 'match',
          pairs: [
            { left: 'tempestade', right: 'tempestade' },
            { left: 'nevoa', right: 'nevoa' },
            { left: 'gelo', right: 'gelo' },
          ],
        },
        {
          type: 'mc',
          prompt: 'lindo',
          options: ['lindo', 'feio', 'bonito', 'terrivel'],
          answer: 'lindo',
        },
        {
          type: 'mc',
          prompt: 'terrivel',
          options: ['terrivel', 'lindo', 'horrivel', 'ruim'],
          answer: 'terrivel',
        },
      ],
    },
  },
  'level-1-8': {
    en: {
      exercises: [
        {
          type: 'mc',
          prompt: 'book',
          options: ['book', 'notebook', 'pen', 'pencil'],
          answer: 'book',
        },
        {
          type: 'mc',
          prompt: 'pen',
          options: ['pen', 'pencil', 'eraser', 'ruler'],
          answer: 'pen',
        },
        {
          type: 'match',
          pairs: [
            { left: 'pencil', right: 'pencil' },
            { left: 'eraser', right: 'eraser' },
            { left: 'paper', right: 'paper' },
          ],
        },
        {
          type: 'mc',
          prompt: 'notebook',
          options: ['notebook', 'book', 'folder', 'binder'],
          answer: 'notebook',
        },
        {
          type: 'mc',
          prompt: 'desk',
          options: ['desk', 'chair', 'table', 'board'],
          answer: 'desk',
        },
        {
          type: 'mc',
          prompt: 'blackboard',
          options: ['blackboard', 'whiteboard', 'desk', 'wall'],
          answer: 'blackboard',
        },
        {
          type: 'mc',
          prompt: 'teacher',
          options: ['teacher', 'student', 'principal', 'professor'],
          answer: 'teacher',
        },
        {
          type: 'match',
          pairs: [
            { left: 'student', right: 'student' },
            { left: 'class', right: 'class' },
            { left: 'school', right: 'school' },
            { left: 'lesson', right: 'lesson' },
          ],
        },
        {
          type: 'mc',
          prompt: 'read',
          options: ['read', 'write', 'listen', 'speak'],
          answer: 'read',
        },
        {
          type: 'mc',
          prompt: 'write',
          options: ['write', 'read', 'draw', 'erase'],
          answer: 'write',
        },
        {
          type: 'mc',
          prompt: 'learn',
          options: ['learn', 'teach', 'study', 'practice'],
          answer: 'learn',
        },
        {
          type: 'mc',
          prompt: 'study',
          options: ['study', 'learn', 'practice', 'review'],
          answer: 'study',
        },
        {
          type: 'match',
          pairs: [
            { left: 'homework', right: 'homework' },
            { left: 'test', right: 'test' },
            { left: 'exam', right: 'exam' },
          ],
        },
        {
          type: 'mc',
          prompt: 'question',
          options: ['question', 'answer', 'problem', 'exercise'],
          answer: 'question',
        },
        {
          type: 'mc',
          prompt: 'answer',
          options: ['answer', 'question', 'solution', 'response'],
          answer: 'answer',
        },
      ],
    },
    de: {
      exercises: [
        {
          type: 'mc',
          prompt: 'buch',
          options: ['buch', 'heft', 'stift', 'bleistift'],
          answer: 'buch',
        },
        {
          type: 'mc',
          prompt: 'stift',
          options: ['stift', 'bleistift', 'radiergummi', 'lineal'],
          answer: 'stift',
        },
        {
          type: 'match',
          pairs: [
            { left: 'bleistift', right: 'bleistift' },
            { left: 'radiergummi', right: 'radiergummi' },
            { left: 'papier', right: 'papier' },
          ],
        },
        {
          type: 'mc',
          prompt: 'heft',
          options: ['heft', 'buch', 'ordner', 'mappe'],
          answer: 'heft',
        },
        {
          type: 'mc',
          prompt: 'schreibtisch',
          options: ['schreibtisch', 'stuhl', 'tisch', 'tafel'],
          answer: 'schreibtisch',
        },
        {
          type: 'mc',
          prompt: 'tafel',
          options: ['tafel', 'whiteboard', 'schreibtisch', 'wand'],
          answer: 'tafel',
        },
        {
          type: 'mc',
          prompt: 'lehrer',
          options: ['lehrer', 'schueler', 'direktor', 'professor'],
          answer: 'lehrer',
        },
        {
          type: 'match',
          pairs: [
            { left: 'schueler', right: 'schueler' },
            { left: 'klasse', right: 'klasse' },
            { left: 'schule', right: 'schule' },
            { left: 'unterricht', right: 'unterricht' },
          ],
        },
        {
          type: 'mc',
          prompt: 'lesen',
          options: ['lesen', 'schreiben', 'hoeren', 'sprechen'],
          answer: 'lesen',
        },
        {
          type: 'mc',
          prompt: 'schreiben',
          options: ['schreiben', 'lesen', 'zeichnen', 'loeschen'],
          answer: 'schreiben',
        },
        {
          type: 'mc',
          prompt: 'lernen',
          options: ['lernen', 'lehren', 'studieren', 'ueben'],
          answer: 'lernen',
        },
        {
          type: 'mc',
          prompt: 'studieren',
          options: ['studieren', 'lernen', 'ueben', 'wiederholen'],
          answer: 'studieren',
        },
        {
          type: 'match',
          pairs: [
            { left: 'hausaufgabe', right: 'hausaufgabe' },
            { left: 'test', right: 'test' },
            { left: 'pruefung', right: 'pruefung' },
          ],
        },
        {
          type: 'mc',
          prompt: 'frage',
          options: ['frage', 'antwort', 'problem', 'aufgabe'],
          answer: 'frage',
        },
        {
          type: 'mc',
          prompt: 'antwort',
          options: ['antwort', 'frage', 'loesung', 'reaktion'],
          answer: 'antwort',
        },
      ],
    },
    'pt-br': {
      exercises: [
        {
          type: 'mc',
          prompt: 'livro',
          options: ['livro', 'caderno', 'caneta', 'lapis'],
          answer: 'livro',
        },
        {
          type: 'mc',
          prompt: 'caneta',
          options: ['caneta', 'lapis', 'borracha', 'regua'],
          answer: 'caneta',
        },
        {
          type: 'match',
          pairs: [
            { left: 'lapis', right: 'lapis' },
            { left: 'borracha', right: 'borracha' },
            { left: 'papel', right: 'papel' },
          ],
        },
        {
          type: 'mc',
          prompt: 'caderno',
          options: ['caderno', 'livro', 'pasta', 'fichario'],
          answer: 'caderno',
        },
        {
          type: 'mc',
          prompt: 'escrivaninha',
          options: ['escrivaninha', 'cadeira', 'mesa', 'quadro'],
          answer: 'escrivaninha',
        },
        {
          type: 'mc',
          prompt: 'quadro-negro',
          options: ['quadro-negro', 'quadro-branco', 'escrivaninha', 'parede'],
          answer: 'quadro-negro',
        },
        {
          type: 'mc',
          prompt: 'professor',
          options: ['professor', 'aluno', 'diretor', 'mestre'],
          answer: 'professor',
        },
        {
          type: 'match',
          pairs: [
            { left: 'aluno', right: 'aluno' },
            { left: 'aula', right: 'aula' },
            { left: 'escola', right: 'escola' },
            { left: 'licao', right: 'licao' },
          ],
        },
        {
          type: 'mc',
          prompt: 'ler',
          options: ['ler', 'escrever', 'ouvir', 'falar'],
          answer: 'ler',
        },
        {
          type: 'mc',
          prompt: 'escrever',
          options: ['escrever', 'ler', 'desenhar', 'apagar'],
          answer: 'escrever',
        },
        {
          type: 'mc',
          prompt: 'aprender',
          options: ['aprender', 'ensinar', 'estudar', 'praticar'],
          answer: 'aprender',
        },
        {
          type: 'mc',
          prompt: 'estudar',
          options: ['estudar', 'aprender', 'praticar', 'revisar'],
          answer: 'estudar',
        },
        {
          type: 'match',
          pairs: [
            { left: 'dever de casa', right: 'dever de casa' },
            { left: 'teste', right: 'teste' },
            { left: 'exame', right: 'exame' },
          ],
        },
        {
          type: 'mc',
          prompt: 'pergunta',
          options: ['pergunta', 'resposta', 'problema', 'exercicio'],
          answer: 'pergunta',
        },
        {
          type: 'mc',
          prompt: 'resposta',
          options: ['resposta', 'pergunta', 'solucao', 'reacao'],
          answer: 'resposta',
        },
      ],
    },
  },
  'level-1-test': {
    en: {
      exercises: [
        {
          type: 'mc',
          prompt: 'I',
          options: ['I', 'you', 'he', 'we'],
          answer: 'I',
        },
        {
          type: 'mc',
          prompt: 'hello',
          options: ['hello', 'goodbye', 'night', 'morning'],
          answer: 'hello',
        },
        {
          type: 'mc',
          prompt: 'three',
          options: ['three', 'four', 'six', 'nine'],
          answer: 'three',
        },
        {
          type: 'match',
          pairs: [
            { left: 'thank you', right: 'thank you' },
            { left: 'please', right: 'please' },
            { left: 'excuse me', right: 'excuse me' },
          ],
        },
        {
          type: 'mc',
          prompt: 'what is your name',
          options: ['what is your name', 'what is his name', 'who is this', 'where is it'],
          answer: 'what is your name',
        },
        {
          type: 'mc',
          prompt: 'five',
          options: ['five', 'six', 'three', 'nine'],
          answer: 'five',
        },
        {
          type: 'mc',
          prompt: 'good morning',
          options: ['good morning', 'good night', 'goodbye', 'hello'],
          answer: 'good morning',
        },
        {
          type: 'match',
          pairs: [
            { left: 'man', right: 'man' },
            { left: 'woman', right: 'woman' },
            { left: 'child', right: 'child' },
            { left: 'person', right: 'person' },
          ],
        },
        {
          type: 'mc',
          prompt: 'where are you from',
          options: ['where are you from', 'where do you work', 'when do you sleep', 'who are you'],
          answer: 'where are you from',
        },
        {
          type: 'mc',
          prompt: 'yes',
          options: ['yes', 'no', 'maybe', 'okay'],
          answer: 'yes',
        },
        {
          type: 'mc',
          prompt: 'ten',
          options: ['ten', 'one', 'four', 'eight'],
          answer: 'ten',
        },
        {
          type: 'mc',
          prompt: 'goodbye',
          options: ['goodbye', 'hello', 'welcome', 'thanks'],
          answer: 'goodbye',
        },
        {
          type: 'match',
          pairs: [
            { left: 'I am from', right: 'I am from' },
            { left: 'nice to meet you', right: 'nice to meet you' },
            { left: 'how are you', right: 'how are you' },
          ],
        },
        {
          type: 'mc',
          prompt: 'she',
          options: ['she', 'he', 'it', 'they'],
          answer: 'she',
        },
        {
          type: 'mc',
          prompt: 'time',
          options: ['time', 'hour', 'minute', 'second'],
          answer: 'time',
        },
      ],
    },
    de: {
      exercises: [
        {
          type: 'mc',
          prompt: 'ich',
          options: ['ich', 'du', 'er', 'wir'],
          answer: 'ich',
        },
        {
          type: 'mc',
          prompt: 'hallo',
          options: ['hallo', 'tschuess', 'nacht', 'morgen'],
          answer: 'hallo',
        },
        {
          type: 'mc',
          prompt: 'drei',
          options: ['drei', 'vier', 'sechs', 'neun'],
          answer: 'drei',
        },
        {
          type: 'match',
          pairs: [
            { left: 'danke', right: 'danke' },
            { left: 'bitte', right: 'bitte' },
            { left: 'verzeihung', right: 'verzeihung' },
          ],
        },
        {
          type: 'mc',
          prompt: 'wie heisst du',
          options: ['wie heisst du', 'wie heisst er', 'wer ist das', 'wo ist es'],
          answer: 'wie heisst du',
        },
        {
          type: 'mc',
          prompt: 'fuenf',
          options: ['fuenf', 'sechs', 'drei', 'neun'],
          answer: 'fuenf',
        },
        {
          type: 'mc',
          prompt: 'guten morgen',
          options: ['guten morgen', 'gute nacht', 'tschuess', 'hallo'],
          answer: 'guten morgen',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Mann', right: 'Mann' },
            { left: 'Frau', right: 'Frau' },
            { left: 'Kind', right: 'Kind' },
            { left: 'Person', right: 'Person' },
          ],
        },
        {
          type: 'mc',
          prompt: 'woher kommst du',
          options: ['woher kommst du', 'wo arbeitest du', 'wann schlaefst du', 'wer bist du'],
          answer: 'woher kommst du',
        },
        {
          type: 'mc',
          prompt: 'ja',
          options: ['ja', 'nein', 'vielleicht', 'okay'],
          answer: 'ja',
        },
        {
          type: 'mc',
          prompt: 'zehn',
          options: ['zehn', 'eins', 'vier', 'acht'],
          answer: 'zehn',
        },
        {
          type: 'mc',
          prompt: 'tschuess',
          options: ['tschuess', 'hallo', 'willkommen', 'danke'],
          answer: 'tschuess',
        },
        {
          type: 'match',
          pairs: [
            { left: 'ich komme aus', right: 'ich komme aus' },
            { left: 'freut mich', right: 'freut mich' },
            { left: 'wie geht es dir', right: 'wie geht es dir' },
          ],
        },
        {
          type: 'mc',
          prompt: 'sie',
          options: ['sie', 'er', 'es', 'ihr'],
          answer: 'sie',
        },
        {
          type: 'mc',
          prompt: 'zeit',
          options: ['zeit', 'stunde', 'minute', 'sekunde'],
          answer: 'zeit',
        },
      ],
    },
    'pt-br': {
      exercises: [
        {
          type: 'mc',
          prompt: 'eu',
          options: ['eu', 'voce', 'ele', 'nos'],
          answer: 'eu',
        },
        {
          type: 'mc',
          prompt: 'ola',
          options: ['ola', 'tchau', 'noite', 'manha'],
          answer: 'ola',
        },
        {
          type: 'mc',
          prompt: 'tres',
          options: ['tres', 'quatro', 'seis', 'nove'],
          answer: 'tres',
        },
        {
          type: 'match',
          pairs: [
            { left: 'obrigado', right: 'obrigado' },
            { left: 'por favor', right: 'por favor' },
            { left: 'com licenca', right: 'com licenca' },
          ],
        },
        {
          type: 'mc',
          prompt: 'qual e seu nome',
          options: ['qual e seu nome', 'qual e o nome dele', 'quem e este', 'onde esta'],
          answer: 'qual e seu nome',
        },
        {
          type: 'mc',
          prompt: 'cinco',
          options: ['cinco', 'seis', 'tres', 'nove'],
          answer: 'cinco',
        },
        {
          type: 'mc',
          prompt: 'bom dia',
          options: ['bom dia', 'boa noite', 'tchau', 'ola'],
          answer: 'bom dia',
        },
        {
          type: 'match',
          pairs: [
            { left: 'homem', right: 'homem' },
            { left: 'mulher', right: 'mulher' },
            { left: 'crianca', right: 'crianca' },
            { left: 'pessoa', right: 'pessoa' },
          ],
        },
        {
          type: 'mc',
          prompt: 'de onde voce e',
          options: ['de onde voce e', 'onde voce trabalha', 'quando voce dorme', 'quem e voce'],
          answer: 'de onde voce e',
        },
        {
          type: 'mc',
          prompt: 'sim',
          options: ['sim', 'nao', 'talvez', 'ok'],
          answer: 'sim',
        },
        {
          type: 'mc',
          prompt: 'dez',
          options: ['dez', 'um', 'quatro', 'oito'],
          answer: 'dez',
        },
        {
          type: 'mc',
          prompt: 'tchau',
          options: ['tchau', 'ola', 'bem-vindo', 'obrigado'],
          answer: 'tchau',
        },
        {
          type: 'match',
          pairs: [
            { left: 'eu sou de', right: 'eu sou de' },
            { left: 'prazer em conhece-lo', right: 'prazer em conhece-lo' },
            { left: 'como vai', right: 'como vai' },
          ],
        },
        {
          type: 'mc',
          prompt: 'ela',
          options: ['ela', 'ele', 'nos', 'eles'],
          answer: 'ela',
        },
        {
          type: 'mc',
          prompt: 'hora',
          options: ['hora', 'tempo', 'minuto', 'segundo'],
          answer: 'hora',
        },
      ],
    },
  },
  'level-2-1': {
    en: {
      exercises: [
        {
          type: 'mc',
          prompt: 'bread',
          options: ['bread', 'cheese', 'coffee', 'water'],
          answer: 'bread',
        },
        {
          type: 'mc',
          prompt: 'milk',
          options: ['milk', 'tea', 'juice', 'water'],
          answer: 'milk',
        },
        {
          type: 'match',
          pairs: [
            { left: 'water', right: 'water' },
            { left: 'coffee', right: 'coffee' },
            { left: 'tea', right: 'tea' },
          ],
        },
        {
          type: 'mc',
          prompt: 'water',
          options: ['water', 'milk', 'juice', 'soda'],
          answer: 'water',
        },
        {
          type: 'mc',
          prompt: 'coffee',
          options: ['coffee', 'tea', 'milk', 'juice'],
          answer: 'coffee',
        },
        {
          type: 'mc',
          prompt: 'tea',
          options: ['tea', 'coffee', 'water', 'milk'],
          answer: 'tea',
        },
        {
          type: 'mc',
          prompt: 'cheese',
          options: ['cheese', 'bread', 'butter', 'ham'],
          answer: 'cheese',
        },
        {
          type: 'match',
          pairs: [
            { left: 'juice', right: 'juice' },
            { left: 'butter', right: 'butter' },
            { left: 'sugar', right: 'sugar' },
            { left: 'salt', right: 'salt' },
          ],
        },
        {
          type: 'mc',
          prompt: 'juice',
          options: ['juice', 'soda', 'water', 'milk'],
          answer: 'juice',
        },
        {
          type: 'mc',
          prompt: 'apple',
          options: ['apple', 'banana', 'orange', 'grape'],
          answer: 'apple',
        },
        {
          type: 'mc',
          prompt: 'egg',
          options: ['egg', 'meat', 'fish', 'chicken'],
          answer: 'egg',
        },
        {
          type: 'mc',
          prompt: 'rice',
          options: ['rice', 'pasta', 'potato', 'salad'],
          answer: 'rice',
        },
        {
          type: 'match',
          pairs: [
            { left: 'meat', right: 'meat' },
            { left: 'fish', right: 'fish' },
            { left: 'vegetables', right: 'vegetables' },
          ],
        },
        {
          type: 'mc',
          prompt: 'soup',
          options: ['soup', 'salad', 'sandwich', 'pizza'],
          answer: 'soup',
        },
        {
          type: 'mc',
          prompt: 'cake',
          options: ['cake', 'cookie', 'candy', 'chocolate'],
          answer: 'cake',
        },
      ],
    },
    de: {
      exercises: [
        {
          type: 'mc',
          prompt: 'Brot',
          options: ['Brot', 'Kaese', 'Kaffee', 'Wasser'],
          answer: 'Brot',
        },
        {
          type: 'mc',
          prompt: 'Milch',
          options: ['Milch', 'Tee', 'Saft', 'Wasser'],
          answer: 'Milch',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Wasser', right: 'Wasser' },
            { left: 'Kaffee', right: 'Kaffee' },
            { left: 'Tee', right: 'Tee' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Wasser',
          options: ['Wasser', 'Milch', 'Saft', 'Limonade'],
          answer: 'Wasser',
        },
        {
          type: 'mc',
          prompt: 'Kaffee',
          options: ['Kaffee', 'Tee', 'Milch', 'Saft'],
          answer: 'Kaffee',
        },
        {
          type: 'mc',
          prompt: 'Tee',
          options: ['Tee', 'Kaffee', 'Wasser', 'Milch'],
          answer: 'Tee',
        },
        {
          type: 'mc',
          prompt: 'Kaese',
          options: ['Kaese', 'Brot', 'Butter', 'Schinken'],
          answer: 'Kaese',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Saft', right: 'Saft' },
            { left: 'Butter', right: 'Butter' },
            { left: 'Zucker', right: 'Zucker' },
            { left: 'Salz', right: 'Salz' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Saft',
          options: ['Saft', 'Limonade', 'Wasser', 'Milch'],
          answer: 'Saft',
        },
        {
          type: 'mc',
          prompt: 'Apfel',
          options: ['Apfel', 'Banane', 'Orange', 'Traube'],
          answer: 'Apfel',
        },
        {
          type: 'mc',
          prompt: 'Ei',
          options: ['Ei', 'Fleisch', 'Fisch', 'Haehnchen'],
          answer: 'Ei',
        },
        {
          type: 'mc',
          prompt: 'Reis',
          options: ['Reis', 'Nudeln', 'Kartoffel', 'Salat'],
          answer: 'Reis',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Fleisch', right: 'Fleisch' },
            { left: 'Fisch', right: 'Fisch' },
            { left: 'Gemuese', right: 'Gemuese' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Suppe',
          options: ['Suppe', 'Salat', 'Sandwich', 'Pizza'],
          answer: 'Suppe',
        },
        {
          type: 'mc',
          prompt: 'Kuchen',
          options: ['Kuchen', 'Keks', 'Suessigkeit', 'Schokolade'],
          answer: 'Kuchen',
        },
      ],
    },
    'pt-br': {
      exercises: [
        {
          type: 'mc',
          prompt: 'pao',
          options: ['pao', 'queijo', 'cafe', 'agua'],
          answer: 'pao',
        },
        {
          type: 'mc',
          prompt: 'leite',
          options: ['leite', 'cha', 'suco', 'agua'],
          answer: 'leite',
        },
        {
          type: 'match',
          pairs: [
            { left: 'agua', right: 'agua' },
            { left: 'cafe', right: 'cafe' },
            { left: 'cha', right: 'cha' },
          ],
        },
        {
          type: 'mc',
          prompt: 'agua',
          options: ['agua', 'leite', 'suco', 'refrigerante'],
          answer: 'agua',
        },
        {
          type: 'mc',
          prompt: 'cafe',
          options: ['cafe', 'cha', 'leite', 'suco'],
          answer: 'cafe',
        },
        {
          type: 'mc',
          prompt: 'cha',
          options: ['cha', 'cafe', 'agua', 'leite'],
          answer: 'cha',
        },
        {
          type: 'mc',
          prompt: 'queijo',
          options: ['queijo', 'pao', 'manteiga', 'presunto'],
          answer: 'queijo',
        },
        {
          type: 'match',
          pairs: [
            { left: 'suco', right: 'suco' },
            { left: 'manteiga', right: 'manteiga' },
            { left: 'acucar', right: 'acucar' },
            { left: 'sal', right: 'sal' },
          ],
        },
        {
          type: 'mc',
          prompt: 'suco',
          options: ['suco', 'refrigerante', 'agua', 'leite'],
          answer: 'suco',
        },
        {
          type: 'mc',
          prompt: 'maca',
          options: ['maca', 'banana', 'laranja', 'uva'],
          answer: 'maca',
        },
        {
          type: 'mc',
          prompt: 'ovo',
          options: ['ovo', 'carne', 'peixe', 'frango'],
          answer: 'ovo',
        },
        {
          type: 'mc',
          prompt: 'arroz',
          options: ['arroz', 'massa', 'batata', 'salada'],
          answer: 'arroz',
        },
        {
          type: 'match',
          pairs: [
            { left: 'carne', right: 'carne' },
            { left: 'peixe', right: 'peixe' },
            { left: 'legumes', right: 'legumes' },
          ],
        },
        {
          type: 'mc',
          prompt: 'sopa',
          options: ['sopa', 'salada', 'sanduiche', 'pizza'],
          answer: 'sopa',
        },
        {
          type: 'mc',
          prompt: 'bolo',
          options: ['bolo', 'biscoito', 'doce', 'chocolate'],
          answer: 'bolo',
        },
      ],
    },
  },
  'level-2-2': {
    en: {
      exercises: [
        {
          type: 'mc',
          prompt: 'mother',
          options: ['mother', 'father', 'sister', 'friend'],
          answer: 'mother',
        },
        {
          type: 'mc',
          prompt: 'sister',
          options: ['sister', 'brother', 'aunt', 'friend'],
          answer: 'sister',
        },
        {
          type: 'match',
          pairs: [
            { left: 'father', right: 'father' },
            { left: 'brother', right: 'brother' },
            { left: 'friend', right: 'friend' },
          ],
        },
        {
          type: 'mc',
          prompt: 'father',
          options: ['father', 'mother', 'uncle', 'cousin'],
          answer: 'father',
        },
        {
          type: 'mc',
          prompt: 'brother',
          options: ['brother', 'sister', 'cousin', 'nephew'],
          answer: 'brother',
        },
        {
          type: 'mc',
          prompt: 'friend',
          options: ['friend', 'family', 'neighbor', 'colleague'],
          answer: 'friend',
        },
        {
          type: 'mc',
          prompt: 'aunt',
          options: ['aunt', 'uncle', 'mother', 'grandmother'],
          answer: 'aunt',
        },
        {
          type: 'match',
          pairs: [
            { left: 'uncle', right: 'uncle' },
            { left: 'cousin', right: 'cousin' },
            { left: 'grandmother', right: 'grandmother' },
            { left: 'grandfather', right: 'grandfather' },
          ],
        },
        {
          type: 'mc',
          prompt: 'grandmother',
          options: ['grandmother', 'grandfather', 'mother', 'aunt'],
          answer: 'grandmother',
        },
        {
          type: 'mc',
          prompt: 'grandfather',
          options: ['grandfather', 'grandmother', 'father', 'uncle'],
          answer: 'grandfather',
        },
        {
          type: 'mc',
          prompt: 'son',
          options: ['son', 'daughter', 'nephew', 'cousin'],
          answer: 'son',
        },
        {
          type: 'mc',
          prompt: 'daughter',
          options: ['daughter', 'son', 'niece', 'sister'],
          answer: 'daughter',
        },
        {
          type: 'match',
          pairs: [
            { left: 'husband', right: 'husband' },
            { left: 'wife', right: 'wife' },
            { left: 'family', right: 'family' },
          ],
        },
        {
          type: 'mc',
          prompt: 'parents',
          options: ['parents', 'children', 'grandparents', 'siblings'],
          answer: 'parents',
        },
        {
          type: 'mc',
          prompt: 'children',
          options: ['children', 'parents', 'cousins', 'nephews'],
          answer: 'children',
        },
      ],
    },
    de: {
      exercises: [
        {
          type: 'mc',
          prompt: 'Mutter',
          options: ['Mutter', 'Vater', 'Schwester', 'Freund'],
          answer: 'Mutter',
        },
        {
          type: 'mc',
          prompt: 'Schwester',
          options: ['Schwester', 'Bruder', 'Tante', 'Freund'],
          answer: 'Schwester',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Vater', right: 'Vater' },
            { left: 'Bruder', right: 'Bruder' },
            { left: 'Freund', right: 'Freund' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Vater',
          options: ['Vater', 'Mutter', 'Onkel', 'Cousin'],
          answer: 'Vater',
        },
        {
          type: 'mc',
          prompt: 'Bruder',
          options: ['Bruder', 'Schwester', 'Cousin', 'Neffe'],
          answer: 'Bruder',
        },
        {
          type: 'mc',
          prompt: 'Freund',
          options: ['Freund', 'Familie', 'Nachbar', 'Kollege'],
          answer: 'Freund',
        },
        {
          type: 'mc',
          prompt: 'Tante',
          options: ['Tante', 'Onkel', 'Mutter', 'Grossmutter'],
          answer: 'Tante',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Onkel', right: 'Onkel' },
            { left: 'Cousin', right: 'Cousin' },
            { left: 'Grossmutter', right: 'Grossmutter' },
            { left: 'Grossvater', right: 'Grossvater' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Grossmutter',
          options: ['Grossmutter', 'Grossvater', 'Mutter', 'Tante'],
          answer: 'Grossmutter',
        },
        {
          type: 'mc',
          prompt: 'Grossvater',
          options: ['Grossvater', 'Grossmutter', 'Vater', 'Onkel'],
          answer: 'Grossvater',
        },
        {
          type: 'mc',
          prompt: 'Sohn',
          options: ['Sohn', 'Tochter', 'Neffe', 'Cousin'],
          answer: 'Sohn',
        },
        {
          type: 'mc',
          prompt: 'Tochter',
          options: ['Tochter', 'Sohn', 'Nichte', 'Schwester'],
          answer: 'Tochter',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Ehemann', right: 'Ehemann' },
            { left: 'Ehefrau', right: 'Ehefrau' },
            { left: 'Familie', right: 'Familie' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Eltern',
          options: ['Eltern', 'Kinder', 'Grosseltern', 'Geschwister'],
          answer: 'Eltern',
        },
        {
          type: 'mc',
          prompt: 'Kinder',
          options: ['Kinder', 'Eltern', 'Cousins', 'Neffen'],
          answer: 'Kinder',
        },
      ],
    },
    'pt-br': {
      exercises: [
        {
          type: 'mc',
          prompt: 'mae',
          options: ['mae', 'pai', 'irma', 'amigo'],
          answer: 'mae',
        },
        {
          type: 'mc',
          prompt: 'irma',
          options: ['irma', 'irmao', 'tia', 'amigo'],
          answer: 'irma',
        },
        {
          type: 'match',
          pairs: [
            { left: 'pai', right: 'pai' },
            { left: 'irmao', right: 'irmao' },
            { left: 'amigo', right: 'amigo' },
          ],
        },
        {
          type: 'mc',
          prompt: 'pai',
          options: ['pai', 'mae', 'tio', 'primo'],
          answer: 'pai',
        },
        {
          type: 'mc',
          prompt: 'irmao',
          options: ['irmao', 'irma', 'primo', 'sobrinho'],
          answer: 'irmao',
        },
        {
          type: 'mc',
          prompt: 'amigo',
          options: ['amigo', 'familia', 'vizinho', 'colega'],
          answer: 'amigo',
        },
        {
          type: 'mc',
          prompt: 'tia',
          options: ['tia', 'tio', 'mae', 'avo'],
          answer: 'tia',
        },
        {
          type: 'match',
          pairs: [
            { left: 'tio', right: 'tio' },
            { left: 'primo', right: 'primo' },
            { left: 'avo', right: 'avo' },
            { left: 'avô', right: 'avô' },
          ],
        },
        {
          type: 'mc',
          prompt: 'avo',
          options: ['avo', 'avô', 'mae', 'tia'],
          answer: 'avo',
        },
        {
          type: 'mc',
          prompt: 'avô',
          options: ['avô', 'avo', 'pai', 'tio'],
          answer: 'avô',
        },
        {
          type: 'mc',
          prompt: 'filho',
          options: ['filho', 'filha', 'sobrinho', 'primo'],
          answer: 'filho',
        },
        {
          type: 'mc',
          prompt: 'filha',
          options: ['filha', 'filho', 'sobrinha', 'irma'],
          answer: 'filha',
        },
        {
          type: 'match',
          pairs: [
            { left: 'marido', right: 'marido' },
            { left: 'esposa', right: 'esposa' },
            { left: 'familia', right: 'familia' },
          ],
        },
        {
          type: 'mc',
          prompt: 'pais',
          options: ['pais', 'filhos', 'avos', 'irmaos'],
          answer: 'pais',
        },
        {
          type: 'mc',
          prompt: 'filhos',
          options: ['filhos', 'pais', 'primos', 'sobrinhos'],
          answer: 'filhos',
        },
      ],
    },
  },
  'level-2-3': {
    en: {
      exercises: [
        {
          type: 'mc',
          prompt: 'house',
          options: ['house', 'room', 'apartment', 'building'],
          answer: 'house',
        },
        {
          type: 'mc',
          prompt: 'room',
          options: ['room', 'house', 'kitchen', 'bathroom'],
          answer: 'room',
        },
        {
          type: 'match',
          pairs: [
            { left: 'kitchen', right: 'kitchen' },
            { left: 'bathroom', right: 'bathroom' },
            { left: 'bedroom', right: 'bedroom' },
          ],
        },
        {
          type: 'mc',
          prompt: 'table',
          options: ['table', 'chair', 'desk', 'shelf'],
          answer: 'table',
        },
        {
          type: 'mc',
          prompt: 'chair',
          options: ['chair', 'table', 'sofa', 'stool'],
          answer: 'chair',
        },
        {
          type: 'mc',
          prompt: 'bed',
          options: ['bed', 'sofa', 'chair', 'pillow'],
          answer: 'bed',
        },
        {
          type: 'mc',
          prompt: 'sofa',
          options: ['sofa', 'bed', 'chair', 'armchair'],
          answer: 'sofa',
        },
        {
          type: 'match',
          pairs: [
            { left: 'lamp', right: 'lamp' },
            { left: 'window', right: 'window' },
            { left: 'door', right: 'door' },
            { left: 'floor', right: 'floor' },
          ],
        },
        {
          type: 'mc',
          prompt: 'sleep',
          options: ['sleep', 'wake', 'dream', 'rest'],
          answer: 'sleep',
        },
        {
          type: 'mc',
          prompt: 'cook',
          options: ['cook', 'eat', 'bake', 'fry'],
          answer: 'cook',
        },
        {
          type: 'mc',
          prompt: 'eat',
          options: ['eat', 'drink', 'cook', 'taste'],
          answer: 'eat',
        },
        {
          type: 'mc',
          prompt: 'clean',
          options: ['clean', 'dirty', 'wash', 'sweep'],
          answer: 'clean',
        },
        {
          type: 'match',
          pairs: [
            { left: 'wash', right: 'wash' },
            { left: 'shower', right: 'shower' },
            { left: 'brush', right: 'brush' },
          ],
        },
        {
          type: 'mc',
          prompt: 'watch',
          options: ['watch', 'see', 'look', 'read'],
          answer: 'watch',
        },
        {
          type: 'mc',
          prompt: 'relax',
          options: ['relax', 'work', 'play', 'rest'],
          answer: 'relax',
        },
      ],
    },
    de: {
      exercises: [
        {
          type: 'mc',
          prompt: 'Haus',
          options: ['Haus', 'Zimmer', 'Wohnung', 'Gebaeude'],
          answer: 'Haus',
        },
        {
          type: 'mc',
          prompt: 'Zimmer',
          options: ['Zimmer', 'Haus', 'Kueche', 'Bad'],
          answer: 'Zimmer',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Kueche', right: 'Kueche' },
            { left: 'Bad', right: 'Bad' },
            { left: 'Schlafzimmer', right: 'Schlafzimmer' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Tisch',
          options: ['Tisch', 'Stuhl', 'Schreibtisch', 'Regal'],
          answer: 'Tisch',
        },
        {
          type: 'mc',
          prompt: 'Stuhl',
          options: ['Stuhl', 'Tisch', 'Sofa', 'Hocker'],
          answer: 'Stuhl',
        },
        {
          type: 'mc',
          prompt: 'Bett',
          options: ['Bett', 'Sofa', 'Stuhl', 'Kissen'],
          answer: 'Bett',
        },
        {
          type: 'mc',
          prompt: 'Sofa',
          options: ['Sofa', 'Bett', 'Stuhl', 'Sessel'],
          answer: 'Sofa',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Lampe', right: 'Lampe' },
            { left: 'Fenster', right: 'Fenster' },
            { left: 'Tuer', right: 'Tuer' },
            { left: 'Boden', right: 'Boden' },
          ],
        },
        {
          type: 'mc',
          prompt: 'schlafen',
          options: ['schlafen', 'aufwachen', 'traeumen', 'ruhen'],
          answer: 'schlafen',
        },
        {
          type: 'mc',
          prompt: 'kochen',
          options: ['kochen', 'essen', 'backen', 'braten'],
          answer: 'kochen',
        },
        {
          type: 'mc',
          prompt: 'essen',
          options: ['essen', 'trinken', 'kochen', 'schmecken'],
          answer: 'essen',
        },
        {
          type: 'mc',
          prompt: 'putzen',
          options: ['putzen', 'schmutzig', 'waschen', 'fegen'],
          answer: 'putzen',
        },
        {
          type: 'match',
          pairs: [
            { left: 'waschen', right: 'waschen' },
            { left: 'duschen', right: 'duschen' },
            { left: 'buerten', right: 'buerten' },
          ],
        },
        {
          type: 'mc',
          prompt: 'ansehen',
          options: ['ansehen', 'sehen', 'schauen', 'lesen'],
          answer: 'ansehen',
        },
        {
          type: 'mc',
          prompt: 'entspannen',
          options: ['entspannen', 'arbeiten', 'spielen', 'ruhen'],
          answer: 'entspannen',
        },
      ],
    },
    'pt-br': {
      exercises: [
        {
          type: 'mc',
          prompt: 'casa',
          options: ['casa', 'quarto', 'apartamento', 'predio'],
          answer: 'casa',
        },
        {
          type: 'mc',
          prompt: 'quarto',
          options: ['quarto', 'casa', 'cozinha', 'banheiro'],
          answer: 'quarto',
        },
        {
          type: 'match',
          pairs: [
            { left: 'cozinha', right: 'cozinha' },
            { left: 'banheiro', right: 'banheiro' },
            { left: 'quarto de dormir', right: 'quarto de dormir' },
          ],
        },
        {
          type: 'mc',
          prompt: 'mesa',
          options: ['mesa', 'cadeira', 'escrivaninha', 'estante'],
          answer: 'mesa',
        },
        {
          type: 'mc',
          prompt: 'cadeira',
          options: ['cadeira', 'mesa', 'sofa', 'banquinho'],
          answer: 'cadeira',
        },
        {
          type: 'mc',
          prompt: 'cama',
          options: ['cama', 'sofa', 'cadeira', 'travesseiro'],
          answer: 'cama',
        },
        {
          type: 'mc',
          prompt: 'sofa',
          options: ['sofa', 'cama', 'cadeira', 'poltrona'],
          answer: 'sofa',
        },
        {
          type: 'match',
          pairs: [
            { left: 'lampada', right: 'lampada' },
            { left: 'janela', right: 'janela' },
            { left: 'porta', right: 'porta' },
            { left: 'chao', right: 'chao' },
          ],
        },
        {
          type: 'mc',
          prompt: 'dormir',
          options: ['dormir', 'acordar', 'sonhar', 'descansar'],
          answer: 'dormir',
        },
        {
          type: 'mc',
          prompt: 'cozinhar',
          options: ['cozinhar', 'comer', 'assar', 'fritar'],
          answer: 'cozinhar',
        },
        {
          type: 'mc',
          prompt: 'comer',
          options: ['comer', 'beber', 'cozinhar', 'provar'],
          answer: 'comer',
        },
        {
          type: 'mc',
          prompt: 'limpar',
          options: ['limpar', 'sujar', 'lavar', 'varrer'],
          answer: 'limpar',
        },
        {
          type: 'match',
          pairs: [
            { left: 'lavar', right: 'lavar' },
            { left: 'tomar banho', right: 'tomar banho' },
            { left: 'escovar', right: 'escovar' },
          ],
        },
        {
          type: 'mc',
          prompt: 'assistir',
          options: ['assistir', 'ver', 'olhar', 'ler'],
          answer: 'assistir',
        },
        {
          type: 'mc',
          prompt: 'relaxar',
          options: ['relaxar', 'trabalhar', 'brincar', 'descansar'],
          answer: 'relaxar',
        },
      ],
    },
  },
  'level-3-1': {
    en: {
      exercises: [
        {
          type: 'mc',
          prompt: 'left',
          options: ['left', 'right', 'straight', 'back'],
          answer: 'left',
        },
        {
          type: 'mc',
          prompt: 'straight',
          options: ['straight', 'left', 'right', 'back'],
          answer: 'straight',
        },
        {
          type: 'match',
          pairs: [
            { left: 'right', right: 'right' },
            { left: 'back', right: 'back' },
            { left: 'forward', right: 'forward' },
          ],
        },
        {
          type: 'mc',
          prompt: 'right',
          options: ['right', 'left', 'center', 'side'],
          answer: 'right',
        },
        {
          type: 'mc',
          prompt: 'forward',
          options: ['forward', 'backward', 'sideways', 'around'],
          answer: 'forward',
        },
        {
          type: 'mc',
          prompt: 'back',
          options: ['back', 'front', 'forward', 'ahead'],
          answer: 'back',
        },
        {
          type: 'mc',
          prompt: 'turn',
          options: ['turn', 'walk', 'stop', 'continue'],
          answer: 'turn',
        },
        {
          type: 'match',
          pairs: [
            { left: 'corner', right: 'corner' },
            { left: 'intersection', right: 'intersection' },
            { left: 'crossroad', right: 'crossroad' },
            { left: 'roundabout', right: 'roundabout' },
          ],
        },
        {
          type: 'mc',
          prompt: 'near',
          options: ['near', 'far', 'close', 'distant'],
          answer: 'near',
        },
        {
          type: 'mc',
          prompt: 'far',
          options: ['far', 'near', 'close', 'next'],
          answer: 'far',
        },
        {
          type: 'mc',
          prompt: 'next to',
          options: ['next to', 'behind', 'in front of', 'across from'],
          answer: 'next to',
        },
        {
          type: 'mc',
          prompt: 'behind',
          options: ['behind', 'in front', 'beside', 'above'],
          answer: 'behind',
        },
        {
          type: 'match',
          pairs: [
            { left: 'between', right: 'between' },
            { left: 'opposite', right: 'opposite' },
            { left: 'across', right: 'across' },
          ],
        },
        {
          type: 'mc',
          prompt: 'north',
          options: ['north', 'south', 'east', 'west'],
          answer: 'north',
        },
        {
          type: 'mc',
          prompt: 'east',
          options: ['east', 'west', 'north', 'south'],
          answer: 'east',
        },
      ],
    },
    de: {
      exercises: [
        {
          type: 'mc',
          prompt: 'links',
          options: ['links', 'rechts', 'geradeaus', 'zurueck'],
          answer: 'links',
        },
        {
          type: 'mc',
          prompt: 'geradeaus',
          options: ['geradeaus', 'links', 'rechts', 'zurueck'],
          answer: 'geradeaus',
        },
        {
          type: 'match',
          pairs: [
            { left: 'rechts', right: 'rechts' },
            { left: 'zurueck', right: 'zurueck' },
            { left: 'vorwaerts', right: 'vorwaerts' },
          ],
        },
        {
          type: 'mc',
          prompt: 'rechts',
          options: ['rechts', 'links', 'mitte', 'seite'],
          answer: 'rechts',
        },
        {
          type: 'mc',
          prompt: 'vorwaerts',
          options: ['vorwaerts', 'rueckwaerts', 'seitwaerts', 'herum'],
          answer: 'vorwaerts',
        },
        {
          type: 'mc',
          prompt: 'zurueck',
          options: ['zurueck', 'vorne', 'vorwaerts', 'voraus'],
          answer: 'zurueck',
        },
        {
          type: 'mc',
          prompt: 'abbiegen',
          options: ['abbiegen', 'gehen', 'stoppen', 'weitergehen'],
          answer: 'abbiegen',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Ecke', right: 'Ecke' },
            { left: 'Kreuzung', right: 'Kreuzung' },
            { left: 'Querstrasse', right: 'Querstrasse' },
            { left: 'Kreisverkehr', right: 'Kreisverkehr' },
          ],
        },
        {
          type: 'mc',
          prompt: 'nah',
          options: ['nah', 'weit', 'nahe', 'entfernt'],
          answer: 'nah',
        },
        {
          type: 'mc',
          prompt: 'weit',
          options: ['weit', 'nah', 'nahe', 'naechste'],
          answer: 'weit',
        },
        {
          type: 'mc',
          prompt: 'neben',
          options: ['neben', 'hinter', 'vor', 'gegenueber'],
          answer: 'neben',
        },
        {
          type: 'mc',
          prompt: 'hinter',
          options: ['hinter', 'vor', 'neben', 'ueber'],
          answer: 'hinter',
        },
        {
          type: 'match',
          pairs: [
            { left: 'zwischen', right: 'zwischen' },
            { left: 'gegenueber', right: 'gegenueber' },
            { left: 'drueben', right: 'drueben' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Norden',
          options: ['Norden', 'Sueden', 'Osten', 'Westen'],
          answer: 'Norden',
        },
        {
          type: 'mc',
          prompt: 'Osten',
          options: ['Osten', 'Westen', 'Norden', 'Sueden'],
          answer: 'Osten',
        },
      ],
    },
    'pt-br': {
      exercises: [
        {
          type: 'mc',
          prompt: 'esquerda',
          options: ['esquerda', 'direita', 'reto', 'voltar'],
          answer: 'esquerda',
        },
        {
          type: 'mc',
          prompt: 'reto',
          options: ['reto', 'esquerda', 'direita', 'voltar'],
          answer: 'reto',
        },
        {
          type: 'match',
          pairs: [
            { left: 'direita', right: 'direita' },
            { left: 'voltar', right: 'voltar' },
            { left: 'avancar', right: 'avancar' },
          ],
        },
        {
          type: 'mc',
          prompt: 'direita',
          options: ['direita', 'esquerda', 'centro', 'lado'],
          answer: 'direita',
        },
        {
          type: 'mc',
          prompt: 'avancar',
          options: ['avancar', 'recuar', 'lateral', 'ao redor'],
          answer: 'avancar',
        },
        {
          type: 'mc',
          prompt: 'voltar',
          options: ['voltar', 'frente', 'avancar', 'adiante'],
          answer: 'voltar',
        },
        {
          type: 'mc',
          prompt: 'virar',
          options: ['virar', 'andar', 'parar', 'continuar'],
          answer: 'virar',
        },
        {
          type: 'match',
          pairs: [
            { left: 'esquina', right: 'esquina' },
            { left: 'cruzamento', right: 'cruzamento' },
            { left: 'entroncamento', right: 'entroncamento' },
            { left: 'rotatoria', right: 'rotatoria' },
          ],
        },
        {
          type: 'mc',
          prompt: 'perto',
          options: ['perto', 'longe', 'proximo', 'distante'],
          answer: 'perto',
        },
        {
          type: 'mc',
          prompt: 'longe',
          options: ['longe', 'perto', 'proximo', 'seguinte'],
          answer: 'longe',
        },
        {
          type: 'mc',
          prompt: 'ao lado de',
          options: ['ao lado de', 'atras', 'na frente', 'em frente'],
          answer: 'ao lado de',
        },
        {
          type: 'mc',
          prompt: 'atras',
          options: ['atras', 'na frente', 'ao lado', 'acima'],
          answer: 'atras',
        },
        {
          type: 'match',
          pairs: [
            { left: 'entre', right: 'entre' },
            { left: 'oposto', right: 'oposto' },
            { left: 'atraves', right: 'atraves' },
          ],
        },
        {
          type: 'mc',
          prompt: 'norte',
          options: ['norte', 'sul', 'leste', 'oeste'],
          answer: 'norte',
        },
        {
          type: 'mc',
          prompt: 'leste',
          options: ['leste', 'oeste', 'norte', 'sul'],
          answer: 'leste',
        },
      ],
    },
  },
  'level-3-2': {
    en: {
      exercises: [
        {
          type: 'mc',
          prompt: 'train',
          options: ['train', 'bus', 'ticket', 'station'],
          answer: 'train',
        },
        {
          type: 'mc',
          prompt: 'ticket',
          options: ['ticket', 'station', 'bus', 'platform'],
          answer: 'ticket',
        },
        {
          type: 'match',
          pairs: [
            { left: 'bus', right: 'bus' },
            { left: 'station', right: 'station' },
            { left: 'schedule', right: 'schedule' },
          ],
        },
        {
          type: 'mc',
          prompt: 'bus',
          options: ['bus', 'train', 'taxi', 'subway'],
          answer: 'bus',
        },
        {
          type: 'mc',
          prompt: 'station',
          options: ['station', 'airport', 'port', 'terminal'],
          answer: 'station',
        },
        {
          type: 'mc',
          prompt: 'platform',
          options: ['platform', 'track', 'gate', 'entrance'],
          answer: 'platform',
        },
        {
          type: 'mc',
          prompt: 'schedule',
          options: ['schedule', 'timetable', 'delay', 'arrival'],
          answer: 'schedule',
        },
        {
          type: 'match',
          pairs: [
            { left: 'taxi', right: 'taxi' },
            { left: 'subway', right: 'subway' },
            { left: 'tram', right: 'tram' },
            { left: 'airport', right: 'airport' },
          ],
        },
        {
          type: 'mc',
          prompt: 'departure',
          options: ['departure', 'arrival', 'delay', 'cancellation'],
          answer: 'departure',
        },
        {
          type: 'mc',
          prompt: 'arrival',
          options: ['arrival', 'departure', 'delay', 'boarding'],
          answer: 'arrival',
        },
        {
          type: 'mc',
          prompt: 'passenger',
          options: ['passenger', 'driver', 'conductor', 'pilot'],
          answer: 'passenger',
        },
        {
          type: 'mc',
          prompt: 'luggage',
          options: ['luggage', 'bag', 'suitcase', 'backpack'],
          answer: 'luggage',
        },
        {
          type: 'match',
          pairs: [
            { left: 'seat', right: 'seat' },
            { left: 'window', right: 'window' },
            { left: 'aisle', right: 'aisle' },
          ],
        },
        {
          type: 'mc',
          prompt: 'fare',
          options: ['fare', 'price', 'cost', 'fee'],
          answer: 'fare',
        },
        {
          type: 'mc',
          prompt: 'connection',
          options: ['connection', 'transfer', 'stop', 'route'],
          answer: 'connection',
        },
      ],
    },
    de: {
      exercises: [
        {
          type: 'mc',
          prompt: 'Zug',
          options: ['Zug', 'Bus', 'Ticket', 'Bahnhof'],
          answer: 'Zug',
        },
        {
          type: 'mc',
          prompt: 'Ticket',
          options: ['Ticket', 'Bahnhof', 'Bus', 'Gleis'],
          answer: 'Ticket',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Bus', right: 'Bus' },
            { left: 'Bahnhof', right: 'Bahnhof' },
            { left: 'Fahrplan', right: 'Fahrplan' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Bus',
          options: ['Bus', 'Zug', 'Taxi', 'U-Bahn'],
          answer: 'Bus',
        },
        {
          type: 'mc',
          prompt: 'Bahnhof',
          options: ['Bahnhof', 'Flughafen', 'Hafen', 'Terminal'],
          answer: 'Bahnhof',
        },
        {
          type: 'mc',
          prompt: 'Gleis',
          options: ['Gleis', 'Bahnsteig', 'Tor', 'Eingang'],
          answer: 'Gleis',
        },
        {
          type: 'mc',
          prompt: 'Fahrplan',
          options: ['Fahrplan', 'Zeitplan', 'Verspaetung', 'Ankunft'],
          answer: 'Fahrplan',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Taxi', right: 'Taxi' },
            { left: 'U-Bahn', right: 'U-Bahn' },
            { left: 'Strassenbahn', right: 'Strassenbahn' },
            { left: 'Flughafen', right: 'Flughafen' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Abfahrt',
          options: ['Abfahrt', 'Ankunft', 'Verspaetung', 'Absage'],
          answer: 'Abfahrt',
        },
        {
          type: 'mc',
          prompt: 'Ankunft',
          options: ['Ankunft', 'Abfahrt', 'Verspaetung', 'Einsteigen'],
          answer: 'Ankunft',
        },
        {
          type: 'mc',
          prompt: 'Passagier',
          options: ['Passagier', 'Fahrer', 'Schaffner', 'Pilot'],
          answer: 'Passagier',
        },
        {
          type: 'mc',
          prompt: 'Gepaeck',
          options: ['Gepaeck', 'Tasche', 'Koffer', 'Rucksack'],
          answer: 'Gepaeck',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Sitzplatz', right: 'Sitzplatz' },
            { left: 'Fenster', right: 'Fenster' },
            { left: 'Gang', right: 'Gang' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Fahrpreis',
          options: ['Fahrpreis', 'Preis', 'Kosten', 'Gebuehr'],
          answer: 'Fahrpreis',
        },
        {
          type: 'mc',
          prompt: 'Anschluss',
          options: ['Anschluss', 'Umstieg', 'Haltestelle', 'Route'],
          answer: 'Anschluss',
        },
      ],
    },
    'pt-br': {
      exercises: [
        {
          type: 'mc',
          prompt: 'trem',
          options: ['trem', 'onibus', 'bilhete', 'estacao'],
          answer: 'trem',
        },
        {
          type: 'mc',
          prompt: 'bilhete',
          options: ['bilhete', 'estacao', 'onibus', 'plataforma'],
          answer: 'bilhete',
        },
        {
          type: 'match',
          pairs: [
            { left: 'onibus', right: 'onibus' },
            { left: 'estacao', right: 'estacao' },
            { left: 'horario', right: 'horario' },
          ],
        },
        {
          type: 'mc',
          prompt: 'onibus',
          options: ['onibus', 'trem', 'taxi', 'metro'],
          answer: 'onibus',
        },
        {
          type: 'mc',
          prompt: 'estacao',
          options: ['estacao', 'aeroporto', 'porto', 'terminal'],
          answer: 'estacao',
        },
        {
          type: 'mc',
          prompt: 'plataforma',
          options: ['plataforma', 'trilho', 'portao', 'entrada'],
          answer: 'plataforma',
        },
        {
          type: 'mc',
          prompt: 'horario',
          options: ['horario', 'programacao', 'atraso', 'chegada'],
          answer: 'horario',
        },
        {
          type: 'match',
          pairs: [
            { left: 'taxi', right: 'taxi' },
            { left: 'metro', right: 'metro' },
            { left: 'bonde', right: 'bonde' },
            { left: 'aeroporto', right: 'aeroporto' },
          ],
        },
        {
          type: 'mc',
          prompt: 'partida',
          options: ['partida', 'chegada', 'atraso', 'cancelamento'],
          answer: 'partida',
        },
        {
          type: 'mc',
          prompt: 'chegada',
          options: ['chegada', 'partida', 'atraso', 'embarque'],
          answer: 'chegada',
        },
        {
          type: 'mc',
          prompt: 'passageiro',
          options: ['passageiro', 'motorista', 'cobrador', 'piloto'],
          answer: 'passageiro',
        },
        {
          type: 'mc',
          prompt: 'bagagem',
          options: ['bagagem', 'bolsa', 'mala', 'mochila'],
          answer: 'bagagem',
        },
        {
          type: 'match',
          pairs: [
            { left: 'assento', right: 'assento' },
            { left: 'janela', right: 'janela' },
            { left: 'corredor', right: 'corredor' },
          ],
        },
        {
          type: 'mc',
          prompt: 'tarifa',
          options: ['tarifa', 'preco', 'custo', 'taxa'],
          answer: 'tarifa',
        },
        {
          type: 'mc',
          prompt: 'conexao',
          options: ['conexao', 'transferencia', 'parada', 'rota'],
          answer: 'conexao',
        },
      ],
    },
  },
  'level-3-3': {
    en: {
      exercises: [
        {
          type: 'mc',
          prompt: 'reception',
          options: ['reception', 'room', 'key', 'reservation'],
          answer: 'reception',
        },
        {
          type: 'mc',
          prompt: 'room',
          options: ['room', 'key', 'bill', 'lobby'],
          answer: 'room',
        },
        {
          type: 'match',
          pairs: [
            { left: 'key', right: 'key' },
            { left: 'reservation', right: 'reservation' },
            { left: 'check-in', right: 'check-in' },
          ],
        },
        {
          type: 'mc',
          prompt: 'key',
          options: ['key', 'card', 'lock', 'door'],
          answer: 'key',
        },
        {
          type: 'mc',
          prompt: 'reservation',
          options: ['reservation', 'booking', 'confirmation', 'cancellation'],
          answer: 'reservation',
        },
        {
          type: 'mc',
          prompt: 'check-in',
          options: ['check-in', 'check-out', 'arrival', 'departure'],
          answer: 'check-in',
        },
        {
          type: 'mc',
          prompt: 'check-out',
          options: ['check-out', 'check-in', 'stay', 'extension'],
          answer: 'check-out',
        },
        {
          type: 'match',
          pairs: [
            { left: 'lobby', right: 'lobby' },
            { left: 'elevator', right: 'elevator' },
            { left: 'floor', right: 'floor' },
            { left: 'suite', right: 'suite' },
          ],
        },
        {
          type: 'mc',
          prompt: 'bill',
          options: ['bill', 'invoice', 'receipt', 'payment'],
          answer: 'bill',
        },
        {
          type: 'mc',
          prompt: 'breakfast',
          options: ['breakfast', 'lunch', 'dinner', 'snack'],
          answer: 'breakfast',
        },
        {
          type: 'mc',
          prompt: 'wifi',
          options: ['wifi', 'internet', 'password', 'connection'],
          answer: 'wifi',
        },
        {
          type: 'mc',
          prompt: 'towel',
          options: ['towel', 'soap', 'shampoo', 'toilet paper'],
          answer: 'towel',
        },
        {
          type: 'match',
          pairs: [
            { left: 'parking', right: 'parking' },
            { left: 'gym', right: 'gym' },
            { left: 'pool', right: 'pool' },
          ],
        },
        {
          type: 'mc',
          prompt: 'luggage',
          options: ['luggage', 'suitcase', 'bag', 'backpack'],
          answer: 'luggage',
        },
        {
          type: 'mc',
          prompt: 'view',
          options: ['view', 'window', 'balcony', 'terrace'],
          answer: 'view',
        },
      ],
    },
    de: {
      exercises: [
        {
          type: 'mc',
          prompt: 'Rezeption',
          options: ['Rezeption', 'Zimmer', 'Schluessel', 'Reservierung'],
          answer: 'Rezeption',
        },
        {
          type: 'mc',
          prompt: 'Zimmer',
          options: ['Zimmer', 'Schluessel', 'Rechnung', 'Lobby'],
          answer: 'Zimmer',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Schluessel', right: 'Schluessel' },
            { left: 'Reservierung', right: 'Reservierung' },
            { left: 'Check-in', right: 'Check-in' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Schluessel',
          options: ['Schluessel', 'Karte', 'Schloss', 'Tuer'],
          answer: 'Schluessel',
        },
        {
          type: 'mc',
          prompt: 'Reservierung',
          options: ['Reservierung', 'Buchung', 'Bestaetigung', 'Stornierung'],
          answer: 'Reservierung',
        },
        {
          type: 'mc',
          prompt: 'Check-in',
          options: ['Check-in', 'Check-out', 'Ankunft', 'Abreise'],
          answer: 'Check-in',
        },
        {
          type: 'mc',
          prompt: 'Check-out',
          options: ['Check-out', 'Check-in', 'Aufenthalt', 'Verlaengerung'],
          answer: 'Check-out',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Lobby', right: 'Lobby' },
            { left: 'Aufzug', right: 'Aufzug' },
            { left: 'Etage', right: 'Etage' },
            { left: 'Suite', right: 'Suite' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Rechnung',
          options: ['Rechnung', 'Quittung', 'Beleg', 'Zahlung'],
          answer: 'Rechnung',
        },
        {
          type: 'mc',
          prompt: 'Fruehstueck',
          options: ['Fruehstueck', 'Mittagessen', 'Abendessen', 'Snack'],
          answer: 'Fruehstueck',
        },
        {
          type: 'mc',
          prompt: 'WLAN',
          options: ['WLAN', 'Internet', 'Passwort', 'Verbindung'],
          answer: 'WLAN',
        },
        {
          type: 'mc',
          prompt: 'Handtuch',
          options: ['Handtuch', 'Seife', 'Shampoo', 'Toilettenpapier'],
          answer: 'Handtuch',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Parkplatz', right: 'Parkplatz' },
            { left: 'Fitnessstudio', right: 'Fitnessstudio' },
            { left: 'Pool', right: 'Pool' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Gepaeck',
          options: ['Gepaeck', 'Koffer', 'Tasche', 'Rucksack'],
          answer: 'Gepaeck',
        },
        {
          type: 'mc',
          prompt: 'Aussicht',
          options: ['Aussicht', 'Fenster', 'Balkon', 'Terrasse'],
          answer: 'Aussicht',
        },
      ],
    },
    'pt-br': {
      exercises: [
        {
          type: 'mc',
          prompt: 'recepcao',
          options: ['recepcao', 'quarto', 'chave', 'reserva'],
          answer: 'recepcao',
        },
        {
          type: 'mc',
          prompt: 'quarto',
          options: ['quarto', 'chave', 'conta', 'salao'],
          answer: 'quarto',
        },
        {
          type: 'match',
          pairs: [
            { left: 'chave', right: 'chave' },
            { left: 'reserva', right: 'reserva' },
            { left: 'check-in', right: 'check-in' },
          ],
        },
        {
          type: 'mc',
          prompt: 'chave',
          options: ['chave', 'cartao', 'fechadura', 'porta'],
          answer: 'chave',
        },
        {
          type: 'mc',
          prompt: 'reserva',
          options: ['reserva', 'agendamento', 'confirmacao', 'cancelamento'],
          answer: 'reserva',
        },
        {
          type: 'mc',
          prompt: 'check-in',
          options: ['check-in', 'check-out', 'chegada', 'saida'],
          answer: 'check-in',
        },
        {
          type: 'mc',
          prompt: 'check-out',
          options: ['check-out', 'check-in', 'estadia', 'prorrogacao'],
          answer: 'check-out',
        },
        {
          type: 'match',
          pairs: [
            { left: 'salao', right: 'salao' },
            { left: 'elevador', right: 'elevador' },
            { left: 'andar', right: 'andar' },
            { left: 'suite', right: 'suite' },
          ],
        },
        {
          type: 'mc',
          prompt: 'conta',
          options: ['conta', 'fatura', 'recibo', 'pagamento'],
          answer: 'conta',
        },
        {
          type: 'mc',
          prompt: 'cafe da manha',
          options: ['cafe da manha', 'almoco', 'jantar', 'lanche'],
          answer: 'cafe da manha',
        },
        {
          type: 'mc',
          prompt: 'wifi',
          options: ['wifi', 'internet', 'senha', 'conexao'],
          answer: 'wifi',
        },
        {
          type: 'mc',
          prompt: 'toalha',
          options: ['toalha', 'sabonete', 'shampoo', 'papel higienico'],
          answer: 'toalha',
        },
        {
          type: 'match',
          pairs: [
            { left: 'estacionamento', right: 'estacionamento' },
            { left: 'academia', right: 'academia' },
            { left: 'piscina', right: 'piscina' },
          ],
        },
        {
          type: 'mc',
          prompt: 'bagagem',
          options: ['bagagem', 'mala', 'bolsa', 'mochila'],
          answer: 'bagagem',
        },
        {
          type: 'mc',
          prompt: 'vista',
          options: ['vista', 'janela', 'varanda', 'terraco'],
          answer: 'vista',
        },
      ],
    },
  },
  'level-4-1': {
    en: {
      exercises: [
        {
          type: 'mc',
          prompt: 'price',
          options: ['price', 'size', 'color', 'cash'],
          answer: 'price',
        },
        {
          type: 'mc',
          prompt: 'color',
          options: ['color', 'size', 'price', 'cash'],
          answer: 'color',
        },
        {
          type: 'match',
          pairs: [
            { left: 'size', right: 'size' },
            { left: 'cash', right: 'cash' },
            { left: 'receipt', right: 'receipt' },
          ],
        },
        {
          type: 'mc',
          prompt: 'size',
          options: ['size', 'small', 'medium', 'large'],
          answer: 'size',
        },
        {
          type: 'mc',
          prompt: 'cash',
          options: ['cash', 'card', 'payment', 'money'],
          answer: 'cash',
        },
        {
          type: 'mc',
          prompt: 'card',
          options: ['card', 'cash', 'credit', 'debit'],
          answer: 'card',
        },
        {
          type: 'mc',
          prompt: 'discount',
          options: ['discount', 'sale', 'offer', 'deal'],
          answer: 'discount',
        },
        {
          type: 'match',
          pairs: [
            { left: 'sale', right: 'sale' },
            { left: 'refund', right: 'refund' },
            { left: 'exchange', right: 'exchange' },
            { left: 'return', right: 'return' },
          ],
        },
        {
          type: 'mc',
          prompt: 'store',
          options: ['store', 'shop', 'market', 'mall'],
          answer: 'store',
        },
        {
          type: 'mc',
          prompt: 'customer',
          options: ['customer', 'cashier', 'manager', 'seller'],
          answer: 'customer',
        },
        {
          type: 'mc',
          prompt: 'bag',
          options: ['bag', 'box', 'package', 'wrapper'],
          answer: 'bag',
        },
        {
          type: 'mc',
          prompt: 'try on',
          options: ['try on', 'buy', 'wear', 'fit'],
          answer: 'try on',
        },
        {
          type: 'match',
          pairs: [
            { left: 'fitting room', right: 'fitting room' },
            { left: 'checkout', right: 'checkout' },
            { left: 'aisle', right: 'aisle' },
          ],
        },
        {
          type: 'mc',
          prompt: 'expensive',
          options: ['expensive', 'cheap', 'affordable', 'costly'],
          answer: 'expensive',
        },
        {
          type: 'mc',
          prompt: 'quality',
          options: ['quality', 'quantity', 'brand', 'style'],
          answer: 'quality',
        },
      ],
    },
    de: {
      exercises: [
        {
          type: 'mc',
          prompt: 'Preis',
          options: ['Preis', 'Groesse', 'Farbe', 'Kasse'],
          answer: 'Preis',
        },
        {
          type: 'mc',
          prompt: 'Farbe',
          options: ['Farbe', 'Groesse', 'Preis', 'Kasse'],
          answer: 'Farbe',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Groesse', right: 'Groesse' },
            { left: 'Kasse', right: 'Kasse' },
            { left: 'Beleg', right: 'Beleg' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Groesse',
          options: ['Groesse', 'klein', 'mittel', 'gross'],
          answer: 'Groesse',
        },
        {
          type: 'mc',
          prompt: 'Bargeld',
          options: ['Bargeld', 'Karte', 'Zahlung', 'Geld'],
          answer: 'Bargeld',
        },
        {
          type: 'mc',
          prompt: 'Karte',
          options: ['Karte', 'Bargeld', 'Kredit', 'Debit'],
          answer: 'Karte',
        },
        {
          type: 'mc',
          prompt: 'Rabatt',
          options: ['Rabatt', 'Ausverkauf', 'Angebot', 'Schnäppchen'],
          answer: 'Rabatt',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Ausverkauf', right: 'Ausverkauf' },
            { left: 'Erstattung', right: 'Erstattung' },
            { left: 'Umtausch', right: 'Umtausch' },
            { left: 'Rueckgabe', right: 'Rueckgabe' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Geschaeft',
          options: ['Geschaeft', 'Laden', 'Markt', 'Einkaufszentrum'],
          answer: 'Geschaeft',
        },
        {
          type: 'mc',
          prompt: 'Kunde',
          options: ['Kunde', 'Kassierer', 'Filialleiter', 'Verkaeufer'],
          answer: 'Kunde',
        },
        {
          type: 'mc',
          prompt: 'Tasche',
          options: ['Tasche', 'Karton', 'Paket', 'Verpackung'],
          answer: 'Tasche',
        },
        {
          type: 'mc',
          prompt: 'anprobieren',
          options: ['anprobieren', 'kaufen', 'tragen', 'passen'],
          answer: 'anprobieren',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Umkleidekabine', right: 'Umkleidekabine' },
            { left: 'Kasse', right: 'Kasse' },
            { left: 'Gang', right: 'Gang' },
          ],
        },
        {
          type: 'mc',
          prompt: 'teuer',
          options: ['teuer', 'billig', 'erschwinglich', 'kostspielig'],
          answer: 'teuer',
        },
        {
          type: 'mc',
          prompt: 'Qualitaet',
          options: ['Qualitaet', 'Menge', 'Marke', 'Stil'],
          answer: 'Qualitaet',
        },
      ],
    },
    'pt-br': {
      exercises: [
        {
          type: 'mc',
          prompt: 'preco',
          options: ['preco', 'tamanho', 'cor', 'caixa'],
          answer: 'preco',
        },
        {
          type: 'mc',
          prompt: 'cor',
          options: ['cor', 'tamanho', 'preco', 'caixa'],
          answer: 'cor',
        },
        {
          type: 'match',
          pairs: [
            { left: 'tamanho', right: 'tamanho' },
            { left: 'caixa', right: 'caixa' },
            { left: 'recibo', right: 'recibo' },
          ],
        },
        {
          type: 'mc',
          prompt: 'tamanho',
          options: ['tamanho', 'pequeno', 'medio', 'grande'],
          answer: 'tamanho',
        },
        {
          type: 'mc',
          prompt: 'dinheiro',
          options: ['dinheiro', 'cartao', 'pagamento', 'moeda'],
          answer: 'dinheiro',
        },
        {
          type: 'mc',
          prompt: 'cartao',
          options: ['cartao', 'dinheiro', 'credito', 'debito'],
          answer: 'cartao',
        },
        {
          type: 'mc',
          prompt: 'desconto',
          options: ['desconto', 'promocao', 'oferta', 'pechincha'],
          answer: 'desconto',
        },
        {
          type: 'match',
          pairs: [
            { left: 'promocao', right: 'promocao' },
            { left: 'reembolso', right: 'reembolso' },
            { left: 'troca', right: 'troca' },
            { left: 'devolucao', right: 'devolucao' },
          ],
        },
        {
          type: 'mc',
          prompt: 'loja',
          options: ['loja', 'mercado', 'shopping', 'comercio'],
          answer: 'loja',
        },
        {
          type: 'mc',
          prompt: 'cliente',
          options: ['cliente', 'caixa', 'gerente', 'vendedor'],
          answer: 'cliente',
        },
        {
          type: 'mc',
          prompt: 'sacola',
          options: ['sacola', 'caixa', 'pacote', 'embalagem'],
          answer: 'sacola',
        },
        {
          type: 'mc',
          prompt: 'experimentar',
          options: ['experimentar', 'comprar', 'vestir', 'servir'],
          answer: 'experimentar',
        },
        {
          type: 'match',
          pairs: [
            { left: 'provador', right: 'provador' },
            { left: 'caixa', right: 'caixa' },
            { left: 'corredor', right: 'corredor' },
          ],
        },
        {
          type: 'mc',
          prompt: 'caro',
          options: ['caro', 'barato', 'acessivel', 'custoso'],
          answer: 'caro',
        },
        {
          type: 'mc',
          prompt: 'qualidade',
          options: ['qualidade', 'quantidade', 'marca', 'estilo'],
          answer: 'qualidade',
        },
      ],
    },
  },
  'level-4-2': {
    en: {
      exercises: [
        {
          type: 'mc',
          prompt: 'pain',
          options: ['pain', 'fever', 'cold', 'medicine'],
          answer: 'pain',
        },
        {
          type: 'mc',
          prompt: 'fever',
          options: ['fever', 'cold', 'medicine', 'cough'],
          answer: 'fever',
        },
        {
          type: 'match',
          pairs: [
            { left: 'cold', right: 'cold' },
            { left: 'medicine', right: 'medicine' },
            { left: 'pharmacy', right: 'pharmacy' },
          ],
        },
        {
          type: 'mc',
          prompt: 'cough',
          options: ['cough', 'sneeze', 'throat', 'sick'],
          answer: 'cough',
        },
        {
          type: 'mc',
          prompt: 'medicine',
          options: ['medicine', 'pill', 'tablet', 'syrup'],
          answer: 'medicine',
        },
        {
          type: 'mc',
          prompt: 'pharmacy',
          options: ['pharmacy', 'hospital', 'clinic', 'doctor'],
          answer: 'pharmacy',
        },
        {
          type: 'mc',
          prompt: 'doctor',
          options: ['doctor', 'nurse', 'patient', 'dentist'],
          answer: 'doctor',
        },
        {
          type: 'match',
          pairs: [
            { left: 'hospital', right: 'hospital' },
            { left: 'appointment', right: 'appointment' },
            { left: 'prescription', right: 'prescription' },
            { left: 'symptom', right: 'symptom' },
          ],
        },
        {
          type: 'mc',
          prompt: 'headache',
          options: ['headache', 'stomach ache', 'toothache', 'backache'],
          answer: 'headache',
        },
        {
          type: 'mc',
          prompt: 'allergy',
          options: ['allergy', 'infection', 'disease', 'injury'],
          answer: 'allergy',
        },
        {
          type: 'mc',
          prompt: 'bandage',
          options: ['bandage', 'plaster', 'gauze', 'ointment'],
          answer: 'bandage',
        },
        {
          type: 'mc',
          prompt: 'emergency',
          options: ['emergency', 'urgent', 'serious', 'critical'],
          answer: 'emergency',
        },
        {
          type: 'match',
          pairs: [
            { left: 'treatment', right: 'treatment' },
            { left: 'recovery', right: 'recovery' },
            { left: 'health', right: 'health' },
          ],
        },
        {
          type: 'mc',
          prompt: 'vaccine',
          options: ['vaccine', 'injection', 'shot', 'dose'],
          answer: 'vaccine',
        },
        {
          type: 'mc',
          prompt: 'sick',
          options: ['sick', 'ill', 'healthy', 'well'],
          answer: 'sick',
        },
      ],
    },
    de: {
      exercises: [
        {
          type: 'mc',
          prompt: 'Schmerz',
          options: ['Schmerz', 'Fieber', 'Erkaeltung', 'Medizin'],
          answer: 'Schmerz',
        },
        {
          type: 'mc',
          prompt: 'Fieber',
          options: ['Fieber', 'Erkaeltung', 'Medizin', 'Husten'],
          answer: 'Fieber',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Erkaeltung', right: 'Erkaeltung' },
            { left: 'Medizin', right: 'Medizin' },
            { left: 'Apotheke', right: 'Apotheke' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Husten',
          options: ['Husten', 'Niesen', 'Hals', 'krank'],
          answer: 'Husten',
        },
        {
          type: 'mc',
          prompt: 'Medizin',
          options: ['Medizin', 'Pille', 'Tablette', 'Sirup'],
          answer: 'Medizin',
        },
        {
          type: 'mc',
          prompt: 'Apotheke',
          options: ['Apotheke', 'Krankenhaus', 'Klinik', 'Arzt'],
          answer: 'Apotheke',
        },
        {
          type: 'mc',
          prompt: 'Arzt',
          options: ['Arzt', 'Krankenschwester', 'Patient', 'Zahnarzt'],
          answer: 'Arzt',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Krankenhaus', right: 'Krankenhaus' },
            { left: 'Termin', right: 'Termin' },
            { left: 'Rezept', right: 'Rezept' },
            { left: 'Symptom', right: 'Symptom' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Kopfschmerzen',
          options: ['Kopfschmerzen', 'Bauchschmerzen', 'Zahnschmerzen', 'Rückenschmerzen'],
          answer: 'Kopfschmerzen',
        },
        {
          type: 'mc',
          prompt: 'Allergie',
          options: ['Allergie', 'Infektion', 'Krankheit', 'Verletzung'],
          answer: 'Allergie',
        },
        {
          type: 'mc',
          prompt: 'Verband',
          options: ['Verband', 'Pflaster', 'Gaze', 'Salbe'],
          answer: 'Verband',
        },
        {
          type: 'mc',
          prompt: 'Notfall',
          options: ['Notfall', 'dringend', 'ernst', 'kritisch'],
          answer: 'Notfall',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Behandlung', right: 'Behandlung' },
            { left: 'Genesung', right: 'Genesung' },
            { left: 'Gesundheit', right: 'Gesundheit' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Impfung',
          options: ['Impfung', 'Spritze', 'Injektion', 'Dosis'],
          answer: 'Impfung',
        },
        {
          type: 'mc',
          prompt: 'krank',
          options: ['krank', 'ill', 'gesund', 'wohl'],
          answer: 'krank',
        },
      ],
    },
    'pt-br': {
      exercises: [
        {
          type: 'mc',
          prompt: 'dor',
          options: ['dor', 'febre', 'resfriado', 'remedio'],
          answer: 'dor',
        },
        {
          type: 'mc',
          prompt: 'febre',
          options: ['febre', 'resfriado', 'remedio', 'tosse'],
          answer: 'febre',
        },
        {
          type: 'match',
          pairs: [
            { left: 'resfriado', right: 'resfriado' },
            { left: 'remedio', right: 'remedio' },
            { left: 'farmacia', right: 'farmacia' },
          ],
        },
        {
          type: 'mc',
          prompt: 'tosse',
          options: ['tosse', 'espirro', 'garganta', 'doente'],
          answer: 'tosse',
        },
        {
          type: 'mc',
          prompt: 'remedio',
          options: ['remedio', 'pilula', 'comprimido', 'xarope'],
          answer: 'remedio',
        },
        {
          type: 'mc',
          prompt: 'farmacia',
          options: ['farmacia', 'hospital', 'clinica', 'medico'],
          answer: 'farmacia',
        },
        {
          type: 'mc',
          prompt: 'medico',
          options: ['medico', 'enfermeiro', 'paciente', 'dentista'],
          answer: 'medico',
        },
        {
          type: 'match',
          pairs: [
            { left: 'hospital', right: 'hospital' },
            { left: 'consulta', right: 'consulta' },
            { left: 'receita', right: 'receita' },
            { left: 'sintoma', right: 'sintoma' },
          ],
        },
        {
          type: 'mc',
          prompt: 'dor de cabeca',
          options: ['dor de cabeca', 'dor de barriga', 'dor de dente', 'dor nas costas'],
          answer: 'dor de cabeca',
        },
        {
          type: 'mc',
          prompt: 'alergia',
          options: ['alergia', 'infeccao', 'doenca', 'ferimento'],
          answer: 'alergia',
        },
        {
          type: 'mc',
          prompt: 'curativo',
          options: ['curativo', 'band-aid', 'gaze', 'pomada'],
          answer: 'curativo',
        },
        {
          type: 'mc',
          prompt: 'emergencia',
          options: ['emergencia', 'urgente', 'serio', 'critico'],
          answer: 'emergencia',
        },
        {
          type: 'match',
          pairs: [
            { left: 'tratamento', right: 'tratamento' },
            { left: 'recuperacao', right: 'recuperacao' },
            { left: 'saude', right: 'saude' },
          ],
        },
        {
          type: 'mc',
          prompt: 'vacina',
          options: ['vacina', 'injecao', 'dose', 'aplicacao'],
          answer: 'vacina',
        },
        {
          type: 'mc',
          prompt: 'doente',
          options: ['doente', 'enfermo', 'saudavel', 'bem'],
          answer: 'doente',
        },
      ],
    },
  },
  'level-4-3': {
    en: {
      exercises: [
        {
          type: 'mc',
          prompt: 'office',
          options: ['office', 'school', 'meeting', 'computer'],
          answer: 'office',
        },
        {
          type: 'mc',
          prompt: 'school',
          options: ['school', 'office', 'meeting', 'computer'],
          answer: 'school',
        },
        {
          type: 'match',
          pairs: [
            { left: 'meeting', right: 'meeting' },
            { left: 'computer', right: 'computer' },
            { left: 'homework', right: 'homework' },
          ],
        },
        {
          type: 'mc',
          prompt: 'meeting',
          options: ['meeting', 'conference', 'presentation', 'discussion'],
          answer: 'meeting',
        },
        {
          type: 'mc',
          prompt: 'computer',
          options: ['computer', 'laptop', 'tablet', 'keyboard'],
          answer: 'computer',
        },
        {
          type: 'mc',
          prompt: 'homework',
          options: ['homework', 'assignment', 'project', 'task'],
          answer: 'homework',
        },
        {
          type: 'mc',
          prompt: 'desk',
          options: ['desk', 'chair', 'table', 'drawer'],
          answer: 'desk',
        },
        {
          type: 'match',
          pairs: [
            { left: 'teacher', right: 'teacher' },
            { left: 'student', right: 'student' },
            { left: 'colleague', right: 'colleague' },
            { left: 'boss', right: 'boss' },
          ],
        },
        {
          type: 'mc',
          prompt: 'exam',
          options: ['exam', 'test', 'quiz', 'grade'],
          answer: 'exam',
        },
        {
          type: 'mc',
          prompt: 'class',
          options: ['class', 'lesson', 'lecture', 'course'],
          answer: 'class',
        },
        {
          type: 'mc',
          prompt: 'deadline',
          options: ['deadline', 'schedule', 'timetable', 'calendar'],
          answer: 'deadline',
        },
        {
          type: 'mc',
          prompt: 'report',
          options: ['report', 'document', 'file', 'paper'],
          answer: 'report',
        },
        {
          type: 'match',
          pairs: [
            { left: 'email', right: 'email' },
            { left: 'phone call', right: 'phone call' },
            { left: 'presentation', right: 'presentation' },
          ],
        },
        {
          type: 'mc',
          prompt: 'break',
          options: ['break', 'lunch', 'recess', 'pause'],
          answer: 'break',
        },
        {
          type: 'mc',
          prompt: 'career',
          options: ['career', 'job', 'profession', 'occupation'],
          answer: 'career',
        },
      ],
    },
    de: {
      exercises: [
        {
          type: 'mc',
          prompt: 'Buero',
          options: ['Buero', 'Schule', 'Besprechung', 'Computer'],
          answer: 'Buero',
        },
        {
          type: 'mc',
          prompt: 'Schule',
          options: ['Schule', 'Buero', 'Besprechung', 'Computer'],
          answer: 'Schule',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Besprechung', right: 'Besprechung' },
            { left: 'Computer', right: 'Computer' },
            { left: 'Hausaufgabe', right: 'Hausaufgabe' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Besprechung',
          options: ['Besprechung', 'Konferenz', 'Präsentation', 'Diskussion'],
          answer: 'Besprechung',
        },
        {
          type: 'mc',
          prompt: 'Computer',
          options: ['Computer', 'Laptop', 'Tablet', 'Tastatur'],
          answer: 'Computer',
        },
        {
          type: 'mc',
          prompt: 'Hausaufgabe',
          options: ['Hausaufgabe', 'Aufgabe', 'Projekt', 'Arbeit'],
          answer: 'Hausaufgabe',
        },
        {
          type: 'mc',
          prompt: 'Schreibtisch',
          options: ['Schreibtisch', 'Stuhl', 'Tisch', 'Schublade'],
          answer: 'Schreibtisch',
        },
        {
          type: 'match',
          pairs: [
            { left: 'Lehrer', right: 'Lehrer' },
            { left: 'Schüler', right: 'Schüler' },
            { left: 'Kollege', right: 'Kollege' },
            { left: 'Chef', right: 'Chef' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Prüfung',
          options: ['Prüfung', 'Test', 'Quiz', 'Note'],
          answer: 'Prüfung',
        },
        {
          type: 'mc',
          prompt: 'Unterricht',
          options: ['Unterricht', 'Lektion', 'Vorlesung', 'Kurs'],
          answer: 'Unterricht',
        },
        {
          type: 'mc',
          prompt: 'Frist',
          options: ['Frist', 'Zeitplan', 'Stundenplan', 'Kalender'],
          answer: 'Frist',
        },
        {
          type: 'mc',
          prompt: 'Bericht',
          options: ['Bericht', 'Dokument', 'Datei', 'Papier'],
          answer: 'Bericht',
        },
        {
          type: 'match',
          pairs: [
            { left: 'E-Mail', right: 'E-Mail' },
            { left: 'Telefonanruf', right: 'Telefonanruf' },
            { left: 'Präsentation', right: 'Präsentation' },
          ],
        },
        {
          type: 'mc',
          prompt: 'Pause',
          options: ['Pause', 'Mittagspause', 'Schulpause', 'Unterbrechung'],
          answer: 'Pause',
        },
        {
          type: 'mc',
          prompt: 'Karriere',
          options: ['Karriere', 'Job', 'Beruf', 'Tätigkeit'],
          answer: 'Karriere',
        },
      ],
    },
    'pt-br': {
      exercises: [
        {
          type: 'mc',
          prompt: 'escritorio',
          options: ['escritorio', 'escola', 'reuniao', 'computador'],
          answer: 'escritorio',
        },
        {
          type: 'mc',
          prompt: 'escola',
          options: ['escola', 'escritorio', 'reuniao', 'computador'],
          answer: 'escola',
        },
        {
          type: 'match',
          pairs: [
            { left: 'reuniao', right: 'reuniao' },
            { left: 'computador', right: 'computador' },
            { left: 'licao', right: 'licao' },
          ],
        },
        {
          type: 'mc',
          prompt: 'reuniao',
          options: ['reuniao', 'conferencia', 'apresentacao', 'discussao'],
          answer: 'reuniao',
        },
        {
          type: 'mc',
          prompt: 'computador',
          options: ['computador', 'laptop', 'tablet', 'teclado'],
          answer: 'computador',
        },
        {
          type: 'mc',
          prompt: 'licao',
          options: ['licao', 'tarefa', 'projeto', 'trabalho'],
          answer: 'licao',
        },
        {
          type: 'mc',
          prompt: 'escrivaninha',
          options: ['escrivaninha', 'cadeira', 'mesa', 'gaveta'],
          answer: 'escrivaninha',
        },
        {
          type: 'match',
          pairs: [
            { left: 'professor', right: 'professor' },
            { left: 'aluno', right: 'aluno' },
            { left: 'colega', right: 'colega' },
            { left: 'chefe', right: 'chefe' },
          ],
        },
        {
          type: 'mc',
          prompt: 'exame',
          options: ['exame', 'teste', 'prova', 'nota'],
          answer: 'exame',
        },
        {
          type: 'mc',
          prompt: 'aula',
          options: ['aula', 'licao', 'palestra', 'curso'],
          answer: 'aula',
        },
        {
          type: 'mc',
          prompt: 'prazo',
          options: ['prazo', 'agenda', 'horario', 'calendario'],
          answer: 'prazo',
        },
        {
          type: 'mc',
          prompt: 'relatorio',
          options: ['relatorio', 'documento', 'arquivo', 'papel'],
          answer: 'relatorio',
        },
        {
          type: 'match',
          pairs: [
            { left: 'email', right: 'email' },
            { left: 'ligacao', right: 'ligacao' },
            { left: 'apresentacao', right: 'apresentacao' },
          ],
        },
        {
          type: 'mc',
          prompt: 'intervalo',
          options: ['intervalo', 'almoco', 'recreio', 'pausa'],
          answer: 'intervalo',
        },
        {
          type: 'mc',
          prompt: 'carreira',
          options: ['carreira', 'emprego', 'profissao', 'ocupacao'],
          answer: 'carreira',
        },
      ],
    },
  },
};
