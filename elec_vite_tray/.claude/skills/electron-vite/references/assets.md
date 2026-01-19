# Electron-Vite - Assets

**Pages:** 1

---

## Asset Handling ​

**URL:** https://electron-vite.org/guide/assets

**Contents:**
    - 毫秒镜像
    - electron-uikit
- Asset Handling ​
- Public Directory ​
- Importing Asset as File Path ​
  - Importing Json File as File Path ​
  - app.asar.unpacked File Path Problem ​
- Importing Native Node Modules ​
- Importing WebAssembly ​

The asset handling feature in this guide applies to the main process. For static asset handling of the renderer process, refer to Vite's Static Asset Handling guide.

The public directory defaults to <root>/resources, dedicated to the main process and preload scripts. It can be configured via the main.publicDir and preload.publicDir option.

If you have assets such as icons, executables, wasm files, etc., you can put them in this directory.

The public asset handling in renderers is different from the main process and preload scripts.

In main process, assets can be imported as file path using the ?asset suffix:

In this example, appIcon will be resolved to:

And the build/icon.ico will be copied to output dir (out/main/chunks/icon-4363016c.ico).

If appIcon place in public directory:

Then appIcon will be resolved to:

And resources/icon.ico will not be copied to output dir.

When you import json file, it will be resolved to json object by Vite's json plugin. But sometimes we want to import it as file path, in this case we can use the ?commonjs-external&asset suffix to import.

Due to limitations of ASAR, we cannot pack all files into ASAR archives. Sometimes, this creates a problem as the path to the file changes, but your path.join(__dirname, 'binary') is not changed. To make it work you need to fix the path. Convert app.asar in path to app.asar.unpacked.

You can use the ?asset&asarUnpack suffix to support this. For example:

Then bin will be resolved to:

There are two ways to use *.node modules.

It is important to note that native node modules usually have to be imported depending on the platform and arch. If you can ensure that the node module is generated according to the platform and arch, there will be no problem using the first import method. Otherwise, you can use the second method to import the correct node module according to the platform and arch.

In Vite, .wasm files can be processed via the ?init suffix, which supports browsers but not Node.js (Electron main process).

In main process, pre-compiled .wasm files can be imported with ?loader. The default export will be an initialization function that returns a Promise of the wasm instance:

The init function can also take the imports object which is passed along to WebAssembly.instantiate as its second argument:

In renderer, See Vite's WebAssembly feature for more details.

**Examples:**

Example 1 (swift):
```swift
import { Tray, nativeImage } from 'electron'
import appIcon from '../../build/icon.ico?asset'

let tray = new Tray(nativeImage.createFromPath(appIcon))
```

Example 2 (swift):
```swift
import { Tray, nativeImage } from 'electron'
import appIcon from '../../build/icon.ico?asset'

let tray = new Tray(nativeImage.createFromPath(appIcon))
```

Example 3 (javascript):
```javascript
const path = require("path");
const appIcon = path.join(__dirname, "./chunks/icon-4363016c.ico");
```

Example 4 (javascript):
```javascript
const path = require("path");
const appIcon = path.join(__dirname, "./chunks/icon-4363016c.ico");
```

---
