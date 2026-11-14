export const vehicleOptions=['Sedan / Coupe','SUV / Crossover','Truck','Van / 3-row'];
export const priorityOptions=[
 {id:'crumbs',label:'Crumbs & dust',hint:'Everyday buildup',concern:'Crumbs & dust',step:'Vacuum & crevice attention'},
 {id:'stains',label:'Seat stains',hint:'Spills & marked upholstery',concern:'Seat stains',step:'Seat material & stain assessment'},
 {id:'pets',label:'Pet hair',hint:'Your furry copilot',concern:'Pet hair',step:'Pet-hair removal assessment'},
 {id:'carpets',label:'Carpet buildup',hint:'Mud, grit & floor mats',concern:'Carpet buildup',step:'Carpet & floor-mat attention'}
];
export function buildResetPlan({vehicle,level,priorities,services}) {
 const active=services.filter(s=>s.active);const heavy=level===2;const special=priorities.some(p=>p==='stains'||p==='pets'||p==='carpets');
 const intensity=heavy?2:level===1||special?1:0;
 const service=active[Math.min(intensity,active.length-1)]||null;
 const concerns=priorityOptions.filter(p=>priorities.includes(p.id)).map(p=>p.concern);
 const steps=[...priorityOptions.filter(p=>priorities.includes(p.id)).map(p=>p.step),'Interior surfaces & finishing details'];
 const why=heavy?'A heavier buildup calls for a full interior assessment before choosing the final scope.':special?'Your selected focus areas need more attention than a routine refresh.':level===1?'A lived-in cabin is a good starting point for a deeper detail.':'Light everyday buildup is a good starting point for a refresh.';
 const condition=['Light everyday mess','Lived-in cabin','Heavy buildup'][level]||'Lived-in cabin';
 const prep=['Remove valuables and personal belongings.',...(priorities.includes('pets')?['Let the team know about pets and any allergies.']:[]),...(priorities.includes('stains')?['Share what caused the stain, if you know.']:[]),'Confirm a safe, accessible workspace with the team.'];
 return {vehicle,condition,service,concerns,steps,why,prep,intensity,notes:`RESET PLAN\nVehicle: ${vehicle}\nCondition: ${condition}\nPriorities: ${concerns.join(', ')||'Everyday refresh'}\nSuggested starting point: ${service?.name||'Discuss with the team'}\nFinal scope and price to be confirmed after assessment.`};
}
