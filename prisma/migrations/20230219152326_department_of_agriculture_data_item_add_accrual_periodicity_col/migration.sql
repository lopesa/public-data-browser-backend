/*
  Warnings:

  - You are about to alter the column `contactPoint` on the `DepartmentOfAgricultureDataItem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `programCode` on the `DepartmentOfAgricultureDataItem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `distribution` on the `DepartmentOfAgricultureDataItem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `bureauCode` on the `DepartmentOfAgricultureDataItem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `publisher` on the `DepartmentOfAgricultureDataItem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `keyword` on the `DepartmentOfAgricultureDataItem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `DepartmentOfAgricultureDataItem` ADD COLUMN `accrualPeriodicity` VARCHAR(191) NULL,
    MODIFY `contactPoint` JSON NULL,
    MODIFY `programCode` JSON NULL,
    MODIFY `distribution` JSON NULL,
    MODIFY `bureauCode` JSON NULL,
    MODIFY `publisher` JSON NULL,
    MODIFY `keyword` JSON NULL;
