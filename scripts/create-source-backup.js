const path = require('path');
const { createSourceBackup, timestampForPath } = require('./lib/disaster-recovery');

async function main() {
  const outputDir =
    process.env.DR_OUTPUT_DIR ||
    path.join(process.cwd(), 'artifacts', 'disaster-recovery', timestampForPath(), 'manual');
  const sourceBackup = await createSourceBackup(outputDir);
  console.log(JSON.stringify(sourceBackup, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
