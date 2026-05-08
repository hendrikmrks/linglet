/*
  Warnings:

  - Made the column `createdAt` on table `Badge` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Badge` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `LearningChapter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `LearningChapter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `requiredXp` on table `LearningLevel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `LearningLevel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `LearningLevel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `awardedAt` on table `UserBadge` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `UserLevelProgress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `UserLevelProgress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `UserLevelProgress` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE IF EXISTS "Badge" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE IF EXISTS "LearningChapter" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE IF EXISTS "LearningLevel" ALTER COLUMN "requiredXp" SET NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE IF EXISTS "UserBadge" ALTER COLUMN "awardedAt" SET NOT NULL,
ALTER COLUMN "awardedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE IF EXISTS "UserLevelProgress" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- CreateIndex
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'LearningLevel') THEN
    CREATE INDEX IF NOT EXISTS "LearningLevel_chapterId_idx" ON "LearningLevel"("chapterId");
  END IF;
END $$;

-- RenameIndex
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'UserLevelProgress_userId_levelId_idx') THEN
    ALTER INDEX IF EXISTS "UserLevelProgress_userId_levelId_idx" RENAME TO "UserLevelProgress_userId_levelId_key";
  END IF;
END $$;
