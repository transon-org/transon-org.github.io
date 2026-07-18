import { useMemo } from 'react';
import { TransonEditor } from '@transon/editor-react';
import type { EngineProvider } from '@transon/editor-react';
import { IDocsData, IExampleData } from './types';
import { toExampleCases } from './transonEngine';

// Full-page overlay hosting the embedded Transon visual editor (RFC-005 B4). Reuses the docs page's
// PyScript runtime via the shared `engine`. Always autorun; the toolbar is reduced to just
// "← Back to docs"; all doc examples are offered in the picker (tiered/grouped via the editor's
// corpus derivation, FR-132 — the whole docs payload feeds it, not just the flat corpus); the
// palette shows all blocks with no search/advanced chrome.
export function EditorView({
    engine,
    example,
    docs,
    onBack,
}: {
    engine: EngineProvider;
    example: IExampleData;
    docs: IDocsData;
    onBack: () => void;
}) {
    const cases = useMemo(() => toExampleCases(docs), [docs]);
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1050,
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <TransonEditor
                host={{ engine, examples: cases }}
                metadataSource="engine"
                template={example.template}
                input={example.data}
                autorun
                onBack={onBack}
                backLabel="Back to docs"
                hideToolbarActions={['new', 'import', 'copy', 'download', 'validate', 'run']}
                paletteView={{ showAdvanced: true }}
                hidePaletteControls
            />
        </div>
    );
}
