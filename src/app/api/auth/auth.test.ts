// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockDbQuery, mockCreateSession, mockHash, mockCompare } = vi.hoisted(() => ({
  mockDbQuery: vi.fn(),
  mockCreateSession: vi.fn(),
  mockHash: vi.fn(),
  mockCompare: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: { query: mockDbQuery },
}));

vi.mock('@/lib/auth', () => ({
  createSession: mockCreateSession,
}));

vi.mock('bcryptjs', () => ({
  default: { hash: mockHash, compare: mockCompare },
  hash: mockHash,
  compare: mockCompare,
}));

import { POST as registerPost } from '@/app/api/auth/register/route';
import { POST as loginPost } from '@/app/api/auth/login/route';

const VALID_REGISTER_BODY = {
  email: 'newuser@example.com',
  password: 'password123',
  confirmPassword: 'password123',
  firstName: 'Max',
  lastName: 'Mustermann',
  birthDate: '1990-01-01',
  learningLanguage: 'de',
};

const makeRequest = (url: string, body: unknown) =>
  new Request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockDbQuery.mockResolvedValue({ rows: [] });
    mockCreateSession.mockResolvedValue({ id: 'session1' });
    mockHash.mockResolvedValue('hashedpassword');
    mockCompare.mockResolvedValue(true);
  });

  it('returns 201 with user data on valid registration', async () => {
    mockDbQuery
      .mockResolvedValueOnce({ rows: [] }) // user does not exist
      .mockResolvedValueOnce({
        rows: [{ id: 'u1', email: 'newuser@example.com', name: 'Max Mustermann', plan: null }],
      }) // user created
      .mockResolvedValueOnce({ rows: [] }); // no LearningLevels

    const req = makeRequest('http://localhost/api/auth/register', VALID_REGISTER_BODY);
    const res = await registerPost(req as any);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data).toMatchObject({ id: 'u1', email: 'newuser@example.com' });
  });

  it('returns 400 with validation error for invalid email', async () => {
    const req = makeRequest('http://localhost/api/auth/register', {
      ...VALID_REGISTER_BODY,
      email: 'not-an-email',
    });
    const res = await registerPost(req as any);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data).toMatchObject({ error: 'Validation failed' });
  });

  it('returns 409 when user already exists', async () => {
    mockDbQuery.mockResolvedValueOnce({ rows: [{ id: 'existing-user' }] });

    const req = makeRequest('http://localhost/api/auth/register', VALID_REGISTER_BODY);
    const res = await registerPost(req as any);
    expect(res.status).toBe(409);
  });

  it('returns 500 on database error', async () => {
    mockDbQuery.mockRejectedValueOnce(new Error('DB connection failed'));

    const req = makeRequest('http://localhost/api/auth/register', VALID_REGISTER_BODY);
    const res = await registerPost(req as any);
    expect(res.status).toBe(500);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockDbQuery.mockResolvedValue({ rows: [] });
    mockCreateSession.mockResolvedValue({ id: 'session1' });
    mockHash.mockResolvedValue('hashedpassword');
    mockCompare.mockResolvedValue(true);
  });

  it('returns 200 with user data on valid login', async () => {
    mockDbQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 'u1',
          email: 'test@example.com',
          name: 'Test User',
          plan: 'FREE',
          passwordHash: 'hashedpassword',
        },
      ],
    });
    mockCompare.mockResolvedValueOnce(true);

    const req = makeRequest('http://localhost/api/auth/login', {
      email: 'test@example.com',
      password: 'password123',
    });
    const res = await loginPost(req as any);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toMatchObject({ id: 'u1', email: 'test@example.com' });
  });

  it('returns 401 when user is not found', async () => {
    mockDbQuery.mockResolvedValueOnce({ rows: [] });

    const req = makeRequest('http://localhost/api/auth/login', {
      email: 'notfound@example.com',
      password: 'password123',
    });
    const res = await loginPost(req as any);
    expect(res.status).toBe(401);
  });

  it('returns 400 for invalid email format', async () => {
    const req = makeRequest('http://localhost/api/auth/login', {
      email: 'invalidemail',
      password: 'password123',
    });
    const res = await loginPost(req as any);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data).toMatchObject({ error: 'Validation failed' });
  });

  it('returns 401 when password does not match', async () => {
    mockDbQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 'u1',
          email: 'test@example.com',
          name: 'Test User',
          plan: 'FREE',
          passwordHash: 'hashedpassword',
        },
      ],
    });
    mockCompare.mockResolvedValueOnce(false);

    const req = makeRequest('http://localhost/api/auth/login', {
      email: 'test@example.com',
      password: 'wrongpassword',
    });
    const res = await loginPost(req as any);
    expect(res.status).toBe(401);
  });
});
