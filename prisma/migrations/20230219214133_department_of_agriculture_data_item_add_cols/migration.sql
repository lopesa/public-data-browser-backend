/*
  Warnings:

  - You are about to alter the column `dataQuality` on the `DepartmentOfAgricultureDataItem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `language` on the `DepartmentOfAgricultureDataItem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `references` on the `DepartmentOfAgricultureDataItem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `DepartmentOfAgricultureDataItem` ADD COLUMN `theme` JSON NULL,
    MODIFY `dataQuality` BOOLEAN NULL,
    MODIFY `language` JSON NULL,
    MODIFY `references` JSON NULL;
