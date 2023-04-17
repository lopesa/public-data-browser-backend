/*
  Warnings:

  - You are about to drop the column `name` on the `DataSource` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `DataSource` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `DataSource_name_key` ON `DataSource`;

-- AlterTable
ALTER TABLE `DataSource` DROP COLUMN `name`,
    DROP COLUMN `url`;

-- CreateTable
CREATE TABLE `DepartmentOfTreasuryDataItem` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,
    `identifier` VARCHAR(191) NULL,
    `accessLevel` VARCHAR(191) NULL,
    `contactPoint` JSON NULL,
    `programCode` JSON NULL,
    `description` LONGTEXT NULL,
    `title` VARCHAR(500) NULL,
    `distribution` JSON NULL,
    `license` VARCHAR(191) NULL,
    `bureauCode` JSON NULL,
    `modified` JSON NULL,
    `publisher` JSON NULL,
    `accrualPeriodicity` VARCHAR(191) NULL,
    `keyword` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `describedBy` JSON NULL,
    `issued` JSON NULL,
    `rights` VARCHAR(500) NULL,
    `landingPage` VARCHAR(500) NULL,
    `references` JSON NULL,
    `theme` JSON NULL,
    `primaryITInvestmentUII` VARCHAR(191) NULL,

    UNIQUE INDEX `DepartmentOfTreasuryDataItem_identifier_key`(`identifier`),
    INDEX `title_index`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
