# Electron - Getting Started

**Pages:** 71

---

## Recent Documents

**URL:** https://www.electronjs.org/docs/latest/tutorial/recent-documents

**Contents:**
- Recent Documents
- Overview​
- Example​
  - Managing recent documents​
    - Adding a recent document​
    - Clearing the list of recent documents​
    - Accessing the list of recent documents​
- Additional information​
  - Windows Notes​
  - macOS Notes​

Windows and macOS provide access to a list of recent documents opened by the application via JumpList or dock menu, respectively.

Application dock menu:

To add a file to recent documents, use the app.addRecentDocument API.

After launching the Electron application, right click the application icon. In this guide, the item is a Markdown file located in the root of the project. You should see recently-used.md added to the list of recent files:

To clear the list of recent documents, use the app.clearRecentDocuments API. In this guide, the list of documents is cleared once all windows have been closed.

To access the list of recent documents, use the app.getRecentDocuments API.

To use this feature on Windows, your application has to be registered as a handler of the file type of the document, otherwise the file won't appear in JumpList even after you have added it. You can find everything on registering your application in Application Registration.

When a user clicks a file from the JumpList, a new instance of your application will be started with the path of the file added as a command line argument.

You can add menu items to access and clear recent documents by adding the following code snippet to your menu template:

Make sure the application menu is added after the 'ready' event and not before, or the menu item will be disabled:

When a file is requested from the recent documents menu, the open-file event of app module will be emitted for it.

**Examples:**

Example 1 (javascript):
```javascript
const { app, BrowserWindow } = require('electron/main')const fs = require('node:fs')const path = require('node:path')function createWindow () {  const win = new BrowserWindow({    width: 800,    height: 600  })  win.loadFile('index.html')}const fileName = 'recently-used.md'fs.writeFile(fileName, 'Lorem Ipsum', () => {  app.addRecentDocument(path.join(__dirname, fileName))})app.whenReady().then(createWindow)app.on('window-all-closed', () => {  app.clearRecentDocuments()  if (process.platform !== 'darwin') {    app.quit()  }})app.on('activate', () => {  if (BrowserWindow.getAllWindows().length === 0) {    createWindow()  }})
```

Example 2 (html):
```html
<!DOCTYPE html><html><head>    <meta charset="UTF-8">    <title>Recent Documents</title>    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" /></head><body>    <h1>Recent Documents</h1>    <p>        Right click on the app icon to see recent documents.        You should see `recently-used.md` added to the list of recent files    </p></body></html>
```

Example 3 (json):
```json
{  "submenu":[    {      "label":"Open Recent",      "role":"recentdocuments",      "submenu":[        {          "label":"Clear Recent",          "role":"clearrecentdocuments"        }      ]    }  ]}
```

Example 4 (javascript):
```javascript
const { app, Menu } = require('electron')const template = [  // Menu template here]const menu = Menu.buildFromTemplate(template)app.whenReady().then(() => {  Menu.setApplicationMenu(menu)})
```

---

## Automated Testing

**URL:** https://www.electronjs.org/docs/latest/tutorial/automated-testing

**Contents:**
- Automated Testing
- Using the WebDriver interface​
  - With WebdriverIO​
    - Install the test runner​
    - Connect WDIO to your Electron app​
    - Write your tests​
    - Run your tests​
    - More documentation​
  - With Selenium​
    - Run a ChromeDriver server​

Test automation is an efficient way of validating that your application code works as intended. While Electron doesn't actively maintain its own testing solution, this guide will go over a couple ways you can run end-to-end automated tests on your Electron app.

From ChromeDriver - WebDriver for Chrome:

WebDriver is an open source tool for automated testing of web apps across many browsers. It provides capabilities for navigating to web pages, user input, JavaScript execution, and more. ChromeDriver is a standalone server which implements WebDriver's wire protocol for Chromium. It is being developed by members of the Chromium and WebDriver teams.

There are a few ways that you can set up testing using WebDriver.

WebdriverIO (WDIO) is a test automation framework that provides a Node.js package for testing with WebDriver. Its ecosystem also includes various plugins (e.g. reporter and services) that can help you put together your test setup.

If you already have an existing WebdriverIO setup, it is recommended to update your dependencies and validate your existing configuration with how it is outlined in the docs.

If you don't use WebdriverIO in your project yet, you can add it by running the starter toolkit in your project root directory:

This starts a configuration wizard that helps you put together the right setup, installs all necessary packages, and generates a wdio.conf.js configuration file. Make sure to select "Desktop Testing - of Electron Applications" on one of the first questions asking "What type of testing would you like to do?".

After running the configuration wizard, your wdio.conf.js should include roughly the following content:

Use the WebdriverIO API to interact with elements on the screen. The framework provides custom "matchers" that make asserting the state of your application easy, e.g.:

Furthermore, WebdriverIO allows you to access Electron APIs to get static information about your application:

WebdriverIO helps launch and shut down the application for you.

Find more documentation on Mocking Electron APIs and other useful resources in the official WebdriverIO documentation.

Selenium is a web automation framework that exposes bindings to WebDriver APIs in many languages. Their Node.js bindings are available under the selenium-webdriver package on NPM.

In order to use Selenium with Electron, you need to download the electron-chromedriver binary, and run it:

Remember the port number 9515, which will be used later.

Next, install Selenium into your project:

Usage of selenium-webdriver with Electron is the same as with normal websites, except that you have to manually specify how to connect ChromeDriver and where to find the binary of your Electron app:

Microsoft Playwright is an end-to-end testing framework built using browser-specific remote debugging protocols, similar to the Puppeteer headless Node.js API but geared towards end-to-end testing. Playwright has experimental Electron support via Electron's support for the Chrome DevTools Protocol (CDP).

You can install Playwright through your preferred Node.js package manager. It comes with its own test runner, which is built for end-to-end testing:

This tutorial was written with @playwright/test@1.52.0. Check out Playwright's releases page to learn about changes that might affect the code below.

Playwright launches your app in development mode through the _electron.launch API. To point this API to your Electron app, you can pass the path to your main process entry point (here, it is main.js).

After that, you will access to an instance of Playwright's ElectronApp class. This is a powerful class that has access to main process modules for example:

It can also create individual Page objects from Electron BrowserWindow instances. For example, to grab the first BrowserWindow and save a screenshot:

Putting all this together using the Playwright test-runner, let's create a example.spec.js test file with a single test and assertion:

Then, run Playwright Test using npx playwright test. You should see the test pass in your console, and have an intro.png screenshot on your filesystem.

Playwright Test will automatically run any files matching the .*(test|spec)\.(js|ts|mjs) regex. You can customize this match in the Playwright Test configuration options. It also works with TypeScript out of the box.

Check out Playwright's documentation for the full Electron and ElectronApplication class APIs.

It's also possible to write your own custom driver using Node.js' built-in IPC-over-STDIO. Custom test drivers require you to write additional app code, but have lower overhead and let you expose custom methods to your test suite.

To create a custom driver, we'll use Node.js' child_process API. The test suite will spawn the Electron process, then establish a simple messaging protocol:

From within the Electron app, you can listen for messages and send replies using the Node.js process API:

We can now communicate from the test suite to the Electron app using the appProcess object.

For convenience, you may want to wrap appProcess in a driver object that provides more high-level functions. Here is an example of how you can do this. Let's start by creating a TestDriver class:

In your app code, can then write a simple handler to receive RPC calls:

Then, in your test suite, you can use your TestDriver class with the test automation framework of your choosing. The following example uses ava, but other popular choices like Jest or Mocha would work as well:

**Examples:**

Example 1 (python):
```python
npm init wdio@latest ./
```

Example 2 (python):
```python
yarn create wdio@latest ./
```

Example 3 (javascript):
```javascript
export const config = {  // ...  services: ['electron'],  capabilities: [{    browserName: 'electron',    'wdio:electronServiceOptions': {      // WebdriverIO can automatically find your bundled application      // if you use Electron Forge or electron-builder, otherwise you      // can define it here, e.g.:      // appBinaryPath: './path/to/bundled/application.exe',      appArgs: ['foo', 'bar=baz']    }  }]  // ...}
```

Example 4 (javascript):
```javascript
import { browser, $, expect } from '@wdio/globals'describe('keyboard input', () => {  it('should detect keyboard input', async () => {    await browser.keys(['y', 'o'])    await expect($('keypress-count')).toHaveText('YO')  })})
```

---

## Offscreen Rendering

**URL:** https://www.electronjs.org/docs/latest/tutorial/offscreen-rendering

**Contents:**
- Offscreen Rendering
- Overview​
  - Rendering Modes​
    - GPU accelerated​
    - Software output device​
- Example​

Offscreen rendering lets you obtain the content of a BrowserWindow in a bitmap or a shared GPU texture, so it can be rendered anywhere, for example, on texture in a 3D scene. The offscreen rendering in Electron uses a similar approach to that of the Chromium Embedded Framework project.

GPU accelerated rendering means that the GPU is used for composition. The benefit of this mode is that WebGL and 3D CSS animations are supported. There are two different approaches depending on the webPreferences.offscreen.useSharedTexture setting.

Use GPU shared texture

Used when webPreferences.offscreen.useSharedTexture is set to true.

This is an advanced feature requiring a native node module to work with your own code. The frames are directly copied in GPU textures, thus this mode is very fast because there's no CPU-GPU memory copies overhead, and you can directly import the shared texture to your own rendering program. You can read more details at here.

Use CPU shared memory bitmap

Used when webPreferences.offscreen.useSharedTexture is set to false (default behavior).

The texture is accessible using the NativeImage API at the cost of performance. The frame has to be copied from the GPU to the CPU bitmap which requires more system resources, thus this mode is slower than the Software output device mode. But it supports GPU related functionalities.

This mode uses a software output device for rendering in the CPU, so the frame generation is faster than shared memory bitmap GPU accelerated mode.

To enable this mode, GPU acceleration has to be disabled by calling the app.disableHardwareAcceleration() API.

After launching the Electron application, navigate to your application's working folder, where you'll find the rendered image.

**Examples:**

Example 1 (javascript):
```javascript
const { app, BrowserWindow } = require('electron/main')const fs = require('node:fs')const path = require('node:path')app.disableHardwareAcceleration()function createWindow () {  const win = new BrowserWindow({    width: 800,    height: 600,    webPreferences: {      offscreen: true    }  })  win.loadURL('https://github.com')  win.webContents.on('paint', (event, dirty, image) => {    fs.writeFileSync('ex.png', image.toPNG())  })  win.webContents.setFrameRate(60)  console.log(`The screenshot has been successfully saved to ${path.join(process.cwd(), 'ex.png')}`)}app.whenReady().then(() => {  createWindow()  app.on('activate', () => {    if (BrowserWindow.getAllWindows().length === 0) {      createWindow()    }  })})app.on('window-all-closed', () => {  if (process.platform !== 'darwin') {    app.quit()  }})
```

---

## Notifications

**URL:** https://www.electronjs.org/docs/latest/tutorial/notifications

**Contents:**
- Notifications
- Usage​
  - Show notifications in the main process​
  - Show notifications in the renderer process​
- Platform considerations​
  - Windows​
    - Use advanced notifications​
    - Query notification state​
  - macOS​
    - Query notification state​

Each operating system has its own mechanism to display notifications to users. Electron's notification APIs are cross-platform, but are different for each process type.

If you want to use a renderer process API in the main process or vice-versa, consider using inter-process communication.

Below are two examples showing how to display notifications for each process type.

Main process notifications are displayed using Electron's Notification module. Notification objects created using this module do not appear unless their show() instance method is called.

Here's a full example that you can open with Electron Fiddle:

Notifications can be displayed directly from the renderer process with the web Notifications API.

Here's a full example that you can open with Electron Fiddle:

While code and user experience across operating systems are similar, there are subtle differences.

For notifications on Windows, your Electron app needs to have a Start Menu shortcut with an AppUserModelID and a corresponding ToastActivatorCLSID.

Electron attempts to automate the work around the AppUserModelID and ToastActivatorCLSID. When Electron is used together with Squirrel.Windows (e.g. if you're using electron-winstaller), shortcuts will automatically be set correctly.

In production, Electron will also detect that Squirrel was used and will automatically call app.setAppUserModelId() with the correct value. During development, you may have to call app.setAppUserModelId() yourself.

To quickly bootstrap notifications during development, adding node_modules\electron\dist\electron.exe to your Start Menu also does the trick. Navigate to the file in Explorer, right-click and 'Pin to Start Menu'. Then, call app.setAppUserModelId(process.execPath) in the main process to see notifications.

Windows also allow for advanced notifications with custom templates, images, and other flexible elements.

To send those notifications from the main process, you can use the userland module electron-windows-notifications, which uses native Node addons to send ToastNotification and TileNotification objects.

While notifications including buttons work with electron-windows-notifications, handling replies requires the use of electron-windows-interactive-notifications, which helps with registering the required COM components and calling your Electron app with the entered user data.

To detect whether or not you're allowed to send a notification, use the userland module windows-notification-state.

This module allows you to determine ahead of time whether or not Windows will silently throw the notification away.

Notifications are straightforward on macOS, but you should be aware of Apple's Human Interface guidelines regarding notifications.

Note that notifications are limited to 256 bytes in size and will be truncated if you exceed that limit.

To detect whether or not you're allowed to send a notification, use the userland module macos-notification-state.

This module allows you to detect ahead of time whether or not the notification will be displayed.

Notifications are sent using libnotify, which can show notifications on any desktop environment that follows Desktop Notifications Specification, including Cinnamon, Enlightenment, Unity, GNOME, and KDE.

**Examples:**

Example 1 (javascript):
```javascript
const { Notification } = require('electron')const NOTIFICATION_TITLE = 'Basic Notification'const NOTIFICATION_BODY = 'Notification from the Main process'new Notification({  title: NOTIFICATION_TITLE,  body: NOTIFICATION_BODY}).show()
```

Example 2 (javascript):
```javascript
const { app, BrowserWindow, Notification } = require('electron/main')function createWindow () {  const win = new BrowserWindow({    width: 800,    height: 600  })  win.loadFile('index.html')}const NOTIFICATION_TITLE = 'Basic Notification'const NOTIFICATION_BODY = 'Notification from the Main process'function showNotification () {  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()}app.whenReady().then(createWindow).then(showNotification)app.on('window-all-closed', () => {  if (process.platform !== 'darwin') {    app.quit()  }})app.on('activate', () => {  if (BrowserWindow.getAllWindows().length === 0) {    createWindow()  }})
```

Example 3 (html):
```html
<!DOCTYPE html><html><head>    <meta charset="UTF-8">    <title>Hello World!</title>    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" /></head><body>    <h1>Hello World!</h1>    <p>After launching this application, you should see the system notification.</p></body></html>
```

Example 4 (javascript):
```javascript
const NOTIFICATION_TITLE = 'Title'const NOTIFICATION_BODY =  'Notification from the Renderer process. Click to log to console.'const CLICK_MESSAGE = 'Notification clicked'new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY }).onclick =  () => console.log(CLICK_MESSAGE)
```

---

## Multithreading

**URL:** https://www.electronjs.org/docs/latest/tutorial/multithreading

**Contents:**
- Multithreading
- Multi-threaded Node.js​
- Available APIs​
- Native Node.js modules​

With Web Workers, it is possible to run JavaScript in OS-level threads.

It is possible to use Node.js features in Electron's Web Workers, to do so the nodeIntegrationInWorker option should be set to true in webPreferences.

The nodeIntegrationInWorker can be used independent of nodeIntegration, but sandbox must not be set to true.

This option is not available in SharedWorkers or Service Workers owing to incompatibilities in sandboxing policies.

All built-in modules of Node.js are supported in Web Workers, and asar archives can still be read with Node.js APIs. However none of Electron's built-in modules can be used in a multi-threaded environment.

Any native Node.js module can be loaded directly in Web Workers, but it is strongly recommended not to do so. Most existing native modules have been written assuming single-threaded environment, using them in Web Workers will lead to crashes and memory corruptions.

Note that even if a native Node.js module is thread-safe it's still not safe to load it in a Web Worker because the process.dlopen function is not thread safe.

The only way to load a native module safely for now, is to make sure the app loads no native modules after the Web Workers get started.

**Examples:**

Example 1 (css):
```css
const win = new BrowserWindow({  webPreferences: {    nodeIntegrationInWorker: true  }})
```

Example 2 (javascript):
```javascript
process.dlopen = () => {  throw new Error('Load native module is not safe')}const worker = new Worker('script.js')
```

---

## Process Sandboxing

**URL:** https://www.electronjs.org/docs/latest/tutorial/sandbox

**Contents:**
- Process Sandboxing
- Sandbox behavior in Electron​
  - Renderer processes​
  - Preload scripts​
- Configuring the sandbox​
  - Disabling the sandbox for a single process​
  - Enabling the sandbox globally​
  - Disabling Chromium's sandbox (testing only)​
- A note on rendering untrusted content​

One key security feature in Chromium is that processes can be executed within a sandbox. The sandbox limits the harm that malicious code can cause by limiting access to most system resources — sandboxed processes can only freely use CPU cycles and memory. In order to perform operations requiring additional privilege, sandboxed processes use dedicated communication channels to delegate tasks to more privileged processes.

In Chromium, sandboxing is applied to most processes other than the main process. This includes renderer processes, as well as utility processes such as the audio service, the GPU service and the network service.

See Chromium's Sandbox design document for more information.

Starting from Electron 20, the sandbox is enabled for renderer processes without any further configuration.

Sandboxing is tied to Node.js integration. Enabling Node.js integration for a renderer process by setting nodeIntegration: true disables the sandbox for the process.

If you want to disable the sandbox for a process, see the Disabling the sandbox for a single process section.

Sandboxed processes in Electron behave mostly in the same way as Chromium's do, but Electron has a few additional concepts to consider because it interfaces with Node.js.

When renderer processes in Electron are sandboxed, they behave in the same way as a regular Chrome renderer would. A sandboxed renderer won't have a Node.js environment initialized.

Therefore, when the sandbox is enabled, renderer processes can only perform privileged tasks (such as interacting with the filesystem, making changes to the system, or spawning subprocesses) by delegating these tasks to the main process via inter-process communication (IPC).

For more info on inter-process communication, check out our IPC guide.

In order to allow renderer processes to communicate with the main process, preload scripts attached to sandboxed renderers will still have a polyfilled subset of Node.js APIs available. A require function similar to Node's require module is exposed, but can only import a subset of Electron and Node's built-in modules:

node: imports are supported as well:

In addition, the preload script also polyfills certain Node.js primitives as globals:

Because the require function is a polyfill with limited functionality, you will not be able to use CommonJS modules to separate your preload script into multiple files. If you need to split your preload code, use a bundler such as webpack or Parcel.

Note that because the environment presented to the preload script is substantially more privileged than that of a sandboxed renderer, it is still possible to leak privileged APIs to untrusted code running in the renderer process unless contextIsolation is enabled.

For most apps, sandboxing is the best choice. In certain use cases that are incompatible with the sandbox (for instance, when using native node modules in the renderer), it is possible to disable the sandbox for specific processes. This comes with security risks, especially if any untrusted code or content is present in the unsandboxed process.

In Electron, renderer sandboxing can be disabled on a per-process basis with the sandbox: false preference in the BrowserWindow constructor.

Sandboxing is also disabled whenever Node.js integration is enabled in the renderer. This can be done through the BrowserWindow constructor with the nodeIntegration: true flag or by providing the respective HTML boolean attribute for a webview.

If you want to force sandboxing for all renderers, you can also use the app.enableSandbox API. Note that this API has to be called before the app's ready event.

You can also disable Chromium's sandbox entirely with the --no-sandbox CLI flag, which will disable the sandbox for all processes (including utility processes). We highly recommend that you only use this flag for testing purposes, and never in production.

Note that the sandbox: true option will still disable the renderer's Node.js environment.

Rendering untrusted content in Electron is still somewhat uncharted territory, though some apps are finding success (e.g. Beaker Browser). Our goal is to get as close to Chrome as we can in terms of the security of sandboxed content, but ultimately we will always be behind due to a few fundamental issues:

While we make our best effort to backport Chromium security fixes to older versions of Electron, we do not make a guarantee that every fix will be backported. Your best chance at staying secure is to be on the latest stable version of Electron.

**Examples:**

Example 1 (javascript):
```javascript
app.whenReady().then(() => {  const win = new BrowserWindow({    webPreferences: {      sandbox: false    }  })  win.loadURL('https://google.com')})
```

Example 2 (javascript):
```javascript
app.whenReady().then(() => {  const win = new BrowserWindow({    webPreferences: {      nodeIntegration: true    }  })  win.loadURL('https://google.com')})
```

Example 3 (html):
```html
<webview nodeIntegration src="page.html"></webview>
```

Example 4 (javascript):
```javascript
app.enableSandbox()app.whenReady().then(() => {  // any sandbox:false calls are overridden since `app.enableSandbox()` was called.  const win = new BrowserWindow()  win.loadURL('https://google.com')})
```

---

## Distribution Overview

**URL:** https://www.electronjs.org/docs/latest/tutorial/distribution-overview

**Contents:**
- Distribution Overview
- Packaging​
- Code signing​
- Publishing​
- Updating​

Once your app is ready for production, there are a couple steps you need to take before you can deliver it to your users.

To distribute your app with Electron, you need to package all your resources and assets into an executable and rebrand it. To do this, you can either use specialized tooling like Electron Forge or do it manually. See the Application Packaging tutorial for more information.

Code signing is a security technology that you use to certify that an app was created by you. You should sign your application so it does not trigger the security checks of your user's operating system.

To get started with each operating system's code signing process, please read the Code Signing docs.

Once your app is packaged and signed, you can freely distribute your app directly to users by uploading your installers online.

To reach more users, you can also choose to upload your app to each operating system's digital distribution platform (i.e. app store). These require another build step aside from your direct download app. For more information, check out each individual app store guide:

Electron's auto-updater allows you to deliver application updates to users without forcing them to manually download new versions of your application. Check out the Updating Applications guide for details on implementing automatic updates with Electron.

---

## Performance

**URL:** https://www.electronjs.org/docs/latest/tutorial/performance

**Contents:**
- Performance
- Measure, Measure, Measure​
  - Recommended Reading​
- Checklist: Performance recommendations​
  - 1. Carelessly including modules​
    - Why?​
    - How?​
  - 2. Loading and running code too soon​
    - Why?​
    - How?​

Developers frequently ask about strategies to optimize the performance of Electron applications. Software engineers, consumers, and framework developers do not always agree on one single definition of what "performance" means. This document outlines some of the Electron maintainers' favorite ways to reduce the amount of memory, CPU, and disk resources being used while ensuring that your app is responsive to user input and completes operations as quickly as possible. Furthermore, we want all performance strategies to maintain a high standard for your app's security.

Wisdom and information about how to build performant websites with JavaScript generally applies to Electron apps, too. To a certain extent, resources discussing how to build performant Node.js applications also apply, but be careful to understand that the term "performance" means different things for a Node.js backend than it does for an application running on a client.

This list is provided for your convenience – and is, much like our security checklist – not meant to be exhaustive. It is probably possible to build a slow Electron app that follows all the steps outlined below. Electron is a powerful development platform that enables you, the developer, to do more or less whatever you want. All that freedom means that performance is largely your responsibility.

The list below contains a number of steps that are fairly straightforward and easy to implement. However, building the most performant version of your app will require you to go beyond a number of steps. Instead, you will have to closely examine all the code running in your app by carefully profiling and measuring. Where are the bottlenecks? When the user clicks a button, what operations take up the brunt of the time? While the app is simply idling, which objects take up the most memory?

Time and time again, we have seen that the most successful strategy for building a performant Electron app is to profile the running code, find the most resource-hungry piece of it, and to optimize it. Repeating this seemingly laborious process over and over again will dramatically increase your app's performance. Experience from working with major apps like Visual Studio Code or Slack has shown that this practice is by far the most reliable strategy to improve performance.

To learn more about how to profile your app's code, familiarize yourself with the Chrome Developer Tools. For advanced analysis looking at multiple processes at once, consider the Chrome Tracing tool.

Chances are that your app could be a little leaner, faster, and generally less resource-hungry if you attempt these steps.

Before adding a Node.js module to your application, examine said module. How many dependencies does that module include? What kind of resources does it need to simply be called in a require() statement? You might find that the module with the most downloads on the NPM package registry or the most stars on GitHub is not in fact the leanest or smallest one available.

The reasoning behind this recommendation is best illustrated with a real-world example. During the early days of Electron, reliable detection of network connectivity was a problem, resulting in many apps using a module that exposed a simple isOnline() method.

That module detected your network connectivity by attempting to reach out to a number of well-known endpoints. For the list of those endpoints, it depended on a different module, which also contained a list of well-known ports. This dependency itself relied on a module containing information about ports, which came in the form of a JSON file with more than 100,000 lines of content. Whenever the module was loaded (usually in a require('module') statement), it would load all its dependencies and eventually read and parse this JSON file. Parsing many thousands lines of JSON is a very expensive operation. On a slow machine it can take up whole seconds of time.

In many server contexts, startup time is virtually irrelevant. A Node.js server that requires information about all ports is likely actually "more performant" if it loads all required information into memory whenever the server boots at the benefit of serving requests faster. The module discussed in this example is not a "bad" module. Electron apps, however, should not be loading, parsing, and storing in memory information that it does not actually need.

In short, a seemingly excellent module written primarily for Node.js servers running Linux might be bad news for your app's performance. In this particular example, the correct solution was to use no module at all, and to instead use connectivity checks included in later versions of Chromium.

When considering a module, we recommend that you check:

Generating a CPU profile and a heap memory profile for loading a module can be done with a single command on the command line. In the example below, we're looking at the popular module request.

Executing this command results in a .cpuprofile file and a .heapprofile file in the directory you executed it in. Both files can be analyzed using the Chrome Developer Tools, using the Performance and Memory tabs respectively.

In this example, on the author's machine, we saw that loading request took almost half a second, whereas node-fetch took dramatically less memory and less than 50ms.

If you have expensive setup operations, consider deferring those. Inspect all the work being executed right after the application starts. Instead of firing off all operations right away, consider staggering them in a sequence more closely aligned with the user's journey.

In traditional Node.js development, we're used to putting all our require() statements at the top. If you're currently writing your Electron application using the same strategy and are using sizable modules that you do not immediately need, apply the same strategy and defer loading to a more opportune time.

Loading modules is a surprisingly expensive operation, especially on Windows. When your app starts, it should not make users wait for operations that are currently not necessary.

This might seem obvious, but many applications tend to do a large amount of work immediately after the app has launched - like checking for updates, downloading content used in a later flow, or performing heavy disk I/O operations.

Let's consider Visual Studio Code as an example. When you open a file, it will immediately display the file to you without any code highlighting, prioritizing your ability to interact with the text. Once it has done that work, it will move on to code highlighting.

Let's consider an example and assume that your application is parsing files in the fictitious .foo format. In order to do that, it relies on the equally fictitious foo-parser module. In traditional Node.js development, you might write code that eagerly loads dependencies:

In the above example, we're doing a lot of work that's being executed as soon as the file is loaded. Do we need to get parsed files right away? Could we do this work a little later, when getParsedFiles() is actually called?

In short, allocate resources "just in time" rather than allocating them all when your app starts.

Electron's main process (sometimes called "browser process") is special: It is the parent process to all your app's other processes and the primary process the operating system interacts with. It handles windows, interactions, and the communication between various components inside your app. It also houses the UI thread.

Under no circumstances should you block this process and the UI thread with long-running operations. Blocking the UI thread means that your entire app will freeze until the main process is ready to continue processing.

The main process and its UI thread are essentially the control tower for major operations inside your app. When the operating system tells your app about a mouse click, it'll go through the main process before it reaches your window. If your window is rendering a buttery-smooth animation, it'll need to talk to the GPU process about that – once again going through the main process.

Electron and Chromium are careful to put heavy disk I/O and CPU-bound operations onto new threads to avoid blocking the UI thread. You should do the same.

Electron's powerful multi-process architecture stands ready to assist you with your long-running tasks, but also includes a small number of performance traps.

For long running CPU-heavy tasks, make use of worker threads, consider moving them to the BrowserWindow, or (as a last resort) spawn a dedicated process.

Avoid using the synchronous IPC and the @electron/remote module as much as possible. While there are legitimate use cases, it is far too easy to unknowingly block the UI thread.

Avoid using blocking I/O operations in the main process. In short, whenever core Node.js modules (like fs or child_process) offer a synchronous or an asynchronous version, you should prefer the asynchronous and non-blocking variant.

Since Electron ships with a current version of Chrome, you can make use of the latest and greatest features the Web Platform offers to defer or offload heavy operations in a way that keeps your app smooth and responsive.

Your app probably has a lot of JavaScript to run in the renderer process. The trick is to execute operations as quickly as possible without taking away resources needed to keep scrolling smooth, respond to user input, or animations at 60fps.

Orchestrating the flow of operations in your renderer's code is particularly useful if users complain about your app sometimes "stuttering".

Generally speaking, all advice for building performant web apps for modern browsers apply to Electron's renderers, too. The two primary tools at your disposal are currently requestIdleCallback() for small operations and Web Workers for long-running operations.

requestIdleCallback() allows developers to queue up a function to be executed as soon as the process is entering an idle period. It enables you to perform low-priority or background work without impacting the user experience. For more information about how to use it, check out its documentation on MDN.

Web Workers are a powerful tool to run code on a separate thread. There are some caveats to consider – consult Electron's multithreading documentation and the MDN documentation for Web Workers. They're an ideal solution for any operation that requires a lot of CPU power for an extended period of time.

One of Electron's great benefits is that you know exactly which engine will parse your JavaScript, HTML, and CSS. If you're re-purposing code that was written for the web at large, make sure to not polyfill features included in Electron.

When building a web application for today's Internet, the oldest environments dictate what features you can and cannot use. Even though Electron supports well-performing CSS filters and animations, an older browser might not. Where you could use WebGL, your developers may have chosen a more resource-hungry solution to support older phones.

When it comes to JavaScript, you may have included toolkit libraries like jQuery for DOM selectors or polyfills like the regenerator-runtime to support async/await.

It is rare for a JavaScript-based polyfill to be faster than the equivalent native feature in Electron. Do not slow down your Electron app by shipping your own version of standard web platform features.

Operate under the assumption that polyfills in current versions of Electron are unnecessary. If you have doubts, check caniuse.com and check if the version of Chromium used in your Electron version supports the feature you desire.

In addition, carefully examine the libraries you use. Are they really necessary? jQuery, for example, was such a success that many of its features are now part of the standard JavaScript feature set available.

If you're using a transpiler/compiler like TypeScript, examine its configuration and ensure that you're targeting the latest ECMAScript version supported by Electron.

Avoid fetching rarely changing resources from the internet if they could easily be bundled with your application.

Many users of Electron start with an entirely web-based app that they're turning into a desktop application. As web developers, we are used to loading resources from a variety of content delivery networks. Now that you are shipping a proper desktop application, attempt to "cut the cord" where possible and avoid letting your users wait for resources that never change and could easily be included in your app.

A typical example is Google Fonts. Many developers make use of Google's impressive collection of free fonts, which comes with a content delivery network. The pitch is straightforward: Include a few lines of CSS and Google will take care of the rest.

When building an Electron app, your users are better served if you download the fonts and include them in your app's bundle.

In an ideal world, your application wouldn't need the network to operate at all. To get there, you must understand what resources your app is downloading - and how large those resources are.

To do so, open up the developer tools. Navigate to the Network tab and check the Disable cache option. Then, reload your renderer. Unless your app prohibits such reloads, you can usually trigger a reload by hitting Cmd + R or Ctrl + R with the developer tools in focus.

The tools will now meticulously record all network requests. In a first pass, take stock of all the resources being downloaded, focusing on the larger files first. Are any of them images, fonts, or media files that don't change and could be included with your bundle? If so, include them.

As a next step, enable Network Throttling. Find the drop-down that currently reads Online and select a slower speed such as Fast 3G. Reload your renderer and see if there are any resources that your app is unnecessarily waiting for. In many cases, an app will wait for a network request to complete despite not actually needing the involved resource.

As a tip, loading resources from the Internet that you might want to change without shipping an application update is a powerful strategy. For advanced control over how resources are being loaded, consider investing in Service Workers.

As already pointed out in "Loading and running code too soon", calling require() is an expensive operation. If you are able to do so, bundle your application's code into a single file.

Modern JavaScript development usually involves many files and modules. While that's perfectly fine for developing with Electron, we heavily recommend that you bundle all your code into one single file to ensure that the overhead included in calling require() is only paid once when your application loads.

There are numerous JavaScript bundlers out there and we know better than to anger the community by recommending one tool over another. We do however recommend that you use a bundler that is able to handle Electron's unique environment that needs to handle both Node.js and browser environments.

As of writing this article, the popular choices include Webpack, Parcel, and rollup.js.

Electron will set a default menu on startup with some standard entries. But there are reasons your application might want to change that and it will benefit startup performance.

If you build your own menu or use a frameless window without native menu, you should tell Electron early enough to not setup the default menu.

Call Menu.setApplicationMenu(null) before app.on("ready"). This will prevent Electron from setting a default menu. See also https://github.com/electron/electron/issues/35512 for a related discussion.

**Examples:**

Example 1 (javascript):
```javascript
node --cpu-prof --heap-prof -e "require('request')"
```

Example 2 (javascript):
```javascript
const fs = require('node:fs')const fooParser = require('foo-parser')class Parser {  constructor () {    this.files = fs.readdirSync('.')  }  getParsedFiles () {    return fooParser.parse(this.files)  }}const parser = new Parser()module.exports = { parser }
```

Example 3 (javascript):
```javascript
// "fs" is likely already being loaded, so the `require()` call is cheapconst fs = require('node:fs')class Parser {  async getFiles () {    // Touch the disk as soon as `getFiles` is called, not sooner.    // Also, ensure that we're not blocking other operations by using    // the asynchronous version.    this.files = this.files || await fs.promises.readdir('.')    return this.files  }  async getParsedFiles () {    // Our fictitious foo-parser is a big and expensive module to load, so    // defer that work until we actually need to parse files.    // Since `require()` comes with a module cache, the `require()` call    // will only be expensive once - subsequent calls of `getParsedFiles()`    // will be faster.    const fooParser = require('foo-parser')    const files = await this.getFiles()    return fooParser.parse(files)  }}// This operation is now a lot cheaper than in our previous exampleconst parser = new Parser()module.exports = { parser }
```

---

## Prerequisites

**URL:** https://www.electronjs.org/docs/latest/tutorial/tutorial-prerequisites

**Contents:**
- Prerequisites
- Goals​
- Assumptions​
- Required tools​
  - Code editor​
  - Command line​
  - Git and GitHub​
  - Node.js and npm​

This is part 1 of the Electron tutorial. Prerequisites Building your First App Using Preload Scripts Adding Features Packaging Your Application Publishing and Updating

Electron is a framework for building desktop applications using JavaScript, HTML, and CSS. By embedding Chromium and Node.js into a single binary file, Electron allows you to create cross-platform apps that work on Windows, macOS, and Linux with a single JavaScript codebase.

This tutorial will guide you through the process of developing a desktop application with Electron and distributing it to end users.

This tutorial starts by guiding you through the process of piecing together a minimal Electron application from scratch, then teaches you how to package and distribute it to users using Electron Forge.

If you prefer to get a project started with a single-command boilerplate, we recommend you start with Electron Forge's create-electron-app command.

Electron is a native wrapper layer for web apps and is run in a Node.js environment. Therefore, this tutorial assumes you are generally familiar with Node and front-end web development basics. If you need to do some background reading before continuing, we recommend the following resources:

You will need a text editor to write your code. We recommend using Visual Studio Code, although you can choose whichever one you prefer.

Throughout the tutorial, we will ask you to use various command-line interfaces (CLIs). You can type these commands into your system's default terminal:

Most code editors also come with an integrated terminal, which you can also use.

Git is a commonly-used version control system for source code, and GitHub is a collaborative development platform built on top of it. Although neither is strictly necessary to building an Electron application, we will use GitHub releases to set up automatic updates later on in the tutorial. Therefore, we'll require you to:

If you're unfamiliar with how Git works, we recommend reading GitHub's Git guides. You can also use the GitHub Desktop app if you prefer using a visual interface over the command line.

We recommend that you create a local Git repository and publish it to GitHub before starting the tutorial, and commit your code after every step.

GitHub Desktop will install the latest version of Git on your system if you don't already have it installed.

To begin developing an Electron app, you need to install the Node.js runtime and its bundled npm package manager onto your system. We recommend that you use the latest long-term support (LTS) version.

Please install Node.js using pre-built installers for your platform. You may encounter incompatibility issues with different development tools otherwise. If you are using macOS, we recommend using a package manager like Homebrew or nvm to avoid any directory permission issues.

To check that Node.js was installed correctly, you can use the -v flag when running the node and npm commands. These should print out the installed versions.

Although you need Node.js installed locally to scaffold an Electron project, Electron does not use your system's Node.js installation to run its code. Instead, it comes bundled with its own Node.js runtime. This means that your end users do not need to install Node.js themselves as a prerequisite to running your app.To check which version of Node.js is running in your app, you can access the global process.versions variable in the main process or preload script. You can also reference https://releases.electronjs.org/releases.json.

To check which version of Node.js is running in your app, you can access the global process.versions variable in the main process or preload script. You can also reference https://releases.electronjs.org/releases.json.

**Examples:**

Example 1 (unknown):
```unknown
$ node -vv16.14.2$ npm -v8.7.0
```

---

## Representing Files in a BrowserWindow

**URL:** https://www.electronjs.org/docs/latest/tutorial/represented-file

**Contents:**
- Representing Files in a BrowserWindow
- Overview​
- Example​

On macOS, you can set a represented file for any window in your application. The represented file's icon will be shown in the title bar, and when users Command-Click or Control-Click, a popup with a path to the file will be shown.

NOTE: The screenshot above is an example where this feature is used to indicate the currently opened file in the Atom text editor.

You can also set the edited state for a window so that the file icon can indicate whether the document in this window has been modified.

To set the represented file of window, you can use the BrowserWindow.setRepresentedFilename and BrowserWindow.setDocumentEdited APIs.

After launching the Electron application, click on the title with Command or Control key pressed. You should see a popup with the represented file at the top. In this guide, this is the current user's home directory:

**Examples:**

Example 1 (javascript):
```javascript
const { app, BrowserWindow } = require('electron/main')const os = require('node:os')function createWindow () {  const win = new BrowserWindow({    width: 800,    height: 600  })  win.setRepresentedFilename(os.homedir())  win.setDocumentEdited(true)  win.loadFile('index.html')}app.whenReady().then(() => {  createWindow()  app.on('activate', () => {    if (BrowserWindow.getAllWindows().length === 0) {      createWindow()    }  })})app.on('window-all-closed', () => {  if (process.platform !== 'darwin') {    app.quit()  }})
```

Example 2 (html):
```html
<!DOCTYPE html><html><head>    <meta charset="UTF-8">    <title>Hello World!</title>    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" />    <link rel="stylesheet" type="text/css" href="./styles.css"></head><body>    <h1>Hello World!</h1>    <p>      Click on the title with the <pre>Command</pre> or <pre>Control</pre> key pressed.      You should see a popup with the represented file at the top.    </p>  </body></body></html>
```

---

## Process Model

**URL:** https://www.electronjs.org/docs/latest/tutorial/process-model

**Contents:**
- Process Model
- Why not a single process?​
- The multi-process model​
- The main process​
  - Window management​
  - Application lifecycle​
  - Native APIs​
- The renderer process​
- Preload scripts​
- The utility process​

Electron inherits its multi-process architecture from Chromium, which makes the framework architecturally very similar to a modern web browser. This guide will expand on the concepts applied in the Tutorial.

Web browsers are incredibly complicated applications. Aside from their primary ability to display web content, they have many secondary responsibilities, such as managing multiple windows (or tabs) and loading third-party extensions.

In the earlier days, browsers usually used a single process for all of this functionality. Although this pattern meant less overhead for each tab you had open, it also meant that one website crashing or hanging would affect the entire browser.

To solve this problem, the Chrome team decided that each tab would render in its own process, limiting the harm that buggy or malicious code on a web page could cause to the app as a whole. A single browser process then controls these processes, as well as the application lifecycle as a whole. This diagram below from the Chrome Comic visualizes this model:

Electron applications are structured very similarly. As an app developer, you control two types of processes: main and renderer. These are analogous to Chrome's own browser and renderer processes outlined above.

Each Electron app has a single main process, which acts as the application's entry point. The main process runs in a Node.js environment, meaning it has the ability to require modules and use all of Node.js APIs.

The main process' primary purpose is to create and manage application windows with the BrowserWindow module.

Each instance of the BrowserWindow class creates an application window that loads a web page in a separate renderer process. You can interact with this web content from the main process using the window's webContents object.

A renderer process is also created for web embeds such as the BrowserView module. The webContents object is also accessible for embedded web content.

Because the BrowserWindow module is an EventEmitter, you can also add handlers for various user events (for example, minimizing or maximizing your window).

When a BrowserWindow instance is destroyed, its corresponding renderer process gets terminated as well.

The main process also controls your application's lifecycle through Electron's app module. This module provides a large set of events and methods that you can use to add custom application behavior (for instance, programmatically quitting your application, modifying the application dock, or showing an About panel).

As a practical example, the app shown in the tutorial starter code uses app APIs to create a more native application window experience.

To extend Electron's features beyond being a Chromium wrapper for web contents, the main process also adds custom APIs to interact with the user's operating system. Electron exposes various modules that control native desktop functionality, such as menus, dialogs, and tray icons.

For a full list of Electron's main process modules, check out our API documentation.

Each Electron app spawns a separate renderer process for each open BrowserWindow (and each web embed). As its name implies, a renderer is responsible for rendering web content. For all intents and purposes, code ran in renderer processes should behave according to web standards (insofar as Chromium does, at least).

Therefore, all user interfaces and app functionality within a single browser window should be written with the same tools and paradigms that you use on the web.

Although explaining every web spec is out of scope for this guide, the bare minimum to understand is:

Moreover, this also means that the renderer has no direct access to require or other Node.js APIs. In order to directly include NPM modules in the renderer, you must use the same bundler toolchains (for example, webpack or parcel) that you use on the web.

Renderer processes can be spawned with a full Node.js environment for ease of development. Historically, this used to be the default, but this feature was disabled for security reasons.

At this point, you might be wondering how your renderer process user interfaces can interact with Node.js and Electron's native desktop functionality if these features are only accessible from the main process. In fact, there is no direct way to import Electron's content scripts.

Preload scripts contain code that executes in a renderer process before its web content begins loading. These scripts run within the renderer context, but are granted more privileges by having access to Node.js APIs.

A preload script can be attached to the main process in the BrowserWindow constructor's webPreferences option.

Because the preload script shares a global Window interface with the renderers and can access Node.js APIs, it serves to enhance your renderer by exposing arbitrary APIs in the window global that your web contents can then consume.

Although preload scripts share a window global with the renderer they're attached to, you cannot directly attach any variables from the preload script to window because of the contextIsolation default.

Context Isolation means that preload scripts are isolated from the renderer's main world to avoid leaking any privileged APIs into your web content's code.

Instead, use the contextBridge module to accomplish this securely:

This feature is incredibly useful for two main purposes:

Each Electron app can spawn multiple child processes from the main process using the UtilityProcess API. The utility process runs in a Node.js environment, meaning it has the ability to require modules and use all of Node.js APIs. The utility process can be used to host for example: untrusted services, CPU intensive tasks or crash prone components which would have previously been hosted in the main process or process spawned with Node.js child_process.fork API. The primary difference between the utility process and process spawned by Node.js child_process module is that the utility process can establish a communication channel with a renderer process using MessagePorts. An Electron app can always prefer the UtilityProcess API over Node.js child_process.fork API when there is need to fork a child process from the main process.

Electron's npm package also exports subpaths that contain a subset of Electron's TypeScript type definitions.

These aliases have no impact on runtime, but can be used for typechecking and autocomplete.

**Examples:**

Example 1 (javascript):
```javascript
const { BrowserWindow } = require('electron')const win = new BrowserWindow({ width: 800, height: 1500 })win.loadURL('https://github.com')const contents = win.webContentsconsole.log(contents)
```

Example 2 (javascript):
```javascript
// quitting the app when no windows are open on non-macOS platformsapp.on('window-all-closed', () => {  if (process.platform !== 'darwin') app.quit()})
```

Example 3 (javascript):
```javascript
const { BrowserWindow } = require('electron')// ...const win = new BrowserWindow({  webPreferences: {    preload: 'path/to/preload.js'  }})// ...
```

Example 4 (css):
```css
window.myAPI = {  desktop: true}
```

---

## Native Code and Electron: C++ (Linux)

**URL:** https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-linux

**Contents:**
- Native Code and Electron: C++ (Linux)
- Requirements​
- 1) Creating a package​
- 2) Setting up the build configuration​
- 3) Defining the C++ interface​
- 4) Implementing GTK3 GUI Code​
  - Basic Setup and Data Structures​
  - Global state and forward declarations​
  - Helper Functions​
  - Event handlers​

