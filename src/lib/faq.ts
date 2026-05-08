export const FAQ_LANGUAGES = ['de', 'pt-br', 'en'] as const;

export type FaqLanguage = (typeof FAQ_LANGUAGES)[number];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  language: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function isFaqLanguage(value: unknown): value is FaqLanguage {
  return typeof value === 'string' && FAQ_LANGUAGES.includes(value.toLowerCase() as FaqLanguage);
}

export function normalizeFaqLanguage(value: unknown): FaqLanguage {
  if (isFaqLanguage(value)) {
    return value.toLowerCase() as FaqLanguage;
  }

  return 'de';
}

export function mapFaqRow(row: any): FaqItem {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    order: Number(row.order ?? 0),
    language: row.language,
    isActive: row.isActive === true,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

type FaqValidationError = { error: string };
type FaqValidationSuccess<T> = { value: T };
type FaqValidationResult<T> = FaqValidationError | FaqValidationSuccess<T>;
type FaqWriteInput = Pick<FaqItem, 'question' | 'answer' | 'order' | 'language' | 'isActive'>;
type FaqUpdateInput = Partial<FaqWriteInput>;

function parseTextField(value: unknown, fieldName: string): FaqValidationResult<string> {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return { error: `${fieldName} is required` };
  }

  return { value: value.trim() };
}

function parseOrderField(value: unknown): FaqValidationResult<number> {
  if (value === undefined) {
    return { value: 0 };
  }

  if (typeof value === 'number' && Number.isInteger(value)) {
    return { value };
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number.parseInt(value, 10);
    if (Number.isInteger(parsed)) {
      return { value: parsed };
    }
  }

  return { error: 'Order must be an integer' };
}

function parseBooleanField(value: unknown, fieldName: string): FaqValidationResult<boolean> {
  if (typeof value === 'boolean') {
    return { value };
  }

  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') {
      return { value: true };
    }

    if (value.toLowerCase() === 'false') {
      return { value: false };
    }
  }

  return { error: `${fieldName} must be a boolean` };
}

export function validateCreateFaqInput(body: any): FaqValidationResult<FaqWriteInput> {
  const question = parseTextField(body?.question, 'Question');
  if ('error' in question) {
    return question;
  }

  const answer = parseTextField(body?.answer, 'Answer');
  if ('error' in answer) {
    return answer;
  }

  const order = parseOrderField(body?.order);
  if ('error' in order) {
    return order;
  }

  if (body?.language !== undefined && !isFaqLanguage(body.language)) {
    return { error: 'Invalid language' };
  }

  const language = body?.language === undefined ? 'de' : body.language.toLowerCase() as FaqLanguage;
  const isActive = body?.isActive === undefined
    ? { value: true }
    : parseBooleanField(body.isActive, 'isActive');

  if ('error' in isActive) {
    return isActive;
  }

  return {
    value: {
      question: question.value,
      answer: answer.value,
      order: order.value,
      language,
      isActive: isActive.value,
    },
  };
}

export function validateUpdateFaqInput(body: any): FaqValidationResult<FaqUpdateInput> {
  const updates: FaqUpdateInput = {};

  if (body?.question !== undefined) {
    const question = parseTextField(body.question, 'Question');
    if ('error' in question) {
      return question;
    }
    updates.question = question.value;
  }

  if (body?.answer !== undefined) {
    const answer = parseTextField(body.answer, 'Answer');
    if ('error' in answer) {
      return answer;
    }
    updates.answer = answer.value;
  }

  if (body?.order !== undefined) {
    const order = parseOrderField(body.order);
    if ('error' in order) {
      return order;
    }
    updates.order = order.value;
  }

  if (body?.language !== undefined) {
    if (!isFaqLanguage(body.language)) {
      return { error: 'Invalid language' };
    }
    updates.language = body.language.toLowerCase() as FaqLanguage;
  }

  if (body?.isActive !== undefined) {
    const isActive = parseBooleanField(body.isActive, 'isActive');
    if ('error' in isActive) {
      return isActive;
    }
    updates.isActive = isActive.value;
  }

  if (Object.keys(updates).length === 0) {
    return { error: 'No valid fields to update' };
  }

  return { value: updates };
}
