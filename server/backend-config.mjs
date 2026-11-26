// Only variable names and fixed instructions belong in configuration errors.
// Never include values: these errors are written to server logs.
export function readBackendConfig(env = process.env) {
  const required = ['DATABASE_URL', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'ADMIN_PASSWORD'];
  const missing = required.filter(key => !env[key]?.trim());
  const invalid = [];
  if (missing.length) invalid.push(`Missing variables: ${missing.join(', ')}.`);
  for (const key of required.filter(key => !missing.includes(key))) {
    if (/PROJECT_REF|ENCODED_PASSWORD|POOLER_HOST|YOUR_SERVER_ONLY_SERVICE_ROLE_KEY|REPLACE_WITH_A_STRONG_UNIQUE_PASSWORD/.test(env[key])) {
      invalid.push(`${key} still contains an example placeholder.`);
    }
  }
  if (env.DATABASE_URL && !invalid.some(message => message.startsWith('DATABASE_URL'))) {
    try {
      const url = new URL(env.DATABASE_URL);
      if (!['postgres:', 'postgresql:'].includes(url.protocol) || !url.hostname || !url.username || !url.password) throw new Error();
    } catch { invalid.push('DATABASE_URL must be a PostgreSQL URI with a username and encoded password.'); }
  }
  if (env.SUPABASE_URL && !invalid.some(message => message.startsWith('SUPABASE_URL'))) {
    try {
      const url = new URL(env.SUPABASE_URL);
      if (!['https:', 'http:'].includes(url.protocol) || !url.hostname) throw new Error();
    } catch { invalid.push('SUPABASE_URL must be an HTTP(S) project URL.'); }
  }
  if (invalid.length) {
    throw Object.assign(new Error(`${invalid.join(' ')} Set server variables for the affected Vercel environment and redeploy. For local development, use .env.local.`), {code: 'BACKEND_NOT_CONFIGURED'});
  }
  return Object.fromEntries([...required, 'SUPABASE_STORAGE_BUCKET'].map(key => [key, env[key]]));
}