This tutorial builds on the general introduction to Native Code and Electron and focuses on creating a native addon for Linux using C++ and GTK3. To illustrate how you can embed native Linux code in your Electron app, we'll be building a basic native GTK3 GUI that communicates with Electron's JavaScript.

Specifically, we'll be using GTK3 for our GUI interface, which provides:

We specifically use GTK3 because that's what Chromium (and by extension, Electron) uses internally. Using GTK4 would cause runtime conflicts since both GTK3 and GTK4 would be loaded in the same process. If and when Chromium upgrades to GTK4, you will likely be able to easily upgrade your native code to GTK4, too.

This tutorial will be most useful to those who already have some familiarity with GTK development on Linux. You should have experience with basic GTK concepts like widgets, signals, and the main event loop. In the interest of brevity, we're not spending too much time explaining the individual GTK elements we're using or the code we're writing for them. This allows this tutorial to be really helpful for those who already know GTK development and want to use their skills with Electron - without having to also be an entire GTK documentation.

If you're not already familiar with these concepts, the GTK3 documentation and GTK3 tutorials are excellent resources to get started. The GNOME Developer Documentation also provides comprehensive guides for GTK development.

Just like our general introduction to Native Code and Electron, this tutorial assumes you have Node.js and npm installed, as well as the basic tools necessary for compiling native code. Since this tutorial discusses writing native code that interacts with GTK3, you'll need:

On Ubuntu/Debian, you can install these with:

On Fedora/RHEL/CentOS:

You can re-use the package we created in our Native Code and Electron tutorial. This tutorial will not be repeating the steps described there. Let's first setup our basic addon folder structure:

Our package.json should look like this:

For a Linux-specific addon using GTK3, we need to configure our binding.gyp file correctly to ensure our addon is only compiled on Linux systems - doing ideally nothing on other platforms. This involves using conditional compilation flags, leveraging pkg-config to automatically locate and include the GTK3 libraries and header paths on the user's system, and setting appropriate compiler flags to enable features like exception handling and threading support. The configuration will ensure that our native code can properly interface with both the Node.js/Electron runtime and the GTK3 libraries that provide the native GUI capabilities.

Let's examine the key parts of this configuration, starting with the pkg-config integration. The <!@ syntax in a binding.gyp file is a command expansion operator. It executes the command inside the parentheses and uses the command's output as the value at that position. So, wherever you see <!@ with pkg-config inside, know that we're calling a pkg-config command and using the output as our value. The sed command strips the -I prefix from the include paths to make them compatible with GYP's format.

Let's define our header in include/cpp_code.h:

Now, let's implement our GTK3 GUI in src/cpp_code.cc. We'll break this into manageable sections. We'll start with a number of includes as well as the basic setup.

The toJson() method is particularly important as it's what allows our C++ objects to be serialized for transmission to JavaScript. There are probably better ways to do that, but this tutorial is about combining C++ for native Linux UI development with Electron, so we'll give ourselves a pass for not writing better JSON serialization code here. There are many libraries to work with JSON in C++ with different trade-offs. See https://www.json.org/json-en.html for a list.

Notably, we haven't actually added any user interface yet - which we'll do in the next step. GTK code tends to be verbose, so bear with us - despite the length.

Below the code already in your src/cpp_code.cc, add the following:

These global variables keep track of application state and allow different parts of our code to interact with each other. The thread management variables (g_gtk_main_context, g_main_loop, and g_gtk_thread) are particularly important because GTK requires running in its own event loop. Since our code will be called from Node.js/Electron's main thread, we need to run GTK in a separate thread to avoid blocking the JavaScript event loop. This separation ensures that our native UI remains responsive while still allowing bidirectional communication with the Electron application. The callbacks enable us to send events back to JavaScript when the user interacts with our native GTK interface.

Moving on, we're adding more code below the code we've already written. In this section, we're adding three static helper methods - and also start setting up some actual native user interface. We'll add a helper function that'll notify a callback in a thread-safe way, a function to update a row label, and a function to create the whole "Add Todo" dialog.

These helper functions are crucial for our application:

Our native user interface has events - and those events must be handled. The only Electron-specific thing in this code is that we're notifying our JS callbacks.

These event handlers manage user interactions:

edit_action: Handles editing a todo by:

delete_action: Removes a todo and notifies JavaScript.

on_add_clicked: Adds a new todo when the user clicks the Add button:

on_row_activated: Shows a popup menu when a todo is clicked, with options to edit or delete.

Now, we'll need to setup our GTK application. This might be counter-intuitive, given that we already have a GTK application running. The activation code here is necessary because this is native C++ code running alongside Electron, not within it. While Electron does have its own main process and renderer processes, this GTK application operates as a native OS window that's launched from the Electron application but runs in its own process or thread. The hello_gui() function specifically starts the GTK application with its own thread (g_gtk_thread), application loop, and UI context.

Let's take a closer look at the code above:

The UI layout is defined inline using XML, which is a common pattern in GTK applications. It creates a main window, input controls (text entry, calendar, and add button), a list box for displaying todos, and proper layout containers and scrolling.

Now that we have everything wired, up, we can add our two core GUI functions: hello_gui() (which we'll call from JavaScript) and cleanup_gui() to get rid of everything. You'll be hopefully delighted to hear that our careful setup of GTK app, context, and threads makes this straightforward:

These functions manage the GTK application lifecycle:

Running GTK in a separate thread is crucial for Electron integration, as it prevents the GTK main loop from blocking Node.js's event loop.

Previously, we setup global variables to hold our callbacks. Now, we'll add functions that assign those callbacks. These callbacks form the bridge between our native GTK code and JavaScript, allowing bidirectional communication.

We've now finished the GTK and native part of our addon - that is, the code that's most concerned with interacting with the operating system (and by contrast, less so with bridging the native C++ and JavaScript worlds). After adding all the sections above, your src/cpp_code.cc should look like this:

Now let's implement the bridge between our C++ code and Node.js in src/cpp_addon.cc. Let's start by creating a basic skeleton for our addon:

This is the minimal structure required for a Node.js addon using node-addon-api. The Init function is called when the addon is loaded, and the NODE_API_MODULE macro registers our initializer. This basic skeleton doesn't do anything yet, but it provides the entry point for Node.js to load our native code.

Let's create a class that will wrap our C++ code and expose it to JavaScript. In our previous step, we've added a comment reading "Class to wrap our C++ code will go here" - replace it with the code below.

Here, we create a C++ class that inherits from Napi::ObjectWrap<CppAddon>:

static Napi::Object Init defines our JavaScript interface with three methods:

The constructor initializes:

The destructor properly cleans up the thread-safe function when the object is garbage collected.

Next, we'll add our two main methods, HelloWorld() and HelloGui(). We'll add these to our private scope, right where we have a comment reading "Method implementations will go here".

You might be wondering what Napi::CallbackInfo is or where it comes from. This is a class provided by the Node-API (N-API) C++ wrapper, specifically from the node-addon-api package. It encapsulates all the information about a JavaScript function call, including:

This class is fundamental to the Node.js native addon development as it serves as the bridge between JavaScript function calls and C++ method implementations. Every native method that can be called from JavaScript receives a CallbackInfo object as its parameter, allowing the C++ code to access and validate the JavaScript arguments before processing them. You can see us using it in HelloWorld() to get function parameters and other information about the function call. Our HelloGui() function doesn't use it, but if it did, it'd follow the same pattern.

Now we'll tackle the tricky part of native development: setting up the event system. Previously, we added native callbacks to our cpp_code.cc code - and in our bridge code in cpp_addon.cc, we'll need to find a way to have those callbacks ultimately trigger a JavaScript method.

Let's start with the On() method, which we'll call from JavaScript. In our previously written code, you'll find a comment reading On() method implementation will go here. Replace it with the following method:

This method allows JavaScript to register callbacks for different event types and stores the JavaScript function in our callbacks map for later use. So far, so good - but now we need to let cpp_code.cc know about these callbacks. We also need to figure out a way to coordinate our threads, because the actual cpp_code.cc will be doing most of its work on its own thread.

In our code, find the section where we're declaring the constructor CppAddon(const Napi::CallbackInfo &info), which you'll find in the public section. It should have a comment reading We'll implement the constructor together with a callback struct later. Then, replace that part with the following code:

This is the most complex part of our bridge: implementing bidirectional communication. There are a few things worth noting going on here, so let's take them step by step:

Let's talk about napi_create_threadsafe_function. The orchestration of different threads is maybe the most difficult part about native addon development - and in our experience, the place where developers are most likely to give up. napi_create_threadsafe_function is provided by the N-API and allows you to safely call JavaScript functions from any thread. This is essential when working with GUI frameworks like GTK3 that run on their own thread. Here's why it's important:

In our code, we're using it to bridge the gap between GTK3's event loop and Node.js's event loop, allowing events from our GUI to safely trigger JavaScript callbacks.

For developers wanting to learn more, you can refer to the official N-API documentation for detailed information about thread-safe functions, the node-addon-api wrapper documentation for the C++ wrapper implementation, and the Node.js Threading Model article to understand how Node.js handles concurrency and why thread-safe functions are necessary.

We've now finished the bridge part our addon - that is, the code that's most concerned with being the bridge between your JavaScript and C++ code (and by contrast, less so actually interacting with the operating system or GTK). After adding all the sections above, your src/cpp_addon.cc should look like this:

Let's finish things off by adding a JavaScript wrapper in js/index.js. As we could all see, C++ requires a lot of boilerplate code that might be easier or faster to write in JavaScript - and you will find that many production applications end up transforming data or requests in JavaScript before invoking native code. We, for instance, turn our timestamp into a proper JavaScript date.

With all files in place, you can build the addon:

If the build completes, you can now add the addon to your Electron app and import or require it there.

Once you've built the addon, you can use it in your Electron application. Here's a complete example:

When you run this code:

All interactions with the native GTK3 interface will trigger the corresponding JavaScript events, allowing your Electron application to respond to native GUI actions in real-time.

You've now built a complete native Node.js addon for Linux using C++ and GTK3. This addon:

This foundation can be extended to implement more complex Linux-specific features in your Electron applications. You can access system features, integrate with Linux-specific libraries, or create performant native UIs while maintaining the flexibility and ease of development that Electron provides. For more information on GTK3 development, refer to the GTK3 Documentation and the GLib/GObject documentation. You may also find the Node.js N-API documentation and node-addon-api helpful for extending your native addons.

**Examples:**

Example 1 (unknown):
```unknown
sudo apt-get install build-essential pkg-config libgtk-3-dev
```

Example 2 (unknown):
```unknown
sudo dnf install gcc-c++ pkgconfig gtk3-devel
```

Example 3 (go):
```go
cpp-linux/├── binding.gyp          # Configuration file for node-gyp to build the native addon├── include/│   └── cpp_code.h       # Header file with declarations for our C++ native code├── js/│   └── index.js         # JavaScript interface that loads and exposes our native addon├── package.json         # Node.js package configuration and dependencies└── src/    ├── cpp_addon.cc     # C++ code that bridges Node.js/Electron with our native code    └── cpp_code.cc      # Implementation of our native C++ functionality using GTK3
```

Example 4 (json):
```json
{  "name": "cpp-linux",  "version": "1.0.0",  "description": "A demo module that exposes C++ code to Electron",  "main": "js/index.js",  "scripts": {    "clean": "rm -rf build",    "build-electron": "electron-rebuild",    "build": "node-gyp configure && node-gyp build"  },  "license": "MIT",  "dependencies": {    "node-addon-api": "^8.3.0",    "bindings": "^1.5.0"  }}
```

---

## Native Code and Electron: C++ (Windows)

**URL:** https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-win32

**Contents:**
- Native Code and Electron: C++ (Windows)
- Requirements​
- 1) Creating a package​
- 2) Setting Up the Build Configuration​
  - Microsoft Visual Studio Build Configurations​
    - VCCLCompilerTool Settings​
    - VCLinkerTool Settings​
  - Preprocessor macros (defines):​
- 3) Defining the C++ Interface​
- 4) Implementing Win32 GUI Code​

This tutorial builds on the general introduction to Native Code and Electron and focuses on creating a native addon for Windows using C++ and the Win32 API. To illustrate how you can embed native Win32 code in your Electron app, we'll be building a basic native Windows GUI (using the Windows Common Controls) that communicates with Electron's JavaScript.

Specifically, we'll be integrating with two commonly used native Windows libraries:

This tutorial will be most useful to those who already have some familiarity with native C++ GUI development on Windows. You should have experience with basic window classes and procedures, like WNDCLASSEXW and WindowProc functions. You should also be familiar with the Windows message loop, which is the heart of any native application - our code will be using GetMessage, TranslateMessage, and DispatchMessage to handle messages. Lastly, we'll be using (but not explaining) standard Win32 controls like WC_EDITW or WC_BUTTONW.

If you're not familiar with C++ GUI development on Windows, we recommend Microsoft's excellent documentation and guides, particular for beginners. "Get Started with Win32 and C++" is a great introduction.

Just like our general introduction to Native Code and Electron, this tutorial assumes you have Node.js and npm installed, as well as the basic tools necessary for compiling native code. Since this tutorial discusses writing native code that interacts with Windows, we recommend that you follow this tutorial on Windows with both Visual Studio and the "Desktop development with C++ workload" installed. For details, see the Visual Studio Installation instructions.

You can re-use the package we created in our Native Code and Electron tutorial. This tutorial will not be repeating the steps described there. Let's first setup our basic addon folder structure:

Our package.json should look like this:

For a Windows-specific addon, we need to modify our binding.gyp file to include Windows libraries and set appropriate compiler flags. In short, we need to do the following three things:

If you're curious about the details about this config, you can read on - otherwise, feel free to just copy them and move on to the next step, where we define the C++ interface.

msvs_settings provide Visual Studio-specific settings.

Let's define our header in include/cpp_code.h:

Now, let's implement our Win32 GUI in src/cpp_code.cc. This is a larger file, so we'll review it in sections. First, let's include necessary headers and define basic structures.

Next, let's implement the basic functions and helper methods:

In this section, we've added a function that allows us to set the callback for an added todo item. We also added two helper functions that we need when working with JavaScript: One to scale our UI elements depending on the display's DPI - and another one to convert a Windows SYSTEMTIME to milliseconds since epoch, which is how JavaScript keeps track of time.

Now, let's get to the part you probably came to this tutorial for - creating a GUI thread and drawing native pixels on screen. We'll do that by adding a void hello_gui() function to our cpp_code namespace. There are a few considerations we need to make:

In the code below, we haven't added any actual controls yet. We're doing that on purpose to look at our added code in smaller portions here.

Now that we have a thread, a window, and a message loop, we can add some controls. Nothing we're doing here is unique to writing Windows C++ for Electron - you can simply copy & paste the code below into the Controls go here! section inside our hello_gui() function.

We're specifically adding buttons, a date picker, and a list.

Now that we have a user interface that allows users to add todos, we need to store them - and add a helper function that'll potentially call our JavaScript callback. Right below the void hello_gui() { ... } function, we'll add the following:

We'll also need a function that turns a todo into something we can display. We don't need anything fancy - given the name of the todo and a SYSTEMTIME timestamp, we'll return a simple string. Add it right below the function above:

When a user adds a todo, we want to reset the controls back to an empty state. To do so, add a helper function below the code we just added:

Then, we'll need to implement the window procedure to handle Windows messages. Like a lot of our code here, there is very little specific to Electron in this code - so as a Win32 C++ developer, you'll recognize this function. The only thing that is unique is that we want to potentially notify the JavaScript callback about an added todo. We've previously implemented the NotifyCallback() function, which we will be using here. Add this code right below the function above:

We now have successfully implemented the Win32 C++ code. Most of this should look and feel to you like code you'd write with or without Electron. In the next step, we'll be building the bridge between C++ and JavaScript. Here's the complete implementation:

Now let's implement the bridge between our C++ code and Node.js in src/cpp_addon.cc. Let's start by creating a basic skeleton for our addon:

This is the minimal structure required for a Node.js addon using node-addon-api. The Init function is called when the addon is loaded, and the NODE_API_MODULE macro registers our initializer.

Let's create a class that will wrap our C++ code and expose it to JavaScript:

This creates a class that inherits from Napi::ObjectWrap, which allows us to wrap our C++ object for use in JavaScript. The Init function sets up the class and exports it to JavaScript.

Now let's add our first method, the HelloWorld function:

This adds the HelloWorld method to our class and registers it with DefineClass. The method validates inputs, calls our C++ function, and returns the result to JavaScript.

This simple method calls our hello_gui function from the C++ code, which launches the Win32 GUI window in a separate thread.

Now comes the complex part - setting up the event system so our C++ code can call back to JavaScript. We need to:

Now, let's enhance our constructor to initialize these members:

Now let's add the threadsafe function setup to our constructor:

This creates a threadsafe function that allows our C++ code to call JavaScript from any thread. When called, it retrieves the appropriate JavaScript callback and invokes it with the provided payload.

Now let's add the callbacks setup:

This creates a function that generates callbacks for each event type. The callbacks capture the event type and, when called, create a CallbackData object and pass it to our threadsafe function.

Finally, let's add the On method to allow JavaScript to register callback functions:

This allows JavaScript to register callbacks for specific event types.

Now we have all the pieces in place.

Here's the complete implementation:

Let's finish things off by adding a JavaScript wrapper in js/index.js. As we could all see, C++ requires a lot of boilerplate code that might be easier or faster to write in JavaScript - and you will find that many production applications end up transforming data or requests in JavaScript before invoking native code. We, for instance, turn our timestamp into a proper JavaScript date.

With all files in place, you can build the addon:

You've now built a complete native Node.js addon for Windows using C++ and the Win32 API. Some of things we've done here are:

This provides a foundation for building more complex Windows-specific features in your Electron apps, giving you the best of both worlds: the ease of web technologies with the power of native code.

For more information on working with Win32 API, refer to the Microsoft C++, C, and Assembler documentation and the Windows API reference.

**Examples:**

Example 1 (unknown):
```unknown
my-native-win32-addon/├── binding.gyp├── include/│   └── cpp_code.h├── js/│   └── index.js├── package.json└── src/    ├── cpp_addon.cc    └── cpp_code.cc
```

Example 2 (json):
```json
{  "name": "cpp-win32",  "version": "1.0.0",  "description": "A demo module that exposes C++ code to Electron",  "main": "js/index.js",  "author": "Your Name",  "scripts": {    "clean": "rm -rf build_swift && rm -rf build",    "build-electron": "electron-rebuild",    "build": "node-gyp configure && node-gyp build"  },  "license": "MIT",  "dependencies": {    "bindings": "^1.5.0",    "node-addon-api": "^8.3.0"  }}
```

Example 3 (json):
```json
{  "targets": [    {      "target_name": "cpp_addon",      "conditions": [        ['OS=="win"', {          "sources": [            "src/cpp_addon.cc",            "src/cpp_code.cc"          ],          "include_dirs": [            "<!@(node -p \"require('node-addon-api').include\")",            "include"          ],          "libraries": [            "comctl32.lib",            "shcore.lib"          ],          "dependencies": [            "<!(node -p \"require('node-addon-api').gyp\")"          ],          "msvs_settings": {            "VCCLCompilerTool": {              "ExceptionHandling": 1,              "DebugInformationFormat": "OldStyle",              "AdditionalOptions": [                "/FS"              ]            },            "VCLinkerTool": {              "GenerateDebugInformation": "true"            }          },          "defines": [            "NODE_ADDON_API_CPP_EXCEPTIONS",            "WINVER=0x0A00",            "_WIN32_WINNT=0x0A00"          ]        }]      ]    }  ]}
```

Example 4 (json):
```json
"VCCLCompilerTool": {  "ExceptionHandling": 1,  "DebugInformationFormat": "OldStyle",  "AdditionalOptions": [    "/FS"  ]}
```

---

## Application Debugging

**URL:** https://www.electronjs.org/docs/latest/tutorial/application-debugging

**Contents:**
- Application Debugging
- Renderer Process​
- Main Process​
- V8 Crashes​

Whenever your Electron application is not behaving the way you wanted it to, an array of debugging tools might help you find coding errors, performance bottlenecks, or optimization opportunities.

The most comprehensive tool to debug individual renderer processes is the Chromium Developer Toolset. It is available for all renderer processes, including instances of BrowserWindow, BrowserView, and WebView. You can open them programmatically by calling the openDevTools() API on the webContents of the instance:

Google offers excellent documentation for their developer tools. We recommend that you make yourself familiar with them - they are usually one of the most powerful utilities in any Electron Developer's tool belt.

Debugging the main process is a bit trickier, since you cannot open developer tools for them. The Chromium Developer Tools can be used to debug Electron's main process thanks to a closer collaboration between Google / Chrome and Node.js, but you might encounter oddities like require not being present in the console.

For more information, see the Debugging the Main Process documentation.

If the V8 context crashes, the DevTools will display this message.

DevTools was disconnected from the page. Once page is reloaded, DevTools will automatically reconnect.

Chromium logs can be enabled via the ELECTRON_ENABLE_LOGGING environment variable. For more information, see the environment variables documentation.

Alternatively, the command line argument --enable-logging can be passed. More information is available in the command line switches documentation.

**Examples:**

Example 1 (javascript):
```javascript
const { BrowserWindow } = require('electron')const win = new BrowserWindow()win.webContents.openDevTools()
```

---

## Custom Title Bar

**URL:** https://www.electronjs.org/docs/latest/tutorial/custom-title-bar

**Contents:**
- Custom Title Bar
- Basic tutorial​
  - Remove the default title bar​
  - Add native window controls Windows Linux​
  - Create a custom title bar​
- Advanced window customization​
  - Custom traffic lights macOS​
    - Customize the look of your traffic lights macOS​
    - Customize the traffic light position macOS​
    - Show and hide the traffic lights programmatically macOS​

Application windows have a default chrome applied by the OS. Not to be confused with the Google Chrome browser, window chrome refers to the parts of the window (e.g. title bar, toolbars, controls) that are not a part of the main web content. While the default title bar provided by the OS chrome is sufficient for simple use cases, many applications opt to remove it. Implementing a custom title bar can help your application feel more modern and consistent across platforms.

You can follow along with this tutorial by opening Fiddle with the following starter code.

Let’s start by configuring a window with native window controls and a hidden title bar. To remove the default title bar, set the BaseWindowContructorOptions titleBarStyle param in the BrowserWindow constructor to 'hidden'.

On macOS, setting titleBarStyle: 'hidden' removes the title bar while keeping the window’s traffic light controls available in the upper left hand corner. However on Windows and Linux, you’ll need to add window controls back into your BrowserWindow by setting the BaseWindowContructorOptions titleBarOverlay param in the BrowserWindow constructor.

Setting titleBarOverlay: true is the simplest way to expose window controls back into your BrowserWindow. If you’re interested in customizing the window controls further, check out the sections Custom traffic lights and Custom window controls that cover this in more detail.

Now, let’s implement a simple custom title bar in the webContents of our BrowserWindow. There’s nothing fancy here, just HTML and CSS!

Currently our application window can’t be moved. Since we’ve removed the default title bar, the application needs to tell Electron which regions are draggable. We’ll do this by adding the CSS style app-region: drag to the custom title bar. Now we can drag the custom title bar to reposition our app window!

For more information around how to manage drag regions defined by your electron application, see the Custom draggable regions section below.

Congratulations, you've just implemented a basic custom title bar!

The customButtonsOnHover title bar style will hide the traffic lights until you hover over them. This is useful if you want to create custom traffic lights in your HTML but still use the native UI to control the window.

To modify the position of the traffic light window controls, there are two configuration options available.

Applying hiddenInset title bar style will shift the vertical inset of the traffic lights by a fixed amount.

If you need more granular control over the positioning of the traffic lights, you can pass a set of coordinates to the trafficLightPosition option in the BrowserWindow constructor.

You can also show and hide the traffic lights programmatically from the main process. The win.setWindowButtonVisibility forces traffic lights to be show or hidden depending on the value of its boolean parameter.

Given the number of APIs available, there are many ways of achieving this. For instance, combining frame: false with win.setWindowButtonVisibility(true) will yield the same layout outcome as setting titleBarStyle: 'hidden'.

The Window Controls Overlay API is a web standard that gives web apps the ability to customize their title bar region when installed on desktop. Electron exposes this API through the titleBarOverlay option in the BrowserWindow constructor. When titleBarOverlay is enabled, the window controls become exposed in their default position, and DOM elements cannot use the area underneath this region.

titleBarOverlay requires the titleBarStyle param in the BrowserWindow constructor to have a value other than default.

The custom title bar tutorial covers a basic example of exposing window controls by setting titleBarOverlay: true. The height, color (Windows Linux), and symbol colors (Windows) of the window controls can be customized further by setting titleBarOverlay to an object.

The value passed to the height property must be an integer. The color and symbolColor properties accept rgba(), hsla(), and #RRGGBBAA color formats and support transparency. If a color option is not specified, the color will default to its system color for the window control buttons. Similarly, if the height option is not specified, the window controls will default to the standard system height:

Once your title bar overlay is enabled from the main process, you can access the overlay's color and dimension values from a renderer using a set of readonly JavaScript APIs and CSS Environment Variables.

**Examples:**

Example 1 (javascript):
```javascript
const { app, BrowserWindow } = require('electron')function createWindow () {  const win = new BrowserWindow({})  win.loadURL('https://example.com')}app.whenReady().then(() => {  createWindow()})
```

Example 2 (javascript):
```javascript
const { app, BrowserWindow } = require('electron')function createWindow () {  const win = new BrowserWindow({    // remove the default titlebar    titleBarStyle: 'hidden'  })  win.loadURL('https://example.com')}app.whenReady().then(() => {  createWindow()})
```

Example 3 (javascript):
```javascript
const { app, BrowserWindow } = require('electron')function createWindow () {  const win = new BrowserWindow({    // remove the default titlebar    titleBarStyle: 'hidden',    // expose window controls in Windows/Linux    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {})  })  win.loadURL('https://example.com')}app.whenReady().then(() => {  createWindow()})
```

Example 4 (javascript):
```javascript
const { app, BrowserWindow } = require('electron')function createWindow () {  const win = new BrowserWindow({    // remove the default titlebar    titleBarStyle: 'hidden',    // expose window controls in Windows/Linux    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {})  })  win.loadFile('index.html')}app.whenReady().then(() => {  createWindow()})
```

---

## Custom Window Interactions

**URL:** https://www.electronjs.org/docs/latest/tutorial/custom-window-interactions

**Contents:**
- Custom Window Interactions
- Custom draggable regions​
  - Tip: disable text selection​
  - Tip: disable context menus​
- Click-through windows​
  - Forward mouse events macOS Windows​

By default, windows are dragged using the title bar provided by the OS chrome. Apps that remove the default title bar need to use the app-region CSS property to define specific areas that can be used to drag the window. Setting app-region: drag marks a rectagular area as draggable.

It is important to note that draggable areas ignore all pointer events. For example, a button element that overlaps a draggable region will not emit mouse clicks or mouse enter/exit events within that overlapping area. Setting app-region: no-drag reenables pointer events by excluding a rectagular area from a draggable region.

To make the whole window draggable, you can add app-region: drag as body's style:

And note that if you have made the whole window draggable, you must also mark buttons as non-draggable, otherwise it would be impossible for users to click on them:

If you're only setting a custom title bar as draggable, you also need to make all buttons in title bar non-draggable.

When creating a draggable region, the dragging behavior may conflict with text selection. For example, when you drag the title bar, you may accidentally select its text contents. To prevent this, you need to disable text selection within a draggable area like this:

On some platforms, the draggable area will be treated as a non-client frame, so when you right click on it, a system menu will pop up. To make the context menu behave correctly on all platforms, you should never use a custom context menu on draggable areas.

To create a click-through window, i.e. making the window ignore all mouse events, you can call the win.setIgnoreMouseEvents(ignore) API:

Ignoring mouse messages makes the web contents oblivious to mouse movement, meaning that mouse movement events will not be emitted. On Windows and macOS, an optional parameter can be used to forward mouse move messages to the web page, allowing events such as mouseleave to be emitted:

This makes the web page click-through when over the #clickThroughElement element, and returns to normal outside it.

**Examples:**

Example 1 (css):
```css
body {  app-region: drag;}
```

Example 2 (css):
```css
button {  app-region: no-drag;}
```

Example 3 (css):
```css
.titlebar {  user-select: none;  app-region: drag;}
```

Example 4 (javascript):
```javascript
const { BrowserWindow } = require('electron')const win = new BrowserWindow()win.setIgnoreMouseEvents(true)
```

---

## Dark Mode

**URL:** https://www.electronjs.org/docs/latest/tutorial/dark-mode

**Contents:**
- Dark Mode
- Overview​
  - Automatically update the native interfaces​
  - Automatically update your own interfaces​
  - Manually update your own interfaces​
- macOS settings​
- Example​
  - How does this work?​

"Native interfaces" include the file picker, window border, dialogs, context menus, and more - anything where the UI comes from your operating system and not from your app. The default behavior is to opt into this automatic theming from the OS.

If your app has its own dark mode, you should toggle it on and off in sync with the system's dark mode setting. You can do this by using the prefers-color-scheme CSS media query.

If you want to manually switch between light/dark modes, you can do this by setting the desired mode in the themeSource property of the nativeTheme module. This property's value will be propagated to your Renderer process. Any CSS rules related to prefers-color-scheme will be updated accordingly.

In macOS 10.14 Mojave, Apple introduced a new system-wide dark mode for all macOS computers. If your Electron app has a dark mode, you can make it follow the system-wide dark mode setting using the nativeTheme api.

In macOS 10.15 Catalina, Apple introduced a new "automatic" dark mode option for all macOS computers. In order for the nativeTheme.shouldUseDarkColors and Tray APIs to work correctly in this mode on Catalina, you need to use Electron >=7.0.0, or set NSRequiresAquaSystemAppearance to false in your Info.plist file for older versions. Both Electron Packager and Electron Forge have a darwinDarkModeSupport option to automate the Info.plist changes during app build time.

If you wish to opt-out while using Electron > 8.0.0, you must set the NSRequiresAquaSystemAppearance key in the Info.plist file to true. Please note that Electron 8.0.0 and above will not let you opt-out of this theming, due to the use of the macOS 10.14 SDK.

This example demonstrates an Electron application that derives its theme colors from the nativeTheme. Additionally, it provides theme toggle and reset controls using IPC channels.

Starting with the index.html file:

And the styles.css file:

The example renders an HTML page with a couple elements. The <strong id="theme-source"> element shows which theme is currently selected, and the two <button> elements are the controls. The CSS file uses the prefers-color-scheme media query to set the <body> element background and text colors.

The preload.js script adds a new API to the window object called darkMode. This API exposes two IPC channels to the renderer process, 'dark-mode:toggle' and 'dark-mode:system'. It also assigns two methods, toggle and system, which pass messages from the renderer to the main process.

Now the renderer process can communicate with the main process securely and perform the necessary mutations to the nativeTheme object.

The renderer.js file is responsible for controlling the <button> functionality.

Using addEventListener, the renderer.js file adds 'click' event listeners to each button element. Each event listener handler makes calls to the respective window.darkMode API methods.

Finally, the main.js file represents the main process and contains the actual nativeTheme API.

