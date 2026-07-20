ALTER TABLE `artifact` ADD `name` text DEFAULT 'Unnamed Artifact' NOT NULL;--> statement-breakpoint
CREATE INDEX `resourceIdIndex` ON `artifact` (`resourceId`);