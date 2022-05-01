-- CreateTable
CREATE TABLE `switch_table` (
    `dataset_id` VARCHAR(128) NOT NULL,
    `ver_in_use` CHAR(1) NOT NULL DEFAULT 'A',
    `update_ts` DATETIME(3) NOT NULL,

    UNIQUE INDEX `switch_table_dataset_id_key`(`dataset_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
