-- CreateTable
CREATE TABLE `InternationalCoffeeOrganizationDataItem` (
    `id` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `title` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `distribution` JSON NULL,

    INDEX `title_index`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookmarkItem` (
    `id` VARCHAR(191) NOT NULL,
    `originalSource` VARCHAR(191) NOT NULL,
    `originalId` VARCHAR(191) NOT NULL,
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
    `deletedAt` DATETIME(3) NULL,
    `describedBy` JSON NULL,
    `issued` JSON NULL,
    `language` JSON NULL,
    `rights` VARCHAR(500) NULL,
    `spatial` LONGTEXT NULL,
    `conformsTo` JSON NULL,
    `temporal` VARCHAR(191) NULL,
    `dataQuality` BOOLEAN NULL,
    `describedByType` VARCHAR(191) NULL,
    `landingPage` VARCHAR(500) NULL,
    `references` JSON NULL,
    `theme` JSON NULL,
    `systemOfRecords` VARCHAR(191) NULL,
    `isPartOf` VARCHAR(191) NULL,

    UNIQUE INDEX `BookmarkItem_originalId_key`(`originalId`),
    UNIQUE INDEX `BookmarkItem_identifier_key`(`identifier`),
    INDEX `title_index`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BookmarkItemToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_BookmarkItemToUser_AB_unique`(`A`, `B`),
    INDEX `_BookmarkItemToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_BookmarkItemToUser` ADD CONSTRAINT `_BookmarkItemToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `BookmarkItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BookmarkItemToUser` ADD CONSTRAINT `_BookmarkItemToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
