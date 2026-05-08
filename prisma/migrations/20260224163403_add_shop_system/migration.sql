-- CreateEnum
CREATE TYPE "ShopItemType" AS ENUM ('BADGE', 'AVATAR_FRAME', 'PROFILE_BACKGROUND', 'TITLE', 'STICKER');

-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sourceLanguage" TEXT NOT NULL DEFAULT 'de',
ADD COLUMN     "targetLanguage" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "unlocksAt" TIMESTAMP(3),
ALTER COLUMN "language" SET DEFAULT 'en';

-- AlterTable
ALTER TABLE "Subchapter" ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "unlocksAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'de',
ADD COLUMN     "learningLanguage" TEXT NOT NULL DEFAULT 'en';

-- CreateTable
CREATE TABLE "ShopItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ShopItemType" NOT NULL,
    "price" INTEGER NOT NULL,
    "icon" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shopItemId" TEXT NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipped" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShopItem_type_isActive_idx" ON "ShopItem"("type", "isActive");

-- CreateIndex
CREATE INDEX "UserPurchase_userId_idx" ON "UserPurchase"("userId");

-- CreateIndex
CREATE INDEX "UserPurchase_shopItemId_idx" ON "UserPurchase"("shopItemId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPurchase_userId_shopItemId_key" ON "UserPurchase"("userId", "shopItemId");

-- AddForeignKey
ALTER TABLE "UserPurchase" ADD CONSTRAINT "UserPurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPurchase" ADD CONSTRAINT "UserPurchase_shopItemId_fkey" FOREIGN KEY ("shopItemId") REFERENCES "ShopItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
