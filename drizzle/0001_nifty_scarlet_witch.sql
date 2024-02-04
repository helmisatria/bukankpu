ALTER TABLE caleg ADD `compressed_photo_url` text;--> statement-breakpoint
CREATE UNIQUE INDEX `crawl_status_dapil_code_unique` ON `crawl_status` (`dapil_code`);