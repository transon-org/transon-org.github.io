// SharedPyScriptProvider (RFC-005 B3): an EngineProvider for the embedded Transon visual editor that
// REUSES the docs-site's existing PyScript interpreter — it never loads a second Pyodide. script.py
// exposes the engine glue on `window` (window.transon_validate/transform/version, via create_proxy);
// this proxies to them over JSON strings, exactly like transon-blockly's reference Pyodide host but
// pointed at the shared runtime. dispose() is a no-op: the interpreter is owned by the docs page.

import type {
  EngineProvider,
  ExecutionResult,
  ExampleCase,
  Json,
  ValidationResult,
} from '@transon/editor-react';
import { IExampleData } from './types';

type PyCallable = (...args: unknown[]) => unknown;

interface GlueGlobals {
  transon_validate?: PyCallable;
  transon_transform?: PyCallable;
  transon_version?: PyCallable;
}

function glue(): GlueGlobals {
  return window as unknown as GlueGlobals;
}

/** The glue is present once script.py has run (installed transon + defined the functions). */
function glueReady(): boolean {
  return typeof glue().transon_transform === 'function';
}

/**
 * Create the shared-interpreter EngineProvider. `init()` resolves once the PyScript glue is on
 * `window`; by the time a reader opens the editor the docs page has long since finished loading, but
 * we still poll defensively so an early open waits for readiness rather than failing.
 */
export function createSharedPyScriptEngine(): EngineProvider {
  let status: EngineProvider['status'] = 'idle';

  const require = (name: keyof GlueGlobals): PyCallable => {
    const fn = glue()[name];
    if (typeof fn !== 'function') {
      throw new Error(`SharedPyScriptProvider: ${name} not available (status: ${status})`);
    }
    return fn;
  };

  return {
    get status() {
      return status;
    },
    async init(): Promise<void> {
      if (glueReady()) {
        status = 'ready';
        return;
      }
      status = 'loading';
      await new Promise<void>((resolve) => {
        const timer = setInterval(() => {
          if (glueReady()) {
            clearInterval(timer);
            status = 'ready';
            resolve();
          }
        }, 100);
      });
    },
    async validate(template: Json, o: { marker: string }): Promise<ValidationResult> {
      const out = require('transon_validate')(JSON.stringify(template), o.marker) as string;
      return JSON.parse(out) as ValidationResult;
    },
    async transform(template, input, o): Promise<ExecutionResult> {
      const jsLoader = o.includeLoader
        ? (name: string): string | null => {
            const t = o.includeLoader!(name);
            return t === undefined ? null : JSON.stringify(t);
          }
        : null;
      // OMIT max_include_depth when unset (a JS null reaches Python as a proxy, not None; the
      // Python default must come from the missing argument) — same trap the reference host documents.
      const depthArgs = o.maxIncludeDepth != null ? [o.maxIncludeDepth] : [];
      const out = require('transon_transform')(
        JSON.stringify(template),
        JSON.stringify(input ?? null),
        o.marker,
        JSON.stringify(o.includes ?? {}),
        jsLoader,
        ...depthArgs,
      ) as string;
      const parsed = JSON.parse(out) as ExecutionResult & { files_written?: Record<string, Json> };
      // Python glue emits snake_case `files_written`; the port uses camelCase `filesWritten`.
      const { files_written, ...rest } = parsed;
      return { ...rest, filesWritten: files_written } as ExecutionResult;
    },
    async version(): Promise<{ engine: string; metadata: string }> {
      return JSON.parse(require('transon_version')() as string) as {
        engine: string;
        metadata: string;
      };
    },
    dispose(): void {
      // No-op: the interpreter is the docs page's shared PyScript runtime, never torn down here.
    },
  };
}

/** Map the docs corpus (engine `get_all_docs().examples`) to the editor's ExampleCase shape. */
export function toExampleCases(examples: IExampleData[]): ExampleCase[] {
  return examples.map((e) => ({
    name: e.name,
    doc: e.doc,
    tags: e.tags,
    template: e.template as Json,
    data: (e.data ?? undefined) as Json | undefined,
    result: (e.result ?? undefined) as Json | undefined,
  }));
}
