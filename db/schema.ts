import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const demos = sqliteTable('demos', { id:text('id').primaryKey(), state:text('state').notNull(), version:integer('version').notNull().default(0) });
