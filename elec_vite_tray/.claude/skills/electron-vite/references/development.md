# Electron-Vite - Development

**Pages:** 4

---

## Development ​

**URL:** https://electron-vite.org/guide/dev

**Contents:**
    - 毫秒镜像
    - electron-uikit
- Development ​
- Project Structure ​
  - Conventions ​
  - Customizing ​
- Using Preload Scripts ​
  - Example ​
  - Limitations of Sandboxing ​
  - Toolkit ​

It is recommended to use the following project structure:

With this convention, electron-vite can work with minimal configuration.

When running electron-vite, it will automatically find the main process, preload script and renderer entry ponits. The default entry points：

It will throw an error if the entry points cannot be found. You can fix it by setting the build.rollupOptions.input option.

See the example in the next section.

Even though we strongly recommend the project structure above, it is not a requirement. You can configure it to meet your scenes.

Suppose you have the following project structure:

Your electron.vite.config.ts should be:

By default, the renderer's working directory is located in src/renderer. In this example, the renderer root option should be set to '.'.

Preload scripts are injected before a web page loads in the renderer. To add features to your renderer that require privileged access, you can define global objects through the contextBridge API.

The role of preload scripts:

Learn more about preload scripts.

Create a preload script to expose functions and variables into renderer via contextBridge.exposeInMainWorld.

To attach this script to your renderer process, pass its path to the webPreferences.preload option in the BrowserWindow constructor.

Use exposed functions and variables in the renderer process.

