# Electron - Api

**Pages:** 52

---

## ThumbarButton Object

**URL:** https://www.electronjs.org/docs/latest/api/structures/thumbar-button

**Contents:**
- ThumbarButton Object

The flags is an array that can include following strings:

---

## PrinterInfo Object

**URL:** https://www.electronjs.org/docs/latest/api/structures/printer-info

**Contents:**
- PrinterInfo Object
- Example​

The number represented by status means different things on different platforms: on Windows its potential values can be found here, and on Linux and macOS they can be found here.

Below is an example of some of the additional options that may be set which may be different on each platform.

**Examples:**

Example 1 (json):
```json
{  name: 'Austin_4th_Floor_Printer___C02XK13BJHD4',  displayName: 'Austin 4th Floor Printer @ C02XK13BJHD4',  description: 'TOSHIBA ColorMFP',  options: {    copies: '1',    'device-uri': 'dnssd://Austin%204th%20Floor%20Printer%20%40%20C02XK13BJHD4._ipps._tcp.local./?uuid=71687f1e-1147-3274-6674-22de61b110bd',    finishings: '3',    'job-cancel-after': '10800',    'job-hold-until': 'no-hold',    'job-priority': '50',    'job-sheets': 'none,none',    'marker-change-time': '0',    'number-up': '1',    'printer-commands': 'ReportLevels,PrintSelfTestPage,com.toshiba.ColourProfiles.update,com.toshiba.EFiling.update,com.toshiba.EFiling.checkPassword',    'printer-info': 'Austin 4th Floor Printer @ C02XK13BJHD4',    'printer-is-accepting-jobs': 'true',    'printer-is-shared': 'false',    'printer-is-temporary': 'false',    'printer-location': '',    'printer-make-and-model': 'TOSHIBA ColorMFP',    'printer-state': '3',    'printer-state-change-time': '1573472937',    'printer-state-reasons': 'offline-report,com.toshiba.snmp.failed',    'printer-type': '10531038',    'printer-uri-supported': 'ipp://localhost/printers/Austin_4th_Floor_Printer___C02XK13BJHD4',    system_driverinfo: 'T'  }}
```

---

## TouchBar

**URL:** https://www.electronjs.org/docs/latest/api/touch-bar

**Contents:**
- TouchBar
- Class: TouchBar​
  - new TouchBar(options)​
  - Static Properties​
    - TouchBarButton​
    - TouchBarColorPicker​
    - TouchBarGroup​
    - TouchBarLabel​
    - TouchBarPopover​
    - TouchBarScrubber​

Electron's built-in classes cannot be subclassed in user code. For more information, see the FAQ.

Create TouchBar layouts for native macOS applications

Creates a new touch bar with the specified items. Use BrowserWindow.setTouchBar to add the TouchBar to a window.

The TouchBar API is currently experimental and may change or be removed in future Electron releases.

If you don't have a MacBook with Touch Bar, you can use Touch Bar Simulator to test Touch Bar usage in your app.

A typeof TouchBarButton reference to the TouchBarButton class.

A typeof TouchBarColorPicker reference to the TouchBarColorPicker class.

A typeof TouchBarGroup reference to the TouchBarGroup class.

A typeof TouchBarLabel reference to the TouchBarLabel class.

A typeof TouchBarPopover reference to the TouchBarPopover class.

A typeof TouchBarScrubber reference to the TouchBarScrubber class.

A typeof TouchBarSegmentedControl reference to the TouchBarSegmentedControl class.

A typeof TouchBarSlider reference to the TouchBarSlider class.

A typeof TouchBarSpacer reference to the TouchBarSpacer class.

A typeof TouchBarOtherItemsProxy reference to the TouchBarOtherItemsProxy class.

The following properties are available on instances of TouchBar:

A TouchBarItem that will replace the "esc" button on the touch bar when set. Setting to null restores the default "esc" button. Changing this value immediately updates the escape item in the touch bar.

Below is an example of a simple slot machine touch bar game with a button and some labels.

To run the example above, you'll need to (assuming you've got a terminal open in the directory you want to run the example):

You should then see a new Electron window and the app running in your touch bar (or touch bar emulator).

**Examples:**

Example 1 (javascript):
```javascript
const { app, BrowserWindow, TouchBar } = require('electron')const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBarlet spinning = false// Reel labelsconst reel1 = new TouchBarLabel({ label: '' })const reel2 = new TouchBarLabel({ label: '' })const reel3 = new TouchBarLabel({ label: '' })// Spin result labelconst result = new TouchBarLabel({ label: '' })// Spin buttonconst spin = new TouchBarButton({  label: '🎰 Spin',  backgroundColor: '#7851A9',  click: () => {    // Ignore clicks if already spinning    if (spinning) {      return    }    spinning = true    result.label = ''    let timeout = 10    const spinLength = 4 * 1000 // 4 seconds    const startTime = Date.now()    const spinReels = () => {      updateReels()      if ((Date.now() - startTime) >= spinLength) {        finishSpin()      } else {        // Slow down a bit on each spin        timeout *= 1.1        setTimeout(spinReels, timeout)      }    }    spinReels()  }})const getRandomValue = () => {  const values = ['🍒', '💎', '7️⃣', '🍊', '🔔', '⭐', '🍇', '🍀']  return values[Math.floor(Math.random() * values.length)]}const updateReels = () => {  reel1.label = getRandomValue()  reel2.label = getRandomValue()  reel3.label = getRandomValue()}const finishSpin = () => {  const uniqueValues = new Set([reel1.label, reel2.label, reel3.label]).size  if (uniqueValues === 1) {    // All 3 values are the same    result.label = '💰 Jackpot!'    result.textColor = '#FDFF00'  } else if (uniqueValues === 2) {    // 2 values are the same    result.label = '😍 Winner!'    result.textColor = '#FDFF00'  } else {    // No values are the same    result.label = '🙁 Spin Again'    result.textColor = null  }  spinning = false}const touchBar = new TouchBar({  items: [    spin,    new TouchBarSpacer({ size: 'large' }),    reel1,    new TouchBarSpacer({ size: 'small' }),    reel2,    new TouchBarSpacer({ size: 'small' }),    reel3,    new TouchBarSpacer({ size: 'large' }),    result  ]})let windowapp.whenReady().then(() => {  window = new BrowserWindow({    frame: false,    titleBarStyle: 'hiddenInset',    width: 200,    height: 200,    backgroundColor: '#000'  })  window.loadURL('about:blank')  window.setTouchBar(touchBar)})
```

---

## safeStorage

**URL:** https://www.electronjs.org/docs/latest/api/safe-storage

**Contents:**
- safeStorage
- Methods​
  - safeStorage.isEncryptionAvailable()​
  - safeStorage.encryptString(plainText)​
  - safeStorage.decryptString(encrypted)​
  - safeStorage.setUsePlainTextEncryption(usePlainText)​
  - safeStorage.getSelectedStorageBackend() Linux​

Allows access to simple encryption and decryption of strings for storage on the local machine.

This module adds extra protection to data being stored on disk by using OS-provided cryptography systems. Current security semantics for each platform are outlined below.

Note that on Mac, access to the system Keychain is required and these calls can block the current thread to collect user input. The same is true for Linux, if a password management tool is available.

The safeStorage module has the following methods:

Returns boolean - Whether encryption is available.

On Linux, returns true if the app has emitted the ready event and the secret key is available. On MacOS, returns true if Keychain is available. On Windows, returns true once the app has emitted the ready event.

Returns Buffer - An array of bytes representing the encrypted string.

This function will throw an error if encryption fails.

Returns string - the decrypted string. Decrypts the encrypted buffer obtained with safeStorage.encryptString back into a string.

This function will throw an error if decryption fails.

This function on Linux will force the module to use an in memory password for creating symmetric key that is used for encrypt/decrypt functions when a valid OS password manager cannot be determined for the current active desktop environment. This function is a no-op on Windows and MacOS.

Returns string - User friendly name of the password manager selected on Linux.

This function will return one of the following values:

---

## nativeTheme

**URL:** https://www.electronjs.org/docs/latest/api/native-theme

**Contents:**
- nativeTheme
- Events​
  - Event: 'updated'​
- Properties​
  - nativeTheme.shouldUseDarkColors Readonly​
  - nativeTheme.themeSource​
  - nativeTheme.shouldUseHighContrastColors macOS Windows Readonly​
  - nativeTheme.shouldUseDarkColorsForSystemIntegratedUI macOS Windows Readonly​
  - nativeTheme.shouldUseInvertedColorScheme macOS Windows Readonly​
  - nativeTheme.inForcedColorsMode Windows Readonly​

Read and respond to changes in Chromium's native color theme.

The nativeTheme module emits the following events:

Emitted when something in the underlying NativeTheme has changed. This normally means that either the value of shouldUseDarkColors, shouldUseHighContrastColors or shouldUseInvertedColorScheme has changed. You will have to check them to determine which one has changed.

The nativeTheme module has the following properties:

A boolean for if the OS / Chromium currently has a dark mode enabled or is being instructed to show a dark-style UI. If you want to modify this value you should use themeSource below.

A string property that can be system, light or dark. It is used to override and supersede the value that Chromium has chosen to use internally.

Setting this property to system will remove the override and everything will be reset to the OS default. By default themeSource is system.

Settings this property to dark will have the following effects:

Settings this property to light will have the following effects:

The usage of this property should align with a classic "dark mode" state machine in your application where the user has three options.

Your application should then always use shouldUseDarkColors to determine what CSS to apply.

A boolean for if the OS / Chromium currently has high-contrast mode enabled or is being instructed to show a high-contrast UI.

A boolean property indicating whether or not the system theme has been set to dark or light.

On Windows this property distinguishes between system and app light/dark theme, returning true if the system theme is set to dark theme and false otherwise. On macOS the return value will be the same as nativeTheme.shouldUseDarkColors.

A boolean for if the OS / Chromium currently has an inverted color scheme or is being instructed to use an inverted color scheme.

A boolean indicating whether Chromium is in forced colors mode, controlled by system accessibility settings. Currently, Windows high contrast is the only system setting that triggers forced colors mode.

A boolean that indicates the whether the user has chosen via system accessibility settings to reduce transparency at the OS level.

---

## globalShortcut

**URL:** https://www.electronjs.org/docs/latest/api/global-shortcut

**Contents:**
- globalShortcut
- Methods​
  - globalShortcut.register(accelerator, callback)​
  - globalShortcut.registerAll(accelerators, callback)​
  - globalShortcut.isRegistered(accelerator)​
  - globalShortcut.unregister(accelerator)​
  - globalShortcut.unregisterAll()​

Detect keyboard events when the application does not have keyboard focus.

The globalShortcut module can register/unregister a global keyboard shortcut with the operating system so that you can customize the operations for various shortcuts.

The shortcut is global; it will work even if the app does not have the keyboard focus. This module cannot be used before the ready event of the app module is emitted. Please also note that it is also possible to use Chromium's GlobalShortcutsPortal implementation, which allows apps to bind global shortcuts when running within a Wayland session.

See also: A detailed guide on Keyboard Shortcuts.

The globalShortcut module has the following methods:

Returns boolean - Whether or not the shortcut was registered successfully.

Registers a global shortcut of accelerator. The callback is called when the registered shortcut is pressed by the user.

When the accelerator is already taken by other applications, this call will silently fail. This behavior is intended by operating systems, since they don't want applications to fight for global shortcuts.

The following accelerators will not be registered successfully on macOS 10.14 Mojave unless the app has been authorized as a trusted accessibility client:

Registers a global shortcut of all accelerator items in accelerators. The callback is called when any of the registered shortcuts are pressed by the user.

When a given accelerator is already taken by other applications, this call will silently fail. This behavior is intended by operating systems, since they don't want applications to fight for global shortcuts.

The following accelerators will not be registered successfully on macOS 10.14 Mojave unless the app has been authorized as a trusted accessibility client:

Returns boolean - Whether this application has registered accelerator.

When the accelerator is already taken by other applications, this call will still return false. This behavior is intended by operating systems, since they don't want applications to fight for global shortcuts.

Unregisters the global shortcut of accelerator.

Unregisters all of the global shortcuts.

**Examples:**

Example 1 (javascript):
```javascript
const { app, globalShortcut } = require('electron')// Enable usage of Portal's globalShortcuts. This is essential for cases when// the app runs in a Wayland session.app.commandLine.appendSwitch('enable-features', 'GlobalShortcutsPortal')app.whenReady().then(() => {  // Register a 'CommandOrControl+X' shortcut listener.  const ret = globalShortcut.register('CommandOrControl+X', () => {    console.log('CommandOrControl+X is pressed')  })  if (!ret) {    console.log('registration failed')  }  // Check whether a shortcut is registered.  console.log(globalShortcut.isRegistered('CommandOrControl+X'))})app.on('will-quit', () => {  // Unregister a shortcut.  globalShortcut.unregister('CommandOrControl+X')  // Unregister all shortcuts.  globalShortcut.unregisterAll()})
```

---

## Class: ClientRequest

**URL:** https://www.electronjs.org/docs/latest/api/client-request

**Contents:**
- Class: ClientRequest
- Class: ClientRequest​
  - new ClientRequest(options)​
  - Instance Events​
    - Event: 'response'​
    - Event: 'login'​
    - Event: 'finish'​
    - Event: 'abort'​
    - Event: 'error'​
    - Event: 'close'​

Make HTTP/HTTPS requests.

Process: Main, Utility This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

ClientRequest implements the Writable Stream interface and is therefore an EventEmitter.

options properties such as protocol, host, hostname, port and path strictly follow the Node.js model as described in the URL module.

For instance, we could have created the same request to 'github.com' as follows:

Emitted when an authenticating proxy is asking for user credentials.

The callback function is expected to be called back with user credentials:

Providing empty credentials will cancel the request and report an authentication error on the response object:

Emitted just after the last chunk of the request's data has been written into the request object.

Emitted when the request is aborted. The abort event will not be fired if the request is already closed.

Emitted when the net module fails to issue a network request. Typically when the request object emits an error event, a close event will subsequently follow and no response object will be provided.

Emitted as the last event in the HTTP request-response transaction. The close event indicates that no more events will be emitted on either the request or response objects.

Emitted when the server returns a redirect response (e.g. 301 Moved Permanently). Calling request.followRedirect will continue with the redirection. If this event is handled, request.followRedirect must be called synchronously, otherwise the request will be cancelled.

A boolean specifying whether the request will use HTTP chunked transfer encoding or not. Defaults to false. The property is readable and writable, however it can be set only before the first write operation as the HTTP headers are not yet put on the wire. Trying to set the chunkedEncoding property after the first write will throw an error.

Using chunked encoding is strongly recommended if you need to send a large request body as data will be streamed in small chunks instead of being internally buffered inside Electron process memory.

Adds an extra HTTP header. The header name will be issued as-is without lowercasing. It can be called only before first write. Calling this method after the first write will throw an error. If the passed value is not a string, its toString() method will be called to obtain the final value.

Certain headers are restricted from being set by apps. These headers are listed below. More information on restricted headers can be found in Chromium's header utils.

Additionally, setting the Connection header to the value upgrade is also disallowed.

Returns string - The value of a previously set extra header name.

Removes a previously set extra header name. This method can be called only before first write. Trying to call it after the first write will throw an error.

callback is essentially a dummy function introduced in the purpose of keeping similarity with the Node.js API. It is called asynchronously in the next tick after chunk content have been delivered to the Chromium networking layer. Contrary to the Node.js implementation, it is not guaranteed that chunk content have been flushed on the wire before callback is called.

Adds a chunk of data to the request body. The first write operation may cause the request headers to be issued on the wire. After the first write operation, it is not allowed to add or remove a custom header.

Sends the last chunk of the request data. Subsequent write or end operations will not be allowed. The finish event is emitted just after the end operation.

Cancels an ongoing HTTP transaction. If the request has already emitted the close event, the abort operation will have no effect. Otherwise an ongoing event will emit abort and close events. Additionally, if there is an ongoing response object,it will emit the aborted event.

Continues any pending redirection. Can only be called during a 'redirect' event.

You can use this method in conjunction with POST requests to get the progress of a file upload or other data transfer.

**Examples:**

Example 1 (css):
```css
const request = net.request({  method: 'GET',  protocol: 'https:',  hostname: 'github.com',  port: 443,  path: '/'})
```

Example 2 (javascript):
```javascript
request.on('login', (authInfo, callback) => {  callback('username', 'password')})
```

Example 3 (javascript):
```javascript
request.on('response', (response) => {  console.log(`STATUS: ${response.statusCode}`)  response.on('error', (error) => {    console.log(`ERROR: ${JSON.stringify(error)}`)  })})request.on('login', (authInfo, callback) => {  callback()})
```

---

## BaseWindow

**URL:** https://www.electronjs.org/docs/latest/api/base-window

**Contents:**
- BaseWindow
- Parent and child windows​
- Modal windows​
- Platform notices​
- Resource management​
- Class: BaseWindow​
  - new BaseWindow([options])​
  - Instance Events​
    - Event: 'close'​
    - Event: 'closed'​

Create and control windows.

BaseWindow provides a flexible way to compose multiple web views in a single window. For windows with only a single, full-size web view, the BrowserWindow class may be a simpler option.

This module cannot be used until the ready event of the app module is emitted.

By using parent option, you can create child windows:

The child window will always show on top of the parent window.

A modal window is a child window that disables parent window. To create a modal window, you have to set both the parent and modal options:

When you add a WebContentsView to a BaseWindow and the BaseWindow is closed, the webContents of the WebContentsView are not destroyed automatically.

It is your responsibility to close the webContents when you no longer need them, e.g. when the BaseWindow is closed:

Unlike with a BrowserWindow, if you don't explicitly close the webContents, you'll encounter memory leaks.

Create and control windows.

BaseWindow is an EventEmitter.

It creates a new BaseWindow with native properties as set by the options.

Electron's built-in classes cannot be subclassed in user code. For more information, see the FAQ.

When setting minimum or maximum window size with minWidth/maxWidth/ minHeight/maxHeight, it only constrains the users. It won't prevent you from passing a size that does not follow size constraints to setBounds/setSize or to the constructor of BrowserWindow.

The possible values and behaviors of the type option are platform dependent. Possible values are:

Objects created with new BaseWindow emit the following events:

Some events are only available on specific operating systems and are labeled as such.

Emitted when the window is going to be closed. It's emitted before the beforeunload and unload event of the DOM. Calling event.preventDefault() will cancel the close.

Usually you would want to use the beforeunload handler to decide whether the window should be closed, which will also be called when the window is reloaded. In Electron, returning any value other than undefined would cancel the close. For example:

There is a subtle difference between the behaviors of window.onbeforeunload = handler and window.addEventListener('beforeunload', handler). It is recommended to always set the event.returnValue explicitly, instead of only returning a value, as the former works more consistently within Electron.

Emitted when the window is closed. After you have received this event you should remove the reference to the window and avoid using it any more.

Emitted when a session is about to end due to a shutdown, machine restart, or user log-off. Calling event.preventDefault() can delay the system shutdown, though it’s generally best to respect the user’s choice to end the session. However, you may choose to use it if ending the session puts the user at risk of losing data.

Emitted when a session is about to end due to a shutdown, machine restart, or user log-off. Once this event fires, there is no way to prevent the session from ending.

Emitted when the window loses focus.

Emitted when the window gains focus.

Emitted when the window is shown.

Emitted when the window is hidden.

Emitted when window is maximized.

Emitted when the window exits from a maximized state.

Emitted when the window is minimized.

Emitted when the window is restored from a minimized state.

Emitted before the window is resized. Calling event.preventDefault() will prevent the window from being resized.

Note that this is only emitted when the window is being resized manually. Resizing the window with setBounds/setSize will not emit this event.

The possible values and behaviors of the edge option are platform dependent. Possible values are:

Emitted after the window has been resized.

Emitted once when the window has finished being resized.

This is usually emitted when the window has been resized manually. On macOS, resizing the window with setBounds/setSize and setting the animate parameter to true will also emit this event once resizing has finished.

Emitted before the window is moved. On Windows, calling event.preventDefault() will prevent the window from being moved.

Note that this is only emitted when the window is being moved manually. Moving the window with setPosition/setBounds/center will not emit this event.

Emitted when the window is being moved to a new position.

Emitted once when the window is moved to a new position.

On macOS, this event is an alias of move.

Emitted when the window enters a full-screen state.

Emitted when the window leaves a full-screen state.

Emitted when the window is set or unset to show always on top of other windows.

Emitted when an App Command is invoked. These are typically related to keyboard media keys or browser commands, as well as the "Back" button built into some mice on Windows.

Commands are lowercased, underscores are replaced with hyphens, and the APPCOMMAND_ prefix is stripped off. e.g. APPCOMMAND_BROWSER_BACKWARD is emitted as browser-backward.

The following app commands are explicitly supported on Linux:

Emitted on 3-finger swipe. Possible directions are up, right, down, left.

The method underlying this event is built to handle older macOS-style trackpad swiping, where the content on the screen doesn't move with the swipe. Most macOS trackpads are not configured to allow this kind of swiping anymore, so in order for it to emit properly the 'Swipe between pages' preference in System Preferences > Trackpad > More Gestures must be set to 'Swipe with two or three fingers'.

Emitted on trackpad rotation gesture. Continually emitted until rotation gesture is ended. The rotation value on each emission is the angle in degrees rotated since the last emission. The last emitted event upon a rotation gesture will always be of value 0. Counter-clockwise rotation values are positive, while clockwise ones are negative.

Emitted when the window opens a sheet.

Emitted when the window has closed a sheet.

Emitted when the native new tab button is clicked.

Emitted when the system context menu is triggered on the window, this is normally only triggered when the user right clicks on the non-client area of your window. This is the window titlebar or any area you have declared as -webkit-app-region: drag in a frameless window.

Calling event.preventDefault() will prevent the menu from being displayed.

To convert point to DIP, use screen.screenToDipPoint(point).

The BaseWindow class has the following static methods:

Returns BaseWindow[] - An array of all opened browser windows.

Returns BaseWindow | null - The window that is focused in this application, otherwise returns null.

Returns BaseWindow | null - The window with the given id.

Objects created with new BaseWindow have the following properties:

A Integer property representing the unique ID of the window. Each ID is unique among all BaseWindow instances of the entire Electron application.

A View property for the content view of the window.

A string (optional) property that is equal to the tabbingIdentifier passed to the BrowserWindow constructor or undefined if none was set.

A boolean property that determines whether the window menu bar should hide itself automatically. Once set, the menu bar will only show when users press the single Alt key.

If the menu bar is already visible, setting this property to true won't hide it immediately.

