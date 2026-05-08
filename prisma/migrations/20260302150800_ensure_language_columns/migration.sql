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
ALTER TABLE "Badge" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "LearningChapter" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "LearningLevel" ALTER COLUMN "requiredXp" SET NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UserBadge" ALTER COLUMN "awardedAt" SET NOT NULL,
ALTER COLUMN "awardedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserLevelProgress" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "LearningLevel_chapterId_idx" ON "LearningLevel"("chapterId");

-- RenameIndex
ALTER INDEX "UserLevelProgress_userId_levelId_idx" RENAME TO "UserLevelProgress_userId_levelId_key";
