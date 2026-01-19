# Electron-Vite - Building

**Pages:** 2

---

## Source Code Protection ​

**URL:** https://electron-vite.org/guide/source-code-protection

**Contents:**
    - 毫秒镜像
    - sqlite3-queries
- Source Code Protection ​
- Overview ​
- Solution: V8 Bytecode + ASAR Integrity ​
  - ASAR Integrity ​
  - V8 Bytecode ​
- Implementation with electron-vite ​
- Enabling Bytecode ​
- Options ​

Electron applications use JavaScript to build desktop software, making them vulnerable to reverse engineering, code tampering, and unauthorized redistribution.

This document presents an effective protection approach: V8 bytecode combined with ASAR integrity verification provides robust protection for Electron applications in production environments.

No client-side protection is absolute. This approach significantly raises the barrier for attackers but should be combined with architectural security measures and server-side validation for comprehensive protection.

ASAR integrity is a security feature that validates the contents of your app's ASAR archives at runtime against a build-time hash to detect any tampering. If no hash is present or if there is a mismatch in the hashes, the app will forcefully terminate.

Protection characteristics:

See the ASAR integrity documentation for full information on how the feature works and how to use it in your application.

Requires Electron version 16+ on MacOS and 30+ on Windows.

For example, enable ASAR integrity checking with electron-builder :

The vm module in Node.js standard library generates V8 bytecode cache from JavaScript source. Originally designed for performance optimization, the cached bytecode can be distributed and interpreted at runtime, effectively obscuring the original source code.

Protection characteristics:

electron-vite provides built-in solutions for these limitations.

electron-vite inspired by bytenode. The implementation includes:

Bytecode Compilation Plugin - Parses bundles and determines which chunks to compile to bytecode caches

Electron-based compilation - Launches Electron process to compile bundles into .jsc files, ensuring bytecode compatibility with Electron's Node environment

Bytecode loader - Generates a runtime loader enabling Electron applications to load bytecode caches

The Function.prototype.toString is not supported, because the source code does not follow the bytecode distribution, so the source code for the function is not available.

Use the build.bytecode option to enable the Bytecode feature:

Before electron-vite 5, you had to use bytecodePlugin to enable it.

Bytecode only works in production and supports only the main process and preload scripts.

Note that preload scripts must disable the sandbox to support bytecode, as it relies on Node.js’s vm module. Since Electron 20, renderers are sandboxed by default, so you need to set sandbox: false when using bytecode for preload scripts.

The build.bytecode option also accepts a BytecodeOptions object for customizing protection.

Set chunk aliases to specify which bundles the bytecode compiler should process. This is typically used with the build.rollupOptions.output.manualChunks option.

For example, only protect src/main/foo.ts:

You can modify your config file like this:

Set false to disable transforming arrow functions to normal functions.

Arrow function transformation is implemented with Babel. Disabling this option may lead to runtime crashes.

Set false to keep bundle files which compiled as bytecode files.

Specify which strings (e.g., encryption keys, tokens, credentials) in the source code need to be protected.

electron-vite identifies specified strings and transforms them into IIFE functions using String.fromCharCode. Once compiled to bytecode, these strings become obfuscated and unreadable. Supports both String Literals and Template Literals (pure static only).

You should not enumerate all strings in source code for protection, usually we only need to protect sensitive strings.

Don’t expect that you can build app for all platforms on one platform.

Our Electron application is distributed with precompiled bytecode caches. While V8 bytecode itself is architecture-agnostic, these caches are bound to specific V8 (Node.js) versions and CPU architectures (such as x64 or ARM64) due to optimization metadata (e.g., Inline Caches, Feedback Vectors, and Endianness). This prevents them from being reused across Electron builds targeting different architectures.

Furthermore, although bytecode caches for the same architecture on different operating systems (such as Windows x64 and macOS x64) may appear theoretically compatible, additional validation mechanisms within V8 often make cross-platform distribution unreliable and therefore not recommended in practice.

