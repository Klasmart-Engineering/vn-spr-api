-- CreateTable
CREATE TABLE `reporting_spr_perform_by_lo` (
    `row_uuid` VARCHAR(128) NOT NULL,
    `org_id` VARCHAR(128) NOT NULL,
    `class_id` VARCHAR(128) NOT NULL,
    `schedule_id` VARCHAR(128) NOT NULL,
    `student_id` VARCHAR(128) NOT NULL,
    `learning_outcome` VARCHAR(128) NOT NULL,
    `status` VARCHAR(128) NOT NULL,
    `class_type` VARCHAR(30) NOT NULL,
    `class_name` VARCHAR(1024) NOT NULL,
    `program_id` VARCHAR(128) NOT NULL,
    `lesson_plan_id` VARCHAR(128) NOT NULL,
    `start_at` INTEGER NOT NULL DEFAULT 0,
    `due_at` INTEGER NOT NULL DEFAULT 0,
    `age_range_ids` VARCHAR(191) NULL,
    `age_range_names` VARCHAR(191) NULL,
    `grade_ids` VARCHAR(191) NULL,
    `grade_names` VARCHAR(191) NULL,
    `subject_ids` VARCHAR(191) NULL,
    `subject_names` VARCHAR(191) NULL,
    `category` VARCHAR(128) NULL,
    `category_name` VARCHAR(1024) NULL,
    `subcategory` VARCHAR(128) NULL,
    `subcategory_name` VARCHAR(1024) NULL,

    UNIQUE INDEX `reporting_spr_perform_by_lo_row_uuid_key`(`row_uuid`),
    INDEX `reporting_spr_perform_by_lo_org_id_idx`(`org_id`),
    INDEX `reporting_spr_perform_by_lo_class_id_idx`(`class_id`),
    INDEX `reporting_spr_perform_by_lo_schedule_id_idx`(`schedule_id`),
    INDEX `reporting_spr_perform_by_lo_student_id_idx`(`student_id`),
    INDEX `reporting_spr_perform_by_lo_status_idx`(`status`),
    INDEX `reporting_spr_perform_by_lo_start_at_idx`(`start_at`),
    INDEX `reporting_spr_perform_by_lo_due_at_idx`(`due_at`),
    INDEX `reporting_spr_perform_by_lo_category_idx`(`category`),
    INDEX `reporting_spr_perform_by_lo_subcategory_idx`(`subcategory`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;