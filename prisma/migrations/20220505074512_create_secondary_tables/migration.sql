/*
  Warnings:

  - You are about to drop the `reporting_spr_class_roster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reporting_spr_perform_by_lo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reporting_spr_perform_by_score` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reporting_spr_scheduled_classes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `reporting_spr_class_roster`;

-- DropTable
DROP TABLE `reporting_spr_perform_by_lo`;

-- DropTable
DROP TABLE `reporting_spr_perform_by_score`;

-- DropTable
DROP TABLE `reporting_spr_scheduled_classes`;

-- CreateTable
CREATE TABLE `reporting_spr_class_roster_A` (
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

    UNIQUE INDEX `reporting_spr_class_roster_A_org_id_class_id_key`(`org_id`, `class_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reporting_spr_class_roster_B` (
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

    UNIQUE INDEX `reporting_spr_class_roster_B_org_id_class_id_key`(`org_id`, `class_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reporting_spr_scheduled_classes_A` (
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

    INDEX `reporting_spr_scheduled_classes_A_start_at_idx`(`start_at`),
    INDEX `reporting_spr_scheduled_classes_A_due_at_idx`(`due_at`),
    UNIQUE INDEX `reporting_spr_scheduled_classes_A_org_id_schedule_id_key`(`org_id`, `schedule_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reporting_spr_scheduled_classes_B` (
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

    INDEX `reporting_spr_scheduled_classes_B_start_at_idx`(`start_at`),
    INDEX `reporting_spr_scheduled_classes_B_due_at_idx`(`due_at`),
    UNIQUE INDEX `reporting_spr_scheduled_classes_B_org_id_schedule_id_key`(`org_id`, `schedule_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reporting_spr_perform_by_score_A` (
    `org_id` VARCHAR(128) NOT NULL,
    `schedule_id` VARCHAR(128) NOT NULL,
    `student_id` VARCHAR(128) NOT NULL,
    `class_id` VARCHAR(128) NOT NULL,
    `achieved_score` INTEGER NOT NULL DEFAULT 0,
    `total_score` INTEGER NOT NULL DEFAULT 0,
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
    `category` VARCHAR(128) NOT NULL,
    `category_name` VARCHAR(1024) NOT NULL,
    `subcategory` VARCHAR(128) NULL,
    `subcategory_name` VARCHAR(1024) NULL,

    INDEX `reporting_spr_perform_by_score_A_class_id_idx`(`class_id`),
    INDEX `reporting_spr_perform_by_score_A_start_at_idx`(`start_at`),
    INDEX `reporting_spr_perform_by_score_A_due_at_idx`(`due_at`),
    INDEX `reporting_spr_perform_by_score_A_category_idx`(`category`),
    INDEX `reporting_spr_perform_by_score_A_subcategory_idx`(`subcategory`),
    UNIQUE INDEX `reporting_spr_perform_by_score_A_org_id_schedule_id_student__key`(`org_id`, `schedule_id`, `student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reporting_spr_perform_by_score_B` (
    `org_id` VARCHAR(128) NOT NULL,
    `schedule_id` VARCHAR(128) NOT NULL,
    `student_id` VARCHAR(128) NOT NULL,
    `class_id` VARCHAR(128) NOT NULL,
    `achieved_score` INTEGER NOT NULL DEFAULT 0,
    `total_score` INTEGER NOT NULL DEFAULT 0,
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
    `category` VARCHAR(128) NOT NULL,
    `category_name` VARCHAR(1024) NOT NULL,
    `subcategory` VARCHAR(128) NULL,
    `subcategory_name` VARCHAR(1024) NULL,

    INDEX `reporting_spr_perform_by_score_B_class_id_idx`(`class_id`),
    INDEX `reporting_spr_perform_by_score_B_start_at_idx`(`start_at`),
    INDEX `reporting_spr_perform_by_score_B_due_at_idx`(`due_at`),
    INDEX `reporting_spr_perform_by_score_B_category_idx`(`category`),
    INDEX `reporting_spr_perform_by_score_B_subcategory_idx`(`subcategory`),
    UNIQUE INDEX `reporting_spr_perform_by_score_B_org_id_schedule_id_student__key`(`org_id`, `schedule_id`, `student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reporting_spr_perform_by_lo_A` (
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

    UNIQUE INDEX `reporting_spr_perform_by_lo_A_row_uuid_key`(`row_uuid`),
    INDEX `reporting_spr_perform_by_lo_A_org_id_idx`(`org_id`),
    INDEX `reporting_spr_perform_by_lo_A_class_id_idx`(`class_id`),
    INDEX `reporting_spr_perform_by_lo_A_schedule_id_idx`(`schedule_id`),
    INDEX `reporting_spr_perform_by_lo_A_student_id_idx`(`student_id`),
    INDEX `reporting_spr_perform_by_lo_A_status_idx`(`status`),
    INDEX `reporting_spr_perform_by_lo_A_start_at_idx`(`start_at`),
    INDEX `reporting_spr_perform_by_lo_A_due_at_idx`(`due_at`),
    INDEX `reporting_spr_perform_by_lo_A_category_idx`(`category`),
    INDEX `reporting_spr_perform_by_lo_A_subcategory_idx`(`subcategory`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reporting_spr_perform_by_lo_B` (
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

    UNIQUE INDEX `reporting_spr_perform_by_lo_B_row_uuid_key`(`row_uuid`),
    INDEX `reporting_spr_perform_by_lo_B_org_id_idx`(`org_id`),
    INDEX `reporting_spr_perform_by_lo_B_class_id_idx`(`class_id`),
    INDEX `reporting_spr_perform_by_lo_B_schedule_id_idx`(`schedule_id`),
    INDEX `reporting_spr_perform_by_lo_B_student_id_idx`(`student_id`),
    INDEX `reporting_spr_perform_by_lo_B_status_idx`(`status`),
    INDEX `reporting_spr_perform_by_lo_B_start_at_idx`(`start_at`),
    INDEX `reporting_spr_perform_by_lo_B_due_at_idx`(`due_at`),
    INDEX `reporting_spr_perform_by_lo_B_category_idx`(`category`),
    INDEX `reporting_spr_perform_by_lo_B_subcategory_idx`(`subcategory`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