In some cases, it is possible to generate bytecode caches for a different architecture on the same platform, provided that the Electron build for the target architecture can execute under the current system. For instance, since x64 Electron binaries can run on ARM64 macOS devices, bytecode caches targeting x64 can be generated from within an ARM64 environment.

To achieve this, you can specify another configuration file and set the ELECTRON_EXEC_PATH environment variable to the path of the x64 Electron app executable. The bytecode compiler will compile using the specified Electron app.

You can use the --arch flag with npm install to install Electron for other architectures.

However, the above approach only allows building Electron applications for one architecture at a time. If you need to produce builds for multiple architectures within a single build process, you can leverage build tool hooks — such as beforeBuild in electron-builder — to modify the ELECTRON_EXEC_PATH dynamically and invoke the electron-vite build command for each target architecture.

**Examples:**

Example 1 (yaml):
```yaml
build:
  appId: your.id
  # ... other configurations
  electronFuses:
    # Enable ASAR integrity validation
    EnableEmbeddedAsarIntegrityValidation: true
    # (Optional, but recommended) Ensure Electron only loads app code from app.asar
    OnlyLoadAppFromAsar: true
```

Example 2 (yaml):
```yaml
build:
  appId: your.id
  # ... other configurations
  electronFuses:
    # Enable ASAR integrity validation
    EnableEmbeddedAsarIntegrityValidation: true
    # (Optional, but recommended) Ensure Electron only loads app code from app.asar
    OnlyLoadAppFromAsar: true
```

Example 3 (csharp):
```csharp
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    build: {
      bytecode: true
    }
  },
  preload: {
    build: {
      bytecode: true
    }
  },
  renderer: {
    // ...
  }
})
```

Example 4 (csharp):
```csharp
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    build: {
      bytecode: true
    }
  },
  preload: {
    build: {
      bytecode: true
    }
  },
  renderer: {
    // ...
  }
})
```

---

## Building for Production ​

**URL:** https://electron-vite.org/guide/build

**Contents:**
    - 毫秒镜像
    - electron-conf
- Building for Production ​
- Output Dir ​
- Customizing the Build ​
- Chunking Strategy ​
- Dependency Handling ​
- Isolated Build ​
- Source Code Protection ​

When it is time to package your Electron app for production, usually need to run the electron-vite build command first.

By default, the build output will be placed at out (relative to project root).

You can specify it via a command line flag, e.g. electron-vite dev/build/preview --outDir=dist.

In addition, you can also use build.outDir option to specify the output directory of the main process, renderer and preload scripts.

It is recommended to place all bundled code in a single directory, as all of it is required for the Electron app to run. This also makes it easier to exclude source code when packaging the app, reducing the package size.

The build can be customized via various build config options. Specifically, you can directly adjust the underlying Rollup options via build.rollupOptions:

An effective chunking strategy is crucial for optimizing the performance of of an Electron app.

Chunk splitting can be configured via build.rollupOptions.output.manualChunks (see Rollup docs).

See Dependency Handling.

See Source Code Protection.

**Examples:**

Example 1 (csharp):
```csharp
├──out/
│  ├──main
│  ├──preload
│  └──renderer
└──...
```

Example 2 (csharp):
```csharp
├──out/
│  ├──main
│  ├──preload
│  └──renderer
└──...
```

Example 3 (csharp):
```csharp
export default defineConfig({
  main: {
    build: {
      outDir: 'dist/main'
    }
  },
  preload: {
    build: {
      outDir: 'dist/preload'
    }
  },
  renderer: {
    build: {
      outDir: 'dist/renderer'
    }
  }
})
```

Example 4 (csharp):
```csharp
export default defineConfig({
  main: {
    build: {
      outDir: 'dist/main'
    }
  },
  preload: {
    build: {
      outDir: 'dist/preload'
    }
  },
  renderer: {
    build: {
      outDir: 'dist/renderer'
    }
  }
})
```

---
