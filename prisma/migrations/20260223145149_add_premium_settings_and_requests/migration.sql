-- CreateEnum
CREATE TYPE "PremiumRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "PremiumRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT,
    "message" TEXT,
    "status" "PremiumRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PremiumRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PremiumSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "maxChaptersPerDayFree" INTEGER NOT NULL DEFAULT 2,
    "maxChaptersPerDayPremium" INTEGER NOT NULL DEFAULT -1,
    "maxSubchaptersPerDayFree" INTEGER NOT NULL DEFAULT 5,
    "maxSubchaptersPerDayPremium" INTEGER NOT NULL DEFAULT -1,
    "maxChaptersTotalFree" INTEGER NOT NULL DEFAULT 3,
    "canSeeLeaderboardFree" BOOLEAN NOT NULL DEFAULT false,
    "canSeeLeaderboardPremium" BOOLEAN NOT NULL DEFAULT true,
    "xpMultiplierPremium" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "maxLessonsPerDayFree" INTEGER NOT NULL DEFAULT 50,
    "maxLessonsPerDayPremium" INTEGER NOT NULL DEFAULT -1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PremiumSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PremiumRequest_userId_idx" ON "PremiumRequest"("userId");

-- AddForeignKey
ALTER TABLE "PremiumRequest" ADD CONSTRAINT "PremiumRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
