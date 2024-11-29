/*
  Warnings:

  - You are about to drop the column `country` on the `countries` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `countries` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `countries` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "countries_country_key";

-- AlterTable
ALTER TABLE "countries" DROP COLUMN "country",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "countries_name_key" ON "countries"("name");
