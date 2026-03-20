import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { PresetName, ResolvedTarget } from '../core/types/index.js';
import type { FetchedPackage } from '../core/registry/index.js';
import { verbose, warn } from '../utils/log.js';

/** Adapter interface: each preset knows how to scaffold and generate native views. */
export interface PresetAdapter {
  /** Create the empty folder scaffold for this preset. */
  scaffold(rootDir: string): string[];
  /** Generate native platform files from an installed skill. */
  generateNativeFiles(pkg: FetchedPackage, target: ResolvedTarget): string[];
}

// ---------------------------------------------------------------------------
// Claude adapter
// ---------------------------------------------------------------------------

const claudeAdapter: PresetAdapter = {
  scaffold(rootDir) {
    const dirs = [
      join(rootDir, 'rules'),
      join(rootDir, 'commands'),
      join(rootDir, 'agents'),
      join(rootDir, 'skills'),
      join(rootDir, 'todos'),
    ];
    dirs.forEach((d) => mkdirSync(d, { recursive: true }));
    return dirs;
  },

  generateNativeFiles(pkg, target) {
    const files: string[] = [];

    // Generate a .claude/agents/<name>.md if the skill has agent-like content
    if (pkg.manifest.kind === 'skill') {
      const agentDir = join(target.rootDir, 'agents');
      mkdirSync(agentDir, { recursive: true });
      const agentPath = join(agentDir, `${pkg.manifest.name}.md`);

      const content = [
        '---',
        `name: ${pkg.manifest.name}`,
        `description: ${pkg.manifest.description}`,
        '---',
        '',
        pkg.skillContent.trim(),
      ].join('\n');

      writeFileSync(agentPath, content + '\n', 'utf-8');
      verbose(`Generated Claude agent file: ${agentPath}`);
      files.push(agentPath);
    }

    return files;
  },
};

// ---------------------------------------------------------------------------
// GitHub Copilot adapter
// ---------------------------------------------------------------------------

const githubAdapter: PresetAdapter = {
  scaffold(rootDir) {
    const dirs = [
      join(rootDir, 'instructions'),
      join(rootDir, 'prompts'),
    ];
    dirs.forEach((d) => mkdirSync(d, { recursive: true }));

    // Create empty copilot-instructions.md if it doesn't exist
    const mainInstructions = join(rootDir, 'copilot-instructions.md');
    if (!existsSync(mainInstructions)) {
      writeFileSync(
        mainInstructions,
        '# Copilot Instructions\n\nAdd project-wide instructions here.\n',
        'utf-8',
      );
    }

    return dirs;
  },

  generateNativeFiles(pkg, target) {
    const files: string[] = [];

    // Generate .github/instructions/<name>.instructions.md
    const instrDir = join(target.rootDir, 'instructions');
    mkdirSync(instrDir, { recursive: true });
    const instrPath = join(instrDir, `${pkg.manifest.name}.instructions.md`);

    const content = [
      '---',
      `applyTo: "**"`,
      '---',
      '',
      `# ${pkg.manifest.name}`,
      '',
      pkg.manifest.description,
      '',
      pkg.skillContent.trim(),
    ].join('\n');

    writeFileSync(instrPath, content + '\n', 'utf-8');
    verbose(`Generated GitHub instructions file: ${instrPath}`);
    files.push(instrPath);

    return files;
  },
};

// ---------------------------------------------------------------------------
// Windsurf adapter
// ---------------------------------------------------------------------------

const windsurfAdapter: PresetAdapter = {
  scaffold(rootDir) {
    const dirs = [
      join(rootDir, 'skills'),
      join(rootDir, 'workflows'),
    ];
    dirs.forEach((d) => mkdirSync(d, { recursive: true }));
    return dirs;
  },

  generateNativeFiles(pkg, target) {
    // Windsurf reads directly from skills/ — no extra native files needed
    return [];
  },
};

// ---------------------------------------------------------------------------
// Cursor adapter
// ---------------------------------------------------------------------------

const cursorAdapter: PresetAdapter = {
  scaffold(rootDir) {
    const dirs = [join(rootDir, 'rules')];
    dirs.forEach((d) => mkdirSync(d, { recursive: true }));
    return dirs;
  },

  generateNativeFiles(pkg, target) {
    const files: string[] = [];

    // Generate .cursor/rules/<name>.md
    const rulesDir = join(target.rootDir, 'rules');
    mkdirSync(rulesDir, { recursive: true });
    const rulePath = join(rulesDir, `${pkg.manifest.name}.md`);

    const content = [
      `# ${pkg.manifest.name}`,
      '',
      pkg.manifest.description,
      '',
      pkg.skillContent.trim(),
    ].join('\n');

    writeFileSync(rulePath, content + '\n', 'utf-8');
    verbose(`Generated Cursor rule file: ${rulePath}`);
    files.push(rulePath);

    return files;
  },
};

// ---------------------------------------------------------------------------
// Custom / fallback adapter
// ---------------------------------------------------------------------------

const customAdapter: PresetAdapter = {
  scaffold(rootDir) {
    const dirs = [join(rootDir, 'skills')];
    dirs.forEach((d) => mkdirSync(d, { recursive: true }));
    return dirs;
  },

  generateNativeFiles() {
    return [];
  },
};

// ---------------------------------------------------------------------------
// Adapter registry
// ---------------------------------------------------------------------------

const adapters: Record<PresetName, PresetAdapter> = {
  claude: claudeAdapter,
  github: githubAdapter,
  windsurf: windsurfAdapter,
  cursor: cursorAdapter,
  custom: customAdapter,
};

export function getAdapter(preset: PresetName): PresetAdapter {
  return adapters[preset] || customAdapter;
}