From Electron 20 onwards, preload scripts are sandboxed by default and no longer have access to a full Node.js environment. Practically, this means that you have a polyfilled require function (similar to Node's require module) that only has access to a limited set of APIs.

In sandbox mode, if you require or import other modules in a preload script, you may encounter the following error:

Unable to load preload scripts -> Error: module not found: 'foo'

To handle dependencies correctly, you have two options:

Fully bundle dependencies with electron-vite

Include all required modules in the build output so that preload scripts can access them at runtime. For more information, refer to the Dependency Handling and Isolated Build sections.

In Electron, renderer sandboxing can be disabled on a per-process basis with the sandbox: false preference in the BrowserWindow constructor.

Learn more about Electron Process Sandboxing.

For development efficiency, it is recommended to use @electron-toolkit/preload. It provides an easy way to expose Electron APIs (ipcRenderer, webFrame, process) to the renderer process.

First, use contextBridge to expose Electron APIs into renderer only if context isolation is enabled, otherwise just add to the DOM global. Then, use the Electron APIs directly in the renderer process.

Learn more about @electron-toolkit/preload.

The safest way is to use a helper function to wrap the ipcRenderer call rather than expose the ipcRenderer module directly via context bridge.

The easiest way to attach a preload script to a webview is through the webContents will-attach-webview event handler.

electron-vite does not support nodeIntegration. We recommend using preload scripts and avoiding Node.js modules in the renderer, which is the best practice adopted by most popular Electron applications. If you do need to use this feature, you must manually add polyfills for support (e.g., using plugins like vite-plugin-commonjs-externals).

When your electron app has multiple windows, it means there are multiple html files or preload files. You can modify your config file like this:

How to Load Multi-Page

Check out the Using HMR section for more details.

You can append a -- after the electron-vite CLI with the arguments to be passed.

electron-vite already supports --inspect, --inspect-brk, --remote-debugging-port and --no-sandbox commands, so you don't need to do this for these commands. See Command Line Interface for more details.

All arguments after the double-dash will be passed to Electron application, and you can use process.argv to handle them.

A node worker can be directly imported by appending ?modulePath or ?nodeWorker to the import request.

electron-vite supports using Electron UtilityProcess API or Node.js child_process to fork a child process. The child process can be imported with ?modulePath suffix.

Electron supports ES modules beginning in Electron 28. electron-vite 2.0 also supports using ESM to develop and build your Electron applications.

We should first know the limitations of ESM in Electron:

Learn more about ES Modules (ESM) in Electron.

There are two ways to enable ESM for electron-vite:

Adding "type": "module" to the nearest package.json.

When using this way, the main process and preload scripts will be bundled as ES module files. Note that preload script files end with the .mjs extension. You need to fix the file names that reference these preload scripts in your code.

Setting build.rollupOptions.output.format to es in config file.

When using this way, the main process and preload scripts will be bundled as ES module files and end with the .mjs extension. You need to fix the main field (Electron entry point) in package.json and the file names that reference these preload scripts in your code.

In addition, since electron-vite 2.0, you can use "type": "module" in package.json even though Electron is lower than 28. In this case, the main process and preload scripts will be bundled as CommonJS files and end with the .cjs extension.

Before this, we have been using CommonJS as the build format. We might run into some NPM packages that do not support CommonJS, but we can bundle them through electron-vite to support Electron. Similarly, when we migrate to ESM, we will also run into some problems.

Importing CommonJS Modules from ES Modules

In the above example, we will get a SyntaxError. However, it is still possible to import CommonJS modules from ES Modules by using the standard import syntax. If the module.exports object is provided as the default export or an export is defined using Object.defineProperty, the named imports will not work, but the default import will.

Differences between ES modules and CommonJS

In ESM, some important CommonJS references are not defined. These include require, require.resolve, __filename, __dirname, etc. See Node.js's Differences between ES modules and CommonJS for more details.

It is very important that electron-vite is compatible with some CommonJS syntax (include require, require.resolve, __filename, __dirname), and there is no need to fix these syntax problems during migration. However, we still recommend using ESM syntax in new projects.

electron-vite has made some compatibility with ES Modules and CommonJS syntax, allowing developers to freely switch between the two syntaxes with minimal migration work. But it should be noted that Source Code Protection currently only supports CommonJS.

**Examples:**

Example 1 (csharp):
```csharp
.
├──src
│  ├──main
│  │  ├──index.ts
│  │  └──...
│  ├──preload
│  │  ├──index.ts
│  │  └──...
│  └──renderer    # with vue, react, etc.
│     ├──src
│     ├──index.html
│     └──...
├──electron.vite.config.ts
├──package.json
└──...
```

Example 2 (csharp):
```csharp
.
├──src
│  ├──main
│  │  ├──index.ts
│  │  └──...
│  ├──preload
│  │  ├──index.ts
│  │  └──...
│  └──renderer    # with vue, react, etc.
│     ├──src
│     ├──index.html
│     └──...
├──electron.vite.config.ts
├──package.json
└──...
```

Example 3 (unknown):
```unknown
.
├──electron
│  ├──main
│  │  ├──index.ts
│  │  └──...
│  └──preload
│     ├──index.ts
│     └──...
├──src   # with vue, react, etc.
├──index.html
├──electron.vite.config.ts
├──package.json
└──...
```

Example 4 (unknown):
```unknown
.
├──electron
│  ├──main
│  │  ├──index.ts
│  │  └──...
│  └──preload
│     ├──index.ts
│     └──...
├──src   # with vue, react, etc.
├──index.html
├──electron.vite.config.ts
├──package.json
└──...
```

---

## HMR and Hot Reloading ​

**URL:** https://electron-vite.org/guide/hmr-and-hot-reloading

**Contents:**
    - 毫秒镜像
    - electron-conf
- HMR and Hot Reloading ​
- Using HMR ​
- Enabling Hot Reloading ​

In order to use HMR in the renderer process, you need to use the environment variables to determine whether the window browser loads a local html file or a local URL.

The variable ELECTRON_RENDERER_URL is the local URL where Vite is running.

For multi-page applications, you can use it like this:

For development, the renderer index.html file needs to reference your script code via <script type="module">.

For production, the BrowserWindow should load the index.html file from the output directory, not the html file of the source code.

Hot reloading refers to automatically rebuilding and restarting the Electron app whenever the main process or preload script files change. While it's not true hot reloading (which updates code without restart), it provides a similar development experience.

How electron-vite implements it:

There are two ways to enable it:

Hot reloading can only be used during development.

When to use hot reloading

Because the timing of reloading is uncontrollable, hot reloading cannot be perfectly implemented. In practice, hot reloading is not always beneficial, so it is recommended to use the CLI option to flexibly decide whether to enable or not.

**Examples:**

Example 1 (javascript):
```javascript
function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js')
    }
  })

  // Load the local URL for development or the local
  // html file for production
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}
```

Example 2 (javascript):
```javascript
function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js')
    }
  })

  // Load the local URL for development or the local
  // html file for production
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}
```

Example 3 (csharp):
```csharp
if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
  mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/view.html`)
} else {
  mainWindow.loadFile(path.join(__dirname, '../renderer/view.html'))
}
```

Example 4 (csharp):
```csharp
if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
  mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/view.html`)
} else {
  mainWindow.loadFile(path.join(__dirname, '../renderer/view.html'))
}
```

