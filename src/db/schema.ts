import {pgTable, timestamp, uuid, varchar} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(()=> new Date()),
    email: varchar("email", {length: 255}).notNull().unique(),
    password: varchar("hashed_password", {length: 255},).notNull().default("unset"),
});

export type NewUser = typeof users.$inferInsert;


export const chirps = pgTable("chirps", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(()=> new Date()),
    body: varchar("body", {length: 255}).notNull(),
    userId: uuid("user_id").references(() => users.id, {onDelete:'cascade'}).notNull(),
})

export type NewChirp = typeof chirps.$inferInsert;