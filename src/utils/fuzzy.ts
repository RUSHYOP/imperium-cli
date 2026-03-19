import { distance } from 'fastest-levenshtein';

const MAX_DISTANCE_RATIO = 0.45;

/**
 * Returns the best fuzzy matches for `input` from `candidates`.
 * Results sorted by Levenshtein distance (ascending).
 */
export function fuzzyMatch(
  input: string,
  candidates: string[],
  max = 3,
): { match: string; distance: number }[] {
  const lower = input.toLowerCase();
  const results = candidates
    .map((c) => ({ match: c, distance: distance(lower, c.toLowerCase()) }))
    .filter((r) => r.distance / Math.max(lower.length, r.match.length) <= MAX_DISTANCE_RATIO)
    .sort((a, b) => a.distance - b.distance);

  return results.slice(0, max);
}

/** Returns the single best match if it's clearly close, otherwise null. */
export function bestMatch(input: string, candidates: string[]): string | null {
  const matches = fuzzyMatch(input, candidates, 1);
  if (matches.length === 0) return null;
  const ratio = matches[0].distance / Math.max(input.length, matches[0].match.length);
  return ratio <= 0.3 ? matches[0].match : null;
}

/** Known command aliases for fuzzy command recovery. */
const COMMAND_NAMES = [
  'setup',
  'add',
  'download',
  'install',
  'list',
  'search',
  'inspect',
  'update',
  'remove',
  'init',
  'detect',
  'validate',
];

export function fuzzyCommand(input: string): string | null {
  return bestMatch(input, COMMAND_NAMES);
}

/** Known preset names for fuzzy folder recovery. */
const PRESET_NAMES = ['.claude', '.github', '.windsurf', '.cursor', '.agents'];

export function fuzzyPreset(input: string): string | null {
  return bestMatch(input, PRESET_NAMES);
}
