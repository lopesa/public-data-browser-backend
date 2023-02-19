-- AlterTable
ALTER TABLE `DepartmentOfAgricultureDataItem` MODIFY `description` LONGTEXT NULL;

-- RenameIndex
ALTER TABLE `DepartmentOfAgricultureDataItem` RENAME INDEX `title` TO `title_index`;
