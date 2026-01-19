# Electron - Renderer Process

**Pages:** 11

---

## Opening windows from the renderer

**URL:** https://www.electronjs.org/docs/latest/api/window-open

**Contents:**
- Opening windows from the renderer
  - window.open(url[, frameName][, features])​
  - Native Window example​

There are several ways to control how windows are created from trusted or untrusted content within a renderer. Windows can be created from the renderer in two ways:

For same-origin content, the new window is created within the same process, enabling the parent to access the child window directly. This can be very useful for app sub-windows that act as preference panels, or similar, as the parent can render to the sub-window directly, as if it were a div in the parent. This is the same behavior as in the browser.

Electron pairs this native Chrome Window with a BrowserWindow under the hood. You can take advantage of all the customization available when creating a BrowserWindow in the main process by using webContents.setWindowOpenHandler() for renderer-created windows.

BrowserWindow constructor options are set by, in increasing precedence order: parsed options from the features string from window.open(), security-related webPreferences inherited from the parent, and options given by webContents.setWindowOpenHandler. Note that webContents.setWindowOpenHandler has final say and full privilege because it is invoked in the main process.

Returns Window | null

features is a comma-separated key-value list, following the standard format of the browser. Electron will parse BrowserWindowConstructorOptions out of this list where possible, for convenience. For full control and better ergonomics, consider using webContents.setWindowOpenHandler to customize the BrowserWindow creation.

A subset of WebPreferences can be set directly, unnested, from the features string: zoomFactor, nodeIntegration, javascript, contextIsolation, and webviewTag.

To customize or cancel the creation of the window, you can optionally set an override handler with webContents.setWindowOpenHandler() from the main process. Returning { action: 'deny' } cancels the window. Returning { action: 'allow', overrideBrowserWindowOptions: { ... } } will allow opening the window and setting the BrowserWindowConstructorOptions to be used when creating the window. Note that this is more powerful than passing options through the feature string, as the renderer has more limited privileges in deciding security preferences than the main process.

In addition to passing in action and overrideBrowserWindowOptions, outlivesOpener can be passed like: { action: 'allow', outlivesOpener: true, overrideBrowserWindowOptions: { ... } }. If set to true, the newly created window will not close when the opener window closes. The default value is false.

**Examples:**

Example 1 (unknown):
```unknown
window.open('https://github.com', '_blank', 'top=500,left=200,frame=false,nodeIntegration=no')
```

Example 2 (css):
```css
// main.jsconst mainWindow = new BrowserWindow()// In this example, only windows with the `about:blank` url will be created.// All other urls will be blocked.mainWindow.webContents.setWindowOpenHandler(({ url }) => {  if (url === 'about:blank') {    return {      action: 'allow',      overrideBrowserWindowOptions: {        frame: false,        fullscreenable: false,        backgroundColor: 'black',        webPreferences: {          preload: 'my-child-window-preload-script.js'        }      }    }  }  return { action: 'deny' }})
```

Example 3 (csharp):
```csharp
// renderer process (mainWindow)const childWindow = window.open('', 'modal')childWindow.document.write('<h1>Hello</h1>')
```

---

## screen

**URL:** https://www.electronjs.org/docs/latest/api/screen

**Contents:**
- screen
- Events​
  - Event: 'display-added'​
  - Event: 'display-removed'​
  - Event: 'display-metrics-changed'​
- Methods​
  - screen.getCursorScreenPoint()​
  - screen.getPrimaryDisplay()​
  - screen.getAllDisplays()​
  - screen.getDisplayNearestPoint(point)​

Retrieve information about screen size, displays, cursor position, etc.

This module cannot be used until the ready event of the app module is emitted.

screen is an EventEmitter.

In the renderer / DevTools, window.screen is a reserved DOM property, so writing let { screen } = require('electron') will not work.

An example of creating a window that fills the whole screen:

Another example of creating a window in the external display:

Screen coordinates used by this module are Point structures. There are two kinds of coordinates available to the process: Physical screen points are raw hardware pixels on a display. Device-independent pixel (DIP) points are virtualized screen points scaled based on the DPI (dots per inch) of the display.

The screen module emits the following events:

Emitted when newDisplay has been added.

Emitted when oldDisplay has been removed.

Emitted when one or more metrics change in a display. The changedMetrics is an array of strings that describe the changes. Possible changes are bounds, workArea, scaleFactor and rotation.

The screen module has the following methods:

The current absolute position of the mouse pointer.

The return value is a DIP point, not a screen physical point.

Returns Display - The primary display.

Returns Display[] - An array of displays that are currently available.

Returns Display - The display nearest the specified point.

Returns Display - The display that most closely intersects the provided bounds.

Converts a screen physical point to a screen DIP point. The DPI scale is performed relative to the display containing the physical point.

Not currently supported on Wayland - if used there it will return the point passed in with no changes.

Converts a screen DIP point to a screen physical point. The DPI scale is performed relative to the display containing the DIP point.

Not currently supported on Wayland.

Converts a screen physical rect to a screen DIP rect. The DPI scale is performed relative to the display nearest to window. If window is null, scaling will be performed to the display nearest to rect.

Converts a screen DIP rect to a screen physical rect. The DPI scale is performed relative to the display nearest to window. If window is null, scaling will be performed to the display nearest to rect.

**Examples:**

Example 1 (javascript):
```javascript
// Retrieve information about screen size, displays, cursor position, etc.//// For more info, see:// https://www.electronjs.org/docs/latest/api/screenconst { app, BrowserWindow, screen } = require('electron/main')let mainWindow = nullapp.whenReady().then(() => {  // Create a window that fills the screen's available work area.  const primaryDisplay = screen.getPrimaryDisplay()  const { width, height } = primaryDisplay.workAreaSize  mainWindow = new BrowserWindow({ width, height })  mainWindow.loadURL('https://electronjs.org')})
```

