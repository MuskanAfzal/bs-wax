import legacy from './legacy-defaults.json' with {type:'json'};

// Upgrade the original placeholder content once. Edited business fields and
// existing photos win; the version returned to admin is persisted on Save.
export function upgradeContent(saved, defaults) {
  if (saved.contentVersion === 1) return saved;
  const content = structuredClone(saved);
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
  content.contentVersion = 1;
  return content;
}
