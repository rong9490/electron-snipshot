# Electron-Vite - Getting Started

**Pages:** 2

---

## Getting Started ​

**URL:** https://electron-vite.org/guide/

**Contents:**
    - 毫秒镜像
    - sqlite3-queries
- Getting Started ​
- Overview ​
- Installation ​
- Command Line Interface ​
- Configuring electron-vite ​
- Electron entry point ​
- Scaffolding Your First electron-vite Project ​
- Clone Template ​

This guide assumes that you are familiar with Electron and Vite. A good way to start learning more is to read the Electron Guide, and Vite Guide.

electron-vite is a build tool that aims to provide a faster and leaner development experience for Electron. It provides:

A build command that bundles your code with Vite while seamlessly handling Electron's dual environment (Node.js and browser contexts).

Provides a single configuration point for the main process, renderer processes, and preload scripts, with sensible defaults optimized for Electron.

Features instant Hot Module Replacement(HMR) for renderer processes, plus hot reloading support for the main process and preload scripts.

Advanced development capabilities including multi-threading support via simple import suffixes, optimized asset handling for the main process, isolated build mode for enhanced sandbox support, and V8 bytecode compilation to protect source code.

electron-vite is fast, simple and powerful, designed to work out-of-the-box.

Requires Node.js version 20.19+, 22.12+ and Vite version 5.0+

In a project where electron-vite is installed, you can use electron-vite binary directly with npx electron-vite or add the npm scripts to your package.json file like this:

You can specify additional CLI options like --outDir. For a full list of CLI options, run npx electron-vite -h in your project.

Learn more about Command Line Interface.

When running electron-vite from the command line, electron-vite will automatically try to resolve a config file named electron.vite.config.js inside project root. The most basic config file looks like this:

Learn more about Config Reference.

When using electron-vite to bundle your code, the entry point of the Electron application should be changed to the main process entry file in the output directory. The default outDir is out. Your package.json file should look something like this:

Electron's working directory will be the output directory, not your source code directory. So you can exclude the source code when packaging Electron application.

Learn more about Build for production.

Run the following command in your command line:

Then follow the prompts!

You can also directly specify the project name and the template you want to use via additional command line options. For example, to scaffold an Electron + Vue project, run:

Currently supported template presets include:

See create-electron for more details.

create-electron is a tool to quickly start a project from a basic template for popular frameworks. Also you can use a tool like degit to scaffold your project with the template electron-vite-boilerplate.

If you suspect you're running into a bug with the electron-vite, please check the GitHub issue tracker to see if any existing issues match your problem. If not, feel free to fill the bug report template and submit a new issue.

**Examples:**

Example 1 (unknown):
```unknown
npm i electron-vite -D
```

Example 2 (unknown):
```unknown
npm i electron-vite -D
```

Example 3 (json):
```json
{
  "scripts": {
    "start": "electron-vite preview", // start electron app to preview production build
    "dev": "electron-vite dev", // start dev server and electron app
    "prebuild": "electron-vite build" // build for production
  }
}
```

Example 4 (json):
```json
{
  "scripts": {
    "start": "electron-vite preview", // start electron app to preview production build
    "dev": "electron-vite dev", // start dev server and electron app
    "prebuild": "electron-vite build" // build for production
  }
}
```

---

## Command Line Interface ​

**URL:** https://electron-vite.org/guide/cli

**Contents:**
    - 毫秒镜像
    - sqlite3-queries
- Command Line Interface ​
- electron-vite ​
- electron-vite preview ​
- electron-vite build ​
- Options ​
  - Universal Options ​
  - Dev Options ​
  - Preview Options ​

Aliases: electron-vite dev, electron-vite serve.

The command will build the main process and preload scripts source code, and start a dev server for the renderer, and finally start the Electron app.

The command will build the main process, preload scripts and renderer source code, and start the Electron app to preview.

The command will build the main process, preload scripts and renderer source code. Usually before packaging the Electron application, you need to execute this command.

The --ignoreConfigWarning option allows you to ignore warnings when config missing. For example, do not use preload scripts.

The --inspect option allows you to enable V8 inspector on the specified port. An external debugger can connect on this port. See V8 Inspector for more details.

The --inspectBrk option like --inspect option but pauses execution on the first line of JavaScript.

The --remoteDebuggingPort option is used for debugging with IDEs.

The --noSandbox option will force Electron run without sandboxing. It is commonly used to enable Electron to run as root on Linux.

The --rendererOnly option is only used for dev command to skip the main process and preload scripts builds, and start dev server for renderer only. This option will greatly increase dev command speed.

When using the --rendererOnly option, the electron-vite command must be run at least once. In addition, you need to use it without changing the main process and preload scripts source code.

The --noSandbox option will force Electron run without sandboxing. It is commonly used to enable Electron to run as root on Linux.

The --skipBuild option is only used for preview command to skip build and start the Electron app to preview.

---
