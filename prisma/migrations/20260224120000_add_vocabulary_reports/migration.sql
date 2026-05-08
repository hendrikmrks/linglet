-- CreateEnum
CREATE TYPE "VocabularyReportStatus" AS ENUM ('OPEN', 'RESOLVED');

-- CreateEnum
CREATE TYPE "VocabularyReportType" AS ENUM ('WORD', 'TRANSLATION');

-- CreateTable
CREATE TABLE "VocabularyReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vocabularyId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "subchapterId" TEXT NOT NULL,
    "issueType" "VocabularyReportType" NOT NULL,
    "reason" TEXT NOT NULL,
    "comment" TEXT,
    "word" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "sourceLanguage" TEXT NOT NULL,
    "targetLanguage" TEXT NOT NULL,
    "status" "VocabularyReportStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VocabularyReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VocabularyReport_userId_idx" ON "VocabularyReport"("userId");

-- CreateIndex
CREATE INDEX "VocabularyReport_vocabularyId_idx" ON "VocabularyReport"("vocabularyId");

-- CreateIndex
CREATE INDEX "VocabularyReport_status_idx" ON "VocabularyReport"("status");

-- AddForeignKey
ALTER TABLE "VocabularyReport" ADD CONSTRAINT "VocabularyReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabularyReport" ADD CONSTRAINT "VocabularyReport_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabularyReport" ADD CONSTRAINT "VocabularyReport_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabularyReport" ADD CONSTRAINT "VocabularyReport_subchapterId_fkey" FOREIGN KEY ("subchapterId") REFERENCES "Subchapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
