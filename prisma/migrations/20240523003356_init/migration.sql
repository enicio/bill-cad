-- CreateTable
CREATE TABLE "ClientBilling" (
    "id" SERIAL NOT NULL,
    "clientNumber" TEXT NOT NULL,
    "monthYear" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "electricEnergyKwh" DECIMAL(10,2) NOT NULL,
    "electricEnergyTarif" DECIMAL(10,4) NOT NULL,
    "sceeEnergyKwh" DECIMAL(10,2) NOT NULL,
    "sceeEnergyTarif" DECIMAL(10,4) NOT NULL,
    "compensationKwh" DECIMAL(10,2) NOT NULL,
    "compensationTarif" DECIMAL(10,4) NOT NULL,
    "illuminationTax" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ClientBilling_pkey" PRIMARY KEY ("id")
);