Example 2 (javascript):
```javascript
const { app, BrowserWindow, screen } = require('electron')let winapp.whenReady().then(() => {  const displays = screen.getAllDisplays()  const externalDisplay = displays.find((display) => {    return display.bounds.x !== 0 || display.bounds.y !== 0  })  if (externalDisplay) {    win = new BrowserWindow({      x: externalDisplay.bounds.x + 50,      y: externalDisplay.bounds.y + 50    })    win.loadURL('https://github.com')  }})
```

---

## clipboard

**URL:** https://www.electronjs.org/docs/latest/api/clipboard

**Contents:**
- clipboard
- Methods​
  - clipboard.readText([type])​
  - clipboard.writeText(text[, type])​
  - clipboard.readHTML([type])​
  - clipboard.writeHTML(markup[, type])​
  - clipboard.readImage([type])​
  - clipboard.writeImage(image[, type])​
  - clipboard.readRTF([type])​
  - clipboard.writeRTF(text[, type])​

Perform copy and paste operations on the system clipboard.

Process: Main, Renderer (non-sandboxed only)

If you want to call this API from a renderer process with context isolation enabled, place the API call in your preload script and expose it using the contextBridge API.

On Linux, there is also a selection clipboard. To manipulate it you need to pass selection to each method:

The clipboard module has the following methods:

Experimental APIs are marked as such and could be removed in future.

Returns string - The content in the clipboard as plain text.

Writes the text into the clipboard as plain text.

Returns string - The content in the clipboard as markup.

Writes markup to the clipboard.

Returns NativeImage - The image content in the clipboard.

Writes image to the clipboard.

Returns string - The content in the clipboard as RTF.

Writes the text into the clipboard in RTF.

Returns an Object containing title and url keys representing the bookmark in the clipboard. The title and url values will be empty strings when the bookmark is unavailable. The title value will always be empty on Windows.

Writes the title (macOS only) and url into the clipboard as a bookmark.

Most apps on Windows don't support pasting bookmarks into them so you can use clipboard.write to write both a bookmark and fallback text to the clipboard.

Returns string - The text on the find pasteboard, which is the pasteboard that holds information about the current state of the active application’s find panel.

This method uses synchronous IPC when called from the renderer process. The cached value is reread from the find pasteboard whenever the application is activated.

Writes the text into the find pasteboard (the pasteboard that holds information about the current state of the active application’s find panel) as plain text. This method uses synchronous IPC when called from the renderer process.

Clears the clipboard content.

Returns string[] - An array of supported formats for the clipboard type.

Returns boolean - Whether the clipboard supports the specified format.

Returns string - Reads format type from the clipboard.

format should contain valid ASCII characters and have / separator. a/c, a/bc are valid formats while /abc, abc/, a/, /a, a are not valid.

Returns Buffer - Reads format type from the clipboard.

Writes the buffer into the clipboard as format.

Writes data to the clipboard.

**Examples:**

Example 1 (javascript):
```javascript
const { clipboard } = require('electron')clipboard.writeText('Example string', 'selection')console.log(clipboard.readText('selection'))
```

Example 2 (javascript):
```javascript
const { clipboard } = require('electron')clipboard.writeText('hello i am a bit of text!')const text = clipboard.readText()console.log(text)// hello i am a bit of text!'
```

Example 3 (javascript):
```javascript
const { clipboard } = require('electron')const text = 'hello i am a bit of text!'clipboard.writeText(text)
```

Example 4 (javascript):
```javascript
const { clipboard } = require('electron')clipboard.writeHTML('<b>Hi</b>')const html = clipboard.readHTML()console.log(html)// <meta charset='utf-8'><b>Hi</b>
```

---

## Debugging with XCode

**URL:** https://www.electronjs.org/docs/latest/development/debugging-with-xcode

**Contents:**
- Debugging with XCode
- Debugging with XCode​
  - Generate xcode project for debugging sources (cannot build code from xcode)​
  - Debugging and breakpoints​

Run gn gen with the --ide=xcode argument.

This will generate the electron.ninja.xcworkspace. You will have to open this workspace to set breakpoints and inspect.

See gn help gen for more information on generating IDE projects with GN.

Launch Electron app after build. You can now open the xcode workspace created above and attach to the Electron process through the Debug > Attach To Process > Electron debug menu. [Note: If you want to debug the renderer process, you need to attach to the Electron Helper as well.]

You can now set breakpoints in any of the indexed files. However, you will not be able to set breakpoints directly in the Chromium source. To set break points in the Chromium source, you can choose Debug > Breakpoints > Create Symbolic Breakpoint and set any function name as the symbol. This will set the breakpoint for all functions with that name, from all the classes if there are more than one. You can also do this step of setting break points prior to attaching the debugger, however, actual breakpoints for symbolic breakpoint functions may not show up until the debugger is attached to the app.

**Examples:**

Example 1 (unknown):
```unknown
$ gn gen out/Testing --ide=xcode
```

---

## Notification

**URL:** https://www.electronjs.org/docs/latest/api/notification

**Contents:**
- Notification
- Class: Notification​
  - Static Methods​
    - Notification.isSupported()​
  - new Notification([options])​
  - Instance Events​
    - Event: 'show'​
    - Event: 'click'​
    - Event: 'close'​
    - Event: 'reply' macOS​

Create OS desktop notifications

If you want to show notifications from a renderer process you should use the web Notifications API

Create OS desktop notifications

Notification is an EventEmitter.

It creates a new Notification with native properties as set by the options.

Electron's built-in classes cannot be subclassed in user code. For more information, see the FAQ.

The Notification class has the following static methods:

Returns boolean - Whether or not desktop notifications are supported on the current system

Objects created with new Notification emit the following events:

Some events are only available on specific operating systems and are labeled as such.

Emitted when the notification is shown to the user. Note that this event can be fired multiple times as a notification can be shown multiple times through the show() method.

Emitted when the notification is clicked by the user.

Emitted when the notification is closed by manual intervention from the user.

This event is not guaranteed to be emitted in all cases where the notification is closed.

On Windows, the close event can be emitted in one of three ways: programmatic dismissal with notification.close(), by the user closing the notification, or via system timeout. If a notification is in the Action Center after the initial close event is emitted, a call to notification.close() will remove the notification from the action center but the close event will not be emitted again.

