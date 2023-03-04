/*
  Warnings:

  - You are about to drop the column `accessURL` on the `DepartmentOfAgricultureDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `conformsTo` on the `DepartmentOfAgricultureDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `dc` on the `DepartmentOfAgricultureDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `downloadURL` on the `DepartmentOfAgricultureDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `fn` on the `DepartmentOfAgricultureDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `foaf` on the `DepartmentOfAgricultureDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `format` on the `DepartmentOfAgricultureDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `hasEmail` on the `DepartmentOfAgricultureDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `homepage` on the `DepartmentOfAgricultureDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `DepartmentOfAgricultureDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `org` on the `DepartmentOfAgricultureDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `pod` on the `DepartmentOfAgricultureDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `primaryITInvestmentUII` on the `DepartmentOfAgricultureDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `skos` on the `DepartmentOfAgricultureDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `subOrganizationOf` on the `DepartmentOfAgricultureDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `temporal` on the `DepartmentOfAgricultureDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `vcard` on the `DepartmentOfAgricultureDataItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `DepartmentOfAgricultureDataItem` DROP COLUMN `accessURL`,
    DROP COLUMN `conformsTo`,
    DROP COLUMN `dc`,
    DROP COLUMN `downloadURL`,
    DROP COLUMN `fn`,
    DROP COLUMN `foaf`,
    DROP COLUMN `format`,
    DROP COLUMN `hasEmail`,
    DROP COLUMN `homepage`,
    DROP COLUMN `name`,
    DROP COLUMN `org`,
    DROP COLUMN `pod`,
    DROP COLUMN `primaryITInvestmentUII`,
    DROP COLUMN `skos`,
    DROP COLUMN `subOrganizationOf`,
    DROP COLUMN `temporal`,
    DROP COLUMN `vcard`;

-- AlterTable
ALTER TABLE `DepartmentOfEnergyDataItem` ADD COLUMN `deletedAt` DATETIME(3) NULL;
