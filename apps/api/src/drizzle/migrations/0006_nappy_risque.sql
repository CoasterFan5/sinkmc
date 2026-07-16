CREATE TABLE `artifact` (
	`id` text PRIMARY KEY NOT NULL,
	`versionId` text NOT NULL,
	`resourceId` text NOT NULL,
	`supportedVersions` text NOT NULL,
	`platforms` text NOT NULL,
	`hash` text NOT NULL,
	`fileKey` text NOT NULL,
	FOREIGN KEY (`versionId`) REFERENCES `version`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`resourceId`) REFERENCES `resources`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `version` (
	`id` text PRIMARY KEY NOT NULL,
	`ownerId` text NOT NULL,
	`resourceId` text NOT NULL,
	`versionString` text NOT NULL,
	`description` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`resourceId`) REFERENCES `resources`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_resources` (
	`id` text PRIMARY KEY NOT NULL,
	`ownerId` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`price` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_resources`("id", "ownerId", "name", "slug", "description", "category", "price", "created_at", "updated_at") SELECT "id", "ownerId", "name", "slug", "description", "category", "price", "created_at", "updated_at" FROM `resources`;--> statement-breakpoint
DROP TABLE `resources`;--> statement-breakpoint
ALTER TABLE `__new_resources` RENAME TO `resources`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `resources_slug_unique` ON `resources` (`slug`);