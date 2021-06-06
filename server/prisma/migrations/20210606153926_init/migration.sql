-- CreateTable
CREATE TABLE "Prediction" (
    "name" TEXT NOT NULL,
    "dataLocation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("name")
);
