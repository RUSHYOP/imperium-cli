import chalk from 'chalk';
import type { GlobalOptions } from '../core/types.js';

let _opts: GlobalOptions = {};

export function setLogOptions(opts: GlobalOptions): void {
  _opts = opts;
}

export function info(msg: string): void {
  if (!_opts.silent) console.log(msg);
}

export function success(msg: string): void {
  if (!_opts.silent) console.log(chalk.green('✔ ') + msg);
}

export function warn(msg: string): void {
  if (!_opts.silent) console.log(chalk.yellow('⚠ ') + msg);
}

export function error(msg: string): void {
  if (_opts.silent) return;
  console.error(chalk.red('✖ ') + msg);
}

export function verbose(msg: string): void {
  if (_opts.verbose && !_opts.silent) console.log(chalk.gray('  ' + msg));
}

export function dim(msg: string): void {
  if (!_opts.silent) console.log(chalk.dim(msg));
}

export function heading(msg: string): void {
  if (!_opts.silent) console.log('\n' + chalk.bold.cyan(msg));
}

export function list(items: string[]): void {
  if (!_opts.silent) {
    items.forEach((item) => console.log('  • ' + item));
  }
}

// Re-export chalk for use in help formatters
export { chalk };
