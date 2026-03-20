import { run } from './cli.js';
import { greetIfNeeded } from './utils/greet.js';

greetIfNeeded();

run().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
