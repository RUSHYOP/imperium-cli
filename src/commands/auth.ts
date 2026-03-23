import { login, logout, whoami } from '../core/auth.js';
import { error as logError } from '../utils/log.js';

/**
 * `imperium login` — Browser-based Microsoft sign-in.
 */
export async function loginCommand(): Promise<void> {
  try {
    await login();
  } catch (err: any) {
    logError(`Login failed: ${err.message}`);
    process.exitCode = 1;
  }
}

/**
 * `imperium logout` — Clear stored credentials.
 */
export function logoutCommand(): void {
  logout();
}

/**
 * `imperium whoami` — Display current auth status.
 */
export function whoamiCommand(): void {
  whoami();
}
