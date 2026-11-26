import 'server-only';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';
import { makePostgresDB } from './postgres-db.mjs';
import { readBackendConfig } from './backend-config.mjs';
let environment;
export function getEnvironment() {
  if (environment) return environment;
  const { DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_PASSWORD } = readBackendConfig();
  const sql = postgres(DATABASE_URL, { prepare: false, max: 1, idle_timeout: 20, connect_timeout: 10, ssl: 'require' });
  const execute = async (query, values) => { const rows = await sql.unsafe(query, values); return {rows:[...rows],count:rows.count}; };
  const DB = makePostgresDB(execute, fn => sql.begin(async tx => fn(async (query, values) => { const rows = await tx.unsafe(query, values); return {rows:[...rows],count:rows.count}; })));
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {auth:{persistSession:false,autoRefreshToken:false}});
  const bucket = supabase.storage.from(process.env.SUPABASE_STORAGE_BUCKET || 'hive-portfolio');
  const BUCKET = {
    async list(offset = 0) {
      const {data,error} = await bucket.list('', {limit:50, offset, sortBy:{column:'created_at',order:'desc'}});
      if(error) throw error;
      return data || [];
    },
    async put(key, bytes, options) {
      const {error} = await bucket.upload(key, bytes, {contentType:options.httpMetadata.contentType,upsert:false});
      if(error) throw error;
    },
    async get(key) {
      const {data,error} = await bucket.download(key);
      if(error) { if(String(error.statusCode)==='404'||String(error.statusCode)==='400') return null; throw error; }
      return {body:data.stream(),httpMetadata:{contentType:data.type}};
    }
  };
  environment = {DB, BUCKET, ADMIN_PASSWORD};
  return environment;
}
