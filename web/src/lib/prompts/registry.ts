import type { AnyPromptModule, PromptId, PromptModule } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Prompt registry
//
// Holds every prompt version, keyed by id. Newer versions can be registered
// without removing old ones, so results produced by an older version remain
// reproducible. `getPrompt` returns the latest version unless one is pinned.
// ─────────────────────────────────────────────────────────────────────────────

const registry = new Map<PromptId, AnyPromptModule[]>();

// Registers a prompt version. Later registrations of the same id are treated as
// newer and become the default returned by getPrompt.
export function registerPrompt<I>(module: PromptModule<I>): PromptModule<I> {
  const existing = registry.get(module.id) ?? [];
  if (existing.some((m) => m.version === module.version)) {
    throw new Error(
      `Prompt ${module.id} version ${module.version} is already registered.`
    );
  }
  existing.push(module as AnyPromptModule);
  registry.set(module.id, existing);
  return module;
}

// Returns a prompt by id. Defaults to the most recently registered version.
// Pin a specific version to reproduce an older result.
export function getPrompt<I>(id: PromptId, version?: string): PromptModule<I> {
  const versions = registry.get(id);
  if (!versions || versions.length === 0) {
    throw new Error(`No prompt registered for id ${id}.`);
  }
  if (version) {
    const found = versions.find((m) => m.version === version);
    if (!found) {
      throw new Error(`Prompt ${id} has no version ${version}.`);
    }
    return found as PromptModule<I>;
  }
  return versions[versions.length - 1] as PromptModule<I>;
}

// Lists all registered prompts and their versions (for tooling / admin UI).
export function listPrompts(): Array<{ id: PromptId; versions: string[] }> {
  return Array.from(registry.entries()).map(([id, modules]) => ({
    id,
    versions: modules.map((m) => m.version),
  }));
}
