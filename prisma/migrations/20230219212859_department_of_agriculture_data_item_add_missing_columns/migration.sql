/*
  Warnings:

  - You are about to alter the column `modified` on the `DepartmentOfAgricultureDataItem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `DepartmentOfAgricultureDataItem` ADD COLUMN `accessURL` JSON NULL,
    ADD COLUMN `conformsTo` JSON NULL,
    ADD COLUMN `dataQuality` VARCHAR(191) NULL,
    ADD COLUMN `dc` VARCHAR(191) NULL,
    ADD COLUMN `describedBy` JSON NULL,
    ADD COLUMN `describedByType` VARCHAR(191) NULL,
    ADD COLUMN `downloadURL` JSON NULL,
    ADD COLUMN `fn` VARCHAR(191) NULL,
    ADD COLUMN `foaf` VARCHAR(191) NULL,
    ADD COLUMN `format` VARCHAR(191) NULL,
    ADD COLUMN `hasEmail` VARCHAR(191) NULL,
    ADD COLUMN `homepage` VARCHAR(191) NULL,
    ADD COLUMN `issued` JSON NULL,
    ADD COLUMN `language` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NULL,
    ADD COLUMN `org` VARCHAR(191) NULL,
    ADD COLUMN `pod` VARCHAR(191) NULL,
    ADD COLUMN `primaryITInvestmentUII` VARCHAR(191) NULL,
    ADD COLUMN `rights` VARCHAR(191) NULL,
    ADD COLUMN `skos` VARCHAR(191) NULL,
    ADD COLUMN `spatial` VARCHAR(191) NULL,
    ADD COLUMN `subOrganizationOf` VARCHAR(191) NULL,
    ADD COLUMN `temporal` VARCHAR(191) NULL,
    ADD COLUMN `vcard` VARCHAR(191) NULL,
    MODIFY `modified` JSON NULL;