A boolean property that determines whether the window is in simple (pre-Lion) fullscreen mode.

A boolean property that determines whether the window is in fullscreen mode.

A boolean property that determines whether the window is focusable.

A boolean property that determines whether the window is visible on all workspaces.

Always returns false on Windows.

A boolean property that determines whether the window has a shadow.

A boolean property that determines whether the menu bar should be visible.

If the menu bar is auto-hide, users can still bring up the menu bar by pressing the single Alt key.

A boolean property that determines whether the window is in kiosk mode.

A boolean property that specifies whether the window’s document has been edited.

The icon in title bar will become gray when set to true.

A string property that determines the pathname of the file the window represents, and the icon of the file will show in window's title bar.

A string property that determines the title of the native window.

The title of the web page can be different from the title of the native window.

A boolean property that determines whether the window can be manually minimized by user.

On Linux the setter is a no-op, although the getter returns true.

A boolean property that determines whether the window can be manually maximized by user.

On Linux the setter is a no-op, although the getter returns true.

A boolean property that determines whether the maximize/zoom window button toggles fullscreen mode or maximizes the window.

A boolean property that determines whether the window can be manually resized by user.

A boolean property that determines whether the window can be manually closed by user.

On Linux the setter is a no-op, although the getter returns true.

A boolean property that determines Whether the window can be moved by user.

On Linux the setter is a no-op, although the getter returns true.

A boolean property that determines whether the window is excluded from the application’s Windows menu. false by default.

A string property that defines an alternative title provided only to accessibility tools such as screen readers. This string is not directly visible to users.

A boolean property that indicates whether the window is arranged via Snap.

Objects created with new BaseWindow have the following instance methods:

Some methods are only available on specific operating systems and are labeled as such.

Sets the content view of the window.

Returns View - The content view of the window.

Force closing the window, the unload and beforeunload event won't be emitted for the web page, and close event will also not be emitted for this window, but it guarantees the closed event will be emitted.

Try to close the window. This has the same effect as a user manually clicking the close button of the window. The web page may cancel the close though. See the close event.

Focuses on the window.

Removes focus from the window.

Returns boolean - Whether the window is focused.

Returns boolean - Whether the window is destroyed.

Shows and gives focus to the window.

Shows the window but doesn't focus on it.

Returns boolean - Whether the window is visible to the user in the foreground of the app.

Returns boolean - Whether current window is a modal window.

Maximizes the window. This will also show (but not focus) the window if it isn't being displayed already.

Unmaximizes the window.

Returns boolean - Whether the window is maximized.

Minimizes the window. On some platforms the minimized window will be shown in the Dock.

Restores the window from minimized state to its previous state.

Returns boolean - Whether the window is minimized.

Sets whether the window should be in fullscreen mode.

On macOS, fullscreen transitions take place asynchronously. If further actions depend on the fullscreen state, use the 'enter-full-screen' or > 'leave-full-screen' events.

Returns boolean - Whether the window is in fullscreen mode.

Enters or leaves simple fullscreen mode.

Simple fullscreen mode emulates the native fullscreen behavior found in versions of macOS prior to Lion (10.7).

Returns boolean - Whether the window is in simple (pre-Lion) fullscreen mode.

Returns boolean - Whether the window is in normal state (not maximized, not minimized, not in fullscreen mode).

This will make a window maintain an aspect ratio. The extra size allows a developer to have space, specified in pixels, not included within the aspect ratio calculations. This API already takes into account the difference between a window's size and its content size.

Consider a normal window with an HD video player and associated controls. Perhaps there are 15 pixels of controls on the left edge, 25 pixels of controls on the right edge and 50 pixels of controls below the player. In order to maintain a 16:9 aspect ratio (standard aspect ratio for HD @1920x1080) within the player itself we would call this function with arguments of 16/9 and { width: 40, height: 50 }. The second argument doesn't care where the extra width and height are within the content view--only that they exist. Sum any extra width and height areas you have within the overall content view.

The aspect ratio is not respected when window is resized programmatically with APIs like win.setSize.

To reset an aspect ratio, pass 0 as the aspectRatio value: win.setAspectRatio(0).

Examples of valid backgroundColor values:

Sets the background color of the window. See Setting backgroundColor.

Uses Quick Look to preview a file at a given path.

Closes the currently open Quick Look panel.

Resizes and moves the window to the supplied bounds. Any properties that are not supplied will default to their current values.

On macOS, the y-coordinate value cannot be smaller than the Tray height. The tray height has changed over time and depends on the operating system, but is between 20-40px. Passing a value lower than the tray height will result in a window that is flush to the tray.

Returns Rectangle - The bounds of the window as Object.

On macOS, the y-coordinate value returned will be at minimum the Tray height. For example, calling win.setBounds({ x: 25, y: 20, width: 800, height: 600 }) with a tray height of 38 means that win.getBounds() will return { x: 25, y: 38, width: 800, height: 600 }.

