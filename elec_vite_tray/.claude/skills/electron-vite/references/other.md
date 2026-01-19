# Electron-Vite - Other

**Pages:** 3

---

## Dependency Handling ​

**URL:** https://electron-vite.org/guide/dependency-handling

**Contents:**
    - 毫秒镜像
    - sqlite3-queries
- Dependency Handling ​
- Default Behavior ​
  - dependencies ​
  - devDependencies and Phantom Dependencies ​
- Customizing ​
- Fully Bundling ​

When bundling with electron-vite, dependencies are intelligently handled to keep the final build lightweight. This guide outlines the default behavior for dependency handling and how it can be customized.

By default, electron-vite treats the electron module and all Node.js built-in modules as external dependencies.

Main process & preload scripts - Dependencies listed under dependencies in your package.json are treated as external and are not bundled.

These dependencies will still be included when packaging the app (for example, via electron-builder).

Renderers - Dependencies listed under dependencies in your package.json are bundled.

Bundling dependencies reduces the number of chunks, which helps maintain fast renderer performance.

Dependencies used in the renderer process should preferably be installed as devDependencies to help keep the final package size smaller.

Only the dependencies that are actually imported or required in the project will be included in the bundle. Regardless of whether these dependencies are listed under devDependencies in the package.json, or are “phantom dependencies” (present in the node_modules folder but not explicitly declared in package.json), they will be bundled as long as they are referenced in the code.

Packaging tools (such as electron-builder) exclude devDependencies by default.

You can customize how dependencies are handled by configuring the build.externalizeDeps.exclude and build.externalizeDeps.include options, giving you more control over which dependencies are bundled or externalized.

In this example, foo package will be bundled. You can also install this dependency in devDependencies and achieve the same effect.

Before electron-vite 5, you should configure it using the externalizeDepsPlugin.

If you want to fully bundle all dependencies, you can disable build.externalizeDeps option to turn off electron-vite's automatic dependency handling.

Keep in mind that full bundling increases build time, and you should plan your module chunking strategy carefully to avoid impacting application startup performance.

In preload scripts, disabling dependency externalization is required to support Electron’s sandboxed environment. For more details, see the Limitations of Sandboxing section.

In a full-bundle scenario, some modules do not support being fully bundled, such as Node.js addons. These modules must remain external, which can be configured using build.rollupOptions.external.

**Examples:**

Example 1 (sql):
```sql
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    build: {
      externalizeDeps: {
        exclude: ['foo']
      }
    }
  }
  // ...
})
```

Example 2 (sql):
```sql
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    build: {
      externalizeDeps: {
        exclude: ['foo']
      }
    }
  }
  // ...
})
```

Example 3 (sql):
```sql
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    build: {
      externalizeDeps: false
    }
  }
  // ...
})
```

Example 4 (sql):
```sql
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    build: {
      externalizeDeps: false
    }
  }
  // ...
})
```

---

## Troubleshooting ​

**URL:** https://electron-vite.org/guide/troubleshooting

**Contents:**
    - 毫秒镜像
    - sqlite3-queries
- Troubleshooting ​
- Skills ​
- Migration ​
  - The CJS build of Vite's Node API is deprecated ​
- Development ​
  - Unable to load preload scripts -> Error: module not found: 'XXX' ​
  - Uncaught Error: Module "XXX" has been externalized for browser compatibility. or Uncaught ReferenceError: __dirname is not defined ​
- Build ​

See Vite's troubleshooting guide and Rollup's troubleshooting guide for more information too.

If the suggestions here don't work, please try checking the GitHub issue tracker to see if any existing issues match your problem. If you've found a bug, or electron-vite can't meet your needs, please try raising an issue or posting questions on GitHub Discussions.

Through the following steps, you can quickly identify and resolve problems:

Since Vite 5, calling Vite’s CJS Node API will trigger a deprecation warning. electron-vite v2 is now published as an ESM package, so you can update to the latest version.

In addition, make sure that:

Note that when adding "type": "module" to your project's package.json, if Electron supports ESM (Electron 28+), it will be built as ESM. Read the ESM Support in Electron guide before migrating. But if ESM is not supported, it will be built as CommonJS and all files will have the .cjs extension.

