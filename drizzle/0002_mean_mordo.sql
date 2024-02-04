CREATE TABLE `dapil` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`dapil_code` text,
	`dapil_type` text,
	`dapil_name` text,
	`administrative_code` text,
	`area_code` text,
	`area_name` text,
	`created_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `dapil_dapil_code_area_code_unique` ON `dapil` (`dapil_code`,`area_code`);