Emitted when the user clicks the "Reply" button on a notification with hasReply: true.

Emitted when an error is encountered while creating and showing the native notification.

Objects created with the new Notification() constructor have the following instance methods:

Immediately shows the notification to the user. Unlike the web notification API, instantiating a new Notification() does not immediately show it to the user. Instead, you need to call this method before the OS will display it.

If the notification has been shown before, this method will dismiss the previously shown notification and create a new one with identical properties.

Dismisses the notification.

On Windows, calling notification.close() while the notification is visible on screen will dismiss the notification and remove it from the Action Center. If notification.close() is called after the notification is no longer visible on screen, calling notification.close() will try remove it from the Action Center.

A string property representing the title of the notification.

A string property representing the subtitle of the notification.

A string property representing the body of the notification.

A string property representing the reply placeholder of the notification.

A string property representing the sound of the notification.

A string property representing the close button text of the notification.

A boolean property representing whether the notification is silent.

A boolean property representing whether the notification has a reply action.

A string property representing the urgency level of the notification. Can be 'normal', 'critical', or 'low'.

Default is 'low' - see NotifyUrgency for more information.

A string property representing the type of timeout duration for the notification. Can be 'default' or 'never'.

If timeoutType is set to 'never', the notification never expires. It stays open until closed by the calling API or the user.

A NotificationAction[] property representing the actions of the notification.

A string property representing the custom Toast XML of the notification.

On macOS, you can specify the name of the sound you'd like to play when the notification is shown. Any of the default sounds (under System Preferences > Sound) can be used, in addition to custom sound files. Be sure that the sound file is copied under the app bundle (e.g., YourApp.app/Contents/Resources), or one of the following locations:

See the NSSound docs for more information.

---

## <webview> Tag

**URL:** https://www.electronjs.org/docs/latest/api/webview-tag

**Contents:**
- <webview> Tag
- Warning​
- Enabling​
- Overview​
- Example​
- Internal implementation​
- CSS Styling Notes​
- Tag Attributes​
  - src​
  - nodeintegration​

Electron's webview tag is based on Chromium's webview, which is undergoing dramatic architectural changes. This impacts the stability of webviews, including rendering, navigation, and event routing. We currently recommend to not use the webview tag and to consider alternatives, like iframe, a WebContentsView, or an architecture that avoids embedded content altogether.

By default the webview tag is disabled in Electron >= 5. You need to enable the tag by setting the webviewTag webPreferences option when constructing your BrowserWindow. For more information see the BrowserWindow constructor docs.

Display external web content in an isolated frame and process.

Process: Renderer This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

Use the webview tag to embed 'guest' content (such as web pages) in your Electron app. The guest content is contained within the webview container. An embedded page within your app controls how the guest content is laid out and rendered.

Unlike an iframe, the webview runs in a separate process than your app. It doesn't have the same permissions as your web page and all interactions between your app and embedded content will be asynchronous. This keeps your app safe from the embedded content.

Most methods called on the webview from the host page require a synchronous call to the main process.

To embed a web page in your app, add the webview tag to your app's embedder page (this is the app page that will display the guest content). In its simplest form, the webview tag includes the src of the web page and css styles that control the appearance of the webview container:

If you want to control the guest content in any way, you can write JavaScript that listens for webview events and responds to those events using the webview methods. Here's sample code with two event listeners: one that listens for the web page to start loading, the other for the web page to stop loading, and displays a "loading..." message during the load time:

Under the hood webview is implemented with Out-of-Process iframes (OOPIFs). The webview tag is essentially a custom element using shadow DOM to wrap an iframe element inside it.

So the behavior of webview is very similar to a cross-domain iframe, as examples:

Please note that the webview tag's style uses display:flex; internally to ensure the child iframe element fills the full height and width of its webview container when used with traditional and flexbox layouts. Please do not overwrite the default display:flex; CSS property, unless specifying display:inline-flex; for inline layout.

The webview tag has the following attributes:

A string representing the visible URL. Writing to this attribute initiates top-level navigation.

Assigning src its own value will reload the current page.

The src attribute can also accept data URLs, such as data:text/plain,Hello, world!.

A boolean. When this attribute is present the guest page in webview will have node integration and can use node APIs like require and process to access low level system resources. Node integration is disabled by default in the guest page.

A boolean for the experimental option for enabling NodeJS support in sub-frames such as iframes inside the webview. All your preloads will load for every iframe, you can use process.isMainFrame to determine if you are in the main frame or not. This option is disabled by default in the guest page.

A boolean. When this attribute is present the guest page in webview will be able to use browser plugins. Plugins are disabled by default.

A string that specifies a script that will be loaded before other scripts run in the guest page. The protocol of script's URL must be file: (even when using asar: archives) because it will be loaded by Node's require under the hood, which treats asar: archives as virtual directories.

When the guest page doesn't have node integration this script will still have access to all Node APIs, but global objects injected by Node will be deleted after this script has finished executing.

A string that sets the referrer URL for the guest page.

A string that sets the user agent for the guest page before the page is navigated to. Once the page is loaded, use the setUserAgent method to change the user agent.

A boolean. When this attribute is present the guest page will have web security disabled. Web security is enabled by default.

This value can only be modified before the first navigation.

A string that sets the session used by the page. If partition starts with persist:, the page will use a persistent session available to all pages in the app with the same partition. if there is no persist: prefix, the page will use an in-memory session. By assigning the same partition, multiple pages can share the same session. If the partition is unset then default session of the app will be used.

This value can only be modified before the first navigation, since the session of an active renderer process cannot change. Subsequent attempts to modify the value will fail with a DOM exception.

A boolean. When this attribute is present the guest page will be allowed to open new windows. Popups are disabled by default.

A string which is a comma separated list of strings which specifies the web preferences to be set on the webview. The full list of supported preference strings can be found in BrowserWindow.

