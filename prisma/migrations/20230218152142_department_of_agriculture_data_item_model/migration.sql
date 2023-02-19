/*
  Warnings:

  - A unique constraint covering the columns `[modelName]` on the table `DataSource` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `modelName` to the `DataSource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `DataSource` ADD COLUMN `modelName` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `DepartmentOfAgricultureDataItem` (
    `id` VARCHAR(191) NOT NULL,
    `identifier` VARCHAR(191) NULL,
    `accessLevel` VARCHAR(191) NULL,
    `contactPoint` VARCHAR(191) NULL,
    `programCode` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `title` VARCHAR(191) NULL,
    `distribution` VARCHAR(191) NULL,
    `license` VARCHAR(191) NULL,
    `bureauCode` VARCHAR(191) NULL,
    `modified` VARCHAR(191) NULL,
    `publisher` VARCHAR(191) NULL,
    `keyword` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `DepartmentOfAgricultureDataItem_identifier_key`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `DataSource_modelName_key` ON `DataSource`(`modelName`);
