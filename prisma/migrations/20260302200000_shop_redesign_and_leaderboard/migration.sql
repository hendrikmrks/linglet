-- Add showFullName to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "showFullName" BOOLEAN NOT NULL DEFAULT false;

-- Update ShopItemType enum: remove old values, add new ones
-- First, update any existing items with old types to BADGE
UPDATE "ShopItem" SET type = 'BADGE' WHERE type IN ('AVATAR_FRAME', 'PROFILE_BACKGROUND', 'TITLE', 'STICKER');

-- Alter enum type (PostgreSQL approach)
ALTER TYPE "ShopItemType" ADD VALUE IF NOT EXISTS 'THEME';
ALTER TYPE "ShopItemType" ADD VALUE IF NOT EXISTS 'BOOSTER';

-- Seed predefined badge shop items (only if they don't already exist)
INSERT INTO "ShopItem" (id, name, description, type, price, icon, "isActive", metadata, "createdAt", "updatedAt")
VALUES 
  ('badge-star', '⭐ Stern', 'Ein goldener Stern zeigt dein Engagement', 'BADGE', 200, '⭐', true, NULL, NOW(), NOW()),
  ('badge-fire', '🔥 Flamme', 'Zeige deine heisse Lernserie', 'BADGE', 300, '🔥', true, NULL, NOW(), NOW()),
  ('badge-diamond', '💎 Diamant', 'Fuer echte Sprachtalente', 'BADGE', 500, '💎', true, NULL, NOW(), NOW()),
  ('badge-lion', '🦁 Loewe', 'Mut und Staerke beim Lernen', 'BADGE', 400, '🦁', true, NULL, NOW(), NOW()),
  ('badge-rocket', '🚀 Rakete', 'Du lernst mit Lichtgeschwindigkeit', 'BADGE', 350, '🚀', true, NULL, NOW(), NOW()),
  ('badge-trophy', '🏆 Champion', 'Der ultimative Lern-Champion', 'BADGE', 800, '🏆', true, NULL, NOW(), NOW()),
  ('badge-crown', '👑 Krone', 'Koenig der Sprachen', 'BADGE', 1000, '👑', true, NULL, NOW(), NOW()),
  ('badge-rainbow', '🌈 Regenbogen', 'Vielfalt in jeder Sprache', 'BADGE', 250, '🌈', true, NULL, NOW(), NOW()),
  ('badge-lightning', '⚡ Blitz', 'Blitzschneller Lerner', 'BADGE', 300, '⚡', true, NULL, NOW(), NOW()),
  ('badge-heart', '❤️ Herz', 'Mit Liebe zum Lernen', 'BADGE', 150, '❤️', true, NULL, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