The string follows the same format as the features string in window.open. A name by itself is given a true boolean value. A preference can be set to another value by including an =, followed by the value. Special values yes and 1 are interpreted as true, while no and 0 are interpreted as false.

A string which is a list of strings which specifies the blink features to be enabled separated by ,. The full list of supported feature strings can be found in the RuntimeEnabledFeatures.json5 file.

A string which is a list of strings which specifies the blink features to be disabled separated by ,. The full list of supported feature strings can be found in the RuntimeEnabledFeatures.json5 file.

The webview tag has the following methods:

The webview element must be loaded before using the methods.

Returns Promise<void> - The promise will resolve when the page has finished loading (see did-finish-load), and rejects if the page fails to load (see did-fail-load).

Loads the url in the webview, the url must contain the protocol prefix, e.g. the http:// or file://.

Initiates a download of the resource at url without navigating.

Returns string - The URL of guest page.

Returns string - The title of guest page.

Returns boolean - Whether guest page is still loading resources.

Returns boolean - Whether the main frame (and not just iframes or frames within it) is still loading.

Returns boolean - Whether the guest page is waiting for a first-response for the main resource of the page.

Stops any pending navigation.

Reloads the guest page.

Reloads the guest page and ignores cache.

Returns boolean - Whether the guest page can go back.

Returns boolean - Whether the guest page can go forward.

Returns boolean - Whether the guest page can go to offset.

Clears the navigation history.

Makes the guest page go back.

Makes the guest page go forward.

Navigates to the specified absolute index.

Navigates to the specified offset from the "current entry".

Returns boolean - Whether the renderer process has crashed.

Overrides the user agent for the guest page.

Returns string - The user agent for guest page.

Returns Promise<string> - A promise that resolves with a key for the inserted CSS that can later be used to remove the CSS via <webview>.removeInsertedCSS(key).

Injects CSS into the current web page and returns a unique key for the inserted stylesheet.

Returns Promise<void> - Resolves if the removal was successful.

Removes the inserted CSS from the current web page. The stylesheet is identified by its key, which is returned from <webview>.insertCSS(css).

Returns Promise<any> - A promise that resolves with the result of the executed code or is rejected if the result of the code is a rejected promise.

Evaluates code in page. If userGesture is set, it will create the user gesture context in the page. HTML APIs like requestFullScreen, which require user action, can take advantage of this option for automation.

Opens a DevTools window for guest page.

Closes the DevTools window of guest page.

Returns boolean - Whether guest page has a DevTools window attached.

Returns boolean - Whether DevTools window of guest page is focused.

Starts inspecting element at position (x, y) of guest page.

Opens the DevTools for the shared worker context present in the guest page.

Opens the DevTools for the service worker context present in the guest page.

Set guest page muted.

Returns boolean - Whether guest page has been muted.

Returns boolean - Whether audio is currently playing.

Executes editing command undo in page.

Executes editing command redo in page.

Executes editing command cut in page.

Executes editing command copy in page.

Centers the current text selection in page.

Executes editing command paste in page.

Executes editing command pasteAndMatchStyle in page.

Executes editing command delete in page.

Executes editing command selectAll in page.

Executes editing command unselect in page.

Scrolls to the top of the current <webview>.

Scrolls to the bottom of the current <webview>.

Adjusts the current text selection starting and ending points in the focused frame by the given amounts. A negative amount moves the selection towards the beginning of the document, and a positive amount moves the selection towards the end of the document.

See webContents.adjustSelection for examples.

Executes editing command replace in page.

Executes editing command replaceMisspelling in page.

Returns Promise<void>

Inserts text to the focused element.

Returns Integer - The request id used for the request.

Starts a request to find all matches for the text in the web page. The result of the request can be obtained by subscribing to found-in-page event.

Stops any findInPage request for the webview with the provided action.

Returns Promise<void>

Prints webview's web page. Same as webContents.print([options]).

Returns Promise<Uint8Array> - Resolves with the generated PDF data.

Prints webview's web page as PDF, Same as webContents.printToPDF(options).

Returns Promise<NativeImage> - Resolves with a NativeImage

Captures a snapshot of the page within rect. Omitting rect will capture the whole visible page.

Returns Promise<void>

Send an asynchronous message to renderer process via channel, you can also send arbitrary arguments. The renderer process can handle the message by listening to the channel event with the ipcRenderer module.

See webContents.send for examples.

Returns Promise<void>

Send an asynchronous message to renderer process via channel, you can also send arbitrary arguments. The renderer process can handle the message by listening to the channel event with the ipcRenderer module.

See webContents.sendToFrame for examples.

Returns Promise<void>

Sends an input event to the page.

See webContents.sendInputEvent for detailed description of event object.

Changes the zoom factor to the specified factor. Zoom factor is zoom percent divided by 100, so 300% = 3.0.

Changes the zoom level to the specified level. The original size is 0 and each increment above or below represents zooming 20% larger or smaller to default limits of 300% and 50% of original size, respectively. The formula for this is scale := 1.2 ^ level.

The zoom policy at the Chromium level is same-origin, meaning that the zoom level for a specific domain propagates across all instances of windows with the same domain. Differentiating the window URLs will make zoom work per-window.

Returns number - the current zoom factor.

Returns number - the current zoom level.

Returns Promise<void>

Sets the maximum and minimum pinch-to-zoom level.

Shows pop-up dictionary that searches the selected word on the page.

Returns number - The WebContents ID of this webview.

The following DOM events are available to the webview tag:

Fired when a load has committed. This includes navigation within the current document as well as subframe document-level loads, but does not include asynchronous resource loads.

Fired when the navigation is done, i.e. the spinner of the tab will stop spinning, and the onload event is dispatched.

This event is like did-finish-load, but fired when the load failed or was cancelled, e.g. window.stop() is invoked.

Fired when a frame has done navigation.

Corresponds to the points in time when the spinner of the tab starts spinning.

Corresponds to the points in time when the spinner of the tab stops spinning.

Fired when attached to the embedder web contents.

Fired when document in the given frame is loaded.

Fired when page title is set during navigation. explicitSet is false when title is synthesized from file url.

