import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '@/lib/validators';

const validRegisterInput = {
  email: 'test@example.com',
  password: 'password123',
  confirmPassword: 'password123',
  firstName: 'Max',
  lastName: 'Mustermann',
  birthDate: '1990-01-01',
  learningLanguage: 'de' as const,
};

describe('registerSchema', () => {
  it('accepts valid input', () => {
    const result = registerSchema.safeParse(validRegisterInput);
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({ ...validRegisterInput, email: 'notanemail' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain('email');
    }
  });

  it('rejects password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({
      ...validRegisterInput,
      password: 'short',
      confirmPassword: 'short',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain('password');
    }
  });

  it('rejects when passwords do not match (error on confirmPassword)', () => {
    const result = registerSchema.safeParse({
      ...validRegisterInput,
      confirmPassword: 'different_password',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain('confirmPassword');
    }
  });

  it('rejects empty firstName', () => {
    const result = registerSchema.safeParse({ ...validRegisterInput, firstName: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain('firstName');
    }
  });

  it('rejects empty lastName', () => {
    const result = registerSchema.safeParse({ ...validRegisterInput, lastName: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain('lastName');
    }
  });

  it('rejects invalid birthDate', () => {
    const result = registerSchema.safeParse({ ...validRegisterInput, birthDate: 'not-a-date' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain('birthDate');
    }
  });

  it('rejects invalid learningLanguage (e.g. fr)', () => {
    const result = registerSchema.safeParse({
      ...validRegisterInput,
      learningLanguage: 'fr',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain('learningLanguage');
    }
  });

  it('accepts learningLanguage "de"', () => {
    const result = registerSchema.safeParse({ ...validRegisterInput, learningLanguage: 'de' });
    expect(result.success).toBe(true);
  });

  it('accepts learningLanguage "en"', () => {
    const result = registerSchema.safeParse({ ...validRegisterInput, learningLanguage: 'en' });
    expect(result.success).toBe(true);
  });

  it('accepts learningLanguage "pt-br"', () => {
    const result = registerSchema.safeParse({ ...validRegisterInput, learningLanguage: 'pt-br' });
    expect(result.success).toBe(true);
  });
});

describe('loginSchema', () => {
  it('accepts valid email and password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'bademail', password: 'password123' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain('email');
    }
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain('password');
    }
  });
});

describe('updateProfileSchema', () => {
  it('rejects empty name', () => {
    const result = updateProfileSchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain('name');
    }
  });

  it('rejects name longer than 100 characters', () => {
    const result = updateProfileSchema.safeParse({ name: 'a'.repeat(101) });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain('name');
    }
  });

  it('accepts valid https avatarUrl', () => {
    const result = updateProfileSchema.safeParse({
      name: 'Test User',
      avatarUrl: 'https://example.com/avatar.png',
    });
    expect(result.success).toBe(true);
  });

  it('accepts data URI as avatarUrl', () => {
    const result = updateProfileSchema.safeParse({
      name: 'Test User',
      avatarUrl: 'data:image/png;base64,abc123',
    });
    expect(result.success).toBe(true);
  });

  it('accepts empty string as avatarUrl', () => {
    const result = updateProfileSchema.safeParse({
      name: 'Test User',
      avatarUrl: '',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid learningLanguage', () => {
    const result = updateProfileSchema.safeParse({
      name: 'Test User',
      learningLanguage: 'fr',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain('learningLanguage');
    }
  });
});

describe('changePasswordSchema', () => {
  it('rejects empty currentPassword', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: '',
      newPassword: 'newpassword123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain('currentPassword');
    }
  });

  it('rejects newPassword shorter than 8 characters', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'currentpass',
      newPassword: 'short',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain('newPassword');
    }
  });

  it('accepts valid currentPassword and newPassword', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'currentpass',
      newPassword: 'newpassword123',
    });
    expect(result.success).toBe(true);
  });
});
