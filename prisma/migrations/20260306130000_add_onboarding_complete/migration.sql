-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "onboardingComplete" BOOLEAN NOT NULL DEFAULT false;

-- Mark all existing users as onboarding complete (they already use the app)
UPDATE "User" SET "onboardingComplete" = true WHERE "onboardingComplete" = false;
