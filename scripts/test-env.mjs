import {PGlite} from '@electric-sql/pglite';
import {readFileSync} from 'node:fs';
import {makePostgresDB} from '../server/postgres-db.mjs';
export async function makeEnv({password='test-admin-password'}={}){
 const db=new PGlite();await db.exec(readFileSync('database/schema.sql','utf8'));
 const run=async(query,values)=>{const r=await db.query(query,values);return {rows:r.rows,count:r.affectedRows||0}};
 const DB=makePostgresDB(run,fn=>db.transaction(tx=>fn(async(query,values)=>{const r=await tx.query(query,values);return {rows:r.rows,count:r.affectedRows||0}})));
 const images=new Map();const BUCKET={async list(offset=0){return [...images.keys()].slice(offset,offset+50).map(name=>({name}))},async put(key,bytes,options){images.set(key,{body:bytes,httpMetadata:options.httpMetadata})},async get(key){return images.get(key)||null}};
 return {DB,BUCKET,ADMIN_PASSWORD:password,close:()=>db.close()};
}
