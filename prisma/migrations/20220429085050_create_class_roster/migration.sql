-- CreateTable
CREATE TABLE `reporting_spr_class_roster` (
    `org_id` VARCHAR(128) NOT NULL,
    `class_id` VARCHAR(128) NOT NULL,
    `class_name` VARCHAR(1024) NOT NULL,
    `lesson_plan_ids` VARCHAR(191) NULL,
    `class_types` VARCHAR(1024) NULL,
    `program_ids` VARCHAR(191) NULL,
    `age_range_ids` VARCHAR(191) NULL,
    `age_range_names` VARCHAR(191) NULL,
    `grade_ids` VARCHAR(191) NULL,
    `grade_names` VARCHAR(191) NULL,
    `subject_ids` VARCHAR(191) NULL,
    `subject_names` VARCHAR(191) NULL,
    `total_students` INTEGER NOT NULL DEFAULT 0,
    `scheduled_class` INTEGER NOT NULL DEFAULT 0,
    `student_ids` VARCHAR(191) NULL,

    UNIQUE INDEX `reporting_spr_class_roster_org_id_class_id_key`(`org_id`, `class_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
