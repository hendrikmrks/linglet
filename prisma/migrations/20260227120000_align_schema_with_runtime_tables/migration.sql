-- Align Prisma schema with runtime tables created by ad-hoc scripts.

-- AlterTable
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "firstName" TEXT,
  ADD COLUMN IF NOT EXISTS "lastName" TEXT,
  ADD COLUMN IF NOT EXISTS "birthDate" DATE,
  ADD COLUMN IF NOT EXISTS "learningLanguage" TEXT DEFAULT 'en';

-- CreateTable
CREATE TABLE IF NOT EXISTS "LearningChapter" (
  "id" TEXT NOT NULL,
  "titleKey" TEXT NOT NULL,
  "orderIndex" INTEGER NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  CONSTRAINT "LearningChapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "LearningLevel" (
  "id" TEXT NOT NULL,
  "chapterId" TEXT NOT NULL,
  "titleKey" TEXT NOT NULL,
  "themeKey" TEXT NOT NULL,
  "orderIndex" INTEGER NOT NULL,
  "requiredXp" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  CONSTRAINT "LearningLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "UserLevelProgress" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "levelId" TEXT NOT NULL,
  "status" TEXT DEFAULT 'LOCKED',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  CONSTRAINT "UserLevelProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Badge" (
  "id" TEXT NOT NULL,
  "titleKey" TEXT NOT NULL,
  "descriptionKey" TEXT NOT NULL,
  "tier" TEXT NOT NULL,
  "icon" TEXT NOT NULL,
  "orderIndex" INTEGER NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "UserBadge" (
  "userId" TEXT NOT NULL,
  "badgeId" TEXT NOT NULL,
  "awardedAt" TIMESTAMP DEFAULT NOW(),
  CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("userId", "badgeId")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "UserLevelProgress_userId_levelId_idx"
  ON "UserLevelProgress"("userId", "levelId");

CREATE INDEX IF NOT EXISTS "UserLevelProgress_userId_idx"
  ON "UserLevelProgress"("userId");

CREATE INDEX IF NOT EXISTS "UserLevelProgress_levelId_idx"
  ON "UserLevelProgress"("levelId");

CREATE INDEX IF NOT EXISTS "UserBadge_userId_idx" ON "UserBadge"("userId");
CREATE INDEX IF NOT EXISTS "UserBadge_badgeId_idx" ON "UserBadge"("badgeId");

-- AddForeignKey
ALTER TABLE "LearningLevel"
  ADD CONSTRAINT "LearningLevel_chapterId_fkey"
  FOREIGN KEY ("chapterId") REFERENCES "LearningChapter"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserLevelProgress"
  ADD CONSTRAINT "UserLevelProgress_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserLevelProgress"
  ADD CONSTRAINT "UserLevelProgress_levelId_fkey"
  FOREIGN KEY ("levelId") REFERENCES "LearningLevel"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserBadge"
  ADD CONSTRAINT "UserBadge_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserBadge"
  ADD CONSTRAINT "UserBadge_badgeId_fkey"
  FOREIGN KEY ("badgeId") REFERENCES "Badge"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
