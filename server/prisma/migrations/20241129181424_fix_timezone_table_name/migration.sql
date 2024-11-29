/*
  Warnings:

  - You are about to drop the column `timeZone_id` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the `timeZones` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `timezone_id` to the `locations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_timeZone_id_fkey";

-- AlterTable
ALTER TABLE "locations" DROP COLUMN "timeZone_id",
ADD COLUMN     "timezone_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "timeZones";

-- CreateTable
CREATE TABLE "timezones" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timezones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "timezones_name_key" ON "timezones"("name");

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_timezone_id_fkey" FOREIGN KEY ("timezone_id") REFERENCES "timezones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
