import { buildResetPlan, priorityOptions, vehicleOptions } from '@/lib/reset-plan.mjs';
import { getContent } from '@/server/api.mjs';
import { getEnvironment } from '@/server/environment.mjs';
import defaults from '@/lib/defaults.json';
import {validEstimateSelection} from '@/lib/estimate.mjs';
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
  const serviceId = params.get('service') || '';
  let quantities: Record<string,number> = {};
  try { quantities = JSON.parse(params.get('addons') || '{}'); } catch { return Response.json({error:'Invalid add-on selection.'},{status:400}); }
  if (!validEstimateSelection(serviceId, quantities, content)) return Response.json({error:'Choose an available package and valid add-on quantities.'},{status:400});
  const addonPriorities = Object.keys(quantities).flatMap(id => id==='pet-hair'?['pets']:id==='staining'?['stains']:id==='cargo'?['carpets']:[]);
  const plan = buildResetPlan({vehicle,level,priorities:[...new Set([...priorities,...addonPriorities])],services:content.services,serviceId,addons:content.addons||[],quantities});
  const text = `B’S WAX AUTO SPA · YOUR DETAIL ESTIMATE\n\n${plan.notes}\n\nPACKAGE INCLUSIONS\n${plan.service?.features.map((item:string)=>'• '+item).join('\n')||'Discuss your requirements with the team.'}\n\nBEFORE YOUR VISIT\n${plan.prep.map((s:string)=>'• '+s).join('\n')}\n\nContact: ${content.settings.phone || content.settings.instagram}\n`;
  return new Response(text,{headers:{'Content-Type':'text/plain; charset=utf-8','Content-Disposition':'attachment; filename="My_Bs_Wax_Estimate.txt"','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
