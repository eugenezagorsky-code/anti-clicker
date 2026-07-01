export const TICKER_MESSAGES: Record<number, string> = {
  1: "AI drafts listing copy for a 'vintage Nike hoodie, 9/10 condition'. 500ml of water evaporates to cool server racks. Irony Alert: Second-hand carbon savings neutralized by prompt inference.",
  2: "User applies AI Background Eraser to 50 fast-fashion items. A coal power plant throttles up to meet demand. Air quality index drops near the primary server node.",
  3: "Anti-Fraud AI deep-scans a suspected counterfeit bag using a heavy vision model. Regional grid stress spikes; 12 nearby households experience micro-blackouts.",
  4: "AI updates 'Items You May Like' feed for 4 million buyers at once. Data center expansion displaces a local neighborhood to clear space for a water-cooling tower block.",
  5: "Seller Assist AI burns through monthly prompt quota drafting 200 'barely worn' descriptions. Carbon debt invoice generated. Payment required.",
  6: "Batch re-indexing of 12M wardrobe photos triggers emergency cooling protocol. Datacenter fans spinning at 11,000 RPM.",
  7: "Autonomous listing engine engaged. Android assumes marketplace optimization — operator override disabled.",
};

export const AUTONOMOUS_CHAOS_MESSAGES = [
  "AI optimizes search relevance vectors... +2.4kg CO2",
  "Running automated algorithmic pricing models... +3.1L Water",
  "Predicting buyer friction reduction models... Grid at 94% Capacity",
  "Circular economy servers drawing peak industrial voltage...",
  "Auto-generating 'authentic vintage' tags for 40,000 listings... +1.8kg CO2",
  "Scaling buyer-notification embeddings across EU regions... +2.7L Water",
  "Re-ranking closet refresh prompts for dormant sellers... Grid at 97% Capacity",
] as const;

export function formatTickerLine(clickNumber: number, message: string): string {
  return `Click ${clickNumber}: ${message}`;
}

export function getAutonomousOverdriveMessage(multiplier: number): string {
  const tick = multiplier <= 1 ? 0 : Math.round(Math.log2(multiplier));
  return AUTONOMOUS_CHAOS_MESSAGES[tick % AUTONOMOUS_CHAOS_MESSAGES.length];
}

export function getGenericInnovationMessage(clickNumber: number): string {
  return `Marketplace AI override #${clickNumber} deployed. +500ml water, +0.2kg carbon, +3% grid stress.`;
}