---

## TypeScript ​

**URL:** https://electron-vite.org/guide/typescript

**Contents:**
    - 毫秒镜像
    - electron-uikit
- TypeScript ​
- Type Definitions ​
- Decorators ​

If you are a TypeScript user, make sure to add a *.d.ts declaration file to get type checks and intellisense:

Also, you can add electron-vite/node to compilerOptions.types of your tsconfig:

Vite (Rollup) does not support the TypeScript feature emitDecoratorMetadata. Some packages (typeorm, sequelize-typescript, etc.) use the reflect-metadata module as a polyfill to extend object metadata. In Electron development, these libraries are commonly used, so it's necessary to support emitting type metadata for decorators.

electron-vite provides an optional swcPlugin which is powered by swc to replace Vite's code transform.

When you need to support this feature, you can modify your config file like this:

When using swcPlugin, you need to install @swc/core, because it is an optional peer dependency in electron-vite.

**Examples:**

Example 1 (jsx):
```jsx
/// <reference types="electron-vite/node" />
```

Example 2 (jsx):
```jsx
/// <reference types="electron-vite/node" />
```

Example 3 (json):
```json
{
  "compilerOptions": {
    "types": ["electron-vite/node"]
  }
}
```

Example 4 (json):
```json
{
  "compilerOptions": {
    "types": ["electron-vite/node"]
  }
}
```

---

## Isolated Build experimental ​

**URL:** https://electron-vite.org/guide/isolated-build

**Contents:**
    - 毫秒镜像
    - electron-conf
- Isolated Build experimental ​
- Rationale ​
- Scenarios for Isolated Build ​
- Summary ​

When developing with multiple entry points (including dynamic ones), we may encounter the following needs or challenges:

In Rollup, you can export an array from your config file to build bundles for multiple unrelated inputs at once, for example:

In electron-vite, a similar multi-entry approach is possible. However, we introduced the build.isolatedEntries option to simplify configuration and reduce the developer’s workload. It provides the following features:

In main process development, modules imported via ?modulePath have isolated builds enabled by default in v5. This behavior aligns with developers’ expectations and is particularly useful in multi-threading development scenarios, requiring no additional configuration.

In preload script development, if there are multiple entry points with shared imports, enabling isolated builds is necessary. This is a prerequisite for supporting the Electron sandbox (allowing output as a single bundle). Typically, you may also need to disable build.externalizeDeps to enable full bundling.

When there are many entry points, enabling isolated build will reduce build speed (within an acceptable range). However, this trade-off is well worth it, as isolated build not only significantly improves application performance and security, but also reduces development complexity and increases developer productivity.

**Examples:**

Example 1 (json):
```json
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

Example 2 (json):
```json
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

Example 3 (sql):
```sql
import { defineConfig } from 'electron-vite'

export default defineConfig({
  // ...
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.ts'),
          test: resolve(__dirname, 'src/preload/test.ts')
        }
      },
      isolatedEntries: true，
      externalizeDeps: false
    }
  },
  // ...
})
```

Example 4 (sql):
```sql
import { defineConfig } from 'electron-vite'

export default defineConfig({
  // ...
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.ts'),
          test: resolve(__dirname, 'src/preload/test.ts')
        }
      },
      isolatedEntries: true，
      externalizeDeps: false
    }
  },
  // ...
})
```

---
