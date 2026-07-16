import json
import sys

# Host recursion budget (transon-blockly RFC-004/RFC-005, metadata-contract §6.5): the visual
# editor's forward-projection codec walk peaks well above CPython's default 1000-frame limit —
# mirror the reference host's 1400 so opening/round-tripping templates in the editor doesn't
# overflow. Harmless for the docs playground `transform` below.
sys.setrecursionlimit(max(sys.getrecursionlimit(), 1400))

import js
from pyodide.ffi import create_proxy

import transon
from transon import Transformer, DefinitionError, TransformationError
from transon.docs import get_all_docs, template_loader

try:
    from transon.metadata import get_editor_metadata
except Exception:  # pragma: no cover - older engines
    get_editor_metadata = None

loads = json.loads


def dumps(value):
    return json.dumps(value, indent=2)


# --- Docs playground (unchanged behavior): transform a template against sample input, returning a
#     pretty-printed string or the Python error repr. Used by src/ExampleEditor.tsx (Monaco). ---
def transform(template, data):
    try:
        template_data = loads(template)
        transformer = transon.Transformer(
            template_data,
            template_loader=template_loader,
        )
        input_data = loads(data)
        result = transformer.transform(input_data)
        return dumps(None if result is transformer.NO_CONTENT else result)
    except Exception as error:
        return repr(error)


# --- Editor engine glue (mirrors transon-blockly examples/reference-host/src/glue.ts GLUE_PY):
#     the SharedPyScriptProvider (src/transonEngine.ts) proxies to these over JSON strings, so the
#     visual editor reuses THIS interpreter (no second Pyodide). ---
def _error_fields(exc):
    if isinstance(exc, DefinitionError):
        et = "DefinitionError"
    elif isinstance(exc, TransformationError):
        et = "TransformationError"
    else:
        et = type(exc).__name__
    msg = str(exc)
    return {"error_type": et, "error_message": msg, "raw_engine_error": msg}


def transon_validate(template_json, marker):
    try:
        Transformer(loads(template_json), marker=marker).validate()
    except Exception as exc:  # discriminated by _error_fields; never escapes
        return json.dumps({"status": "ok", "valid": False, **_error_fields(exc)})
    return json.dumps({"status": "ok", "valid": True})


def _make_loader(includes, marker, js_loader):
    if not includes and js_loader is None:
        return None

    def loader(name, context=None):
        template = None
        if includes and name in includes:
            template = includes[name]
        elif js_loader is not None:
            s = js_loader(name)  # JS callback returns a JSON string or None
            if s is not None:
                template = loads(s)
        if template is None:
            raise TransformationError("include not resolvable: " + str(name))
        if context is not None:
            return context.transformer(template)
        return Transformer(template, marker=marker)

    return loader


def transon_transform(template_json, input_json, marker, includes_json, js_loader, max_include_depth=None):
    template = loads(template_json)
    data = loads(input_json)
    includes = loads(includes_json) if includes_json else {}
    files_written = {}

    def file_writer(name, content):
        files_written[name] = content

    loader = _make_loader(includes, marker, js_loader)
    kwargs = {"marker": marker, "file_writer": file_writer}
    if loader is not None:
        kwargs["template_loader"] = loader
    if max_include_depth is not None:
        try:
            kwargs["max_include_depth"] = int(max_include_depth)
        except (TypeError, ValueError):
            pass
    try:
        output = Transformer(template, **kwargs).transform(data, copy_output=True)
    except Exception as exc:  # discriminated by _error_fields; never escapes
        return json.dumps(
            {"status": "ok", "success": False, "files_written": files_written, **_error_fields(exc)}
        )
    return json.dumps(
        {"status": "ok", "success": True, "output": output, "files_written": files_written}
    )


def transon_editor_metadata():
    # RFC-007/FR-139 (transon-blockly metadata-contract §3 runtime delivery): the full
    # get_editor_metadata() payload, verbatim, as a JSON string. Errors return an envelope the
    # provider surfaces as a rejection -> the editor's FR-140 gate falls back to its snapshot.
    try:
        if get_editor_metadata is None:
            raise RuntimeError("engine has no editor-metadata export (transon.metadata)")
        return json.dumps({"status": "ok", "metadata": get_editor_metadata()})
    except Exception as exc:  # discriminated by _error_fields; never escapes
        return json.dumps({"status": "error", **_error_fields(exc)})


def transon_version():
    try:
        version = getattr(transon, "__version__", None)
        meta = get_editor_metadata() if get_editor_metadata else {}
        return json.dumps(
            {
                "engine": str(version) if version else str(meta.get("engine_version", "unknown")),
                "metadata": str(meta.get("metadata_version", "unknown")),
            }
        )
    except Exception as exc:
        return json.dumps({"engine": "unknown", "metadata": "unknown", **_error_fields(exc)})


# Expose to JS. create_proxy keeps the Python callables alive past this run (Pyodide would otherwise
# reclaim a bare proxy). The provider + docs playground read these off `window`.
js.transform = create_proxy(transform)
js.transon_validate = create_proxy(transon_validate)
js.transon_transform = create_proxy(transon_transform)
js.transon_version = create_proxy(transon_version)
js.transon_editor_metadata = create_proxy(transon_editor_metadata)

js.init(dumps(get_all_docs()))