Fired when page receives favicon urls.

Fired when page enters fullscreen triggered by HTML API.

Fired when page leaves fullscreen triggered by HTML API.

Fired when the guest window logs a console message.

The following example code forwards all log messages to the embedder's console without regard for log level or other properties.

Fired when a result is available for webview.findInPage request.

Emitted when a user or the page wants to start navigation. It can happen when the window.location object is changed or a user clicks a link in the page.

This event will not emit when the navigation is started programmatically with APIs like <webview>.loadURL and <webview>.back.

It is also not emitted during in-page navigation, such as clicking anchor links or updating the window.location.hash. Use did-navigate-in-page event for this purpose.

Calling event.preventDefault() does NOT have any effect.

Emitted when a user or the page wants to start navigation anywhere in the <webview> or any frames embedded within. It can happen when the window.location object is changed or a user clicks a link in the page.

This event will not emit when the navigation is started programmatically with APIs like <webview>.loadURL and <webview>.back.

It is also not emitted during in-page navigation, such as clicking anchor links or updating the window.location.hash. Use did-navigate-in-page event for this purpose.

Calling event.preventDefault() does NOT have any effect.

Emitted when any frame (including main) starts navigating. isInPlace will be true for in-page navigations.

Emitted after a server side redirect occurs during navigation. For example a 302 redirect.

Emitted when a navigation is done.

This event is not emitted for in-page navigations, such as clicking anchor links or updating the window.location.hash. Use did-navigate-in-page event for this purpose.

Emitted when any frame navigation is done.

This event is not emitted for in-page navigations, such as clicking anchor links or updating the window.location.hash. Use did-navigate-in-page event for this purpose.

Emitted when an in-page navigation happened.

When in-page navigation happens, the page URL changes but does not cause navigation outside of the page. Examples of this occurring are when anchor links are clicked or when the DOM hashchange event is triggered.

Fired when the guest page attempts to close itself.

The following example code navigates the webview to about:blank when the guest attempts to close itself.

Fired when the guest page has sent an asynchronous message to embedder page.

With sendToHost method and ipc-message event you can communicate between guest page and embedder page:

Fired when the renderer process unexpectedly disappears. This is normally because it was crashed or killed.

Fired when the WebContents is destroyed.

Emitted when media starts playing.

Emitted when media is paused or done playing.

Emitted when a page's theme color changes. This is usually due to encountering a meta tag:

Emitted when mouse moves over a link or the keyboard moves the focus to a link.

Emitted when a link is clicked in DevTools or 'Open in new tab' is selected for a link in its context menu.

Emitted when 'Search' is selected for text in its context menu.

Emitted when DevTools is opened.

Emitted when DevTools is closed.

Emitted when DevTools is focused / opened.

Emitted when there is a new context menu that needs to be handled.

**Examples:**

Example 1 (html):
```html
<webview id="foo" src="https://www.github.com/" style="display:inline-flex; width:640px; height:480px"></webview>
```

Example 2 (html):
```html
<script>  onload = () => {    const webview = document.querySelector('webview')    const indicator = document.querySelector('.indicator')    const loadstart = () => {      indicator.innerText = 'loading...'    }    const loadstop = () => {      indicator.innerText = ''    }    webview.addEventListener('did-start-loading', loadstart)    webview.addEventListener('did-stop-loading', loadstop)  }</script>
```

Example 3 (html):
```html
<webview src="https://www.github.com/"></webview>
```

Example 4 (html):
```html
<webview src="https://www.google.com/" nodeintegration></webview>
```

---

## crashReporter

**URL:** https://www.electronjs.org/docs/latest/api/crash-reporter

**Contents:**
- crashReporter
- Methods​
  - crashReporter.start(options)​
  - crashReporter.getLastCrashReport()​
  - crashReporter.getUploadedReports()​
  - crashReporter.getUploadToServer()​
  - crashReporter.setUploadToServer(uploadToServer)​
  - crashReporter.addExtraParameter(key, value)​
  - crashReporter.removeExtraParameter(key)​
  - crashReporter.getParameters()​

Submit crash reports to a remote server.

Process: Main, Renderer

If you want to call this API from a renderer process with context isolation enabled, place the API call in your preload script and expose it using the contextBridge API.

The following is an example of setting up Electron to automatically submit crash reports to a remote server:

For setting up a server to accept and process crash reports, you can use following projects:

Electron uses Crashpad, not Breakpad, to collect and upload crashes, but for the time being, the upload protocol is the same.

Or use a 3rd party hosted solution:

Crash reports are stored temporarily before being uploaded in a directory underneath the app's user data directory, called 'Crashpad'. You can override this directory by calling app.setPath('crashDumps', '/path/to/crashes') before starting the crash reporter.

Electron uses crashpad to monitor and report crashes.

The crashReporter module has the following methods:

This method must be called before using any other crashReporter APIs. Once initialized this way, the crashpad handler collects crashes from all subsequently created processes. The crash reporter cannot be disabled once started.

This method should be called as early as possible in app startup, preferably before app.on('ready'). If the crash reporter is not initialized at the time a renderer process is created, then that renderer process will not be monitored by the crash reporter.

You can test out the crash reporter by generating a crash using process.crash().

If you need to send additional/updated extra parameters after your first call start you can call addExtraParameter.

Parameters passed in extra, globalExtra or set with addExtraParameter have limits on the length of the keys and values. Key names must be at most 39 bytes long, and values must be no longer than 127 bytes. Keys with names longer than the maximum will be silently ignored. Key values longer than the maximum length will be truncated.

This method is only available in the main process.

Returns CrashReport | null - The date and ID of the last crash report. Only crash reports that have been uploaded will be returned; even if a crash report is present on disk it will not be returned until it is uploaded. In the case that there are no uploaded reports, null is returned.

This method is only available in the main process.

Returns CrashReport[]:

Returns all uploaded crash reports. Each report contains the date and uploaded ID.

This method is only available in the main process.

Returns boolean - Whether reports should be submitted to the server. Set through the start method or setUploadToServer.

