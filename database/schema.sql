-- Run this file once in Supabase SQL Editor. Uses a dedicated, non-public schema.
CREATE SCHEMA IF NOT EXISTS hive;
REVOKE ALL ON SCHEMA hive FROM PUBLIC;
CREATE TABLE IF NOT EXISTS hive.content (id text PRIMARY KEY, json text NOT NULL);
CREATE TABLE IF NOT EXISTS hive.bookings (
 id text PRIMARY KEY, name text NOT NULL, email text NOT NULL, phone text NOT NULL,
 zip text NOT NULL, vehicle text NOT NULL, service text NOT NULL, concerns text NOT NULL,
 date text NOT NULL, time text NOT NULL, notes text NOT NULL,
 status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','confirmed','completed','cancelled')),
 created text NOT NULL
);
CREATE TABLE IF NOT EXISTS hive.sessions (id text PRIMARY KEY, expires bigint NOT NULL);
CREATE TABLE IF NOT EXISTS hive.attempts (id text PRIMARY KEY, count integer NOT NULL, expires bigint NOT NULL);
CREATE INDEX IF NOT EXISTS bookings_created_idx ON hive.bookings (created DESC);
ALTER TABLE hive.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE hive.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hive.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hive.attempts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON ALL TABLES IN SCHEMA hive FROM PUBLIC;
