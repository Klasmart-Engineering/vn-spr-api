/*
  Warnings:

  - You are about to drop the `switch_table` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `switch_table`;

-- CreateTable
CREATE TABLE `reporting_spr_switch` (
    `dataset_id` VARCHAR(128) NOT NULL,
    `ver_in_use` CHAR(1) NOT NULL DEFAULT 'A',
    `update_ts` DATETIME(3) NOT NULL,

    UNIQUE INDEX `reporting_spr_switch_dataset_id_key`(`dataset_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