This method is only available in the main process.

This would normally be controlled by user preferences. This has no effect if called before start is called.

This method is only available in the main process.

Set an extra parameter to be sent with the crash report. The values specified here will be sent in addition to any values set via the extra option when start was called.

Parameters added in this fashion (or via the extra parameter to crashReporter.start) are specific to the calling process. Adding extra parameters in the main process will not cause those parameters to be sent along with crashes from renderer or other child processes. Similarly, adding extra parameters in a renderer process will not result in those parameters being sent with crashes that occur in other renderer processes or in the main process.

Parameters have limits on the length of the keys and values. Key names must be no longer than 39 bytes, and values must be no longer than 20320 bytes. Keys with names longer than the maximum will be silently ignored. Key values longer than the maximum length will be truncated.

Remove an extra parameter from the current set of parameters. Future crashes will not include this parameter.

Returns Record<string, string> - The current 'extra' parameters of the crash reporter.

Since require('electron') is not available in Node child processes, the following APIs are available on the process object in Node child processes.

See crashReporter.start().

Note that if the crash reporter is started in the main process, it will automatically monitor child processes, so it should not be started in the child process. Only use this method if the main process does not initialize the crash reporter.

See crashReporter.getParameters().

See crashReporter.addExtraParameter(key, value).

See crashReporter.removeExtraParameter(key).

The crash reporter will send the following data to the submitURL as a multipart/form-data POST:

**Examples:**

Example 1 (css):
```css
const { crashReporter } = require('electron')crashReporter.start({ submitURL: 'https://your-domain.com/url-to-submit' })
```

---

## webUtils

**URL:** https://www.electronjs.org/docs/latest/api/web-utils

**Contents:**
- webUtils
- Methods​
  - webUtils.getPathForFile(file)​

A utility layer to interact with Web API objects (Files, Blobs, etc.)

If you want to call this API from a renderer process with context isolation enabled, place the API call in your preload script and expose it using the contextBridge API.

The webUtils module has the following methods:

Returns string - The file system path that this File object points to. In the case where the object passed in is not a File object an exception is thrown. In the case where the File object passed in was constructed in JS and is not backed by a file on disk an empty string is returned.

This method superseded the previous augmentation to the File object with the path property. An example is included below.

**Examples:**

Example 1 (csharp):
```csharp
// Before (renderer)const oldPath = document.querySelector('input[type=file]').files[0].path
```

Example 2 (javascript):
```javascript
// After// Renderer:const file = document.querySelector('input[type=file]').files[0]electronApi.doSomethingWithFile(file)// Preload script:const { contextBridge, webUtils } = require('electron')contextBridge.exposeInMainWorld('electronApi', {  doSomethingWithFile (file) {    const path = webUtils.getPathForFile(file)    // Do something with the path, e.g., send it over IPC to the main process.    // It's best not to expose the full file path to the web content if possible.  }})
```

---

## webFrame

**URL:** https://www.electronjs.org/docs/latest/api/web-frame

**Contents:**
- webFrame
- Methods​
  - webFrame.setZoomFactor(factor)​
  - webFrame.getZoomFactor()​
  - webFrame.setZoomLevel(level)​
  - webFrame.getZoomLevel()​
  - webFrame.setVisualZoomLevelLimits(minimumLevel, maximumLevel)​
  - webFrame.setSpellCheckProvider(language, provider)​
  - webFrame.insertCSS(css[, options])​
  - webFrame.removeInsertedCSS(key)​

Customize the rendering of the current web page.

If you want to call this API from a renderer process with context isolation enabled, place the API call in your preload script and expose it using the contextBridge API.

webFrame export of the Electron module is an instance of the WebFrame class representing the current frame. Sub-frames can be retrieved by certain properties and methods (e.g. webFrame.firstChild).

An example of zooming current page to 200%.

The WebFrame class has the following instance methods:

Changes the zoom factor to the specified factor. Zoom factor is zoom percent divided by 100, so 300% = 3.0.

The factor must be greater than 0.0.

Returns number - The current zoom factor.

Changes the zoom level to the specified level. The original size is 0 and each increment above or below represents zooming 20% larger or smaller to default limits of 300% and 50% of original size, respectively.

The zoom policy at the Chromium level is same-origin, meaning that the zoom level for a specific domain propagates across all instances of windows with the same domain. Differentiating the window URLs will make zoom work per-window.

Returns number - The current zoom level.

Sets the maximum and minimum pinch-to-zoom level.

Visual zoom is disabled by default in Electron. To re-enable it, call:webFrame.setVisualZoomLevelLimits(1, 3)

Visual zoom only applies to pinch-to-zoom behavior. Cmd+/-/0 zoom shortcuts are controlled by the 'zoomIn', 'zoomOut', and 'resetZoom' MenuItem roles in the application Menu. To disable shortcuts, manually define the Menu and omit zoom roles from the definition.

Sets a provider for spell checking in input fields and text areas.

If you want to use this method you must disable the builtin spellchecker when you construct the window.

The provider must be an object that has a spellCheck method that accepts an array of individual words for spellchecking. The spellCheck function runs asynchronously and calls the callback function with an array of misspelt words when complete.

An example of using node-spellchecker as provider:

Returns string - A key for the inserted CSS that can later be used to remove the CSS via webFrame.removeInsertedCSS(key).

Injects CSS into the current web page and returns a unique key for the inserted stylesheet.

Removes the inserted CSS from the current web page. The stylesheet is identified by its key, which is returned from webFrame.insertCSS(css).

Inserts text to the focused element.

Returns Promise<any> - A promise that resolves with the result of the executed code or is rejected if execution throws or results in a rejected promise.

Evaluates code in page.

In the browser window some HTML APIs like requestFullScreen can only be invoked by a gesture from the user. Setting userGesture to true will remove this limitation.

Returns Promise<any> - A promise that resolves with the result of the executed code or is rejected if execution could not start.

Works like executeJavaScript but evaluates scripts in an isolated context.

