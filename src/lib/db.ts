import { Pool } from 'pg';

// Direct PostgreSQL connection without Prisma (ARM64 compatible)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = pool;

// Prisma-like API wrapper for compatibility
export const prisma = {
  user: {
    findUnique: async ({ where }: any) => {
      const query = 'SELECT * FROM "User" WHERE id = $1 OR email = $2';
      const result = await db.query(query, [where.id || null, where.email || null]);
      return result.rows[0] || null;
    },
    create: async ({ data }: any) => {
      const query = `
        INSERT INTO "User" (id, email, "passwordHash", name, plan, xp, "streakCount", "streakUpdatedAt", "createdAt", "updatedAt")
        VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, NOW(), NOW(), NOW())
        RETURNING *
      `;
      const result = await db.query(query, [data.email, data.passwordHash, data.name, data.plan || 'FREE', data.xp || 0, data.streakCount || 0]);
      return result.rows[0];
    },
    update: async ({ where, data }: any) => {
      const ALLOWED_FIELDS = new Set([
        'email', 'passwordHash', 'name', 'firstName', 'lastName', 'birthDate',
        'avatarUrl', 'plan', 'isAdmin', 'isTestUser', 'onboardingComplete',
        'xp', 'streakCount', 'streakUpdatedAt', 'showFullName', 'language', 'learningLanguage',
      ]);
      const fields = Object.keys(data).filter(f => ALLOWED_FIELDS.has(f));
      if (fields.length === 0) throw new Error('No valid fields to update');
      const values = fields.map(f => (data as any)[f]);
      const setClauses = fields.map((field, i) => `"${field}" = $${i + 1}`).join(', ');
      const query = `UPDATE "User" SET ${setClauses}, "updatedAt" = NOW() WHERE id = $${fields.length + 1} RETURNING *`;
      const result = await db.query(query, [...values, where.id]);
      return result.rows[0];
    },
  },
  chapter: {
    findMany: async ({ where, include, orderBy }: any) => {
      let query = `SELECT * FROM "Chapter"`;
      const params: any[] = [];
      let paramCount = 1;
      const conditions: string[] = [];

      if (where?.language) {
        conditions.push(`language = $${paramCount}`);
        params.push(where.language);
        paramCount++;
      }

      if (where?.targetLanguage) {
        conditions.push(`"targetLanguage" = $${paramCount}`);
        params.push(where.targetLanguage);
        paramCount++;
      }

      if (where?.sourceLanguage) {
        conditions.push(`"sourceLanguage" = $${paramCount}`);
        params.push(where.sourceLanguage);
        paramCount++;
      }

      if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
      }

      if (orderBy?.order) {
        query += ` ORDER BY "order" ${orderBy.order === 'asc' ? 'ASC' : 'DESC'}`;
      }

      const result = await db.query(query, params);
      
      if (include?.subchapters) {
        for (const chapter of result.rows) {
          const subQuery = `SELECT * FROM "Subchapter" WHERE "chapterId" = $1 ORDER BY "order" ASC`;
          const subResult = await db.query(subQuery, [chapter.id]);
          
          if (include.subchapters.include?.vocabulary) {
            for (const subchapter of subResult.rows) {
              const vocabQuery = `SELECT * FROM "Vocabulary" WHERE "subchapterId" = $1 ORDER BY "order" ASC`;
              const vocabResult = await db.query(vocabQuery, [subchapter.id]);
              subchapter.vocabulary = vocabResult.rows;
            }
          }
          
          chapter.subchapters = subResult.rows;
        }
      }

      return result.rows;
    },
    findFirst: async ({ where, orderBy }: any) => {
      let query = `SELECT * FROM "Chapter"`;
      const params: any[] = [];
      let paramCount = 1;
      const conditions: string[] = [];

      if (where?.language) {
        conditions.push(`language = $${paramCount}`);
        params.push(where.language);
        paramCount++;
      }

      if (where?.targetLanguage) {
        conditions.push(`"targetLanguage" = $${paramCount}`);
        params.push(where.targetLanguage);
        paramCount++;
      }

      if (where?.sourceLanguage) {
        conditions.push(`"sourceLanguage" = $${paramCount}`);
        params.push(where.sourceLanguage);
        paramCount++;
      }

      if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
      }

      if (orderBy?.order) {
        query += ` ORDER BY "order" ${orderBy.order === 'asc' ? 'ASC' : 'DESC'}`;
      }

      query += ` LIMIT 1`;

      const result = await db.query(query, params);
      return result.rows[0] || null;
    },
    findUnique: async ({ where }: any) => {
      const query = `SELECT * FROM "Chapter" WHERE id = $1`;
      const result = await db.query(query, [where.id]);
      return result.rows[0] || null;
    },
    create: async ({ data, include }: any) => {
      const query = `
        INSERT INTO "Chapter" (id, title, description, language, "sourceLanguage", "targetLanguage", "isFeatured", "isLocked", "unlocksAt", "order", "createdAt", "updatedAt")
        VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        RETURNING *
      `;
      const result = await db.query(query, [
        data.title, data.description, data.language,
        data.sourceLanguage || 'de', data.targetLanguage || data.language,
        data.isFeatured || false, data.isLocked || false, data.unlocksAt || null,
        data.order
      ]);
      const chapter = result.rows[0];
      if (include?.subchapters) {
        chapter.subchapters = [];
      }
      return chapter;
    },
    update: async ({ where, data, include }: any) => {
      const ALLOWED_FIELDS = new Set([
        'title', 'description', 'language', 'sourceLanguage', 'targetLanguage',
        'isFeatured', 'isLocked', 'unlocksAt', 'order',
      ]);
      const fields = Object.keys(data).filter(f => ALLOWED_FIELDS.has(f));
      if (fields.length === 0) throw new Error('No valid fields to update');
      const values = fields.map(f => (data as any)[f]);
      const setClauses = fields.map((field, i) => `"${field}" = $${i + 1}`).join(', ');
      const query = `UPDATE "Chapter" SET ${setClauses}, "updatedAt" = NOW() WHERE id = $${fields.length + 1} RETURNING *`;
      const result = await db.query(query, [...values, where.id]);
      const chapter = result.rows[0];
      if (chapter && include?.subchapters) {
        const subQuery = `SELECT * FROM "Subchapter" WHERE "chapterId" = $1 ORDER BY "order" ASC`;
        const subResult = await db.query(subQuery, [chapter.id]);
        chapter.subchapters = subResult.rows;
      }
      return chapter;
    },
    delete: async ({ where }: any) => {
      // Delete all vocabulary in all subchapters of this chapter first
      await db.query('DELETE FROM "Vocabulary" WHERE "subchapterId" IN (SELECT id FROM "Subchapter" WHERE "chapterId" = $1)', [where.id]);
      // Delete all subchapters
      await db.query('DELETE FROM "Subchapter" WHERE "chapterId" = $1', [where.id]);
      // Delete chapter
      const query = `DELETE FROM "Chapter" WHERE id = $1`;
      await db.query(query, [where.id]);
    },
  },
  subchapter: {
    findMany: async ({ where, include, orderBy }: any) => {
      let query = `SELECT * FROM "Subchapter"`;
      const params = [];
      let paramCount = 1;

      if (where?.chapterId) {
        query += ` WHERE "chapterId" = $${paramCount}`;
        params.push(where.chapterId);
        paramCount++;
      }

      if (orderBy?.order) {
        query += ` ORDER BY "order" ${orderBy.order === 'asc' ? 'ASC' : 'DESC'}`;
      }

      const result = await db.query(query, params);
      
      if (include?.vocabulary) {
        for (const subchapter of result.rows) {
          const vocabQuery = `SELECT * FROM "Vocabulary" WHERE "subchapterId" = $1 ORDER BY "order" ASC`;
          const vocabResult = await db.query(vocabQuery, [subchapter.id]);
          subchapter.vocabulary = vocabResult.rows;
        }
      }

      if (include?.chapter) {
        for (const subchapter of result.rows) {
          const chapterQuery = `SELECT * FROM "Chapter" WHERE id = $1`;
          const chapterResult = await db.query(chapterQuery, [subchapter.chapterId]);
          subchapter.chapter = chapterResult.rows[0];
        }
      }

      return result.rows;
    },
    findFirst: async ({ where, orderBy }: any) => {
      let query = `SELECT * FROM "Subchapter"`;
      const params = [];
      let paramCount = 1;

      if (where?.chapterId) {
        query += ` WHERE "chapterId" = $${paramCount}`;
        params.push(where.chapterId);
        paramCount++;
      }

      if (orderBy?.order) {
        query += ` ORDER BY "order" ${orderBy.order === 'asc' ? 'ASC' : 'DESC'}`;
      }

      query += ` LIMIT 1`;

      const result = await db.query(query, params);
      return result.rows[0] || null;
    },
    findUnique: async ({ where }: any) => {
      const query = `SELECT * FROM "Subchapter" WHERE id = $1`;
      const result = await db.query(query, [where.id]);
      return result.rows[0] || null;
    },
    create: async ({ data }: any) => {
      const query = `
        INSERT INTO "Subchapter" (id, "chapterId", title, description, "isLocked", "unlocksAt", "order", "createdAt", "updatedAt")
        VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING *
      `;
      const result = await db.query(query, [data.chapterId, data.title, data.description, data.isLocked || false, data.unlocksAt || null, data.order]);
      return result.rows[0];
    },
    update: async ({ where, data }: any) => {
      const ALLOWED_FIELDS = new Set(['chapterId', 'title', 'description', 'isLocked', 'unlocksAt', 'order']);
      const fields = Object.keys(data).filter(f => ALLOWED_FIELDS.has(f));
      if (fields.length === 0) throw new Error('No valid fields to update');
      const values = fields.map(f => (data as any)[f]);
      const setClauses = fields.map((field, i) => `"${field}" = $${i + 1}`).join(', ');
      const query = `UPDATE "Subchapter" SET ${setClauses}, "updatedAt" = NOW() WHERE id = $${fields.length + 1} RETURNING *`;
      const result = await db.query(query, [...values, where.id]);
      return result.rows[0];
    },
    delete: async ({ where }: any) => {
      // Delete all vocabulary in subchapter first
      await db.query('DELETE FROM "Vocabulary" WHERE "subchapterId" = $1', [where.id]);
      const query = `DELETE FROM "Subchapter" WHERE id = $1`;
      await db.query(query, [where.id]);
    },
  },
  vocabulary: {
    findMany: async ({ where, include, orderBy }: any) => {
      let query = `SELECT * FROM "Vocabulary"`;
      const params = [];
      let paramCount = 1;

      if (where?.subchapterId) {
        query += ` WHERE "subchapterId" = $${paramCount}`;
        params.push(where.subchapterId);
        paramCount++;
      }

      if (orderBy?.order) {
        query += ` ORDER BY "order" ${orderBy.order === 'asc' ? 'ASC' : 'DESC'}`;
      }

      const result = await db.query(query, params);
      
      if (include?.subchapter) {
        for (const vocab of result.rows) {
          const subQuery = `SELECT * FROM "Subchapter" WHERE id = $1`;
          const subResult = await db.query(subQuery, [vocab.subchapterId]);
          vocab.subchapter = subResult.rows[0];
          
          if (include.subchapter.include?.chapter) {
            const chapterQuery = `SELECT * FROM "Chapter" WHERE id = $1`;
            const chapterResult = await db.query(chapterQuery, [vocab.subchapter.chapterId]);
            vocab.subchapter.chapter = chapterResult.rows[0];
          }
        }
      }

      return result.rows;
    },
    findUnique: async ({ where }: any) => {
      const query = `SELECT * FROM "Vocabulary" WHERE id = $1`;
      const result = await db.query(query, [where.id]);
      return result.rows[0] || null;
    },
    create: async ({ data }: any) => {
      const query = `
        INSERT INTO "Vocabulary" (id, "subchapterId", word, translation, example, "translatedExample", "order", "createdAt", "updatedAt")
        VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING *
      `;
      const result = await db.query(query, [data.subchapterId, data.word, data.translation, data.example, data.translatedExample, data.order]);
      return result.rows[0];
    },
    update: async ({ where, data }: any) => {
      const ALLOWED_FIELDS = new Set(['subchapterId', 'word', 'translation', 'example', 'translatedExample', 'order']);
      const fields = Object.keys(data).filter(f => ALLOWED_FIELDS.has(f));
      if (fields.length === 0) throw new Error('No valid fields to update');
      const values = fields.map(f => (data as any)[f]);
      const setClauses = fields.map((field, i) => `"${field}" = $${i + 1}`).join(', ');
      const query = `UPDATE "Vocabulary" SET ${setClauses}, "updatedAt" = NOW() WHERE id = $${fields.length + 1} RETURNING *`;
      const result = await db.query(query, [...values, where.id]);
      return result.rows[0];
    },
    delete: async ({ where }: any) => {
      const query = `DELETE FROM "Vocabulary" WHERE id = $1`;
      await db.query(query, [where.id]);
    },
  },
  session: {
    create: async ({ data }: any) => {
      const query = `
        INSERT INTO "Session" (id, "userId", "sessionToken", "expiresAt")
        VALUES (gen_random_uuid()::text, $1, $2, $3)
        RETURNING *
      `;
      const result = await db.query(query, [data.userId, data.sessionToken, data.expiresAt]);
      return result.rows[0];
    },
    findUnique: async ({ where, include }: any) => {
      const query = `SELECT * FROM "Session" WHERE "sessionToken" = $1`;
      const result = await db.query(query, [where.sessionToken]);
      const session = result.rows[0];
      
      if (session && include?.user) {
        const userQuery = `SELECT * FROM "User" WHERE id = $1`;
        const userResult = await db.query(userQuery, [session.userId]);
        return { ...session, user: userResult.rows[0] };
      }
      return session || null;
    },
    delete: async ({ where }: any) => {
      const query = `DELETE FROM "Session" WHERE "sessionToken" = $1`;
      await db.query(query, [where.sessionToken]);
    },
    deleteMany: async () => {
      await db.query('DELETE FROM "Session"');
    },
  },
  $disconnect: async () => {
    await pool.end();
  },
};
