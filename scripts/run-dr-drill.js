const path = require('path');
const { runDisasterRecoveryDrill, timestampForPath } = require('./lib/disaster-recovery');

async function main() {
  const outputDir =
    process.env.DR_OUTPUT_DIR ||
    path.join(process.cwd(), 'artifacts', 'disaster-recovery', timestampForPath());
  const result = await runDisasterRecoveryDrill({ outputDir });
  console.log(result.report);

  if (!result.status.ok) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