Note that when the execution of script fails, the returned promise will not reject and the result would be undefined. This is because Chromium does not dispatch errors of isolated worlds to foreign worlds.

Set the security origin, content security policy and name of the isolated world.

If the csp is specified, then the securityOrigin also has to be specified.

Returns an object describing usage information of Blink's internal memory caches.

Attempts to free memory that is no longer being used (like images from a previous navigation).

Note that blindly calling this method probably makes Electron slower since it will have to refill these emptied caches, you should only call it if an event in your app has occurred that makes you think your page is actually using less memory (i.e. you have navigated from a super heavy page to a mostly empty one, and intend to stay there).

Returns WebFrame | null - The frame element in webFrame's document selected by selector, null would be returned if selector does not select a frame or if the frame is not in the current renderer process.

Returns WebFrame | null - A child of webFrame with the supplied name, null would be returned if there's no such frame or if the frame is not in the current renderer process.

Returns WebFrame | null - that has the supplied routingId, null if not found.

Deprecated: Use the new webFrame.findFrameByToken API.

Returns WebFrame | null - that has the supplied frameToken, null if not found.

Returns boolean - True if the word is misspelled according to the built in spellchecker, false otherwise. If no dictionary is loaded, always return false.

Returns string[] - A list of suggested words for a given word. If the word is spelled correctly, the result will be empty.

A WebFrame | null representing top frame in frame hierarchy to which webFrame belongs, the property would be null if top frame is not in the current renderer process.

A WebFrame | null representing the frame which opened webFrame, the property would be null if there's no opener or opener is not in the current renderer process.

A WebFrame | null representing parent frame of webFrame, the property would be null if webFrame is top or parent is not in the current renderer process.

A WebFrame | null representing the first child frame of webFrame, the property would be null if webFrame has no children or if first child is not in the current renderer process.

A WebFrame | null representing next sibling frame, the property would be null if webFrame is the last frame in its parent or if the next sibling is not in the current renderer process.

An Integer representing the unique frame id in the current renderer process. Distinct WebFrame instances that refer to the same underlying frame will have the same routingId.

Deprecated: Use the new webFrame.frameToken API.

A string representing the unique frame token in the current renderer process. Distinct WebFrame instances that refer to the same underlying frame will have the same frameToken.

**Examples:**

Example 1 (javascript):
```javascript
const { webFrame } = require('electron')webFrame.setZoomFactor(2)
```

Example 2 (unknown):
```unknown
webFrame.setVisualZoomLevelLimits(1, 3)
```

Example 3 (css):
```css
const mainWindow = new BrowserWindow({  webPreferences: {    spellcheck: false  }})
```

Example 4 (javascript):
```javascript
const { webFrame } = require('electron')const spellChecker = require('spellchecker')webFrame.setSpellCheckProvider('en-US', {  spellCheck (words, callback) {    setTimeout(() => {      const misspelled = words.filter(x => spellchecker.isMisspelled(x))      callback(misspelled)    }, 0)  }})
```

---

## ipcRenderer

**URL:** https://www.electronjs.org/docs/latest/api/ipc-renderer

**Contents:**
- ipcRenderer
- Methods​
  - ipcRenderer.on(channel, listener)​
  - ipcRenderer.off(channel, listener)​
  - ipcRenderer.once(channel, listener)​
  - ipcRenderer.addListener(channel, listener)​
  - ipcRenderer.removeListener(channel, listener)​
  - ipcRenderer.removeAllListeners([channel])​
  - ipcRenderer.send(channel, ...args)​
  - ipcRenderer.invoke(channel, ...args)​

ipcRenderer can no longer be sent over the contextBridge

Communicate asynchronously from a renderer process to the main process.

If you want to call this API from a renderer process with context isolation enabled, place the API call in your preload script and expose it using the contextBridge API.

The ipcRenderer module is an EventEmitter. It provides a few methods so you can send synchronous and asynchronous messages from the render process (web page) to the main process. You can also receive replies from the main process.

See IPC tutorial for code examples.

The ipcRenderer module has the following method to listen for events and send messages:

Listens to channel, when a new message arrives listener would be called with listener(event, args...).

Do not expose the event argument to the renderer for security reasons! Wrap any callback that you receive from the renderer in another function like this: ipcRenderer.on('my-channel', (event, ...args) => callback(...args)). Not wrapping the callback in such a function would expose dangerous Electron APIs to the renderer process. See the security guide for more info.

Removes the specified listener from the listener array for the specified channel.

Adds a one time listener function for the event. This listener is invoked only the next time a message is sent to channel, after which it is removed.

Alias for ipcRenderer.on.

Alias for ipcRenderer.off.

Removes all listeners from the specified channel. Removes all listeners from all channels if no channel is specified.

Send an asynchronous message to the main process via channel, along with arguments. Arguments will be serialized with the Structured Clone Algorithm, just like window.postMessage, so prototype chains will not be included. Sending Functions, Promises, Symbols, WeakMaps, or WeakSets will throw an exception.

NOTE: Sending non-standard JavaScript types such as DOM objects or special Electron objects will throw an exception.

Since the main process does not have support for DOM objects such as ImageBitmap, File, DOMMatrix and so on, such objects cannot be sent over Electron's IPC to the main process, as the main process would have no way to decode them. Attempting to send such objects over IPC will result in an error.

The main process handles it by listening for channel with the ipcMain module.

If you need to transfer a MessagePort to the main process, use ipcRenderer.postMessage.

If you want to receive a single response from the main process, like the result of a method call, consider using ipcRenderer.invoke.

Returns Promise<any> - Resolves with the response from the main process.

Send a message to the main process via channel and expect a result asynchronously. Arguments will be serialized with the Structured Clone Algorithm, just like window.postMessage, so prototype chains will not be included. Sending Functions, Promises, Symbols, WeakMaps, or WeakSets will throw an exception.

The main process should listen for channel with ipcMain.handle().

If you need to transfer a MessagePort to the main process, use ipcRenderer.postMessage.

If you do not need a response to the message, consider using ipcRenderer.send.