If you prefer not to make any changes and want to continue bundling as CJS, the simplest solution is to rename electron.vite.config.js to electron.vite.config.mjs.

From Electron 20, preload scripts are sandboxed by default and no longer have access to the full Node.js environment.

You will need to either:

You should not use Node.js modules in renderer processes. electron-vite also does not support nodeIntegration.

This happens because many libraries (e.g. lowdb, execa, node-fetch) are distributed only as ES modules and therefore cannot be required from CJS code.

There are two ways to resolve this issue:

Electron does not manage browser history and instead relies on a synchronized URL. Therefore, only a hash-based router will work properly in production.

When using a hash router, you can specify the hash value in the second argument of BrowserWindow.loadFile to load the corresponding page.

This error usually occurs because dependent modules are not included in the packaged application. To resolve this issue:

If the missing module is listed under devDependencies, reinstall it under dependencies instead. Packaging tools (such as electron-builder or electron-forge) typically exclude modules in devDependencies.

You can add a file named .npmrc with shamefully-hoist=true in your project root directory (in order for your dependencies to be bundled correctly). Then delete node_modules and pnpm-lock.yaml, and reinstall your dependencies. Alternatively, you can switch to another package manager (e.g. npm or yarn) to avoid this issue.

This issue occurs when build.bytecode is enabled.

To prevent this runtime error, you need to compile the bytecode cache for the target platform and architecture.

See the Limitations of Build section in the Source Code Protection guide for details.

**Examples:**

Example 1 (r):
```r
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    build: {
      externalizeDeps: {
        exclude: ['foo'] // <- Add related modules to 'exclude' option
      }
    }
  },
  // ...
})
```

Example 2 (r):
```r
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    build: {
      externalizeDeps: {
        exclude: ['foo'] // <- Add related modules to 'exclude' option
      }
    }
  },
  // ...
})
```

Example 3 (csharp):
```csharp
win.loadFile(path.join(import.meta.dirname, '../renderer/index.html'), { hash: 'home' })
```

Example 4 (csharp):
```csharp
win.loadFile(path.join(import.meta.dirname, '../renderer/index.html'), { hash: 'home' })
```

---

## Env Variables and Modes ​

**URL:** https://electron-vite.org/guide/env-and-mode

**Contents:**
    - 毫秒镜像
    - sqlite3-queries
- Env Variables and Modes ​
- Global Env Variables ​
- Modes ​

It is recommended to go through Vite's Env Variables and Modes documentation first before reading the sections below.

electron-vite will load environment variables from the project root like Vite, and use different prefixes to limit the available scope.

By default, variables prefixed with MAIN_VITE_ are exposed to the main process, PRELOAD_VITE_ to preload scripts, RENDERER_VITE_ to renderers and VITE_ to all.

If you want to customize env variables prefix, you can use envPrefix option.

If you are a TypeScript user, make sure to add type definitions for import.meta.env in env.d.ts to get type checks and intellisense for user-defined env variables.

By default, dev command runs in development mode, the build and preview command runs in production mode.

You can overwrite the default mode used for a command by passing the --mode option flag. See Vite Modes.

**Examples:**

Example 1 (unknown):
```unknown
KEY=123                # not available
MAIN_VITE_KEY=123      # only main process available
PRELOAD_VITE_KEY=123   # only preload scripts available
RENDERER_VITE_KEY=123  # only renderers available
VITE_KEY=123           # all available
```

Example 2 (unknown):
```unknown
KEY=123                # not available
MAIN_VITE_KEY=123      # only main process available
PRELOAD_VITE_KEY=123   # only preload scripts available
RENDERER_VITE_KEY=123  # only renderers available
VITE_KEY=123           # all available
```

Example 3 (css):
```css
export default defineConfig({
  main: {
    envPrefix: 'M_VITE_'
  }
  // ...
})
```

Example 4 (css):
```css
export default defineConfig({
  main: {
    envPrefix: 'M_VITE_'
  }
  // ...
})
```

---
