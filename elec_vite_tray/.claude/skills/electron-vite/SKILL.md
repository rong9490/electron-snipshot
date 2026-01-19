---
name: electron-vite
description: Next generation Electron build tooling based on Vite. Use for building Electron apps with fast HMR, hot reloading, optimized asset handling, isolated builds, and Vite-powered development experience.
---

# Electron-Vite Skill

Next generation electron build tooling based on vite. use for building electron apps with fast hmr, hot reloading, optimized asset handling, isolated builds, and vite-powered development experience., generated from official documentation.

## When to Use This Skill

This skill should be triggered when:
- Working with electron-vite
- Asking about electron-vite features or APIs
- Implementing electron-vite solutions
- Debugging electron-vite code
- Learning electron-vite best practices

## Quick Reference

### Common Patterns

**Pattern 1:** On this page毫秒镜像毫秒镜像木雷坞 · MLIEVelectron-uikitYour LogoAsset Handling ​NOTEThe asset handling feature in this guide applies to the main process. For static asset handling of the renderer process, refer to Vite's Static Asset Handling guide.Public Directory ​The public directory defaults to <root>/resources, dedicated to the main process and preload scripts. It can be configured via the main.publicDir and preload.publicDir option.If you have assets such as icons, executables, wasm files, etc., you can put them in this directory.Note that:All assets in public directory are not copied to output directory. So when packaging the app, the public directory should be packaged together.It is recommended to use the ?asset suffix to import public assets.WarningThe public asset handling in renderers is different from the main process and preload scripts.By default, the working directory of renderers are located in src/renderer, so the public directory needs to be created in this directory. The default public directory is named public, which can also be specified by renderer.publicDir.The renderer public asset will be copied to output directory.Importing Asset as File Path ​In main process, assets can be imported as file path using the ?asset suffix:jsimport { Tray, nativeImage } from 'electron' import appIcon from '../../build/icon.ico?asset' let tray = new Tray(nativeImage.createFromPath(appIcon))In this example, appIcon will be resolved to:jsconst path = require("path"); const appIcon = path.join(__dirname, "./chunks/icon-4363016c.ico");And the build/icon.ico will be copied to output dir (out/main/chunks/icon-4363016c.ico).If appIcon place in public directory:jsimport { Tray, nativeImage } from 'electron' import appIcon from '../../resources/icon.ico?asset' let tray = new Tray(nativeImage.createFromPath(appIcon))Then appIcon will be resolved to:jsconst path = require("path"); const appIcon = path.join(__dirname, "../../resources/icon.ico");And resources/icon.ico will not be copied to output dir.Importing Json File as File Path ​When you import json file, it will be resolved to json object by Vite's json plugin. But sometimes we want to import it as file path, in this case we can use the ?commonjs-external&asset suffix to import.jsimport jsonFile from '../../resources/config.json?commonjs-external&asset'app.asar.unpacked File Path Problem ​Due to limitations of ASAR, we cannot pack all files into ASAR archives. Sometimes, this creates a problem as the path to the file changes, but your path.join(__dirname, 'binary') is not changed. To make it work you need to fix the path. Convert app.asar in path to app.asar.unpacked.You can use the ?asset&asarUnpack suffix to support this. For example:jsimport bin from '../../resources/hello.exe?asset&asarUnpack'Then bin will be resolved to:jsconst path = require("path"); const bin = path.join(__dirname, "../../resources/hello.exe").replace("app.asar", "app.asar.unpacked");Importing Native Node Modules ​There are two ways to use *.node modules.import as node modulejsimport addon from '../../resources/hello.node' console.log(addon?.hello())import as file pathjsimport addon from '../../resources/hello.node?asset' import { createRequire } from 'module' const require = createRequire(import.meta.url) const native = require(addon) console.log(native?.hello())It is important to note that native node modules usually have to be imported depending on the platform and arch. If you can ensure that the node module is generated according to the platform and arch, there will be no problem using the first import method. Otherwise, you can use the second method to import the correct node module according to the platform and arch.Importing WebAssembly ​NOTEIn Vite, .wasm files can be processed via the ?init suffix, which supports browsers but not Node.js (Electron main process).In main process, pre-compiled .wasm files can be imported with ?loader. The default export will be an initialization function that returns a Promise of the wasm instance:jsimport loadWasm from '../../resources/add.wasm?loader' loadWasm().then((instance) => { // Exported function live under instance.exports const add = instance.exports.add as (a: number, b: number) => number const sum = add(5, 6) console.log(sum); // Outputs: 11 })The init function can also take the imports object which is passed along to WebAssembly.instantiate as its second argument:jsloadWasm({ env: { memoryBase: 0, tableBase: 0, memory: new WebAssembly.Memory({ initial: 256, maximum: 512 }), table: new WebAssembly.Table({ initial: 0, maximum: 0, element: 'anyfunc' }) } }).then(() => { /* ... */ })In renderer, See Vite's WebAssembly feature for more details.Last updated: PagerPrevious pageDevelopmentNext pageHMR and Hot Reloading

```
<root>/resources
```

**Pattern 2:** On this page毫秒镜像毫秒镜像木雷坞 · MLIEVsqlite3-queriesYour LogoSource Code Protection ​Overview ​Electron applications use JavaScript to build desktop software, making them vulnerable to reverse engineering, code tampering, and unauthorized redistribution.This document presents an effective protection approach: V8 bytecode combined with ASAR integrity verification provides robust protection for Electron applications in production environments.NOTENo client-side protection is absolute. This approach significantly raises the barrier for attackers but should be combined with architectural security measures and server-side validation for comprehensive protection.Solution: V8 Bytecode + ASAR Integrity ​ASAR Integrity ​ASAR integrity is a security feature that validates the contents of your app's ASAR archives at runtime against a build-time hash to detect any tampering. If no hash is present or if there is a mismatch in the hashes, the app will forcefully terminate.Protection characteristics:Detects and prevents file tamperingBlocks unauthorized repackagingSee the ASAR integrity documentation for full information on how the feature works and how to use it in your application.NOTERequires Electron version 16+ on MacOS and 30+ on Windows.For example, enable ASAR integrity checking with electron-builder :electron-builder.yamlyamlbuild: appId: your.id # ... other configurations electronFuses: # Enable ASAR integrity validation EnableEmbeddedAsarIntegrityValidation: true # (Optional, but recommended) Ensure Electron only loads app code from app.asar OnlyLoadAppFromAsar: trueV8 Bytecode ​The vm module in Node.js standard library generates V8 bytecode cache from JavaScript source. Originally designed for performance optimization, the cached bytecode can be distributed and interpreted at runtime, effectively obscuring the original source code.Protection characteristics:High reverse engineering difficultyMaintains native performanceNo external dependencies requiredCompatible with Electron runtimeLimitations:Async arrow functions - May cause runtime crashesString literals - Sensitive strings (encryption keys, tokens, credentials) remain readable in bytecodeelectron-vite provides built-in solutions for these limitations.Implementation with electron-vite ​electron-vite inspired by bytenode. The implementation includes:Bytecode Compilation Plugin - Parses bundles and determines which chunks to compile to bytecode cachesElectron-based compilation - Launches Electron process to compile bundles into .jsc files, ensuring bytecode compatibility with Electron's Node environmentBytecode loader - Generates a runtime loader enabling Electron applications to load bytecode cachesEnhanced protection:Resolves async arrow function compatibility issuesObfuscates string literals to protect sensitive dataWarningThe Function.prototype.toString is not supported, because the source code does not follow the bytecode distribution, so the source code for the function is not available.Enabling Bytecode ​Use the build.bytecode option to enable the Bytecode feature:electron.vite.config.tsjsimport { defineConfig } from 'electron-vite' export default defineConfig({ main: { build: { bytecode: true } }, preload: { build: { bytecode: true } }, renderer: { // ... } })NOTEBefore electron-vite 5, you had to use bytecodePlugin to enable it.NOTEBytecode only works in production and supports only the main process and preload scripts.Note that preload scripts must disable the sandbox to support bytecode, as it relies on Node.js’s vm module. Since Electron 20, renderers are sandboxed by default, so you need to set sandbox: false when using bytecode for preload scripts.Options ​The build.bytecode option also accepts a BytecodeOptions object for customizing protection.bytecode.chunkAlias ​Type: string | string[]Set chunk aliases to specify which bundles the bytecode compiler should process. This is typically used with the build.rollupOptions.output.manualChunks option.For example, only protect src/main/foo.ts:txt. ├──src │ ├──main │ │ ├──index.ts │ │ ├──foo.ts │ │ └──... └──...You can modify your config file like this:electron.vite.config.tsjsimport { defineConfig } from 'electron-vite' export default defineConfig({ main: { build: { rollupOptions: { output: { manualChunks(id): string | void { if (id.includes('foo')) { return 'foo' } } } }, build: { bytecode: { chunkAlias: 'foo' } } } }, // ... })bytecode.transformArrowFunctions ​Type: booleandefault: trueSet false to disable transforming arrow functions to normal functions.NOTEArrow function transformation is implemented with Babel. Disabling this option may lead to runtime crashes.bytecode.removeBundleJS ​Type: booleandefault: trueSet false to keep bundle files which compiled as bytecode files.bytecode.protectedStrings ​Type: string[]Specify which strings (e.g., encryption keys, tokens, credentials) in the source code need to be protected.NOTEelectron-vite identifies specified strings and transforms them into IIFE functions using String.fromCharCode. Once compiled to bytecode, these strings become obfuscated and unreadable. Supports both String Literals and Template Literals (pure static only).js// string in source code const encryptKey = 'ABC' // electron-vite transforms string into an IIFE function const encryptKey = (function(){})([65, 66, 67])What are pure static template literalsjs// ✅ const foo = `-----BEGIN CERTIFICATE----- MIIDkTCCAnmgAw... ` // ❌ const zoo = `ABC ${x}`For example:electron.vite.config.tsjsimport { defineConfig } from 'electron-vite' const protectedStrings = [ 'foo', `-----BEGIN CERTIFICATE----- MIIDkTCCAnmgAwIBAgIUQt726ICGVvNVXHfzwCSwCR4 BQAwcDELMAkGA1UEBhMCQ04xDzANBgNVBAgMBll1bm5.......` ] export default defineConfig({ main: { build: { bytecode: { protectedStrings } } }, // ... })WarningYou should not enumerate all strings in source code for protection, usually we only need to protect sensitive strings.Limitations of Build ​NOTEDon’t expect that you can build app for all platforms on one platform.Our Electron application is distributed with precompiled bytecode caches. While V8 bytecode itself is architecture-agnostic, these caches are bound to specific V8 (Node.js) versions and CPU architectures (such as x64 or ARM64) due to optimization metadata (e.g., Inline Caches, Feedback Vectors, and Endianness). This prevents them from being reused across Electron builds targeting different architectures.Furthermore, although bytecode caches for the same architecture on different operating systems (such as Windows x64 and macOS x64) may appear theoretically compatible, additional validation mechanisms within V8 often make cross-platform distribution unreliable and therefore not recommended in practice.In some cases, it is possible to generate bytecode caches for a different architecture on the same platform, provided that the Electron build for the target architecture can execute under the current system. For instance, since x64 Electron binaries can run on ARM64 macOS devices, bytecode caches targeting x64 can be generated from within an ARM64 environment.To achieve this, you can specify another configuration file and set the ELECTRON_EXEC_PATH environment variable to the path of the x64 Electron app executable. The bytecode compiler will compile using the specified Electron app.electron.vite.config.x64.tsjsimport { defineConfig } from 'electron-vite' export default defineConfig(() => { process.env.ELECTRON_EXEC_PATH = '/path/to/electron-x64/Electron.app/Contents/MacOS/Electron' return { // ... } })How to install Electron for other architecturesYou can use the --arch flag with npm install to install Electron for other architectures.shnpm install --arch=ia32 electronHowever, the above approach only allows building Electron applications for one architecture at a time. If you need to produce builds for multiple architectures within a single build process, you can leverage build tool hooks — such as beforeBuild in electron-builder — to modify the ELECTRON_EXEC_PATH dynamically and invoke the electron-vite build command for each target architecture.beforeBuild.jsjsconst { execSync } = require('child_process') const os = require('os') module.exports = { async beforeBuild(context) { const targetArch = context.arch // Target architecture const hostArch = os.arch() // Current machine architecture // Only modify ELECTRON_EXEC_PATH if target architecture differs from host if (targetArch !== hostArch) { process.env.ELECTRON_EXEC_PATH = `/path/to/electron-${targetArch}/Electron.app/Contents/MacOS/Electron` } // Execute the electron-vite build via npm execSync('npm run electron-vite build', { stdio: 'inherit' }) } }Last updated: PagerPrevious pageIsolated BuildNext pageDistribution

```
electron-builder
```

**Pattern 3:** On this page毫秒镜像毫秒镜像木雷坞 · MLIEVelectron-uikitYour LogoAPI ​electron-vite's JavaScript APIs are fully typed, and it's recommended to use TypeScript or enable JS type checking in VS Code to leverage the intellisense and validation.build ​Type Signature:jsasync function build(inlineConfig: InlineConfig = {}): Promise<void>Example Usage:jsconst path = require('path') const { build } = require('electron-vite') ;(async () => { await build({ build: { outDir: 'out' rollupOptions: { // ... } } }) })()createServer ​Type Signature:jsasync function createServer(inlineConfig: InlineConfig = {}): Promise<void>Example Usage:jsconst { createServer } = require('electron-vite') ;(async () => { await createServer({ server: { port: 1337 } }) })()preview ​Type Signature:jsasync function preview(inlineConfig: InlineConfig = {}): Promise<void>Example Usage:jsconst { preview } = require('electron-vite') ;(async () => { await preview({}) })()InlineConfig ​The InlineConfig interface extends Vite UserConfig with additional properties:ignoreConfigWarning: set to false to ignore warning when config missingAnd omit base property because it is not necessary to set the base public path in Electron.resolveConfig ​Type Signature:jsasync function resolveConfig( inlineConfig: InlineConfig, command: 'build' | 'serve', defaultMode = 'development' ): Promise<ResolvedConfig>Last updated: PagerPrevious pageConfig Reference

```
build
```

**Pattern 4:** On this page毫秒镜像毫秒镜像木雷坞 · MLIEVsqlite3-queriesYour LogoTroubleshooting ​See Vite's troubleshooting guide and Rollup's troubleshooting guide for more information too.If the suggestions here don't work, please try checking the GitHub issue tracker to see if any existing issues match your problem. If you've found a bug, or electron-vite can't meet your needs, please try raising an issue or posting questions on GitHub Discussions.Skills ​Through the following steps, you can quickly identify and resolve problems:During development - Use the debugger statement or breakpoints to locate problems.Before packaging - Run the preview command to simulate the packaged environment and detect potential problems early.After packaging - Append argument --trace-warnings to your app’s launch command to view detailed error messages. For example: Windows: .\app.exe --trace-warningsmacOS: open app.app --args --trace-warningsIf the app works in preview but not after packaging - This usually indicates that some dependent modules were not included in the package. Check that all necessary modules are listed under dependencies (not devDependencies). Or it may be a pnpm problem (if it is used).Migration ​The CJS build of Vite's Node API is deprecated ​Since Vite 5, calling Vite’s CJS Node API will trigger a deprecation warning. electron-vite v2 is now published as an ESM package, so you can update to the latest version.In addition, make sure that:The electron.vite.config.js file uses ESM syntax.The nearest package.json file has "type": "module", or alternatively, rename the config file to use the .mjs extension (e.g. electron.vite.config.mjs).Note that when adding "type": "module" to your project's package.json, if Electron supports ESM (Electron 28+), it will be built as ESM. Read the ESM Support in Electron guide before migrating. But if ESM is not supported, it will be built as CommonJS and all files will have the .cjs extension.If you prefer not to make any changes and want to continue bundling as CJS, the simplest solution is to rename electron.vite.config.js to electron.vite.config.mjs.Development ​Unable to load preload scripts -> Error: module not found: 'XXX' ​From Electron 20, preload scripts are sandboxed by default and no longer have access to the full Node.js environment.You will need to either:Set sandbox: false in the BrowserWindow options.Fully bundle all dependencies into a single preload script (since sandboxed scripts cannot require multiple separate files).Related: Limitations of SandboxingRelated: Fully BundlingRelated: Isolated BuildUncaught Error: Module "XXX" has been externalized for browser compatibility. or Uncaught ReferenceError: __dirname is not defined ​You should not use Node.js modules in renderer processes. electron-vite also does not support nodeIntegration.Related: nodeIntegrationRelated: Module externalized for browser compatibilityBuild ​Error [ERR_REQUIRE_ESM]: require() of ES Module ​This happens because many libraries (e.g. lowdb, execa, node-fetch) are distributed only as ES modules and therefore cannot be required from CJS code.There are two ways to resolve this issue:Switch to ESM — electron-vite provides excellent support for ESM and makes migration straightforward.Bundle ESM libraries as CJS — configure electron-vite to bundle these ESM-only dependencies so they can be used in a CJS environment.electron.vite.config.jsjsimport { defineConfig } from 'electron-vite' export default defineConfig({ main: { build: { externalizeDeps: { exclude: ['foo'] // <- Add related modules to 'exclude' option } } }, // ... })Related issue: #35vue-router or react-router-dom works in development but not production ​Electron does not manage browser history and instead relies on a synchronized URL. Therefore, only a hash-based router will work properly in production.For vue-router, use createWebHashHistory instead of createWebHistory.For react-router-dom, use HashRouter instead of BrowserRouter.When using a hash router, you can specify the hash value in the second argument of BrowserWindow.loadFile to load the corresponding page.jswin.loadFile(path.join(import.meta.dirname, '../renderer/index.html'), { hash: 'home' })Distribution ​A JavaScript error occurred in the main process -> Error: Cannot find module 'XXX' ​This error usually occurs because dependent modules are not included in the packaged application. To resolve this issue:Check dependencies:If the missing module is listed under devDependencies, reinstall it under dependencies instead. Packaging tools (such as electron-builder or electron-forge) typically exclude modules in devDependencies.For pnpm users:You can add a file named .npmrc with shamefully-hoist=true in your project root directory (in order for your dependencies to be bundled correctly). Then delete node_modules and pnpm-lock.yaml, and reinstall your dependencies. Alternatively, you can switch to another package manager (e.g. npm or yarn) to avoid this issue.A JavaScript error occurred in the main process -> Error: Invaild or incompatible cached data (cachedDataRejected) ​This issue occurs when build.bytecode is enabled.To prevent this runtime error, you need to compile the bytecode cache for the target platform and architecture.See the Limitations of Build section in the Source Code Protection guide for details.Last updated: PagerPrevious pageDebuggingNext pageMigration from v4

```
debugger
```

**Pattern 5:** On this page毫秒镜像毫秒镜像木雷坞 · MLIEVelectron-confYour LogoIsolated Build experimental ​Rationale ​When developing with multiple entry points (including dynamic ones), we may encounter the following needs or challenges:Outputting as a single fileEnsuring more efficient tree-shaking to avoid importing unnecessary modules (which often requires refactoring or duplicating code to address this issue)Avoiding the generation of excessive chunks to improve loading performanceIn Rollup, you can export an array from your config file to build bundles for multiple unrelated inputs at once, for example:rollup.config.jsjsexport default [ { input: 'main-a.js', output: { file: 'dist/bundle-a.js', format: 'cjs' } }, { input: 'main-b.js', output: { file: 'dist/bundle-b.js', format: 'cjs' } } ]In electron-vite, a similar multi-entry approach is possible. However, we introduced the build.isolatedEntries option to simplify configuration and reduce the developer’s workload. It provides the following features:Automatic isolation of multiple entries: No need to configure each entry manually.Intelligent handling of shared chunks and assets output: Automatically manages shared dependencies to avoid duplicate bundling or conflicts.Scenarios for Isolated Build ​In main process development, modules imported via ?modulePath have isolated builds enabled by default in v5. This behavior aligns with developers’ expectations and is particularly useful in multi-threading development scenarios, requiring no additional configuration.In preload script development, if there are multiple entry points with shared imports, enabling isolated builds is necessary. This is a prerequisite for supporting the Electron sandbox (allowing output as a single bundle). Typically, you may also need to disable build.externalizeDeps to enable full bundling.electron.vite.config.tsjsimport { defineConfig } from 'electron-vite' export default defineConfig({ // ... preload: { build: { rollupOptions: { input: { index: resolve(__dirname, 'src/preload/index.ts'), test: resolve(__dirname, 'src/preload/test.ts') } }, isolatedEntries: true， externalizeDeps: false } }, // ... })In renderer process development, when there are multiple entry points, enabling isolated builds can reduce the number of generated chunks, thereby improving rendering performance.electron.vite.config.jsjsimport { defineConfig } from 'electron-vite' export default defineConfig({ // ... renderer: { build: { rollupOptions: { input: { index: resolve(__dirname, 'src/renderer/index.html'), test: resolve(__dirname, 'src/renderer/test.html') } }, isolatedEntries: true } }, // ... })Summary ​When there are many entry points, enabling isolated build will reduce build speed (within an acceptable range). However, this trade-off is well worth it, as isolated build not only significantly improves application performance and security, but also reduces development complexity and increases developer productivity.Last updated: PagerPrevious pageDependency HandlingNext pageSource Code Protection

```
export default [
  {
    input: 'main-a.js',
    output: {
      file: 'dist/bundle-a.js',
      format: 'cjs'
    }
  },
  {
    input: 'main-b.js',
    output: {
      file: 'dist/bundle-b.js',
      format: 'cjs'
    }
  }
]
```

### Example Code Patterns

**Example 1** (jsx):
```jsx
/// <reference types="electron-vite/node" />
```

**Example 2** (jsx):
```jsx
/// <reference types="electron-vite/node" />
```

**Example 3** (swift):
```swift
import { Tray, nativeImage } from 'electron'
import appIcon from '../../build/icon.ico?asset'

let tray = new Tray(nativeImage.createFromPath(appIcon))
```

**Example 4** (swift):
```swift
import { Tray, nativeImage } from 'electron'
import appIcon from '../../build/icon.ico?asset'

let tray = new Tray(nativeImage.createFromPath(appIcon))
```

**Example 5** (csharp):
```csharp
├──out/
│  ├──main
│  ├──preload
│  └──renderer
└──...
```

## Reference Files

This skill includes comprehensive documentation in `references/`:

- **advanced.md** - Advanced documentation
- **api.md** - Api documentation
- **assets.md** - Assets documentation
- **building.md** - Building documentation
- **config.md** - Config documentation
- **development.md** - Development documentation
- **getting_started.md** - Getting Started documentation
- **other.md** - Other documentation

Use `view` to read specific reference files when detailed information is needed.

## Working with This Skill

### For Beginners
Start with the getting_started or tutorials reference files for foundational concepts.

### For Specific Features
Use the appropriate category reference file (api, guides, etc.) for detailed information.

### For Code Examples
The quick reference section above contains common patterns extracted from the official docs.

## Resources

### references/
Organized documentation extracted from official sources. These files contain:
- Detailed explanations
- Code examples with language annotations
- Links to original documentation
- Table of contents for quick navigation

### scripts/
Add helper scripts here for common automation tasks.

### assets/
Add templates, boilerplate, or example projects here.

## Notes

- This skill was automatically generated from official documentation
- Reference files preserve the structure and examples from source docs
- Code examples include language detection for better syntax highlighting
- Quick reference patterns are extracted from common usage examples in the docs

## Updating

To refresh this skill with updated documentation:
1. Re-run the scraper with the same configuration
2. The skill will be rebuilt with the latest information
