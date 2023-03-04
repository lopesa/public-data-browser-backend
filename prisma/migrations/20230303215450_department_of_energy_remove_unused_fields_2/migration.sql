/*
  Warnings:

  - You are about to drop the column `accessURL` on the `DepartmentOfEnergyDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `dc` on the `DepartmentOfEnergyDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `DepartmentOfEnergyDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `downloadURL` on the `DepartmentOfEnergyDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `fn` on the `DepartmentOfEnergyDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `foaf` on the `DepartmentOfEnergyDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `format` on the `DepartmentOfEnergyDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `hasEmail` on the `DepartmentOfEnergyDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `homepage` on the `DepartmentOfEnergyDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `DepartmentOfEnergyDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `org` on the `DepartmentOfEnergyDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `pod` on the `DepartmentOfEnergyDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `primaryITInvestmentUII` on the `DepartmentOfEnergyDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `skos` on the `DepartmentOfEnergyDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `subOrganizationOf` on the `DepartmentOfEnergyDataItem` table. All the data in the column will be lost.
  - You are about to drop the column `vcard` on the `DepartmentOfEnergyDataItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `DepartmentOfEnergyDataItem` DROP COLUMN `accessURL`,
    DROP COLUMN `dc`,
    DROP COLUMN `deletedAt`,
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
    DROP COLUMN `vcard`;
