export const expandToUuid = (shortCode: string): string => {
  // If it's already a valid UUID (36 chars with hyphens), return it
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(shortCode)) {
      return shortCode;
  }

  // If it's short (e.g. 4 digits), pad it
  // Strategy: Pad left with 0s to 12 chars for the last segment (node), 
  // and use 0s for the rest.
  // Template: 00000000-0000-0000-0000-000000000000
  // Replacing last chars with shortCode.
  
  // Clean input (remove non-hex if we want to be strict, but let's just use what given)
  // For safety, let's only accept hex-like strings or just fill.
  
  // Simple approach: Zero pad to 32 chars, then insert hyphens.
  const clean = shortCode.replace(/[^a-fA-F0-9]/g, ""); // Keep only hex
  const padded = clean.padStart(32, "0");
  
  // 8-4-4-4-12
  return `${padded.slice(0, 8)}-${padded.slice(8, 12)}-${padded.slice(12, 16)}-${padded.slice(16, 20)}-${padded.slice(20, 32)}`;
};