The ipcMain.handle methods are how the main process responds to the click events from the buttons on the HTML page.

The 'dark-mode:toggle' IPC channel handler method checks the shouldUseDarkColors boolean property, sets the corresponding themeSource, and then returns the current shouldUseDarkColors property. Looking back on the renderer process event listener for this IPC channel, the return value from this handler is utilized to assign the correct text to the <strong id='theme-source'> element.

The 'dark-mode:system' IPC channel handler method assigns the string 'system' to the themeSource and returns nothing. This also corresponds with the relative renderer process event listener as the method is awaited with no return value expected.

Run the example using Electron Fiddle and then click the "Toggle Dark Mode" button; the app should start alternating between a light and dark background color.

**Examples:**

Example 1 (javascript):
```javascript
const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron/main')const path = require('node:path')function createWindow () {  const win = new BrowserWindow({    width: 800,    height: 600,    webPreferences: {      preload: path.join(__dirname, 'preload.js')    }  })  win.loadFile('index.html')}ipcMain.handle('dark-mode:toggle', () => {  if (nativeTheme.shouldUseDarkColors) {    nativeTheme.themeSource = 'light'  } else {    nativeTheme.themeSource = 'dark'  }  return nativeTheme.shouldUseDarkColors})ipcMain.handle('dark-mode:system', () => {  nativeTheme.themeSource = 'system'})app.whenReady().then(() => {  createWindow()  app.on('activate', () => {    if (BrowserWindow.getAllWindows().length === 0) {      createWindow()    }  })})app.on('window-all-closed', () => {  if (process.platform !== 'darwin') {    app.quit()  }})
```

Example 2 (javascript):
```javascript
const { contextBridge, ipcRenderer } = require('electron/renderer')contextBridge.exposeInMainWorld('darkMode', {  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),  system: () => ipcRenderer.invoke('dark-mode:system')})
```

Example 3 (html):
```html
<!DOCTYPE html><html><head>    <meta charset="UTF-8">    <title>Hello World!</title>    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" />    <link rel="stylesheet" type="text/css" href="./styles.css"></head><body>    <h1>Hello World!</h1>    <p>Current theme source: <strong id="theme-source">System</strong></p>    <button id="toggle-dark-mode">Toggle Dark Mode</button>    <button id="reset-to-system">Reset to System Theme</button>    <script src="renderer.js"></script></body></html>
```

Example 4 (swift):
```swift
document.getElementById('toggle-dark-mode').addEventListener('click', async () => {  const isDarkMode = await window.darkMode.toggle()  document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'})document.getElementById('reset-to-system').addEventListener('click', async () => {  await window.darkMode.system()  document.getElementById('theme-source').innerHTML = 'System'})
```

---

## Device Access

**URL:** https://www.electronjs.org/docs/latest/tutorial/devices

**Contents:**
- Device Access
- Web Bluetooth API​
  - Example​
- WebHID API​
  - Blocklist​
  - Example​
- Web Serial API​
  - Blocklist​
  - Example​
- WebUSB API​

Like Chromium based browsers, Electron provides access to device hardware through web APIs. For the most part these APIs work like they do in a browser, but there are some differences that need to be taken into account. The primary difference between Electron and browsers is what happens when device access is requested. In a browser, users are presented with a popup where they can grant access to an individual device. In Electron APIs are provided which can be used by a developer to either automatically pick a device or prompt users to pick a device via a developer created interface.

The Web Bluetooth API can be used to communicate with bluetooth devices. In order to use this API in Electron, developers will need to handle the select-bluetooth-device event on the webContents associated with the device request.

Additionally, ses.setBluetoothPairingHandler(handler) can be used to handle pairing to bluetooth devices on Windows or Linux when additional validation such as a pin is needed.

This example demonstrates an Electron application that automatically selects the first available bluetooth device when the Test Bluetooth button is clicked.

The WebHID API can be used to access HID devices such as keyboards and gamepads. Electron provides several APIs for working with the WebHID API:

By default Electron employs the same blocklist used by Chromium. If you wish to override this behavior, you can do so by setting the disable-hid-blocklist flag:

This example demonstrates an Electron application that automatically selects HID devices through ses.setDevicePermissionHandler(handler) and through select-hid-device event on the Session when the Test WebHID button is clicked.

The Web Serial API can be used to access serial devices that are connected via serial port, USB, or Bluetooth. In order to use this API in Electron, developers will need to handle the select-serial-port event on the Session associated with the serial port request.

There are several additional APIs for working with the Web Serial API:

By default Electron employs the same blocklist used by Chromium. If you wish to override this behavior, you can do so by setting the disable-serial-blocklist flag:

This example demonstrates an Electron application that automatically selects serial devices through ses.setDevicePermissionHandler(handler) as well as demonstrating selecting the first available Arduino Uno serial device (if connected) through select-serial-port event on the Session when the Test Web Serial button is clicked.

The WebUSB API can be used to access USB devices. Electron provides several APIs for working with the WebUSB API:

By default Electron employs the same blocklist used by Chromium. If you wish to override this behavior, you can do so by setting the disable-usb-blocklist flag:

This example demonstrates an Electron application that automatically selects USB devices (if they are attached) through ses.setDevicePermissionHandler(handler) and through select-usb-device event on the Session when the Test WebUSB button is clicked.

**Examples:**

Example 1 (javascript):
```javascript
const { app, BrowserWindow, ipcMain } = require('electron/main')const path = require('node:path')let bluetoothPinCallbacklet selectBluetoothCallbackfunction createWindow () {  const mainWindow = new BrowserWindow({    width: 800,    height: 600,    webPreferences: {      preload: path.join(__dirname, 'preload.js')    }  })  mainWindow.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {    event.preventDefault()    selectBluetoothCallback = callback    const result = deviceList.find((device) => {      return device.deviceName === 'test'    })    if (result) {      callback(result.deviceId)    } else {      // The device wasn't found so we need to either wait longer (eg until the      // device is turned on) or until the user cancels the request    }  })  ipcMain.on('cancel-bluetooth-request', (event) => {    selectBluetoothCallback('')  })  // Listen for a message from the renderer to get the response for the Bluetooth pairing.  ipcMain.on('bluetooth-pairing-response', (event, response) => {    bluetoothPinCallback(response)  })  mainWindow.webContents.session.setBluetoothPairingHandler((details, callback) => {    bluetoothPinCallback = callback    // Send a message to the renderer to prompt the user to confirm the pairing.    mainWindow.webContents.send('bluetooth-pairing-request', details)  })  mainWindow.loadFile('index.html')}app.whenReady().then(() => {  createWindow()  app.on('activate', function () {    if (BrowserWindow.getAllWindows().length === 0) createWindow()  })})app.on('window-all-closed', function () {  if (process.platform !== 'darwin') app.quit()})
```

Example 2 (javascript):
```javascript
const { contextBridge, ipcRenderer } = require('electron/renderer')contextBridge.exposeInMainWorld('electronAPI', {  cancelBluetoothRequest: () => ipcRenderer.send('cancel-bluetooth-request'),  bluetoothPairingRequest: (callback) => ipcRenderer.on('bluetooth-pairing-request', () => callback()),  bluetoothPairingResponse: (response) => ipcRenderer.send('bluetooth-pairing-response', response)})
```

Example 3 (html):
```html
<!DOCTYPE html><html>  <head>    <meta charset="UTF-8">    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">    <title>Web Bluetooth API</title>  </head>  <body>    <h1>Web Bluetooth API</h1>    <button id="clickme">Test Bluetooth</button>    <button id="cancel">Cancel Bluetooth Request</button>    <p>Currently selected bluetooth device: <strong id="device-name"></strong></p>    <script src="./renderer.js"></script>  </body></html>
```

Example 4 (javascript):
```javascript
async function testIt () {  const device = await navigator.bluetooth.requestDevice({    acceptAllDevices: true  })  document.getElementById('device-name').innerHTML = device.name || `ID: ${device.id}`}document.getElementById('clickme').addEventListener('click', testIt)function cancelRequest () {  window.electronAPI.cancelBluetoothRequest()}document.getElementById('cancel').addEventListener('click', cancelRequest)window.electronAPI.bluetoothPairingRequest((event, details) => {  const response = {}  switch (details.pairingKind) {    case 'confirm': {      response.confirmed = window.confirm(`Do you want to connect to device ${details.deviceId}?`)      break    }    case 'confirmPin': {      response.confirmed = window.confirm(`Does the pin ${details.pin} match the pin displayed on device ${details.deviceId}?`)      break    }    case 'providePin': {      const pin = window.prompt(`Please provide a pin for ${details.deviceId}.`)      if (pin) {        response.pin = pin        response.confirmed = true      } else {        response.confirmed = false      }    }  }  window.electronAPI.bluetoothPairingResponse(response)})
```

---

## Code Signing

**URL:** https://www.electronjs.org/docs/latest/tutorial/code-signing

**Contents:**
- Code Signing
- Signing & notarizing macOS builds​
  - Using Electron Forge​
  - Using Electron Packager​
  - Signing Mac App Store applications​
- Signing Windows builds​
  - Using traditional certificates​
    - Using Electron Forge​
    - Using Electron Packager​
    - Using electron-winstaller (Squirrel.Windows)​

Code signing is a security technology to certify that an app was created by you. You should sign your application so it does not trigger any operating system security warnings.

Both Windows and macOS prevent users from running unsigned applications. It is possible to distribute applications without codesigning them - but in order to run them, users need to go through multiple advanced and manual steps.

If you are building an Electron app that you intend to package and distribute, it should be code signed. The Electron ecosystem tooling makes codesigning your apps straightforward - this documentation explains how sign your apps on both Windows and macOS.

Preparing macOS applications for release requires two steps: First, the app needs to be code signed. Then, the app needs to be uploaded to Apple for a process called notarization, where automated systems will further verify that your app isn't doing anything to endanger its users.

To start the process, ensure that you fulfill the requirements for signing and notarizing your app:

Electron's ecosystem favors configuration and freedom, so there are multiple ways to get your application signed and notarized.

If you're using Electron's favorite build tool, getting your application signed and notarized requires a few additions to your configuration. Forge is a collection of the official Electron tools, using @electron/packager, @electron/osx-sign, and @electron/notarize under the hood.

Detailed instructions on how to configure your application can be found in the Signing macOS Apps guide in the Electron Forge docs.

If you're not using an integrated build pipeline like Forge, you are likely using @electron/packager, which includes @electron/osx-sign and @electron/notarize.

If you're using Packager's API, you can pass in configuration that both signs and notarizes your application. If the example below does not meet your needs, please see @electron/osx-sign and @electron/notarize for the many possible configuration options.

See the Mac App Store Guide.

Before you can code sign your application, you need to acquire a code signing certificate. Unlike Apple, Microsoft allows developers to purchase those certificates on the open market. They are usually sold by the same companies also offering HTTPS certificates. Prices vary, so it may be worth your time to shop around. Popular resellers include:

It is important to call out that since June 2023, Microsoft requires software to be signed with an "extended validation" certificate, also called an "EV code signing certificate". In the past, developers could sign software with a simpler and cheaper certificate called "authenticode code signing certificate" or "software-based OV certificate". These simpler certificates no longer provide benefits: Windows will treat your app as completely unsigned and display the equivalent warning dialogs.

The new EV certificates are required to be stored on a hardware storage module compliant with FIPS 140 Level 2, Common Criteria EAL 4+ or equivalent. In other words, the certificate cannot be simply downloaded onto a CI infrastructure. In practice, those storage modules look like fancy USB thumb drives.

Many certificate providers now offer "cloud-based signing" - the entire signing hardware is in their data center and you can use it to remotely sign code. This approach is popular with Electron maintainers since it makes signing your applications in CI (like GitHub Actions, CircleCI, etc) relatively easy.

At the time of writing, Electron's own apps use DigiCert KeyLocker, but any provider that provides a command line tool for signing files will be compatible with Electron's tooling.

All tools in the Electron ecosystem use @electron/windows-sign and typically expose configuration options through a windowsSign property. You can either use it to sign files directly - or use the same windowsSign configuration across Electron Forge, @electron/packager, electron-winstaller, and electron-wix-msi.

Electron Forge is the recommended way to sign your app as well as your Squirrel.Windows and WiX MSI installers. Detailed instructions on how to configure your application can be found in the Electron Forge Code Signing Tutorial.

If you're not using an integrated build pipeline like Forge, you are likely using @electron/packager, which includes @electron/windows-sign.

If you're using Packager's API, you can pass in configuration that signs your application. If the example below does not meet your needs, please see @electron/windows-sign for the many possible configuration options.

electron-winstaller is a package that can generate Squirrel.Windows installers for your Electron app. This is the tool used under the hood by Electron Forge's Squirrel.Windows Maker. Just like @electron/packager, it uses @electron/windows-sign under the hood and supports the same windowsSign options.

For full configuration options, check out the electron-winstaller repository!

electron-wix-msi is a package that can generate MSI installers for your Electron app. This is the tool used under the hood by Electron Forge's MSI Maker. Just like @electron/packager, it uses @electron/windows-sign under the hood and supports the same windowsSign options.

For full configuration options, check out the electron-wix-msi repository!

Electron Builder comes with a custom solution for signing your application. You can find its documentation here.

Azure Trusted Signing is Microsoft's modern cloud-based alternative to EV certificates. It is the cheapest option for code signing on Windows, and it gets rid of SmartScreen warnings.

As of October 2025, Azure Trusted Signing is available to US and Canada-based organizations with 3+ years of verifiable business history and to individual developers in the US and Canada. Microsoft is looking to make the program more widely available. If you're reading this at a later point, it could make sense to check if the eligibility criteria have changed.

Electron Forge is the recommended way to sign your app as well as your Squirrel.Windows and WiX MSI installers. Instructions for Azure Trusted Signing can be found here.

The Electron Builder documentation for Azure Trusted Signing can be found here.

See the Windows Store Guide.

**Examples:**

Example 1 (javascript):
```javascript
const packager = require('@electron/packager')packager({  dir: '/path/to/my/app',  osxSign: {},  osxNotarize: {    appleId: 'felix@felix.fun',    appleIdPassword: 'my-apple-id-password'  }})
```

Example 2 (javascript):
```javascript
const packager = require('@electron/packager')packager({  dir: '/path/to/my/app',  windowsSign: {    signWithParams: '--my=custom --parameters',    // If signtool.exe does not work for you, customize!    signToolPath: 'C:\\Path\\To\\my-custom-tool.exe'  }})
```

Example 3 (javascript):
```javascript
const electronInstaller = require('electron-winstaller')// NB: Use this syntax within an async function, Node does not have support for//     top-level await as of Node 12.try {  await electronInstaller.createWindowsInstaller({    appDirectory: '/tmp/build/my-app-64',    outputDirectory: '/tmp/build/installer64',    authors: 'My App Inc.',    exe: 'myapp.exe',    windowsSign: {      signWithParams: '--my=custom --parameters',      // If signtool.exe does not work for you, customize!      signToolPath: 'C:\\Path\\To\\my-custom-tool.exe'    }  })  console.log('It worked!')} catch (e) {  console.log(`No dice: ${e.message}`)}
```

Example 4 (sql):
```sql
import { MSICreator } from 'electron-wix-msi'// Step 1: Instantiate the MSICreatorconst msiCreator = new MSICreator({  appDirectory: '/path/to/built/app',  description: 'My amazing Kitten simulator',  exe: 'kittens',  name: 'Kittens',  manufacturer: 'Kitten Technologies',  version: '1.1.2',  outputDirectory: '/path/to/output/folder',  windowsSign: {    signWithParams: '--my=custom --parameters',    // If signtool.exe does not work for you, customize!    signToolPath: 'C:\\Path\\To\\my-custom-tool.exe'  }})// Step 2: Create a .wxs template fileconst supportBinaries = await msiCreator.create()// 🆕 Step 2a: optionally sign support binaries if you// sign you binaries as part of of your packaging scriptfor (const binary of supportBinaries) {  // Binaries are the new stub executable and optionally  // the Squirrel auto updater.  await signFile(binary)}// Step 3: Compile the template to a .msi fileawait msiCreator.compile()
```

---

## Taskbar Customization

**URL:** https://www.electronjs.org/docs/latest/tutorial/windows-taskbar

**Contents:**
- Taskbar Customization
- Overview​
- JumpList​
    - Examples​
      - Set user tasks​
      - Clear tasks list​
  - Thumbnail Toolbars​
    - Examples​
      - Set thumbnail toolbar​
      - Clear thumbnail toolbar​

Electron has APIs to configure the app's icon in the Windows taskbar. This API supports both Windows-only features like creation of a JumpList, custom thumbnails and toolbars, icon overlays, and the so-called "Flash Frame" effect, and cross-platform features like recent documents and application progress.

Windows allows apps to define a custom context menu that shows up when users right-click the app's icon in the taskbar. That context menu is called JumpList. You specify custom actions in the Tasks category of JumpList, as quoted from MSDN:

Applications define tasks based on both the program's features and the key things a user is expected to do with them. Tasks should be context-free, in that the application does not need to be running for them to work. They should also be the statistically most common actions that a normal user would perform in an application, such as compose an email message or open the calendar in a mail program, create a new document in a word processor, launch an application in a certain mode, or launch one of its subcommands. An application should not clutter the menu with advanced features that standard users won't need or one-time actions such as registration. Do not use tasks for promotional items such as upgrades or special offers.

It is strongly recommended that the task list be static. It should remain the same regardless of the state or status of the application. While it is possible to vary the list dynamically, you should consider that this could confuse the user who does not expect that portion of the destination list to change.

NOTE: The screenshot above is an example of general tasks for Microsoft Edge

Unlike the dock menu in macOS which is a real menu, user tasks in Windows work like application shortcuts. For example, when a user clicks a task, the program will be executed with specified arguments.

To set user tasks for your application, you can use app.setUserTasks API.

Starting with a working application from the tutorial starter code, update the main.js file with the following lines:

To clear your tasks list, you need to call app.setUserTasks with an empty array in the main.js file.

NOTE: The user tasks will still be displayed even after closing your application, so the icon and program path specified for a task should exist until your application is uninstalled.

On Windows, you can add a thumbnail toolbar with specified buttons to a taskbar layout of an application window. It provides users with a way to access a particular window's command without restoring or activating the window.

This toolbar is the familiar standard toolbar common control. It has a maximum of seven buttons. Each button's ID, image, tooltip, and state are defined in a structure, which is then passed to the taskbar. The application can show, enable, disable, or hide buttons from the thumbnail toolbar as required by its current state.

For example, Windows Media Player might offer standard media transport controls such as play, pause, mute, and stop.

NOTE: The screenshot above is an example of thumbnail toolbar of Windows Media Player

To set thumbnail toolbar in your application, you need to use BrowserWindow.setThumbarButtons

Starting with a working application from the tutorial starter code, update the main.js file with the following lines:

To clear thumbnail toolbar buttons, you need to call BrowserWindow.setThumbarButtons with an empty array in the main.js file.

On Windows, a taskbar button can use a small overlay to display application status.

Icon overlays serve as a contextual notification of status, and are intended to negate the need for a separate notification area status icon to communicate that information to the user. For instance, the new mail status in Microsoft Outlook, currently shown in the notification area, can now be indicated through an overlay on the taskbar button. Again, you must decide during your development cycle which method is best for your application. Overlay icons are intended to supply important, long-standing status or notifications such as network status, messenger status, or new mail. The user should not be presented with constantly changing overlays or animations.

NOTE: The screenshot above is an example of overlay on a taskbar button

To set the overlay icon for a window, you need to use the BrowserWindow.setOverlayIcon API.

Starting with a working application from the tutorial starter code, update the main.js file with the following lines:

On Windows, you can highlight the taskbar button to get the user's attention. This is similar to bouncing the dock icon in macOS.

Typically, a window is flashed to inform the user that the window requires attention but that it does not currently have the keyboard focus.

To flash the BrowserWindow taskbar button, you need to use the BrowserWindow.flashFrame API.

Starting with a working application from the tutorial starter code, update the main.js file with the following lines:

NOTE: Don't forget to call win.flashFrame(false) to turn off the flash. In the above example, it is called when the window comes into focus, but you might use a timeout or some other event to disable it.

**Examples:**

Example 1 (css):
```css
const { app } = require('electron')app.setUserTasks([  {    program: process.execPath,    arguments: '--new-window',    iconPath: process.execPath,    iconIndex: 0,    title: 'New Window',    description: 'Create a new window'  }])
```

Example 2 (javascript):
```javascript
const { app } = require('electron')app.setUserTasks([])
```

Example 3 (javascript):
```javascript
const { BrowserWindow, nativeImage } = require('electron')const path = require('node:path')const win = new BrowserWindow()win.setThumbarButtons([  {    tooltip: 'button1',    icon: nativeImage.createFromPath(path.join(__dirname, 'button1.png')),    click () { console.log('button1 clicked') }  }, {    tooltip: 'button2',    icon: nativeImage.createFromPath(path.join(__dirname, 'button2.png')),    flags: ['enabled', 'dismissonclick'],    click () { console.log('button2 clicked.') }  }])
```

Example 4 (javascript):
```javascript
const { BrowserWindow } = require('electron')const win = new BrowserWindow()win.setThumbarButtons([])
```

---

## Inter-Process Communication

**URL:** https://www.electronjs.org/docs/latest/tutorial/ipc

**Contents:**
- Inter-Process Communication
- IPC channels​
- Understanding context-isolated processes​
- Pattern 1: Renderer to main (one-way)​
  - 1. Listen for events with ipcMain.on​
  - 2. Expose ipcRenderer.send via preload​
  - 3. Build the renderer process UI​
- Pattern 2: Renderer to main (two-way)​
  - 1. Listen for events with ipcMain.handle​
  - 2. Expose ipcRenderer.invoke via preload​

Inter-process communication (IPC) is a key part of building feature-rich desktop applications in Electron. Because the main and renderer processes have different responsibilities in Electron's process model, IPC is the only way to perform many common tasks, such as calling a native API from your UI or triggering changes in your web contents from native menus.

In Electron, processes communicate by passing messages through developer-defined "channels" with the ipcMain and ipcRenderer modules. These channels are arbitrary (you can name them anything you want) and bidirectional (you can use the same channel name for both modules).

In this guide, we'll be going over some fundamental IPC patterns with concrete examples that you can use as a reference for your app code.

Before proceeding to implementation details, you should be familiar with the idea of using a preload script to import Node.js and Electron modules in a context-isolated renderer process.

To fire a one-way IPC message from a renderer process to the main process, you can use the ipcRenderer.send API to send a message that is then received by the ipcMain.on API.

You usually use this pattern to call a main process API from your web contents. We'll demonstrate this pattern by creating a simple app that can programmatically change its window title.

For this demo, you'll need to add code to your main process, your renderer process, and a preload script. The full code is below, but we'll be explaining each file individually in the following sections.

In the main process, set an IPC listener on the set-title channel with the ipcMain.on API:

The above handleSetTitle callback has two parameters: an IpcMainEvent structure and a title string. Whenever a message comes through the set-title channel, this function will find the BrowserWindow instance attached to the message sender and use the win.setTitle API on it.

Make sure you're loading the index.html and preload.js entry points for the following steps!

To send messages to the listener created above, you can use the ipcRenderer.send API. By default, the renderer process has no Node.js or Electron module access. As an app developer, you need to choose which APIs to expose from your preload script using the contextBridge API.

In your preload script, add the following code, which will expose a global window.electronAPI variable to your renderer process.

At this point, you'll be able to use the window.electronAPI.setTitle() function in the renderer process.

We don't directly expose the whole ipcRenderer.send API for security reasons. Make sure to limit the renderer's access to Electron APIs as much as possible.

In our BrowserWindow's loaded HTML file, add a basic user interface consisting of a text input and a button:

To make these elements interactive, we'll be adding a few lines of code in the imported renderer.js file that leverages the window.electronAPI functionality exposed from the preload script:

At this point, your demo should be fully functional. Try using the input field and see what happens to your BrowserWindow title!

A common application for two-way IPC is calling a main process module from your renderer process code and waiting for a result. This can be done by using ipcRenderer.invoke paired with ipcMain.handle.

In the following example, we'll be opening a native file dialog from the renderer process and returning the selected file's path.

For this demo, you'll need to add code to your main process, your renderer process, and a preload script. The full code is below, but we'll be explaining each file individually in the following sections.

In the main process, we'll be creating a handleFileOpen() function that calls dialog.showOpenDialog and returns the value of the file path selected by the user. This function is used as a callback whenever an ipcRender.invoke message is sent through the dialog:openFile channel from the renderer process. The return value is then returned as a Promise to the original invoke call.

Errors thrown through handle in the main process are not transparent as they are serialized and only the message property from the original error is provided to the renderer process. Please refer to #24427 for details.

The dialog: prefix on the IPC channel name has no effect on the code. It only serves as a namespace that helps with code readability.

Make sure you're loading the index.html and preload.js entry points for the following steps!

In the preload script, we expose a one-line openFile function that calls and returns the value of ipcRenderer.invoke('dialog:openFile'). We'll be using this API in the next step to call the native dialog from our renderer's user interface.

We don't directly expose the whole ipcRenderer.invoke API for security reasons. Make sure to limit the renderer's access to Electron APIs as much as possible.

Finally, let's build the HTML file that we load into our BrowserWindow.

The UI consists of a single #btn button element that will be used to trigger our preload API, and a #filePath element that will be used to display the path of the selected file. Making these pieces work will take a few lines of code in the renderer process script:

In the above snippet, we listen for clicks on the #btn button, and call our window.electronAPI.openFile() API to activate the native Open File dialog. We then display the selected file path in the #filePath element.

The ipcRenderer.invoke API was added in Electron 7 as a developer-friendly way to tackle two-way IPC from the renderer process. However, a couple of alternative approaches to this IPC pattern exist.

We recommend using ipcRenderer.invoke whenever possible. The following two-way renderer-to-main patterns are documented for historical purposes.

For the following examples, we're calling ipcRenderer directly from the preload script to keep the code samples small.

The ipcRenderer.send API that we used for single-way communication can also be leveraged to perform two-way communication. This was the recommended way for asynchronous two-way communication via IPC prior to Electron 7.

There are a couple downsides to this approach:

The ipcRenderer.sendSync API sends a message to the main process and waits synchronously for a response.

The structure of this code is very similar to the invoke model, but we recommend avoiding this API for performance reasons. Its synchronous nature means that it'll block the renderer process until a reply is received.

When sending a message from the main process to a renderer process, you need to specify which renderer is receiving the message. Messages need to be sent to a renderer process via its WebContents instance. This WebContents instance contains a send method that can be used in the same way as ipcRenderer.send.

To demonstrate this pattern, we'll be building a number counter controlled by the native operating system menu.

For this demo, you'll need to add code to your main process, your renderer process, and a preload script. The full code is below, but we'll be explaining each file individually in the following sections.

For this demo, we'll need to first build a custom menu in the main process using Electron's Menu module that uses the webContents.send API to send an IPC message from the main process to the target renderer.

For the purposes of the tutorial, it's important to note that the click handler sends a message (either 1 or -1) to the renderer process through the update-counter channel.

Make sure you're loading the index.html and preload.js entry points for the following steps!

Like in the previous renderer-to-main example, we use the contextBridge and ipcRenderer modules in the preload script to expose IPC functionality to the renderer process:

After loading the preload script, your renderer process should have access to the window.electronAPI.onUpdateCounter() listener function.

We don't directly expose the whole ipcRenderer.on API for security reasons. Make sure to limit the renderer's access to Electron APIs as much as possible. Also don't just pass the callback to ipcRenderer.on as this will leak ipcRenderer via event.sender. Use a custom handler that invoke the callback only with the desired arguments.

In the case of this minimal example, you can call ipcRenderer.on directly in the preload script rather than exposing it over the context bridge.preload.js (Preload Script)const { ipcRenderer } = require('electron')window.addEventListener('DOMContentLoaded', () => { const counter = document.getElementById('counter') ipcRenderer.on('update-counter', (_event, value) => { const oldValue = Number(counter.innerText) const newValue = oldValue + value counter.innerText = newValue })})However, this approach has limited flexibility compared to exposing your preload APIs over the context bridge, since your listener can't directly interact with your renderer code.

However, this approach has limited flexibility compared to exposing your preload APIs over the context bridge, since your listener can't directly interact with your renderer code.

To tie it all together, we'll create an interface in the loaded HTML file that contains a #counter element that we'll use to display the values:

Finally, to make the values update in the HTML document, we'll add a few lines of DOM manipulation so that the value of the #counter element is updated whenever we fire an update-counter event.

In the above code, we're passing in a callback to the window.electronAPI.onUpdateCounter function exposed from our preload script. The second value parameter corresponds to the 1 or -1 we were passing in from the webContents.send call from the native menu.

There's no equivalent for ipcRenderer.invoke for main-to-renderer IPC. Instead, you can send a reply back to the main process from within the ipcRenderer.on callback.

We can demonstrate this with slight modifications to the code from the previous example. In the renderer process, expose another API to send a reply back to the main process through the counter-value channel.

In the main process, listen for counter-value events and handle them appropriately.

There's no direct way to send messages between renderer processes in Electron using the ipcMain and ipcRenderer modules. To achieve this, you have two options:

Electron's IPC implementation uses the HTML standard Structured Clone Algorithm to serialize objects passed between processes, meaning that only certain types of objects can be passed through IPC channels.

In particular, DOM objects (e.g. Element, Location and DOMMatrix), Node.js objects backed by C++ classes (e.g. process.env, some members of Stream), and Electron objects backed by C++ classes (e.g. WebContents, BrowserWindow and WebFrame) are not serializable with Structured Clone.

**Examples:**

Example 1 (javascript):
```javascript
const { app, BrowserWindow, ipcMain } = require('electron/main')const path = require('node:path')function handleSetTitle (event, title) {  const webContents = event.sender  const win = BrowserWindow.fromWebContents(webContents)  win.setTitle(title)}function createWindow () {  const mainWindow = new BrowserWindow({    webPreferences: {      preload: path.join(__dirname, 'preload.js')    }  })  mainWindow.loadFile('index.html')}app.whenReady().then(() => {  ipcMain.on('set-title', handleSetTitle)  createWindow()  app.on('activate', function () {    if (BrowserWindow.getAllWindows().length === 0) createWindow()  })})app.on('window-all-closed', function () {  if (process.platform !== 'darwin') app.quit()})
```

Example 2 (javascript):
```javascript
const { contextBridge, ipcRenderer } = require('electron/renderer')contextBridge.exposeInMainWorld('electronAPI', {  setTitle: (title) => ipcRenderer.send('set-title', title)})
```

Example 3 (html):
```html
<!DOCTYPE html><html>  <head>    <meta charset="UTF-8">    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">    <title>Hello World!</title>  </head>  <body>    Title: <input id="title"/>    <button id="btn" type="button">Set</button>    <script src="./renderer.js"></script>  </body></html>
```

Example 4 (javascript):
```javascript
const setButton = document.getElementById('btn')const titleInput = document.getElementById('title')setButton.addEventListener('click', () => {  const title = titleInput.value  window.electronAPI.setTitle(title)})
```

---

## Window Customization

**URL:** https://www.electronjs.org/docs/latest/tutorial/window-customization

**Contents:**
- Window Customization
- 📄️ Custom Title Bar
- 📄️ Custom Window Interactions
- 📄️ Custom Window Styles

The BrowserWindow module is the foundation of your Electron application, and it exposes many APIs that let you customize the look and behavior of your app’s windows. This section covers how to implement various use cases for window customization on macOS, Windows, and Linux.

BrowserWindow is a subclass of the BaseWindow module. Both modules allow you to create and manage application windows in Electron, with the main difference being that BrowserWindow supports a single, full size web view while BaseWindow supports composing many web views. BaseWindow can be used interchangeably with BrowserWindow in the examples of the documents in this section.

Application windows have a default chrome applied by the OS. Not to be confused with the Google Chrome browser, window _chrome_ refers to the parts of the window (e.g. title bar, toolbars, controls) that are not a part of the main web content. While the default title bar provided by the OS chrome is sufficient for simple use cases, many applications opt to remove it. Implementing a custom title bar can help your application feel more modern and consistent across platforms.

By default, windows are dragged using the title bar provided by the OS chrome. Apps that remove the default title bar need to use the app-region CSS property to define specific areas that can be used to drag the window. Setting app-region: drag marks a rectagular area as draggable.

---

## Windows on ARM

**URL:** https://www.electronjs.org/docs/latest/tutorial/windows-arm

**Contents:**
- Windows on ARM
- Running a basic app​
- General considerations​
  - Architecture-specific code​
  - Native modules​
  - Testing your app​
- Development prerequisites​
  - Node.js/node-gyp​
  - Visual Studio 2017​
    - Creating a cross-compilation command prompt​

If your app runs with Electron 6.0.8 or later, you can now build it for Windows 10 on Arm. This considerably improves performance, but requires recompilation of any native modules used in your app. It may also require small fixups to your build and packaging scripts.

If your app doesn't use any native modules, then it's really easy to create an Arm version of your app.

Lots of Windows-specific code contains if... else logic that selects between either the x64 or x86 architectures.

If you want to target arm64, logic like this will typically select the wrong architecture, so carefully check your application and build scripts for conditions like this. In custom build and packaging scripts, you should always check the value of npm_config_arch in the environment, rather than relying on the current process arch.

If you use native modules, you must make sure that they compile against v142 of the MSVC compiler (provided in Visual Studio 2017). You must also check that any pre-built .dll or .lib files provided or referenced by the native module are available for Windows on Arm.

To test your app, use a Windows on Arm device running Windows 10 (version 1903 or later). Make sure that you copy your application over to the target device - Chromium's sandbox will not work correctly when loading your application assets from a network location.

Node.js v12.9.0 or later is recommended. If updating to a new version of Node is undesirable, you can instead update npm's copy of node-gyp manually to version 5.0.2 or later, which contains the required changes to compile native modules for Arm.

Visual Studio 2017 (any edition) is required for cross-compiling native modules. You can download Visual Studio Community 2017 via Microsoft's Visual Studio Dev Essentials program. After installation, you can add the Arm-specific components by running the following from a Command Prompt:

Setting npm_config_arch=arm64 in the environment creates the correct arm64 .obj files, but the standard Developer Command Prompt for VS 2017 will use the x64 linker. To fix this:

If done successfully, the command prompt should print something similar to this on startup:

If you want to develop your application directly on a Windows on Arm device, substitute vcvarsx86_arm64.bat in Target so that cross-compilation can happen with the device's x86 emulation.

By default, node-gyp unpacks Electron's node headers and downloads the x86 and x64 versions of node.lib into %APPDATA%\..\Local\node-gyp\Cache, but it does not download the arm64 version (a fix for this is in development.) To fix this:

Substitute 6.0.9 for the version you're using.

After completing all of the above, open your cross-compilation command prompt and run set npm_config_arch=arm64. Then use npm install to build your project as normal. As with cross-compiling x86 modules, you may need to remove node_modules to force recompilation of native modules if they were previously compiled for another architecture.

Debugging native modules can be done with Visual Studio 2017 (running on your development machine) and corresponding Visual Studio Remote Debugger running on the target device. To debug:

If you encounter a problem with this documentation, or if your app works when compiled for x86 but not for arm64, please file an issue with "Windows on Arm" in the title.

**Examples:**

Example 1 (unknown):
```unknown
if (process.arch === 'x64') {  // Do 64-bit thing...} else {  // Do 32-bit thing...}
```

Example 2 (powershell):
```powershell
vs_installer.exe ^--add Microsoft.VisualStudio.Workload.NativeDesktop ^--add Microsoft.VisualStudio.Component.VC.ATLMFC ^--add Microsoft.VisualStudio.Component.VC.Tools.ARM64 ^--add Microsoft.VisualStudio.Component.VC.MFC.ARM64 ^--includeRecommended
```

Example 3 (unknown):
```unknown
************************************************************************ Visual Studio 2017 Developer Command Prompt v15.9.15** Copyright (c) 2017 Microsoft Corporation**********************************************************************[vcvarsall.bat] Environment initialized for: 'x64_arm64'
```

---

## Publishing and Updating

**URL:** https://www.electronjs.org/docs/latest/tutorial/tutorial-publishing-updating

**Contents:**
- Publishing and Updating
- Learning goals​
- Using update.electronjs.org​
- Publishing a GitHub release​
  - Generating a personal access token​
  - Setting up the GitHub Publisher​
    - Installing the module​
    - Configuring the publisher in Forge​
    - Setting up your authentication token​
  - Running the publish command​

This is part 6 of the Electron tutorial. Prerequisites Building your First App Using Preload Scripts Adding Features Packaging Your Application Publishing and Updating

If you've been following along, this is the last step of the tutorial! In this part, you will publish your app to GitHub releases and integrate automatic updates into your app code.

The Electron maintainers provide a free auto-updating service for open-source apps at https://update.electronjs.org. Its requirements are:

At this point, we'll assume that you have already pushed all your code to a public GitHub repository.

If you're using an alternate repository host (e.g. GitLab or Bitbucket) or if you need to keep your code repository private, please refer to our step-by-step guide on hosting your own Electron update server.

Electron Forge has Publisher plugins that can automate the distribution of your packaged application to various sources. In this tutorial, we will be using the GitHub Publisher, which will allow us to publish our code to GitHub releases.

Forge cannot publish to any repository on GitHub without permission. You need to pass in an authenticated token that gives Forge access to your GitHub releases. The easiest way to do this is to create a new personal access token (PAT) with the public_repo scope, which gives write access to your public repositories. Make sure to keep this token a secret.

Forge's GitHub Publisher is a plugin that needs to be installed in your project's devDependencies:

Once you have it installed, you need to set it up in your Forge configuration. A full list of options is documented in the Forge's PublisherGitHubConfig API docs.

Notice that you have configured Forge to publish your release as a draft. This will allow you to see the release with its generated artifacts without actually publishing it to your end users. You can manually publish your releases via GitHub after writing release notes and double-checking that your distributables work.

You also need to make the Publisher aware of your authentication token. By default, it will use the value stored in the GITHUB_TOKEN environment variable.

Add Forge's publish command to your npm scripts.

This command will run your configured makers and publish the output distributables to a new GitHub release.

