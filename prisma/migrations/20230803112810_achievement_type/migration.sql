/*
  Warnings:

  - Changed the type of `achievement` on the `Achievement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Achievement" DROP COLUMN "achievement",
ADD COLUMN     "achievement" "AchievementType" NOT NULL;
