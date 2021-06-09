-- AlterTable
ALTER TABLE "Prediction" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "sourceData" TEXT,
ADD COLUMN     "windFarm" TEXT;
