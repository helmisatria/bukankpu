CREATE TABLE `caleg` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`caleg_id` text,
	`caleg_type` text,
	`partai` text,
	`dapil_code` text,
	`dapil` text,
	`no_urut` text,
	`photo_url` text,
	`name` text,
	`gender` text,
	`birth_place` text,
	`profile_id` text,
	`birth_date` text,
	`marital_status` text,
	`religion` text,
	`disability_status` text,
	`age` integer,
	`address` text,
	`address_rt` text,
	`address_rw` text,
	`address_province` text,
	`address_city` text,
	`address_kecamatan` text,
	`address_kelurahan` text,
	`job_status` text,
	`job` text,
	`education` text,
	`courses` text,
	`organization` text,
	`awards` text,
	`profile_updated_at` text,
	`program` text,
	`law_status` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `crawl_status` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`caleg_type` text,
	`dapil_code` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `caleg_caleg_id_unique` ON `caleg` (`caleg_id`);