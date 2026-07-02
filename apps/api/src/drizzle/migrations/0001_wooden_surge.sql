CREATE TABLE `tokens` (
	`id` text NOT NULL,
	`userId` text NOT NULL,
	`type` text,
	`name` text,
	`scopres` text NOT NULL,
	`created_at` integer,
	`expires_at` integer,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tokens_id_unique` ON `tokens` (`id`);