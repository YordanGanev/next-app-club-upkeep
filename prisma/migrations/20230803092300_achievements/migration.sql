-- CreateEnum
CREATE TYPE "AchievementType" AS ENUM ('FIRST_PLACE', 'SECOND_PLACE', 'THIRD_PLACE', 'MVP', 'SPECIAL');

-- CreateTable
CREATE TABLE "Achievements" (
    "id" TEXT NOT NULL,
    "achievement" TEXT NOT NULL,
    "competition" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "Achievements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Achievements" ADD CONSTRAINT "Achievements_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
