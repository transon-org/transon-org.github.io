// Local type shim for @transon/editor-react.
//
// The published `@transon/editor-react` bundles its internal packages into the runtime JS, but its
// generated `.d.ts` still *imports type names* from `@transon/editor-ui` and `@transon/editor-core`
// (which are not separately installed). We declare those modules here with just the surface the
// docs-site consumes, so TypeScript resolves the editor's props. Shipping self-contained editor-react
// types is a packaging follow-up in transon-blockly (RFC-005 Part 4).

declare module '@transon/editor-core' {
  export type Json =
    | null
    | boolean
    | number
    | string
    | Json[]
    | { [key: string]: Json };

  export interface ValidationResult {
    status: 'ok' | 'error';
    valid: boolean;
    error_type?: string;
    error_message?: string;
    template_path?: string;
    block_id?: string;
    raw_engine_error?: string;
  }

  export interface ExecutionResult {
    status: 'ok' | 'error';
    success: boolean;
    output?: Json;
    filesWritten?: Record<string, Json>;
    error_type?: string;
    error_message?: string;
    template_path?: string;
    block_id?: string;
    raw_engine_error?: string;
  }

  /** The host runtime port the editor consumes (AD-008). Implemented by the docs-site provider. */
  export interface EngineProvider {
    readonly status: 'idle' | 'loading' | 'ready' | 'failed';
    init(): Promise<void>;
    validate(template: Json, o: { marker: string }): Promise<ValidationResult>;
    transform(
      template: Json,
      input: Json,
      o: {
        marker: string;
        includeLoader?(name: string): Json | undefined;
        includes?: Record<string, Json>;
        maxIncludeDepth?: number;
      },
    ): Promise<ExecutionResult>;
    version(): Promise<{ engine: string; metadata: string }>;
    dispose(): void;
  }
}

declare module '@transon/editor-ui' {
  import type { EngineProvider, Json } from '@transon/editor-core';

  export type EditorController = unknown;
  export type EditorMode = 'sandbox' | 'compact';
  export type ToolboxCategoryConfig = unknown;
  export type TransonTheme = Record<string, string>;

  export interface ExampleCase {
    name: string;
    doc?: string;
    tags?: string[];
    template: Json;
    data?: Json;
    result?: Json;
    rule?: string;
    param?: string;
    tier?: 'worked-example' | 'recipe';
  }

  export interface TransonEditorHost {
    engine?: EngineProvider;
    marker?: string;
    examples?: ExampleCase[];
    metadata?: unknown;
    theme?: TransonTheme;
    categories?: ToolboxCategoryConfig;
    includeLoader?(name: string): Json | undefined;
    includes?: Record<string, Json>;
  }

  export type ToolbarActionId = 'new' | 'import' | 'copy' | 'download' | 'validate' | 'run';

  export interface EditorControllerOptions {
    host: TransonEditorHost;
    mode?: EditorMode;
    template?: Json;
    input?: Json;
    readOnly?: boolean;
    hideToolbarActions?: ToolbarActionId[];
    onBack?(): void;
    backLabel?: string;
    paletteView?: { showAdvanced?: boolean; search?: string };
    hidePaletteControls?: boolean;
    autorun?: boolean;
    onChange?(template: Json | null): void;
    onValidate?(result: unknown): void;
    onExecute?(result: unknown): void;
    confirmReplace?(): boolean;
    debounceMs?: number;
  }
}
