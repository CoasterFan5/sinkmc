CREATE TABLE `logins` (
	`id` text NOT NULL,
	`userId` text NOT NULL,
	`provider` text NOT NULL,
	`externalId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `logins_id_unique` ON `logins` (`id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text NOT NULL,
	`userName` text NOT NULL,
	`email` text NOT NULL,
	`pfpUrl` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);