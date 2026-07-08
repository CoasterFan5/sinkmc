ALTER TABLE `tokens` RENAME COLUMN "id" TO "tokenHash";--> statement-breakpoint
DROP INDEX `tokens_id_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `tokens_tokenHash_unique` ON `tokens` (`tokenHash`);