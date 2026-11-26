import nextEnv from '@next/env';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';
import { readBackendConfig } from '../server/backend-config.mjs';

nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production');

async function main() {
  let config;
  try { config = readBackendConfig(); }
  catch (error) { console.error(error.message); process.exitCode = 1; return; }
  console.log('Required backend variables are present and have valid formats (values hidden).');
  const sql = postgres(config.DATABASE_URL, {prepare:false, max:1, connect_timeout:10, ssl:'require'});
  try {
    // Read each expected column to detect missing schema and permission problems.
    await sql`SELECT id, json FROM hive.content LIMIT 0`;
    await sql`SELECT id, name, email, phone, zip, vehicle, service, concerns, date, time, notes, status, created FROM hive.bookings LIMIT 0`;
    await sql`SELECT id, expires FROM hive.sessions LIMIT 0`;
    await sql`SELECT id, count, expires FROM hive.attempts LIMIT 0`;
    console.log('Database connection and application tables are readable.');
  } catch (error) {
    // PostgreSQL messages can contain connection details or submitted values.
    const code = /^[A-Z0-9_]{2,40}$/.test(error.code || '') ? error.code : 'CONNECTION_FAILED';
    console.error(`Database check failed (${code}). Check DATABASE_URL and run database/schema.sql in Supabase SQL Editor.`);
    process.exitCode = 1;
  } finally { await sql.end({timeout:2}); }
  try {
    const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, {
      auth:{persistSession:false, autoRefreshToken:false},
      global:{fetch:(url, options) => fetch(url, {...options, signal:AbortSignal.timeout(10000)})}
    });
    const {data, error} = await supabase.storage.getBucket(config.SUPABASE_STORAGE_BUCKET || 'hive-portfolio');
    if (error || !data) throw new Error();
    if (data.public) {
      console.error('Storage bucket is public; database/storage.sql expects a private bucket.');
      process.exitCode = 1;
    } else console.log('Supabase storage credentials and private bucket are available.');
  } catch {
    console.error('Storage check failed. Check SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and SUPABASE_STORAGE_BUCKET, and run database/storage.sql.');
    process.exitCode = 1;
  }
}

await main();