By default, this will only publish a single distributable for your host operating system and architecture. You can publish for different architectures by passing in the --arch flag to your Forge commands.

The name of this release will correspond to the version field in your project's package.json file.

Optionally, you can also tag your releases in Git so that your release is associated with a labeled point in your code history. npm comes with a handy npm version command that can handle the version bumping and tagging for you.

Publishing locally can be painful, especially because you can only create distributables for your host operating system (i.e. you can't publish a Windows .exe file from macOS).

A solution for this would be to publish your app via automation workflows such as GitHub Actions, which can run tasks in the cloud on Ubuntu, macOS, and Windows. This is the exact approach taken by Electron Fiddle. You can refer to Fiddle's Build and Release pipeline and Forge configuration for more details.

Now that we have a functional release system via GitHub releases, we now need to tell our Electron app to download an update whenever a new release is out. Electron apps do this via the autoUpdater module, which reads from an update server feed to check if a new version is available for download.

The update.electronjs.org service provides an updater-compatible feed. For example, Electron Fiddle v0.28.0 will check the endpoint at https://update.electronjs.org/electron/fiddle/darwin/v0.28.0 to see if a newer GitHub release is available.

After your release is published to GitHub, the update.electronjs.org service should work for your application. The only step left is to configure the feed with the autoUpdater module.

To make this process easier, the Electron team maintains the update-electron-app module, which sets up the autoUpdater boilerplate for update.electronjs.org in one function call — no configuration required. This module will search for the update.electronjs.org feed that matches your project's package.json "repository" field.

First, install the module as a runtime dependency.

Then, import the module and call it immediately in the main process.

And that is all it takes! Once your application is packaged, it will update itself for each new GitHub release that you publish.

In this tutorial, we configured Electron Forge's GitHub Publisher to upload your app's distributables to GitHub releases. Since distributables cannot always be generated between platforms, we recommend setting up your building and publishing flow in a Continuous Integration pipeline if you do not have access to machines.

Electron applications can self-update by pointing the autoUpdater module to an update server feed. update.electronjs.org is a free update server provided by Electron for open-source applications published on GitHub releases. Configuring your Electron app to use this service is as easy as installing and importing the update-electron-app module.

If your application is not eligible for update.electronjs.org, you should instead deploy your own update server and configure the autoUpdater module yourself.

From here, you have officially completed our tutorial to Electron. Feel free to explore the rest of our docs and happy developing! If you have questions, please stop by our community Discord server.

**Examples:**

Example 1 (swift):
```swift
npm install --save-dev @electron-forge/publisher-github
```

Example 2 (swift):
```swift
yarn add --dev @electron-forge/publisher-github
```

Example 3 (swift):
```swift
module.exports = {  publishers: [    {      name: '@electron-forge/publisher-github',      config: {        repository: {          owner: 'github-user-name',          name: 'github-repo-name'        },        prerelease: false,        draft: true      }    }  ]}
```

Example 4 (json):
```json
//...  "scripts": {    "start": "electron-forge start",    "package": "electron-forge package",    "make": "electron-forge make",    "publish": "electron-forge publish"  },  //...
```

---

## Custom Window Styles

**URL:** https://www.electronjs.org/docs/latest/tutorial/custom-window-styles

**Contents:**
- Custom Window Styles
- Frameless windows​
- Transparent windows​
  - Limitations​

A frameless window removes all chrome applied by the OS, including window controls.

To create a frameless window, set the BaseWindowContructorOptions frame param in the BrowserWindow constructor to false.

To create a fully transparent window, set the BaseWindowContructorOptions transparent param in the BrowserWindow constructor to true.

The following fiddle takes advantage of a transparent window and CSS styling to create the illusion of a circular window.

**Examples:**

Example 1 (javascript):
```javascript
const { app, BrowserWindow } = require('electron')function createWindow () {  const win = new BrowserWindow({    width: 300,    height: 200,    frame: false  })  win.loadURL('https://example.com')}app.whenReady().then(() => {  createWindow()})
```

Example 2 (javascript):
```javascript
const { app, BrowserWindow } = require('electron')function createWindow () {  const win = new BrowserWindow({    width: 100,    height: 100,    resizable: false,    frame: false,    transparent: true  })  win.loadFile('index.html')}app.whenReady().then(() => {  createWindow()})
```

Example 3 (html):
```html
<!DOCTYPE html><html>  <head>    <meta charset="UTF-8">    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'">    <link href="./styles.css" rel="stylesheet">    <title>Transparent Hello World</title>  </head>  <body>    <div class="white-circle">        <div>Hello World!</div>    </div>  </body></html>
```

Example 4 (css):
```css
body {    margin: 0;    padding: 0;    background-color: rgba(0, 0, 0, 0); /* Transparent background */}.white-circle {    width: 100px;    height: 100px;    background-color: white;    border-radius: 50%;    display: flex;    align-items: center;    justify-content: center;    app-region: drag;    user-select: none;}
```

---

## Using Preload Scripts

**URL:** https://www.electronjs.org/docs/latest/tutorial/tutorial-preload

**Contents:**
- Using Preload Scripts
- Learning goals​
- What is a preload script?​
- Augmenting the renderer with a preload script​
- Communicating between processes​
- Summary​

This is part 3 of the Electron tutorial. Prerequisites Building your First App Using Preload Scripts Adding Features Packaging Your Application Publishing and Updating

In this part of the tutorial, you will learn what a preload script is and how to use one to securely expose privileged APIs into the renderer process. You will also learn how to communicate between main and renderer processes with Electron's inter-process communication (IPC) modules.

Electron's main process is a Node.js environment that has full operating system access. On top of Electron modules, you can also access Node.js built-ins, as well as any packages installed via npm. On the other hand, renderer processes run web pages and do not run Node.js by default for security reasons.

To bridge Electron's different process types together, we will need to use a special script called a preload.

A BrowserWindow's preload script runs in a context that has access to both the HTML DOM and a limited subset of Node.js and Electron APIs.

From Electron 20 onwards, preload scripts are sandboxed by default and no longer have access to a full Node.js environment. Practically, this means that you have a polyfilled require function that only has access to a limited set of APIs.Available APIDetailsElectron modulesRenderer process modulesNode.js modulesevents, timers, urlPolyfilled globalsBuffer, process, clearImmediate, setImmediateFor more information, check out the Process Sandboxing guide.

For more information, check out the Process Sandboxing guide.

Preload scripts are injected before a web page loads in the renderer, similar to a Chrome extension's content scripts. To add features to your renderer that require privileged access, you can define global objects through the contextBridge API.

To demonstrate this concept, you will create a preload script that exposes your app's versions of Chrome, Node, and Electron into the renderer.

Add a new preload.js script that exposes selected properties of Electron's process.versions object to the renderer process in a versions global variable.

To attach this script to your renderer process, pass its path to the webPreferences.preload option in the BrowserWindow constructor:

There are two Node.js concepts that are used here: The __dirname string points to the path of the currently executing script (in this case, your project's root folder). The path.join API joins multiple path segments together, creating a combined path string that works across all platforms.

At this point, the renderer has access to the versions global, so let's display that information in the window. This variable can be accessed via window.versions or simply versions. Create a renderer.js script that uses the document.getElementById DOM API to replace the displayed text for the HTML element with info as its id property.

Then, modify your index.html by adding a new element with info as its id property, and attach your renderer.js script:

After following the above steps, your app should look something like this:

And the code should look like this:

As we have mentioned above, Electron's main and renderer process have distinct responsibilities and are not interchangeable. This means it is not possible to access the Node.js APIs directly from the renderer process, nor the HTML Document Object Model (DOM) from the main process.

The solution for this problem is to use Electron's ipcMain and ipcRenderer modules for inter-process communication (IPC). To send a message from your web page to the main process, you can set up a main process handler with ipcMain.handle and then expose a function that calls ipcRenderer.invoke to trigger the handler in your preload script.

To illustrate, we will add a global function to the renderer called ping() that will return a string from the main process.

First, set up the invoke call in your preload script:

Notice how we wrap the ipcRenderer.invoke('ping') call in a helper function rather than expose the ipcRenderer module directly via context bridge. You never want to directly expose the entire ipcRenderer module via preload. This would give your renderer the ability to send arbitrary IPC messages to the main process, which becomes a powerful attack vector for malicious code.

Then, set up your handle listener in the main process. We do this before loading the HTML file so that the handler is guaranteed to be ready before you send out the invoke call from the renderer.

Once you have the sender and receiver set up, you can now send messages from the renderer to the main process through the 'ping' channel you just defined.

For more in-depth explanations on using the ipcRenderer and ipcMain modules, check out the full Inter-Process Communication guide.

A preload script contains code that runs before your web page is loaded into the browser window. It has access to both DOM APIs and Node.js environment, and is often used to expose privileged APIs to the renderer via the contextBridge API.

Because the main and renderer processes have very different responsibilities, Electron apps often use the preload script to set up inter-process communication (IPC) interfaces to pass arbitrary messages between the two kinds of processes.

In the next part of the tutorial, we will be showing you resources on adding more functionality to your app, then teaching you how to distribute your app to users.

**Examples:**

Example 1 (javascript):
```javascript
const { contextBridge } = require('electron')contextBridge.exposeInMainWorld('versions', {  node: () => process.versions.node,  chrome: () => process.versions.chrome,  electron: () => process.versions.electron  // we can also expose variables, not just functions})
```

Example 2 (javascript):
```javascript
const { app, BrowserWindow } = require('electron')const path = require('node:path')const createWindow = () => {  const win = new BrowserWindow({    width: 800,    height: 600,    webPreferences: {      preload: path.join(__dirname, 'preload.js')    }  })  win.loadFile('index.html')}app.whenReady().then(() => {  createWindow()})
```

Example 3 (julia):
```julia
const information = document.getElementById('info')information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`
```

Example 4 (html):
```html
<!DOCTYPE html><html>  <head>    <meta charset="UTF-8" />    <meta      http-equiv="Content-Security-Policy"      content="default-src 'self'; script-src 'self'"    />    <meta      http-equiv="X-Content-Security-Policy"      content="default-src 'self'; script-src 'self'"    />    <title>Hello from Electron renderer!</title>  </head>  <body>    <h1>Hello from Electron renderer!</h1>    <p>👋</p>    <p id="info"></p>  </body>  <script src="./renderer.js"></script></html>
```

---

## SpellChecker

**URL:** https://www.electronjs.org/docs/latest/tutorial/spellchecker

**Contents:**
- SpellChecker
- How to enable the spellchecker?​
- How to set the languages the spellchecker uses?​
- How do I put the results of the spellchecker in my context menu?​
- Does the spellchecker use any Google services?​

Electron has built-in support for Chromium's spellchecker since Electron 8. On Windows and Linux this is powered by Hunspell dictionaries, and on macOS it makes use of the native spellchecker APIs.

For Electron 9 and higher the spellchecker is enabled by default. For Electron 8 you need to enable it in webPreferences.

On macOS as we use the native APIs there is no way to set the language that the spellchecker uses. By default on macOS the native spellchecker will automatically detect the language being used for you.

For Windows and Linux there are a few Electron APIs you should use to set the languages for the spellchecker.

By default the spellchecker will enable the language matching the current OS locale.

All the required information to generate a context menu is provided in the context-menu event on each webContents instance. A small example of how to make a context menu with this information is provided below.

Although the spellchecker itself does not send any typings, words or user input to Google services the hunspell dictionary files are downloaded from a Google CDN by default. If you want to avoid this you can provide an alternative URL to download the dictionaries from.

Check out the docs for session.setSpellCheckerDictionaryDownloadURL for more information on where to get the dictionary files from and how you need to host them.

**Examples:**

Example 1 (css):
```css
const myWindow = new BrowserWindow({  webPreferences: {    spellcheck: true  }})
```

Example 2 (unknown):
```unknown
// Sets the spellchecker to check English US and FrenchmyWindow.webContents.session.setSpellCheckerLanguages(['en-US', 'fr'])// An array of all available language codesconst possibleLanguages = myWindow.webContents.session.availableSpellCheckerLanguages
```

Example 3 (javascript):
```javascript
const { Menu, MenuItem } = require('electron')myWindow.webContents.on('context-menu', (event, params) => {  const menu = new Menu()  // Add each spelling suggestion  for (const suggestion of params.dictionarySuggestions) {    menu.append(new MenuItem({      label: suggestion,      click: () => myWindow.webContents.replaceMisspelling(suggestion)    }))  }  // Allow users to add the misspelled word to the dictionary  if (params.misspelledWord) {    menu.append(      new MenuItem({        label: 'Add to dictionary',        click: () => myWindow.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord)      })    )  }  menu.popup()})
```

Example 4 (unknown):
```unknown
myWindow.webContents.session.setSpellCheckerDictionaryDownloadURL('https://example.com/dictionaries/')
```

---

## Electron Versioning

**URL:** https://www.electronjs.org/docs/latest/tutorial/electron-versioning

**Contents:**
- Electron Versioning
- Versioning scheme​
- SemVer​
- Stabilization branches​
- Beta releases and bug fixes​
  - Backport request process​
- Feature flags​
- Semantic commits​
- Versioned main branch​
- Historical versioning (Electron 1.X)​

A detailed look at our versioning policy and implementation.

As of version 2.0.0, Electron follows the SemVer spec. The following command will install the most recent stable build of Electron:

To update an existing project to use the latest stable version:

There are several major changes from our 1.x strategy outlined below. Each change is intended to satisfy the needs and priorities of developers/maintainers and app developers.

We will cover in detail how git branching works, how npm tagging works, what developers should expect to see, and how one can backport changes.

Below is a table explicitly mapping types of changes to their corresponding category of SemVer (e.g. Major, Minor, Patch).

For more information, see the Semantic Versioning 2.0.0 spec.

Note that most Chromium updates will be considered breaking. Fixes that can be backported will likely be cherry-picked as patches.

Stabilization branches are branches that run parallel to main, taking in only cherry-picked commits that are related to security or stability. These branches are never merged back to main.

Since Electron 8, stabilization branches are always major version lines, and named against the following template $MAJOR-x-y e.g. 8-x-y. Prior to that we used minor version lines and named them as $MAJOR-$MINOR-x e.g. 2-0-x.

We allow for multiple stabilization branches to exist simultaneously, one for each supported version. For more details on which versions are supported, see our Electron Releases doc.

Older lines will not be supported by the Electron project, but other groups can take ownership and backport stability and security fixes on their own. We discourage this, but recognize that it makes life easier for many app developers.

Developers want to know which releases are safe to use. Even seemingly innocent features can introduce regressions in complex applications. At the same time, locking to a fixed version is dangerous because you’re ignoring security patches and bug fixes that may have come out since your version. Our goal is to allow the following standard semver ranges in package.json :

What’s important about the second point is that apps using ^ should still be able to expect a reasonable level of stability. To accomplish this, SemVer allows for a pre-release identifier to indicate a particular version is not yet safe or stable.

Whatever you choose, you will periodically have to bump the version in your package.json as breaking changes are a fact of Chromium life.

The process is as follows:

Specifically, the above means:

For each major and minor bump, you should expect to see something like the following:

An example lifecycle in pictures:

A few examples of how various SemVer ranges will pick up new releases:

All supported release lines will accept external pull requests to backport fixes previously merged to main, though this may be on a case-by-case basis for some older supported lines. All contested decisions around release line backports will be resolved by the Releases Working Group as an agenda item at their weekly meeting the week the backport PR is raised.

Feature flags are a common practice in Chromium, and are well-established in the web-development ecosystem. In the context of Electron, a feature flag or soft branch must have the following properties:

All pull requests must adhere to the Conventional Commits spec, which can be summarized as follows:

The electron/electron repository also enforces squash merging, so you only need to make sure that your pull request has the correct title prefix.

Electron versions < 2.0 did not conform to the SemVer spec: major versions corresponded to end-user API changes, minor versions corresponded to Chromium major releases, and patch versions corresponded to new features and bug fixes. While convenient for developers merging features, it creates problems for developers of client-facing applications. The QA testing cycles of major apps like Slack, Teams, VS Code, and GitHub Desktop can be lengthy and stability is a highly desired outcome. There is a high risk in adopting new features while trying to absorb bug fixes.

Here is an example of the 1.x strategy:

An app developed with 1.8.1 cannot take the 1.8.3 bug fix without either absorbing the 1.8.2 feature, or by backporting the fix and maintaining a new release line.

**Examples:**

Example 1 (unknown):
```unknown
npm install --save-dev electron
```

Example 2 (unknown):
```unknown
yarn add --dev electron
```

Example 3 (python):
```python
npm install --save-dev electron@latest
```

Example 4 (python):
```python
yarn add --dev electron@latest
```

---

## Electron Releases

**URL:** https://www.electronjs.org/docs/latest/tutorial/electron-timelines

**Contents:**
- Electron Releases
- Timeline​
- Version support policy​
  - Chromium version support​
  - Node.js version support​
  - Breaking API changes​
  - End-of-life​

Electron frequently releases major versions alongside every other Chromium release. This document focuses on the release cadence and version support policy. For a more in-depth guide on our git branches and how Electron uses semantic versions, check out our Electron Versioning doc.

Electron's official support policy is the latest 3 stable releases. Our stable release and end-of-life dates are determined by Chromium, and may be subject to change. While we try to keep our planned release and end-of-life dates frequently updated here, future dates may change if affected by upstream scheduling changes, and may not always be accurately reflected.See Chromium's public release schedule for definitive information about Chromium's scheduled release dates.

See Chromium's public release schedule for definitive information about Chromium's scheduled release dates.

The latest three stable major versions are supported by the Electron team. For example, if the latest release is 6.1.x, then the 5.0.x as well as the 4.2.x series are supported. We only support the latest minor release for each stable release series. This means that in the case of a security fix, 6.1.x will receive the fix, but we will not release a new version of 6.0.x.

The latest stable release unilaterally receives all fixes from main, and the version prior to that receives the vast majority of those fixes as time and bandwidth warrants. The oldest supported release line will receive only security fixes directly.

Chromium's public release schedule is here.

Electron targets Chromium even-number versions, releasing every 8 weeks in concert with Chromium's 4-week release schedule. For example, Electron 26 uses Chromium 116, while Electron 27 uses Chromium 118.

Electron upgrades its main branch to even-number versions of Node.js when they enter Active LTS. The schedule is as follows:

If Electron has recently updated its main branch to a new major version of Node.js, the next stable branch to be cut will be released with the new version.

Stable release lines of Electron will receive minor and patch bumps of Node.js after they are released. Patch bumps to Node.js will be released in patch releases of Electron, and minor bumps to Node.js will result in a minor release of Electron. Security-only release branches will receive security-related changes from Node.js releases, but not the full release.

When an API is changed or removed in a way that breaks existing functionality, the previous functionality will be supported for a minimum of two major versions when possible before being removed. For example, if a function takes three arguments, and that number is reduced to two in major version 10, the three-argument version would continue to work until, at minimum, major version 12. Past the minimum two-version threshold, we will attempt to support backwards compatibility beyond two versions until the maintainers feel the maintenance burden is too high to continue doing so.

When a release branch reaches the end of its support cycle, the series will be deprecated in NPM and a final end-of-support release will be made. This release will add a warning to inform that an unsupported version of Electron is in use.

These steps are to help app developers learn when a branch they're using becomes unsupported, but without being excessively intrusive to end users.

If an application has exceptional circumstances and needs to stay on an unsupported series of Electron, developers can silence the end-of-support warning by omitting the final release from the app's package.json devDependencies. For example, since the 1-6-x series ended with an end-of-support 1.6.18 release, developers could choose to stay in the 1-6-x series without warnings with devDependency of "electron": 1.6.0 - 1.6.17.

---

## Packaging Your Application

**URL:** https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging

**Contents:**
- Packaging Your Application
- Learning goals​
- Using Electron Forge​
  - Importing your project into Forge​
  - Creating a distributable​
- Important: signing your code​
- Summary​

This is part 5 of the Electron tutorial. Prerequisites Building your First App Using Preload Scripts Adding Features Packaging Your Application Publishing and Updating

In this part of the tutorial, we'll be going over the basics of packaging and distributing your app with Electron Forge.

Electron does not have any tooling for packaging and distribution bundled into its core modules. Once you have a working Electron app in dev mode, you need to use additional tooling to create a packaged app you can distribute to your users (also known as a distributable). Distributables can be either installers (e.g. MSI on Windows) or portable executable files (e.g. .app on macOS).

Electron Forge is an all-in-one tool that handles the packaging and distribution of Electron apps. Under the hood, it combines a lot of existing Electron tools (e.g. @electron/packager, @electron/osx-sign, electron-winstaller, etc.) into a single interface so you do not have to worry about wiring them all together.

You can install Electron Forge's CLI in your project's devDependencies and import your existing project with a handy conversion script.

Once the conversion script is done, Forge should have added a few scripts to your package.json file.

For more information on make and other Forge APIs, check out the Electron Forge CLI documentation.

You should also notice that your package.json now has a few more packages installed under devDependencies, and a new forge.config.js file that exports a configuration object. You should see multiple makers (packages that generate distributable app bundles) in the pre-populated configuration, one for each target platform.

To create a distributable, use your project's new make script, which runs the electron-forge make command.

This make command contains two steps:

After the script runs, you should see an out folder containing both the distributable and a folder containing the packaged application code.

The distributable in the out/make folder should be ready to launch! You have now created your first bundled Electron application.

Electron Forge can be configured to create distributables in different OS-specific formats (e.g. DMG, deb, MSI, etc.). See Forge's Makers documentation for all configuration options.

Setting custom application icons requires a few additions to your config. Check out Forge's icon tutorial for more information.

If you want to manually package your code, or if you're just interested understanding the mechanics behind packaging an Electron app, check out the full Application Packaging documentation.

In order to distribute desktop applications to end users, we highly recommend that you code sign your Electron app. Code signing is an important part of shipping desktop applications, and is mandatory for the auto-update step in the final part of the tutorial.

Code signing is a security technology that you use to certify that a desktop app was created by a known source. Windows and macOS have their own OS-specific code signing systems that will make it difficult for users to download or launch unsigned applications.

On macOS, code signing is done at the app packaging level. On Windows, distributable installers are signed instead. If you already have code signing certificates for Windows and macOS, you can set your credentials in your Forge configuration.

For more information on code signing, check out the Signing macOS Apps guide in the Forge docs.

Electron applications need to be packaged to be distributed to users. In this tutorial, you imported your app into Electron Forge and configured it to package your app and generate installers.

In order for your application to be trusted by the user's system, you need to digitally certify that the distributable is authentic and untampered by code signing it. Your app can be signed through Forge once you configure it to use your code signing certificate information.

**Examples:**

Example 1 (python):
```python
npm install --save-dev @electron-forge/clinpx electron-forge import
```

Example 2 (python):
```python
npm install --save-dev @electron-forge/cliyarn dlx electron-forge import
```

Example 3 (json):
```json
//...  "scripts": {    "start": "electron-forge start",    "package": "electron-forge package",    "make": "electron-forge make"  },  //...
```

Example 4 (unknown):
```unknown
npm run make
```

---

## Advanced Installation Instructions

**URL:** https://www.electronjs.org/docs/latest/tutorial/installation

**Contents:**
- Advanced Installation Instructions
- Running Electron ad-hoc​
- Customization​
- Proxies​
- Custom Mirrors and Caches​
  - Mirror​
  - Cache​
- Postinstall script​
- Troubleshooting​

To install prebuilt Electron binaries, use npm. The preferred method is to install Electron as a development dependency in your app:

See the Electron versioning doc for info on how to manage Electron versions in your apps.

If you're in a pinch and would prefer to not use npm install in your local project, you can also run Electron ad-hoc using the npx command runner bundled with npm:

The above command will run the current working directory with Electron. Note that any dependencies in your app will not be installed.

If you want to change the architecture that is downloaded (e.g., x64 on an arm64 machine), you can use the --arch flag with npm install or set the npm_config_arch environment variable:

In addition to changing the architecture, you can also specify the platform (e.g., win32, linux, etc.) using the --platform flag:

If you need to use an HTTP proxy, you need to set the ELECTRON_GET_USE_PROXY variable to any value, plus additional environment variables depending on your host system's Node version:

During installation, the electron module will call out to @electron/get to download prebuilt binaries of Electron for your platform. It will do so by contacting GitHub's release download page (https://github.com/electron/electron/releases/tag/v$VERSION, where $VERSION is the exact version of Electron).

If you are unable to access GitHub or you need to provide a custom build, you can do so by either providing a mirror or an existing cache directory.

You can use environment variables to override the base URL, the path at which to look for Electron binaries, and the binary filename. The URL used by @electron/get is composed as follows:

For instance, to use the China CDN mirror:

By default, ELECTRON_CUSTOM_DIR is set to v$VERSION. To change the format, use the {{ version }} placeholder. For example, version-{{ version }} resolves to version-5.0.0, {{ version }} resolves to 5.0.0, and v{{ version }} is equivalent to the default. As a more concrete example, to use the China non-CDN mirror:

The above configuration will download from URLs such as https://npmmirror.com/mirrors/electron/8.0.0/electron-v8.0.0-linux-x64.zip.

If your mirror serves artifacts with different checksums to the official Electron release you may have to set electron_use_remote_checksums=1 directly, or configure it in a .npmrc file, to force Electron to use the remote SHASUMS256.txt file to verify the checksum instead of the embedded checksums.

Alternatively, you can override the local cache. @electron/get will cache downloaded binaries in a local directory to not stress your network. You can use that cache folder to provide custom builds of Electron or to avoid making contact with the network at all.

On environments that have been using older versions of Electron, you might find the cache also in ~/.electron.

You can also override the local cache location by providing a electron_config_cache environment variable.

The cache contains the version's official zip file as well as a checksum, and is stored as [checksum]/[filename]. A typical cache might look like this:

Under the hood, Electron's JavaScript API binds to a binary that contains its implementations. Because this binary is crucial to the function of any Electron app, it is downloaded by default in the postinstall step every time you install electron from the npm registry.

However, if you want to install your project's dependencies but don't need to use Electron functionality, you can set the ELECTRON_SKIP_BINARY_DOWNLOAD environment variable to prevent the binary from being downloaded. For instance, this feature can be useful in continuous integration environments when running unit tests that mock out the electron module.

When running npm install electron, some users occasionally encounter installation errors.

In almost all cases, these errors are the result of network problems and not actual issues with the electron npm package. Errors like ELIFECYCLE, EAI_AGAIN, ECONNRESET, and ETIMEDOUT are all indications of such network problems. The best resolution is to try switching networks, or wait a bit and try installing again.

You can also attempt to download Electron directly from electron/electron/releases if installing via npm is failing.

If installation fails with an EACCESS error you may need to fix your npm permissions.

If the above error persists, the unsafe-perm flag may need to be set to true:

On slower networks, it may be advisable to use the --verbose flag in order to show download progress:

If you need to force a re-download of the asset and the SHASUM file set the force_no_cache environment variable to true.

**Examples:**

Example 1 (unknown):
```unknown
npm install electron --save-dev
```

Example 2 (unknown):
```unknown
npx electron .
```

Example 3 (shell):
```shell
npm install --arch=x64 electron
```

Example 4 (shell):
```shell
npm install --platform=win32 electron
```

---

## Keyboard Shortcuts

**URL:** https://www.electronjs.org/docs/latest/tutorial/keyboard-shortcuts

**Contents:**
- Keyboard Shortcuts
- Accelerators​
  - Available modifiers​
  - Available key codes​
  - Cross-platform modifiers​
    - Examples​
- Local shortcuts​
- Global shortcuts​
- Shortcuts within a window​
  - In the renderer process​

Accelerators are strings that can be used to represent keyboard shortcuts throughout your Electron. These strings can contain multiple modifiers keys and a single key code joined by the + character.

Accelerators are case-insensitive.

Many modifier accelerators map to different keys between operating systems.

Here are some examples of cross-platform Electron accelerators for common editing operations:

Local keyboard shortcuts are triggered only when the application is focused. These shortcuts map to specific menu items within the app's main application menu.

To define a local keyboard shortcut, you need to configure the accelerator property when creating a MenuItem. Then, the click event associated to that menu item will trigger upon using that accelerator.

In the above example, a native "Hello World" dialog will open when pressing ⌘ Cmd+⌥ Opt+R on macOS or Ctrl+Alt+R on other platforms.

Accelerators can work even when menu items are hidden. On macOS, this feature can be disabled by setting acceleratorWorksWhenHidden: false when building a MenuItem.

On Windows and Linux, the registerAccelerator property of the MenuItem can be set to false so that the accelerator is visible in the system menu but not enabled.

Global keyboard shortcuts work even when your app is out of focus. To configure a global keyboard shortcut, you can use the globalShortcut.register function to specify shortcuts.

To later unregister a shortcut, you can use the globalShortcut.unregisterAccelerator function.

On macOS, there's a long-standing bug with globalShortcut that prevents it from working with keyboard layouts other than QWERTY (electron/electron#19747).

If you want to handle keyboard shortcuts within a BaseWindow, you can listen for the keyup and keydown DOM Events inside the renderer process using the addEventListener API.

The third parameter true indicates that the listener will always receive key presses before other listeners so they can't have stopPropagation() called on them.

The before-input-event event is emitted before dispatching keydown and keyup events in the renderer process. It can be used to catch and handle custom shortcuts that are not visible in the menu.

**Examples:**

Example 1 (javascript):
```javascript
const { dialog, Menu, MenuItem } = require('electron/main')const menu = new Menu()// The first submenu needs to be the app menu on macOSif (process.platform === 'darwin') {  const appMenu = new MenuItem({ role: 'appMenu' })  menu.append(appMenu)}const submenu = Menu.buildFromTemplate([{  label: 'Open a Dialog',  click: () => dialog.showMessageBox({ message: 'Hello World!' }),  accelerator: 'CommandOrControl+Alt+R'}])menu.append(new MenuItem({ label: 'Custom Menu', submenu }))Menu.setApplicationMenu(menu)
```

Example 2 (javascript):
```javascript
const { dialog, globalShortcut } = require('electron/main')globalShortcut.register('CommandOrControl+Alt+R', () => {  dialog.showMessageBox({ message: 'Hello World!' })})
```

Example 3 (javascript):
```javascript
const { globalShortcut } = require('electron/main')globalShortcut.unregister('CommandOrControl+Alt+R')
```

Example 4 (javascript):
```javascript
// Modules to control application life and create native browser windowconst { app, BrowserWindow } = require('electron/main')function createWindow () {  // Create the browser window.  const mainWindow = new BrowserWindow({    width: 800,    height: 600  })  // and load the index.html of the app.  mainWindow.loadFile('index.html')}// This method will be called when Electron has finished// initialization and is ready to create browser windows.// Some APIs can only be used after this event occurs.app.whenReady().then(() => {  createWindow()  app.on('activate', function () {    // On macOS it's common to re-create a window in the app when the    // dock icon is clicked and there are no other windows open.    if (BrowserWindow.getAllWindows().length === 0) createWindow()  })})// Quit when all windows are closed, except on macOS. There, it's common// for applications and their menu bar to stay active until the user quits// explicitly with Cmd + Q.app.on('window-all-closed', function () {  if (process.platform !== 'darwin') app.quit()})
```

---

## Testing on Headless CI Systems (Travis CI, Jenkins)

**URL:** https://www.electronjs.org/docs/latest/tutorial/testing-on-headless-ci

**Contents:**
- Testing on Headless CI Systems (Travis CI, Jenkins)
- Configuring the Virtual Display Server​
  - Travis CI​
  - Jenkins​
  - CircleCI​
  - AppVeyor​

Being based on Chromium, Electron requires a display driver to function. If Chromium can't find a display driver, Electron will fail to launch - and therefore not executing any of your tests, regardless of how you are running them. Testing Electron-based apps on Travis, CircleCI, Jenkins or similar Systems requires therefore a little bit of configuration. In essence, we need to use a virtual display driver.

First, install Xvfb. It's a virtual framebuffer, implementing the X11 display server protocol - it performs all graphical operations in memory without showing any screen output, which is exactly what we need.

Then, create a virtual Xvfb screen and export an environment variable called DISPLAY that points to it. Chromium in Electron will automatically look for $DISPLAY, so no further configuration of your app is required. This step can be automated with Anaïs Betts' xvfb-maybe: Prepend your test commands with xvfb-maybe and the little tool will automatically configure Xvfb, if required by the current system. On Windows or macOS, it will do nothing.

For Travis, see its docs on using Xvfb.

For Jenkins, a Xvfb plugin is available.

CircleCI is awesome and has Xvfb and $DISPLAY already set up, so no further configuration is required.

AppVeyor runs on Windows, supporting Selenium, Chromium, Electron and similar tools out of the box - no configuration is required.

**Examples:**

Example 1 (markdown):
```markdown
## On Windows or macOS, this invokes electron-mocha## On Linux, if we are in a headless environment, this will be equivalent## to xvfb-run electron-mocha ./test/*.jsxvfb-maybe electron-mocha ./test/*.js
```

---

## MessagePorts in Electron

**URL:** https://www.electronjs.org/docs/latest/tutorial/message-ports

**Contents:**
- MessagePorts in Electron
- MessagePorts in the main process​
- Extension: close event​
- Example use cases​
  - Setting up a MessageChannel between two renderers​
  - Worker process​
  - Reply streams​
  - Communicating directly between the main process and the main world of a context-isolated page​

MessagePorts are a web feature that allow passing messages between different contexts. It's like window.postMessage, but on different channels. The goal of this document is to describe how Electron extends the Channel Messaging model, and to give some examples of how you might use MessagePorts in your app.

Here is a very brief example of what a MessagePort is and how it works:

The Channel Messaging API documentation is a great way to learn more about how MessagePorts work.

In the renderer, the MessagePort class behaves exactly as it does on the web. The main process is not a web page, though—it has no Blink integration—and so it does not have the MessagePort or MessageChannel classes. In order to handle and interact with MessagePorts in the main process, Electron adds two new classes: MessagePortMain and MessageChannelMain. These behave similarly to the analogous classes in the renderer.

MessagePort objects can be created in either the renderer or the main process, and passed back and forth using the ipcRenderer.postMessage and WebContents.postMessage methods. Note that the usual IPC methods like send and invoke cannot be used to transfer MessagePorts, only the postMessage methods can transfer MessagePorts.

By passing MessagePorts via the main process, you can connect two pages that might not otherwise be able to communicate (e.g. due to same-origin restrictions).

Electron adds one feature to MessagePort that isn't present on the web, in order to make MessagePorts more useful. That is the close event, which is emitted when the other end of the channel is closed. Ports can also be implicitly closed by being garbage-collected.

In the renderer, you can listen for the close event either by assigning to port.onclose or by calling port.addEventListener('close', ...). In the main process, you can listen for the close event by calling port.on('close', ...).

In this example, the main process sets up a MessageChannel, then sends each port to a different renderer. This allows renderers to send messages to each other without needing to use the main process as an in-between.

Then, in your preload scripts you receive the port through IPC and set up the listeners.

In this example messagePort is bound to the window object directly. It is better to use contextIsolation and set up specific contextBridge calls for each of your expected messages, but for the simplicity of this example we don't. You can find an example of context isolation further down this page at Communicating directly between the main process and the main world of a context-isolated page

That means window.electronMessagePort is globally available and you can call postMessage on it from anywhere in your app to send a message to the other renderer.

In this example, your app has a worker process implemented as a hidden window. You want the app page to be able to communicate directly with the worker process, without the performance overhead of relaying via the main process.

Electron's built-in IPC methods only support two modes: fire-and-forget (e.g. send), or request-response (e.g. invoke). Using MessageChannels, you can implement a "response stream", where a single request responds with a stream of data.

When context isolation is enabled, IPC messages from the main process to the renderer are delivered to the isolated world, rather than to the main world. Sometimes you want to deliver messages to the main world directly, without having to step through the isolated world.

**Examples:**

Example 1 (css):
```css
// MessagePorts are created in pairs. A connected pair of message ports is// called a channel.const channel = new MessageChannel()// The only difference between port1 and port2 is in how you use them. Messages// sent to port1 will be received by port2 and vice-versa.const port1 = channel.port1const port2 = channel.port2// It's OK to send a message on the channel before the other end has registered// a listener. Messages will be queued until a listener is registered.port2.postMessage({ answer: 42 })// Here we send the other end of the channel, port1, to the main process. It's// also possible to send MessagePorts to other frames, or to Web Workers, etc.ipcRenderer.postMessage('port', null, [port1])
```

Example 2 (javascript):
```javascript
// In the main process, we receive the port.ipcMain.on('port', (event) => {  // When we receive a MessagePort in the main process, it becomes a  // MessagePortMain.  const port = event.ports[0]  // MessagePortMain uses the Node.js-style events API, rather than the  // web-style events API. So .on('message', ...) instead of .onmessage = ...  port.on('message', (event) => {    // data is { answer: 42 }    const data = event.data  })  // MessagePortMain queues messages until the .start() method has been called.  port.start()})
```

Example 3 (javascript):
```javascript
const { BrowserWindow, app, MessageChannelMain } = require('electron')app.whenReady().then(async () => {  // create the windows.  const mainWindow = new BrowserWindow({    show: false,    webPreferences: {      contextIsolation: false,      preload: 'preloadMain.js'    }  })  const secondaryWindow = new BrowserWindow({    show: false,    webPreferences: {      contextIsolation: false,      preload: 'preloadSecondary.js'    }  })  // set up the channel.  const { port1, port2 } = new MessageChannelMain()  // once the webContents are ready, send a port to each webContents with postMessage.  mainWindow.once('ready-to-show', () => {    mainWindow.webContents.postMessage('port', null, [port1])  })  secondaryWindow.once('ready-to-show', () => {    secondaryWindow.webContents.postMessage('port', null, [port2])  })})
```

Example 4 (javascript):
```javascript
const { ipcRenderer } = require('electron')ipcRenderer.on('port', e => {  // port received, make it globally available.  window.electronMessagePort = e.ports[0]  window.electronMessagePort.onmessage = messageEvent => {    // handle message  }})
```

---

## Building your First App

**URL:** https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app

**Contents:**
- Building your First App
- Learning goals​
- Setting up your project​
  - Initializing your npm project​
  - Adding a .gitignore​
- Running an Electron app​
- Loading a web page into a BrowserWindow​
  - Importing modules​
  - Writing a reusable function to instantiate windows​
  - Calling your function when the app is ready​

This is part 2 of the Electron tutorial. Prerequisites Building your First App Using Preload Scripts Adding Features Packaging Your Application Publishing and Updating

In this part of the tutorial, you will learn how to set up your Electron project and write a minimal starter application. By the end of this section, you should be able to run a working Electron app in development mode from your terminal.

If you are on a Windows machine, please do not use Windows Subsystem for Linux (WSL) when following this tutorial as you will run into issues when trying to execute the application.

Electron apps are scaffolded using npm, with the package.json file as an entry point. Start by creating a folder and initializing an npm package within it with npm init.

This command will prompt you to configure some fields in your package.json. There are a few rules to follow for the purposes of this tutorial:

Electron's packaging toolchain requires the node_modules folder to be physically on disk in the way that npm installs Node dependencies. By default, Yarn Berry and pnpm both use alternative installation strategies.Therefore, you must set nodeLinker: node-modules in Yarn or nodeLinker: hoisted in pnpm if you are using those package managers.

Therefore, you must set nodeLinker: node-modules in Yarn or nodeLinker: hoisted in pnpm if you are using those package managers.

Then, install Electron into your app's devDependencies, which is the list of external development-only package dependencies not required in production.

This may seem counter-intuitive since your production code is running Electron APIs. Under the hood, Electron's JavaScript API binds to a binary that contains its implementations. The packaging step for Electron handles the bundling of this binary, eliminating the need to specify it as a production dependency.

In order to correctly install Electron, you need to ensure that its postinstall lifecycle script is able to run. This means avoiding the --ignore-scripts flag on npm and allowlisting electron to run build scripts on other package managers.This is likely to change in a future version of Electron. See electron/rfcs#22 for more details.

This is likely to change in a future version of Electron. See electron/rfcs#22 for more details.

Your package.json file should look something like this after initializing your package and installing Electron. You should also now have a node_modules folder containing the Electron executable, as well as a package-lock.json lockfile that specifies the exact dependency versions to install.

If installing Electron directly fails, please refer to our Advanced Installation documentation for instructions on download mirrors, proxies, and troubleshooting steps.

The .gitignore file specifies which files and directories to avoid tracking with Git. You should place a copy of GitHub's Node.js gitignore template into your project's root folder to avoid committing your project's node_modules folder.

Read Electron's process model documentation to better understand how Electron's multiple processes work together.

The main script you defined in package.json is the entry point of any Electron application. This script controls the main process, which runs in a Node.js environment and is responsible for controlling your app's lifecycle, displaying native interfaces, performing privileged operations, and managing renderer processes (more on that later).

Before creating your first Electron app, you will first use a trivial script to ensure your main process entry point is configured correctly. Create a main.js file in the root folder of your project with a single line of code:

Because Electron's main process is a Node.js runtime, you can execute arbitrary Node.js code with the electron command (you can even use it as a REPL). To execute this script, add electron . to the start command in the scripts field of your package.json. This command will tell the Electron executable to look for the main script in the current directory and run it in dev mode.

Your terminal should print out Hello from Electron 👋. Congratulations, you have executed your first line of code in Electron! Next, you will learn how to create user interfaces with HTML and load that into a native window.

In Electron, each window displays a web page that can be loaded either from a local HTML file or a remote web address. For this example, you will be loading in a local file. Start by creating a barebones web page in an index.html file in the root folder of your project:

Now that you have a web page, you can load it into an Electron BrowserWindow. Replace the contents of your main.js file with the following code. We will explain each highlighted block separately.

In the first line, we are importing two Electron modules with CommonJS module syntax:

You might have noticed the capitalization difference between the app and BrowserWindow modules. Electron follows typical JavaScript conventions here, where PascalCase modules are instantiable class constructors (e.g. BrowserWindow, Tray, Notification) whereas camelCase modules are not instantiable (e.g. app, ipcRenderer, webContents).

For better type checking when writing TypeScript code, you can choose to import main process modules from electron/main.const { app, BrowserWindow } = require('electron/main')For more information, see the Process Model docs.

For more information, see the Process Model docs.

ECMAScript modules (i.e. using import to load a module) are supported in Electron as of Electron 28. You can find more information about the state of ESM in Electron and how to use them in our app in our ESM guide.

The createWindow() function loads your web page into a new BrowserWindow instance:

Many of Electron's core modules are Node.js event emitters that adhere to Node's asynchronous event-driven architecture. The app module is one of these emitters.

In Electron, BrowserWindows can only be created after the app module's ready event is fired. You can wait for this event by using the app.whenReady() API and calling createWindow() once its promise is fulfilled.

You typically listen to Node.js events by using an emitter's .on function.+ app.on('ready', () => {- app.whenReady().then(() => { createWindow()})However, Electron exposes app.whenReady() as a helper specifically for the ready event to avoid subtle pitfalls with directly listening to that event in particular. See electron/electron#21972 for details.

However, Electron exposes app.whenReady() as a helper specifically for the ready event to avoid subtle pitfalls with directly listening to that event in particular. See electron/electron#21972 for details.

At this point, running your Electron application's start command should successfully open a window that displays your web page!

Each web page your app displays in a window will run in a separate process called a renderer process (or simply renderer for short). Renderer processes have access to the same JavaScript APIs and tooling you use for typical front-end web development, such as using webpack to bundle and minify your code or React to build your user interfaces.

Application windows behave differently on each operating system. Rather than enforce these conventions by default, Electron gives you the choice to implement them in your app code if you wish to follow them. You can implement basic window conventions by listening for events emitted by the app and BrowserWindow modules.

Checking against Node's process.platform variable can help you to run code conditionally on certain platforms. Note that there are only three possible platforms that Electron can run in: win32 (Windows), linux (Linux), and darwin (macOS).

On Windows and Linux, closing all windows will generally quit an application entirely. To implement this pattern in your Electron app, listen for the app module's window-all-closed event, and call app.quit() to exit your app if the user is not on macOS.

In contrast, macOS apps generally continue running even without any windows open. Activating the app when no windows are available should open a new one.

To implement this feature, listen for the app module's activate event, and call your existing createWindow() method if no BrowserWindows are open.

Because windows cannot be created before the ready event, you should only listen for activate events after your app is initialized. Do this by only listening for activate events inside your existing whenReady() callback.

If you want to debug your application using VS Code, you need to attach VS Code to both the main and renderer processes. Here is a sample configuration for you to run. Create a launch.json configuration in a new .vscode folder in your project:

The "Main + renderer" option will appear when you select "Run and Debug" from the sidebar, allowing you to set breakpoints and inspect all the variables among other things in both the main and renderer processes.

What we have done in the launch.json file is to create 3 configurations:

Because we are attaching to a process in Renderer, it is possible that the first lines of your code will be skipped as the debugger will not have had enough time to connect before they are being executed. You can work around this by refreshing the page or setting a timeout before executing the code in development mode.

If you want to dig deeper in the debugging area, the following guides provide more information: Application Debugging DevTools Extensions

Electron applications are set up using npm packages. The Electron executable should be installed in your project's devDependencies and can be run in development mode using a script in your package.json file.

The executable runs the JavaScript entry point found in the main property of your package.json. This file controls Electron's main process, which runs an instance of Node.js and is responsible for your app's lifecycle, displaying native interfaces, performing privileged operations, and managing renderer processes.

Renderer processes (or renderers for short) are responsible for displaying graphical content. You can load a web page into a renderer by pointing it to either a web address or a local HTML file. Renderers behave very similarly to regular web pages and have access to the same web APIs.

In the next section of the tutorial, we will be learning how to augment the renderer process with privileged APIs and how to communicate between processes.

**Examples:**

Example 1 (unknown):
```unknown
mkdir my-electron-app && cd my-electron-appnpm init
```

Example 2 (unknown):
```unknown
mkdir my-electron-app && cd my-electron-appyarn init
```

Example 3 (unknown):
```unknown
npm install electron --save-dev
```

Example 4 (unknown):
```unknown
yarn add electron --dev
```

---

## Deep Links

**URL:** https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app

**Contents:**
- Deep Links
- Overview​
- Examples​
  - Main Process (main.js)​
    - Windows and Linux code:​
    - MacOS code:​
- Important notes​
  - Packaging​
    - Electron Forge​
    - Electron Packager​

This guide will take you through the process of setting your Electron app as the default handler for a specific protocol.

By the end of this tutorial, we will have set our app to intercept and handle any clicked URLs that start with a specific protocol. In this guide, the protocol we will use will be "electron-fiddle://".

First, we will import the required modules from electron. These modules help control our application lifecycle and create a native browser window.

Next, we will proceed to register our application to handle all "electron-fiddle://" protocols.

We will now define the function in charge of creating our browser window and load our application's index.html file.

In this next step, we will create our BrowserWindow and tell our application how to handle an event in which an external protocol is clicked.

This code will be different in Windows and Linux compared to MacOS. This is due to both platforms emitting the second-instance event rather than the open-url event and Windows requiring additional code in order to open the contents of the protocol link within the same Electron instance. Read more about this here.

Finally, we will add some additional code to handle when someone closes our application.

On macOS and Linux, this feature will only work when your app is packaged. It will not work when you're launching it in development from the command-line. When you package your app you'll need to make sure the macOS Info.plist and the Linux .desktop files for the app are updated to include the new protocol handler. Some of the Electron tools for bundling and distributing apps handle this for you.

If you're using Electron Forge, adjust packagerConfig for macOS support, and the configuration for the appropriate Linux makers for Linux support, in your Forge configuration (please note the following example only shows the bare minimum needed to add the configuration changes):

If you're using Electron Packager's API, adding support for protocol handlers is similar to how Electron Forge is handled, except protocols is part of the Packager options passed to the packager function.

If you're using Electron Packager's CLI, use the --protocol and --protocol-name flags. For example:

After you start your Electron app, you can enter in a URL in your browser that contains the custom protocol, for example "electron-fiddle://open" and observe that the application will respond and show an error dialog box.

**Examples:**

Example 1 (javascript):
```javascript
const { app, BrowserWindow, shell } = require('electron')const path = require('node:path')
```

Example 2 (unknown):
```unknown
if (process.defaultApp) {  if (process.argv.length >= 2) {    app.setAsDefaultProtocolClient('electron-fiddle', process.execPath, [path.resolve(process.argv[1])])  }} else {  app.setAsDefaultProtocolClient('electron-fiddle')}
```

Example 3 (css):
```css
let mainWindowconst createWindow = () => {  // Create the browser window.  mainWindow = new BrowserWindow({    width: 800,    height: 600,    webPreferences: {      preload: path.join(__dirname, 'preload.js')    }  })  mainWindow.loadFile('index.html')}
```

Example 4 (javascript):
```javascript
const gotTheLock = app.requestSingleInstanceLock()if (!gotTheLock) {  app.quit()} else {  app.on('second-instance', (event, commandLine, workingDirectory) => {    // Someone tried to run a second instance, we should focus our window.    if (mainWindow) {      if (mainWindow.isMinimized()) mainWindow.restore()      mainWindow.focus()    }    // the commandLine is array of strings in which last element is deep link url    dialog.showErrorBox('Welcome Back', `You arrived from: ${commandLine.pop()}`)  })  // Create mainWindow, load the rest of the app, etc...  app.whenReady().then(() => {    createWindow()  })}
```

---

## REPL

**URL:** https://www.electronjs.org/docs/latest/tutorial/repl

**Contents:**
- REPL
- Main process​
- Renderer process​

Read-Eval-Print-Loop (REPL) is a simple, interactive computer programming environment that takes single user inputs (i.e. single expressions), evaluates them, and returns the result to the user.

Electron exposes the Node.js repl module through the --interactive CLI flag. Assuming you have electron installed as a local project dependency, you should be able to access the REPL with the following command:

electron --interactive is not available on Windows (see electron/electron#5776 for more details).

You can use the DevTools Console tab to get a REPL for any renderer process. To learn more, read the Chrome documentation.

**Examples:**

Example 1 (unknown):
```unknown
./node_modules/.bin/electron --interactive
```

---

## Security

**URL:** https://www.electronjs.org/docs/latest/tutorial/security

**Contents:**
- Security
- Preface​
- General guidelines​
  - Security is everyone's responsibility​
  - Isolation for untrusted content​
- Checklist: Security recommendations​
  - 1. Only load secure content​
    - Why?​
    - How?​
  - 2. Do not enable Node.js integration for remote content​

For information on how to properly disclose an Electron vulnerability, see SECURITY.md.For upstream Chromium vulnerabilities: Electron keeps up to date with alternating Chromium releases. For more information, see the Electron Release Timelines document.

For upstream Chromium vulnerabilities: Electron keeps up to date with alternating Chromium releases. For more information, see the Electron Release Timelines document.

As web developers, we usually enjoy the strong security net of the browser — the risks associated with the code we write are relatively small. Our websites are granted limited powers in a sandbox, and we trust that our users enjoy a browser built by a large team of engineers that is able to quickly respond to newly discovered security threats.

When working with Electron, it is important to understand that Electron is not a web browser. It allows you to build feature-rich desktop applications with familiar web technologies, but your code wields much greater power. JavaScript can access the filesystem, user shell, and more. This allows you to build high quality native applications, but the inherent security risks scale with the additional powers granted to your code.

With that in mind, be aware that displaying arbitrary content from untrusted sources poses a severe security risk that Electron is not intended to handle. In fact, the most popular Electron apps (Atom, Slack, Visual Studio Code, etc) display primarily local content (or trusted, secure remote content without Node integration) — if your application executes code from an online source, it is your responsibility to ensure that the code is not malicious.

It is important to remember that the security of your Electron application is the result of the overall security of the framework foundation (Chromium, Node.js), Electron itself, all NPM dependencies and your code. As such, it is your responsibility to follow a few important best practices:

Keep your application up-to-date with the latest Electron framework release. When releasing your product, you’re also shipping a bundle composed of Electron, Chromium shared library and Node.js. Vulnerabilities affecting these components may impact the security of your application. By updating Electron to the latest version, you ensure that critical vulnerabilities (such as nodeIntegration bypasses) are already patched and cannot be exploited in your application. For more information, see "Use a current version of Electron".

Evaluate your dependencies. While NPM provides half a million reusable packages, it is your responsibility to choose trusted 3rd-party libraries. If you use outdated libraries affected by known vulnerabilities or rely on poorly maintained code, your application security could be in jeopardy.

Adopt secure coding practices. The first line of defense for your application is your own code. Common web vulnerabilities, such as Cross-Site Scripting (XSS), have a higher security impact on Electron applications hence it is highly recommended to adopt secure software development best practices and perform security testing.

A security issue exists whenever you receive code from an untrusted source (e.g. a remote server) and execute it locally. As an example, consider a remote website being displayed inside a default BrowserWindow. If an attacker somehow manages to change said content (either by attacking the source directly, or by sitting between your app and the actual destination), they will be able to execute native code on the user's machine.

Under no circumstances should you load and execute remote code with Node.js integration enabled. Instead, use only local files (packaged together with your application) to execute Node.js code. To display remote content, use the <webview> tag or a WebContentsView and make sure to disable the nodeIntegration and enable contextIsolation.

Security warnings and recommendations are printed to the developer console. They only show up when the binary's name is Electron, indicating that a developer is currently looking at the console.You can force-enable or force-disable these warnings by setting ELECTRON_ENABLE_SECURITY_WARNINGS or ELECTRON_DISABLE_SECURITY_WARNINGS on either process.env or the window object.

You can force-enable or force-disable these warnings by setting ELECTRON_ENABLE_SECURITY_WARNINGS or ELECTRON_DISABLE_SECURITY_WARNINGS on either process.env or the window object.

You should at least follow these steps to improve the security of your application:

Any resources not included with your application should be loaded using a secure protocol like HTTPS. In other words, do not use insecure protocols like HTTP. Similarly, we recommend the use of WSS over WS, FTPS over FTP, and so on.

HTTPS has two main benefits:

This recommendation is the default behavior in Electron since 5.0.0.

It is paramount that you do not enable Node.js integration in any renderer (BrowserWindow, WebContentsView, or <webview>) that loads remote content. The goal is to limit the powers you grant to remote content, thus making it dramatically more difficult for an attacker to harm your users should they gain the ability to execute JavaScript on your website.

After this, you can grant additional permissions for specific hosts. For example, if you are opening a BrowserWindow pointed at https://example.com/, you can give that website exactly the abilities it needs, but no more.

A cross-site-scripting (XSS) attack is more dangerous if an attacker can jump out of the renderer process and execute code on the user's computer. Cross-site-scripting attacks are fairly common - and while an issue, their power is usually limited to messing with the website that they are executed on. Disabling Node.js integration helps prevent an XSS from being escalated into a so-called "Remote Code Execution" (RCE) attack.

When disabling Node.js integration, you can still expose APIs to your website that do consume Node.js modules or features. Preload scripts continue to have access to require and other Node.js features, allowing developers to expose a custom API to remotely loaded content via the contextBridge API.

Context Isolation is the default behavior in Electron since 12.0.0.

Context isolation is an Electron feature that allows developers to run code in preload scripts and in Electron APIs in a dedicated JavaScript context. In practice, that means that global objects like Array.prototype.push or JSON.parse cannot be modified by scripts running in the renderer process.

Electron uses the same technology as Chromium's Content Scripts to enable this behavior.

Even when nodeIntegration: false is used, to truly enforce strong isolation and prevent the use of Node primitives contextIsolation must also be used.

Beware that disabling context isolation for a renderer process by setting nodeIntegration: true also disables process sandboxing for that process. See section below.

For more information on what contextIsolation is and how to enable it please see our dedicated Context Isolation document.

This recommendation is the default behavior in Electron since 20.0.0.Additionally, process sandboxing can be enforced for all renderer processes application wide: Enabling the sandbox globallyDisabling context isolation (see above) also disables process sandboxing, regardless of the default, sandbox: false or globally enabled sandboxing!

Additionally, process sandboxing can be enforced for all renderer processes application wide: Enabling the sandbox globallyDisabling context isolation (see above) also disables process sandboxing, regardless of the default, sandbox: false or globally enabled sandboxing!

Disabling context isolation (see above) also disables process sandboxing, regardless of the default, sandbox: false or globally enabled sandboxing!

Sandboxing is a Chromium feature that uses the operating system to significantly limit what renderer processes have access to. You should enable the sandbox in all renderers. Loading, reading or processing any untrusted content in an unsandboxed process, including the main process, is not advised.

For more information on what Process Sandboxing is and how to enable it please see our dedicated Process Sandboxing document.

You may have seen permission requests while using Chrome: they pop up whenever the website attempts to use a feature that the user has to manually approve ( like notifications).

The API is based on the Chromium permissions API and implements the same types of permissions.

By default, Electron will automatically approve all permission requests unless the developer has manually configured a custom handler. While a solid default, security-conscious developers might want to assume the very opposite.

This recommendation is Electron's default.

You may have already guessed that disabling the webSecurity property on a renderer process (BrowserWindow, WebContentsView, or <webview>) disables crucial security features.

Do not disable webSecurity in production applications.

Disabling webSecurity will disable the same-origin policy and set allowRunningInsecureContent property to true. In other words, it allows the execution of insecure code from different domains.

A Content Security Policy (CSP) is an additional layer of protection against cross-site-scripting attacks and data injection attacks. We recommend that they be enabled by any website you load inside Electron.

CSP allows the server serving content to restrict and control the resources Electron can load for that given web page. https://example.com should be allowed to load scripts from the origins you defined while scripts from https://evil.attacker.com should not be allowed to run. Defining a CSP is an easy way to improve your application's security.

The following CSP will allow Electron to execute scripts from the current website and from apis.example.com.

Electron respects the Content-Security-Policy HTTP header which can be set using Electron's webRequest.onHeadersReceived handler:

CSP's preferred delivery mechanism is an HTTP header. However, it is not possible to use this method when loading a resource using the file:// protocol. It can be useful in some cases to set a policy on a page directly in the markup using a <meta> tag:

This recommendation is Electron's default.

By default, Electron will not allow websites loaded over HTTPS to load and execute scripts, CSS, or plugins from insecure sources (HTTP). Setting the property allowRunningInsecureContent to true disables that protection.

Loading the initial HTML of a website over HTTPS and attempting to load subsequent resources via HTTP is also known as "mixed content".

Loading content over HTTPS assures the authenticity and integrity of the loaded resources while encrypting the traffic itself. See the section on only displaying secure content for more details.

This recommendation is Electron's default.

Advanced users of Electron can enable experimental Chromium features using the experimentalFeatures property.

Experimental features are, as the name suggests, experimental and have not been enabled for all Chromium users. Furthermore, their impact on Electron as a whole has likely not been tested.

Legitimate use cases exist, but unless you know what you are doing, you should not enable this property.

This recommendation is Electron's default.

Blink is the name of the rendering engine behind Chromium. As with experimentalFeatures, the enableBlinkFeatures property allows developers to enable features that have been disabled by default.

Generally speaking, there are likely good reasons if a feature was not enabled by default. Legitimate use cases for enabling specific features exist. As a developer, you should know exactly why you need to enable a feature, what the ramifications are, and how it impacts the security of your application. Under no circumstances should you enable features speculatively.

This recommendation is Electron's default.

If you are using <webview>, you might need the pages and scripts loaded in your <webview> tag to open new windows. The allowpopups attribute enables them to create new BrowserWindows using the window.open() method. <webview> tags are otherwise not allowed to create new windows.

If you do not need popups, you are better off not allowing the creation of new BrowserWindows by default. This follows the principle of minimally required access: Don't let a website create new popups unless you know it needs that feature.

A WebView created in a renderer process that does not have Node.js integration enabled will not be able to enable integration itself. However, a WebView will always create an independent renderer process with its own webPreferences.

It is a good idea to control the creation of new <webview> tags from the main process and to verify that their webPreferences do not disable security features.

Since <webview> live in the DOM, they can be created by a script running on your website even if Node.js integration is otherwise disabled.

Electron enables developers to disable various security features that control a renderer process. In most cases, developers do not need to disable any of those features - and you should therefore not allow different configurations for newly created <webview> tags.

Before a <webview> tag is attached, Electron will fire the will-attach-webview event on the hosting webContents. Use the event to prevent the creation of webViews with possibly insecure options.

Again, this list merely minimizes the risk, but does not remove it. If your goal is to display a website, a browser will be a more secure option.

If your app has no need to navigate or only needs to navigate to known pages, it is a good idea to limit navigation outright to that known scope, disallowing any other kinds of navigation.

Navigation is a common attack vector. If an attacker can convince your app to navigate away from its current page, they can possibly force your app to open web sites on the Internet. Even if your webContents are configured to be more secure (like having nodeIntegration disabled or contextIsolation enabled), getting your app to open a random web site will make the work of exploiting your app a lot easier.

A common attack pattern is that the attacker convinces your app's users to interact with the app in such a way that it navigates to one of the attacker's pages. This is usually done via links, plugins, or other user-generated content.

If your app has no need for navigation, you can call event.preventDefault() in a will-navigate handler. If you know which pages your app might navigate to, check the URL in the event handler and only let navigation occur if it matches the URLs you're expecting.

We recommend that you use Node's parser for URLs. Simple string comparisons can sometimes be fooled - a startsWith('https://example.com') test would let https://example.com.attacker.com through.

If you have a known set of windows, it's a good idea to limit the creation of additional windows in your app.

Much like navigation, the creation of new webContents is a common attack vector. Attackers attempt to convince your app to create new windows, frames, or other renderer processes with more privileges than they had before; or with pages opened that they couldn't open before.

If you have no need to create windows in addition to the ones you know you'll need to create, disabling the creation buys you a little bit of extra security at no cost. This is commonly the case for apps that open one BrowserWindow and do not need to open an arbitrary number of additional windows at runtime.

webContents will delegate to its window open handler before creating new windows. The handler will receive, amongst other parameters, the url the window was requested to open and the options used to create it. We recommend that you register a handler to monitor the creation of windows, and deny any unexpected window creation.

The shell module's openExternal API allows opening a given protocol URI with the desktop's native utilities. On macOS, for instance, this function is similar to the open terminal command utility and will open the specific application based on the URI and filetype association.

Improper use of openExternal can be leveraged to compromise the user's host. When openExternal is used with untrusted content, it can be leveraged to execute arbitrary commands.

You should strive for always using the latest available version of Electron. Whenever a new major version is released, you should attempt to update your app as quickly as possible.

An application built with an older version of Electron, Chromium, and Node.js is an easier target than an application that is using more recent versions of those components. Generally speaking, security issues and exploits for older versions of Chromium and Node.js are more widely available.

Both Chromium and Node.js are impressive feats of engineering built by thousands of talented developers. Given their popularity, their security is carefully tested and analyzed by equally skilled security researchers. Many of those researchers disclose vulnerabilities responsibly, which generally means that researchers will give Chromium and Node.js some time to fix issues before publishing them. Your application will be more secure if it is running a recent version of Electron (and thus, Chromium and Node.js) for which potential security issues are not as widely known.

Migrate your app one major version at a time, while referring to Electron's Breaking Changes document to see if any code needs to be updated.

You should always validate incoming IPC messages sender property to ensure you aren't performing actions or sending information to untrusted renderers.

All Web Frames can in theory send IPC messages to the main process, including iframes and child windows in some scenarios. If you have an IPC message that returns user data to the sender via event.reply or performs privileged actions that the renderer can't natively, you should ensure you aren't listening to third party web frames.

You should be validating the sender of all IPC messages by default.

You should serve local pages from a custom protocol instead of the file:// protocol.

The file:// protocol gets more privileges in Electron than in a web browser and even in browsers it is treated differently to http/https URLs. Using a custom protocol allows you to be more aligned with classic web url behavior while retaining even more control about what can be loaded and when.

Pages running on file:// have unilateral access to every file on your machine meaning that XSS issues can be used to load arbitrary files from the users machine. Using a custom protocol prevents issues like this as you can limit the protocol to only serving a specific set of files.

Follow the protocol.handle examples to learn how to serve files / content from a custom protocol.

Electron ships with a number of options that can be useful but a large portion of applications probably don't need. In order to avoid having to build your own version of Electron, these can be turned off or on using Fuses.

Some fuses, like runAsNode and nodeCliInspect, allow the application to behave differently when run from the command line using specific environment variables or CLI arguments. These can be used to execute commands on the device through your application.

This can let external scripts run commands that they potentially would not be allowed to, but that your application might have the rights for.

@electron/fuses is a module we made to make flipping these fuses easy. Check out the README of that module for more details on usage and potential error cases, and refer to How do I flip fuses? in our documentation.

You should not directly expose Electron's APIs, especially IPC, to untrusted web content in your preload scripts.

Exposing raw APIs like ipcRenderer.on is dangerous because it gives renderer processes direct access to the entire IPC event system, allowing them to listen for any IPC events, not just the ones intended for them.

To avoid that exposure, we also cannot pass callbacks directly through: The first argument to IPC event callbacks is an IpcRendererEvent object, which includes properties like sender that provide access to the underlying ipcRenderer instance. Even if you only listen for specific events, passing the callback directly means the renderer gets access to this event object.

In short, we want the untrusted web content to only have access to necessary information and APIs.

For more information on what contextIsolation is and how to use it to secure your app, please see the Context Isolation document.

**Examples:**

Example 1 (unknown):
```unknown
// BadbrowserWindow.loadURL('http://example.com')// GoodbrowserWindow.loadURL('https://example.com')
```

Example 2 (html):
```html
<!-- Bad --><script crossorigin src="http://example.com/react.js"></script><link rel="stylesheet" href="http://example.com/style.css"><!-- Good --><script crossorigin src="https://example.com/react.js"></script><link rel="stylesheet" href="https://example.com/style.css">
```

Example 3 (css):
```css
// Badconst mainWindow = new BrowserWindow({  webPreferences: {    contextIsolation: false,    nodeIntegration: true,    nodeIntegrationInWorker: true  }})mainWindow.loadURL('https://example.com')
```

Example 4 (css):
```css
// Goodconst mainWindow = new BrowserWindow({  webPreferences: {    preload: path.join(app.getAppPath(), 'preload.js')  }})mainWindow.loadURL('https://example.com')
```

---

## Online/Offline Event Detection

**URL:** https://www.electronjs.org/docs/latest/tutorial/online-offline-events

**Contents:**
- Online/Offline Event Detection
- Overview​
- Main Process Detection​
- Renderer Process Example​

Online and offline event detection can be implemented in both the main and renderer processes:

The navigator.onLine attribute returns:

Since many cases return true, you should treat with care situations of getting false positives, as we cannot always assume that true value means that Electron can access the Internet. For example, in cases when the computer is running a virtualization software that has virtual Ethernet adapters in "always connected" state. Therefore, if you want to determine the Internet access status of Electron, you should develop additional means for this check.

In the main process, you can use the net module to detect online/offline status:

Both net.isOnline() and net.online return the same boolean value with the same reliability characteristics as navigator.onLine - they provide a strong indicator when offline (false), but a true value doesn't guarantee successful internet connectivity.

The net module is only available after the app emits the ready event.

Starting with an HTML file index.html, this example will demonstrate how the navigator.onLine API can be used to build a connection status indicator.

In order to mutate the DOM, create a renderer.js file that adds event listeners to the 'online' and 'offline' window events. The event handler sets the content of the <strong id='status'> element depending on the result of navigator.onLine.

Finally, create a main.js file for main process that creates the window.

After launching the Electron application, you should see the notification:

If you need to check the connection status in the main process, you can use net.isOnline() directly instead of communicating from the renderer process via IPC.

**Examples:**

Example 1 (javascript):
```javascript
const { net } = require('electron')// Method 1: Using net.isOnline()const isOnline = net.isOnline()console.log('Online status:', isOnline)// Method 2: Using net.online propertyconsole.log('Online status:', net.online)
```

Example 2 (html):
```html
<!DOCTYPE html><html><head>    <meta charset="UTF-8">    <title>Hello World!</title>    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" /></head><body>    <h1>Connection status: <strong id='status'></strong></h1>    <script src="renderer.js"></script></body></html>
```

Example 3 (javascript):
```javascript
const updateOnlineStatus = () => {  document.getElementById('status').innerHTML = navigator.onLine ? 'online' : 'offline'}window.addEventListener('online', updateOnlineStatus)window.addEventListener('offline', updateOnlineStatus)updateOnlineStatus()
```

Example 4 (javascript):
```javascript
const { app, BrowserWindow } = require('electron')const createWindow = () => {  const onlineStatusWindow = new BrowserWindow()  onlineStatusWindow.loadFile('index.html')}app.whenReady().then(() => {  createWindow()  app.on('activate', () => {    if (BrowserWindow.getAllWindows().length === 0) {      createWindow()    }  })})app.on('window-all-closed', () => {  if (process.platform !== 'darwin') {    app.quit()  }})
```

---

## Application Menu

**URL:** https://www.electronjs.org/docs/latest/tutorial/application-menu

**Contents:**
- Application Menu
- Building application menus​
  - Using standard OS menu roles​
- Setting window-specific application menus Linux Windows​

Each Electron app has a single top-level application menu.

The application menu can be set by passing a Menu instance into the Menu.setApplicationMenu static function.

When building an application menu in Electron, each top-level array menu item must be a submenu.

Electron will set a default menu for your app if this API is never called. Below is an example of that default menu being created manually using shorthand MenuItem roles.

On macOS, the first submenu of the application menu will always have your application's name as its label. In general, you can populate this submenu by conditionally adding a menu item with the appMenu role.

For additional descriptions of available roles, see the MenuItem roles section of the general Menus guide.

Defining each submenu explicitly can get very verbose. If you want to re-use default submenus in your app, you can use various submenu-related roles provided by Electron.

On macOS, the help role defines a top-level Help submenu that has a search bar for other menu items. It requires items to be added to its submenu to function.

Since the root application menu exists on each BaseWindow on Windows and Linux, you can override it with a window-specific Menu instance via the win.setMenu method.

You can remove a specific window's application menu by calling the win.removeMenu API.

**Examples:**

Example 1 (javascript):
```javascript
const { shell } = require('electron/common')const { app, Menu } = require('electron/main')const isMac = process.platform === 'darwin'const template = [  // { role: 'appMenu' }  ...(isMac    ? [{        label: app.name,        submenu: [          { role: 'about' },          { type: 'separator' },          { role: 'services' },          { type: 'separator' },          { role: 'hide' },          { role: 'hideOthers' },          { role: 'unhide' },          { type: 'separator' },          { role: 'quit' }        ]      }]    : []),  // { role: 'fileMenu' }  {    label: 'File',    submenu: [      isMac ? { role: 'close' } : { role: 'quit' }    ]  },  // { role: 'editMenu' }  {    label: 'Edit',    submenu: [      { role: 'undo' },      { role: 'redo' },      { type: 'separator' },      { role: 'cut' },      { role: 'copy' },      { role: 'paste' },      ...(isMac        ? [            { role: 'pasteAndMatchStyle' },            { role: 'delete' },            { role: 'selectAll' },            { type: 'separator' },            {              label: 'Speech',              submenu: [                { role: 'startSpeaking' },                { role: 'stopSpeaking' }              ]            }          ]        : [            { role: 'delete' },            { type: 'separator' },            { role: 'selectAll' }          ])    ]  },  // { role: 'viewMenu' }  {    label: 'View',    submenu: [      { role: 'reload' },      { role: 'forceReload' },      { role: 'toggleDevTools' },      { type: 'separator' },      { role: 'resetZoom' },      { role: 'zoomIn' },      { role: 'zoomOut' },      { type: 'separator' },      { role: 'togglefullscreen' }    ]  },  // { role: 'windowMenu' }  {    label: 'Window',    submenu: [      { role: 'minimize' },      { role: 'zoom' },      ...(isMac        ? [            { type: 'separator' },            { role: 'front' },            { type: 'separator' },            { role: 'window' }          ]        : [            { role: 'close' }          ])    ]  },  {    role: 'help',    submenu: [      {        label: 'Learn More',        click: async () => {          const { shell } = require('electron')          await shell.openExternal('https://electronjs.org')        }      }    ]  }]const menu = Menu.buildFromTemplate(template)Menu.setApplicationMenu(menu)
```

Example 2 (javascript):
```javascript
const { shell } = require('electron/common')const { app, Menu } = require('electron/main')const template = [  ...(process.platform === 'darwin'    ? [{ role: 'appMenu' }]    : []),  { role: 'fileMenu' },  { role: 'editMenu' },  { role: 'viewMenu' },  { role: 'windowMenu' },  {    role: 'help',    submenu: [      {        label: 'Learn More',        click: async () => {          const { shell } = require('electron')          await shell.openExternal('https://electronjs.org')        }      }    ]  }]const menu = Menu.buildFromTemplate(template)Menu.setApplicationMenu(menu)
```

Example 3 (javascript):
```javascript
const { BrowserWindow, Menu } = require('electron/main')const win = new BrowserWindow()const menu = Menu.buildFromTemplate([  {    label: 'my custom menu',    submenu: [      { role: 'copy' },      { role: 'paste' }    ]  }])win.setMenu(menu)
```

---

## Tray Menu

**URL:** https://www.electronjs.org/docs/latest/tutorial/tray

**Contents:**
- Tray Menu
- Creating a Tray icon​
- Minimizing to tray​
- Attaching a context menu​
- Runnable Fiddle demo​

This guide will take you through the process of creating an icon with its own context menu to the system tray.

The tray icon for your Electron app needs to be created programmatically with an instance of the Tray class. The class constructor requires a single instance of a NativeImage or a path to a compatible icon file.

File formats vary per operating system. For more details, see the Platform Considerations section of the Tray API documentation.

In order to keep the app and the system tray icon alive even when all windows are closed, you need to have a listener for the window-all-closed event on the app module. The base Electron templates generally listen for this event but quit the app on Windows and Linux to emulate standard OS behavior.

You can attach a context menu to the Tray object by passing in a Menu instance into the tray.setContextMenu function.

Unlike with regular context menus, Tray context menus don't need to be manually instrumented using the menu.popup API. Instead, the Tray object handles click events for you (although various click-related events exist on the API for advanced use cases).

To learn more about crafting menus in Electron, see the Menus guide.

The enabled and visibility properties are not available for top-level menu items in the tray on macOS.

Below is a runnable example of attaching various menu items to the Tray's context menu that help control app state and interact with the Tray API itself.

**Examples:**

Example 1 (sql):
```sql
app.on('window-all-closed', () => {  // having this listener active will prevent the app from quitting.})
```

Example 2 (javascript):
```javascript
const { nativeImage } = require('electron/common')const { app, Tray, Menu } = require('electron/main')// save a reference to the Tray object globally to avoid garbage collectionlet tray// 16x16 red circle data URLconst icon = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACTSURBVHgBpZKBCYAgEEV/TeAIjuIIbdQIuUGt0CS1gW1iZ2jIVaTnhw+Cvs8/OYDJA4Y8kR3ZR2/kmazxJbpUEfQ/Dm/UG7wVwHkjlQdMFfDdJMFaACebnjJGyDWgcnZu1/lrCrl6NCoEHJBrDwEr5NrT6ko/UV8xdLAC2N49mlc5CylpYh8wCwqrvbBGLoKGvz8Bfq0QPWEUo/EAAAAASUVORK5CYII=')// The Tray can only be instantiated after the 'ready' event is firedapp.whenReady().then(() => {  tray = new Tray(icon)  const contextMenu = Menu.buildFromTemplate([    { role: 'quit' }  ])  tray.setContextMenu(contextMenu)})
```

Example 3 (javascript):
```javascript
const { app, BrowserWindow, Menu, Tray } = require('electron/main')const { nativeImage } = require('electron/common')// save a reference to the Tray object globally to avoid garbage collectionlet tray = nullfunction createWindow () {  const mainWindow = new BrowserWindow()  mainWindow.loadFile('index.html')}// The Tray object can only be instantiated after the 'ready' event is firedapp.whenReady().then(() => {  createWindow()  const red = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACTSURBVHgBpZKBCYAgEEV/TeAIjuIIbdQIuUGt0CS1gW1iZ2jIVaTnhw+Cvs8/OYDJA4Y8kR3ZR2/kmazxJbpUEfQ/Dm/UG7wVwHkjlQdMFfDdJMFaACebnjJGyDWgcnZu1/lrCrl6NCoEHJBrDwEr5NrT6ko/UV8xdLAC2N49mlc5CylpYh8wCwqrvbBGLoKGvz8Bfq0QPWEUo/EAAAAASUVORK5CYII=')  const green = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACOSURBVHgBpZLRDYAgEEOrEzgCozCCGzkCbKArOIlugJvgoRAUNcLRpvGH19TkgFQWkqIohhK8UEaKwKcsOg/+WR1vX+AlA74u6q4FqgCOSzwsGHCwbKliAF89Cv89tWmOT4VaVMoVbOBrdQUz+FrD6XItzh4LzYB1HFJ9yrEkZ4l+wvcid9pTssh4UKbPd+4vED2Nd54iAAAAAElFTkSuQmCC')  tray = new Tray(red)  tray.setToolTip('Tray Icon Demo')  const contextMenu = Menu.buildFromTemplate([    {      label: 'Open App',      click: () => {        const wins = BrowserWindow.getAllWindows()        if (wins.length === 0) {          createWindow()        } else {          wins[0].focus()        }      }    },    {      label: 'Set Green Icon',      type: 'checkbox',      click: ({ checked }) => {        checked ? tray.setImage(green) : tray.setImage(red)      }    },    {      label: 'Set Title',      type: 'checkbox',      click: ({ checked }) => {        checked ? tray.setTitle('Title') : tray.setTitle('')      }    },    { role: 'quit' }  ])  tray.setContextMenu(contextMenu)})app.on('window-all-closed', function () {  // This will prevent the app from closing when windows close})app.on('activate', function () {  if (BrowserWindow.getAllWindows().length === 0) createWindow()})
```

Example 4 (html):
```html
<!DOCTYPE html><html>  <head>    <meta charset="UTF-8">    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">    <title>Tray Menu Demo</title>  </head>  <body>    <h1>Tray Menu Demo</h1>    <p>This app will stay running even after all windows are closed.</p>    <ul>      <li>Use the "Open App" menu item to focus the main window (or open one if it does not exist).</li>      <li>Change between red and green Tray icons with the "Set Green Icon" checkbox.</li>      <li>Give the Tray icon a title using the "Set Title" checkbox.</li>      <li>Quit the app using the "Quit" menu item.</li>    </ul>  </body></html>
```

---

## Electron Fuses

**URL:** https://www.electronjs.org/docs/latest/tutorial/fuses

**Contents:**
- Electron Fuses
- What are fuses?​
- Current fuses​
  - runAsNode​
  - cookieEncryption​
  - nodeOptions​
  - nodeCliInspect​
  - embeddedAsarIntegrityValidation​
  - onlyLoadAppFromAsar​
  - loadBrowserProcessSpecificV8Snapshot​

Package time feature toggles

From a security perspective, it makes sense to disable certain unused Electron features that are powerful but may make your app's security posture weaker. For example, any app that doesn't use the ELECTRON_RUN_AS_NODE environment variable would want to disable the feature to prevent a subset of "living off the land" attacks.

We also don't want Electron consumers forking to achieve this goal, as building from source and maintaining a fork is a massive technical challenge and costs a lot of time and money.

Fuses are the solution to this problem. At a high level, they are "magic bits" in the Electron binary that can be flipped when packaging your Electron app to enable or disable certain features/restrictions.

Because they are flipped at package time before you code sign your app, the OS becomes responsible for ensuring those bits aren't flipped back via OS-level code signing validation (e.g. Gatekeeper on macOS or AppLocker on Windows).

@electron/fuses: FuseV1Options.RunAsNode

The runAsNode fuse toggles whether the ELECTRON_RUN_AS_NODE environment variable is respected or not. With this fuse disabled, child_process.fork in the main process will not function as expected, as it depends on this environment variable to function. Instead, we recommend that you use Utility Processes, which work for many use cases where you need a standalone Node.js process (e.g. a SQLite server process).

@electron/fuses: FuseV1Options.EnableCookieEncryption

The cookieEncryption fuse toggles whether the cookie store on disk is encrypted using OS level cryptography keys. By default, the SQLite database that Chromium uses to store cookies stores the values in plaintext. If you wish to ensure your app's cookies are encrypted in the same way Chrome does, then you should enable this fuse. Please note it is a one-way transition—if you enable this fuse, existing unencrypted cookies will be encrypted-on-write, but subsequently disabling the fuse later will make your cookie store corrupt and useless. Most apps can safely enable this fuse.

@electron/fuses: FuseV1Options.EnableNodeOptionsEnvironmentVariable

The nodeOptions fuse toggles whether the NODE_OPTIONS and NODE_EXTRA_CA_CERTS environment variables are respected. The NODE_OPTIONS environment variable can be used to pass all kinds of custom options to the Node.js runtime and isn't typically used by apps in production. Most apps can safely disable this fuse.

@electron/fuses: FuseV1Options.EnableNodeCliInspectArguments

The nodeCliInspect fuse toggles whether the --inspect, --inspect-brk, etc. flags are respected or not. When disabled, it also ensures that SIGUSR1 signal does not initialize the main process inspector. Most apps can safely disable this fuse.

@electron/fuses: FuseV1Options.EnableEmbeddedAsarIntegrityValidation

The embeddedAsarIntegrityValidation fuse toggles a feature on macOS and Windows that validates the content of the app.asar file when it is loaded. This feature is designed to have a minimal performance impact but may marginally slow down file reads from inside the app.asar archive. Most apps can safely enable this fuse.

For more information on how to use ASAR integrity validation, please read the Asar Integrity documentation.

@electron/fuses: FuseV1Options.OnlyLoadAppFromAsar

The onlyLoadAppFromAsar fuse changes the search system that Electron uses to locate your app code. By default, Electron will search for this code in the following order:

When this fuse is enabled, Electron will only search for app.asar. When combined with the embeddedAsarIntegrityValidation fuse, this fuse ensures that it is impossible to load non-validated code.

@electron/fuses: FuseV1Options.LoadBrowserProcessSpecificV8Snapshot

V8 snapshots can be useful to improve app startup performance. V8 lets you take snapshots of initialized heaps and then load them back in to avoid the cost of initializing the heap.

The loadBrowserProcessSpecificV8Snapshot fuse changes which V8 snapshot file is used for the browser process. By default, Electron's processes will all use the same V8 snapshot file. When this fuse is enabled, the main process uses the file called browser_v8_context_snapshot.bin for its V8 snapshot. Other processes will use the V8 snapshot file that they normally do.

Using separate snapshots for renderer processes and the main process can improve security, especially to make sure that the renderer doesn't use a snapshot with nodeIntegration enabled. See electron/electron#35170 for details.

@electron/fuses: FuseV1Options.GrantFileProtocolExtraPrivileges

The grantFileProtocolExtraPrivileges fuse changes whether pages loaded from the file:// protocol are given privileges beyond what they would receive in a traditional web browser. This behavior was core to Electron apps in original versions of Electron, but is no longer required as apps should be serving local files from custom protocols now instead.

If you aren't serving pages from file://, you should disable this fuse.

The extra privileges granted to the file:// protocol by this fuse are incompletely documented below:

@electron/fuses is a JavaScript utility designed to make flipping these fuses easy. Check out the README of that module for more details on usage and potential error cases.

You can validate the fuses that have been flipped or check the fuse status of an arbitrary Electron app using the @electron/fuses CLI.

If you are using Electron Forge to distribute your application, you can flip fuses using @electron-forge/plugin-fuses, which comes pre-installed with all templates.

Glossary: Fuse Wire: A sequence of bytes in the Electron binary used to control the fuses Sentinel: A static known sequence of bytes you can use to locate the fuse wire Fuse Schema: The format/allowed values for the fuse wire

Manually flipping fuses requires editing the Electron binary and modifying the fuse wire to be the sequence of bytes that represent the state of the fuses you want.

Somewhere in the Electron binary, there will be a sequence of bytes that look like this:

To flip a fuse, you find its position in the fuse wire and change it to "0" or "1" depending on the state you'd like.

You can view the current schema here.

**Examples:**

Example 1 (css):
```css
const { flipFuses, FuseVersion, FuseV1Options } = require('@electron/fuses')flipFuses(  // Path to electron  require('electron'),  // Fuses to flip  {    version: FuseVersion.V1,    [FuseV1Options.RunAsNode]: false  })
```

Example 2 (bash):
```bash
npx @electron/fuses read --app /Applications/Foo.app
```

Example 3 (unknown):
```unknown
| ...binary | sentinel_bytes | fuse_version | fuse_wire_length | fuse_wire | ...binary |
```

---

## Windows Store Guide

**URL:** https://www.electronjs.org/docs/latest/tutorial/windows-store-guide

**Contents:**
- Windows Store Guide
- Background and Requirements​
- Step 1: Package Your Electron Application​
- Step 2: Running electron-windows-store​
- Step 3: Using the AppX Package​
- Optional: Add UWP Features using a BackgroundTask​
- Optional: Convert using Container Virtualization​

With Windows 10, the good old win32 executable got a new sibling: The Universal Windows Platform. The new .appx format does not only enable a number of new powerful APIs like Cortana or Push Notifications, but through the Windows Store, also simplifies installation and updating.

Microsoft developed a tool that compiles Electron apps as .appx packages, enabling developers to use some of the goodies found in the new application model. This guide explains how to use it - and what the capabilities and limitations of an Electron AppX package are.

Windows 10 "Anniversary Update" is able to run win32 .exe binaries by launching them together with a virtualized filesystem and registry. Both are created during compilation by running app and installer inside a Windows Container, allowing Windows to identify exactly which modifications to the operating system are done during installation. Pairing the executable with a virtual filesystem and a virtual registry allows Windows to enable one-click installation and uninstallation.

In addition, the exe is launched inside the appx model - meaning that it can use many of the APIs available to the Universal Windows Platform. To gain even more capabilities, an Electron app can pair up with an invisible UWP background task launched together with the exe - sort of launched as a sidekick to run tasks in the background, receive push notifications, or to communicate with other UWP applications.

To compile any existing Electron app, ensure that you have the following requirements:

Then, go and install the electron-windows-store CLI:

Package the application using @electron/packager (or a similar tool). Make sure to remove node_modules that you don't need in your final application, since any module you don't actually need will increase your application's size.

The output should look roughly like this:

From an elevated PowerShell (run it "as Administrator"), run electron-windows-store with the required parameters, passing both the input and output directories, the app's name and version, and confirmation that node_modules should be flattened.

Once executed, the tool goes to work: It accepts your Electron app as an input, flattening the node_modules. Then, it archives your application as app.zip. Using an installer and a Windows Container, the tool creates an "expanded" AppX package - including the Windows Application Manifest (AppXManifest.xml) as well as the virtual file system and the virtual registry inside your output folder.

Once the expanded AppX files are created, the tool uses the Windows App Packager (MakeAppx.exe) to create a single-file AppX package from those files on disk. Finally, the tool can be used to create a trusted certificate on your computer to sign the new AppX package. With the signed AppX package, the CLI can also automatically install the package on your machine.

In order to run your package, your users will need Windows 10 with the so-called "Anniversary Update" - details on how to update Windows can be found here.

In opposition to traditional UWP apps, packaged apps currently need to undergo a manual verification process, for which you can apply here. In the meantime, all users will be able to install your package by double-clicking it, so a submission to the store might not be necessary if you're looking for an easier installation method. In managed environments (usually enterprises), the Add-AppxPackage PowerShell Cmdlet can be used to install it in an automated fashion.

Another important limitation is that the compiled AppX package still contains a win32 executable - and will therefore not run on Xbox, HoloLens, or Phones.

You can pair your Electron app up with an invisible UWP background task that gets to make full use of Windows 10 features - like push notifications, Cortana integration, or live tiles.

To check out how an Electron app that uses a background task to send toast notifications and live tiles, check out the Microsoft-provided sample.

To generate the AppX package, the electron-windows-store CLI uses a template that should work for most Electron apps. However, if you are using a custom installer, or should you experience any trouble with the generated package, you can attempt to create a package using compilation with a Windows Container - in that mode, the CLI will install and run your application in blank Windows Container to determine what modifications your application is exactly doing to the operating system.

Before running the CLI for the first time, you will have to setup the "Windows Desktop App Converter". This will take a few minutes, but don't worry - you only have to do this once. Download and Desktop App Converter from here. You will receive two files: DesktopAppConverter.zip and BaseImage-14316.wim.

Once installation succeeded, you can move on to compiling your Electron app.

**Examples:**

Example 1 (unknown):
```unknown
npm install -g electron-windows-store
```

Example 2 (unknown):
```unknown
├── Ghost.exe├── LICENSE├── content_resources_200_percent.pak├── content_shell.pak├── d3dcompiler_47.dll├── ffmpeg.dll├── icudtl.dat├── libEGL.dll├── libGLESv2.dll├── locales│   ├── am.pak│   ├── ar.pak│   ├── [...]├── node.dll├── resources│   └── app.asar├── v8_context_snapshot.bin├── squirrel.exe└── ui_resources_200_percent.pak
```

Example 3 (powershell):
```powershell
electron-windows-store `    --input-directory C:\myelectronapp `    --output-directory C:\output\myelectronapp `    --package-version 1.0.0.0 `    --package-name myelectronapp
```

---

## In-App Purchases

**URL:** https://www.electronjs.org/docs/latest/tutorial/in-app-purchases

**Contents:**
- In-App Purchases
- Preparing​
  - Paid Applications Agreement​
  - Create Your In-App Purchases​
  - Change the CFBundleIdentifier​
- Code example​

If you haven't already, you’ll need to sign the Paid Applications Agreement and set up your banking and tax information in iTunes Connect.

iTunes Connect Developer Help: Agreements, tax, and banking overview

Then, you'll need to configure your in-app purchases in iTunes Connect, and include details such as name, pricing, and description that highlights the features and functionality of your in-app purchase.

iTunes Connect Developer Help: Create an in-app purchase

To test In-App Purchase in development with Electron you'll have to change the CFBundleIdentifier in node_modules/electron/dist/Electron.app/Contents/Info.plist. You have to replace com.github.electron by the bundle identifier of the application you created with iTunes Connect.

Here is an example that shows how to use In-App Purchases in Electron. You'll have to replace the product ids by the identifiers of the products created with iTunes Connect (the identifier of com.example.app.product1 is product1). Note that you have to listen to the transactions-updated event as soon as possible in your app.

**Examples:**

Example 1 (xml):
```xml
<key>CFBundleIdentifier</key><string>com.example.app</string>
```

Example 2 (javascript):
```javascript
// Main processconst { inAppPurchase } = require('electron')const PRODUCT_IDS = ['id1', 'id2']// Listen for transactions as soon as possible.inAppPurchase.on('transactions-updated', (event, transactions) => {  if (!Array.isArray(transactions)) {    return  }  // Check each transaction.  for (const transaction of transactions) {    const payment = transaction.payment    switch (transaction.transactionState) {      case 'purchasing':        console.log(`Purchasing ${payment.productIdentifier}...`)        break      case 'purchased': {        console.log(`${payment.productIdentifier} purchased.`)        // Get the receipt url.        const receiptURL = inAppPurchase.getReceiptURL()        console.log(`Receipt URL: ${receiptURL}`)        // Submit the receipt file to the server and check if it is valid.        // @see https://developer.apple.com/library/content/releasenotes/General/ValidateAppStoreReceipt/Chapters/ValidateRemotely.html        // ...        // If the receipt is valid, the product is purchased        // ...        // Finish the transaction.        inAppPurchase.finishTransactionByDate(transaction.transactionDate)        break      }      case 'failed':        console.log(`Failed to purchase ${payment.productIdentifier}.`)        // Finish the transaction.        inAppPurchase.finishTransactionByDate(transaction.transactionDate)        break      case 'restored':        console.log(`The purchase of ${payment.productIdentifier} has been restored.`)        break      case 'deferred':        console.log(`The purchase of ${payment.productIdentifier} has been deferred.`)        break      default:        break    }  }})// Check if the user is allowed to make in-app purchase.if (!inAppPurchase.canMakePayments()) {  console.log('The user is not allowed to make in-app purchase.')}// Retrieve and display the product descriptions.inAppPurchase.getProducts(PRODUCT_IDS).then(products => {  // Check the parameters.  if (!Array.isArray(products) || products.length <= 0) {    console.log('Unable to retrieve the product information.')    return  }  // Display the name and price of each product.  for (const product of products) {    console.log(`The price of ${product.localizedTitle} is ${product.formattedPrice}.`)  }  // Ask the user which product they want to purchase.  const selectedProduct = products[0]  const selectedQuantity = 1  // Purchase the selected product.  inAppPurchase.purchaseProduct(selectedProduct.productIdentifier, selectedQuantity).then(isProductValid => {    if (!isProductValid) {      console.log('The product is not valid.')      return    }    console.log('The payment has been added to the payment queue.')  })})
```

---

## Native Node Modules

**URL:** https://www.electronjs.org/docs/latest/tutorial/using-native-node-modules

**Contents:**
- Native Node Modules
- How to install native modules​
  - Installing modules and rebuilding for Electron​
  - Using npm​
  - Manually building for Electron​
  - Manually building for a custom build of Electron​
- Troubleshooting​
  - A note about win_delay_load_hook​
- Modules that rely on prebuild​
- Modules that rely on node-pre-gyp​

Native Node.js modules are supported by Electron, but since Electron has a different application binary interface (ABI) from a given Node.js binary (due to differences such as using Chromium's BoringSSL instead of OpenSSL), the native modules you use will need to be recompiled for Electron. Otherwise, you will get the following class of error when you try to run your app:

There are several different ways to install native modules:

You can install modules like other Node projects, and then rebuild the modules for Electron with the @electron/rebuild package. This module can automatically determine the version of Electron and handle the manual steps of downloading headers and rebuilding native modules for your app. If you are using Electron Forge, this tool is used automatically in both development mode and when making distributables.

For example, to install the standalone @electron/rebuild tool and then rebuild modules with it via the command line:

For more information on usage and integration with other tools such as Electron Packager, consult the project's README.

By setting a few environment variables, you can use npm to install modules directly.

For example, to install all dependencies for Electron:

If you are a developer developing a native module and want to test it against Electron, you might want to rebuild the module for Electron manually. You can use node-gyp directly to build for Electron:

To compile native Node modules against a custom build of Electron that doesn't match a public release, instruct npm to use the version of Node you have bundled with your custom build.

If you installed a native module and found it was not working, you need to check the following things:

On Windows, by default, node-gyp links native modules against node.dll. However, in Electron 4.x and higher, the symbols needed by native modules are exported by electron.exe, and there is no node.dll. In order to load native modules on Windows, node-gyp installs a delay-load hook that triggers when the native module is loaded, and redirects the node.dll reference to use the loading executable instead of looking for node.dll in the library search path (which would turn up nothing). As such, on Electron 4.x and higher, 'win_delay_load_hook': 'true' is required to load native modules.

If you get an error like Module did not self-register, or The specified procedure could not be found, it may mean that the module you're trying to use did not correctly include the delay-load hook. If the module is built with node-gyp, ensure that the win_delay_load_hook variable is set to true in the binding.gyp file, and isn't getting overridden anywhere. If the module is built with another system, you'll need to ensure that you build with a delay-load hook installed in the main .node file. Your link.exe invocation should look like this:

In particular, it's important that:

See node-gyp for an example delay-load hook if you're implementing your own.

prebuild provides a way to publish native Node modules with prebuilt binaries for multiple versions of Node and Electron.

If the prebuild-powered module provide binaries for the usage in Electron, make sure to omit --build-from-source and the npm_config_build_from_source environment variable in order to take full advantage of the prebuilt binaries.

The node-pre-gyp tool provides a way to deploy native Node modules with prebuilt binaries, and many popular modules are using it.

Sometimes those modules work fine under Electron, but when there are no Electron-specific binaries available, you'll need to build from source. Because of this, it is recommended to use @electron/rebuild for these modules.

If you are following the npm way of installing modules, you'll need to pass --build-from-source to npm, or set the npm_config_build_from_source environment variable.

**Examples:**

Example 1 (yaml):
```yaml
Error: The module '/path/to/native/module.node'was compiled against a different Node.js version usingNODE_MODULE_VERSION $XYZ. This version of Node.js requiresNODE_MODULE_VERSION $ABC. Please try re-compiling or re-installingthe module (for instance, using `npm rebuild` or `npm install`).
```

Example 2 (python):
```python
npm install --save-dev @electron/rebuild# Every time you run "npm install", run this:./node_modules/.bin/electron-rebuild# If you have trouble on Windows, try:.\node_modules\.bin\electron-rebuild.cmd
```

Example 3 (julia):
```julia
# Electron's version.export npm_config_target=1.2.3# The architecture of your machineexport npm_config_arch=x64export npm_config_target_arch=x64# Download headers for Electron.export npm_config_disturl=https://electronjs.org/headers# Tell node-pre-gyp that we are building for Electron.export npm_config_runtime=electron# Tell node-pre-gyp to build module from source code.export npm_config_build_from_source=true# Install all dependencies, and store cache to ~/.electron-gyp.HOME=~/.electron-gyp npm install
```

Example 4 (unknown):
```unknown
cd /path-to-module/HOME=~/.electron-gyp node-gyp rebuild --target=1.2.3 --arch=x64 --dist-url=https://electronjs.org/headers
```

---

## Distributing Apps With Electron Forge

**URL:** https://www.electronjs.org/docs/latest/tutorial/forge-overview

**Contents:**
- Distributing Apps With Electron Forge
- Getting started​
- Getting help​

Electron Forge is a tool for packaging and publishing Electron applications. It unifies Electron's build tooling ecosystem into a single extensible interface so that anyone can jump right into making Electron apps.

If you do not want to use Electron Forge for your project, there are other third-party tools you can use to distribute your app.These tools are maintained by members of the Electron community, and do not come with official support from the Electron project.Electron BuilderA "complete solution to package and build a ready-for-distribution Electron app" that focuses on an integrated experience. electron-builder adds a single dependency and manages all further requirements internally.electron-builder replaces features and modules used by the Electron maintainers (such as the auto-updater) with custom ones.Hydraulic ConveyorA desktop app deployment tool that supports cross-building/signing of all packages from any OS without the need for multi-platform CI, can do synchronous web-style updates on each start of the app, requires no code changes, can use plain HTTP servers for updates and which focuses on ease of use. Conveyor replaces the Electron auto-updaters with Sparkle on macOS, MSIX on Windows, and Linux package repositories.Conveyor is a commercial tool that is free for open source projects. There's an example of how to package GitHub Desktop which can be used for learning.

These tools are maintained by members of the Electron community, and do not come with official support from the Electron project.Electron BuilderA "complete solution to package and build a ready-for-distribution Electron app" that focuses on an integrated experience. electron-builder adds a single dependency and manages all further requirements internally.electron-builder replaces features and modules used by the Electron maintainers (such as the auto-updater) with custom ones.Hydraulic ConveyorA desktop app deployment tool that supports cross-building/signing of all packages from any OS without the need for multi-platform CI, can do synchronous web-style updates on each start of the app, requires no code changes, can use plain HTTP servers for updates and which focuses on ease of use. Conveyor replaces the Electron auto-updaters with Sparkle on macOS, MSIX on Windows, and Linux package repositories.Conveyor is a commercial tool that is free for open source projects. There's an example of how to package GitHub Desktop which can be used for learning.

Electron BuilderA "complete solution to package and build a ready-for-distribution Electron app" that focuses on an integrated experience. electron-builder adds a single dependency and manages all further requirements internally.electron-builder replaces features and modules used by the Electron maintainers (such as the auto-updater) with custom ones.Hydraulic ConveyorA desktop app deployment tool that supports cross-building/signing of all packages from any OS without the need for multi-platform CI, can do synchronous web-style updates on each start of the app, requires no code changes, can use plain HTTP servers for updates and which focuses on ease of use. Conveyor replaces the Electron auto-updaters with Sparkle on macOS, MSIX on Windows, and Linux package repositories.Conveyor is a commercial tool that is free for open source projects. There's an example of how to package GitHub Desktop which can be used for learning.

A "complete solution to package and build a ready-for-distribution Electron app" that focuses on an integrated experience. electron-builder adds a single dependency and manages all further requirements internally.electron-builder replaces features and modules used by the Electron maintainers (such as the auto-updater) with custom ones.Hydraulic ConveyorA desktop app deployment tool that supports cross-building/signing of all packages from any OS without the need for multi-platform CI, can do synchronous web-style updates on each start of the app, requires no code changes, can use plain HTTP servers for updates and which focuses on ease of use. Conveyor replaces the Electron auto-updaters with Sparkle on macOS, MSIX on Windows, and Linux package repositories.Conveyor is a commercial tool that is free for open source projects. There's an example of how to package GitHub Desktop which can be used for learning.

electron-builder replaces features and modules used by the Electron maintainers (such as the auto-updater) with custom ones.Hydraulic ConveyorA desktop app deployment tool that supports cross-building/signing of all packages from any OS without the need for multi-platform CI, can do synchronous web-style updates on each start of the app, requires no code changes, can use plain HTTP servers for updates and which focuses on ease of use. Conveyor replaces the Electron auto-updaters with Sparkle on macOS, MSIX on Windows, and Linux package repositories.Conveyor is a commercial tool that is free for open source projects. There's an example of how to package GitHub Desktop which can be used for learning.

Hydraulic ConveyorA desktop app deployment tool that supports cross-building/signing of all packages from any OS without the need for multi-platform CI, can do synchronous web-style updates on each start of the app, requires no code changes, can use plain HTTP servers for updates and which focuses on ease of use. Conveyor replaces the Electron auto-updaters with Sparkle on macOS, MSIX on Windows, and Linux package repositories.Conveyor is a commercial tool that is free for open source projects. There's an example of how to package GitHub Desktop which can be used for learning.

A desktop app deployment tool that supports cross-building/signing of all packages from any OS without the need for multi-platform CI, can do synchronous web-style updates on each start of the app, requires no code changes, can use plain HTTP servers for updates and which focuses on ease of use. Conveyor replaces the Electron auto-updaters with Sparkle on macOS, MSIX on Windows, and Linux package repositories.Conveyor is a commercial tool that is free for open source projects. There's an example of how to package GitHub Desktop which can be used for learning.

Conveyor is a commercial tool that is free for open source projects. There's an example of how to package GitHub Desktop which can be used for learning.

The Electron Forge docs contain detailed information on taking your application from source code to your end users' machines. This includes:

For beginners, we recommend following through Electron's tutorial to develop, build, package and publish your first Electron app. If you have already developed an app on your machine and want to start on packaging and distribution, start from step 5 of the tutorial.

---

## Debugging in VSCode

**URL:** https://www.electronjs.org/docs/latest/tutorial/debugging-vscode

**Contents:**
- Debugging in VSCode
- Debugging your Electron app​
  - Main process​
    - 1. Open an Electron project in VSCode.​
    - 2. Add a file .vscode/launch.json with the following configuration:​
    - 3. Debugging​
- Debugging the Electron codebase​
  - Windows (C++)​
    - 1. Open an Electron project in VSCode.​
    - 2. Add a file .vscode/launch.json with the following configuration:​

This guide goes over how to set up VSCode debugging for both your own Electron project as well as the native Electron codebase.

Set some breakpoints in main.js, and start debugging in the Debug View. You should be able to hit the breakpoints.

If you want to build Electron from source and modify the native Electron codebase, this section will help you in testing your modifications.

For those unsure where to acquire this code or how to build it, Electron's Build Tools automates and explains most of this process. If you wish to manually set up the environment, you can instead use these build instructions.

Set some breakpoints in the .cc files of your choosing in the native Electron C++ code, and start debugging in the Debug View.

**Examples:**

Example 1 (python):
```python
$ npx create-electron-app@latest my-app$ code my-app
```

Example 2 (json):
```json
{  "version": "0.2.0",  "configurations": [    {      "name": "Debug Main Process",      "type": "node",      "request": "launch",      "cwd": "${workspaceFolder}",      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",      "windows": {        "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron.cmd"      },      "args" : ["."],      "outputCapture": "std"    }  ]}
```

Example 3 (python):
```python
$ npx create-electron-app@latest my-app$ code my-app
```

Example 4 (json):
```json
{  "version": "0.2.0",  "configurations": [    {      "name": "(Windows) Launch",      "type": "cppvsdbg",      "request": "launch",      "program": "${workspaceFolder}\\out\\your-executable-location\\electron.exe",      "args": ["your-electron-project-path"],      "stopAtEntry": false,      "cwd": "${workspaceFolder}",      "environment": [          {"name": "ELECTRON_ENABLE_LOGGING", "value": "true"},          {"name": "ELECTRON_ENABLE_STACK_DUMPING", "value": "true"},          {"name": "ELECTRON_RUN_AS_NODE", "value": ""},      ],      "externalConsole": false,      "sourceFileMap": {          "o:\\": "${workspaceFolder}",      },    },  ]}
```

---

## Native File Drag & Drop

**URL:** https://www.electronjs.org/docs/latest/tutorial/native-file-drag-drop

**Contents:**
- Native File Drag & Drop
- Overview​
- Example​
  - Preload.js​
  - Index.html​
  - Renderer.js​
  - Main.js​

Certain kinds of applications that manipulate files might want to support the operating system's native file drag & drop feature. Dragging files into web content is common and supported by many websites. Electron additionally supports dragging files and content out from web content into the operating system's world.

To implement this feature in your app, you need to call the webContents.startDrag(item) API in response to the ondragstart event.

An example demonstrating how you can create a file on the fly to be dragged out of the window.

In preload.js use the contextBridge to inject a method window.electron.startDrag(...) that will send an IPC message to the main process.

Add a draggable element to index.html, and reference your renderer script:

In renderer.js set up the renderer process to handle drag events by calling the method you added via the contextBridge above.

In the Main process (main.js file), expand the received event with a path to the file that is being dragged and an icon:

After launching the Electron application, try dragging and dropping the item from the BrowserWindow onto your desktop. In this guide, the item is a Markdown file located in the root of the project:

**Examples:**

Example 1 (javascript):
```javascript
const { contextBridge, ipcRenderer } = require('electron')contextBridge.exposeInMainWorld('electron', {  startDrag: (fileName) => ipcRenderer.send('ondragstart', fileName)})
```

Example 2 (html):
```html
<div style="border:2px solid black;border-radius:3px;padding:5px;display:inline-block" draggable="true" id="drag">Drag me</div><script src="renderer.js"></script>
```

Example 3 (javascript):
```javascript
document.getElementById('drag').ondragstart = (event) => {  event.preventDefault()  window.electron.startDrag('drag-and-drop.md')}
```

Example 4 (javascript):
```javascript
const { app, BrowserWindow, ipcMain } = require('electron/main')const path = require('node:path')const fs = require('node:fs')const https = require('node:https')function createWindow () {  const win = new BrowserWindow({    width: 800,    height: 600,    webPreferences: {      preload: path.join(__dirname, 'preload.js')    }  })  win.loadFile('index.html')}const iconName = path.join(__dirname, 'iconForDragAndDrop.png')const icon = fs.createWriteStream(iconName)// Create a new file to copy - you can also copy existing files.fs.writeFileSync(path.join(__dirname, 'drag-and-drop-1.md'), '# First file to test drag and drop')fs.writeFileSync(path.join(__dirname, 'drag-and-drop-2.md'), '# Second file to test drag and drop')https.get('https://img.icons8.com/ios/452/drag-and-drop.png', (response) => {  response.pipe(icon)})app.whenReady().then(createWindow)ipcMain.on('ondragstart', (event, filePath) => {  event.sender.startDrag({    file: path.join(__dirname, filePath),    icon: iconName  })})app.on('window-all-closed', () => {  if (process.platform !== 'darwin') {    app.quit()  }})app.on('activate', () => {  if (BrowserWindow.getAllWindows().length === 0) {    createWindow()  }})
```

---

## Debugging the Main Process

**URL:** https://www.electronjs.org/docs/latest/tutorial/debugging-main-process

**Contents:**
- Debugging the Main Process
- Command Line Switches​
  - --inspect=[port]​
  - --inspect-brk=[port]​
- External Debuggers​

The DevTools in an Electron browser window can only debug JavaScript that's executed in that window (i.e. the web pages). To debug JavaScript that's executed in the main process you will need to use an external debugger and launch Electron with the --inspect or --inspect-brk switch.

Use one of the following command line switches to enable debugging of the main process:

Electron will listen for V8 inspector protocol messages on the specified port, an external debugger will need to connect on this port. The default port is 9229.

Like --inspect but pauses execution on the first line of JavaScript.

You will need to use a debugger that supports the V8 inspector protocol.

**Examples:**

Example 1 (shell):
```shell
electron --inspect=9229 your/app
```

---

## Native Code and Electron: Swift (macOS)

**URL:** https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-swift-macos

**Contents:**
- Native Code and Electron: Swift (macOS)
- Requirements​
- 1) Creating a package​
- 2) Setting Up the Build Configuration​
  - Setting up the Swift Build Configuration​
- 3) Creating the Objective-C Bridge Header​
- 4) Implementing the Objective-C Bridge​
- 5) Implementing the Swift Code​
  - Setting Up the Basic Structure​
  - Implementing helloGui()​

This tutorial builds on the general introduction to Native Code and Electron and focuses on creating a native addon for macOS using Swift.

Swift is a modern, powerful language designed for safety and performance. While you can't use Swift directly with the Node.js N-API as used by Electron, you can create a bridge using Objective-C++ to connect Swift with JavaScript in your Electron application.

To illustrate how you can embed native macOS code in your Electron app, we'll be building a basic native macOS GUI (using SwiftUI) that communicates with Electron's JavaScript.

This tutorial will be most useful to those who already have some familiarity with Objective-C, Swift, and SwiftUI development. You should understand basic concepts like Swift syntax, optionals, closures, SwiftUI views, property wrappers, and the Objective-C/Swift interoperability mechanisms such as the @objc attribute and bridging headers.

If you're not already familiar with these concepts, Apple's Swift Programming Language Guide, SwiftUI Documentation, and Swift and Objective-C Interoperability Guide are excellent starting points.

Just like our general introduction to Native Code and Electron, this tutorial assumes you have Node.js and npm installed, as well as the basic tools necessary for compiling native code on macOS. You'll need:

You can re-use the package we created in our Native Code and Electron tutorial. This tutorial will not be repeating the steps described there. Let's first setup our basic addon folder structure:

Our package.json should look like this:

In our other tutorials focusing on other native languages, we could use node-gyp to build the entirety of our code. With Swift, things are a bit more tricky: We need to first build and then link our Swift code. This is because Swift has its own compilation model and runtime requirements that don't directly integrate with node-gyp's C/C++ focused build system.

The process involves:

This two-step compilation process ensures that Swift's advanced language features and runtime are properly handled while still allowing us to expose the functionality to JavaScript through Node.js's native addon system.

Let's start by adding a basic structure:

We include our Objective-C++ files (sources), specify the necessary macOS frameworks, and set up C++ exceptions and ARC. We also set various Xcode flags:

Then, with OTHER_LDFLAGS, we set Linker flags:

You might also notice that we added a currently empty actions array to the JSON. In the next step, we'll be compiling Swift.

We'll add two actions: One to compile our Swift code (so that it can be linked) and another one to copy it to a folder to use. Replace the actions array above with the following JSON:

We'll need to setup a bridge between the Swift code and the native Node.js C++ addon. Let's start by creating a header file for the bridge in include/SwiftBridge.h:

This header defines the Objective-C interface that we'll use to bridge between our Swift code and the Node.js addon. It includes:

Now, let's create the Objective-C bridge itself in src/SwiftBridge.m:

Now, let's implement our Objective-C code in src/SwiftCode.swift. This is where we'll create our native macOS GUI using SwiftUI.

To make this tutorial easier to follow, we'll start with the basic structure and add features incrementally - step by step.

Let's start with the basic structure. Here, we're just setting up variables, some basic callback methods, and a simple helper method we'll use later to convert data into formats ready for the JavaScript world.

This first part of our Swift code:

Let's continue with the helloGui method and the SwiftUI implementation. This is where we start adding user interface elements to the screen.

This helloGui method:

Next, we'll define a TodoItem model with an ID, text, and date.

Next, we can implement the actual view. Swift is fairly verbose here, so the code below might look scary if you're new to Swift. The many lines of code obfuscate the simplicity in it - we're just setting up some UI elements. Nothing here is specific to Electron.

This part of the code:

The final file should look as follows:

We now have working Objective-C code, which in turn is able to call working Swift code. To make sure it can be safely and properly called from the JavaScript world, we need to build a bridge between Objective-C and C++, which we can do with Objective-C++. We'll do that in src/swift_addon.mm.

Next, let's implement the callback mechanism:

Let's continue with setting up the Swift callbacks:

Finally, let's implement the instance methods:

This final part does multiple things:

The final and full src/swift_addon.mm should look like:

You're so close! We now have working Objective-C, Swift, and thread-safe ways to expose methods and events to JavaScript. In this final step, let's create a JavaScript wrapper in js/index.js to provide a more friendly API:

With all files in place, you can build the addon:

Please note that you cannot call this script from Node.js directly, since Node.js doesn't set up an "app" in the eyes of macOS. Electron does though, so you can test your code by requiring and calling it from Electron.

You've now built a complete native Node.js addon for macOS using Swift and SwiftUI. This provides a foundation for building more complex macOS-specific features in your Electron apps, giving you the best of both worlds: the ease of web technologies with the power of native macOS code.

The approach demonstrated here allows you to:

For more information on developing with Swift and Swift, refer to Apple's developer documentation:

**Examples:**

Example 1 (go):
```go
swift-native-addon/├── binding.gyp            # Build configuration├── include/│   └── SwiftBridge.h      # Objective-C header for the bridge├── js/│   └── index.js           # JavaScript interface├── package.json           # Package configuration└── src/    ├── SwiftCode.swift    # Swift implementation    ├── SwiftBridge.m      # Objective-C bridge implementation    └── swift_addon.mm     # Node.js addon implementation
```

Example 2 (json):
```json
{  "name": "swift-macos",  "version": "1.0.0",  "description": "A demo module that exposes Swift code to Electron",  "main": "js/index.js",  "scripts": {    "clean": "rm -rf build",    "build-electron": "electron-rebuild",    "build": "node-gyp configure && node-gyp build"  },  "license": "MIT",  "dependencies": {    "bindings": "^1.5.0",    "node-addon-api": "^8.3.0"  },  "devDependencies": {    "node-gyp": "^11.1.0"  }}
```

Example 3 (json):
```json
{  "targets": [{    "target_name": "swift_addon",    "conditions": [      ['OS=="mac"', {        "sources": [          "src/swift_addon.mm",          "src/SwiftBridge.m",          "src/SwiftCode.swift"        ],        "include_dirs": [          "<!@(node -p \"require('node-addon-api').include\")",          "include",          "build_swift"        ],        "dependencies": [          "<!(node -p \"require('node-addon-api').gyp\")"        ],        "libraries": [          "<(PRODUCT_DIR)/libSwiftCode.a"        ],        "cflags!": [ "-fno-exceptions" ],        "cflags_cc!": [ "-fno-exceptions" ],        "xcode_settings": {          "GCC_ENABLE_CPP_EXCEPTIONS": "YES",          "CLANG_ENABLE_OBJC_ARC": "YES",          "SWIFT_OBJC_BRIDGING_HEADER": "include/SwiftBridge.h",          "SWIFT_VERSION": "5.0",          "SWIFT_OBJC_INTERFACE_HEADER_NAME": "swift_addon-Swift.h",          "MACOSX_DEPLOYMENT_TARGET": "11.0",          "OTHER_CFLAGS": [            "-ObjC++",            "-fobjc-arc"          ],          "OTHER_LDFLAGS": [            "-Wl,-rpath,@loader_path",            "-Wl,-install_name,@rpath/libSwiftCode.a"          ],          "HEADER_SEARCH_PATHS": [            "$(SRCROOT)/include",            "$(CONFIGURATION_BUILD_DIR)",            "$(SRCROOT)/build/Release",            "$(SRCROOT)/build_swift"          ]        },        "actions": []      }]    ]  }]}
```

Example 4 (json):
```json
{  // ...other code  "actions": [    {      "action_name": "build_swift",      "inputs": [        "src/SwiftCode.swift"      ],      "outputs": [        "build_swift/libSwiftCode.a",        "build_swift/swift_addon-Swift.h"      ],      "action": [        "swiftc",        "src/SwiftCode.swift",        "-emit-objc-header-path", "./build_swift/swift_addon-Swift.h",        "-emit-library", "-o", "./build_swift/libSwiftCode.a",        "-emit-module", "-module-name", "swift_addon",        "-module-link-name", "SwiftCode"      ]    },    {      "action_name": "copy_swift_lib",      "inputs": [        "<(module_root_dir)/build_swift/libSwiftCode.a"      ],      "outputs": [        "<(PRODUCT_DIR)/libSwiftCode.a"      ],      "action": [        "sh",        "-c",        "cp -f <(module_root_dir)/build_swift/libSwiftCode.a <(PRODUCT_DIR)/libSwiftCode.a && install_name_tool -id @rpath/libSwiftCode.a <(PRODUCT_DIR)/libSwiftCode.a"      ]    }  ]  // ...other code}
```

---

## Desktop Launcher Actions

**URL:** https://www.electronjs.org/docs/latest/tutorial/linux-desktop-actions

**Contents:**
- Desktop Launcher Actions
- Overview​

On many Linux environments, you can add custom entries to the system launcher by modifying the .desktop file. For Canonical's Unity documentation, see Adding Shortcuts to a Launcher. For details on a more generic implementation, see the freedesktop.org Specification.

NOTE: The screenshot above is an example of launcher shortcuts in Audacious audio player

To create a shortcut, you need to provide Name and Exec properties for the entry you want to add to the shortcut menu. Unity will execute the command defined in the Exec field after the user clicked the shortcut menu item. An example of the .desktop file may look as follows:

The preferred way for Unity to instruct your application on what to do is using parameters. You can find them in your application in the global variable process.argv.

**Examples:**

Example 1 (unknown):
```unknown
Actions=PlayPause;Next;Previous[Desktop Action PlayPause]Name=Play-PauseExec=audacious -tOnlyShowIn=Unity;[Desktop Action Next]Name=NextExec=audacious -fOnlyShowIn=Unity;[Desktop Action Previous]Name=PreviousExec=audacious -rOnlyShowIn=Unity;
```

---

## Dock Menu

**URL:** https://www.electronjs.org/docs/latest/tutorial/macos-dock

**Contents:**
- Dock Menu
- Dock API​
- Attaching a context menu​
- Runnable Fiddle demo​

On macOS, the Dock is an interface element that displays open and frequently-used apps. While opened or pinned, each app has its own icon in the Dock.

On macOS, the Dock is the entry point for certain cross-platform features like Recent Documents and Application Progress. Read those guides for more details.

All functionality for the Dock is exposed via the Dock class exposed via app.dock property. There is a single Dock instance per Electron application, and this property only exists on macOS.

One of the main uses for your app's Dock icon is to expose additional app menus. The Dock menu is triggered by right-clicking or Ctrl-clicking the app icon. By default, the app's Dock menu will come with system-provided window management utilities, including the ability to show all windows, hide the app, and switch betweeen different open windows.

To set an app-defined custom Dock menu, pass any Menu instance into the dock.setMenu API.

For best practices to make your Dock menu feel more native, see Apple's Human Interface Guidelines page on Dock menus.

Unlike with regular context menus, Dock context menus don't need to be manually instrumented using the menu.popup API. Instead, the Dock object handles click events for you.

To learn more about crafting menus in Electron, see the Menus guide.

Below is a runnable example of how you can use the Dock menu to create and close windows in your Electron app.

**Examples:**

Example 1 (javascript):
```javascript
const { app, BrowserWindow, Menu } = require('electron/main')// dock.setMenu only works after the 'ready' event is firedapp.whenReady().then(() => {  const dockMenu = Menu.buildFromTemplate([    {      label: 'New Window',      click: () => { const win = new BrowserWindow() }    }    // add more menu options to the array  ])  // Dock is undefined on platforms outside of macOS  app.dock?.setMenu(dockMenu)})
```

Example 2 (javascript):
```javascript
const { app, BrowserWindow, Menu } = require('electron/main')const { shell } = require('electron/common')function createWindow () {  const win = new BrowserWindow()  win.loadFile('index.html')}function closeAllWindows () {  const wins = BrowserWindow.getAllWindows()  for (const win of wins) {    win.close()  }}app.whenReady().then(() => {  createWindow()  const dockMenu = Menu.buildFromTemplate([    {      label: 'New Window',      click: () => { createWindow() }    },    {      label: 'Close All Windows',      click: () => { closeAllWindows() }    },    {      label: 'Open Electron Docs',      click: () => {        shell.openExternal('https://electronjs.org/docs')      }    }    // add more menu options to the array  ])  app.dock.setMenu(dockMenu)  app.on('activate', function () {    if (BrowserWindow.getAllWindows().length === 0) createWindow()  })})app.on('window-all-closed', function () {  if (process.platform !== 'darwin') app.quit()})
```

Example 3 (html):
```html
<!DOCTYPE html><html>  <head>    <meta charset="UTF-8">    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">    <title>Dock Menu Demo</title>  </head>  <body>    <h1>Dock Menu Demo</h1>    <ul>      <li>Create new BrowserWindow instances via the "New Window" option</li>      <li>Close all BrowserWindow instances via the "Close All Windows" option</li>      <li>Read the docs via the "Show Electron Docs" option</li>    </ul>    <script src="./renderer.js"></script>  </body></html>
```

Example 4 (bash):
```bash
document.title = `${document.title} - ${new Date()}`
```

---

## Adding Features

**URL:** https://www.electronjs.org/docs/latest/tutorial/tutorial-adding-features

**Contents:**
- Adding Features
- Adding application complexity​
- How-to examples​
- What's next?​

This is part 4 of the Electron tutorial. Prerequisites Building your First App Using Preload Scripts Adding Features Packaging Your Application Publishing and Updating

If you have been following along, you should have a functional Electron application with a static user interface. From this starting point, you can generally progress in developing your app in two broad directions:

It is important to understand the distinction between these two broad concepts. For the first point, Electron-specific resources are not necessary. Building a pretty to-do list in Electron is just pointing your Electron BrowserWindow to a pretty to-do list web app. Ultimately, you are building your renderer's UI using the same tools (HTML, CSS, JavaScript) that you would on the web. Therefore, Electron's docs will not go in-depth on how to use standard web tools.

On the other hand, Electron also provides a rich set of tools that allow you to integrate with the desktop environment, from creating tray icons to adding global shortcuts to displaying native menus. It also gives you all the power of a Node.js environment in the main process. This set of capabilities separates Electron applications from running a website in a browser tab, and are the focus of Electron's documentation.

Electron's documentation has many tutorials to help you with more advanced topics and deeper operating system integrations. To get started, check out the How-To Examples doc.

If you can't find what you are looking for, please let us know on GitHub or in our Discord server!

For the rest of the tutorial, we will be shifting away from application code and giving you a look at how you can get your app from your developer machine into end users' hands.

---

## Progress Bars

**URL:** https://www.electronjs.org/docs/latest/tutorial/progress-bar

**Contents:**
- Progress Bars
- Overview​
- Example​

A progress bar enables a window to provide progress information to the user without the need of switching to the window itself.

On Windows, you can use a taskbar button to display a progress bar.

On macOS, the progress bar will be displayed as a part of the dock icon.

On Linux, the Unity graphical interface also has a similar feature that allows you to specify the progress bar in the launcher.

NOTE: on Windows, each window can have its own progress bar, whereas on macOS and Linux (Unity) there can be only one progress bar for the application.

All three cases are covered by the same API - the setProgressBar() method available on an instance of BrowserWindow. To indicate your progress, call this method with a number between 0 and 1. For example, if you have a long-running task that is currently at 63% towards completion, you would call it as setProgressBar(0.63).

Setting the parameter to negative values (e.g. -1) will remove the progress bar. Setting it to a value greater than 1 will indicate an indeterminate progress bar in Windows or clamp to 100% in other operating systems. An indeterminate progress bar remains active but does not show an actual percentage, and is used for situations when you do not know how long an operation will take to complete.

See the API documentation for more options and modes.

In this example, we add a progress bar to the main window that increments over time using Node.js timers.

After launching the Electron application, the dock (macOS) or taskbar (Windows, Unity) should show a progress bar that starts at zero and progresses through 100% to completion. It should then show indeterminate (Windows) or pin to 100% (other operating systems) briefly and then loop.

For macOS, the progress bar will also be indicated for your application when using Mission Control:

**Examples:**

Example 1 (javascript):
```javascript
const { app, BrowserWindow } = require('electron/main')let progressIntervalfunction createWindow () {  const win = new BrowserWindow({    width: 800,    height: 600  })  win.loadFile('index.html')  const INCREMENT = 0.03  const INTERVAL_DELAY = 100 // ms  let c = 0  progressInterval = setInterval(() => {    // update progress bar to next value    // values between 0 and 1 will show progress, >1 will show indeterminate or stick at 100%    win.setProgressBar(c)    // increment or reset progress bar    if (c < 2) {      c += INCREMENT    } else {      c = (-INCREMENT * 5) // reset to a bit less than 0 to show reset state    }  }, INTERVAL_DELAY)}app.whenReady().then(createWindow)// before the app is terminated, clear both timersapp.on('before-quit', () => {  clearInterval(progressInterval)})app.on('window-all-closed', () => {  if (process.platform !== 'darwin') {    app.quit()  }})app.on('activate', () => {  if (BrowserWindow.getAllWindows().length === 0) {    createWindow()  }})
```

Example 2 (html):
```html
<!DOCTYPE html><html><head>    <meta charset="UTF-8">    <title>Hello World!</title>    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" /></head><body>    <h1>Hello World!</h1>    <p>Keep an eye on the dock (Mac) or taskbar (Windows, Unity) for this application!</p>    <p>It should indicate a progress that advances from 0 to 100%.</p>    <p>It should then show indeterminate (Windows) or pin at 100% (other operating systems)      briefly and then loop.</p></body></html>
```

---

## DevTools Extension

**URL:** https://www.electronjs.org/docs/latest/tutorial/devtools-extension

**Contents:**
- DevTools Extension
- Loading a DevTools extension with tooling​
- Manually loading a DevTools extension​
  - Removing a DevTools extension​
- DevTools extension support​
  - What should I do if a DevTools extension is not working?​

Electron supports Chrome DevTools extensions, which can be used to extend the ability of Chrome's developer tools for debugging popular web frameworks.

The easiest way to load a DevTools extension is to use third-party tooling to automate the process for you. electron-devtools-installer is a popular NPM package that does just that.

If you don't want to use the tooling approach, you can also do all of the necessary operations by hand. To load an extension in Electron, you need to download it via Chrome, locate its filesystem path, and then load it into your Session by calling the ses.loadExtension API.

Using the React Developer Tools as an example:

Install the extension in Google Chrome.

Navigate to chrome://extensions, and find its extension ID, which is a hash string like fmkadmapgofadopljbjfkapdkoienihi.

Find out the filesystem location used by Chrome for storing extensions:

Pass the location of the extension to the ses.loadExtension API. For React Developer Tools v4.9.0, it looks something like:

You can pass the extension's ID to the ses.removeExtension API to remove it from your Session. Loaded extensions are not persisted between app launches.

Electron only supports a limited set of chrome.* APIs, so extensions using unsupported chrome.* APIs under the hood may not work.

The following Devtools extensions have been tested to work in Electron:

First, please make sure the extension is still being maintained and is compatible with the latest version of Google Chrome. We cannot provide additional support for unsupported extensions.

If the extension works on Chrome but not on Electron, file a bug in Electron's issue tracker and describe which part of the extension is not working as expected.

**Examples:**

Example 1 (javascript):
```javascript
const { app, session } = require('electron')const os = require('node:os')const path = require('node:path')// on macOSconst reactDevToolsPath = path.join(  os.homedir(),  '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.9.0_0')app.whenReady().then(async () => {  await session.defaultSession.loadExtension(reactDevToolsPath)})
```

---

## ES Modules (ESM) in Electron

**URL:** https://www.electronjs.org/docs/latest/tutorial/esm

**Contents:**
- ES Modules (ESM) in Electron
- Introduction​
- Summary: ESM support matrix​
- Main process​
  - Caveats​
    - You must use await generously before the app's ready event​
- Renderer process​
- Preload scripts​
  - Caveats​
    - ESM preload scripts must have the .mjs extension​

The ECMAScript module (ESM) format is the standard way of loading JavaScript packages.

Chromium and Node.js have their own implementations of the ESM specification, and Electron chooses which module loader to use depending on the context.

This document serves to outline the limitations of ESM in Electron and the differences between ESM in Electron and ESM in Node.js and Chromium.

This feature was added in electron@28.0.0.

This table gives a general overview of where ESM is supported and which ESM loader is used.

Electron's main process runs in a Node.js context and uses its ESM loader. Usage should follow Node's ESM documentation. To enable ESM in a file in the main process, one of the following conditions must be met:

See Node's Determining Module System doc for more details.

ES Modules are loaded asynchronously. This means that only side effects from the main process entry point's imports will execute before the ready event.

This is important because certain Electron APIs (e.g. app.setPath) need to be called before the app's ready event is emitted.

With top-level await available in Node.js ESM, make sure to await every Promise that you need to execute before the ready event. Otherwise, your app may be ready before your code executes.

This is particularly important to keep in mind for dynamic ESM import statements (static imports are unaffected). For example, if index.mjs calls import('./set-up-paths.mjs') at the top level, the app will likely already be ready by the time that dynamic import resolves.

JavaScript transpilers (e.g. Babel, TypeScript) have historically supported ES Module syntax before Node.js supported ESM imports by turning these calls to CommonJS require calls.Example: @babel/plugin-transform-modules-commonjsThe @babel/plugin-transform-modules-commonjs plugin will transform ESM imports down to require calls. The exact syntax will depend on the importInterop setting.@babel/plugin-transform-modules-commonjsimport foo from "foo";import { bar } from "bar";foo;bar;// with "importInterop: node", compiles to ..."use strict";var _foo = require("foo");var _bar = require("bar");_foo;_bar.bar;These CommonJS calls load module code synchronously. If you are migrating transpiled CJS code to native ESM, be careful about the timing differences between CJS and ESM.

The @babel/plugin-transform-modules-commonjs plugin will transform ESM imports down to require calls. The exact syntax will depend on the importInterop setting.@babel/plugin-transform-modules-commonjsimport foo from "foo";import { bar } from "bar";foo;bar;// with "importInterop: node", compiles to ..."use strict";var _foo = require("foo");var _bar = require("bar");_foo;_bar.bar;

These CommonJS calls load module code synchronously. If you are migrating transpiled CJS code to native ESM, be careful about the timing differences between CJS and ESM.

Electron's renderer processes run in a Chromium context and will use Chromium's ESM loader. In practice, this means that import statements:

If you wish to load JavaScript packages via npm directly into the renderer process, we recommend using a bundler such as webpack or Vite to compile your code for client-side consumption.

A renderer's preload script will use the Node.js ESM loader when available. ESM availability will depend on the values of its renderer's sandbox and contextIsolation preferences, and comes with a few other caveats due to the asynchronous nature of ESM loading.

Preload scripts will ignore "type": "module" fields, so you must use the .mjs file extension in your ESM preload scripts.

Sandboxed preload scripts are run as plain JavaScript without an ESM context. If you need to use external modules, we recommend using a bundler for your preload code. Loading the electron API is still done via require('electron').

For more information on sandboxing, see the Process Sandboxing docs.

If the response body for a renderer's loaded page is completely empty (i.e. Content-Length: 0), its preload script will not block the page load, which may result in race conditions.

If this impacts you, change your response body to have something in it (e.g. an empty html tag (<html></html>)) or swap back to using a CommonJS preload script (.js or .cjs), which will block the page load.

If your unsandboxed renderer process does not have the contextIsolation flag enabled, you cannot dynamically import() files via Node's ESM loader.

This is because Chromium's dynamic ESM import() function usually takes precedence in the renderer process and without context isolation, there is no way of knowing if Node.js is available in a dynamic import statement. If you enable context isolation, import() statements from the renderer's isolated preload context can be routed to the Node.js module loader.

**Examples:**

Example 1 (javascript):
```javascript
// add an await call here to guarantee that path setup will finish before `ready`import('./set-up-paths.mjs')app.whenReady().then(() => {  console.log('This code may execute before the above import')})
```

Example 2 (javascript):
```javascript
import foo from "foo";import { bar } from "bar";foo;bar;// with "importInterop: node", compiles to ..."use strict";var _foo = require("foo");var _bar = require("bar");_foo;_bar.bar;
```

Example 3 (html):
```html
<script type="module">    import { exists } from 'node:fs' // ❌ will not work!</script>
```

Example 4 (swift):
```swift
// ❌ these won't work without context isolationconst fs = await import('node:fs')await import('./foo')
```

---

## Application Packaging

**URL:** https://www.electronjs.org/docs/latest/tutorial/application-distribution

**Contents:**
- Application Packaging
- With tooling​
- Manual packaging​
  - With prebuilt binaries​
  - With an app source code archive (asar)​
  - Rebranding with downloaded binaries​

To distribute your app with Electron, you need to package and rebrand it. To do this, you can either use specialized tooling or manual approaches.

There are a couple tools out there that exist to package and distribute your Electron app. We recommend using Electron Forge. You can check out its documentation directly, or refer to the Packaging and Distribution part of the Electron tutorial.

If you prefer the manual approach, there are 2 ways to distribute your application:

To distribute your app manually, you need to download Electron's prebuilt binaries. Next, the folder containing your app should be named app and placed in Electron's resources directory as shown in the following examples.

The location of Electron's prebuilt binaries is indicated with electron/ in the examples below.

Then execute Electron.app on macOS, electron on Linux, or electron.exe on Windows, and Electron will start as your app. The electron directory will then be your distribution to deliver to users.

Instead of shipping your app by copying all of its source files, you can package your app into an asar archive to improve the performance of reading files on platforms like Windows, if you are not already using a bundler such as Parcel or Webpack.

To use an asar archive to replace the app folder, you need to rename the archive to app.asar, and put it under Electron's resources directory like below, and Electron will then try to read the archive and start from it.

You can find more details on how to use asar in the electron/asar repository.

After bundling your app into Electron, you will want to rebrand Electron before distributing it to users.

Windows: You can rename electron.exe to any name you like, and edit its icon and other information with tools like rcedit.

Linux: You can rename the electron executable to any name you like.

macOS: You can rename Electron.app to any name you want, and you also have to rename the CFBundleDisplayName, CFBundleIdentifier and CFBundleName fields in the following files:

You can also rename the helper app to avoid showing Electron Helper in the Activity Monitor, but make sure you have renamed the helper app's executable file's name.

The structure of a renamed app would be like:

it is also possible to rebrand Electron by changing the product name and building it from source. To do this you need to set the build argument corresponding to the product name (electron_product_name = "YourProductName") in the args.gn file and rebuild.Keep in mind this is not recommended as setting up the environment to compile from source is not trivial and takes significant time.

Keep in mind this is not recommended as setting up the environment to compile from source is not trivial and takes significant time.

**Examples:**

Example 1 (unknown):
```unknown
electron/Electron.app/Contents/Resources/app/├── package.json├── main.js└── index.html
```

Example 2 (unknown):
```unknown
electron/resources/app├── package.json├── main.js└── index.html
```

Example 3 (unknown):
```unknown
electron/Electron.app/Contents/Resources/└── app.asar
```

Example 4 (unknown):
```unknown
electron/resources/└── app.asar
```

---

## Mac App Store Submission Guide

**URL:** https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide

**Contents:**
- Mac App Store Submission Guide
- Requirements​
- Sign Electron apps​
  - Get certificates​
    - Other certificates​
    - Legacy certificate names​
  - Prepare provisioning profile​
  - Enable Apple's App Sandbox​
  - Sign apps for development​
  - Sign apps for submitting to the Mac App Store​

This guide provides information on:

To sign Electron apps, the following tools must be installed first:

You also have to register an Apple Developer account and join the Apple Developer Program.

Electron apps can be distributed through Mac App Store or outside it. Each way requires different ways of signing and testing. This guide focuses on distribution via Mac App Store.

The following steps describe how to get the certificates from Apple, how to sign Electron apps, and how to test them.

The simplest way to get signing certificates is to use Xcode:

The "Apple Development" certificate is used to sign apps for development and testing, on machines that have been registered on Apple Developer website. The method of registration will be described in Prepare provisioning profile.

Apps signed with the "Apple Development" certificate cannot be submitted to Mac App Store. For that purpose, apps must be signed with the "Apple Distribution" certificate instead. But note that apps signed with the "Apple Distribution" certificate cannot run directly, they must be re-signed by Apple to be able to run, which will only be possible after being downloaded from the Mac App Store.

You may notice that there are also other kinds of certificates.

The "Developer ID Application" certificate is used to sign apps before distributing them outside the Mac App Store.

The "Developer ID Installer" and "Mac Installer Distribution" certificates are used to sign the Mac Installer Package instead of the app itself. Most Electron apps do not use Mac Installer Package so they are generally not needed.

The full list of certificate types can be found here.

Apps signed with "Apple Development" and "Apple Distribution" certificates can only run under App Sandbox, so they must use the MAS build of Electron. However, the "Developer ID Application" certificate does not have this restrictions, so apps signed with it can use either the normal build or the MAS build of Electron.

Apple has been changing the names of certificates during past years, you might encounter them when reading old documentations, and some utilities are still using one of the old names.

If you want to test your app on your local machine before submitting your app to the Mac App Store, you have to sign the app with the "Apple Development" certificate with the provisioning profile embedded in the app bundle.

To create a provisioning profile, you can follow the below steps:

Apps submitted to the Mac App Store must run under Apple's App Sandbox, and only the MAS build of Electron can run with the App Sandbox. The standard darwin build of Electron will fail to launch when run under App Sandbox.

When signing the app with @electron/osx-sign, it will automatically add the necessary entitlements to your app's entitlements.

If you are signing your app without using @electron/osx-sign, you must ensure the app bundle's entitlements have at least following keys:entitlements.plist<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"> <dict> <key>com.apple.security.app-sandbox</key> <true/> <key>com.apple.security.application-groups</key> <array> <string>TEAM_ID.your.bundle.id</string> </array> </dict></plist>The TEAM_ID should be replaced with your Apple Developer account's Team ID, and the your.bundle.id should be replaced with the App ID of the app.And the following entitlements must be added to the binaries and helpers in the app's bundle:<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"> <dict> <key>com.apple.security.app-sandbox</key> <true/> <key>com.apple.security.inherit</key> <true/> </dict></plist>And the app bundle's Info.plist must include ElectronTeamID key, which has your Apple Developer account's Team ID as its value:<plist version="1.0"><dict> ... <key>ElectronTeamID</key> <string>TEAM_ID</string></dict></plist>When using @electron/osx-sign the ElectronTeamID key will be added automatically by extracting the Team ID from the certificate's name. You may need to manually add this key if @electron/osx-sign could not find the correct Team ID.

The TEAM_ID should be replaced with your Apple Developer account's Team ID, and the your.bundle.id should be replaced with the App ID of the app.And the following entitlements must be added to the binaries and helpers in the app's bundle:<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"> <dict> <key>com.apple.security.app-sandbox</key> <true/> <key>com.apple.security.inherit</key> <true/> </dict></plist>And the app bundle's Info.plist must include ElectronTeamID key, which has your Apple Developer account's Team ID as its value:<plist version="1.0"><dict> ... <key>ElectronTeamID</key> <string>TEAM_ID</string></dict></plist>When using @electron/osx-sign the ElectronTeamID key will be added automatically by extracting the Team ID from the certificate's name. You may need to manually add this key if @electron/osx-sign could not find the correct Team ID.

And the following entitlements must be added to the binaries and helpers in the app's bundle:<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"> <dict> <key>com.apple.security.app-sandbox</key> <true/> <key>com.apple.security.inherit</key> <true/> </dict></plist>And the app bundle's Info.plist must include ElectronTeamID key, which has your Apple Developer account's Team ID as its value:<plist version="1.0"><dict> ... <key>ElectronTeamID</key> <string>TEAM_ID</string></dict></plist>When using @electron/osx-sign the ElectronTeamID key will be added automatically by extracting the Team ID from the certificate's name. You may need to manually add this key if @electron/osx-sign could not find the correct Team ID.

And the app bundle's Info.plist must include ElectronTeamID key, which has your Apple Developer account's Team ID as its value:<plist version="1.0"><dict> ... <key>ElectronTeamID</key> <string>TEAM_ID</string></dict></plist>When using @electron/osx-sign the ElectronTeamID key will be added automatically by extracting the Team ID from the certificate's name. You may need to manually add this key if @electron/osx-sign could not find the correct Team ID.

When using @electron/osx-sign the ElectronTeamID key will be added automatically by extracting the Team ID from the certificate's name. You may need to manually add this key if @electron/osx-sign could not find the correct Team ID.

To sign an app that can run on your development machine, you must sign it with the "Apple Development" certificate and pass the provisioning profile to @electron/osx-sign.

If you are signing without @electron/osx-sign, you must place the provisioning profile to YourApp.app/Contents/embedded.provisionprofile.

The signed app can only run on the machines that registered by the provisioning profile, and this is the only way to test the signed app before submitting to Mac App Store.

To sign an app that will be submitted to Mac App Store, you must sign it with the "Apple Distribution" certificate. Note that apps signed with this certificate will not run anywhere, unless it is downloaded from Mac App Store.

After signing the app with the "Apple Distribution" certificate, you can continue to submit it to Mac App Store.

However, this guide do not ensure your app will be approved by Apple; you still need to read Apple's Submitting Your App guide on how to meet the Mac App Store requirements.

Apple Transporter should be used to upload the signed app to App Store Connect for processing, making sure you have created a record before uploading.

If you are seeing errors like private APIs uses, you should check if the app is using the MAS build of Electron.

After uploading, you should submit your app for review.

In order to satisfy all requirements for app sandboxing, the following modules have been disabled in the MAS build:

and the following behaviors have been changed:

Also, due to the usage of app sandboxing, the resources which can be accessed by the app are strictly limited; you can read App Sandboxing for more information.

Every app running under the App Sandbox will run under a limited set of permissions, which limits potential damage from malicious code. Depending on which Electron APIs your app uses, you may need to add additional entitlements to your app's entitlements file. Otherwise, the App Sandbox may prevent you from using them.

Entitlements are specified using a file with format like property list (.plist) or XML. You must provide an entitlement file for the application bundle itself and a child entitlement file which basically describes an inheritance of properties, specified for all other enclosing executable files like binaries, frameworks (.framework), and dynamically linked libraries (.dylib).

A full list of entitlements is available in the App Sandbox documentation, but below are a few entitlements you might need for your MAS app.

With @electron/osx-sign, you can set custom entitlements per file as such:

Enable outgoing network connections to allow your app to connect to a server:

Enable incoming network connections to allow your app to open a network listening socket:

See the Enabling Network Access documentation for more details.

See the Enabling User-Selected File Access documentation for more details.

See the Enabling User-Selected File Access documentation for more details.

Depending on the countries in which you are releasing your app, you may be required to provide information on the cryptographic algorithms used in your software. See the encryption export compliance docs for more information.

Electron uses following cryptographic algorithms:

**Examples:**

Example 1 (xml):
```xml
<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0">  <dict>    <key>com.apple.security.app-sandbox</key>    <true/>    <key>com.apple.security.application-groups</key>    <array>      <string>TEAM_ID.your.bundle.id</string>    </array>  </dict></plist>
```

Example 2 (xml):
```xml
<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0">  <dict>    <key>com.apple.security.app-sandbox</key>    <true/>    <key>com.apple.security.inherit</key>    <true/>  </dict></plist>
```

Example 3 (xml):
```xml
<plist version="1.0"><dict>  ...  <key>ElectronTeamID</key>  <string>TEAM_ID</string></dict></plist>
```

Example 4 (css):
```css
const { signAsync } = require('@electron/osx-sign')signAsync({  app: '/path/to/your.app',  identity: 'Apple Development',  provisioningProfile: '/path/to/your.provisionprofile'})
```

---

## Menus

**URL:** https://www.electronjs.org/docs/latest/tutorial/menus

**Contents:**
- Menus
- Available menus in Electron​
- 📄️ Application Menu
- 📄️ Context Menu
- 📄️ Dock Menu
- 📄️ Tray Menu
- 📄️ Keyboard Shortcuts
- Building menus​
  - Types​
  - Roles​

Electron's Menu class provides a standardized way to create cross-platform native menus throughout your application.

The same menu API is used for multiple use cases:

To learn more about the various kinds of native menus you can create and how to specify keyboard shortcuts, see the individual guides in this section:

Customize the main application menu for your Electron app

Configure cross-platform native OS menus with the Menu API.

Configure your app's Dock presence on macOS.

Create a Tray icon with its own menu in the system's notification area.

Define accelerator strings for local and global keyboard shortcuts

Each Menu instance is composed of an array of MenuItem objects accessible via the menu.items instance property. Menus can be nested by setting the item.submenu property to another menu.

There are two ways to build a menu: either by directly calling menu.append or by using the static Menu.buildFromTemplate helper function.

The helper function reduces boilerplate by allowing you to pass a collection of MenuItem constructor options (or instantiated MenuItem instances) in a single array rather than having to append each item in a separate function call.

Below is an example of a minimal application menu:

All menu items (except for the separator type) must have a label. Labels can either be manually defined using the label property or inherited from the item's role.

A menu item's type grants it a particular appearance and functionality. Some types are automatically assigned based on other constructor options:

Other available types, when specified, give special additional properties to the menu item:

Adjacent radio items are at the same level of submenu and not divided by a separator.[ { type: 'radio', label: 'Adjacent 1' }, { type: 'radio', label: 'Adjacent 2' }, { type: 'separator' }, { type: 'radio', label: 'Non-adjacent' } // unaffected by the others]

Roles give normal type menu items predefined behaviors.

We recommend specifying the role attribute for any menu item that matches a standard role rather than trying to manually implement the behavior in a click function. The built-in role behavior will give the best native experience.

The label and accelerator values are optional when using a role and will default to appropriate values for each platform.

Role strings are case-insensitive. For example, toggleDevTools, toggledevtools, and TOGGLEDEVTOOLS are all equivalent roles when defining menu items.

macOS has a number of platform-specific menu roles available. Many of these map to underlying AppKit APIs.

When specifying a role on macOS, label and accelerator are the only options that will affect the menu item. All other options will be ignored.

The accelerator property allows you to define accelerator strings to map menu items to keyboard shortcuts. For more details, see the Keyboard Shortcuts guide.

You can make use of the before, after, beforeGroupContaining, afterGroupContaining and id attributes to control how menu items will be placed when building a menu with Menu.buildFromTemplate.

By default, items will be inserted in the order they exist in the template unless one of the specified positioning keywords is used.

To add visual aid to your menus, you can use the icon property to assign images to individual MenuItem instances.

You can add sublabels (also known as subtitles) to menu items using the sublabel option on macOS 14.4 and above.

Tooltips are informational indicators that appear when you hover over a menu item. You can set menu item tooltips on macOS using the toolTip option.

**Examples:**

Example 1 (swift):
```swift
const submenu = new Menu()submenu.append(new MenuItem({ label: 'Hello' }))submenu.append(new MenuItem({ type: 'separator' }))submenu.append(new MenuItem({ label: 'Electron', type: 'checkbox', checked: true }))const menu = new Menu()menu.append(new MenuItem({ label: 'Menu', submenu }))Menu.setApplicationMenu(menu)
```

Example 2 (css):
```css
const menu = Menu.buildFromTemplate([{  label: 'Menu',  submenu: [    { label: 'Hello' },    { type: 'separator' },    { label: 'Electron', type: 'checkbox', checked: true }  ]}])Menu.setApplicationMenu(menu)
```

Example 3 (css):
```css
[  { type: 'radio', label: 'Adjacent 1' },  { type: 'radio', label: 'Adjacent 2' },  { type: 'separator' },  { type: 'radio', label: 'Non-adjacent' } // unaffected by the others]
```

Example 4 (css):
```css
[  { id: '1', label: 'one' },  { id: '2', label: 'two' },  { id: '3', label: 'three' },  { id: '4', label: 'four' }]
```

---

## Context Isolation

**URL:** https://www.electronjs.org/docs/latest/tutorial/context-isolation

**Contents:**
- Context Isolation
- What is it?​
- Migration​
  - Before: context isolation disabled​
  - After: context isolation enabled​
- Security considerations​
- Usage with TypeScript​

Context Isolation is a feature that ensures that both your preload scripts and Electron's internal logic run in a separate context to the website you load in a webContents. This is important for security purposes as it helps prevent the website from accessing Electron internals or the powerful APIs your preload script has access to.

This means that the window object that your preload script has access to is actually a different object than the website would have access to. For example, if you set window.hello = 'wave' in your preload script and context isolation is enabled, window.hello will be undefined if the website tries to access it.

Context isolation has been enabled by default since Electron 12, and it is a recommended security setting for all applications.

Without context isolation, I used to provide APIs from my preload script using window.X = apiObject. Now what?

Exposing APIs from your preload script to a loaded website in the renderer process is a common use-case. With context isolation disabled, your preload script would share a common global window object with the renderer. You could then attach arbitrary properties to a preload script:

The doAThing() function could then be used directly in the renderer process:

There is a dedicated module in Electron to help you do this in a painless way. The contextBridge module can be used to safely expose APIs from your preload script's isolated context to the context the website is running in. The API will also be accessible from the website on window.myAPI just like it was before.

Please read the contextBridge documentation linked above to fully understand its limitations. For instance, you can't send custom prototypes or symbols over the bridge.

Just enabling contextIsolation and using contextBridge does not automatically mean that everything you do is safe. For instance, this code is unsafe.

It directly exposes a powerful API without any kind of argument filtering. This would allow any website to send arbitrary IPC messages, which you do not want to be possible. The correct way to expose IPC-based APIs would instead be to provide one method per IPC message.

If you're building your Electron app with TypeScript, you'll want to add types to your APIs exposed over the context bridge. The renderer's window object won't have the correct typings unless you extend the types with a declaration file.

For example, given this preload.ts script:

You can create a interface.d.ts declaration file and globally augment the Window interface:

Doing so will ensure that the TypeScript compiler will know about the electronAPI property on your global window object when writing scripts in your renderer process:

**Examples:**

Example 1 (css):
```css
// preload with contextIsolation disabledwindow.myAPI = {  doAThing: () => {}}
```

Example 2 (unknown):
```unknown
// use the exposed API in the rendererwindow.myAPI.doAThing()
```

Example 3 (javascript):
```javascript
// preload with contextIsolation enabledconst { contextBridge } = require('electron')contextBridge.exposeInMainWorld('myAPI', {  doAThing: () => {}})
```

Example 4 (unknown):
```unknown
// use the exposed API in the rendererwindow.myAPI.doAThing()
```

---

## Snapcraft Guide (Linux)

**URL:** https://www.electronjs.org/docs/latest/tutorial/snapcraft

**Contents:**
- Snapcraft Guide (Linux)
- Background and Requirements​
- Using electron-installer-snap​
  - Step 1: Package Your Electron Application​
  - Step 2: Running electron-installer-snap​
- Using snapcraft with @electron/packager​
  - Step 1: Create Sample Snapcraft Project​
  - Step 2: Create Sample Snapcraft Project​
  - Step 3: Build the snap​
  - Step 4: Install the snap​

This guide provides information on how to package your Electron application for any Snapcraft environment, including the Ubuntu Software Center.

Together with the broader Linux community, Canonical aims to address common software installation issues through the snapcraft project. Snaps are containerized software packages that include required dependencies, auto-update, and work on all major Linux distributions without system modification.

There are three ways to create a .snap file:

In some cases, you will need to have the snapcraft tool installed. Instructions to install snapcraft for your particular distribution are available here.

The module works like electron-winstaller and similar modules in that its scope is limited to building snap packages. You can install it with:

Package the application using @electron/packager (or a similar tool). Make sure to remove node_modules that you don't need in your final application, since any module you don't actually need will increase your application's size.

The output should look roughly like this:

From a terminal that has snapcraft in its PATH, run electron-installer-snap with the only required parameter --src, which is the location of your packaged Electron application created in the first step.

If you have an existing build pipeline, you can use electron-installer-snap programmatically. For more information, see the Snapcraft API docs.

Create a snap directory in your project root and add the following to snap/snapcraft.yaml:

If you want to apply this example to an existing project, replace all instances of my-app with your project's name.

Snapcraft is capable of taking an existing .deb file and turning it into a .snap file. The creation of a snap is configured using a snapcraft.yaml file that describes the sources, dependencies, description, and other core building blocks.

If you do not already have a .deb package, using electron-installer-snap might be an easier path to create snap packages. However, multiple solutions for creating Debian packages exist, including Electron Forge, electron-builder or electron-installer-debian.

For more information on the available configuration options, see the documentation on the snapcraft syntax. Let's look at an example:

As you can see, the snapcraft.yaml instructs the system to launch a file called electron-launch. In this example, it passes information on to the app's binary:

Alternatively, if you're building your snap with strict confinement, you can use the desktop-launch command:

Capturing the desktop requires PipeWire library in some Linux configurations that use the Wayland protocol. To bundle PipeWire with your application, ensure that the base snap is set to core22 or newer. Next, create a part called pipewire and add it to the after section of your application:

Finally, configure your application's environment for PipeWire:

**Examples:**

Example 1 (unknown):
```unknown
npm install --save-dev electron-installer-snap
```

Example 2 (unknown):
```unknown
.└── dist    └── app-linux-x64        ├── LICENSE        ├── LICENSES.chromium.html        ├── content_shell.pak        ├── app        ├── icudtl.dat        ├── libgcrypt.so.11        ├── libnode.so        ├── locales        ├── resources        ├── v8_context_snapshot.bin        └── version
```

Example 3 (unknown):
```unknown
npx electron-installer-snap --src=out/myappname-linux-x64
```

Example 4 (javascript):
```javascript
const snap = require('electron-installer-snap')snap(options)  .then(snapPath => console.log(`Created snap at ${snapPath}!`))
```

---

## Updating Applications

**URL:** https://www.electronjs.org/docs/latest/tutorial/updates

**Contents:**
- Updating Applications
- Using cloud object storage (serverless)​
  - Publishing release metadata​
  - Reading release metadata​
- Using update.electronjs.org​
- Using other update services​
  - Step 1: Deploying an update server​
  - Step 2: Receiving updates in your app​
  - Step 3: Notifying users when updates are available​
- Update server specification​

There are several ways to provide automatic updates to your Electron application. The easiest and officially supported one is taking advantage of the built-in Squirrel framework and Electron's autoUpdater module.

For a simple serverless update flow, Electron's autoUpdater module can check if updates are available by pointing to a static storage URL containing latest release metadata.

When a new release is available, this metadata needs to be published to cloud storage alongside the release itself. The metadata format is different for macOS and Windows.

With Electron Forge, you can set up static file storage updates by publishing metadata artifacts from the ZIP Maker (macOS) with macUpdateManifestBaseUrl and the Squirrel.Windows Maker (Windows) with remoteReleases.

See Forge's Auto updating from S3 guide for an end-to-end example.

On macOS, Squirrel.Mac can receive updates by reading a releases.json file with the following JSON format:releases.json{ "currentRelease": "1.2.3", "releases": [ { "version": "1.2.1", "updateTo": { "version": "1.2.1", "pub_date": "2023-09-18T12:29:53+01:00", "notes": "Theses are some release notes innit", "name": "1.2.1", "url": "https://mycompany.example.com/myapp/releases/myrelease" } }, { "version": "1.2.3", "updateTo": { "version": "1.2.3", "pub_date": "2024-09-18T12:29:53+01:00", "notes": "Theses are some more release notes innit", "name": "1.2.3", "url": "https://mycompany.example.com/myapp/releases/myrelease3" } } ]}On Windows, Squirrel.Windows can receive updates by reading from the RELEASES file generated during the build process. This file details the .nupkg delta package to update to.RELEASESB0892F3C7AC91D72A6271FF36905FEF8FE993520 electron-fiddle-0.36.3-full.nupkg 103298365These files should live in the same directory as your release, under a folder structure that is aware of your app's platform and architecture.For example:my-app-updates/├─ darwin/│ ├─ x64/│ │ ├─ my-app-1.0.0-darwin-x64.zip│ │ ├─ my-app-1.1.0-darwin-x64.zip│ │ ├─ RELEASES.json│ ├─ arm64/│ │ ├─ my-app-1.0.0-darwin-arm64.zip│ │ ├─ my-app-1.1.0-darwin-arm64.zip│ │ ├─ RELEASES.json├─ win32/│ ├─ x64/│ │ ├─ my-app-1.0.0-win32-x64.exe│ │ ├─ my-app-1.0.0-win32-x64.nupkg│ │ ├─ my-app-1.1.0-win32-x64.exe│ │ ├─ my-app-1.1.0-win32-x64.nupkg│ │ ├─ RELEASES

On Windows, Squirrel.Windows can receive updates by reading from the RELEASES file generated during the build process. This file details the .nupkg delta package to update to.RELEASESB0892F3C7AC91D72A6271FF36905FEF8FE993520 electron-fiddle-0.36.3-full.nupkg 103298365These files should live in the same directory as your release, under a folder structure that is aware of your app's platform and architecture.For example:my-app-updates/├─ darwin/│ ├─ x64/│ │ ├─ my-app-1.0.0-darwin-x64.zip│ │ ├─ my-app-1.1.0-darwin-x64.zip│ │ ├─ RELEASES.json│ ├─ arm64/│ │ ├─ my-app-1.0.0-darwin-arm64.zip│ │ ├─ my-app-1.1.0-darwin-arm64.zip│ │ ├─ RELEASES.json├─ win32/│ ├─ x64/│ │ ├─ my-app-1.0.0-win32-x64.exe│ │ ├─ my-app-1.0.0-win32-x64.nupkg│ │ ├─ my-app-1.1.0-win32-x64.exe│ │ ├─ my-app-1.1.0-win32-x64.nupkg│ │ ├─ RELEASES

These files should live in the same directory as your release, under a folder structure that is aware of your app's platform and architecture.For example:my-app-updates/├─ darwin/│ ├─ x64/│ │ ├─ my-app-1.0.0-darwin-x64.zip│ │ ├─ my-app-1.1.0-darwin-x64.zip│ │ ├─ RELEASES.json│ ├─ arm64/│ │ ├─ my-app-1.0.0-darwin-arm64.zip│ │ ├─ my-app-1.1.0-darwin-arm64.zip│ │ ├─ RELEASES.json├─ win32/│ ├─ x64/│ │ ├─ my-app-1.0.0-win32-x64.exe│ │ ├─ my-app-1.0.0-win32-x64.nupkg│ │ ├─ my-app-1.1.0-win32-x64.exe│ │ ├─ my-app-1.1.0-win32-x64.nupkg│ │ ├─ RELEASES

For example:my-app-updates/├─ darwin/│ ├─ x64/│ │ ├─ my-app-1.0.0-darwin-x64.zip│ │ ├─ my-app-1.1.0-darwin-x64.zip│ │ ├─ RELEASES.json│ ├─ arm64/│ │ ├─ my-app-1.0.0-darwin-arm64.zip│ │ ├─ my-app-1.1.0-darwin-arm64.zip│ │ ├─ RELEASES.json├─ win32/│ ├─ x64/│ │ ├─ my-app-1.0.0-win32-x64.exe│ │ ├─ my-app-1.0.0-win32-x64.nupkg│ │ ├─ my-app-1.1.0-win32-x64.exe│ │ ├─ my-app-1.1.0-win32-x64.nupkg│ │ ├─ RELEASES

The easiest way to consume metadata is by installing update-electron-app, a drop-in Node.js module that sets up autoUpdater and prompts the user with a native dialog.

For static storage updates, point the updateSource.baseUrl parameter to the directory containing your release metadata files.

The Electron team maintains update.electronjs.org, a free and open-source webservice that Electron apps can use to self-update. The service is designed for Electron apps that meet the following criteria:

The easiest way to use this service is by installing update-electron-app, a Node.js module preconfigured for use with update.electronjs.org.

Install the module using your Node.js package manager of choice:

Then, invoke the updater from your app's main process file:

By default, this module will check for updates at app startup, then every ten minutes. When an update is found, it will automatically be downloaded in the background. When the download completes, a dialog is displayed allowing the user to restart the app.

If you need to customize your configuration, you can pass options to update-electron-app or use the update service directly.

If you're developing a private Electron application, or if you're not publishing releases to GitHub Releases, it may be necessary to run your own update server.

Depending on your needs, you can choose from one of these:

Once you've deployed your update server, you can instrument your app code to receive and apply the updates with Electron's autoUpdater module.

First, import the required modules in your main process code. The following code might vary for different server software, but it works like described when using Hazel.

Please ensure that the code below will only be executed in your packaged app, and not in development. You can use the app.isPackaged API to check the environment.

Next, construct the URL of the update server feed and tell autoUpdater about it:

As the final step, check for updates. The example below will check every minute:

Once your application is packaged, it will receive an update for each new GitHub Release that you publish.

Now that you've configured the basic update mechanism for your application, you need to ensure that the user will get notified when there's an update. This can be achieved using the autoUpdater API events:

Also make sure that errors are being handled. Here's an example for logging them to stderr:

Because the requests made by autoUpdate aren't under your direct control, you may find situations that are difficult to handle (such as if the update server is behind authentication). The url field supports the file:// protocol, which means that with some effort, you can sidestep the server-communication aspect of the process by loading your update from a local directory. Here's an example of how this could work.

For advanced deployment needs, you can also roll out your own Squirrel-compatible update server. For example, you may want to have percentage-based rollouts, distribute your app through separate release channels, or put your update server behind an authentication check.

Squirrel.Windows and Squirrel.Mac clients require different response formats, but you can use a single server for both platforms by sending requests to different endpoints depending on the value of process.platform.

A Squirrel.Windows client expects the update server to return the RELEASES artifact of the latest available build at the /RELEASES subpath of your endpoint.

For example, if your feed URL is https://your-deployment-url.com/update/win32/1.2.3, then the https://your-deployment-url.com/update/win32/1.2.3/RELEASES endpoint should return the contents of the RELEASES artifact of the version you want to serve.

Squirrel.Windows does the comparison check to see if the current app should update to the version returned in RELEASES, so you should return a response even when no update is available.

When an update is available, the Squirrel.Mac client expects a JSON response at the feed URL's endpoint. This object has a mandatory url property that maps to a ZIP archive of the app update. All other properties in the object are optional.

If no update is available, the server should return a 204 No Content HTTP response.

**Examples:**

Example 1 (json):
```json
{  "currentRelease": "1.2.3",  "releases": [    {      "version": "1.2.1",      "updateTo": {        "version": "1.2.1",        "pub_date": "2023-09-18T12:29:53+01:00",        "notes": "Theses are some release notes innit",        "name": "1.2.1",        "url": "https://mycompany.example.com/myapp/releases/myrelease"      }    },    {      "version": "1.2.3",      "updateTo": {        "version": "1.2.3",        "pub_date": "2024-09-18T12:29:53+01:00",        "notes": "Theses are some more release notes innit",        "name": "1.2.3",        "url": "https://mycompany.example.com/myapp/releases/myrelease3"      }    }  ]}
```

Example 2 (unknown):
```unknown
B0892F3C7AC91D72A6271FF36905FEF8FE993520 electron-fiddle-0.36.3-full.nupkg 103298365
```

Example 3 (unknown):
```unknown
my-app-updates/├─ darwin/│  ├─ x64/│  │  ├─ my-app-1.0.0-darwin-x64.zip│  │  ├─ my-app-1.1.0-darwin-x64.zip│  │  ├─ RELEASES.json│  ├─ arm64/│  │  ├─ my-app-1.0.0-darwin-arm64.zip│  │  ├─ my-app-1.1.0-darwin-arm64.zip│  │  ├─ RELEASES.json├─ win32/│  ├─ x64/│  │  ├─ my-app-1.0.0-win32-x64.exe│  │  ├─ my-app-1.0.0-win32-x64.nupkg│  │  ├─ my-app-1.1.0-win32-x64.exe│  │  ├─ my-app-1.1.0-win32-x64.nupkg│  │  ├─ RELEASES
```

Example 4 (css):
```css
const { updateElectronApp, UpdateSourceType } = require('update-electron-app')updateElectronApp({  updateSource: {    type: UpdateSourceType.StaticStorage,    baseUrl: `https://my-bucket.s3.amazonaws.com/my-app-updates/${process.platform}/${process.arch}`  }})
```

---

## ASAR Archives

**URL:** https://www.electronjs.org/docs/latest/tutorial/asar-archives

**Contents:**
- ASAR Archives
- Using ASAR Archives​
  - Node API​
  - Web API​
  - Treating an ASAR archive as a Normal File​
- Limitations of the Node API​
  - Archives Are Read-only​
  - Working Directory Can Not Be Set to Directories in Archive​
  - Extra Unpacking on Some APIs​
  - Fake Stat Information of fs.stat​

After creating an application distribution, the app's source code are usually bundled into an ASAR archive, which is a simple extensive archive format designed for Electron apps. By bundling the app we can mitigate issues around long path names on Windows, speed up require and conceal your source code from cursory inspection.

The bundled app runs in a virtual file system and most APIs would just work normally, but for some cases you might want to work on ASAR archives explicitly due to a few caveats.

In Electron there are two sets of APIs: Node APIs provided by Node.js and Web APIs provided by Chromium. Both APIs support reading files from ASAR archives.

With special patches in Electron, Node APIs like fs.readFile and require treat ASAR archives as virtual directories, and the files in it as normal files in the filesystem.

For example, suppose we have an example.asar archive under /path/to:

Read a file in the ASAR archive:

List all files under the root of the archive:

Use a module from the archive:

You can also display a web page in an ASAR archive with BrowserWindow:

In a web page, files in an archive can be requested with the file: protocol. Like the Node API, ASAR archives are treated as directories.

For example, to get a file with $.get:

For some cases like verifying the ASAR archive's checksum, we need to read the content of an ASAR archive as a file. For this purpose you can use the built-in original-fs module which provides original fs APIs without asar support:

You can also set process.noAsar to true to disable the support for asar in the fs module:

Even though we tried hard to make ASAR archives in the Node API work like directories as much as possible, there are still limitations due to the low-level nature of the Node API.

The archives can not be modified so all Node APIs that can modify files will not work with ASAR archives.

Though ASAR archives are treated as directories, there are no actual directories in the filesystem, so you can never set the working directory to directories in ASAR archives. Passing them as the cwd option of some APIs will also cause errors.

Most fs APIs can read a file or get a file's information from ASAR archives without unpacking, but for some APIs that rely on passing the real file path to underlying system calls, Electron will extract the needed file into a temporary file and pass the path of the temporary file to the APIs to make them work. This adds a little overhead for those APIs.

APIs that requires extra unpacking are:

The Stats object returned by fs.stat and its friends on files in asar archives is generated by guessing, because those files do not exist on the filesystem. So you should not trust the Stats object except for getting file size and checking file type.

There are Node APIs that can execute binaries like child_process.exec, child_process.spawn and child_process.execFile, but only execFile is supported to execute binaries inside ASAR archive.

This is because exec and spawn accept command instead of file as input, and commands are executed under shell. There is no reliable way to determine whether a command uses a file in asar archive, and even if we do, we can not be sure whether we can replace the path in command without side effects.

As stated above, some Node APIs will unpack the file to the filesystem when called. Apart from the performance issues, various anti-virus scanners might be triggered by this behavior.

As a workaround, you can leave various files unpacked using the --unpack option. In the following example, shared libraries of native Node.js modules will not be packed:

After running the command, you will notice that a folder named app.asar.unpacked was created together with the app.asar file. It contains the unpacked files and should be shipped together with the app.asar archive.

**Examples:**

Example 1 (unknown):
```unknown
$ asar list /path/to/example.asar/app.js/file.txt/dir/module.js/static/index.html/static/main.css/static/jquery.min.js
```

Example 2 (javascript):
```javascript
const fs = require('node:fs')fs.readFileSync('/path/to/example.asar/file.txt')
```

Example 3 (javascript):
```javascript
const fs = require('node:fs')fs.readdirSync('/path/to/example.asar')
```

Example 4 (javascript):
```javascript
require('./path/to/example.asar/dir/module.js')
```

---

## Examples Overview

**URL:** https://www.electronjs.org/docs/latest/tutorial/examples

**Contents:**
- Examples Overview
- How to...?​

In this section, we have collected a set of guides for common features that you may want to implement in your Electron application. Each guide contains a practical example in a minimal, self-contained example app. The easiest way to run these examples is by downloading Electron Fiddle.

Once Fiddle is installed, you can press on the "Open in Fiddle" button that you will find below code samples like the following one:

You can find the full list of "How to?" in the sidebar. If there is something that you would like to do that is not documented, please join our Discord server and let us know!

**Examples:**

Example 1 (javascript):
```javascript
const { app, BrowserWindow } = require('electron/main')const path = require('node:path')function createWindow () {  const win = new BrowserWindow({    width: 800,    height: 600,    webPreferences: {      preload: path.join(__dirname, 'preload.js')    }  })  win.loadFile('index.html')}app.whenReady().then(() => {  createWindow()  app.on('activate', () => {    if (BrowserWindow.getAllWindows().length === 0) {      createWindow()    }  })})app.on('window-all-closed', () => {  if (process.platform !== 'darwin') {    app.quit()  }})
```

Example 2 (javascript):
```javascript
window.addEventListener('DOMContentLoaded', () => {  const replaceText = (selector, text) => {    const element = document.getElementById(selector)    if (element) element.innerText = text  }  for (const type of ['chrome', 'node', 'electron']) {    replaceText(`${type}-version`, process.versions[type])  }})
```

Example 3 (html):
```html
<!DOCTYPE html><html><head>    <meta charset="UTF-8">    <title>Hello World!</title>    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" /></head><body>    <h1>Hello World!</h1>    <p>        We are using Node.js <span id="node-version"></span>,        Chromium <span id="chrome-version"></span>,        and Electron <span id="electron-version"></span>.    </p></body></html>
```

---

## Web Embeds

**URL:** https://www.electronjs.org/docs/latest/tutorial/web-embeds

**Contents:**
- Web Embeds
- Overview​
  - Iframes​
  - WebViews​
  - WebContentsView​

If you want to embed (third-party) web content in an Electron BrowserWindow, there are three options available to you: <iframe> tags, <webview> tags, and WebContentsView. Each one offers slightly different functionality and is useful in different situations. To help you choose between these, this guide explains the differences and capabilities of each option.

Iframes in Electron behave like iframes in regular browsers. An <iframe> element in your page can show external web pages, provided that their Content Security Policy allows it. To limit the number of capabilities of a site in an <iframe> tag, it is recommended to use the sandbox attribute and only allow the capabilities you want to support.

We do not recommend you to use WebViews, as this tag undergoes dramatic architectural changes that may affect stability of your application. Consider switching to alternatives, like iframe and Electron's WebContentsView, or an architecture that avoids embedded content by design.

WebViews are based on Chromium's WebViews and are not explicitly supported by Electron. We do not guarantee that the WebView API will remain available in future versions of Electron. To use <webview> tags, you will need to set webviewTag to true in the webPreferences of your BrowserWindow.

WebView is a custom element (<webview>) that will only work inside Electron. They are implemented as an "out-of-process iframe". This means that all communication with the <webview> is done asynchronously using IPC. The <webview> element has many custom methods and events, similar to webContents, that provide you with greater control over the content.

Compared to an <iframe>, <webview> tends to be slightly slower but offers much greater control in loading and communicating with the third-party content and handling various events.

WebContentsViews are not a part of the DOM—instead, they are created, controlled, positioned, and sized by your Main process. Using WebContentsView, you can combine and layer many pages together in the same BaseWindow.

WebContentsViews offer the greatest control over their contents, since they implement the webContents similarly to how BrowserWindow does it. However, as WebContentsViews are not elements inside the DOM, positioning them accurately with respect to DOM content requires coordination between the Main and Renderer processes.

---

## Native Code and Electron

**URL:** https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron

**Contents:**
- Native Code and Electron
- Tutorial: Creating a Native Node.js Addon for Electron
- Requirements​
  - Requirements: macOS​
  - Requirements: Windows​
  - Requirements: Linux​
- 1) Creating a package​
- 2) Setting up the build system​
  - Configuring node-gyp​
- 3) "Hello World" from C++​

One of Electron's most powerful features is the ability to combine web technologies with native code - both for compute-intensive logic as well as for the occasional native user interface, where desired.

Electron does so by building on top of "Native Node.js Addons". You've probably already come across a few of them - packages like the famous sqlite use native code to combine JavaScript and native technologies. You can use this feature to extend your Electron application with anything a fully native application can do:

Native Node.js addons are dynamically-linked shared objects (on Unix-like systems) or DLL files (on Windows) that can be loaded into Node.js or Electron using the require() or import functions. They behave just like regular JavaScript modules but provide an interface to code written in C++, Rust, or other languages that can compile to native code.

This tutorial will walk you through building a basic Node.js native addon that can be used in Electron applications. We'll focus on concepts common to all platforms, using C++ as the implementation language. Once you complete this tutorial common to all native Node.js addons, you can move on to one of our platform-specific tutorials.

This tutorial assumes you have Node.js and npm installed, as well as the basic tools necessary for compiling code on your platform (like Visual Studio on Windows, Xcode on macOS, or GCC/Clang on Linux). You can find detailed instructions in the node-gyp readme.

To build native Node.js addons on macOS, you'll need the Xcode Command Line Tools. These provide the necessary compilers and build tools (namely, clang, clang++, and make). The following command will prompt you to install the Command Line Tools if they aren't already installed.

The official Node.js installer offers the optional installation of "Tools for Native Modules", which installs everything required for the basic compilation of C++ modules - specifically, Python 3 and the "Visual Studio Desktop development with C++" workload. Alternatively, you can use chocolatey, winget, or the Windows Store.

First, create a new Node.js package that will contain your native addon:

This creates a basic package.json file. Next, we'll install the necessary dependencies:

Now, let's update our package.json to include the appropriate build scripts. We will explain what these specifically do further below.

Node.js addons use a build system called node-gyp, which is a cross-platform command-line tool written in Node.js. It compiles native addon modules for Node.js using platform-specific build tools behind the scenes:

The binding.gyp file is a JSON-like configuration file that tells node-gyp how to build your native addon. It's similar to a make file or a project file but in a platform-independent format. Let's create a basic binding.gyp file:

Let's break down this configuration:

Now, create the directory structure for our project:

Let's start by defining our C++ interface in a header file. Create include/cpp_code.h:

The #pragma once directive is a header guard that prevents the file from being included multiple times in the same compilation unit. The actual function declaration is inside a namespace to avoid potential name conflicts.

Next, let's implement the function in src/cpp_code.cc:

This is a simple implementation that just adds some text to the input string and returns it.

Now, let's create the addon code that bridges our C++ code with the Node.js/JavaScript world. Create src/my_addon.cc:

Let's break down this code:

Now, let's create a JavaScript wrapper to make the addon easier to use. Create js/index.js:

This JavaScript wrapper:

Now we can build our native addon:

This will run node-gyp configure and node-gyp build to compile our C++ code into a .node file. Let's create a simple test script to verify everything works. Create test.js in the project root:

If everything works correctly, you should see:

To use this addon in an Electron application, you would:

Native addon development can be written in several languages beyond C++. Rust can be used with crates like napi-rs, neon, or node-bindgen. Objective-C/Swift can be used through Objective-C++ on macOS.

The specific implementation details differ significantly by platform, especially when accessing platform-specific APIs or UI frameworks, like Windows' Win32 API, COM components, UWP/WinRT - or macOS's Cocoa, AppKit, or ObjectiveC runtime.

This means that you'll likely use two groups of references for your native code: First, on the Node.js side, use the N-API documentation to learn about creating and exposing complex structures to JavaScript - like asynchronous thread-safe function calls or creating JavaScript-native objects (error, promise, etc). Secondly, on the side of the technology you're working with, you'll likely be looking at their lower-level documentation:

**Examples:**

Example 1 (sql):
```sql
xcode-select --install
```

Example 2 (unknown):
```unknown
mkdir my-native-addoncd my-native-addonnpm init -y
```

Example 3 (unknown):
```unknown
npm install node-addon-api bindings
```

Example 4 (json):
```json
{  "name": "my-native-addon",  "version": "1.0.0",  "description": "A native addon for Electron",  "main": "js/index.js",  "scripts": {    "clean": "node -e \"require('fs').rmSync('build', { recursive: true, force: true })\"",    "build": "node-gyp configure && node-gyp build"  },  "dependencies": {    "bindings": "^1.5.0",    "node-addon-api": "^8.3.0"  },  "devDependencies": {    "node-gyp": "^11.1.0"  }}
```

---

## Accessibility

**URL:** https://www.electronjs.org/docs/latest/tutorial/accessibility

**Contents:**
- Accessibility
- Manually enabling accessibility features​
  - Using Electron's API​
  - Within third-party software​
    - macOS​

Accessibility concerns in Electron applications are similar to those of websites because they're both ultimately HTML.

Electron applications will automatically enable accessibility features in the presence of assistive technology (e.g. JAWS on Windows or VoiceOver on macOS). See Chrome's accessibility documentation for more details.

You can also manually toggle these features either within your Electron application or by setting flags in third-party native software.

By using the app.setAccessibilitySupportEnabled(enabled) API, you can manually expose Chrome's accessibility tree to users in the application preferences. Note that the user's system assistive utilities have priority over this setting and will override it.

On macOS, third-party assistive technology can toggle accessibility features inside Electron applications by setting the AXManualAccessibility attribute programmatically:

**Examples:**

Example 1 (swift):
```swift
CFStringRef kAXManualAccessibility = CFSTR("AXManualAccessibility");+ (void)enableAccessibility:(BOOL)enable inElectronApplication:(NSRunningApplication *)app{    AXUIElementRef appRef = AXUIElementCreateApplication(app.processIdentifier);    if (appRef == nil)        return;    CFBooleanRef value = enable ? kCFBooleanTrue : kCFBooleanFalse;    AXUIElementSetAttributeValue(appRef, kAXManualAccessibility, value);    CFRelease(appRef);}
```

Example 2 (swift):
```swift
import Cocoalet name = CommandLine.arguments.count >= 2 ? CommandLine.arguments[1] : "Electron"let pid = NSWorkspace.shared.runningApplications.first(where: {$0.localizedName == name})!.processIdentifierlet axApp = AXUIElementCreateApplication(pid)let result = AXUIElementSetAttributeValue(axApp, "AXManualAccessibility" as CFString, true as CFTypeRef)print("Setting 'AXManualAccessibility' \(error.rawValue == 0 ? "succeeded" : "failed")")
```

---

## Context Menu

**URL:** https://www.electronjs.org/docs/latest/tutorial/context-menu

**Contents:**
- Context Menu
- Using the context-menu event (main)​
- Using the contextmenu event (renderer)​
- Additional macOS menu items (e.g. Writing Tools)​

Context menus are pop-up menus that appear when right-clicking (or pressing a shortcut such as Shift + F10 on Windows) somewhere in an app's interface.

No context menu will appear by default in Electron. However, context menus can be created by using the menu.popup function on an instance of the Menu class. You will need to listen for specific context menu events and set up the trigger for menu.popup manually.

There are two ways of listening for context menu events in Electron: either via the main process through webContents or in the renderer process via the contextmenu web event.

Whenever a right-click is detected within the bounds of a specific WebContents instance, a context-menu event is triggered. The params object passed to the listener provides an extensive list of attributes to distinguish which type of element is receiving the event.

For example, if you want to provide a context menu for links, check for the linkURL parameter. If you want to check for editable elements such as <textarea/>, check for the isEditable parameter.

Alternatively, you can also listen to the contextmenu event available on DOM elements in the renderer process and call the menu.popup function via IPC.

To learn more about IPC basics in Electron, see the Inter-Process Communication guide.

On macOS, the Writing Tools, AutoFill, and Services menu items are disabled by default for context menus in Electron. To enable these features, pass the WebFrameMain associated to the target webContents to the frame parameter in menu.popup.

**Examples:**

Example 1 (javascript):
```javascript
const { app, BrowserWindow, Menu } = require('electron/main')function createWindow () {  const win = new BrowserWindow()  const menu = Menu.buildFromTemplate([    { role: 'copy' },    { role: 'cut' },    { role: 'paste' },    { role: 'selectall' }  ])  win.webContents.on('context-menu', (_event, params) => {    // only show the context menu if the element is editable    if (params.isEditable) {      menu.popup()    }  })  win.loadFile('index.html')}app.whenReady().then(() => {  createWindow()  app.on('activate', function () {    if (BrowserWindow.getAllWindows().length === 0) createWindow()  })})app.on('window-all-closed', function () {  if (process.platform !== 'darwin') app.quit()})
```

Example 2 (html):
```html
<!DOCTYPE html><html>  <head>    <meta charset="UTF-8">    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">    <title>Context Menu Demo</title>  </head>  <body>    <h1>Context Menu Demo</h1>    <textarea></textarea>  </body></html>
```

Example 3 (javascript):
```javascript
// Modules to control application life and create native browser windowconst { app, BrowserWindow, ipcMain, Menu } = require('electron/main')const path = require('node:path')function createWindow () {  const mainWindow = new BrowserWindow({    webPreferences: {      preload: path.join(__dirname, 'preload.js')    }  })  mainWindow.loadFile('index.html')  const menu = Menu.buildFromTemplate([    { role: 'copy' },    { role: 'cut' },    { role: 'paste' },    { role: 'selectall' }  ])  ipcMain.on('context-menu', (event) => {    menu.popup({      window: BrowserWindow.fromWebContents(event.sender)    })  })}app.whenReady().then(() => {  createWindow()  app.on('activate', function () {    if (BrowserWindow.getAllWindows().length === 0) createWindow()  })})app.on('window-all-closed', function () {  if (process.platform !== 'darwin') app.quit()})
```

Example 4 (javascript):
```javascript
const { ipcRenderer } = require('electron/renderer')document.addEventListener('DOMContentLoaded', () => {  const textarea = document.getElementById('editable')  textarea.addEventListener('contextmenu', (event) => {    event.preventDefault()    ipcRenderer.send('context-menu')  })})
```

---

## Navigation History

**URL:** https://www.electronjs.org/docs/latest/tutorial/navigation-history

**Contents:**
- Navigation History
- Overview​
- Accessing NavigationHistory​
- Navigating through history​
- Accessing history entries​
- Navigating to specific entries​
- Restoring history​

The NavigationHistory class allows you to manage and interact with the browsing history of your Electron application. This powerful feature enables you to create intuitive navigation experiences for your users.

Navigation history is stored per WebContents instance. To access a specific instance of the NavigationHistory class, use the WebContents class's contents.navigationHistory instance property.

Easily implement back and forward navigation:

Retrieve and display the user's browsing history:

Each navigation entry corresponds to a specific page. The indexing system follows a sequential order:

Allow users to jump to any point in their browsing history:

A common flow is that you want to restore the history of a webContents - for instance to implement an "undo close tab" feature. To do so, you can call navigationHistory.restore({ index, entries }). This will restore the webContent's navigation history and the webContents location in said history, meaning that goBack() and goForward() navigate you through the stack as expected.

Here's a full example that you can open with Electron Fiddle:

**Examples:**

Example 1 (javascript):
```javascript
const { BrowserWindow } = require('electron')const mainWindow = new BrowserWindow()const { navigationHistory } = mainWindow.webContents
```

Example 2 (go):
```go
// Go backif (navigationHistory.canGoBack()) {  navigationHistory.goBack()}// Go forwardif (navigationHistory.canGoForward()) {  navigationHistory.goForward()}
```

Example 3 (javascript):
```javascript
const entries = navigationHistory.getAllEntries()entries.forEach((entry) => {  console.log(`${entry.title}: ${entry.url}`)})
```

Example 4 (sql):
```sql
// Navigate to the 5th entry in the history, if the index is validnavigationHistory.goToIndex(4)// Navigate to the 2nd entry forward from the current positionif (navigationHistory.canGoToOffset(2)) {  navigationHistory.goToOffset(2)}
```

---

## ASAR Integrity

**URL:** https://www.electronjs.org/docs/latest/tutorial/asar-integrity

**Contents:**
- ASAR Integrity
- Version support​
- How it works​
- Enabling ASAR integrity in the binary​
- Providing the header hash​
  - Using Electron tooling​
  - Using other build systems​
    - macOS​
    - Windows​

ASAR integrity is a security feature that validates the contents of your app's ASAR archives at runtime.

Currently, ASAR integrity checking is supported on:

In order to enable ASAR integrity checking, you also need to ensure that your app.asar file was generated by a version of the @electron/asar npm package that supports ASAR integrity.

Support was introduced in asar@3.1.0. Note that this package has since migrated over to @electron/asar. All versions of @electron/asar support ASAR integrity.

Each ASAR archive contains a JSON string header. The header format includes an integrity object that contain a hex encoded hash of the entire archive as well as an array of hex encoded hashes for each block of blockSize bytes.

Separately, you need to define a hex encoded hash of the entire ASAR header when packaging your Electron app.

When ASAR integrity is enabled, your Electron app will verify the header hash of the ASAR archive on runtime. If no hash is present or if there is a mismatch in the hashes, the app will forcefully terminate.

ASAR integrity checking is currently disabled by default in Electron and can be enabled on build time by toggling the EnableEmbeddedAsarIntegrityValidation Electron fuse.

When enabling this fuse, you typically also want to enable the onlyLoadAppFromAsar fuse. Otherwise, the validity checking can be bypassed via the Electron app code search path.

With Electron Forge, you can configure your app's fuses with @electron-forge/plugin-fuses in your Forge configuration file.

ASAR integrity validates the contents of the ASAR archive against the header hash that you provide on package time. The process of providing this packaged hash is different for macOS and Windows.

Electron Forge and Electron Packager do this setup automatically for you with no additional configuration whenever asar is enabled. The minimum required versions for ASAR integrity are:

When packaging for macOS, you must populate a valid ElectronAsarIntegrity dictionary block in your packaged app's Info.plist. An example is included below.

Valid algorithm values are currently SHA256 only. The hash is a hash of the ASAR header using the given algorithm. The @electron/asar package exposes a getRawHeader method whose result can then be hashed to generate this value (e.g. using the node:crypto module).

When packaging for Windows, you must populate a valid resource entry of type Integrity and name ElectronAsar. The value of this resource should be a JSON encoded dictionary in the form included below:

For an implementation example, see src/resedit.ts in the Electron Packager code.

**Examples:**

Example 1 (json):
```json
{  "algorithm": "SHA256",  "hash": "...",  "blockSize": 1024,  "blocks": ["...", "..."]}
```

Example 2 (css):
```css
const { flipFuses, FuseVersion, FuseV1Options } = require('@electron/fuses')flipFuses(  // E.g. /a/b/Foo.app  pathToPackagedApp,  {    version: FuseVersion.V1,    [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,    [FuseV1Options.OnlyLoadAppFromAsar]: true  })
```

Example 3 (xml):
```xml
<key>ElectronAsarIntegrity</key><dict>  <key>Resources/app.asar</key>  <dict>    <key>algorithm</key>    <string>SHA256</string>    <key>hash</key>    <string>9d1f61ea03c4bb62b4416387a521101b81151da0cfbe18c9f8c8b818c5cebfac</string>  </dict></dict>
```

Example 4 (json):
```json
[  {    "file": "resources\\app.asar",    "alg": "sha256",    "value": "9d1f61ea03c4bb62b4416387a521101b81151da0cfbe18c9f8c8b818c5cebfac"  }]
```

---

## Boilerplates and CLIs

**URL:** https://www.electronjs.org/docs/latest/tutorial/boilerplates-and-clis

**Contents:**
- Boilerplates and CLIs
- Boilerplate vs CLI​
- Electron Forge​
- electron-builder​
- electron-react-boilerplate​
- Other Tools and Boilerplates​

Electron development is unopinionated - there is no "one true way" to develop, build, package, or release an Electron application. Additional features for Electron, both for build- and run-time, can usually be found on npm in individual packages, allowing developers to build both the app and build pipeline they need.

That level of modularity and extendability ensures that all developers working with Electron, both big and small in team-size, are never restricted in what they can or cannot do at any time during their development lifecycle. However, for many developers, one of the community-driven boilerplates or command line tools might make it dramatically easier to compile, package, and release an app.

A boilerplate is only a starting point - a canvas, so to speak - from which you build your application. They usually come in the form of a repository you can clone and customize to your heart's content.

A command line tool on the other hand continues to support you throughout the development and release. They are more helpful and supportive but enforce guidelines on how your code should be structured and built. Especially for beginners, using a command line tool is likely to be helpful.

Electron Forge is a tool for packaging and publishing Electron applications. It unifies Electron's tooling ecosystem into a single extensible interface so that anyone can jump right into making Electron apps.

Forge comes with a ready-to-use template using Webpack as a bundler. It includes an example typescript configuration and provides two configuration files to enable easy customization. It uses the same core modules used by the greater Electron community (like @electron/packager) – changes made by Electron maintainers (like Slack) benefit Forge's users, too.

You can find more information and documentation on electronforge.io.

A "complete solution to package and build a ready-for-distribution Electron app" that focuses on an integrated experience. electron-builder adds one single dependency focused on simplicity and manages all further requirements internally.

electron-builder replaces features and modules used by the Electron maintainers (such as the auto-updater) with custom ones. They are generally tighter integrated but will have less in common with popular Electron apps like Atom, Visual Studio Code, or Slack.

You can find more information and documentation in the repository.

If you don't want any tools but only a solid boilerplate to build from, CT Lin's electron-react-boilerplate might be worth a look. It's quite popular in the community and uses electron-builder internally.

The "Awesome Electron" list contains more tools and boilerplates to choose from. If you find the length of the list intimidating, don't forget that adding tools as you go along is a valid approach, too.

---
