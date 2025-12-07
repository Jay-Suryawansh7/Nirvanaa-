// Usage: npx ts-node scripts/uuid-generator.ts <short-code>
// Example: npx ts-node scripts/uuid-generator.ts 1234

const expandToUuid = (shortCode: string): string => {
  // Simple zero-pad approach: 00000000-0000-0000-0000-00000000xxxx
  // where xxxx is the input.
  const clean = shortCode.replace(/[^a-fA-F0-9]/g, ""); 
  const padded = clean.padStart(32, "0");
  
  // 8-4-4-4-12 format
  return `${padded.slice(0, 8)}-${padded.slice(8, 12)}-${padded.slice(12, 16)}-${padded.slice(16, 20)}-${padded.slice(20, 32)}`;
};

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log("Please provide a short code (e.g. 1234)");
    process.exit(1);
}

const input = args[0];
const uuid = expandToUuid(input);

console.log(`\nInput Code: ${input}`);
console.log(`Generated UUID: ${uuid}\n`);
console.log("You can use this UUID in your database or API requests.");
