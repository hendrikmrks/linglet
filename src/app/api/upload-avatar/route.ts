import { cookies } from 'next/headers';
import { db } from '@/lib/db';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB before encoding
const MAX_BASE64_BYTES = Math.ceil(MAX_FILE_BYTES * 4 / 3) + 100; // base64 overhead

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('sessionToken')?.value;

    if (!sessionToken) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Find session
    const sessionResult = await db.query('SELECT * FROM "Session" WHERE "sessionToken" = $1', [sessionToken]);
    const session = sessionResult.rows[0];

    if (!session) {
      return Response.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Get file from request
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return Response.json({ error: 'Invalid file type. Only JPEG, PNG, GIF and WebP are allowed.' }, { status: 400 });
    }

    // Check file size (max 5MB)
    if (file.size > MAX_FILE_BYTES) {
      return Response.json({ error: 'File too large. Max 5MB.' }, { status: 400 });
    }

    // Convert file to base64 data URL
    const buffer = await file.arrayBuffer();

    // Validate magic bytes to ensure the file is actually the declared image type
    const bytes = new Uint8Array(buffer);
    const isValidImage =
      (file.type === 'image/jpeg' && bytes[0] === 0xff && bytes[1] === 0xd8) ||
      (file.type === 'image/png' && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) ||
      (file.type === 'image/gif' && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) ||
      (file.type === 'image/webp' && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50);

    if (!isValidImage) {
      return Response.json({ error: 'File content does not match declared type.' }, { status: 400 });
    }

    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = file.type;
    const avatarUrl = `data:${mimeType};base64,${base64}`;

    // Guard against base64-encoded size exceeding the limit
    if (avatarUrl.length > MAX_BASE64_BYTES) {
      return Response.json({ error: 'Encoded file too large.' }, { status: 400 });
    }

    // Update user avatar
    await db.query('UPDATE "User" SET "avatarUrl" = $1, "updatedAt" = NOW() WHERE id = $2', [
      avatarUrl,
      session.userId,
    ]);

    return Response.json({ avatarUrl });
  } catch (error) {
    console.error('Upload avatar error:', error);
    return Response.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    );
  }
}