Returns string - Gets the background color of the window in Hex (#RRGGBB) format.

See Setting backgroundColor.

The alpha value is not returned alongside the red, green, and blue values.

Resizes and moves the window's client area (e.g. the web page) to the supplied bounds.

Returns Rectangle - The bounds of the window's client area as Object.

Returns Rectangle - Contains the window bounds of the normal state

Whatever the current state of the window : maximized, minimized or in fullscreen, this function always returns the position and size of the window in normal state. In normal state, getBounds and getNormalBounds returns the same Rectangle.

Disable or enable the window.

Returns boolean - whether the window is enabled.

Resizes the window to width and height. If width or height are below any set minimum size constraints the window will snap to its minimum size.

Returns Integer[] - Contains the window's width and height.

Resizes the window's client area (e.g. the web page) to width and height.

Returns Integer[] - Contains the window's client area's width and height.

Sets the minimum size of window to width and height.

Returns Integer[] - Contains the window's minimum width and height.

Sets the maximum size of window to width and height.

Returns Integer[] - Contains the window's maximum width and height.

Sets whether the window can be manually resized by the user.

Returns boolean - Whether the window can be manually resized by the user.

Sets whether the window can be moved by user. On Linux does nothing.

Returns boolean - Whether the window can be moved by user.

On Linux always returns true.

Sets whether the window can be manually minimized by user. On Linux does nothing.

Returns boolean - Whether the window can be manually minimized by the user.

On Linux always returns true.

Sets whether the window can be manually maximized by user. On Linux does nothing.

Returns boolean - Whether the window can be manually maximized by user.

On Linux always returns true.

Sets whether the maximize/zoom window button toggles fullscreen mode or maximizes the window.

Returns boolean - Whether the maximize/zoom window button toggles fullscreen mode or maximizes the window.

Sets whether the window can be manually closed by user. On Linux does nothing.

Returns boolean - Whether the window can be manually closed by user.

On Linux always returns true.

Sets whether the window will be hidden when the user toggles into mission control.

Returns boolean - Whether the window will be hidden when the user toggles into mission control.

Sets whether the window should show always on top of other windows. After setting this, the window is still a normal window, not a toolbox window which can not be focused on.

Returns boolean - Whether the window is always on top of other windows.

Moves window above the source window in the sense of z-order. If the mediaSourceId is not of type window or if the window does not exist then this method throws an error.

Moves window to top(z-order) regardless of focus

Moves window to the center of the screen.

Moves window to x and y.

Returns Integer[] - Contains the window's current position.

Changes the title of native window to title.

Returns string - The title of the native window.

The title of the web page can be different from the title of the native window.

Changes the attachment point for sheets on macOS. By default, sheets are attached just below the window frame, but you may want to display them beneath a HTML-rendered toolbar. For example:

window.flashFrame(bool) will flash dock icon continuously on macOS

Starts or stops flashing the window to attract user's attention.

Makes the window not show in the taskbar.

Enters or leaves kiosk mode.

Returns boolean - Whether the window is in kiosk mode.

Returns boolean - Whether the window is in Windows 10 tablet mode.

Since Windows 10 users can use their PC as tablet, under this mode apps can choose to optimize their UI for tablets, such as enlarging the titlebar and hiding titlebar buttons.

This API returns whether the window is in tablet mode, and the resize event can be be used to listen to changes to tablet mode.

Returns string - Window id in the format of DesktopCapturerSource's id. For example "window:1324:0".

More precisely the format is window:id:other_id where id is HWND on Windows, CGWindowID (uint64_t) on macOS and Window (unsigned long) on Linux. other_id is used to identify web contents (tabs) so within the same top level window.

Returns Buffer - The platform-specific handle of the window.

The native type of the handle is HWND on Windows, NSView* on macOS, and Window (unsigned long) on Linux.

Hooks a windows message. The callback is called when the message is received in the WndProc.

Returns boolean - true or false depending on whether the message is hooked.

Unhook the window message.

Unhooks all of the window messages.

Sets the pathname of the file the window represents, and the icon of the file will show in window's title bar.

Returns string - The pathname of the file the window represents.

Specifies whether the window’s document has been edited, and the icon in title bar will become gray when set to true.

Returns boolean - Whether the window's document has been edited.

Sets the menu as the window's menu bar.

Remove the window's menu bar.

Sets progress value in progress bar. Valid range is [0, 1.0].

Remove progress bar when progress < 0; Change to indeterminate mode when progress > 1.

On Linux platform, only supports Unity desktop environment, you need to specify the *.desktop file name to desktopName field in package.json. By default, it will assume {app.name}.desktop.

On Windows, a mode can be passed. Accepted values are none, normal, indeterminate, error, and paused. If you call setProgressBar without a mode set (but with a value within the valid range), normal will be assumed.

Sets a 16 x 16 pixel overlay onto the current taskbar icon, usually used to convey some sort of application status or to passively notify the user.

Invalidates the window shadow so that it is recomputed based on the current window shape.

BaseWindows that are transparent can sometimes leave behind visual artifacts on macOS. This method can be used to clear these artifacts when, for example, performing an animation.

Sets whether the window should have a shadow.

Returns boolean - Whether the window has a shadow.

Sets the opacity of the window. On Linux, does nothing. Out of bound number values are clamped to the [0, 1] range.

Returns number - between 0.0 (fully transparent) and 1.0 (fully opaque). On Linux, always returns 1.

Setting a window shape determines the area within the window where the system permits drawing and user interaction. Outside of the given region, no pixels will be drawn and no mouse events will be registered. Mouse events outside of the region will not be received by that window, but will fall through to whatever is behind the window.

Returns boolean - Whether the buttons were added successfully

Add a thumbnail toolbar with a specified set of buttons to the thumbnail image of a window in a taskbar button layout. Returns a boolean object indicates whether the thumbnail has been added successfully.

The number of buttons in thumbnail toolbar should be no greater than 7 due to the limited room. Once you setup the thumbnail toolbar, the toolbar cannot be removed due to the platform's limitation. But you can call the API with an empty array to clean the buttons.

The buttons is an array of Button objects:

The flags is an array that can include following strings:

Sets the region of the window to show as the thumbnail image displayed when hovering over the window in the taskbar. You can reset the thumbnail to be the entire window by specifying an empty region: { x: 0, y: 0, width: 0, height: 0 }.

Sets the toolTip that is displayed when hovering over the window thumbnail in the taskbar.

Sets the properties for the window's taskbar button.

relaunchCommand and relaunchDisplayName must always be set together. If one of those properties is not set, then neither will be used.

Sets the system accent color and highlighting of active window border.

The accentColor parameter accepts the following values:

Returns string | boolean - the system accent color and highlighting of active window border in Hex RGB format.

If a color has been set for the window that differs from the system accent color, the window accent color will be returned. Otherwise, a boolean will be returned, with true indicating that the window uses the global system accent color, and false indicating that accent color highlighting is disabled for this window.

Sets whether the window traffic light buttons should be visible.

Sets whether the window menu bar should hide itself automatically. Once set the menu bar will only show when users press the single Alt key.

If the menu bar is already visible, calling setAutoHideMenuBar(true) won't hide it immediately.

Returns boolean - Whether menu bar automatically hides itself.

Sets whether the menu bar should be visible. If the menu bar is auto-hide, users can still bring up the menu bar by pressing the single Alt key.

Returns boolean - Whether the menu bar is visible.

Returns boolean - whether the window is arranged via Snap.

The window is snapped via buttons shown when the mouse is hovered over window maximize button, or by dragging it to the edges of the screen.

Sets whether the window should be visible on all workspaces.

This API does nothing on Windows.

Returns boolean - Whether the window is visible on all workspaces.

This API always returns false on Windows.

Makes the window ignore all mouse events.

All mouse events happened in this window will be passed to the window below this window, but if this window has focus, it will still receive keyboard events.

Prevents the window contents from being captured by other apps.

On macOS it sets the NSWindow's sharingType to NSWindowSharingNone. On Windows it calls SetWindowDisplayAffinity with WDA_EXCLUDEFROMCAPTURE. For Windows 10 version 2004 and up the window will be removed from capture entirely, older Windows versions behave as if WDA_MONITOR is applied capturing a black window.

Returns boolean - whether or not content protection is currently enabled.

Changes whether the window can be focused.

On macOS it does not remove the focus from the window.

Returns boolean - Whether the window can be focused.

Sets parent as current window's parent window, passing null will turn current window into a top-level window.

Returns BaseWindow | null - The parent window or null if there is no parent.

Returns BaseWindow[] - All child windows.

Controls whether to hide cursor when typing.

Selects the previous tab when native tabs are enabled and there are other tabs in the window.

Selects the next tab when native tabs are enabled and there are other tabs in the window.

Shows or hides the tab overview when native tabs are enabled.

Merges all windows into one window with multiple tabs when native tabs are enabled and there is more than one open window.

Moves the current tab into a new window if native tabs are enabled and there is more than one tab in the current window.

Toggles the visibility of the tab bar if native tabs are enabled and there is only one tab in the current window.

Adds a window as a tab on this window, after the tab for the window instance.

Adds a vibrancy effect to the window. Passing null or an empty string will remove the vibrancy effect on the window.

This method sets the browser window's system-drawn background material, including behind the non-client area.

See the Windows documentation for more details.

This method is only supported on Windows 11 22H2 and up.

Set a custom position for the traffic light buttons in frameless window. Passing null will reset the position to default.

Returns Point | null - The custom position for the traffic light buttons in frameless window, null will be returned when there is no custom position.

Sets the touchBar layout for the current window. Specifying null or undefined clears the touch bar. This method only has an effect if the machine has a touch bar.

The TouchBar API is currently experimental and may change or be removed in future Electron releases.

On a Window with Window Controls Overlay already enabled, this method updates the style of the title bar overlay.

On Linux, the symbolColor is automatically calculated to have minimum accessible contrast to the color if not explicitly set.

**Examples:**

Example 1 (css):
```css
// In the main process.const { BaseWindow, WebContentsView } = require('electron')const win = new BaseWindow({ width: 800, height: 600 })const leftView = new WebContentsView()leftView.webContents.loadURL('https://electronjs.org')win.contentView.addChildView(leftView)const rightView = new WebContentsView()rightView.webContents.loadURL('https://github.com/electron/electron')win.contentView.addChildView(rightView)leftView.setBounds({ x: 0, y: 0, width: 400, height: 600 })rightView.setBounds({ x: 400, y: 0, width: 400, height: 600 })
```

Example 2 (javascript):
```javascript
const { BaseWindow } = require('electron')const parent = new BaseWindow()const child = new BaseWindow({ parent })
```

Example 3 (javascript):
```javascript
const { BaseWindow } = require('electron')const parent = new BaseWindow()const child = new BaseWindow({ parent, modal: true })
```

Example 4 (javascript):
```javascript
const { BaseWindow, WebContentsView } = require('electron')const win = new BaseWindow({ width: 800, height: 600 })const view = new WebContentsView()win.contentView.addChildView(view)win.on('closed', () => {  view.webContents.close()})
```

---

## powerSaveBlocker

**URL:** https://www.electronjs.org/docs/latest/api/power-save-blocker

**Contents:**
- powerSaveBlocker
- Methods​
  - powerSaveBlocker.start(type)​
  - powerSaveBlocker.stop(id)​
  - powerSaveBlocker.isStarted(id)​

Block the system from entering low-power (sleep) mode.

The powerSaveBlocker module has the following methods:

Returns Integer - The blocker ID that is assigned to this power blocker.

Starts preventing the system from entering lower-power mode. Returns an integer identifying the power save blocker.

prevent-display-sleep has higher precedence over prevent-app-suspension. Only the highest precedence type takes effect. In other words, prevent-display-sleep always takes precedence over prevent-app-suspension.

For example, an API calling A requests for prevent-app-suspension, and another calling B requests for prevent-display-sleep. prevent-display-sleep will be used until B stops its request. After that, prevent-app-suspension is used.

Stops the specified power save blocker.

Returns boolean - Whether the specified powerSaveBlocker has been stopped.

Returns boolean - Whether the corresponding powerSaveBlocker has started.

**Examples:**

Example 1 (javascript):
```javascript
const { powerSaveBlocker } = require('electron')const id = powerSaveBlocker.start('prevent-display-sleep')console.log(powerSaveBlocker.isStarted(id))powerSaveBlocker.stop(id)
```

---

## Electron API History Migration Guide

**URL:** https://www.electronjs.org/docs/latest/development/api-history-migration-guide

**Contents:**
- Electron API History Migration Guide
- API history information​
  - Breaking Changes​
  - Additions​
- Example​

This document demonstrates how to add API History blocks to existing APIs.

Here are some resources you can use to find information on the history of an API:

The associated API is already removed, we will ignore that for the purpose of this example.

If we search through breaking-changes.md we can find a function that was deprecated in Electron 25.0.

We can then use git blame to find the Pull Request associated with that entry:

Verify that the Pull Request is correct and make a corresponding entry in the API History:

Refer to the API History section of style-guide.md for information on how to create API History blocks.

You can keep looking through breaking-changes.md to find other breaking changes and add those in.

You can also use git log -L :<funcname>:<file>:

Verify that the Pull Request is correct and make a corresponding entry in the API History:

We will then look for when the API was originally added:

Alternatively, you can use git blame:

Verify that the Pull Request is correct and make a corresponding entry in the API History:

**Examples:**

Example 1 (markdown):
```markdown
<!-- docs/breaking-changes.md -->### Deprecated: `BrowserWindow.getTrafficLightPosition()``BrowserWindow.getTrafficLightPosition()` has been deprecated, the`BrowserWindow.getWindowButtonPosition()` API should be used insteadwhich returns `null` instead of `{ x: 0, y: 0 }` when there is no customposition.<!-- docs/api/browser-window.md  -->#### `win.getTrafficLightPosition()` _macOS_ _Deprecated_Returns `Point` - The custom position for the traffic light buttons inframeless window, `{ x: 0, y: 0 }` will be returned when there is no customposition.
```

Example 2 (bash):
```bash
$ grep -n "BrowserWindow.getTrafficLightPosition" docs/breaking-changes.md 523:### Deprecated: `BrowserWindow.getTrafficLightPosition()`525:`BrowserWindow.getTrafficLightPosition()` has been deprecated, the$ git blame -L523,524 -- docs/breaking-changes.md1e206deec3e (Keeley Hammond 2023-04-06 21:23:29 -0700 523) ### Deprecated: `BrowserWindow.getTrafficLightPosition()`1e206deec3e (Keeley Hammond 2023-04-06 21:23:29 -0700 524)$ git log -1 1e206deec3ecommit 1e206deec3ef142460c780307752a84782f9baed (tag: v26.0.0-nightly.20230407)Author: Keeley Hammond <vertedinde@electronjs.org>Date:   Thu Apr 6 21:23:29 2023 -0700    docs: update E24/E25 breaking changes (#37878) <-- This is the associated Pull Request
```

Example 3 (markdown):
```markdown
#### `win.getTrafficLightPosition()` _macOS_ _Deprecated_<!--```YAML historydeprecated:  - pr-url: https://github.com/electron/electron/pull/37878    breaking-changes-header: deprecated-browserwindowgettrafficlightposition```-->Returns `Point` - The custom position for the traffic light buttons inframeless window, `{ x: 0, y: 0 }` will be returned when there is no customposition.
```

Example 4 (bash):
```bash
$ git log --reverse -L :GetTrafficLightPosition:shell/browser/native_window_mac.mmcommit e01b1831d96d5d68f54af879b00c617358df5372Author: Cheng Zhao <zcbenz@gmail.com>Date:   Wed Dec 16 14:30:39 2020 +0900    feat: make trafficLightPosition work for customButtonOnHover (#26789)
```

---

## Point Object

**URL:** https://www.electronjs.org/docs/latest/api/structures/point

**Contents:**
- Point Object

Both x and y must be whole integers, when providing a point object as input to an Electron API we will automatically round your x and y values to the nearest whole integer.

---

## TraceConfig Object

**URL:** https://www.electronjs.org/docs/latest/api/structures/trace-config

**Contents:**
- TraceConfig Object

An example TraceConfig that roughly matches what Chrome DevTools records:

**Examples:**

Example 1 (json):
```json
{  recording_mode: 'record-until-full',  included_categories: [    'devtools.timeline',    'disabled-by-default-devtools.timeline',    'disabled-by-default-devtools.timeline.frame',    'disabled-by-default-devtools.timeline.stack',    'v8.execute',    'blink.console',    'blink.user_timing',    'latencyInfo',    'disabled-by-default-v8.cpu_profiler',    'disabled-by-default-v8.cpu_profiler.hires'  ],  excluded_categories: ['*']}
```

---

## MemoryInfo Object

**URL:** https://www.electronjs.org/docs/latest/api/structures/memory-info

**Contents:**
- MemoryInfo Object

Note that all statistics are reported in Kilobytes.

---

## Class: TouchBarScrubber

**URL:** https://www.electronjs.org/docs/latest/api/touch-bar-scrubber

**Contents:**
- Class: TouchBarScrubber
- Class: TouchBarScrubber​
  - new TouchBarScrubber(options)​
  - Instance Properties​
    - touchBarScrubber.items​
    - touchBarScrubber.selectedStyle​
    - touchBarScrubber.overlayStyle​
    - touchBarScrubber.showArrowButtons​
    - touchBarScrubber.mode​
    - touchBarScrubber.continuous​

Create a scrubber (a scrollable selector)

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

The following properties are available on instances of TouchBarScrubber:

A ScrubberItem[] array representing the items in this scrubber. Updating this value immediately updates the control in the touch bar. Updating deep properties inside this array does not update the touch bar.

A string representing the style that selected items in the scrubber should have. Updating this value immediately updates the control in the touch bar. Possible values:

A string representing the style that selected items in the scrubber should have. This style is overlaid on top of the scrubber item instead of being placed behind it. Updating this value immediately updates the control in the touch bar. Possible values:

A boolean representing whether to show the left / right selection arrows in this scrubber. Updating this value immediately updates the control in the touch bar.

A string representing the mode of this scrubber. Updating this value immediately updates the control in the touch bar. Possible values:

A boolean representing whether this scrubber is continuous or not. Updating this value immediately updates the control in the touch bar.

---

## Class: Cookies

**URL:** https://www.electronjs.org/docs/latest/api/cookies

**Contents:**
- Class: Cookies
- Class: Cookies​
  - Instance Events​
    - Event: 'changed'​
  - Instance Methods​
    - cookies.get(filter)​
    - cookies.set(details)​
    - cookies.remove(url, name)​
    - cookies.flushStore()​

Query and modify a session's cookies.

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

Instances of the Cookies class are accessed by using cookies property of a Session.

The following events are available on instances of Cookies:

Emitted when a cookie is changed because it was added, edited, removed, or expired.

The following methods are available on instances of Cookies:

Returns Promise<Cookie[]> - A promise which resolves an array of cookie objects.

Sends a request to get all cookies matching filter, and resolves a promise with the response.

Returns Promise<void> - A promise which resolves when the cookie has been set

Sets a cookie with details.

Returns Promise<void> - A promise which resolves when the cookie has been removed

Removes the cookies matching url and name

Returns Promise<void> - A promise which resolves when the cookie store has been flushed

Writes any unwritten cookies data to disk

Cookies written by any method will not be written to disk immediately, but will be written every 30 seconds or 512 operations

Calling this method can cause the cookie to be written to disk immediately.

**Examples:**

Example 1 (javascript):
```javascript
const { session } = require('electron')// Query all cookies.session.defaultSession.cookies.get({})  .then((cookies) => {    console.log(cookies)  }).catch((error) => {    console.log(error)  })// Query all cookies associated with a specific url.session.defaultSession.cookies.get({ url: 'https://www.github.com' })  .then((cookies) => {    console.log(cookies)  }).catch((error) => {    console.log(error)  })// Set a cookie with the given cookie data;// may overwrite equivalent cookies if they exist.const cookie = { url: 'https://www.github.com', name: 'dummy_name', value: 'dummy' }session.defaultSession.cookies.set(cookie)  .then(() => {    // success  }, (error) => {    console.error(error)  })
```

---

## BaseWindowConstructorOptions Object

**URL:** https://www.electronjs.org/docs/latest/api/structures/base-window-options

**Contents:**
- BaseWindowConstructorOptions Object

When setting minimum or maximum window size with minWidth/maxWidth/ minHeight/maxHeight, it only constrains the users. It won't prevent you from passing a size that does not follow size constraints to setBounds/setSize or to the constructor of BrowserWindow.

The possible values and behaviors of the type option are platform dependent. Possible values are:

---

## Chrome Extension Support

**URL:** https://www.electronjs.org/docs/latest/api/extensions

**Contents:**
- Chrome Extension Support
- Loading extensions​
- Supported Extensions APIs​
  - Supported Manifest Keys​
  - chrome.devtools.inspectedWindow​
  - chrome.devtools.network​
  - chrome.devtools.panels​
  - chrome.extension​
  - chrome.management​
  - chrome.runtime​

Electron supports a subset of the Chrome Extensions API, primarily to support DevTools extensions and Chromium-internal extensions, but it also happens to support some other extension capabilities.

Electron does not support arbitrary Chrome extensions from the store, and it is a non-goal of the Electron project to be perfectly compatible with Chrome's implementation of Extensions.

Electron only supports loading unpacked extensions (i.e., .crx files do not work). Extensions are installed per-session. To load an extension, call ses.extensions.loadExtension:

Loaded extensions will not be automatically remembered across exits; if you do not call loadExtension when the app runs, the extension will not be loaded.

Note that loading extensions is only supported in persistent sessions. Attempting to load an extension into an in-memory session will throw an error.

See the session documentation for more information about loading, unloading, and querying active extensions.

We support the following extensions APIs, with some caveats. Other APIs may additionally be supported, but support for any APIs not listed here is provisional and may be removed.

See Manifest file format for more information about the purpose of each possible key.

All features of this API are supported.

See official documentation for more information.

All features of this API are supported.

See official documentation for more information.

All features of this API are supported.

See official documentation for more information.

The following properties of chrome.extension are supported:

The following methods of chrome.extension are supported:

See official documentation for more information.

The following methods of chrome.management are supported:

The following events of chrome.management are supported:

See official documentation for more information.

The following properties of chrome.runtime are supported:

The following methods of chrome.runtime are supported:

The following events of chrome.runtime are supported:

See official documentation for more information.

All features of this API are supported.

See official documentation for more information.

The following methods of chrome.storage are supported:

chrome.storage.sync and chrome.storage.managed are not supported.

See official documentation for more information.

The following methods of chrome.tabs are supported:

In Chrome, passing -1 as a tab ID signifies the "currently active tab". Since Electron has no such concept, passing -1 as a tab ID is not supported and will raise an error.

See official documentation for more information.

All features of this API are supported.

Electron's webRequest module takes precedence over chrome.webRequest if there are conflicting handlers.

See official documentation for more information.

**Examples:**

Example 1 (javascript):
```javascript
const { session } = require('electron')session.defaultSession.loadExtension('path/to/unpacked/extension').then(({ id }) => {  // ...})
```

---

## BrowserView

**URL:** https://www.electronjs.org/docs/latest/api/browser-view

**Contents:**
- BrowserView
- Class: BrowserView​
  - Example​
  - new BrowserView([options]) Experimental Deprecated​
  - Instance Properties​
    - view.webContents Experimental Deprecated​
  - Instance Methods​
    - view.setAutoResize(options) Experimental Deprecated​
    - view.setBounds(bounds) Experimental Deprecated​
    - view.getBounds() Experimental Deprecated​

The BrowserView class is deprecated, and replaced by the new WebContentsView class.

A BrowserView can be used to embed additional web content into a BrowserWindow. It is like a child window, except that it is positioned relative to its owning window. It is meant to be an alternative to the webview tag.

Create and control views.

The BrowserView class is deprecated, and replaced by the new WebContentsView class.

This module cannot be used until the ready event of the app module is emitted.

Electron's built-in classes cannot be subclassed in user code. For more information, see the FAQ.

Objects created with new BrowserView have the following properties:

A WebContents object owned by this view.

Objects created with new BrowserView have the following instance methods:

Standardized auto-resizing behavior across all platforms

Resizes and moves the view to the supplied bounds relative to the window.

The bounds of this BrowserView instance as Object.

Examples of valid color values:

Hex format with alpha takes AARRGGBB or ARGB, not RRGGBBAA or RGB.

**Examples:**

Example 1 (javascript):
```javascript
// In the main process.const { app, BrowserView, BrowserWindow } = require('electron')app.whenReady().then(() => {  const win = new BrowserWindow({ width: 800, height: 600 })  const view = new BrowserView()  win.setBrowserView(view)  view.setBounds({ x: 0, y: 0, width: 300, height: 300 })  view.webContents.loadURL('https://electronjs.org')})
```

---

## powerMonitor

**URL:** https://www.electronjs.org/docs/latest/api/power-monitor

**Contents:**
- powerMonitor
- Events​
  - Event: 'suspend'​
  - Event: 'resume'​
  - Event: 'on-ac' macOS Windows​
  - Event: 'on-battery' macOS Windows​
  - Event: 'thermal-state-change' macOS​
  - Event: 'speed-limit-change' macOS Windows​
  - Event: 'shutdown' Linux macOS​
  - Event: 'lock-screen' macOS Windows​

Monitor power state changes.

The powerMonitor module emits the following events:

Emitted when the system is suspending.

Emitted when system is resuming.

Emitted when the system changes to AC power.

Emitted when system changes to battery power.

Emitted when the thermal state of the system changes. Notification of a change in the thermal status of the system, such as entering a critical temperature range. Depending on the severity, the system might take steps to reduce said temperature, for example, throttling the CPU or switching on the fans if available.

Apps may react to the new state by reducing expensive computing tasks (e.g. video encoding), or notifying the user. The same state might be received repeatedly.

See https://developer.apple.com/library/archive/documentation/Performance/Conceptual/power_efficiency_guidelines_osx/RespondToThermalStateChanges.html

Notification of a change in the operating system's advertised speed limit for CPUs, in percent. Values below 100 indicate that the system is impairing processing power due to thermal management.

Emitted when the system is about to reboot or shut down. If the event handler invokes e.preventDefault(), Electron will attempt to delay system shutdown in order for the app to exit cleanly. If e.preventDefault() is called, the app should exit as soon as possible by calling something like app.quit().

Emitted when the system is about to lock the screen.

Emitted as soon as the systems screen is unlocked.

Emitted when a login session is activated. See documentation for more information.

Emitted when a login session is deactivated. See documentation for more information.

The powerMonitor module has the following methods:

Returns string - The system's current idle state. Can be active, idle, locked or unknown.

Calculate the system idle state. idleThreshold is the amount of time (in seconds) before considered idle. locked is available on supported systems only.

Returns Integer - Idle time in seconds

Calculate system idle time in seconds.

Returns string - The system's current thermal state. Can be unknown, nominal, fair, serious, or critical.

Returns boolean - Whether the system is on battery power.

To monitor for changes in this property, use the on-battery and on-ac events.

A boolean property. True if the system is on battery power.

See powerMonitor.isOnBatteryPower().

---

## Display Object

**URL:** https://www.electronjs.org/docs/latest/api/structures/display

**Contents:**
- Display Object

The Display object represents a physical display connected to the system. A fake Display may exist on a headless system, or a Display may correspond to a remote, virtual display.

---

## netLog

**URL:** https://www.electronjs.org/docs/latest/api/net-log

**Contents:**
- netLog
- Methods​
  - netLog.startLogging(path[, options])​
  - netLog.stopLogging()​
- Properties​
  - netLog.currentlyLogging Readonly​

Logging network events for a session.

See --log-net-log to log network events throughout the app's lifecycle.

All methods unless specified can only be used after the ready event of the app module gets emitted.

Returns Promise<void> - resolves when the net log has begun recording.

Starts recording network events to path.

Returns Promise<void> - resolves when the net log has been flushed to disk.

Stops recording network events. If not called, net logging will automatically end when app quits.

A boolean property that indicates whether network logs are currently being recorded.

**Examples:**

Example 1 (javascript):
```javascript
const { app, netLog } = require('electron')app.whenReady().then(async () => {  await netLog.startLogging('/path/to/net-log')  // After some network events  const path = await netLog.stopLogging()  console.log('Net-logs written to', path)})
```

---

## contentTracing

**URL:** https://www.electronjs.org/docs/latest/api/content-tracing

**Contents:**
- contentTracing
- Methods​
  - contentTracing.getCategories()​
  - contentTracing.startRecording(options)​
  - contentTracing.stopRecording([resultFilePath])​
  - contentTracing.getTraceBufferUsage()​

Collect tracing data from Chromium to find performance bottlenecks and slow operations.

This module does not include a web interface. To view recorded traces, use trace viewer, available at chrome://tracing in Chrome.

You should not use this module until the ready event of the app module is emitted.

The contentTracing module has the following methods:

Returns Promise<string[]> - resolves with an array of category groups once all child processes have acknowledged the getCategories request

Get a set of category groups. The category groups can change as new code paths are reached. See also the list of built-in tracing categories.

NOTE: Electron adds a non-default tracing category called "electron". This category can be used to capture Electron-specific tracing events.

Returns Promise<void> - resolved once all child processes have acknowledged the startRecording request.

Start recording on all processes.

Recording begins immediately locally and asynchronously on child processes as soon as they receive the EnableRecording request.

If a recording is already running, the promise will be immediately resolved, as only one trace operation can be in progress at a time.

Returns Promise<string> - resolves with a path to a file that contains the traced data once all child processes have acknowledged the stopRecording request

Stop recording on all processes.

Child processes typically cache trace data and only rarely flush and send trace data back to the main process. This helps to minimize the runtime overhead of tracing since sending trace data over IPC can be an expensive operation. So, to end tracing, Chromium asynchronously asks all child processes to flush any pending trace data.

Trace data will be written into resultFilePath. If resultFilePath is empty or not provided, trace data will be written to a temporary file, and the path will be returned in the promise.

Returns Promise<Object> - Resolves with an object containing the value and percentage of trace buffer maximum usage

Get the maximum usage across processes of trace buffer as a percentage of the full state.

**Examples:**

Example 1 (javascript):
```javascript
const { app, contentTracing } = require('electron')app.whenReady().then(() => {  (async () => {    await contentTracing.startRecording({      included_categories: ['*']    })    console.log('Tracing started')    await new Promise(resolve => setTimeout(resolve, 5000))    const path = await contentTracing.stopRecording()    console.log('Tracing data recorded to ' + path)  })()})
```

---

## ImageView

**URL:** https://www.electronjs.org/docs/latest/api/image-view

**Contents:**
- ImageView
- Class: ImageView extends View​
  - new ImageView() Experimental​
  - Instance Methods​
    - image.setImage(image) Experimental​

A View that displays an image.

This module cannot be used until the ready event of the app module is emitted.

Useful for showing splash screens that will be swapped for WebContentsViews when the content finishes loading.

Note that ImageView is experimental and may be changed or removed in the future.

A View that displays an image.

ImageView inherits from View.

ImageView is an EventEmitter.

Electron's built-in classes cannot be subclassed in user code. For more information, see the FAQ.

Creates an ImageView.

The following methods are available on instances of the ImageView class, in addition to those inherited from View:

Sets the image for this ImageView. Note that only image formats supported by NativeImage can be used with an ImageView.

**Examples:**

Example 1 (javascript):
```javascript
const { BaseWindow, ImageView, nativeImage, WebContentsView } = require('electron')const path = require('node:path')const win = new BaseWindow({ width: 800, height: 600 })// Create a "splash screen" image to display while the WebContentsView loadsconst splashView = new ImageView()const splashImage = nativeImage.createFromPath(path.join(__dirname, 'loading.png'))splashView.setImage(splashImage)win.setContentView(splashView)const webContentsView = new WebContentsView()webContentsView.webContents.once('did-finish-load', () => {  // Now that the WebContentsView has loaded, swap out the "splash screen" ImageView  win.setContentView(webContentsView)})webContentsView.webContents.loadURL('https://electronjs.org')
```

---

## NotificationAction Object

**URL:** https://www.electronjs.org/docs/latest/api/structures/notification-action

**Contents:**
- NotificationAction Object
- Platform / Action Support​
  - Button support on macOS​

In order for extra notification buttons to work on macOS your app must meet the following criteria.

If either of these requirements are not met the button won't appear.

---

## UserDefaultTypes Object

**URL:** https://www.electronjs.org/docs/latest/api/structures/user-default-types

**Contents:**
- UserDefaultTypes Object

This type is a helper alias, no object will ever exist of this type.

---

## Creating a New Electron Browser Module

**URL:** https://www.electronjs.org/docs/latest/development/creating-api

**Contents:**
- Creating a New Electron Browser Module
- Add your files to Electron's project configuration​
- Create API documentation​
- Set up ObjectTemplateBuilder and Wrappable​
- Link your Electron API with Node​
- Expose your API to TypeScript​
  - Export your API as a module​
  - Expose your module to TypeScript​

Welcome to the Electron API guide! If you are unfamiliar with creating a new Electron API module within the browser directory, this guide serves as a checklist for some of the necessary steps that you will need to implement.

This is not a comprehensive end-all guide to creating an Electron Browser API, rather an outline documenting some of the more unintuitive steps.

Electron uses GN as a meta build system to generate files for its compiler, Ninja. This means that in order to tell Electron to compile your code, we have to add your API's code and header file names into filenames.gni.

You will need to append your API file names alphabetically into the appropriate files like so:

Note that the Windows, macOS and Linux array additions are optional and should only be added if your API has specific platform implementations.

Type definitions are generated by Electron using @electron/docs-parser and @electron/typescript-definitions. This step is necessary to ensure consistency across Electron's API documentation. This means that for your API type definition to appear in the electron.d.ts file, we must create a .md file. Examples can be found in this folder.

Electron constructs its modules using object_template_builder.

wrappable is a base class for C++ objects that have corresponding v8 wrapper objects.

Here is a basic example of code that you may need to add, in order to incorporate object_template_builder and wrappable into your API. For further reference, you can find more implementations here.

In your api_name.h file:

In your api_name.cc file:

In the typings/internal-ambient.d.ts file, we need to append a new property onto the Process interface like so:

At the very bottom of your api_name.cc file:

In your shell/common/node_bindings.cc file, add your node binding name to Electron's built-in modules.

More technical details on how Node links with Electron can be found on our blog.

We will need to create a new TypeScript file in the path that follows:

"lib/browser/api/{electron_browser_{api_name}}.ts"

An example of the contents of this file can be found here.

Add your module to the module list found at "lib/browser/api/module-list.ts" like so:

**Examples:**

Example 1 (cpp):
```cpp
lib_sources = [    "path/to/api/api_name.cc",    "path/to/api/api_name.h",]lib_sources_mac = [    "path/to/api/api_name_mac.h",    "path/to/api/api_name_mac.mm",]lib_sources_win = [    "path/to/api/api_name_win.cc",    "path/to/api/api_name_win.h",]lib_sources_linux = [    "path/to/api/api_name_linux.cc",    "path/to/api/api_name_linux.h",]
```

Example 2 (cpp):
```cpp
#ifndef ELECTRON_SHELL_BROWSER_API_ELECTRON_API_{API_NAME}_H_#define ELECTRON_SHELL_BROWSER_API_ELECTRON_API_{API_NAME}_H_#include "gin/handle.h"#include "gin/wrappable.h"namespace electron {namespace api {class ApiName : public gin::DeprecatedWrappable<ApiName>  { public:  static gin::Handle<ApiName> Create(v8::Isolate* isolate);  // gin::Wrappable  static gin::DeprecatedWrapperInfo kWrapperInfo;  gin::ObjectTemplateBuilder GetObjectTemplateBuilder(      v8::Isolate* isolate) override;  const char* GetTypeName() override;} // namespace api} // namespace electron
```

Example 3 (cpp):
```cpp
#include "shell/browser/api/electron_api_safe_storage.h"#include "shell/browser/browser.h"#include "shell/common/gin_converters/base_converter.h"#include "shell/common/gin_converters/callback_converter.h"#include "shell/common/gin_helper/dictionary.h"#include "shell/common/gin_helper/object_template_builder.h"#include "shell/common/node_includes.h"#include "shell/common/platform_util.h"namespace electron {namespace api {gin::DeprecatedWrapperInfo ApiName::kWrapperInfo = {gin::kEmbedderNativeGin};gin::ObjectTemplateBuilder ApiName::GetObjectTemplateBuilder(    v8::Isolate* isolate) {  return gin::ObjectTemplateBuilder(isolate)      .SetMethod("methodName", &ApiName::methodName);}const char* ApiName::GetTypeName() {  return "ApiName";}// staticgin::Handle<ApiName> ApiName::Create(v8::Isolate* isolate) {  return gin::CreateHandle(isolate, new ApiName());}} // namespace api} // namespace electronnamespace {void Initialize(v8::Local<v8::Object> exports,                v8::Local<v8::Value> unused,                v8::Local<v8::Context> context,                void* priv) {  v8::Isolate* const isolate = v8::Isolate::GetCurrent();  gin_helper::Dictionary dict(isolate, exports);  dict.Set("apiName", electron::api::ApiName::Create(isolate));}}  // namespace
```

Example 4 (typescript):
```typescript
interface Process {    _linkedBinding(name: 'electron_browser_{api_name}'): Electron.ApiName;}
```

---

## pushNotifications

**URL:** https://www.electronjs.org/docs/latest/api/push-notifications

**Contents:**
- pushNotifications
- Events​
    - Event: 'received-apns-notification' macOS​
- Methods​
  - pushNotifications.registerForAPNSNotifications() macOS​
  - pushNotifications.unregisterForAPNSNotifications() macOS​

Register for and receive notifications from remote push notification services

For example, when registering for push notifications via Apple push notification services (APNS):

The pushNotification module emits the following events:

Emitted when the app receives a remote notification while running. See: https://developer.apple.com/documentation/appkit/nsapplicationdelegate/1428430-application?language=objc

The pushNotification module has the following methods:

Returns Promise<string>

Registers the app with Apple Push Notification service (APNS) to receive Badge, Sound, and Alert notifications. If registration is successful, the promise will be resolved with the APNS device token. Otherwise, the promise will be rejected with an error message. See: https://developer.apple.com/documentation/appkit/nsapplication/1428476-registerforremotenotificationtyp?language=objc

Unregisters the app from notifications received from APNS.

Apps unregistered through this method can always reregister.

See: https://developer.apple.com/documentation/appkit/nsapplication/1428747-unregisterforremotenotifications?language=objc

**Examples:**

Example 1 (javascript):
```javascript
const { pushNotifications, Notification } = require('electron')pushNotifications.registerForAPNSNotifications().then((token) => {  // forward token to your remote notification server})pushNotifications.on('received-apns-notification', (event, userInfo) => {  // generate a new Notification object with the relevant userInfo fields})
```

---

## Class: ServiceWorkers

**URL:** https://www.electronjs.org/docs/latest/api/service-workers

**Contents:**
- Class: ServiceWorkers
- Class: ServiceWorkers​
  - Instance Events​
    - Event: 'console-message'​
    - Event: 'registration-completed'​
    - Event: 'running-status-changed' Experimental​
  - Instance Methods​
    - serviceWorkers.getAllRunning()​
    - serviceWorkers.getInfoFromVersionID(versionId)​
    - serviceWorkers.getFromVersionID(versionId) Deprecated​

Query and receive events from a sessions active service workers.

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

Instances of the ServiceWorkers class are accessed by using serviceWorkers property of a Session.

The following events are available on instances of ServiceWorkers:

Emitted when a service worker logs something to the console.

Emitted when a service worker has been registered. Can occur after a call to navigator.serviceWorker.register('/sw.js') successfully resolves or when a Chrome extension is loaded.

Emitted when a service worker's running status has changed.

The following methods are available on instances of ServiceWorkers:

Returns Record<number, ServiceWorkerInfo> - A ServiceWorkerInfo object where the keys are the service worker version ID and the values are the information about that service worker.

Returns ServiceWorkerInfo - Information about this service worker

If the service worker does not exist or is not running this method will throw an exception.

Returns ServiceWorkerInfo - Information about this service worker

If the service worker does not exist or is not running this method will throw an exception.

Deprecated: Use the new serviceWorkers.getInfoFromVersionID API.

Returns ServiceWorkerMain | undefined - Instance of the service worker associated with the given version ID. If there's no associated version, or its running status has changed to 'stopped', this will return undefined.

Returns Promise<ServiceWorkerMain> - Resolves with the service worker when it's started.

Starts the service worker or does nothing if already running.

**Examples:**

Example 1 (javascript):
```javascript
const { session } = require('electron')// Get all service workers.console.log(session.defaultSession.serviceWorkers.getAllRunning())// Handle logs and get service worker infosession.defaultSession.serviceWorkers.on('console-message', (event, messageDetails) => {  console.log(    'Got service worker message',    messageDetails,    'from',    session.defaultSession.serviceWorkers.getFromVersionID(messageDetails.versionId)  )})
```

Example 2 (javascript):
```javascript
const { app, session } = require('electron')const { serviceWorkers } = session.defaultSession// Collect service workers scopesconst workerScopes = Object.values(serviceWorkers.getAllRunning()).map((info) => info.scope)app.on('browser-window-created', async (event, window) => {  for (const scope of workerScopes) {    try {      // Ensure worker is started      const serviceWorker = await serviceWorkers.startWorkerForScope(scope)      serviceWorker.send('window-created', { windowId: window.id })    } catch (error) {      console.error(`Failed to start service worker for ${scope}`)      console.error(error)    }  }})
```

---

## Electron Documentation Style Guide

**URL:** https://www.electronjs.org/docs/latest/development/style-guide

**Contents:**
- Electron Documentation Style Guide
- Headings​
- Markdown rules​
- Picking words​
- API references​
  - Title and description​
  - Module methods and events​
  - Classes​
  - Methods and their arguments​
    - Heading level​

These are the guidelines for writing Electron documentation.

Using Quick Start as example:

For API references, there are exceptions to this rule.

This repository uses the markdownlint package to enforce consistent Markdown styling. For the exact rules, see the .markdownlint.json file in the root folder.

There are a few style guidelines that aren't covered by the linter rules:

The following rules only apply to the documentation of APIs.

Each module's API doc must use the actual object name returned by require('electron') as its title (such as BrowserWindow, autoUpdater, and session).

Directly under the page title, add a one-line description of the module as a markdown quote (beginning with >).

Using the session module as an example:

For modules that are not classes, their methods and events must be listed under the ## Methods and ## Events chapters.

Using autoUpdater as an example:

Using the Session and Cookies classes as an example:

The methods chapter must be in the following form:

The heading can be ### or ####-levels depending on whether the method belongs to a module or a class.

For modules, the objectName is the module's name. For classes, it must be the name of the instance of the class, and must not be the same as the module's name.

For example, the methods of the Session class under the session module must use ses as the objectName.

Optional arguments are notated by square brackets [] surrounding the optional argument as well as the comma required if this optional argument follows another argument:

More detailed information on each of the arguments is noted in an unordered list below the method. The type of argument is notated by either JavaScript primitives (e.g. string, Promise, or Object), a custom API structure like Electron's Cookie, or the wildcard any.

If the argument is of type Array, use [] shorthand with the type of value inside the array (for example,any[] or string[]).

If the argument is of type Promise, parametrize the type with what the promise resolves to (for example, Promise<void> or Promise<string>).

If an argument can be of multiple types, separate the types with |.

The description for Function type arguments should make it clear how it may be called and list the types of the parameters that will be passed to it.

If an argument or a method is unique to certain platforms, those platforms are denoted using a space-delimited italicized list following the datatype. Values can be macOS, Windows or Linux.

The events chapter must be in following form:

The heading can be ### or ####-levels depending on whether the event belongs to a module or a class.

The arguments of an event follow the same rules as methods.

The properties chapter must be in following form:

The heading can be ### or ####-levels depending on whether the property belongs to a module or a class.

An "API History" block is a YAML code block encapsulated by an HTML comment that should be placed directly after the Markdown header for a class or method, like so:

It should adhere to the API History JSON Schema (api-history.schema.json) which you can find in the docs folder. The API History Schema RFC includes example usage and detailed explanations for each aspect of the schema.

The purpose of the API History block is to describe when/where/how/why an API was:

Each API change listed in the block should include a link to the PR where that change was made along with an optional short description of the change. If applicable, include the heading id for that change from the breaking changes documentation.

The API History linting script (lint:api-history) validates API History blocks in the Electron documentation against the schema and performs some other checks. You can look at its tests for more details.

There are a few style guidelines that aren't covered by the linting script:

Always adhere to this format:

Generally, you should place the API History block directly after the Markdown header for a class or method that was changed. However, there are some instances where this is ambiguous:

Sometimes a breaking change doesn't relate to any of the existing APIs. In this case, it is ok not to add API History anywhere.

Sometimes a breaking change involves multiple APIs. In this case, place the API History block under the top-level Markdown header for each of the involved APIs.

Notice how an API History block wasn't added under:

since that function wasn't changed, only how it may be used:

**Examples:**

Example 1 (markdown):
```markdown
# Quick Start...## Main process...## Renderer process...## Run your app...### Run as a distribution...### Manually downloaded Electron binary...
```

Example 2 (markdown):
```markdown
# session> Manage browser sessions, cookies, cache, proxy settings, etc.
```

Example 3 (markdown):
```markdown
# autoUpdater## Events### Event: 'error'## Methods### `autoUpdater.setFeedURL(url[, requestHeaders])`
```

Example 4 (markdown):
```markdown
# session## Methods### session.fromPartition(partition)## Static Properties### session.defaultSession## Class: Session### Instance Events#### Event: 'will-download'### Instance Methods#### `ses.getCacheSize()`### Instance Properties#### `ses.cookies`## Class: Cookies### Instance Methods#### `cookies.get(filter, callback)`
```

---

## WindowSessionEndEvent Object extends Event

**URL:** https://www.electronjs.org/docs/latest/api/structures/window-session-end-event

**Contents:**
- WindowSessionEndEvent Object extends Event

Unfortunately, Windows does not offer a way to differentiate between a shutdown and a reboot, meaning the 'shutdown' reason is triggered in both scenarios. For more details on the WM_ENDSESSION message and its associated reasons, refer to the MSDN documentation.

---

## Class: DownloadItem

**URL:** https://www.electronjs.org/docs/latest/api/download-item

**Contents:**
- Class: DownloadItem
- Class: DownloadItem​
  - Instance Events​
    - Event: 'updated'​
    - Event: 'done'​
  - Instance Methods​
    - downloadItem.setSavePath(path)​
    - downloadItem.getSavePath()​
    - downloadItem.setSaveDialogOptions(options)​
    - downloadItem.getSaveDialogOptions()​

Control file downloads from remote sources.

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

DownloadItem is an EventEmitter that represents a download item in Electron. It is used in will-download event of Session class, and allows users to control the download item.

Emitted when the download has been updated and is not done.

The state can be one of following:

Emitted when the download is in a terminal state. This includes a completed download, a cancelled download (via downloadItem.cancel()), and interrupted download that can't be resumed.

The state can be one of following:

The downloadItem object has the following methods:

The API is only available in session's will-download callback function. If path doesn't exist, Electron will try to make the directory recursively. If user doesn't set the save path via the API, Electron will use the original routine to determine the save path; this usually prompts a save dialog.

Returns string - The save path of the download item. This will be either the path set via downloadItem.setSavePath(path) or the path selected from the shown save dialog.

This API allows the user to set custom options for the save dialog that opens for the download item by default. The API is only available in session's will-download callback function.

Returns SaveDialogOptions - Returns the object previously set by downloadItem.setSaveDialogOptions(options).

Returns boolean - Whether the download is paused.

Resumes the download that has been paused.

To enable resumable downloads the server you are downloading from must support range requests and provide both Last-Modified and ETag header values. Otherwise resume() will dismiss previously received bytes and restart the download from the beginning.

Returns boolean - Whether the download can resume.

Cancels the download operation.

Returns string - The origin URL where the item is downloaded from.

Returns string - The files mime type.

Returns boolean - Whether the download has user gesture.

Returns string - The file name of the download item.

The file name is not always the same as the actual one saved in local disk. If user changes the file name in a prompted download saving dialog, the actual name of saved file will be different.

Returns Integer - The current download speed in bytes per second.

Returns Integer - The total size in bytes of the download item.

If the size is unknown, it returns 0.

Returns Integer - The received bytes of the download item.

Returns Integer - The download completion in percent.

Returns string - The Content-Disposition field from the response header.

Returns string - The current state. Can be progressing, completed, cancelled or interrupted.

The following methods are useful specifically to resume a cancelled item when session is restarted.

Returns string[] - The complete URL chain of the item including any redirects.

Returns string - Last-Modified header value.

Returns string - ETag header value.

Returns Double - Number of seconds since the UNIX epoch when the download was started.

Returns Double - Number of seconds since the UNIX epoch when the download ended.

A string property that determines the save file path of the download item.

The property is only available in session's will-download callback function. If user doesn't set the save path via the property, Electron will use the original routine to determine the save path; this usually prompts a save dialog.

**Examples:**

Example 1 (javascript):
```javascript
// In the main process.const { BrowserWindow } = require('electron')const win = new BrowserWindow()win.webContents.session.on('will-download', (event, item, webContents) => {  // Set the save path, making Electron not to prompt a save dialog.  item.setSavePath('/tmp/save.pdf')  item.on('updated', (event, state) => {    if (state === 'interrupted') {      console.log('Download is interrupted but can be resumed')    } else if (state === 'progressing') {      if (item.isPaused()) {        console.log('Download is paused')      } else {        console.log(`Received bytes: ${item.getReceivedBytes()}`)      }    }  })  item.once('done', (event, state) => {    if (state === 'completed') {      console.log('Download successfully')    } else {      console.log(`Download failed: ${state}`)    }  })})
```

---

## ShareMenu

**URL:** https://www.electronjs.org/docs/latest/api/share-menu

**Contents:**
- ShareMenu
- Class: ShareMenu​
  - new ShareMenu(sharingItem)​
  - Instance Methods​
    - shareMenu.popup([options])​
    - shareMenu.closePopup([browserWindow])​

The ShareMenu class creates Share Menu on macOS, which can be used to share information from the current context to apps, social media accounts, and other services.

For including the share menu as a submenu of other menus, please use the shareMenu role of MenuItem.

Create share menu on macOS.

Electron's built-in classes cannot be subclassed in user code. For more information, see the FAQ.

Creates a new share menu.

The shareMenu object has the following instance methods:

Pops up this menu as a context menu in the BrowserWindow.

Closes the context menu in the browserWindow.

---

## dialog

**URL:** https://www.electronjs.org/docs/latest/api/dialog

**Contents:**
- dialog
- Methods​
  - dialog.showOpenDialogSync([window, ]options)​
  - dialog.showOpenDialog([window, ]options)​
  - dialog.showSaveDialogSync([window, ]options)​
  - dialog.showSaveDialog([window, ]options)​
  - dialog.showMessageBoxSync([window, ]options)​
  - dialog.showMessageBox([window, ]options)​
  - dialog.showErrorBox(title, content)​
  - dialog.showCertificateTrustDialog([window, ]options) macOS Windows​

Display native system dialogs for opening and saving files, alerting, etc.

An example of showing a dialog to select multiple files:

The dialog module has the following methods:

Returns string[] | undefined, the file paths chosen by the user; if the dialog is cancelled it returns undefined.

The window argument allows the dialog to attach itself to a parent window, making it modal.

The filters specifies an array of file types that can be displayed or selected when you want to limit the user to a specific type. For example:

The extensions array should contain extensions without wildcards or dots (e.g. 'png' is good but '.png' and '*.png' are bad). To show all files, use the '*' wildcard (no other wildcard is supported).

On Windows and Linux an open dialog can not be both a file selector and a directory selector, so if you set properties to ['openFile', 'openDirectory'] on these platforms, a directory selector will be shown.

On Linux defaultPath is not supported when using portal file chooser dialogs unless the portal backend is version 4 or higher. You can use --xdg-portal-required-version command-line switch to force gtk or kde dialogs.

Returns Promise<Object> - Resolve with an object containing the following:

The window argument allows the dialog to attach itself to a parent window, making it modal.

The filters specifies an array of file types that can be displayed or selected when you want to limit the user to a specific type. For example:

The extensions array should contain extensions without wildcards or dots (e.g. 'png' is good but '.png' and '*.png' are bad). To show all files, use the '*' wildcard (no other wildcard is supported).

On Windows and Linux an open dialog can not be both a file selector and a directory selector, so if you set properties to ['openFile', 'openDirectory'] on these platforms, a directory selector will be shown.

On Linux defaultPath is not supported when using portal file chooser dialogs unless the portal backend is version 4 or higher. You can use --xdg-portal-required-version command-line switch to force gtk or kde dialogs.

Returns string, the path of the file chosen by the user; if the dialog is cancelled it returns an empty string.

The window argument allows the dialog to attach itself to a parent window, making it modal.

The filters specifies an array of file types that can be displayed, see dialog.showOpenDialog for an example.

Returns Promise<Object> - Resolve with an object containing the following:

The window argument allows the dialog to attach itself to a parent window, making it modal.

The filters specifies an array of file types that can be displayed, see dialog.showOpenDialog for an example.

On macOS, using the asynchronous version is recommended to avoid issues when expanding and collapsing the dialog.

Returns Integer - the index of the clicked button.

Shows a message box, it will block the process until the message box is closed. It returns the index of the clicked button.

The window argument allows the dialog to attach itself to a parent window, making it modal. If window is not shown dialog will not be attached to it. In such case it will be displayed as an independent window.

Returns Promise<Object> - resolves with a promise containing the following properties:

The window argument allows the dialog to attach itself to a parent window, making it modal.

Displays a modal dialog that shows an error message.

This API can be called safely before the ready event the app module emits, it is usually used to report errors in early stage of startup. If called before the app readyevent on Linux, the message will be emitted to stderr, and no GUI dialog will appear.

Returns Promise<void> - resolves when the certificate trust dialog is shown.

On macOS, this displays a modal dialog that shows a message and certificate information, and gives the user the option of trusting/importing the certificate. If you provide a window argument the dialog will be attached to the parent window, making it modal.

On Windows the options are more limited, due to the Win32 APIs used:

showOpenDialog and showSaveDialog resolve to an object with a bookmarks field. This field is an array of Base64 encoded strings that contain the security scoped bookmark data for the saved file. The securityScopedBookmarks option must be enabled for this to be present.

On macOS, dialogs are presented as sheets attached to a window if you provide a BaseWindow reference in the window parameter, or modals if no window is provided.

You can call BaseWindow.getCurrentWindow().setSheetOffset(offset) to change the offset from the window frame where sheets are attached.

**Examples:**

Example 1 (javascript):
```javascript
const { dialog } = require('electron')console.log(dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }))
```

Example 2 (json):
```json
{  filters: [    { name: 'Images', extensions: ['jpg', 'png', 'gif'] },    { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },    { name: 'Custom File Type', extensions: ['as'] },    { name: 'All Files', extensions: ['*'] }  ]}
```

Example 3 (css):
```css
dialog.showOpenDialogSync(mainWindow, {  properties: ['openFile', 'openDirectory']})
```

Example 4 (json):
```json
{  filters: [    { name: 'Images', extensions: ['jpg', 'png', 'gif'] },    { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },    { name: 'Custom File Type', extensions: ['as'] },    { name: 'All Files', extensions: ['*'] }  ]}
```

---

## desktopCapturer

**URL:** https://www.electronjs.org/docs/latest/api/desktop-capturer

**Contents:**
- desktopCapturer
- Methods​
  - desktopCapturer.getSources(options)​
- Caveats​

Access information about media sources that can be used to capture audio and video from the desktop using the navigator.mediaDevices.getUserMedia API.

The following example shows how to capture video from a desktop window whose title is Electron:

See navigator.mediaDevices.getDisplayMedia for more information.

navigator.mediaDevices.getDisplayMedia does not permit the use of deviceId for selection of a source - see specification.

The desktopCapturer module has the following methods:

Returns Promise<DesktopCapturerSource[]> - Resolves with an array of DesktopCapturerSource objects, each DesktopCapturerSource represents a screen or an individual window that can be captured.

Capturing the screen contents requires user consent on macOS 10.15 Catalina or higher, which can detected by systemPreferences.getMediaAccessStatus.

desktopCapturer.getSources(options) only returns a single source on Linux when using Pipewire.

PipeWire supports a single capture for both screens and windows. If you request the window and screen type, the selected source will be returned as a window capture.

navigator.mediaDevices.getUserMedia does not work on macOS for audio capture due to a fundamental limitation whereby apps that want to access the system's audio require a signed kernel extension. Chromium, and by extension Electron, does not provide this.

It is possible to circumvent this limitation by capturing system audio with another macOS app like Soundflower and passing it through a virtual audio input device. This virtual device can then be queried with navigator.mediaDevices.getUserMedia.

**Examples:**

Example 1 (javascript):
```javascript
// main.jsconst { app, BrowserWindow, desktopCapturer, session } = require('electron')app.whenReady().then(() => {  const mainWindow = new BrowserWindow()  session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {    desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {      // Grant access to the first screen found.      callback({ video: sources[0], audio: 'loopback' })    })    // If true, use the system picker if available.    // Note: this is currently experimental. If the system picker    // is available, it will be used and the media request handler    // will not be invoked.  }, { useSystemPicker: true })  mainWindow.loadFile('index.html')})
```

Example 2 (javascript):
```javascript
// renderer.jsconst startButton = document.getElementById('startButton')const stopButton = document.getElementById('stopButton')const video = document.querySelector('video')startButton.addEventListener('click', () => {  navigator.mediaDevices.getDisplayMedia({    audio: true,    video: {      width: 320,      height: 240,      frameRate: 30    }  }).then(stream => {    video.srcObject = stream    video.onloadedmetadata = (e) => video.play()  }).catch(e => console.log(e))})stopButton.addEventListener('click', () => {  video.pause()})
```

Example 3 (html):
```html
<!-- index.html --><html><meta http-equiv="content-security-policy" content="script-src 'self' 'unsafe-inline'" />  <body>    <button id="startButton" class="button">Start</button>    <button id="stopButton" class="button">Stop</button>    <video width="320" height="240" autoplay></video>    <script src="renderer.js"></script>  </body></html>
```

---

## Menu

**URL:** https://www.electronjs.org/docs/latest/api/menu

**Contents:**
- Menu
- Class: Menu​
  - new Menu()​
  - Static Methods​
    - Menu.setApplicationMenu(menu)​
    - Menu.getApplicationMenu()​
    - Menu.sendActionToFirstResponder(action) macOS​
    - Menu.buildFromTemplate(template)​
  - Instance Methods​
    - menu.popup([options])​

Create native application menus and context menus.

See also: A detailed guide about how to implement menus in your application.

Electron's built-in classes cannot be subclassed in user code. For more information, see the FAQ.

The Menu class has the following static methods:

Sets menu as the application menu on macOS. On Windows and Linux, the menu will be set as each window's top menu.

Also on Windows and Linux, you can use a & in the top-level item name to indicate which letter should get a generated accelerator. For example, using &File for the file menu would result in a generated Alt-F accelerator that opens the associated menu. The indicated character in the button label then gets an underline, and the & character is not displayed on the button label.

In order to escape the & character in an item name, add a proceeding &. For example, &&File would result in &File displayed on the button label.

Passing null will suppress the default menu. On Windows and Linux, this has the additional effect of removing the menu bar from the window.

The default menu will be created automatically if the app does not set one. It contains standard items such as File, Edit, View, Window and Help.

Returns Menu | null - The application menu, if set, or null, if not set.

The returned Menu instance doesn't support dynamic addition or removal of menu items. Instance properties can still be dynamically modified.

Sends the action to the first responder of application. This is used for emulating default macOS menu behaviors. Usually you would use the role property of a MenuItem.

See the macOS Cocoa Event Handling Guide for more information on macOS' native actions.

Generally, the template is an array of options for constructing a MenuItem. The usage can be referenced above.

You can also attach other fields to the element of the template and they will become properties of the constructed menu items.

The menu object has the following instance methods:

Pops up this menu as a context menu in the BaseWindow.

For more details, see the Context Menu guide.

Closes the context menu in the window.

Appends the menuItem to the menu.

Returns MenuItem | null the item with the specified id

Inserts the menuItem to the pos position of the menu.

Objects created with new Menu or returned by Menu.buildFromTemplate emit the following events:

Some events are only available on specific operating systems and are labeled as such.

Emitted when menu.popup() is called.

Emitted when a popup is closed either manually or with menu.closePopup().

menu objects also have the following properties:

A MenuItem[] array containing the menu's items.

Each Menu consists of multiple MenuItem instances and each MenuItem can nest a Menu into its submenu property.

---

## ColorSpace Object

**URL:** https://www.electronjs.org/docs/latest/api/structures/color-space

**Contents:**
- ColorSpace Object
- Common ColorSpace definitions​
  - Standard Color Spaces​
  - HDR Color Spaces​
  - Video Color Spaces​

primaries string - The color primaries of the color space. Can be one of the following values:

transfer string - The transfer function of the color space. Can be one of the following values:

matrix string - The color matrix of the color space. Can be one of the following values:

range string - The color range of the color space. Can be one of the following values:

Extended sRGB (extends sRGB to all real values):

scRGB Linear (linear transfer function for all real values):

scRGB Linear 80 Nits (with an SDR white level of 80 nits):

HDR10 (BT.2020 primaries with PQ transfer function):

HLG (BT.2020 primaries with HLG transfer function):

JPEG (typical color space for JPEG images):

**Examples:**

Example 1 (css):
```css
const cs = {  primaries: 'bt709',  transfer: 'srgb',  matrix: 'rgb',  range: 'full'}
```

Example 2 (css):
```css
const cs = {  primaries: 'p3',  transfer: 'srgb',  matrix: 'rgb',  range: 'full'}
```

Example 3 (css):
```css
const cs = {  primaries: 'xyz-d50',  transfer: 'linear',  matrix: 'rgb',  range: 'full'}
```

Example 4 (css):
```css
const cs = {  primaries: 'bt709',  transfer: 'srgb-hdr',  matrix: 'rgb',  range: 'full'}
```

---

## Class: Extensions

**URL:** https://www.electronjs.org/docs/latest/api/extensions-api

**Contents:**
- Class: Extensions
- Class: Extensions​
  - Instance Events​
    - Event: 'extension-loaded'​
    - Event: 'extension-unloaded'​
    - Event: 'extension-ready'​
  - Instance Methods​
    - extensions.loadExtension(path[, options])​
    - extensions.removeExtension(extensionId)​
    - extensions.getExtension(extensionId)​

Load and interact with extensions.

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

Instances of the Extensions class are accessed by using extensions property of a Session.

The following events are available on instances of Extensions:

Emitted after an extension is loaded. This occurs whenever an extension is added to the "enabled" set of extensions. This includes:

Emitted after an extension is unloaded. This occurs when Session.removeExtension is called.

Emitted after an extension is loaded and all necessary browser state is initialized to support the start of the extension's background page.

The following methods are available on instances of Extensions:

Returns Promise<Extension> - resolves when the extension is loaded.

This method will raise an exception if the extension could not be loaded. If there are warnings when installing the extension (e.g. if the extension requests an API that Electron does not support) then they will be logged to the console.

Note that Electron does not support the full range of Chrome extensions APIs. See Supported Extensions APIs for more details on what is supported.

Note that in previous versions of Electron, extensions that were loaded would be remembered for future runs of the application. This is no longer the case: loadExtension must be called on every boot of your app if you want the extension to be loaded.

This API does not support loading packed (.crx) extensions.

This API cannot be called before the ready event of the app module is emitted.

Loading extensions into in-memory (non-persistent) sessions is not supported and will throw an error.

Unloads an extension.

This API cannot be called before the ready event of the app module is emitted.

Returns Extension | null - The loaded extension with the given ID.

This API cannot be called before the ready event of the app module is emitted.

Returns Extension[] - A list of all loaded extensions.

This API cannot be called before the ready event of the app module is emitted.

**Examples:**

Example 1 (javascript):
```javascript
const { app, session } = require('electron')const path = require('node:path')app.whenReady().then(async () => {  await session.defaultSession.extensions.loadExtension(    path.join(__dirname, 'react-devtools'),    // allowFileAccess is required to load the devtools extension on file:// URLs.    { allowFileAccess: true }  )  // Note that in order to use the React DevTools extension, you'll need to  // download and unzip a copy of the extension.})
```

---

## net

**URL:** https://www.electronjs.org/docs/latest/api/net

**Contents:**
- net
- Methods​
  - net.request(options)​
  - net.fetch(input[, init])​
  - net.isOnline()​
  - net.resolveHost(host, [options])​
- Properties​
  - net.online Readonly​

Issue HTTP/HTTPS requests using Chromium's native networking library

Process: Main, Utility

The net module is a client-side API for issuing HTTP(S) requests. It is similar to the HTTP and HTTPS modules of Node.js but uses Chromium's native networking library instead of the Node.js implementation, offering better support for web proxies. It also supports checking network status.

The following is a non-exhaustive list of why you may consider using the net module instead of the native Node.js modules:

The API components (including classes, methods, properties and event names) are similar to those used in Node.js.

The net API can be used only after the application emits the ready event. Trying to use the module before the ready event will throw an error.

The net module has the following methods:

Returns ClientRequest

Creates a ClientRequest instance using the provided options which are directly forwarded to the ClientRequest constructor. The net.request method would be used to issue both secure and insecure HTTP requests according to the specified protocol scheme in the options object.

Returns Promise<GlobalResponse> - see Response.

Sends a request, similarly to how fetch() works in the renderer, using Chrome's network stack. This differs from Node's fetch(), which uses Node.js's HTTP stack.

This method will issue requests from the default session. To send a fetch request from another session, use ses.fetch().

See the MDN documentation for fetch() for more details.

By default, requests made with net.fetch can be made to custom protocols as well as file:, and will trigger webRequest handlers if present. When the non-standard bypassCustomProtocolHandlers option is set in RequestInit, custom protocol handlers will not be called for this request. This allows forwarding an intercepted request to the built-in handler. webRequest handlers will still be triggered when bypassing custom protocols.

In the utility process, custom protocols are not supported.

Returns boolean - Whether there is currently internet connection.

A return value of false is a pretty strong indicator that the user won't be able to connect to remote sites. However, a return value of true is inconclusive; even if some link is up, it is uncertain whether a particular connection attempt to a particular remote site will be successful.

Returns Promise<ResolvedHost> - Resolves with the resolved IP addresses for the host.

This method will resolve hosts from the default session. To resolve a host from another session, use ses.resolveHost().

A boolean property. Whether there is currently internet connection.

A return value of false is a pretty strong indicator that the user won't be able to connect to remote sites. However, a return value of true is inconclusive; even if some link is up, it is uncertain whether a particular connection attempt to a particular remote site will be successful.

**Examples:**

Example 1 (javascript):
```javascript
const { app } = require('electron')app.whenReady().then(() => {  const { net } = require('electron')  const request = net.request('https://github.com')  request.on('response', (response) => {    console.log(`STATUS: ${response.statusCode}`)    console.log(`HEADERS: ${JSON.stringify(response.headers)}`)    response.on('data', (chunk) => {      console.log(`BODY: ${chunk}`)    })    response.on('end', () => {      console.log('No more data in response.')    })  })  request.end()})
```

Example 2 (javascript):
```javascript
async function example () {  const response = await net.fetch('https://my.app')  if (response.ok) {    const body = await response.json()    // ... use the result.  }}
```

Example 3 (typescript):
```typescript
protocol.handle('https', (req) => {  if (req.url === 'https://my-app.com') {    return new Response('<body>my app</body>')  } else {    return net.fetch(req, { bypassCustomProtocolHandlers: true })  }})
```

---

## autoUpdater

**URL:** https://www.electronjs.org/docs/latest/api/auto-updater

**Contents:**
- autoUpdater
- Platform Notices​
  - macOS​
  - Windows​
- Events​
  - Event: 'error'​
  - Event: 'checking-for-update'​
  - Event: 'update-available'​
  - Event: 'update-not-available'​
  - Event: 'update-downloaded'​

Enable apps to automatically update themselves.

See also: A detailed guide about how to implement updates in your application.

autoUpdater is an EventEmitter.

Currently, only macOS and Windows are supported. There is no built-in support for auto-updater on Linux, so it is recommended to use the distribution's package manager to update your app.

In addition, there are some subtle differences on each platform:

On macOS, the autoUpdater module is built upon Squirrel.Mac, meaning you don't need any special setup to make it work. For server-side requirements, you can read Server Support. Note that App Transport Security (ATS) applies to all requests made as part of the update process. Apps that need to disable ATS can add the NSAllowsArbitraryLoads key to their app's plist.

Your application must be signed for automatic updates on macOS. This is a requirement of Squirrel.Mac.

On Windows, you have to install your app into a user's machine before you can use the autoUpdater, so it is recommended that you use electron-winstaller or Electron Forge's Squirrel.Windows maker to generate a Windows installer.

Apps built with Squirrel.Windows will trigger custom launch events that must be handled by your Electron application to ensure proper setup and teardown.

Squirrel.Windows apps will launch with the --squirrel-firstrun argument immediately after installation. During this time, Squirrel.Windows will obtain a file lock on your app, and autoUpdater requests will fail until the lock is released. In practice, this means that you won't be able to check for updates on first launch for the first few seconds. You can work around this by not checking for updates when process.argv contains the --squirrel-firstrun flag or by setting a 10-second timeout on your update checks (see electron/electron#7155 for more information).

The installer generated with Squirrel.Windows will create a shortcut icon with an Application User Model ID in the format of com.squirrel.PACKAGE_ID.YOUR_EXE_WITHOUT_DOT_EXE, examples are com.squirrel.slack.Slack and com.squirrel.code.Code. You have to use the same ID for your app with app.setAppUserModelId API, otherwise Windows will not be able to pin your app properly in task bar.

The autoUpdater object emits the following events:

Emitted when there is an error while updating.

Emitted when checking for an available update has started.

Emitted when there is an available update. The update is downloaded automatically.

Emitted when there is no available update.

Emitted when an update has been downloaded.

On Windows only releaseName is available.

It is not strictly necessary to handle this event. A successfully downloaded update will still be applied the next time the application starts.

This event is emitted after a user calls quitAndInstall().

When this API is called, the before-quit event is not emitted before all windows are closed. As a result you should listen to this event if you wish to perform actions before the windows are closed while a process is quitting, as well as listening to before-quit.

The autoUpdater object has the following methods:

Sets the url and initialize the auto updater.

Returns string - The current update feed URL.

Asks the server whether there is an update. You must call setFeedURL before using this API.

If an update is available it will be downloaded automatically. Calling autoUpdater.checkForUpdates() twice will download the update two times.

Restarts the app and installs the update after it has been downloaded. It should only be called after update-downloaded has been emitted.

Under the hood calling autoUpdater.quitAndInstall() will close all application windows first, and automatically call app.quit() after all windows have been closed.

It is not strictly necessary to call this function to apply an update, as a successfully downloaded update will always be applied the next time the application starts.

---

## systemPreferences

**URL:** https://www.electronjs.org/docs/latest/api/system-preferences

**Contents:**
- systemPreferences
- Events​
  - Event: 'accent-color-changed' Windows Linux​
  - Event: 'color-changed' Windows​
- Methods​
  - systemPreferences.isSwipeTrackingFromScrollEventsEnabled() macOS​
  - systemPreferences.postNotification(event, userInfo[, deliverImmediately]) macOS​
  - systemPreferences.postLocalNotification(event, userInfo) macOS​
  - systemPreferences.postWorkspaceNotification(event, userInfo) macOS​
  - systemPreferences.subscribeNotification(event, callback) macOS​

Get system preferences.

Process: Main, Utility

The systemPreferences object emits the following events:

Returns boolean - Whether the Swipe between pages setting is on.

Posts event as native notifications of macOS. The userInfo is an Object that contains the user information dictionary sent along with the notification.

Posts event as native notifications of macOS. The userInfo is an Object that contains the user information dictionary sent along with the notification.

Posts event as native notifications of macOS. The userInfo is an Object that contains the user information dictionary sent along with the notification.

Returns number - The ID of this subscription

Subscribes to native notifications of macOS, callback will be called with callback(event, userInfo) when the corresponding event happens. The userInfo is an Object that contains the user information dictionary sent along with the notification. The object is the sender of the notification, and only supports NSString values for now.

The id of the subscriber is returned, which can be used to unsubscribe the event.

Under the hood this API subscribes to NSDistributedNotificationCenter, example values of event are:

If event is null, the NSDistributedNotificationCenter doesn’t use it as criteria for delivery to the observer. See docs for more information.

Returns number - The ID of this subscription

Same as subscribeNotification, but uses NSNotificationCenter for local defaults. This is necessary for events such as NSUserDefaultsDidChangeNotification.

If event is null, the NSNotificationCenter doesn’t use it as criteria for delivery to the observer. See docs for more information.

Returns number - The ID of this subscription

Same as subscribeNotification, but uses NSWorkspace.sharedWorkspace.notificationCenter. This is necessary for events such as NSWorkspaceDidActivateApplicationNotification.

If event is null, the NSWorkspaceNotificationCenter doesn’t use it as criteria for delivery to the observer. See docs for more information.

Removes the subscriber with id.

Same as unsubscribeNotification, but removes the subscriber from NSNotificationCenter.

Same as unsubscribeNotification, but removes the subscriber from NSWorkspace.sharedWorkspace.notificationCenter.

Add the specified defaults to your application's NSUserDefaults.

Returns UserDefaultTypes[Type] - The value of key in NSUserDefaults.

Some popular key and types are:

Set the value of key in NSUserDefaults.

Note that type should match actual type of value. An exception is thrown if they don't.

Some popular key and types are:

Removes the key in NSUserDefaults. This can be used to restore the default or global value of a key previously set with setUserDefault.

Returns string - The users current system wide accent color preference in RGBA hexadecimal form.

This API is only available on macOS 10.14 Mojave or newer.

Returns string - The system color setting in RGBA hexadecimal form (#RRGGBBAA). See the Windows docs and the macOS docs for more details.

The following colors are only available on macOS 10.14: find-highlight, selected-content-background, separator, unemphasized-selected-content-background, unemphasized-selected-text-background, and unemphasized-selected-text.

Returns string - The standard system color formatted as #RRGGBBAA.

Returns one of several standard system colors that automatically adapt to vibrancy and changes in accessibility settings like 'Increase contrast' and 'Reduce transparency'. See Apple Documentation for more details.

Returns string - Can be dark, light or unknown.

Gets the macOS appearance setting that is currently applied to your application, maps to NSApplication.effectiveAppearance

Returns boolean - whether or not this device has the ability to use Touch ID.

Returns Promise<void> - resolves if the user has successfully authenticated with Touch ID.

This API itself will not protect your user data; rather, it is a mechanism to allow you to do so. Native apps will need to set Access Control Constants like kSecAccessControlUserPresence on their keychain entry so that reading it would auto-prompt for Touch ID biometric consent. This could be done with node-keytar, such that one would store an encryption key with node-keytar and only fetch it if promptTouchID() resolves.

Returns boolean - true if the current process is a trusted accessibility client and false if it is not.

Returns string - Can be not-determined, granted, denied, restricted or unknown.

This user consent was not required on macOS 10.13 High Sierra so this method will always return granted. macOS 10.14 Mojave or higher requires consent for microphone and camera access. macOS 10.15 Catalina or higher requires consent for screen access.

Windows 10 has a global setting controlling microphone and camera access for all win32 applications. It will always return granted for screen and for all media types on older versions of Windows.

Returns Promise<boolean> - A promise that resolves with true if consent was granted and false if it was denied. If an invalid mediaType is passed, the promise will be rejected. If an access request was denied and later is changed through the System Preferences pane, a restart of the app will be required for the new permissions to take effect. If access has already been requested and denied, it must be changed through the preference pane; an alert will not pop up and the promise will resolve with the existing access status.

Important: In order to properly leverage this API, you must set the NSMicrophoneUsageDescription and NSCameraUsageDescription strings in your app's Info.plist file. The values for these keys will be used to populate the permission dialogs so that the user will be properly informed as to the purpose of the permission request. See Electron Application Distribution for more information about how to set these in the context of Electron.

This user consent was not required until macOS 10.14 Mojave, so this method will always return true if your system is running 10.13 High Sierra.

Returns an object with system animation settings.

A boolean property which determines whether the app avoids using semitransparent backgrounds. This maps to NSWorkspace.accessibilityDisplayShouldReduceTransparency

Deprecated: Use the new nativeTheme.prefersReducedTransparency API.

A string property that can be dark, light or unknown.

Returns the macOS appearance setting that is currently applied to your application, maps to NSApplication.effectiveAppearance

**Examples:**

Example 1 (javascript):
```javascript
const { systemPreferences } = require('electron')console.log(systemPreferences.getEffectiveAppearance())
```

Example 2 (javascript):
```javascript
const color = systemPreferences.getAccentColor() // `"aabbccdd"`const red = color.substr(0, 2) // "aa"const green = color.substr(2, 2) // "bb"const blue = color.substr(4, 2) // "cc"const alpha = color.substr(6, 2) // "dd"
```

Example 3 (javascript):
```javascript
const { systemPreferences } = require('electron')systemPreferences.promptTouchID('To get consent for a Security-Gated Thing').then(success => {  console.log('You have successfully authenticated with Touch ID!')}).catch(err => {  console.log(err)})
```

---

## webContents

**URL:** https://www.electronjs.org/docs/latest/api/web-contents

**Contents:**
- webContents
- Navigation Events​
  - Document Navigations​
  - In-page Navigation​
  - Frame Navigation​
- Methods​
  - webContents.getAllWebContents()​
  - webContents.getFocusedWebContents()​
  - webContents.fromId(id)​
  - webContents.fromFrame(frame)​

Render and control web pages.

webContents is an EventEmitter. It is responsible for rendering and controlling a web page and is a property of the BrowserWindow object. An example of accessing the webContents object:

Several events can be used to monitor navigations as they occur within a webContents.

When a webContents navigates to another page (as opposed to an in-page navigation), the following events will be fired.

Subsequent events will not fire if event.preventDefault() is called on any of the cancellable events.

In-page navigations don't cause the page to reload, but instead navigate to a location within the current page. These events are not cancellable. For an in-page navigations, the following events will fire in this order:

The will-navigate and did-navigate events only fire when the mainFrame navigates. If you want to also observe navigations in <iframe>s, use will-frame-navigate and did-frame-navigate events.

These methods can be accessed from the webContents module:

Returns WebContents[] - An array of all WebContents instances. This will contain web contents for all windows, webviews, opened devtools, and devtools extension background pages.

Returns WebContents | null - The web contents that is focused in this application, otherwise returns null.

Returns WebContents | undefined - A WebContents instance with the given ID, or undefined if there is no WebContents associated with the given ID.

Returns WebContents | undefined - A WebContents instance with the given WebFrameMain, or undefined if there is no WebContents associated with the given WebFrameMain.

Returns WebContents | undefined - A WebContents instance with the given TargetID, or undefined if there is no WebContents associated with the given TargetID.

When communicating with the Chrome DevTools Protocol, it can be useful to lookup a WebContents instance based on its assigned TargetID.

Render and control the contents of a BrowserWindow instance.

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

Emitted when the navigation is done, i.e. the spinner of the tab has stopped spinning, and the onload event was dispatched.

This event is like did-finish-load but emitted when the load failed. The full list of error codes and their meaning is available here.

This event is like did-fail-load but emitted when the load was cancelled (e.g. window.stop() was invoked).

Emitted when a frame has done navigation.

Corresponds to the points in time when the spinner of the tab started spinning.

Corresponds to the points in time when the spinner of the tab stopped spinning.

Emitted when the document in the top-level frame is loaded.

Fired when page title is set during navigation. explicitSet is false when title is synthesized from file url.

Emitted when page receives favicon urls.

Emitted when the page calls window.moveTo, window.resizeTo or related APIs.

By default, this will move the window. To prevent that behavior, call event.preventDefault().

Emitted after successful creation of a window via window.open in the renderer. Not emitted if the creation of the window is canceled from webContents.setWindowOpenHandler.

See window.open() for more details and how to use this in conjunction with webContents.setWindowOpenHandler.

Emitted when a user or the page wants to start navigation on the main frame. It can happen when the window.location object is changed or a user clicks a link in the page.

This event will not emit when the navigation is started programmatically with APIs like webContents.loadURL and webContents.back.

It is also not emitted for in-page navigations, such as clicking anchor links or updating the window.location.hash. Use did-navigate-in-page event for this purpose.

Calling event.preventDefault() will prevent the navigation.

Emitted when a user or the page wants to start navigation in any frame. It can happen when the window.location object is changed or a user clicks a link in the page.

Unlike will-navigate, will-frame-navigate is fired when the main frame or any of its subframes attempts to navigate. When the navigation event comes from the main frame, isMainFrame will be true.

This event will not emit when the navigation is started programmatically with APIs like webContents.loadURL and webContents.back.

It is also not emitted for in-page navigations, such as clicking anchor links or updating the window.location.hash. Use did-navigate-in-page event for this purpose.

Calling event.preventDefault() will prevent the navigation.

Emitted when any frame (including main) starts navigating.

Emitted when a server side redirect occurs during navigation. For example a 302 redirect.

This event will be emitted after did-start-navigation and always before the did-redirect-navigation event for the same navigation.

Calling event.preventDefault() will prevent the navigation (not just the redirect).

Emitted after a server side redirect occurs during navigation. For example a 302 redirect.

This event cannot be prevented, if you want to prevent redirects you should checkout out the will-redirect event above.

Emitted when a main frame navigation is done.

This event is not emitted for in-page navigations, such as clicking anchor links or updating the window.location.hash. Use did-navigate-in-page event for this purpose.

Emitted when any frame navigation is done.

This event is not emitted for in-page navigations, such as clicking anchor links or updating the window.location.hash. Use did-navigate-in-page event for this purpose.

Emitted when an in-page navigation happened in any frame.

When in-page navigation happens, the page URL changes but does not cause navigation outside of the page. Examples of this occurring are when anchor links are clicked or when the DOM hashchange event is triggered.

Emitted when a beforeunload event handler is attempting to cancel a page unload.

Calling event.preventDefault() will ignore the beforeunload event handler and allow the page to be unloaded.

This will be emitted for BrowserViews but will not be respected - this is because we have chosen not to tie the BrowserView lifecycle to its owning BrowserWindow should one exist per the specification.

Emitted when the renderer process unexpectedly disappears. This is normally because it was crashed or killed.

Emitted when the web page becomes unresponsive.

Emitted when the unresponsive web page becomes responsive again.

Emitted when webContents is destroyed.

Emitted when an input event is sent to the WebContents. See InputEvent for details.

Emitted before dispatching the keydown and keyup events in the page. Calling event.preventDefault will prevent the page keydown/keyup events and the menu shortcuts.

To only prevent the menu shortcuts, use setIgnoreMenuShortcuts:

Emitted before dispatching mouse events in the page.

Calling event.preventDefault will prevent the page mouse events.

Emitted when the window enters a full-screen state triggered by HTML API.

Emitted when the window leaves a full-screen state triggered by HTML API.

Emitted when the user is requesting to change the zoom level using the mouse wheel.

Emitted when the WebContents loses focus.

Emitted when the WebContents gains focus.

Note that on macOS, having focus means the WebContents is the first responder of window, so switching focus between windows would not trigger the focus and blur events of WebContents, as the first responder of each window is not changed.

The focus and blur events of WebContents should only be used to detect focus change between different WebContents and BrowserView in the same window.

Emitted when a link is clicked in DevTools or 'Open in new tab' is selected for a link in its context menu.

Emitted when 'Search' is selected for text in its context menu.

Emitted when DevTools is opened.

Emitted when DevTools is closed.

Emitted when DevTools is focused / opened.

Emitted when failed to verify the certificate for url.

The usage is the same with the certificate-error event of app.

Emitted when a client certificate is requested.

The usage is the same with the select-client-certificate event of app.

Emitted when webContents wants to do basic auth.

The usage is the same with the login event of app.

Emitted when a result is available for webContents.findInPage request.

Emitted when media starts playing.

Emitted when media is paused or done playing.

Emitted when media becomes audible or inaudible.

Emitted when a page's theme color changes. This is usually due to encountering a meta tag:

Emitted when mouse moves over a link or the keyboard moves the focus to a link.

Emitted when the cursor's type changes. The type parameter can be pointer, crosshair, hand, text, wait, help, e-resize, n-resize, ne-resize, nw-resize, s-resize, se-resize, sw-resize, w-resize, ns-resize, ew-resize, nesw-resize, nwse-resize, col-resize, row-resize, m-panning, m-panning-vertical, m-panning-horizontal, e-panning, n-panning, ne-panning, nw-panning, s-panning, se-panning, sw-panning, w-panning, move, vertical-text, cell, context-menu, alias, progress, nodrop, copy, none, not-allowed, zoom-in, zoom-out, grab, grabbing, custom, null, drag-drop-none, drag-drop-move, drag-drop-copy, drag-drop-link, ns-no-resize, ew-no-resize, nesw-no-resize, nwse-no-resize, or default.

If the type parameter is custom, the image parameter will hold the custom cursor image in a NativeImage, and scale, size and hotspot will hold additional information about the custom cursor.

Emitted when there is a new context menu that needs to be handled.

Emitted when a bluetooth device needs to be selected when a call to navigator.bluetooth.requestDevice is made. callback should be called with the deviceId of the device to be selected. Passing an empty string to callback will cancel the request.

If no event listener is added for this event, all bluetooth requests will be cancelled.

If event.preventDefault is not called when handling this event, the first available device will be automatically selected.

Due to the nature of bluetooth, scanning for devices when navigator.bluetooth.requestDevice is called may take time and will cause select-bluetooth-device to fire multiple times until callback is called with either a device id or an empty string to cancel the request.

Emitted when a new frame is generated. Only the dirty area is passed in the buffer.

When using shared texture (set webPreferences.offscreen.useSharedTexture to true) feature, you can pass the texture handle to external rendering pipeline without the overhead of copying data between CPU and GPU memory, with Chromium's hardware acceleration support. This feature is helpful for high-performance rendering scenarios.

Only a limited number of textures can exist at the same time, so it's important that you call texture.release() as soon as you're done with the texture. By managing the texture lifecycle by yourself, you can safely pass the texture.textureInfo to other processes through IPC.

More details can be found in the offscreen rendering tutorial. To learn about how to handle the texture in native code, refer to offscreen rendering's code documentation..

Emitted when the devtools window instructs the webContents to reload

Emitted when a <webview>'s web contents is being attached to this web contents. Calling event.preventDefault() will destroy the guest page.

This event can be used to configure webPreferences for the webContents of a <webview> before it's loaded, and provides the ability to set settings that can't be set via <webview> attributes.

Emitted when a <webview> has been attached to this web contents.

Emitted when the associated window logs a console message.

Emitted when the preload script preloadPath throws an unhandled exception error.

Emitted when the renderer process sends an asynchronous message via ipcRenderer.send().

See also webContents.ipc, which provides an IpcMain-like interface for responding to IPC messages specifically from this WebContents.

Emitted when the renderer process sends a synchronous message via ipcRenderer.sendSync().

See also webContents.ipc, which provides an IpcMain-like interface for responding to IPC messages specifically from this WebContents.

Emitted when the WebContents preferred size has changed.

This event will only be emitted when enablePreferredSizeMode is set to true in webPreferences.

Emitted when the mainFrame, an <iframe>, or a nested <iframe> is loaded within the page.

Returns Promise<void> - the promise will resolve when the page has finished loading (see did-finish-load), and rejects if the page fails to load (see did-fail-load). A noop rejection handler is already attached, which avoids unhandled rejection errors. If the existing page has a beforeUnload handler, did-fail-load will be called unless will-prevent-unload is handled.

Loads the url in the window. The url must contain the protocol prefix, e.g. the http:// or file://. If the load should bypass http cache then use the pragma header to achieve it.

Returns Promise<void> - the promise will resolve when the page has finished loading (see did-finish-load), and rejects if the page fails to load (see did-fail-load).

Loads the given file in the window, filePath should be a path to an HTML file relative to the root of your application. For instance an app structure like this:

Would require code like this

Initiates a download of the resource at url without navigating. The will-download event of session will be triggered.

Returns string - The URL of the current web page.

Returns string - The title of the current web page.

Returns boolean - Whether the web page is destroyed.

Closes the page, as if the web content had called window.close().

If the page is successfully closed (i.e. the unload is not prevented by the page, or waitForBeforeUnload is false or unspecified), the WebContents will be destroyed and no longer usable. The destroyed event will be emitted.

Focuses the web page.

Returns boolean - Whether the web page is focused.

Returns boolean - Whether web page is still loading resources.

Returns boolean - Whether the main frame (and not just iframes or frames within it) is still loading.

Returns boolean - Whether the web page is waiting for a first-response from the main resource of the page.

Stops any pending navigation.

Reloads the current web page.

Reloads current page and ignores cache.

Returns boolean - Whether the browser can go back to previous web page.

Deprecated: Should use the new contents.navigationHistory.canGoBack API.

Returns boolean - Whether the browser can go forward to next web page.

Deprecated: Should use the new contents.navigationHistory.canGoForward API.

Returns boolean - Whether the web page can go to offset.

Deprecated: Should use the new contents.navigationHistory.canGoToOffset API.

Clears the navigation history.

Deprecated: Should use the new contents.navigationHistory.clear API.

Makes the browser go back a web page.

Deprecated: Should use the new contents.navigationHistory.goBack API.

Makes the browser go forward a web page.

Deprecated: Should use the new contents.navigationHistory.goForward API.

Navigates browser to the specified absolute web page index.

Deprecated: Should use the new contents.navigationHistory.goToIndex API.

Navigates to the specified offset from the "current entry".

Deprecated: Should use the new contents.navigationHistory.goToOffset API.

Returns boolean - Whether the renderer process has crashed.

Forcefully terminates the renderer process that is currently hosting this webContents. This will cause the render-process-gone event to be emitted with the reason=killed || reason=crashed. Please note that some webContents share renderer processes and therefore calling this method may also crash the host process for other webContents as well.

Calling reload() immediately after calling this method will force the reload to occur in a new process. This should be used when this process is unstable or unusable, for instance in order to recover from the unresponsive event.

Overrides the user agent for this web page.

Returns string - The user agent for this web page.

Returns Promise<string> - A promise that resolves with a key for the inserted CSS that can later be used to remove the CSS via contents.removeInsertedCSS(key).

Injects CSS into the current web page and returns a unique key for the inserted stylesheet.

Returns Promise<void> - Resolves if the removal was successful.

Removes the inserted CSS from the current web page. The stylesheet is identified by its key, which is returned from contents.insertCSS(css).

Returns Promise<any> - A promise that resolves with the result of the executed code or is rejected if the result of the code is a rejected promise.

Evaluates code in page.

In the browser window some HTML APIs like requestFullScreen can only be invoked by a gesture from the user. Setting userGesture to true will remove this limitation.

Code execution will be suspended until web page stop loading.

Returns Promise<any> - A promise that resolves with the result of the executed code or is rejected if the result of the code is a rejected promise.

Works like executeJavaScript but evaluates scripts in an isolated context.

Ignore application menu shortcuts while this web contents is focused.

handler Function<WindowOpenHandlerResponse>

Returns WindowOpenHandlerResponse - When set to { action: 'deny' } cancels the creation of the new window. { action: 'allow' } will allow the new window to be created. Returning an unrecognized value such as a null, undefined, or an object without a recognized 'action' value will result in a console error and have the same effect as returning {action: 'deny'}.

Called before creating a window a new window is requested by the renderer, e.g. by window.open(), a link with target="_blank", shift+clicking on a link, or submitting a form with <form target="_blank">. See window.open() for more details and how to use this in conjunction with did-create-window.

An example showing how to customize the process of new BrowserWindow creation to be BrowserView attached to main window instead:

Mute the audio on the current web page.

Returns boolean - Whether this page has been muted.

Returns boolean - Whether audio is currently playing.

Changes the zoom factor to the specified factor. Zoom factor is zoom percent divided by 100, so 300% = 3.0.

The factor must be greater than 0.0.

Returns number - the current zoom factor.

Changes the zoom level to the specified level. The original size is 0 and each increment above or below represents zooming 20% larger or smaller to default limits of 300% and 50% of original size, respectively. The formula for this is scale := 1.2 ^ level.

The zoom policy at the Chromium level is same-origin, meaning that the zoom level for a specific domain propagates across all instances of windows with the same domain. Differentiating the window URLs will make zoom work per-window.

Returns number - the current zoom level.

Returns Promise<void>

Sets the maximum and minimum pinch-to-zoom level.

Visual zoom is disabled by default in Electron. To re-enable it, call:const win = new BrowserWindow()win.webContents.setVisualZoomLevelLimits(1, 3)

Executes the editing command undo in web page.

Executes the editing command redo in web page.

Executes the editing command cut in web page.

Executes the editing command copy in web page.

Centers the current text selection in web page.

Copy the image at the given position to the clipboard.

Executes the editing command paste in web page.

Executes the editing command pasteAndMatchStyle in web page.

Executes the editing command delete in web page.

Executes the editing command selectAll in web page.

Executes the editing command unselect in web page.

Scrolls to the top of the current webContents.

Scrolls to the bottom of the current webContents.

Adjusts the current text selection starting and ending points in the focused frame by the given amounts. A negative amount moves the selection towards the beginning of the document, and a positive amount moves the selection towards the end of the document.

For a call of win.webContents.adjustSelection({ start: 1, end: 5 })

Executes the editing command replace in web page.

Executes the editing command replaceMisspelling in web page.

Returns Promise<void>

Inserts text to the focused element.

Returns Integer - The request id used for the request.

Starts a request to find all matches for the text in the web page. The result of the request can be obtained by subscribing to found-in-page event.

Stops any findInPage request for the webContents with the provided action.

Returns Promise<NativeImage> - Resolves with a NativeImage

Captures a snapshot of the page within rect. Omitting rect will capture the whole visible page. The page is considered visible when its browser window is hidden and the capturer count is non-zero. If you would like the page to stay hidden, you should ensure that stayHidden is set to true.

Returns boolean - Whether this page is being captured. It returns true when the capturer count is greater than 0.

Get the system printer list.

Returns Promise<PrinterInfo[]> - Resolves with a PrinterInfo[]

When a custom pageSize is passed, Chromium attempts to validate platform specific minimum values for width_microns and height_microns. Width and height must both be minimum 353 microns but may be higher on some operating systems.

Prints window's web page. When silent is set to true, Electron will pick the system's default printer if deviceName is empty and the default settings for printing.

Some possible failureReasons for print failure include:

Use page-break-before: always; CSS style to force to print to a new page.

Returns Promise<Buffer> - Resolves with the generated PDF data.

Prints the window's web page as PDF.

The landscape will be ignored if @page CSS at-rule is used in the web page.

An example of webContents.printToPDF:

See Page.printToPdf for more information.

Adds the specified path to DevTools workspace. Must be used after DevTools creation:

Removes the specified path from DevTools workspace.

Uses the devToolsWebContents as the target WebContents to show devtools.

The devToolsWebContents must not have done any navigation, and it should not be used for other purposes after the call.

By default Electron manages the devtools by creating an internal WebContents with native view, which developers have very limited control of. With the setDevToolsWebContents method, developers can use any WebContents to show the devtools in it, including BrowserWindow, BrowserView and <webview> tag.

Note that closing the devtools does not destroy the devToolsWebContents, it is caller's responsibility to destroy devToolsWebContents.

An example of showing devtools in a <webview> tag:

An example of showing devtools in a BrowserWindow:

When contents is a <webview> tag, the mode would be detach by default, explicitly passing an empty mode can force using last used dock state.

On Windows, if Windows Control Overlay is enabled, Devtools will be opened with mode: 'detach'.

Returns boolean - Whether the devtools is opened.

Returns boolean - Whether the devtools view is focused .

Returns string - the current title of the DevTools window. This will only be visible if DevTools is opened in undocked or detach mode.

Changes the title of the DevTools window to title. This will only be visible if DevTools is opened in undocked or detach mode.

Toggles the developer tools.

Starts inspecting element at position (x, y).

Opens the developer tools for the shared worker context.

Inspects the shared worker based on its ID.

Returns SharedWorkerInfo[] - Information about all Shared Workers.

Opens the developer tools for the service worker context.

Send an asynchronous message to the renderer process via channel, along with arguments. Arguments will be serialized with the Structured Clone Algorithm, just like postMessage, so prototype chains will not be included. Sending Functions, Promises, Symbols, WeakMaps, or WeakSets will throw an exception.

Sending non-standard JavaScript types such as DOM objects or special Electron objects will throw an exception.

For additional reading, refer to Electron's IPC guide.

Send an asynchronous message to a specific frame in a renderer process via channel, along with arguments. Arguments will be serialized with the Structured Clone Algorithm, just like postMessage, so prototype chains will not be included. Sending Functions, Promises, Symbols, WeakMaps, or WeakSets will throw an exception.

NOTE: Sending non-standard JavaScript types such as DOM objects or special Electron objects will throw an exception.

The renderer process can handle the message by listening to channel with the ipcRenderer module.

If you want to get the frameId of a given renderer context you should use the webFrame.routingId value. E.g.

You can also read frameId from all incoming IPC messages in the main process.

Send a message to the renderer process, optionally transferring ownership of zero or more MessagePortMain objects.

The transferred MessagePortMain objects will be available in the renderer process by accessing the ports property of the emitted event. When they arrive in the renderer, they will be native DOM MessagePort objects.

Enable device emulation with the given parameters.

Disable device emulation enabled by webContents.enableDeviceEmulation.

Sends an input event to the page.

The BrowserWindow containing the contents needs to be focused for sendInputEvent() to work.

Begin subscribing for presentation events and captured frames, the callback will be called with callback(image, dirtyRect) when there is a presentation event.

The image is an instance of NativeImage that stores the captured frame.

The dirtyRect is an object with x, y, width, height properties that describes which part of the page was repainted. If onlyDirty is set to true, image will only contain the repainted area. onlyDirty defaults to false.

End subscribing for frame presentation events.

Sets the item as dragging item for current drag-drop operation, file is the absolute path of the file to be dragged, and icon is the image showing under the cursor when dragging.

Returns Promise<void> - resolves if the page is saved.

Shows pop-up dictionary that searches the selected word on the page.

Returns boolean - Indicates whether offscreen rendering is enabled.

If offscreen rendering is enabled and not painting, start painting.

If offscreen rendering is enabled and painting, stop painting.

Returns boolean - If offscreen rendering is enabled returns whether it is currently painting.

If offscreen rendering is enabled sets the frame rate to the specified number. Only values between 1 and 240 are accepted.

Returns Integer - If offscreen rendering is enabled returns the current frame rate.

Schedules a full repaint of the window this web contents is in.

If offscreen rendering is enabled invalidates the frame and generates a new one through the 'paint' event.

Returns string - Returns the WebRTC IP Handling Policy.

Setting the WebRTC IP handling policy allows you to control which IPs are exposed via WebRTC. See BrowserLeaks for more details.

By default this value is { min: 0, max: 0 } , which would apply no restriction on the udp port range.

Setting the WebRTC UDP Port Range allows you to restrict the udp port range used by WebRTC. By default the port range is unrestricted.

To reset to an unrestricted port range this value should be set to { min: 0, max: 0 }.

Returns string - The identifier of a WebContents stream. This identifier can be used with navigator.mediaDevices.getUserMedia using a chromeMediaSource of tab. The identifier is restricted to the web contents that it is registered to and is only valid for 10 seconds.

Returns Integer - The operating system pid of the associated renderer process.

Returns Integer - The Chromium internal pid of the associated renderer. Can be compared to the frameProcessId passed by frame specific navigation events (e.g. did-frame-navigate)

Returns Promise<void> - Indicates whether the snapshot has been created successfully.

Takes a V8 heap snapshot and saves it to filePath.

Returns boolean - whether or not this WebContents will throttle animations and timers when the page becomes backgrounded. This also affects the Page Visibility API.

WebContents.backgroundThrottling set to false affects all WebContents in the host BrowserWindow

Controls whether or not this WebContents will throttle animations and timers when the page becomes backgrounded. This also affects the Page Visibility API.

Returns string - the type of the webContent. Can be backgroundPage, window, browserView, remote, webview or offscreen.

Sets the image animation policy for this webContents. The policy only affects new images, existing images that are currently being animated are unaffected. This is a known limitation in Chromium, you can force image animation to be recalculated with img.src = img.src which will result in no network traffic but will update the animation policy.

This corresponds to the animationPolicy accessibility feature in Chromium.

An IpcMain scoped to just IPC messages sent from this WebContents.

IPC messages sent with ipcRenderer.send, ipcRenderer.sendSync or ipcRenderer.postMessage will be delivered in the following order:

Handlers registered with invoke will be checked in the following order. The first one that is defined will be called, the rest will be ignored.

A handler or event listener registered on the WebContents will receive IPC messages sent from any frame, including child frames. In most cases, only the main frame can send IPC messages. However, if the nodeIntegrationInSubFrames option is enabled, it is possible for child frames to send IPC messages also. In that case, handlers should check the senderFrame property of the IPC event to ensure that the message is coming from the expected frame. Alternatively, register handlers on the appropriate frame directly using the WebFrameMain.ipc interface.

A boolean property that determines whether this page is muted.

A string property that determines the user agent for this web page.

A number property that determines the zoom level for this web contents.

The original size is 0 and each increment above or below represents zooming 20% larger or smaller to default limits of 300% and 50% of original size, respectively. The formula for this is scale := 1.2 ^ level.

A number property that determines the zoom factor for this web contents.

The zoom factor is the zoom percent divided by 100, so 300% = 3.0.

An Integer property that sets the frame rate of the web contents to the specified number. Only values between 1 and 240 are accepted.

Only applicable if offscreen rendering is enabled.

A Integer representing the unique ID of this WebContents. Each ID is unique among all WebContents instances of the entire Electron application.

A Session used by this webContents.

A NavigationHistory used by this webContents.

A WebContents instance that might own this WebContents.

A WebContents | null property that represents the of DevTools WebContents associated with a given WebContents.

Users should never store this object because it may become null when the DevTools has been closed.

A Debugger instance for this webContents.

WebContents.backgroundThrottling set to false affects all WebContents in the host BrowserWindow

A boolean property that determines whether or not this WebContents will throttle animations and timers when the page becomes backgrounded. This also affects the Page Visibility API.

A WebFrameMain property that represents the top frame of the page's frame hierarchy.

A WebFrameMain | null property that represents the frame that opened this WebContents, either with open(), or by navigating a link with a target attribute.

A WebFrameMain | null property that represents the currently focused frame in this WebContents. Can be the top frame, an inner <iframe>, or null if nothing is focused.

**Examples:**

Example 1 (javascript):
```javascript
const { BrowserWindow } = require('electron')const win = new BrowserWindow({ width: 800, height: 1500 })win.loadURL('https://github.com')const contents = win.webContentsconsole.log(contents)
```

Example 2 (javascript):
```javascript
const { webContents } = require('electron')console.log(webContents)
```

Example 3 (javascript):
```javascript
async function lookupTargetId (browserWindow) {  const wc = browserWindow.webContents  await wc.debugger.attach('1.3')  const { targetInfo } = await wc.debugger.sendCommand('Target.getTargetInfo')  const { targetId } = targetInfo  const targetWebContents = await wc.fromDevToolsTargetId(targetId)}
```

Example 4 (javascript):
```javascript
const { BrowserWindow, dialog } = require('electron')const win = new BrowserWindow({ width: 800, height: 600 })win.webContents.on('will-prevent-unload', (event) => {  const choice = dialog.showMessageBoxSync(win, {    type: 'question',    buttons: ['Leave', 'Stay'],    title: 'Do you want to leave this site?',    message: 'Changes you made may not be saved.',    defaultId: 0,    cancelId: 1  })  const leave = (choice === 0)  if (leave) {    event.preventDefault()  }})
```

---

## View

**URL:** https://www.electronjs.org/docs/latest/api/view

**Contents:**
- View
- Class: View​
  - new View()​
  - Instance Events​
    - Event: 'bounds-changed'​
  - Instance Methods​
    - view.addChildView(view[, index])​
    - view.removeChildView(view)​
    - view.setBounds(bounds)​
    - view.getBounds()​

Create and layout native views.

This module cannot be used until the ready event of the app module is emitted.

View is an EventEmitter.

Electron's built-in classes cannot be subclassed in user code. For more information, see the FAQ.

Objects created with new View emit the following events:

Emitted when the view's bounds have changed in response to being laid out. The new bounds can be retrieved with view.getBounds().

Objects created with new View have the following instance methods:

If the same View is added to a parent which already contains it, it will be reordered such that it becomes the topmost view.

If the view passed as a parameter is not a child of this view, this method is a no-op.

Returns Rectangle - The bounds of this View, relative to its parent.

Examples of valid color values:

Hex format with alpha takes AARRGGBB or ARGB, not RRGGBBAA or RGB.

The area cutout of the view's border still captures clicks.

Returns boolean - Whether the view should be drawn. Note that this is different from whether the view is visible on screen—it may still be obscured or out of view.

Objects created with new View have the following properties:

A View[] property representing the child views of this view.

**Examples:**

Example 1 (javascript):
```javascript
const { BaseWindow, View } = require('electron')const win = new BaseWindow()const view = new View()view.setBackgroundColor('red')view.setBounds({ x: 0, y: 0, width: 100, height: 100 })win.contentView.addChildView(view)
```

---

## Tray

**URL:** https://www.electronjs.org/docs/latest/api/tray

**Contents:**
- Tray
- Class: Tray​
  - new Tray(image, [guid])​
  - Instance Events​
    - Event: 'click'​
    - Event: 'right-click' macOS Windows​
    - Event: 'double-click' macOS Windows​
    - Event: 'middle-click' Windows​
    - Event: 'balloon-show' Windows​
    - Event: 'balloon-click' Windows​

Add icons and context menus to the system's notification area.

Tray is an EventEmitter.

See also: A detailed guide about how to implement Tray menus.

Electron's built-in classes cannot be subclassed in user code. For more information, see the FAQ.

Platform Considerations

On Windows, if the executable is signed and the signature contains an organization in the subject line then the GUID is permanently associated with that signature. OS level settings like the position of the tray icon in the system tray will persist even if the path to the executable changes. If the executable is not code-signed then the GUID is permanently associated with the path to the executable. Changing the path to the executable will break the creation of the tray icon and a new GUID must be used. However, it is highly recommended to use the GUID parameter only in conjunction with code-signed executable. If an App defines multiple tray icons then each icon must use a separate GUID.

On macOS, the guid is a string used to uniquely identify the tray icon and allow it to retain its position between relaunches. Using the same string for a new tray item will create it in the same position as the previous tray item to use the string.

Creates a new tray icon associated with the image.

The Tray module emits the following events:

Emitted when the tray icon is clicked.

Note that on Linux this event is emitted when the tray icon receives an activation, which might not necessarily be left mouse click.

Emitted when the tray icon is right clicked.

Emitted when the tray icon is double clicked.

Emitted when the tray icon is middle clicked.

Emitted when the tray balloon shows.

Emitted when the tray balloon is clicked.

Emitted when the tray balloon is closed because of timeout or user manually closes it.

Emitted when any dragged items are dropped on the tray icon.

Emitted when dragged files are dropped in the tray icon.

Emitted when dragged text is dropped in the tray icon.

Emitted when a drag operation enters the tray icon.

Emitted when a drag operation exits the tray icon.

Emitted when a drag operation ends on the tray or ends at another location.

Emitted when the mouse is released from clicking the tray icon.

This will not be emitted if you have set a context menu for your Tray using tray.setContextMenu, as a result of macOS-level constraints.

Emitted when the mouse clicks the tray icon.

Emitted when the mouse enters the tray icon.

Emitted when the mouse exits the tray icon.

Emitted when the mouse moves in the tray icon.

The Tray class has the following methods:

Destroys the tray icon immediately.

Sets the image associated with this tray icon.

Sets the image associated with this tray icon when pressed on macOS.

Sets the hover text for this tray icon. Setting the text to an empty string will remove the tooltip.

Sets the title displayed next to the tray icon in the status bar (Support ANSI colors).

Returns string - the title displayed next to the tray icon in the status bar

Sets the option to ignore double click events. Ignoring these events allows you to detect every individual click of the tray icon.

This value is set to false by default.

Returns boolean - Whether double click events will be ignored.

Displays a tray balloon.

Removes a tray balloon.

Returns focus to the taskbar notification area. Notification area icons should use this message when they have completed their UI operation. For example, if the icon displays a shortcut menu, but the user presses ESC to cancel it, use tray.focus() to return focus to the notification area.

Pops up the context menu of the tray icon. When menu is passed, the menu will be shown instead of the tray icon's context menu.

The position is only available on Windows, and it is (0, 0) by default.

Closes an open context menu, as set by tray.setContextMenu().

Sets the context menu for this icon.

The bounds of this tray icon as Object.

Returns string | null - The GUID used to uniquely identify the tray icon and allow it to retain its position between relaunches, or null if none is set.

Returns boolean - Whether the tray icon is destroyed.

**Examples:**

Example 1 (javascript):
```javascript
const { app, Menu, Tray } = require('electron')let tray = nullapp.whenReady().then(() => {  tray = new Tray('/path/to/my/icon')  const contextMenu = Menu.buildFromTemplate([    { label: 'Item1', type: 'radio' },    { label: 'Item2', type: 'radio' },    { label: 'Item3', type: 'radio', checked: true },    { label: 'Item4', type: 'radio' }  ])  tray.setToolTip('This is my application.')  tray.setContextMenu(contextMenu)})
```

Example 2 (javascript):
```javascript
const { app, Menu, Tray } = require('electron')let appIcon = nullapp.whenReady().then(() => {  appIcon = new Tray('/path/to/my/icon')  const contextMenu = Menu.buildFromTemplate([    { label: 'Item1', type: 'radio' },    { label: 'Item2', type: 'radio' }  ])  // Make a change to the context menu  contextMenu.items[1].checked = false  // Call this again for Linux because we modified the context menu  appIcon.setContextMenu(contextMenu)})
```

Example 3 (javascript):
```javascript
const { app, Menu, Tray } = require('electron')let appIcon = nullapp.whenReady().then(() => {  appIcon = new Tray('/path/to/my/icon')  const contextMenu = Menu.buildFromTemplate([    { label: 'Item1', type: 'radio' },    { label: 'Item2', type: 'radio' }  ])  // Make a change to the context menu  contextMenu.items[1].checked = false  // Call this again for Linux because we modified the context menu  appIcon.setContextMenu(contextMenu)})
```

---

## Source Code Directory Structure

**URL:** https://www.electronjs.org/docs/latest/development/source-code-directory-structure

**Contents:**
- Source Code Directory Structure
- Structure of Source Code​
- Structure of Other Directories​

The source code of Electron is separated into a few parts, mostly following Chromium on the separation conventions.

You may need to become familiar with Chromium's multi-process architecture to understand the source code better.

**Examples:**

Example 1 (csharp):
```csharp
Electron├── build/ - Build configuration files needed to build with GN.├── buildflags/ - Determines the set of features that can be conditionally built.├── chromium_src/ - Source code copied from Chromium that isn't part of the content layer.├── default_app/ - A default app run when Electron is started without|                  providing a consumer app.├── docs/ - Electron's documentation.|   ├── api/ - Documentation for Electron's externally-facing modules and APIs.|   ├── development/ - Documentation to aid in developing for and with Electron.|   ├── fiddles/ - A set of code snippets one can run in Electron Fiddle.|   ├── images/ - Images used in documentation.|   └── tutorial/ - Tutorial documents for various aspects of Electron.├── lib/ - JavaScript/TypeScript source code.|   ├── browser/ - Main process initialization code.|   |   ├── api/ - API implementation for main process modules.|   |   └── remote/ - Code related to the remote module as it is|   |                 used in the main process.|   ├── common/ - Relating to logic needed by both main and renderer processes.|   |   └── api/ - API implementation for modules that can be used in|   |              both the main and renderer processes|   ├── isolated_renderer/ - Handles creation of isolated renderer processes when|   |                        contextIsolation is enabled.|   ├── renderer/ - Renderer process initialization code.|   |   ├── api/ - API implementation for renderer process modules.|   |   ├── extension/ - Code related to use of Chrome Extensions|   |   |                in Electron's renderer process.|   |   ├── remote/ - Logic that handles use of the remote module in|   |   |             the main process.|   |   └── web-view/ - Logic that handles the use of webviews in the|   |                   renderer process.|   ├── sandboxed_renderer/ - Logic that handles creation of sandboxed renderer|   |   |                     processes.|   |   └── api/ - API implementation for sandboxed renderer processes.|   └── worker/ - Logic that handles proper functionality of Node.js|                 environments in Web Workers.├── patches/ - Patches applied on top of Electron's core dependencies|   |          in order to handle differences between our use cases and|   |          default functionality.|   ├── boringssl/ - Patches applied to Google's fork of OpenSSL, BoringSSL.|   ├── chromium/ - Patches applied to Chromium.|   ├── node/ - Patches applied on top of Node.js.|   └── v8/ - Patches applied on top of Google's V8 engine.├── shell/ - C++ source code.|   ├── app/ - System entry code.|   ├── browser/ - The frontend including the main window, UI, and all of the|   |   |          main process things. This talks to the renderer to manage web|   |   |          pages.|   |   ├── ui/ - Implementation of UI stuff for different platforms.|   |   |   ├── cocoa/ - Cocoa specific source code.|   |   |   ├── win/ - Windows GUI specific source code.|   |   |   └── x/ - X11 specific source code.|   |   ├── api/ - The implementation of the main process APIs.|   |   ├── net/ - Network related code.|   |   ├── mac/ - Mac specific Objective-C source code.|   |   └── resources/ - Icons, platform-dependent files, etc.|   ├── renderer/ - Code that runs in renderer process.|   |   └── api/ - The implementation of renderer process APIs.|   └── common/ - Code that used by both the main and renderer processes,|       |         including some utility functions and code to integrate node's|       |         message loop into Chromium's message loop.|       └── api/ - The implementation of common APIs, and foundations of|                  Electron's built-in modules.├── spec/ - Components of Electron's test suite run in the main process.└── BUILD.gn - Building rules of Electron.
```

Example 2 (unknown):
```unknown
script/ - The set of all scripts Electron runs for a variety of purposes.├── codesign/ - Fakes codesigning for Electron apps; used for testing.├── lib/ - Miscellaneous python utility scripts.└── release/ - Scripts run during Electron's release process.    ├── notes/ - Generates release notes for new Electron versions.    └── uploaders/ - Uploads various release-related files during release.
```

---

## Class: TouchBarSegmentedControl

**URL:** https://www.electronjs.org/docs/latest/api/touch-bar-segmented-control

**Contents:**
- Class: TouchBarSegmentedControl
- Class: TouchBarSegmentedControl​
  - new TouchBarSegmentedControl(options)​
  - Instance Properties​
    - touchBarSegmentedControl.segmentStyle​
    - touchBarSegmentedControl.segments​
    - touchBarSegmentedControl.selectedIndex​
    - touchBarSegmentedControl.mode​

Create a segmented control (a button group) where one button has a selected state

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

The following properties are available on instances of TouchBarSegmentedControl:

A string representing the controls current segment style. Updating this value immediately updates the control in the touch bar.

A SegmentedControlSegment[] array representing the segments in this control. Updating this value immediately updates the control in the touch bar. Updating deep properties inside this array does not update the touch bar.

An Integer representing the currently selected segment. Changing this value immediately updates the control in the touch bar. User interaction with the touch bar will update this value automatically.

A string representing the current selection mode of the control. Can be single, multiple or buttons.

---

## Environment Variables

**URL:** https://www.electronjs.org/docs/latest/api/environment-variables

**Contents:**
- Environment Variables
- Production Variables​
  - NODE_OPTIONS​
  - NODE_EXTRA_CA_CERTS​
  - GOOGLE_API_KEY​
  - ELECTRON_NO_ASAR​
  - ELECTRON_RUN_AS_NODE​
  - ELECTRON_NO_ATTACH_CONSOLE Windows​
  - ELECTRON_FORCE_WINDOW_MENU_BAR Linux​
  - ELECTRON_TRASH Linux​

Control application configuration and behavior without changing code.

Certain Electron behaviors are controlled by environment variables because they are initialized earlier than the command line flags and the app's code.

Windows console example:

The following environment variables are intended primarily for use at runtime in packaged Electron applications.

Electron includes support for a subset of Node's NODE_OPTIONS. The majority are supported with the exception of those which conflict with Chromium's use of BoringSSL.

Unsupported options are:

NODE_OPTIONS are explicitly disallowed in packaged apps, except for the following:

If the nodeOptions fuse is disabled, NODE_OPTIONS will be ignored.

See Node.js cli documentation for details.

If the nodeOptions fuse is disabled, NODE_EXTRA_CA_CERTS will be ignored.

Geolocation support in Electron requires the use of Google Cloud Platform's geolocation webservice. To enable this feature, acquire a Google API key and place the following code in your main process file, before opening any browser windows that will make geolocation requests:

By default, a newly generated Google API key may not be allowed to make geolocation requests. To enable the geolocation webservice for your project, enable it through the API library.

N.B. You will need to add a Billing Account to the project associated to the API key for the geolocation webservice to work.

Disables ASAR support. This variable is only supported in forked child processes and spawned child processes that set ELECTRON_RUN_AS_NODE.

Starts the process as a normal Node.js process.

In this mode, you will be able to pass cli options to Node.js as you would when running the normal Node.js executable, with the exception of the following flags:

These flags are disabled owing to the fact that Electron uses BoringSSL instead of OpenSSL when building Node.js' crypto module, and so will not work as designed.

If the runAsNode fuse is disabled, ELECTRON_RUN_AS_NODE will be ignored.

Don't attach to the current console session.

Don't use the global menu bar on Linux.

Set the trash implementation on Linux. Default is gio.

The following environment variables are intended primarily for development and debugging purposes.

Prints Chromium's internal logging to the console.

Setting this variable is the same as passing --enable-logging on the command line. For more info, see --enable-logging in command-line switches.

Sets the file destination for Chromium's internal logging.

Setting this variable is the same as passing --log-file on the command line. For more info, see --log-file in command-line switches.

Adds extra logs to Notification lifecycles on macOS to aid in debugging. Extra logging will be displayed when new Notifications are created or activated. They will also be displayed when common actions are taken: a notification is shown, dismissed, its button is clicked, or it is replied to.

When Electron reads from an ASAR file, log the read offset and file path to the system tmpdir. The resulting file can be provided to the ASAR module to optimize file ordering.

Prints the stack trace to the console when Electron crashes.

This environment variable will not work if the crashReporter is started.

Shows the Windows's crash dialog when Electron crashes.

This environment variable will not work if the crashReporter is started.

When running from the electron package, this variable tells the electron command to use the specified build of Electron instead of the one downloaded by npm install. Usage:

**Examples:**

Example 1 (unknown):
```unknown
$ export ELECTRON_ENABLE_LOGGING=true$ electron
```

Example 2 (powershell):
```powershell
> set ELECTRON_ENABLE_LOGGING=true> electron
```

Example 3 (unknown):
```unknown
export NODE_OPTIONS="--no-warnings --max-old-space-size=2048"
```

Example 4 (unknown):
```unknown
--use-bundled-ca--force-fips--enable-fips--openssl-config--use-openssl-ca
```

---

## protocol

**URL:** https://www.electronjs.org/docs/latest/api/protocol

**Contents:**
- protocol
- Using protocol with a custom partition or session​
- Methods​
  - protocol.registerSchemesAsPrivileged(customSchemes)​
  - protocol.handle(scheme, handler)​
  - protocol.unhandle(scheme)​
  - protocol.isProtocolHandled(scheme)​
  - protocol.registerFileProtocol(scheme, handler) Deprecated​
  - protocol.registerBufferProtocol(scheme, handler) Deprecated​
  - protocol.registerStringProtocol(scheme, handler) Deprecated​

Register a custom protocol and intercept existing protocol requests.

An example of implementing a protocol that has the same effect as the file:// protocol:

All methods unless specified can only be used after the ready event of the app module gets emitted.

A protocol is registered to a specific Electron session object. If you don't specify a session, then your protocol will be applied to the default session that Electron uses. However, if you define a partition or session on your browserWindow's webPreferences, then that window will use a different session and your custom protocol will not work if you just use electron.protocol.XXX.

To have your custom protocol work in combination with a custom session, you need to register it to that session explicitly.

The protocol module has the following methods:

This method can only be used before the ready event of the app module gets emitted and can be called only once.

Registers the scheme as standard, secure, bypasses content security policy for resources, allows registering ServiceWorker, supports fetch API, streaming video/audio, and V8 code cache. Specify a privilege with the value of true to enable the capability.

An example of registering a privileged scheme, that bypasses Content Security Policy:

A standard scheme adheres to what RFC 3986 calls generic URI syntax. For example http and https are standard schemes, while file is not.

Registering a scheme as standard allows relative and absolute resources to be resolved correctly when served. Otherwise the scheme will behave like the file protocol, but without the ability to resolve relative URLs.

For example when you load following page with custom protocol without registering it as standard scheme, the image will not be loaded because non-standard schemes can not recognize relative URLs:

Registering a scheme as standard will allow access to files through the FileSystem API. Otherwise the renderer will throw a security error for the scheme.

By default web storage apis (localStorage, sessionStorage, webSQL, indexedDB, cookies) are disabled for non standard schemes. So in general if you want to register a custom protocol to replace the http protocol, you have to register it as a standard scheme.

Protocols that use streams (http and stream protocols) should set stream: true. The <video> and <audio> HTML elements expect protocols to buffer their responses by default. The stream flag configures those elements to correctly expect streaming responses.

Register a protocol handler for scheme. Requests made to URLs with this scheme will delegate to this handler to determine what response should be sent.

Either a Response or a Promise<Response> can be returned.

See the MDN docs for Request and Response for more details.

Removes a protocol handler registered with protocol.handle.

Returns boolean - Whether scheme is already handled.

protocol.register*Protocol and protocol.intercept*Protocol methods have been replaced with protocol.handle

Returns boolean - Whether the protocol was successfully registered

Registers a protocol of scheme that will send a file as the response. The handler will be called with request and callback where request is an incoming request for the scheme.

To handle the request, the callback should be called with either the file's path or an object that has a path property, e.g. callback(filePath) or callback({ path: filePath }). The filePath must be an absolute path.

By default the scheme is treated like http:, which is parsed differently from protocols that follow the "generic URI syntax" like file:.

protocol.register*Protocol and protocol.intercept*Protocol methods have been replaced with protocol.handle

Returns boolean - Whether the protocol was successfully registered

Registers a protocol of scheme that will send a Buffer as a response.

The usage is the same with registerFileProtocol, except that the callback should be called with either a Buffer object or an object that has the data property.

protocol.register*Protocol and protocol.intercept*Protocol methods have been replaced with protocol.handle

Returns boolean - Whether the protocol was successfully registered

Registers a protocol of scheme that will send a string as a response.

The usage is the same with registerFileProtocol, except that the callback should be called with either a string or an object that has the data property.

protocol.register*Protocol and protocol.intercept*Protocol methods have been replaced with protocol.handle

Returns boolean - Whether the protocol was successfully registered

Registers a protocol of scheme that will send an HTTP request as a response.

The usage is the same with registerFileProtocol, except that the callback should be called with an object that has the url property.

protocol.register*Protocol and protocol.intercept*Protocol methods have been replaced with protocol.handle

Returns boolean - Whether the protocol was successfully registered

Registers a protocol of scheme that will send a stream as a response.

The usage is the same with registerFileProtocol, except that the callback should be called with either a ReadableStream object or an object that has the data property.

It is possible to pass any object that implements the readable stream API (emits data/end/error events). For example, here's how a file could be returned:

protocol.register*Protocol and protocol.intercept*Protocol methods have been replaced with protocol.handle

Returns boolean - Whether the protocol was successfully unregistered

Unregisters the custom protocol of scheme.

protocol.register*Protocol and protocol.intercept*Protocol methods have been replaced with protocol.handle

Returns boolean - Whether scheme is already registered.

protocol.register*Protocol and protocol.intercept*Protocol methods have been replaced with protocol.handle

Returns boolean - Whether the protocol was successfully intercepted

Intercepts scheme protocol and uses handler as the protocol's new handler which sends a file as a response.

protocol.register*Protocol and protocol.intercept*Protocol methods have been replaced with protocol.handle

Returns boolean - Whether the protocol was successfully intercepted

Intercepts scheme protocol and uses handler as the protocol's new handler which sends a string as a response.

protocol.register*Protocol and protocol.intercept*Protocol methods have been replaced with protocol.handle

Returns boolean - Whether the protocol was successfully intercepted

Intercepts scheme protocol and uses handler as the protocol's new handler which sends a Buffer as a response.

protocol.register*Protocol and protocol.intercept*Protocol methods have been replaced with protocol.handle

Returns boolean - Whether the protocol was successfully intercepted

Intercepts scheme protocol and uses handler as the protocol's new handler which sends a new HTTP request as a response.

protocol.register*Protocol and protocol.intercept*Protocol methods have been replaced with protocol.handle

Returns boolean - Whether the protocol was successfully intercepted

Same as protocol.registerStreamProtocol, except that it replaces an existing protocol handler.

protocol.register*Protocol and protocol.intercept*Protocol methods have been replaced with protocol.handle

Returns boolean - Whether the protocol was successfully unintercepted

Remove the interceptor installed for scheme and restore its original handler.

protocol.register*Protocol and protocol.intercept*Protocol methods have been replaced with protocol.handle

Returns boolean - Whether scheme is already intercepted.

**Examples:**

Example 1 (javascript):
```javascript
const { app, protocol, net } = require('electron')const path = require('node:path')const url = require('node:url')app.whenReady().then(() => {  protocol.handle('atom', (request) => {    const filePath = request.url.slice('atom://'.length)    return net.fetch(url.pathToFileURL(path.join(__dirname, filePath)).toString())  })})
```

Example 2 (javascript):
```javascript
const { app, BrowserWindow, net, protocol, session } = require('electron')const path = require('node:path')const url = require('node:url')app.whenReady().then(() => {  const partition = 'persist:example'  const ses = session.fromPartition(partition)  ses.protocol.handle('atom', (request) => {    const filePath = request.url.slice('atom://'.length)    return net.fetch(url.pathToFileURL(path.resolve(__dirname, filePath)).toString())  })  const mainWindow = new BrowserWindow({ webPreferences: { partition } })})
```

Example 3 (css):
```css
const { protocol } = require('electron')protocol.registerSchemesAsPrivileged([  { scheme: 'foo', privileges: { bypassCSP: true } }])
```

Example 4 (html):
```html
<body>  <img src='test.png'></body>
```

---

## ProxyConfig Object

**URL:** https://www.electronjs.org/docs/latest/api/structures/proxy-config

**Contents:**
- ProxyConfig Object

When mode is unspecified, pacScript and proxyRules are provided together, the proxyRules option is ignored and pacScript configuration is applied.

The proxyRules has to follow the rules below:

The proxyBypassRules is a comma separated list of rules described below:

[ URL_SCHEME "://" ] HOSTNAME_PATTERN [ ":" <port> ]

Match all hostnames that match the pattern HOSTNAME_PATTERN.

Examples: "foobar.com", "*foobar.com", "*.foobar.com", "*foobar.com:99", "https://x.\*.y.com:99"

"." HOSTNAME_SUFFIX_PATTERN [ ":" PORT ]

Match a particular domain suffix.

Examples: ".google.com", ".com", "http://.google.com"

[ SCHEME "://" ] IP_LITERAL [ ":" PORT ]

Match URLs which are IP address literals.

Examples: "127.0.1", "[0:0::1]", "[::1]", "http://[::1]:99"

IP_LITERAL "/" PREFIX_LENGTH_IN_BITS

Match any URL that is to an IP literal that falls between the given range. IP range is specified using CIDR notation.

Examples: "192.168.1.1/16", "fefe:13::abc/33".

Match local addresses. The meaning of <local> is whether the host matches one of: "127.0.0.1", "::1", "localhost".

**Examples:**

Example 1 (typescript):
```typescript
proxyRules = schemeProxies[";"<schemeProxies>]schemeProxies = [<urlScheme>"="]<proxyURIList>urlScheme = "http" | "https" | "ftp" | "socks"proxyURIList = <proxyURL>[","<proxyURIList>]proxyURL = [<proxyScheme>"://"]<proxyHost>[":"<proxyPort>]
```

---

## session

**URL:** https://www.electronjs.org/docs/latest/api/session

**Contents:**
- session
- Methods​
  - session.fromPartition(partition[, options])​
  - session.fromPath(path[, options])​
- Properties​
  - session.defaultSession​
- Class: Session​
  - Instance Events​
    - Event: 'will-download'​
    - Event: 'extension-loaded'​

Manage browser sessions, cookies, cache, proxy settings, etc.

The session module can be used to create new Session objects.

You can also access the session of existing pages by using the session property of WebContents, or from the session module.

The session module has the following methods:

Returns Session - A session instance from partition string. When there is an existing Session with the same partition, it will be returned; otherwise a new Session instance will be created with options.

If partition starts with persist:, the page will use a persistent session available to all pages in the app with the same partition. if there is no persist: prefix, the page will use an in-memory session. If the partition is empty then default session of the app will be returned.

To create a Session with options, you have to ensure the Session with the partition has never been used before. There is no way to change the options of an existing Session object.

Returns Session - A session instance from the absolute path as specified by the path string. When there is an existing Session with the same absolute path, it will be returned; otherwise a new Session instance will be created with options. The call will throw an error if the path is not an absolute path. Additionally, an error will be thrown if an empty string is provided.

To create a Session with options, you have to ensure the Session with the path has never been used before. There is no way to change the options of an existing Session object.

The session module has the following properties:

A Session object, the default session object of the app.

Get and set properties of a session.

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

You can create a Session object in the session module:

The following events are available on instances of Session:

Emitted when Electron is about to download item in webContents.

Calling event.preventDefault() will cancel the download and item will not be available from next tick of the process.

Emitted after an extension is loaded. This occurs whenever an extension is added to the "enabled" set of extensions. This includes:

Emitted after an extension is unloaded. This occurs when Session.removeExtension is called.

Emitted after an extension is loaded and all necessary browser state is initialized to support the start of the extension's background page.

Emitted when a render process requests preconnection to a URL, generally due to a resource hint.

Emitted when a hunspell dictionary file has been successfully initialized. This occurs after the file has been downloaded.

Emitted when a hunspell dictionary file starts downloading

Emitted when a hunspell dictionary file has been successfully downloaded

Emitted when a hunspell dictionary file download fails. For details on the failure you should collect a netlog and inspect the download request.

Emitted when a HID device needs to be selected when a call to navigator.hid.requestDevice is made. callback should be called with deviceId to be selected; passing no arguments to callback will cancel the request. Additionally, permissioning on navigator.hid can be further managed by using ses.setPermissionCheckHandler(handler) and ses.setDevicePermissionHandler(handler).

Emitted after navigator.hid.requestDevice has been called and select-hid-device has fired if a new device becomes available before the callback from select-hid-device is called. This event is intended for use when using a UI to ask users to pick a device so that the UI can be updated with the newly added device.

Emitted after navigator.hid.requestDevice has been called and select-hid-device has fired if a device has been removed before the callback from select-hid-device is called. This event is intended for use when using a UI to ask users to pick a device so that the UI can be updated to remove the specified device.

Emitted after HIDDevice.forget() has been called. This event can be used to help maintain persistent storage of permissions when setDevicePermissionHandler is used.

Emitted when a serial port needs to be selected when a call to navigator.serial.requestPort is made. callback should be called with portId to be selected, passing an empty string to callback will cancel the request. Additionally, permissioning on navigator.serial can be managed by using ses.setPermissionCheckHandler(handler) with the serial permission.

Emitted after navigator.serial.requestPort has been called and select-serial-port has fired if a new serial port becomes available before the callback from select-serial-port is called. This event is intended for use when using a UI to ask users to pick a port so that the UI can be updated with the newly added port.

Emitted after navigator.serial.requestPort has been called and select-serial-port has fired if a serial port has been removed before the callback from select-serial-port is called. This event is intended for use when using a UI to ask users to pick a port so that the UI can be updated to remove the specified port.

Emitted after SerialPort.forget() has been called. This event can be used to help maintain persistent storage of permissions when setDevicePermissionHandler is used.

Emitted when a USB device needs to be selected when a call to navigator.usb.requestDevice is made. callback should be called with deviceId to be selected; passing no arguments to callback will cancel the request. Additionally, permissioning on navigator.usb can be further managed by using ses.setPermissionCheckHandler(handler) and ses.setDevicePermissionHandler(handler).

Emitted after navigator.usb.requestDevice has been called and select-usb-device has fired if a new device becomes available before the callback from select-usb-device is called. This event is intended for use when using a UI to ask users to pick a device so that the UI can be updated with the newly added device.

Emitted after navigator.usb.requestDevice has been called and select-usb-device has fired if a device has been removed before the callback from select-usb-device is called. This event is intended for use when using a UI to ask users to pick a device so that the UI can be updated to remove the specified device.

Emitted after USBDevice.forget() has been called. This event can be used to help maintain persistent storage of permissions when setDevicePermissionHandler is used.

The following methods are available on instances of Session:

Returns Promise<Integer> - the session's current cache size, in bytes.

Returns Promise<void> - resolves when the cache clear operation is complete.

Clears the session’s HTTP cache.

Returns Promise<void> - resolves when the storage data has been cleared.

Writes any unwritten DOMStorage data to disk.

Returns Promise<void> - Resolves when the proxy setting process is complete.

Sets the proxy settings.

You may need ses.closeAllConnections to close currently in flight connections to prevent pooled sockets using previous proxy from being reused by future requests.

Returns Promise<ResolvedHost> - Resolves with the resolved IP addresses for the host.

Returns Promise<string> - Resolves with the proxy information for url.

Returns Promise<void> - Resolves when the all internal states of proxy service is reset and the latest proxy configuration is reapplied if it's already available. The pac script will be fetched from pacScript again if the proxy mode is pac_script.

Sets download saving directory. By default, the download directory will be the Downloads under the respective app folder.

Emulates network with the given configuration for the session.

Preconnects the given number of sockets to an origin.

Returns Promise<void> - Resolves when all connections are closed.

It will terminate / fail all requests currently in flight.

Returns Promise<GlobalResponse> - see Response.

Sends a request, similarly to how fetch() works in the renderer, using Chrome's network stack. This differs from Node's fetch(), which uses Node.js's HTTP stack.

See also net.fetch(), a convenience method which issues requests from the default session.

See the MDN documentation for fetch() for more details.

By default, requests made with net.fetch can be made to custom protocols as well as file:, and will trigger webRequest handlers if present. When the non-standard bypassCustomProtocolHandlers option is set in RequestInit, custom protocol handlers will not be called for this request. This allows forwarding an intercepted request to the built-in handler. webRequest handlers will still be triggered when bypassing custom protocols.

Disables any network emulation already active for the session. Resets to the original network configuration.

Sets the certificate verify proc for session, the proc will be called with proc(request, callback) whenever a server certificate verification is requested. Calling callback(0) accepts the certificate, calling callback(-2) rejects it.

Calling setCertificateVerifyProc(null) will revert back to default certificate verify proc.

NOTE: The result of this procedure is cached by the network service.

Sets the handler which can be used to respond to permission requests for the session. Calling callback(true) will allow the permission and callback(false) will reject it. To clear the handler, call setPermissionRequestHandler(null). Please note that you must also implement setPermissionCheckHandler to get complete permission handling. Most web APIs do a permission check and then make a permission request if the check is denied.

Sets the handler which can be used to respond to permission checks for the session. Returning true will allow the permission and false will reject it. Please note that you must also implement setPermissionRequestHandler to get complete permission handling. Most web APIs do a permission check and then make a permission request if the check is denied. To clear the handler, call setPermissionCheckHandler(null).

isMainFrame will always be false for a fileSystem request as a result of Chromium limitations.

This handler will be called when web content requests access to display media via the navigator.mediaDevices.getDisplayMedia API. Use the desktopCapturer API to choose which stream(s) to grant access to.

useSystemPicker allows an application to use the system picker instead of providing a specific video source from getSources. This option is experimental, and currently available for MacOS 15+ only. If the system picker is available and useSystemPicker is set to true, the handler will not be invoked.

Passing a WebFrameMain object as a video or audio stream will capture the video or audio stream from that frame.

Passing null instead of a function resets the handler to its default state.

Sets the handler which can be used to respond to device permission checks for the session. Returning true will allow the device to be permitted and false will reject it. To clear the handler, call setDevicePermissionHandler(null). This handler can be used to provide default permissioning to devices without first calling for permission to devices (eg via navigator.hid.requestDevice). If this handler is not defined, the default device permissions as granted through device selection (eg via navigator.hid.requestDevice) will be used. Additionally, the default behavior of Electron is to store granted device permission in memory. If longer term storage is needed, a developer can store granted device permissions (eg when handling the select-hid-device event) and then read from that storage with setDevicePermissionHandler.

Sets the handler which can be used to override which USB classes are protected. The return value for the handler is a string array of USB classes which should be considered protected (eg not available in the renderer). Valid values for the array are:

Returning an empty string array from the handler will allow all USB classes; returning the passed in array will maintain the default list of protected USB classes (this is also the default behavior if a handler is not defined). To clear the handler, call setUSBProtectedClassesHandler(null).

Sets a handler to respond to Bluetooth pairing requests. This handler allows developers to handle devices that require additional validation before pairing. When a handler is not defined, any pairing on Linux or Windows that requires additional validation will be automatically cancelled. macOS does not require a handler because macOS handles the pairing automatically. To clear the handler, call setBluetoothPairingHandler(null).

Returns Promise<void> - Resolves when the operation is complete.

Clears the host resolver cache.

Dynamically sets whether to always send credentials for HTTP NTLM or Negotiate authentication.

Overrides the userAgent and acceptLanguages for this session.

The acceptLanguages must a comma separated ordered list of language codes, for example "en-US,fr,de,ko,zh-CN,ja".

This doesn't affect existing WebContents, and each WebContents can use webContents.setUserAgent to override the session-wide user agent.

Returns boolean - Whether or not this session is a persistent one. The default webContents session of a BrowserWindow is persistent. When creating a session from a partition, session prefixed with persist: will be persistent, while others will be temporary.

Returns string - The user agent for this session.

Sets the SSL configuration for the session. All subsequent network requests will use the new configuration. Existing network connections (such as WebSocket connections) will not be terminated, but old sockets in the pool will not be reused for new connections.

Returns Promise<Buffer> - resolves with blob data.

Initiates a download of the resource at url. The API will generate a DownloadItem that can be accessed with the will-download event.

This does not perform any security checks that relate to a page's origin, unlike webContents.downloadURL.

Allows resuming cancelled or interrupted downloads from previous Session. The API will generate a DownloadItem that can be accessed with the will-download event. The DownloadItem will not have any WebContents associated with it and the initial state will be interrupted. The download will start only when the resume API is called on the DownloadItem.

Returns Promise<void> - resolves when the session’s HTTP authentication cache has been cleared.

Adds scripts that will be executed on ALL web contents that are associated with this session just before normal preload scripts run.

Deprecated: Use the new ses.registerPreloadScript API.

Returns string[] an array of paths to preload scripts that have been registered.

Deprecated: Use the new ses.getPreloadScripts API. This will only return preload script paths for frame context types.

Registers preload script that will be executed in its associated context type in this session. For frame contexts, this will run prior to any preload defined in the web preferences of a WebContents.

Returns string - The ID of the registered preload script.

Returns PreloadScript[]: An array of paths to preload scripts that have been registered.

Sets the directory to store the generated JS code cache for this session. The directory is not required to be created by the user before this call, the runtime will create if it does not exist otherwise will use the existing directory. If directory cannot be created, then code cache will not be used and all operations related to code cache will fail silently inside the runtime. By default, the directory will be Code Cache under the respective user data folder.

Note that by default code cache is only enabled for http(s) URLs, to enable code cache for custom protocols, codeCache: true and standard: true must be specified when registering the protocol.

Returns Promise<void> - resolves when the code cache clear operation is complete.

Returns Promise<SharedDictionaryUsageInfo[]> - an array of shared dictionary information entries in Chromium's networking service's storage.

Shared dictionaries are used to power advanced compression of data sent over the wire, specifically with Brotli and ZStandard. You don't need to call any of the shared dictionary APIs in Electron to make use of this advanced web feature, but if you do, they allow deeper control and inspection of the shared dictionaries used during decompression.

To get detailed information about a specific shared dictionary entry, call getSharedDictionaryInfo(options).

Returns Promise<SharedDictionaryInfo[]> - an array of shared dictionary information entries in Chromium's networking service's storage.

To get information about all present shared dictionaries, call getSharedDictionaryUsageInfo().

Returns Promise<void> - resolves when the dictionary cache has been cleared, both in memory and on disk.

Returns Promise<void> - resolves when the dictionary cache has been cleared for the specified isolation key, both in memory and on disk.

Sets whether to enable the builtin spell checker.

Returns boolean - Whether the builtin spell checker is enabled.

The built in spellchecker does not automatically detect what language a user is typing in. In order for the spell checker to correctly check their words you must call this API with an array of language codes. You can get the list of supported language codes with the ses.availableSpellCheckerLanguages property.

On macOS, the OS spellchecker is used and will detect your language automatically. This API is a no-op on macOS.

Returns string[] - An array of language codes the spellchecker is enabled for. If this list is empty the spellchecker will fallback to using en-US. By default on launch if this setting is an empty list Electron will try to populate this setting with the current OS locale. This setting is persisted across restarts.

On macOS, the OS spellchecker is used and has its own list of languages. On macOS, this API will return whichever languages have been configured by the OS.

By default Electron will download hunspell dictionaries from the Chromium CDN. If you want to override this behavior you can use this API to point the dictionary downloader at your own hosted version of the hunspell dictionaries. We publish a hunspell_dictionaries.zip file with each release which contains the files you need to host here.

The file server must be case insensitive. If you cannot do this, you must upload each file twice: once with the case it has in the ZIP file and once with the filename as all lowercase.

If the files present in hunspell_dictionaries.zip are available at https://example.com/dictionaries/language-code.bdic then you should call this api with ses.setSpellCheckerDictionaryDownloadURL('https://example.com/dictionaries/'). Please note the trailing slash. The URL to the dictionaries is formed as ${url}${filename}.

On macOS, the OS spellchecker is used and therefore we do not download any dictionary files. This API is a no-op on macOS.

Returns Promise<string[]> - An array of all words in app's custom dictionary. Resolves when the full dictionary is loaded from disk.

Returns boolean - Whether the word was successfully written to the custom dictionary. This API will not work on non-persistent (in-memory) sessions.

On macOS and Windows, this word will be written to the OS custom dictionary as well.

Returns boolean - Whether the word was successfully removed from the custom dictionary. This API will not work on non-persistent (in-memory) sessions.

On macOS and Windows, this word will be removed from the OS custom dictionary as well.

Returns Promise<Extension> - resolves when the extension is loaded.

This method will raise an exception if the extension could not be loaded. If there are warnings when installing the extension (e.g. if the extension requests an API that Electron does not support) then they will be logged to the console.

Note that Electron does not support the full range of Chrome extensions APIs. See Supported Extensions APIs for more details on what is supported.

Note that in previous versions of Electron, extensions that were loaded would be remembered for future runs of the application. This is no longer the case: loadExtension must be called on every boot of your app if you want the extension to be loaded.

This API does not support loading packed (.crx) extensions.

This API cannot be called before the ready event of the app module is emitted.

Loading extensions into in-memory (non-persistent) sessions is not supported and will throw an error.

Deprecated: Use the new ses.extensions.loadExtension API.

Unloads an extension.

This API cannot be called before the ready event of the app module is emitted.

Deprecated: Use the new ses.extensions.removeExtension API.

Returns Extension | null - The loaded extension with the given ID.

This API cannot be called before the ready event of the app module is emitted.

Deprecated: Use the new ses.extensions.getExtension API.

Returns Extension[] - A list of all loaded extensions.

This API cannot be called before the ready event of the app module is emitted.

Deprecated: Use the new ses.extensions.getAllExtensions API.

Returns string | null - The absolute file system path where data for this session is persisted on disk. For in memory sessions this returns null.

Returns Promise<void> - resolves when all data has been cleared.

Clears various different types of data.

This method clears more types of data and is more thorough than the clearStorageData method.

Cookies are stored at a broader scope than origins. When removing cookies and filtering by origins (or excludeOrigins), the cookies will be removed at the registrable domain level. For example, clearing cookies for the origin https://really.specific.origin.example.com/ will end up clearing all cookies for example.com. Clearing cookies for the origin https://my.website.example.co.uk/ will end up clearing all cookies for example.co.uk.

Clearing cache data will also clear the shared dictionary cache. This means that any dictionaries used for compression may be reloaded after clearing the cache. If you wish to clear the shared dictionary cache but leave other cached data intact, you may want to use the clearSharedDictionaryCache method.

For more information, refer to Chromium's BrowsingDataRemover interface.

The following properties are available on instances of Session:

A string[] array which consists of all the known available spell checker languages. Providing a language code to the setSpellCheckerLanguages API that isn't in this array will result in an error.

A boolean indicating whether builtin spell checker is enabled.

A string | null indicating the absolute file system path where data for this session is persisted on disk. For in memory sessions this returns null.

A Cookies object for this session.

A Extensions object for this session.

A ServiceWorkers object for this session.

A WebRequest object for this session.

A Protocol object for this session.

A NetLog object for this session.

**Examples:**

Example 1 (javascript):
```javascript
const { BrowserWindow } = require('electron')const win = new BrowserWindow({ width: 800, height: 600 })win.loadURL('https://github.com')const ses = win.webContents.sessionconsole.log(ses.getUserAgent())
```

Example 2 (javascript):
```javascript
const { session } = require('electron')const ses = session.fromPartition('persist:name')console.log(ses.getUserAgent())
```

Example 3 (javascript):
```javascript
const { session } = require('electron')session.defaultSession.on('will-download', (event, item, webContents) => {  event.preventDefault()  require('got')(item.getURL()).then((response) => {    require('node:fs').writeFileSync('/somewhere', response.body)  })})
```

Example 4 (javascript):
```javascript
const { app, dialog, BrowserWindow, session } = require('electron')async function createWindow () {  const mainWindow = new BrowserWindow()  await mainWindow.loadURL('https://buzzfeed.com')  session.defaultSession.on('file-system-access-restricted', async (e, details, callback) => {    const { origin, path } = details    const { response } = await dialog.showMessageBox({      message: `Are you sure you want ${origin} to open restricted path ${path}?`,      title: 'File System Access Restricted',      buttons: ['Choose a different folder', 'Allow', 'Cancel'],      cancelId: 2    })    if (response === 0) {      callback('tryAgain')    } else if (response === 1) {      callback('allow')    } else {      callback('deny')    }  })  mainWindow.webContents.executeJavaScript(`    window.showDirectoryPicker({      id: 'electron-demo',      mode: 'readwrite',      startIn: 'downloads',    }).catch(e => {      console.log(e)    })`, true  )}app.whenReady().then(() => {  createWindow()  app.on('activate', () => {    if (BrowserWindow.getAllWindows().length === 0) createWindow()  })})app.on('window-all-closed', function () {  if (process.platform !== 'darwin') app.quit()})
```

---

## MenuItem

**URL:** https://www.electronjs.org/docs/latest/api/menu-item

**Contents:**
- MenuItem
- Class: MenuItem​
  - new MenuItem(options)​
  - Instance Properties​
    - menuItem.id​
    - menuItem.label​
    - menuItem.click​
    - menuItem.submenu​
    - menuItem.type​
    - menuItem.role​

Add items to native application menus and context menus.

See Menu for examples.

Electron's built-in classes cannot be subclassed in user code. For more information, see the FAQ.

acceleratorWorksWhenHidden is specified as being macOS-only because accelerators always work when items are hidden on Windows and Linux. The option is exposed to users to give them the option to turn it off, as this is possible in native macOS development.

The following properties are available on instances of MenuItem:

A string indicating the item's unique id. This property can be dynamically changed.

A string indicating the item's visible label.

A Function that is fired when the MenuItem receives a click event. It can be called with menuItem.click(event, focusedWindow, focusedWebContents).

A Menu (optional) containing the menu item's submenu, if present.

A string indicating the type of the item. Can be normal, separator, submenu, checkbox, radio, header or palette.

header and palette are only available on macOS 14 and up.

A string (optional) indicating the item's role, if set. Can be undo, redo, cut, copy, paste, pasteAndMatchStyle, delete, selectAll, reload, forceReload, toggleDevTools, resetZoom, zoomIn, zoomOut, toggleSpellChecker, togglefullscreen, window, minimize, close, help, about, services, hide, hideOthers, unhide, quit, startSpeaking, stopSpeaking, zoom, front, appMenu, fileMenu, editMenu, viewMenu, shareMenu, recentDocuments, toggleTabBar, selectNextTab, selectPreviousTab, showAllTabs, mergeAllWindows, clearRecentDocuments, moveTabToNewWindow or windowMenu

An Accelerator (optional) indicating the item's accelerator, if set.

An Accelerator | null indicating the item's user-assigned accelerator for the menu item.

This property is only initialized after the MenuItem has been added to a Menu. Either via Menu.buildFromTemplate or via Menu.append()/insert(). Accessing before initialization will just return null.

A NativeImage | string (optional) indicating the item's icon, if set.

A string indicating the item's sublabel.

A string indicating the item's hover text.

A boolean indicating whether the item is enabled. This property can be dynamically changed.

A boolean indicating whether the item is visible. This property can be dynamically changed.

A boolean indicating whether the item is checked. This property can be dynamically changed.

A checkbox menu item will toggle the checked property on and off when selected.

A radio menu item will turn on its checked property when clicked, and will turn off that property for all adjacent items in the same menu.

You can add a click function for additional behavior.

A boolean indicating if the accelerator should be registered with the system or just displayed.

This property can be dynamically changed.

A SharingItem indicating the item to share when the role is shareMenu.

This property can be dynamically changed.

A number indicating an item's sequential unique id.

A Menu that the item is a part of.

---

## JumpListCategory Object

**URL:** https://www.electronjs.org/docs/latest/api/structures/jump-list-category

**Contents:**
- JumpListCategory Object

If a JumpListCategory object has neither the type nor the name property set then its type is assumed to be tasks. If the name property is set but the type property is omitted then the type is assumed to be custom.

The maximum length of a Jump List item's description property is 260 characters. Beyond this limit, the item will not be added to the Jump List, nor will it be displayed.

---

## WebContentsView

**URL:** https://www.electronjs.org/docs/latest/api/web-contents-view

**Contents:**
- WebContentsView
- Class: WebContentsView extends View​
  - new WebContentsView([options])​
  - Instance Properties​
    - view.webContents Readonly​

A View that displays a WebContents.

This module cannot be used until the ready event of the app module is emitted.

A View that displays a WebContents.

WebContentsView inherits from View.

WebContentsView is an EventEmitter.

Electron's built-in classes cannot be subclassed in user code. For more information, see the FAQ.

Creates a WebContentsView.

Objects created with new WebContentsView have the following properties, in addition to those inherited from View:

A WebContents property containing a reference to the displayed WebContents. Use this to interact with the WebContents, for instance to load a URL.

**Examples:**

Example 1 (javascript):
```javascript
const { BaseWindow, WebContentsView } = require('electron')const win = new BaseWindow({ width: 800, height: 400 })const view1 = new WebContentsView()win.contentView.addChildView(view1)view1.webContents.loadURL('https://electronjs.org')view1.setBounds({ x: 0, y: 0, width: 400, height: 400 })const view2 = new WebContentsView()win.contentView.addChildView(view2)view2.webContents.loadURL('https://github.com/electron/electron')view2.setBounds({ x: 400, y: 0, width: 400, height: 400 })
```

Example 2 (javascript):
```javascript
const { WebContentsView } = require('electron')const view = new WebContentsView()view.webContents.loadURL('https://electronjs.org/')
```

---
