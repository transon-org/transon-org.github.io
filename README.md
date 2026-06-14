# Transon documentation site

Interactive docs and playground for [transon](https://github.com/transon-org/transon), deployed at https://transon-org.github.io/.

## Branches

| Branch | Purpose |
|--------|---------|
| `master` | Source — React app, `public/` assets, TypeScript |
| `gh-pages` | Release — built static site served by GitHub Pages |

Do not edit `gh-pages` by hand. Pushes to `master` deploy automatically via GitHub Actions (`.github/workflows/deploy.yml`). You can still deploy manually with `npm run deploy`.

## Development

```bash
yarn install
yarn start
```

Open http://localhost:3000. The playground needs PyScript to load `transon` from PyPI in the browser; local dev behaves the same as production.

## Release

Pushes to `master` trigger an automatic deploy: the workflow runs `yarn build` and
pushes `build/` to the `gh-pages` branch (same result as the manual command below).

To deploy manually:

```bash
npm run deploy
```

This runs `npm run build` (via `predeploy`), then pushes the `build/` folder to the `gh-pages` branch with [gh-pages](https://www.npmjs.com/package/gh-pages).

After deploy, verify https://transon-org.github.io/ loads the docs (not a blank page). PyScript assets are pinned in `public/index.html` — the `/latest/` CDN path no longer exists.

## How it works

- React renders rule docs and examples.
- PyScript runs `public/script.py`, which imports `transon` and calls `js.init()` with JSON from `transon.docs.get_all_docs()`.
- Example editors call `transform(template, data)` bridged from Python via `pyscript.interpreter.globals`.
