/*
  Warnings:

  - You are about to drop the column `denomination` on the `Iglesia` table. All the data in the column will be lost.
  - You are about to drop the column `xId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_xId_key";

-- AlterTable
ALTER TABLE "Campamento" ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "Iglesia" DROP COLUMN "denomination";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "xId";
