export const money = amount => '$' + amount.toLocaleString('en-US', {minimumFractionDigits: amount % 1 ? 2 : 0, maximumFractionDigits: 2});

export function validEstimateSelection(serviceId, quantities, content) {
  if (serviceId && !content.services.some(item=>item.id===serviceId&&item.active)) return false;
  if (!quantities || typeof quantities!=='object' || Array.isArray(quantities) || Object.keys(quantities).length>20) return false;
  return Object.entries(quantities).every(([id,quantity]) => {
    const addon=content.addons?.find(item=>item.id===id&&item.active);
    return addon && Number.isSafeInteger(quantity) && quantity>=1 && quantity<=(readAddonPrice(addon.priceLabel)?.each?10:1);
  });
}

// Prices stay in sync with the price labels editable in the admin Services tab.
// An unrecognized label requires a quote rather than silently adding zero.
export function readAddonPrice(label) {
  const value = label.trim();
  const match = value.match(/^(?:from\s+)?\+?\$(\d+(?:\.\d{1,2})?)(?:\s*[–—-]\s*\$?(\d+(?:\.\d{1,2})?))?(\+)?(?:\s*(each|\/\s*pair))?$/i);
  if (!match) return null;
  const min = Number(match[1]), max = match[3] || /^from\s/i.test(value) ? null : Number(match[2] ?? match[1]);
  if (max !== null && max < min) return null;
  return {min, max, each: match[4]?.toLowerCase() === 'each'};
}

/** @param {{service:import('./types').Service|null,addons?:import('./types').Addon[],quantities?:Record<string,number>,quoteRequired?:boolean}} options */
export function buildEstimate({service, addons = [], quantities = {}, quoteRequired = false}) {
  const lines = addons.filter(item => item.active && quantities[item.id] > 0).map(item => {
    const price = readAddonPrice(item.priceLabel);
    const quantity = price?.each ? Math.min(10, Math.max(1, Math.floor(quantities[item.id]))) : 1;
    return {id:item.id, name:item.name, quantity, priceLabel:item.priceLabel, min:price ? Math.round(price.min * 100) * quantity / 100 : null, max:price?.max != null ? Math.round(price.max * 100) * quantity / 100 : null};
  });
  const base = service?.price ?? null;
  const min = base === null ? null : (Math.round(base * 100) + lines.reduce((sum,line) => sum + Math.round((line.min ?? 0) * 100), 0)) / 100;
  const allUpperKnown = lines.every(line => line.max !== null);
  const max = base === null || !allUpperKnown ? null : (Math.round(base * 100) + lines.reduce((sum,line) => sum + Math.round(line.max * 100), 0)) / 100;
  const needsQuote = quoteRequired || base === null || lines.some(line => line.min === null);
  const totalLabel = needsQuote ? 'Quote required' : max !== null && max !== min ? `${money(min)}–${money(max)}+` : `From ${money(min)}`;
  const notes = [
    'ITEMIZED DETAIL ESTIMATE',
    `Package: ${service?.name || 'Choose a package'} — ${base === null ? 'Quote required' : 'from ' + money(base)}`,
    ...lines.map(line => `${line.name}${line.quantity > 1 ? ' × ' + line.quantity : ''}: ${line.priceLabel}${line.quantity > 1 && line.min !== null ? ' = ' + money(line.min) : ''}`),
    ...(lines.length ? [] : ['Add-ons: none selected']),
    `Estimated total: ${totalLabel}`,
    ...(needsQuote && min !== null ? [`Known starting subtotal: ${money(min)}; additional quoted charges may apply.`] : []),
    'Prices start at the listed amounts. Ranges cover listed add-ons; final pricing depends on vehicle size, condition and labor. No tax or unlisted fees have been calculated.',
    'This is an estimate, not a payment receipt or confirmed appointment.'
  ].join('\n');
  return {lines, min, max, needsQuote, totalLabel, notes};
}
