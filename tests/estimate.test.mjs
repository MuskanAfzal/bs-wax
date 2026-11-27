import test from 'node:test';
import assert from 'node:assert/strict';
import defaults from '../lib/defaults.json' with {type:'json'};
import {buildEstimate,readAddonPrice,validEstimateSelection} from '../lib/estimate.mjs';
import {buildResetPlan} from '../lib/reset-plan.mjs';

test('receipt totals include selected package, ranged treatments and child seat quantities',()=>{
 const estimate=buildEstimate({service:defaults.services[0],addons:defaults.addons,quantities:{'pet-hair':1,'car-seat':2,odor:1}});
 assert.equal(estimate.min,210);assert.equal(estimate.max,250);
 assert.equal(estimate.totalLabel,'$210–$250+');
 assert.match(estimate.notes,/Child Car Seat Cleaning × 2: \+\$20 each = \$40/);
 assert.match(estimate.notes,/Heavy Pet Hair/);
 assert.equal(buildEstimate({service:defaults.services[2],addons:defaults.addons,quantities:{cargo:1}}).totalLabel,'From $250');
});

test('open-ended treatments and severe conditions never become fixed final quotes',()=>{
 const minimum=buildEstimate({service:defaults.services[0],addons:defaults.addons,quantities:{headlights:1,headliner:1}});
 assert.equal(minimum.min,180);assert.equal(minimum.max,null);assert.equal(minimum.totalLabel,'From $180');
 const severe=buildEstimate({service:defaults.services[0],quoteRequired:true});
 assert.equal(severe.totalLabel,'Quote required');assert.equal(severe.min,95);
 const edited=structuredClone(defaults.addons);edited[0].priceLabel='Discuss with us';
 assert.equal(buildEstimate({service:defaults.services[0],addons:edited,quantities:{'pet-hair':1}}).needsQuote,true);
 assert.equal(readAddonPrice('+$75–$35'),null);
});

test('only active choices and supported quantities are accepted for downloadable estimates',()=>{
 assert.equal(validEstimateSelection('refresh',{'car-seat':2},defaults),true);
 for(const quantities of [null,[],{'car-seat':0},{'car-seat':1.5},{'car-seat':11},{cargo:2},{missing:1}]) assert.equal(validEstimateSelection('refresh',quantities,defaults),false);
 assert.equal(validEstimateSelection('missing',{},defaults),false);
 const content=structuredClone(defaults);content.addons[0].active=false;content.services[0].active=false;
 assert.equal(validEstimateSelection('refresh',{},content),false);
 assert.equal(validEstimateSelection('deep',{'pet-hair':1},content),false);
});

test('booking notes and receipt use the explicitly selected package and current admin prices',()=>{
 const services=structuredClone(defaults.services);services[0].price=110;
 const plan=buildResetPlan({vehicle:'Truck',level:1,priorities:['pets'],services,serviceId:'refresh',addons:defaults.addons,quantities:{'pet-hair':1}});
 assert.equal(plan.service.id,'refresh');assert.equal(plan.estimate.min,145);assert.match(plan.notes,/Estimated total: \$145–\$185\+/);assert.match(plan.notes,/Vehicle: Truck/);
});
