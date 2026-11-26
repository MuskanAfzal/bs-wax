import 'server-only';
import { api } from './api.mjs';
import { getEnvironment } from './environment.mjs';
import defaults from '@/lib/defaults.json';
export async function handleRequest(request: Request): Promise<Response> {
  try { const env = getEnvironment();
    const ip = process.env.VERCEL ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() || 'unknown' : 'local';
    return await api(request, {...env, CLIENT_IP: ip}); }
  catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'BACKEND_NOT_CONFIGURED') {
      console.error('Backend configuration unavailable:', error.message);
    } else {
      console.error('Backend initialization failed. Run npm run check:backend to check configuration, database and storage.');
    }
    const path = new URL(request.url).pathname.replace(/\/$/, '');
    if (request.method === 'GET' && path === '/api/content') return Response.json(defaults, {headers:{'Cache-Control':'no-store'}});
    if (request.method === 'GET' && path === '/api/session') return Response.json({authenticated:false}, {headers:{'Cache-Control':'no-store'}});
    return Response.json({error:'Online requests are not ready yet. Please contact us on Instagram.'}, {status:503,headers:{'Cache-Control':'no-store'}});
  }
}
