ALTER TABLE `tokens` ADD `id` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `tokens_id_unique` ON `tokens` (`id`);