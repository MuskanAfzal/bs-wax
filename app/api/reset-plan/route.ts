import { buildResetPlan, priorityOptions, vehicleOptions } from '@/lib/reset-plan.mjs';
import { getContent } from '@/server/api.mjs';
import { getEnvironment } from '@/server/environment.mjs';
import defaults from '@/lib/defaults.json';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const vehicle = params.get('vehicle') || '';
  const level = Number(params.get('level'));
  const priorities = (params.get('priorities') || '').split(',').filter(Boolean);
  if (!vehicleOptions.includes(vehicle) || ![0,1,2].includes(level) || priorities.length > 4 || priorities.some(id => !priorityOptions.some((p: {id:string}) => p.id === id))) {
    return Response.json({error:'Please choose a vehicle, condition and valid priorities.'},{status:400});
  }
  let content = defaults;
  try { content = await getContent(getEnvironment()); } catch { /* Default design is available before backend setup. */ }
  const plan = buildResetPlan({vehicle,level,priorities,services:content.services});
  const text = `B’S WAX AUTO SPA · YOUR RESET PLAN\n\n${plan.notes}\n\nFOCUS SEQUENCE\n${plan.steps.map((s:string,i:number)=>`${i+1}. ${s}`).join('\n')}\n\nBEFORE YOUR VISIT\n${plan.prep.map((s:string)=>'• '+s).join('\n')}\n\nThis is a suggested plan, not a confirmed quote or appointment.\nContact: ${content.settings.instagram}\n`;
  return new Response(text,{headers:{'Content-Type':'text/plain; charset=utf-8','Content-Disposition':'attachment; filename="My_Bs_Wax_Reset_Plan.txt"','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
