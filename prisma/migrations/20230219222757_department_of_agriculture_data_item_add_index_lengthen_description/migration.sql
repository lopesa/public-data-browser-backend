-- AlterTable
ALTER TABLE `DepartmentOfAgricultureDataItem` MODIFY `description` VARCHAR(10000) NULL;

-- CreateIndex
CREATE INDEX `title` ON `DepartmentOfAgricultureDataItem`(`title`);
