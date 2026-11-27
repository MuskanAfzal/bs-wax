import legacyHomepage from './legacy-homepage.json' with {type:'json'};
import {homepageDefaults} from './homepage.mjs';
import legacy from './legacy-defaults.json' with {type:'json'};

// Upgrade the original placeholder content once. Edited business fields and
// existing photos win; the version returned to admin is persisted on Save.
export function upgradeContent(saved, defaults) {
  if (saved.contentVersion >= 2) return saved;
  const content = structuredClone(saved);
  if (!saved.contentVersion) {
  for (const [key, value] of Object.entries(defaults.settings)) {
    if (content.settings[key] === undefined || JSON.stringify(content.settings[key]) === JSON.stringify(legacy.settings[key])) content.settings[key] = value;
  }
  content.services = content.services.map(service => {
    const original = legacy.services.find(item => item.id === service.id);
    const replacement = defaults.services.find(item => item.id === service.id);
    if (!original || !replacement) return service;
    return Object.fromEntries(Object.entries(service).map(([key,value]) => [key,
      JSON.stringify(value) === JSON.stringify(original[key]) ? replacement[key] : value]));
  });
  if (JSON.stringify(content.faqs) === JSON.stringify(legacy.faqs)) content.faqs = structuredClone(defaults.faqs);
  content.addons ??= structuredClone(defaults.addons);
  for (const item of defaults.portfolio) {
    if (!content.portfolio.some(photo => photo.id === item.id || photo.before === item.before)) content.portfolio.push(structuredClone(item));
  }
  }
  content.homepage = {...homepageDefaults,...content.homepage};
  for (const [key,value] of Object.entries(homepageDefaults)) {
    if (content.homepage[key] === legacyHomepage[key]) content.homepage[key] = value;
  }
  if (content.settings.headline === legacy.settings.headline) content.settings.headline = defaults.settings.headline;
  if (content.settings.description === 'Premium mobile interior detailing brought directly to you. Give your car the spa day it deserves, with interior packages starting at $95.') content.settings.description = defaults.settings.description;
  content.contentVersion = 2;
  return content;
}
