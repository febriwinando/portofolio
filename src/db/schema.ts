import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const profile = pgTable('profile', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  bio: text('bio').notNull(),
  location: text('location').notNull(),
  email: text('email').notNull(),
  avatarUrl: text('avatar_url'),
  githubUsername: text('github_username').notNull().default('febriwinando'),
  githubUrl: text('github_url').notNull().default('https://github.com/febriwinando'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  year: text('year').notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
