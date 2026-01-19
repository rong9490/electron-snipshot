# Electron-Vite - Config

**Pages:** 3

---

## Configuring electron-vite ​

**URL:** https://electron-vite.org/config/

**Contents:**
    - 毫秒镜像
    - sqlite3-queries
- Configuring electron-vite ​
- Config File ​
- Config Intellisense ​
- Conditional Config ​
- Environment Variables ​
- Built-in Config ​
  - Built-in Config for main: ​
  - Built-in Config for preload: ​

When running electron-vite from the command line, electron-vite will automatically try to resolve a config file named electron.vite.config.js inside project root. The most basic config file looks like this:

You can also explicitly specify a config file to use with the --config CLI option (resolved relative to cwd):

electron-vite also supports config files suffixed with .ts, .mjs, .cjs, .mts and .cts.

Since electron-vite ships with TypeScript typings, you can leverage your IDE's intellisense with jsdoc type hints:

Alternatively, you can use the defineConfig helper which should provide intellisense without the need for jsdoc annotations:

If the config needs to conditionally determine options based on the command (dev/serve or build), the mode (development or production) being used, it can export a function instead:

Note that electron-vite doesn't load .env files by default as the files to load can only be determined after evaluating the electron-vite config. However, you can use the exported loadEnv helper to load the specific .env file if needed.

**Examples:**

Example 1 (csharp):
```csharp
export default {
  main: {
    // vite config options
  },
  preload: {
    // vite config options
  },
  renderer: {
    // vite config options
  }
}
```

Example 2 (csharp):
```csharp
export default {
  main: {
    // vite config options
  },
  preload: {
    // vite config options
  },
  renderer: {
    // vite config options
  }
}
```

Example 3 (unknown):
```unknown
electron-vite --config my-config.js
```

Example 4 (unknown):
```unknown
electron-vite --config my-config.js
```

---

## Migration from v4 ​

**URL:** https://electron-vite.org/guide/migration

**Contents:**
    - 毫秒镜像
    - sqlite3-queries
- Migration from v4 ​
- General Changes ​
  - Deprecation of externalizeDepsPlugin ​
  - Deprecation of bytecodePlugin ​
- Configuration Changes ​
  - remove function resolution for nested config fields ​

The externalizeDepsPlugin is deprecated. In v5, you can use build.externalizeDeps to customize this behavior. This feature is enabled by default, so you no longer need to import the plugin.

The bytecodePlugin is deprecated. In v5, you can use build.bytecode to enable or customize this feature.

In v5, function-based configuration is no longer supported for nested config fields such as main, preload, or renderer. Instead, you should directly define static configuration objects.

**Examples:**

Example 1 (sql):
```sql
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()] 
  },
  preload: {
    plugins: [externalizeDepsPlugin()] 
  }
  // ...
})
```

Example 2 (sql):
```sql
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()] 
  },
  preload: {
    plugins: [externalizeDepsPlugin()] 
  }
  // ...
})
```

Example 3 (sql):
```sql
import { defineConfig, bytecodePlugin } from 'electron-vite'
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [bytecodePlugin()] 
    build: { 
      bytecode: true
    } 
  },
  preload: {
    plugins: [bytecodePlugin()] 
    build: { 
      bytecode: true
    } 
  },
  // ...
})
```

Example 4 (sql):
```sql
import { defineConfig, bytecodePlugin } from 'electron-vite'
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [bytecodePlugin()] 
    build: { 
      bytecode: true
    } 
  },
  preload: {
    plugins: [bytecodePlugin()] 
    build: { 
      bytecode: true
    } 
  },
  // ...
})
```

---

## Debugging ​

**URL:** https://electron-vite.org/guide/debugging

**Contents:**
    - 毫秒镜像
    - sqlite3-queries
- Debugging ​
- VSCode ​
- WebStorm ​
- V8 Inspector, e.g. Chrome DevTools ​

electron-vite supports debugging both the main process and the renderer process code.

When you customize the build output directory via the --outDir CLI argument, the debugger configuration should also add this argument. But this is not needed when customizing via build.outDir of the configuration file.

Add a file .vscode/launch.json with the following configuration:

Then set some breakpoints in (main process or renderer process) source code. And go to the Debug view and ensure Debug All is selected. You can then press F5 to start debugging.

You can also choose Debug Main Process to only debug the main process. Since renderer debugging can only be attached, so it is not possible to debug renderer alone.

Create a Npm run configuration. Use the following settings for main process debugging:

Also Create a Attach to Node.js/Chrome run configuration. Use the following settings for renderer process debugging:

Then run these configuration in debug mode.

electron-vite also supports debugging without IDEs. Use one of the following commands to launch electron-vite.

Once electron-vite starts, you can use Chrome DevTools for this by opening chrome://inspect on browser and connecting to V8 inspector.

If you want to debug the source code instead of the bundled code, you should append the --sourcemap option.

**Examples:**

Example 1 (json):
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Main Process",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceRoot}",
      "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/electron-vite",
      "windows": {
        "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/electron-vite.cmd"
      },
      "runtimeArgs": ["--sourcemap"],
      "env": {
        "REMOTE_DEBUGGING_PORT": "9222"
      }
    },
    {
      "name": "Debug Renderer Process",
      "port": 9222,
      "request": "attach",
      "type": "chrome",
      "webRoot": "${workspaceFolder}/src/renderer",
      "timeout": 60000,
      "presentation": {
        "hidden": true
      }
    }
  ],
  "compounds": [
    {
      "name": "Debug All",
      "configurations": ["Debug Main Process", "Debug Renderer Process"],
      "presentation": {
        "order": 1
      }
    }
  ]
}
```

Example 2 (json):
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Main Process",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceRoot}",
      "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/electron-vite",
      "windows": {
        "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/electron-vite.cmd"
      },
      "runtimeArgs": ["--sourcemap"],
      "env": {
        "REMOTE_DEBUGGING_PORT": "9222"
      }
    },
    {
      "name": "Debug Renderer Process",
      "port": 9222,
      "request": "attach",
      "type": "chrome",
      "webRoot": "${workspaceFolder}/src/renderer",
      "timeout": 60000,
      "presentation": {
        "hidden": true
      }
    }
  ],
  "compounds": [
    {
      "name": "Debug All",
      "configurations": ["Debug Main Process", "Debug Renderer Process"],
      "presentation": {
        "order": 1
      }
    }
  ]
}
```

Example 3 (markdown):
```markdown
# Electron will listen for V8 inspector.
electron-vite --inspect --sourcemap

# Like --inspect but pauses execution on the first line of JavaScript.
electron-vite --inspect-brk --sourcemap
```

Example 4 (markdown):
```markdown
# Electron will listen for V8 inspector.
electron-vite --inspect --sourcemap

# Like --inspect but pauses execution on the first line of JavaScript.
electron-vite --inspect-brk --sourcemap
```

---
