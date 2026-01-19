# Electron-Vite - Api

**Pages:** 1

---

## API ​

**URL:** https://electron-vite.org/api/

**Contents:**
    - 毫秒镜像
    - electron-uikit
- API ​
- build ​
- createServer ​
- preview ​
- InlineConfig ​
- resolveConfig ​

electron-vite's JavaScript APIs are fully typed, and it's recommended to use TypeScript or enable JS type checking in VS Code to leverage the intellisense and validation.

The InlineConfig interface extends Vite UserConfig with additional properties:

And omit base property because it is not necessary to set the base public path in Electron.

**Examples:**

Example 1 (javascript):
```javascript
async function build(inlineConfig: InlineConfig = {}): Promise<void>
```

Example 2 (javascript):
```javascript
async function build(inlineConfig: InlineConfig = {}): Promise<void>
```

Example 3 (javascript):
```javascript
const path = require('path')
const { build } = require('electron-vite')

;(async () => {
  await build({
    build: {
      outDir: 'out'
      rollupOptions: {
        // ...
      }
    }
  })
})()
```

Example 4 (javascript):
```javascript
const path = require('path')
const { build } = require('electron-vite')

;(async () => {
  await build({
    build: {
      outDir: 'out'
      rollupOptions: {
        // ...
      }
    }
  })
})()
```

---
