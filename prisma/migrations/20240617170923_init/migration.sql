-- CreateTable
CREATE TABLE `Prediction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `symptoms` VARCHAR(191) NOT NULL,
    `disease` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `precautions` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
