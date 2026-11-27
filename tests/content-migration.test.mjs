import test from 'node:test';
import assert from 'node:assert/strict';
import {upgradeContent} from '../lib/content-migration.mjs';
import legacy from '../lib/legacy-defaults.json' with {type:'json'};
import defaults from '../lib/defaults.json' with {type:'json'};
import legacyHomepage from '../lib/legacy-homepage.json' with {type:'json'};
import {homepageDefaults} from '../lib/homepage.mjs';

test('reference update replaces placeholders while preserving custom content and photos',()=>{
 const saved=structuredClone(legacy);
 saved.settings.phone='custom phone';saved.services[0].price=110;
 saved.homepage={beforeImage:'/media/previous.jpg',heroHeading:'Custom heading'};
 saved.portfolio.push({id:'customer-work',before:'/media/previous.jpg',after:'/media/after.jpg'});
 const result=upgradeContent(saved,defaults);
 assert.equal(result.settings.phone,'custom phone');
 assert.equal(result.settings.area,defaults.settings.area);
 assert.equal(result.services[0].price,110);
 assert.equal(result.services[0].name,'The Sweet Refresh');
 assert.equal(result.homepage.beforeImage,saved.homepage.beforeImage);assert.equal(result.homepage.heroHeading,saved.homepage.heroHeading);
 assert.deepEqual(result.portfolio[0],saved.portfolio[0]);
 assert.equal(result.portfolio.length,6);
 assert.equal(saved.portfolio.length,1);
 assert.equal(result.contentVersion,2);
});

test('reference homepage copy replaces saved defaults without restoring removed photos or extras',()=>{
 const saved=structuredClone(defaults);saved.contentVersion=1;
 saved.homepage={...legacyHomepage,storyImage:'/media/my-photo.jpg',ctaHeading:'My custom invitation'};
 saved.portfolio=[];saved.addons=[];saved.services[0].price=115;
 const result=upgradeContent(saved,defaults);
 assert.equal(result.homepage.heroHeading,homepageDefaults.heroHeading);
 assert.equal(result.homepage.ctaHeading,'My custom invitation');
 assert.equal(result.homepage.storyImage,'/media/my-photo.jpg');
 assert.deepEqual(result.portfolio,[]);assert.deepEqual(result.addons,[]);
 assert.equal(result.services[0].price,115);
 assert.equal(result.contentVersion,2);
});

test('saving the content version preserves later removals and does not duplicate reference photos',()=>{
 const upgraded=upgradeContent(legacy,defaults);
 assert.equal(upgradeContent(upgraded,defaults).portfolio.length,5);
 upgraded.portfolio=[];upgraded.addons=[];upgraded.services[0].price=120;
 assert.deepEqual(upgradeContent(upgraded,defaults),upgraded);
 const existing=structuredClone(legacy);existing.portfolio=[defaults.portfolio[0]];
 assert.equal(upgradeContent(existing,defaults).portfolio.length,5);
});