Sending non-standard JavaScript types such as DOM objects or special Electron objects will throw an exception.Since the main process does not have support for DOM objects such as ImageBitmap, File, DOMMatrix and so on, such objects cannot be sent over Electron's IPC to the main process, as the main process would have no way to decode them. Attempting to send such objects over IPC will result in an error.

Since the main process does not have support for DOM objects such as ImageBitmap, File, DOMMatrix and so on, such objects cannot be sent over Electron's IPC to the main process, as the main process would have no way to decode them. Attempting to send such objects over IPC will result in an error.

If the handler in the main process throws an error, the promise returned by invoke will reject. However, the Error object in the renderer process will not be the same as the one thrown in the main process.

Returns any - The value sent back by the ipcMain handler.

Send a message to the main process via channel and expect a result synchronously. Arguments will be serialized with the Structured Clone Algorithm, just like window.postMessage, so prototype chains will not be included. Sending Functions, Promises, Symbols, WeakMaps, or WeakSets will throw an exception.

NOTE: Sending non-standard JavaScript types such as DOM objects or special Electron objects will throw an exception.

Since the main process does not have support for DOM objects such as ImageBitmap, File, DOMMatrix and so on, such objects cannot be sent over Electron's IPC to the main process, as the main process would have no way to decode them. Attempting to send such objects over IPC will result in an error.

The main process handles it by listening for channel with ipcMain module, and replies by setting event.returnValue.

Sending a synchronous message will block the whole renderer process until the reply is received, so use this method only as a last resort. It's much better to use the asynchronous version, invoke().

Send a message to the main process, optionally transferring ownership of zero or more MessagePort objects.

The transferred MessagePort objects will be available in the main process as MessagePortMain objects by accessing the ports property of the emitted event.

For more information on using MessagePort and MessageChannel, see the MDN documentation.

Like ipcRenderer.send but the event will be sent to the <webview> element in the host page instead of the main process.

**Examples:**

Example 1 (javascript):
```javascript
// Renderer processipcRenderer.invoke('some-name', someArgument).then((result) => {  // ...})// Main processipcMain.handle('some-name', async (event, someArgument) => {  const result = await doSomeWork(someArgument)  return result})
```

Example 2 (csharp):
```csharp
// Renderer processconst { port1, port2 } = new MessageChannel()ipcRenderer.postMessage('port', { message: 'hello' }, [port1])// Main processipcMain.on('port', (e, msg) => {  const [port] = e.ports  // ...})
```

---

## contextBridge

**URL:** https://www.electronjs.org/docs/latest/api/context-bridge

**Contents:**
- contextBridge
- Glossary​
  - Main World​
  - Isolated World​
- Methods​
  - contextBridge.exposeInMainWorld(apiKey, api)​
  - contextBridge.exposeInIsolatedWorld(worldId, apiKey, api)​
  - contextBridge.executeInMainWorld(executionScript) Experimental​
- Usage​
  - API​

ipcRenderer can no longer be sent over the contextBridge

Create a safe, bi-directional, synchronous bridge across isolated contexts

An example of exposing an API to a renderer from an isolated preload script is given below:

The "Main World" is the JavaScript context that your main renderer code runs in. By default, the page you load in your renderer executes code in this world.

When contextIsolation is enabled in your webPreferences (this is the default behavior since Electron 12.0.0), your preload scripts run in an "Isolated World". You can read more about context isolation and what it affects in the security docs.

The contextBridge module has the following methods:

Returns any - A copy of the resulting value from executing the function in the main world. Refer to the table on how values are copied between worlds.

The api provided to exposeInMainWorld must be a Function, string, number, Array, boolean, or an object whose keys are strings and values are a Function, string, number, Array, boolean, or another nested object that meets the same conditions.

Function values are proxied to the other context and all other values are copied and frozen. Any data / primitives sent in the API become immutable and updates on either side of the bridge do not result in an update on the other side.

An example of a complex API is shown below:

An example of exposeInIsolatedWorld is shown below:

Function values that you bind through the contextBridge are proxied through Electron to ensure that contexts remain isolated. This results in some key limitations that we've outlined below.

Because parameters, errors and return values are copied when they are sent over the bridge, there are only certain types that can be used. At a high level, if the type you want to use can be serialized and deserialized into the same object it will work. A table of type support has been included below for completeness:

If the type you care about is not in the above table, it is probably not supported.

Attempting to send the entire ipcRenderer module as an object over the contextBridge will result in an empty object on the receiving side of the bridge. Sending over ipcRenderer in full can let any code send any message, which is a security footgun. To interact through ipcRenderer, provide a safe wrapper like below:

The contextBridge can be used by the preload script to give your renderer access to Node APIs. The table of supported types described above also applies to Node APIs that you expose through contextBridge. Please note that many Node APIs grant access to local system resources. Be very cautious about which globals and APIs you expose to untrusted remote content.

**Examples:**

Example 1 (javascript):
```javascript
// Preload (Isolated World)const { contextBridge, ipcRenderer } = require('electron')contextBridge.exposeInMainWorld(  'electron',  {    doThing: () => ipcRenderer.send('do-a-thing')  })
```

Example 2 (csharp):
```csharp
// Renderer (Main World)window.electron.doThing()
```

Example 3 (javascript):
```javascript
const { contextBridge, ipcRenderer } = require('electron')contextBridge.exposeInMainWorld(  'electron',  {    doThing: () => ipcRenderer.send('do-a-thing'),    myPromises: [Promise.resolve(), Promise.reject(new Error('whoops'))],    anAsyncFunction: async () => 123,    data: {      myFlags: ['a', 'b', 'c'],      bootTime: 1234    },    nestedAPI: {      evenDeeper: {        youCanDoThisAsMuchAsYouWant: {          fn: () => ({            returnData: 123          })        }      }    }  })
```

Example 4 (javascript):
```javascript
const { contextBridge, ipcRenderer } = require('electron')contextBridge.exposeInIsolatedWorld(  1004,  'electron',  {    doThing: () => ipcRenderer.send('do-a-thing')  })
```

---
