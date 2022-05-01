-- CreateTable
CREATE TABLE `reporting_spr_scheduled_classes` (
    `org_id` VARCHAR(128) NOT NULL,
    `schedule_id` VARCHAR(128) NOT NULL,
    `class_id` VARCHAR(128) NOT NULL,
    `class_name` VARCHAR(1024) NOT NULL,
    `class_type` VARCHAR(30) NOT NULL,
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
    `student_ids` VARCHAR(191) NULL,
    `total_activities` INTEGER NOT NULL DEFAULT 0,

    INDEX `reporting_spr_scheduled_classes_start_at_idx`(`start_at`),
    INDEX `reporting_spr_scheduled_classes_due_at_idx`(`due_at`),
    UNIQUE INDEX `reporting_spr_scheduled_classes_org_id_schedule_id_key`(`org_id`, `schedule_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
