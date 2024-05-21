-- CreateTable
CREATE TABLE "Zoo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "land" TEXT NOT NULL,
    "stadt" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "baujahr" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Abteilung" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "zooid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Abteilung_zooid_fkey" FOREIGN KEY ("zooid") REFERENCES "Zoo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "art" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abteilungid" TEXT NOT NULL,
    CONSTRAINT "Tier_abteilungid_fkey" FOREIGN KEY ("abteilungid") REFERENCES "Abteilung" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mitarbeiter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AbteilungToMitarbeiter" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_AbteilungToMitarbeiter_A_fkey" FOREIGN KEY ("A") REFERENCES "Abteilung" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AbteilungToMitarbeiter_B_fkey" FOREIGN KEY ("B") REFERENCES "Mitarbeiter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Abteilung_zooid_name_key" ON "Abteilung"("zooid", "name");

-- CreateIndex
CREATE UNIQUE INDEX "_AbteilungToMitarbeiter_AB_unique" ON "_AbteilungToMitarbeiter"("A", "B");

-- CreateIndex
CREATE INDEX "_AbteilungToMitarbeiter_B_index" ON "_AbteilungToMitarbeiter"("B");
