-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "streakUpdatedAt" DROP NOT NULL,
ALTER COLUMN "streakUpdatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subchapter" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subchapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vocabulary" (
    "id" TEXT NOT NULL,
    "subchapterId" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "example" TEXT,
    "translatedExample" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vocabulary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_language_order_key" ON "Chapter"("language", "order");

-- CreateIndex
CREATE INDEX "Subchapter_chapterId_idx" ON "Subchapter"("chapterId");

-- CreateIndex
CREATE UNIQUE INDEX "Subchapter_chapterId_order_key" ON "Subchapter"("chapterId", "order");

-- CreateIndex
CREATE INDEX "Vocabulary_subchapterId_idx" ON "Vocabulary"("subchapterId");

-- AddForeignKey
ALTER TABLE "Subchapter" ADD CONSTRAINT "Subchapter_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vocabulary" ADD CONSTRAINT "Vocabulary_subchapterId_fkey" FOREIGN KEY ("subchapterId") REFERENCES "Subchapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
