/*
  Warnings:

  - You are about to drop the `Achievements` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Achievements" DROP CONSTRAINT "Achievements_teamId_fkey";

-- DropTable
DROP TABLE "Achievements";

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "achievement" TEXT NOT NULL,
    "competition" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
