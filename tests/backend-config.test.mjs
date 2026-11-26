import test from 'node:test';
import assert from 'node:assert/strict';
import {readBackendConfig} from '../server/backend-config.mjs';
import {readFileSync} from 'node:fs';

const configured = () => ({DATABASE_URL:'postgresql://user:private-password@db.example.test:6543/postgres', SUPABASE_URL:'https://example.supabase.co', SUPABASE_SERVICE_ROLE_KEY:'private-service-key', ADMIN_PASSWORD:'private-admin-password'});

test('configuration reports all missing names without exposing supplied secrets', () => {
  const env = configured();
  delete env.DATABASE_URL;
  delete env.SUPABASE_URL;
  assert.throws(() => readBackendConfig(env), error => {
    assert.equal(error.code, 'BACKEND_NOT_CONFIGURED');
    assert.match(error.message, /DATABASE_URL, SUPABASE_URL/);
    assert.match(error.message, /redeploy/);
    assert.ok(!error.message.includes(env.ADMIN_PASSWORD));
    assert.ok(!error.message.includes(env.SUPABASE_SERVICE_ROLE_KEY));
    return true;
  });
});

test('the example environment is rejected before a connection is attempted', () => {
  const example = Object.fromEntries(readFileSync('.env.example', 'utf8').split(/\r?\n/).filter(line => line && !line.startsWith('#')).map(line => {const index = line.indexOf('='); return [line.slice(0,index), line.slice(index+1)];}));
  assert.throws(() => readBackendConfig(example), /example placeholder/);
});

test('invalid URLs are diagnosed without logging their values', () => {
  const env = {...configured(), DATABASE_URL:'https://private-connection.test/secret', SUPABASE_URL:'private-invalid-url'};
  assert.throws(() => readBackendConfig(env), error => {
    assert.match(error.message, /DATABASE_URL must be a PostgreSQL URI/);
    assert.match(error.message, /SUPABASE_URL must be an HTTP/);
    assert.ok(!error.message.includes('private-'));
    return true;
  });
});

test('configured values are preserved, including significant password whitespace', () => {
  const env = {...configured(), ADMIN_PASSWORD:' a password ', SUPABASE_STORAGE_BUCKET:'custom-bucket'};
  assert.deepEqual(readBackendConfig(env), env);
  assert.throws(() => readBackendConfig({...env, ADMIN_PASSWORD:'  '}), /Missing variables: ADMIN_PASSWORD/);
});
