// Vendored from super-productivity/super-productivity, packages/plugin-api/src.
// Source: https://github.com/johannesjo/super-productivity/tree/master/packages/plugin-api
// Pinned commit: 92dea833e879400a3ec4c61955239231c4d505b2
// Why vendored: the published npm package ships only .d.ts files (its
// `files` allowlist drops dist/*.js), so the runtime PluginHooks enum
// fails to resolve at bundle time. Keep these files 1:1 with upstream
// to make future syncs a clean diff. Local API extensions live in
// src/plugin.ts, not here.

export * from './types';
export * from './issue-provider-types';
