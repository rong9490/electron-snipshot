# Electron - Main Process

**Pages:** 28

---

## Class: Dock

**URL:** https://www.electronjs.org/docs/latest/api/dock

**Contents:**
- Class: Dock
- Class: Dock​
  - Instance Methods​
    - dock.bounce([type]) macOS​
    - dock.cancelBounce(id) macOS​
    - dock.downloadFinished(filePath) macOS​
    - dock.setBadge(text) macOS​
    - dock.getBadge() macOS​
    - dock.hide() macOS​
    - dock.show() macOS​

Control your app in the macOS dock

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

See also: A detailed guide about how to implement Dock menus.

Returns Integer - an ID representing the request.

When critical is passed, the dock icon will bounce until either the application becomes active or the request is canceled.

When informational is passed, the dock icon will bounce for one second. However, the request remains active until either the application becomes active or the request is canceled.

This method can only be used while the app is not focused; when the app is focused it will return -1.

Cancel the bounce of id.

Bounces the Downloads stack if the filePath is inside the Downloads folder.

Sets the string to be displayed in the dock’s badging area.

You need to ensure that your application has the permission to display notifications for this method to work.

Returns string - The badge string of the dock.

Returns Promise<void> - Resolves when the dock icon is shown.

Returns boolean - Whether the dock icon is visible.

Sets the application's dock menu.

Returns Menu | null - The application's dock menu.

Sets the image associated with this dock icon.

---

## inAppPurchase

**URL:** https://www.electronjs.org/docs/latest/api/in-app-purchase

**Contents:**
- inAppPurchase
- Events​
  - Event: 'transactions-updated'​
- Methods​
  - inAppPurchase.purchaseProduct(productID[, opts])​
  - inAppPurchase.getProducts(productIDs)​
  - inAppPurchase.canMakePayments()​
  - inAppPurchase.restoreCompletedTransactions()​
  - inAppPurchase.getReceiptURL()​
  - inAppPurchase.finishAllTransactions()​

In-app purchases on Mac App Store.

The inAppPurchase module emits the following events:

Emitted when one or more transactions have been updated.

The inAppPurchase module has the following methods:

Returns Promise<boolean> - Returns true if the product is valid and added to the payment queue.

You should listen for the transactions-updated event as soon as possible and certainly before you call purchaseProduct.

Returns Promise<Product[]> - Resolves with an array of Product objects.

Retrieves the product descriptions.

Returns boolean - whether a user can make a payment.

Restores finished transactions. This method can be called either to install purchases on additional devices, or to restore purchases for an application that the user deleted and reinstalled.

The payment queue delivers a new transaction for each previously completed transaction that can be restored. Each transaction includes a copy of the original transaction.

Returns string - the path to the receipt.

Completes all pending transactions.

Completes the pending transactions corresponding to the date.

---

## MessageChannelMain

**URL:** https://www.electronjs.org/docs/latest/api/message-channel-main

**Contents:**
- MessageChannelMain
- Class: MessageChannelMain​
  - Instance Properties​
    - channel.port1​
    - channel.port2​

MessageChannelMain is the main-process-side equivalent of the DOM MessageChannel object. Its singular function is to create a pair of connected MessagePortMain objects.

See the Channel Messaging API documentation for more information on using channel messaging.

Channel interface for channel messaging in the main process.

Electron's built-in classes cannot be subclassed in user code. For more information, see the FAQ.

A MessagePortMain property.

A MessagePortMain property.

**Examples:**

Example 1 (javascript):
```javascript
// Main processconst { BrowserWindow, MessageChannelMain } = require('electron')const w = new BrowserWindow()const { port1, port2 } = new MessageChannelMain()w.webContents.postMessage('port', null, [port2])port1.postMessage({ some: 'message' })// Renderer processconst { ipcRenderer } = require('electron')ipcRenderer.on('port', (e) => {  // e.ports is a list of ports sent along with this message  e.ports[0].onmessage = (messageEvent) => {    console.log(messageEvent.data)  }})
```

---

## Class: TouchBarSlider

**URL:** https://www.electronjs.org/docs/latest/api/touch-bar-slider

**Contents:**
- Class: TouchBarSlider
- Class: TouchBarSlider​
  - new TouchBarSlider(options)​
  - Instance Properties​
    - touchBarSlider.label​
    - touchBarSlider.value​
    - touchBarSlider.minValue​
    - touchBarSlider.maxValue​

Create a slider in the touch bar for native macOS applications

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

The following properties are available on instances of TouchBarSlider:

A string representing the slider's current text. Changing this value immediately updates the slider in the touch bar.

A number representing the slider's current value. Changing this value immediately updates the slider in the touch bar.

A number representing the slider's current minimum value. Changing this value immediately updates the slider in the touch bar.

A number representing the slider's current maximum value. Changing this value immediately updates the slider in the touch bar.

---

## MessagePortMain

**URL:** https://www.electronjs.org/docs/latest/api/message-port-main

**Contents:**
- MessagePortMain
- Class: MessagePortMain​
  - Instance Methods​
    - port.postMessage(message, [transfer])​
    - port.start()​
    - port.close()​
  - Instance Events​
    - Event: 'message'​
    - Event: 'close'​

MessagePortMain is the main-process-side equivalent of the DOM MessagePort object. It behaves similarly to the DOM version, with the exception that it uses the Node.js EventEmitter event system, instead of the DOM EventTarget system. This means you should use port.on('message', ...) to listen for events, instead of port.onmessage = ... or port.addEventListener('message', ...)

See the Channel Messaging API documentation for more information on using channel messaging.

MessagePortMain is an EventEmitter.

Port interface for channel messaging in the main process.

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

Sends a message from the port, and optionally, transfers ownership of objects to other browsing contexts.

Starts the sending of messages queued on the port. Messages will be queued until this method is called.

Disconnects the port, so it is no longer active.

Emitted when a MessagePortMain object receives a message.

Emitted when the remote end of a MessagePortMain object becomes disconnected.

---

## BrowserWindow

**URL:** https://www.electronjs.org/docs/latest/api/browser-window

**Contents:**
- BrowserWindow
- Window customization​
- Showing the window gracefully​
  - Using the ready-to-show event​
  - Setting the backgroundColor property​
- Parent and child windows​
- Modal windows​
- Page visibility​
- Platform notices​
- Class: BrowserWindow extends BaseWindow​

Create and control browser windows.

This module cannot be used until the ready event of the app module is emitted.

The BrowserWindow class exposes various ways to modify the look and behavior of your app's windows. For more details, see the Window Customization tutorial.

When loading a page in the window directly, users may see the page load incrementally, which is not a good experience for a native app. To make the window display without a visual flash, there are two solutions for different situations.

While loading the page, the ready-to-show event will be emitted when the renderer process has rendered the page for the first time if the window has not been shown yet. Showing the window after this event will have no visual flash:

This event is usually emitted after the did-finish-load event, but for pages with many remote resources, it may be emitted before the did-finish-load event.

Please note that using this event implies that the renderer will be considered "visible" and paint even though show is false. This event will never fire if you use paintWhenInitiallyHidden: false

For a complex app, the ready-to-show event could be emitted too late, making the app feel slow. In this case, it is recommended to show the window immediately, and use a backgroundColor close to your app's background:

Note that even for apps that use ready-to-show event, it is still recommended to set backgroundColor to make the app feel more native.

Some examples of valid backgroundColor values include:

For more information about these color types see valid options in win.setBackgroundColor.

By using parent option, you can create child windows:

The child window will always show on top of the top window.

A modal window is a child window that disables parent window. To create a modal window, you have to set both the parent and modal options:

The Page Visibility API works as follows:

It is recommended that you pause expensive operations when the visibility state is hidden in order to minimize power consumption.

Create and control browser windows.

BrowserWindow is an EventEmitter.

It creates a new BrowserWindow with native properties as set by the options.

Electron's built-in classes cannot be subclassed in user code. For more information, see the FAQ.

Objects created with new BrowserWindow emit the following events:

Some events are only available on specific operating systems and are labeled as such.

Emitted when the document changed its title, calling event.preventDefault() will prevent the native window's title from changing. explicitSet is false when title is synthesized from file URL.

Emitted when the window is going to be closed. It's emitted before the beforeunload and unload event of the DOM. Calling event.preventDefault() will cancel the close.

Usually you would want to use the beforeunload handler to decide whether the window should be closed, which will also be called when the window is reloaded. In Electron, returning any value other than undefined would cancel the close. For example:

There is a subtle difference between the behaviors of window.onbeforeunload = handler and window.addEventListener('beforeunload', handler). It is recommended to always set the event.returnValue explicitly, instead of only returning a value, as the former works more consistently within Electron.

Emitted when the window is closed. After you have received this event you should remove the reference to the window and avoid using it any more.

Emitted when a session is about to end due to a shutdown, machine restart, or user log-off. Calling event.preventDefault() can delay the system shutdown, though it’s generally best to respect the user’s choice to end the session. However, you may choose to use it if ending the session puts the user at risk of losing data.

Emitted when a session is about to end due to a shutdown, machine restart, or user log-off. Once this event fires, there is no way to prevent the session from ending.

Emitted when the web page becomes unresponsive.

Emitted when the unresponsive web page becomes responsive again.

Emitted when the window loses focus.

Emitted when the window gains focus.

Emitted when the window is shown.

Emitted when the window is hidden.

Emitted when the web page has been rendered (while not being shown) and window can be displayed without a visual flash.

Please note that using this event implies that the renderer will be considered "visible" and paint even though show is false. This event will never fire if you use paintWhenInitiallyHidden: false

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

Emitted when the window enters a full-screen state triggered by HTML API.

Emitted when the window leaves a full-screen state triggered by HTML API.

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

The BrowserWindow class has the following static methods:

Returns BrowserWindow[] - An array of all opened browser windows.

Returns BrowserWindow | null - The window that is focused in this application, otherwise returns null.

Returns BrowserWindow | null - The window that owns the given webContents or null if the contents are not owned by a window.

The BrowserView class is deprecated, and replaced by the new WebContentsView class.

Returns BrowserWindow | null - The window that owns the given browserView. If the given view is not attached to any window, returns null.

Returns BrowserWindow | null - The window with the given id.

Objects created with new BrowserWindow have the following properties:

A WebContents object this window owns. All web page related events and operations will be done via it.

See the webContents documentation for its methods and events.

A Integer property representing the unique ID of the window. Each ID is unique among all BrowserWindow instances of the entire Electron application.

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

Objects created with new BrowserWindow have the following instance methods:

Some methods are only available on specific operating systems and are labeled as such.

Force closing the window, the unload and beforeunload event won't be emitted for the web page, and close event will also not be emitted for this window, but it guarantees the closed event will be emitted.

Try to close the window. This has the same effect as a user manually clicking the close button of the window. The web page may cancel the close though. See the close event.

Focuses on the window.

On Wayland (Linux), the desktop environment may show a notification or flash the app icon if the window or app is not already focused.

Removes focus from the window.

Not supported on Wayland (Linux).

Returns boolean - Whether the window is focused.

Returns boolean - Whether the window is destroyed.

Shows and gives focus to the window.

Shows the window but doesn't focus on it.

Not supported on Wayland (Linux).

Returns boolean - Whether the window is visible to the user in the foreground of the app.

Returns boolean - Whether current window is a modal window.

Maximizes the window. This will also show (but not focus) the window if it isn't being displayed already.

Unmaximizes the window.

Returns boolean - Whether the window is maximized.

Minimizes the window. On some platforms the minimized window will be shown in the Dock.

Restores the window from minimized state to its previous state.

Returns boolean - Whether the window is minimized.

Sets whether the window should be in fullscreen mode.

On macOS, fullscreen transitions take place asynchronously. If further actions depend on the fullscreen state, use the 'enter-full-screen' or 'leave-full-screen' events.

Returns boolean - Whether the window is in fullscreen mode.

On macOS, fullscreen transitions take place asynchronously. When querying for a BrowserWindow's fullscreen status, you should ensure that either the 'enter-full-screen' or 'leave-full-screen' events have been emitted.

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

On Wayland (Linux), has the same limitations as setSize and setPosition.

On macOS, the y-coordinate value cannot be smaller than the Tray height. The tray height has changed over time and depends on the operating system, but is between 20-40px. Passing a value lower than the tray height will result in a window that is flush to the tray.

Returns Rectangle - The bounds of the window as Object.

On macOS, the y-coordinate value returned will be at minimum the Tray height. For example, calling win.setBounds({ x: 25, y: 20, width: 800, height: 600 }) with a tray height of 38 means that win.getBounds() will return { x: 25, y: 38, width: 800, height: 600 }.

Returns string - Gets the background color of the window in Hex (#RRGGBB) format.

See Setting backgroundColor.

The alpha value is not returned alongside the red, green, and blue values.

Resizes and moves the window's client area (e.g. the web page) to the supplied bounds.

On Wayland (Linux), has the same limitations as setContentSize and setPosition.

Returns Rectangle - The bounds of the window's client area as Object.

Returns Rectangle - Contains the window bounds of the normal state

Whatever the current state of the window (maximized, minimized or in fullscreen), this function always returns the position and size of the window in normal state. In normal state, getBounds and getNormalBounds return the same Rectangle.

Disable or enable the window.

Returns boolean - whether the window is enabled.

Resizes the window to width and height. If width or height are below any set minimum size constraints the window will snap to its minimum size.

On Wayland (Linux), may not work as some window managers restrict programmatic window resizing.

Returns Integer[] - Contains the window's width and height.

Resizes the window's client area (e.g. the web page) to width and height.

On Wayland (Linux), may not work as some window managers restrict programmatic window resizing.

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

Moves window to top(z-order) regardless of focus.

Not supported on Wayland (Linux).

Moves window to the center of the screen.

Not supported on Wayland (Linux).

Moves window to x and y.

Not supported on Wayland (Linux).

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

Returns Promise<NativeImage> - Resolves with a NativeImage

Captures a snapshot of the page within rect. Omitting rect will capture the whole visible page. If the page is not visible, rect may be empty. The page is considered visible when its browser window is hidden and the capturer count is non-zero. If you would like the page to stay hidden, you should ensure that stayHidden is set to true.

Returns Promise<void> - the promise will resolve when the page has finished loading (see did-finish-load), and rejects if the page fails to load (see did-fail-load). A noop rejection handler is already attached, which avoids unhandled rejection errors. If the existing page has a beforeUnload handler, did-fail-load will be called unless will-prevent-unload is handled.

Same as webContents.loadURL(url[, options]).

The url can be a remote address (e.g. http://) or a path to a local HTML file using the file:// protocol.

To ensure that file URLs are properly formatted, it is recommended to use Node's url.format method:

You can load a URL using a POST request with URL-encoded data by doing the following:

Returns Promise<void> - the promise will resolve when the page has finished loading (see did-finish-load), and rejects if the page fails to load (see did-fail-load).

Same as webContents.loadFile, filePath should be a path to an HTML file relative to the root of your application. See the webContents docs for more information.

Same as webContents.reload.

Sets the menu as the window's menu bar.

Remove the window's menu bar.

Sets progress value in progress bar. Valid range is [0, 1.0].

Remove progress bar when progress < 0; Change to indeterminate mode when progress > 1.

On Linux platform, only supports Unity desktop environment, you need to specify the *.desktop file name to desktopName field in package.json. By default, it will assume {app.name}.desktop.

On Windows, a mode can be passed. Accepted values are none, normal, indeterminate, error, and paused. If you call setProgressBar without a mode set (but with a value within the valid range), normal will be assumed.

Sets a 16 x 16 pixel overlay onto the current taskbar icon, usually used to convey some sort of application status or to passively notify the user.

Invalidates the window shadow so that it is recomputed based on the current window shape.

BrowserWindows that are transparent can sometimes leave behind visual artifacts on macOS. This method can be used to clear these artifacts when, for example, performing an animation.

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

Same as webContents.showDefinitionForSelection().

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

On Windows, it calls SetWindowDisplayAffinity with WDA_EXCLUDEFROMCAPTURE. For Windows 10 version 2004 and up the window will be removed from capture entirely, older Windows versions behave as if WDA_MONITOR is applied capturing a black window.

On macOS, it sets the NSWindow's sharingType to NSWindowSharingNone. Unfortunately, due to an intentional change in macOS, newer Mac applications that use ScreenCaptureKit will capture your window despite win.setContentProtection(true). See here.

Returns boolean - whether or not content protection is currently enabled.

Changes whether the window can be focused.

On macOS it does not remove the focus from the window.

Returns boolean - Whether the window can be focused.

Sets parent as current window's parent window, passing null will turn current window into a top-level window.

Returns BrowserWindow | null - The parent window or null if there is no parent.

Returns BrowserWindow[] - All child windows.

Controls whether to hide cursor when typing.

Selects the previous tab when native tabs are enabled and there are other tabs in the window.

Selects the next tab when native tabs are enabled and there are other tabs in the window.

Shows or hides the tab overview when native tabs are enabled.

Merges all windows into one window with multiple tabs when native tabs are enabled and there is more than one open window.

Moves the current tab into a new window if native tabs are enabled and there is more than one tab in the current window.

Toggles the visibility of the tab bar if native tabs are enabled and there is only one tab in the current window.

Adds a window as a tab on this window, after the tab for the window instance.

Adds a vibrancy effect to the browser window. Passing null or an empty string will remove the vibrancy effect on the window. The animationDuration parameter only animates fading in or fading out the vibrancy effect. Animating between different types of vibrancy is not supported.

This method sets the browser window's system-drawn background material, including behind the non-client area.

See the Windows documentation for more details.

This method is only supported on Windows 11 22H2 and up.

Set a custom position for the traffic light buttons in frameless window. Passing null will reset the position to default.

Returns Point | null - The custom position for the traffic light buttons in frameless window, null will be returned when there is no custom position.

Sets the touchBar layout for the current window. Specifying null or undefined clears the touch bar. This method only has an effect if the machine has a touch bar.

The TouchBar API is currently experimental and may change or be removed in future Electron releases.

The BrowserView class is deprecated, and replaced by the new WebContentsView class.

Returns BrowserView | null - The BrowserView attached to win. Returns null if one is not attached. Throws an error if multiple BrowserViews are attached.

The BrowserView class is deprecated, and replaced by the new WebContentsView class.

Replacement API for setBrowserView supporting work with multi browser views.

The BrowserView class is deprecated, and replaced by the new WebContentsView class.

The BrowserView class is deprecated, and replaced by the new WebContentsView class.

Raises browserView above other BrowserViews attached to win. Throws an error if browserView is not attached to win.

The BrowserView class is deprecated, and replaced by the new WebContentsView class.

Returns BrowserView[] - a sorted by z-index array of all BrowserViews that have been attached with addBrowserView or setBrowserView. The top-most BrowserView is the last element of the array.

The BrowserView class is deprecated, and replaced by the new WebContentsView class.

On a window with Window Controls Overlay already enabled, this method updates the style of the title bar overlay.

On Linux, the symbolColor is automatically calculated to have minimum accessible contrast to the color if not explicitly set.

**Examples:**

Example 1 (css):
```css
// In the main process.const { BrowserWindow } = require('electron')const win = new BrowserWindow({ width: 800, height: 600 })// Load a remote URLwin.loadURL('https://github.com')// Or load a local HTML filewin.loadFile('index.html')
```

Example 2 (javascript):
```javascript
const { BrowserWindow } = require('electron')const win = new BrowserWindow({ show: false })win.once('ready-to-show', () => {  win.show()})
```

Example 3 (javascript):
```javascript
const { BrowserWindow } = require('electron')const win = new BrowserWindow({ backgroundColor: '#2e2c29' })win.loadURL('https://github.com')
```

Example 4 (javascript):
```javascript
const win = new BrowserWindow()win.setBackgroundColor('hsl(230, 100%, 50%)')win.setBackgroundColor('rgb(255, 145, 145)')win.setBackgroundColor('#ff00a3')win.setBackgroundColor('blueviolet')
```

---

## ipcMain

**URL:** https://www.electronjs.org/docs/latest/api/ipc-main

**Contents:**
- ipcMain
- Sending messages​
- Methods​
  - ipcMain.on(channel, listener)​
  - ipcMain.off(channel, listener)​
  - ipcMain.once(channel, listener)​
  - ipcMain.addListener(channel, listener)​
  - ipcMain.removeListener(channel, listener)​
  - ipcMain.removeAllListeners([channel])​
  - ipcMain.handle(channel, listener)​

Communicate asynchronously from the main process to renderer processes.

The ipcMain module is an Event Emitter. When used in the main process, it handles asynchronous and synchronous messages sent from a renderer process (web page). Messages sent from a renderer will be emitted to this module.

For usage examples, check out the IPC tutorial.

It is also possible to send messages from the main process to the renderer process, see webContents.send for more information.

The ipcMain module has the following methods to listen for events:

Listens to channel, when a new message arrives listener would be called with listener(event, args...).

Removes the specified listener from the listener array for the specified channel.

Adds a one time listener function for the event. This listener is invoked only the next time a message is sent to channel, after which it is removed.

Alias for ipcMain.on.

Alias for ipcMain.off.

Removes all listeners from the specified channel. Removes all listeners from all channels if no channel is specified.

Adds a handler for an invokeable IPC. This handler will be called whenever a renderer calls ipcRenderer.invoke(channel, ...args).

If listener returns a Promise, the eventual result of the promise will be returned as a reply to the remote caller. Otherwise, the return value of the listener will be used as the value of the reply.

The event that is passed as the first argument to the handler is the same as that passed to a regular event listener. It includes information about which WebContents is the source of the invoke request.

Errors thrown through handle in the main process are not transparent as they are serialized and only the message property from the original error is provided to the renderer process. Please refer to #24427 for details.

Handles a single invokeable IPC message, then removes the listener. See ipcMain.handle(channel, listener).

Removes any handler for channel, if present.

**Examples:**

Example 1 (javascript):
```javascript
ipcMain.handle('my-invokable-ipc', async (event, ...args) => {  const result = await somePromise(...args)  return result})
```

Example 2 (javascript):
```javascript
async () => {  const result = await ipcRenderer.invoke('my-invokable-ipc', arg1, arg2)  // ...}
```

---

## Class: TouchBarLabel

**URL:** https://www.electronjs.org/docs/latest/api/touch-bar-label

**Contents:**
- Class: TouchBarLabel
- Class: TouchBarLabel​
  - new TouchBarLabel(options)​
  - Instance Properties​
    - touchBarLabel.label​
    - touchBarLabel.accessibilityLabel​
    - touchBarLabel.textColor​

Create a label in the touch bar for native macOS applications

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

When defining accessibilityLabel, ensure you have considered macOS best practices.

The following properties are available on instances of TouchBarLabel:

A string representing the label's current text. Changing this value immediately updates the label in the touch bar.

A string representing the description of the label to be read by a screen reader.

A string hex code representing the label's current text color. Changing this value immediately updates the label in the touch bar.

---

## Class: TouchBarButton

**URL:** https://www.electronjs.org/docs/latest/api/touch-bar-button

**Contents:**
- Class: TouchBarButton
- Class: TouchBarButton​
  - new TouchBarButton(options)​
  - Instance Properties​
    - touchBarButton.accessibilityLabel​
    - touchBarButton.label​
    - touchBarButton.backgroundColor​
    - touchBarButton.icon​
    - touchBarButton.iconPosition​
    - touchBarButton.enabled​

Create a button in the touch bar for native macOS applications

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

When defining accessibilityLabel, ensure you have considered macOS best practices.

The following properties are available on instances of TouchBarButton:

A string representing the description of the button to be read by a screen reader. Will only be read by screen readers if no label is set.

A string representing the button's current text. Changing this value immediately updates the button in the touch bar.

A string hex code representing the button's current background color. Changing this value immediately updates the button in the touch bar.

A NativeImage representing the button's current icon. Changing this value immediately updates the button in the touch bar.

A string - Can be left, right or overlay. Defaults to overlay.

A boolean representing whether the button is in an enabled state.

---

## Class: TouchBarPopover

**URL:** https://www.electronjs.org/docs/latest/api/touch-bar-popover

**Contents:**
- Class: TouchBarPopover
- Class: TouchBarPopover​
  - new TouchBarPopover(options)​
  - Instance Properties​
    - touchBarPopover.label​
    - touchBarPopover.icon​

Create a popover in the touch bar for native macOS applications

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

The following properties are available on instances of TouchBarPopover:

A string representing the popover's current button text. Changing this value immediately updates the popover in the touch bar.

A NativeImage representing the popover's current button icon. Changing this value immediately updates the popover in the touch bar.

---

## Class: CommandLine

**URL:** https://www.electronjs.org/docs/latest/api/command-line

**Contents:**
- Class: CommandLine
- Class: CommandLine​
  - Instance Methods​
    - commandLine.appendSwitch(switch[, value])​
    - commandLine.appendArgument(value)​
    - commandLine.hasSwitch(switch)​
    - commandLine.getSwitchValue(switch)​
    - commandLine.removeSwitch(switch)​

Manipulate the command line arguments for your app that Chromium reads

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

The following example shows how to check if the --disable-gpu flag is set.

For more information on what kinds of flags and switches you can use, check out the Command Line Switches document.

Append a switch (with optional value) to Chromium's command line.

This will not affect process.argv. The intended usage of this function is to control Chromium's behavior.

Append an argument to Chromium's command line. The argument will be quoted correctly. Switches will precede arguments regardless of appending order.

If you're appending an argument like --switch=value, consider using appendSwitch('switch', 'value') instead.

This will not affect process.argv. The intended usage of this function is to control Chromium's behavior.

Returns boolean - Whether the command-line switch is present.

Returns string - The command-line switch value.

This function is meant to obtain Chromium command line switches. It is not meant to be used for application-specific command line arguments. For the latter, please use process.argv.

When the switch is not present or has no value, it returns empty string.

Removes the specified switch from Chromium's command line.

This will not affect process.argv. The intended usage of this function is to control Chromium's behavior.

**Examples:**

Example 1 (javascript):
```javascript
const { app } = require('electron')app.commandLine.hasSwitch('disable-gpu')
```

Example 2 (javascript):
```javascript
const { app } = require('electron')app.commandLine.appendSwitch('remote-debugging-port', '8315')
```

Example 3 (javascript):
```javascript
const { app } = require('electron')app.commandLine.appendArgument('--enable-experimental-web-platform-features')
```

Example 4 (javascript):
```javascript
const { app } = require('electron')app.commandLine.appendSwitch('remote-debugging-port', '8315')const hasPort = app.commandLine.hasSwitch('remote-debugging-port')console.log(hasPort) // true
```

---

## Class: TouchBarOtherItemsProxy

**URL:** https://www.electronjs.org/docs/latest/api/touch-bar-other-items-proxy

**Contents:**
- Class: TouchBarOtherItemsProxy
- Class: TouchBarOtherItemsProxy​
  - new TouchBarOtherItemsProxy()​

Instantiates a special "other items proxy", which nests TouchBar elements inherited from Chromium at the space indicated by the proxy. By default, this proxy is added to each TouchBar at the end of the input. For more information, see the AppKit docs on NSTouchBarItemIdentifierOtherItemsProxy

Only one instance of this class can be added per TouchBar.

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

---

## webFrameMain

**URL:** https://www.electronjs.org/docs/latest/api/web-frame-main

**Contents:**
- webFrameMain
- Methods​
  - webFrameMain.fromId(processId, routingId)​
  - webFrameMain.fromFrameToken(processId, frameToken)​
- Class: WebFrameMain​
  - Instance Events​
    - Event: 'dom-ready'​
  - Instance Methods​
    - frame.executeJavaScript(code[, userGesture])​
    - frame.reload()​

Control web pages and iframes.

The webFrameMain module can be used to lookup frames across existing WebContents instances. Navigation events are the common use case.

You can also access frames of existing pages by using the mainFrame property of WebContents.

These methods can be accessed from the webFrameMain module:

Returns WebFrameMain | undefined - A frame with the given process and routing IDs, or undefined if there is no WebFrameMain associated with the given IDs.

Returns WebFrameMain | null - A frame with the given process and frame token, or null if there is no WebFrameMain associated with the given IDs.

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

Emitted when the document is loaded.

Returns Promise<unknown> - A promise that resolves with the result of the executed code or is rejected if execution throws or results in a rejected promise.

Evaluates code in page.

In the browser window some HTML APIs like requestFullScreen can only be invoked by a gesture from the user. Setting userGesture to true will remove this limitation.

Returns boolean - Whether the reload was initiated successfully. Only results in false when the frame has no history.

Returns boolean - Whether the frame is destroyed.

Send an asynchronous message to the renderer process via channel, along with arguments. Arguments will be serialized with the Structured Clone Algorithm, just like postMessage, so prototype chains will not be included. Sending Functions, Promises, Symbols, WeakMaps, or WeakSets will throw an exception.

The renderer process can handle the message by listening to channel with the ipcRenderer module.

Send a message to the renderer process, optionally transferring ownership of zero or more MessagePortMain objects.

The transferred MessagePortMain objects will be available in the renderer process by accessing the ports property of the emitted event. When they arrive in the renderer, they will be native DOM MessagePort objects.

Returns Promise<string> | Promise<void> - A promise that resolves with the currently running JavaScript call stack. If no JavaScript runs in the frame, the promise will never resolve. In cases where the call stack is otherwise unable to be collected, it will return undefined.

This can be useful to determine why the frame is unresponsive in cases where there's long-running JavaScript. For more information, see the proposed Crash Reporting API.

An IpcMain instance scoped to the frame.

IPC messages sent with ipcRenderer.send, ipcRenderer.sendSync or ipcRenderer.postMessage will be delivered in the following order:

Handlers registered with invoke will be checked in the following order. The first one that is defined will be called, the rest will be ignored.

In most cases, only the main frame of a WebContents can send or receive IPC messages. However, if the nodeIntegrationInSubFrames option is enabled, it is possible for child frames to send and receive IPC messages also. The WebContents.ipc interface may be more convenient when nodeIntegrationInSubFrames is not enabled.

A string representing the current URL of the frame.

A string representing the current origin of the frame, serialized according to RFC 6454. This may be different from the URL. For instance, if the frame is a child window opened to about:blank, then frame.origin will return the parent frame's origin, while frame.url will return the empty string. Pages without a scheme/host/port triple origin will have the serialized origin of "null" (that is, the string containing the letters n, u, l, l).

A WebFrameMain | null representing top frame in the frame hierarchy to which frame belongs.

A WebFrameMain | null representing parent frame of frame, the property would be null if frame is the top frame in the frame hierarchy.

A WebFrameMain[] collection containing the direct descendents of frame.

A WebFrameMain[] collection containing every frame in the subtree of frame, including itself. This can be useful when traversing through all frames.

An Integer representing the id of the frame's internal FrameTreeNode instance. This id is browser-global and uniquely identifies a frame that hosts content. The identifier is fixed at the creation of the frame and stays constant for the lifetime of the frame. When the frame is removed, the id is not used again.

A string representing the frame name.

A string which uniquely identifies the frame within its associated renderer process. This is equivalent to webFrame.frameToken.

An Integer representing the operating system pid of the process which owns this frame.

An Integer representing the Chromium internal pid of the process which owns this frame. This is not the same as the OS process ID; to read that use frame.osProcessId.

An Integer representing the unique frame id in the current renderer process. Distinct WebFrameMain instances that refer to the same underlying frame will have the same routingId.

A string representing the visibility state of the frame.

See also how the Page Visibility API is affected by other Electron APIs.

A Boolean representing whether the frame is detached from the frame tree. If a frame is accessed while the corresponding page is running any unload listeners, it may become detached as the newly navigated page replaced it in the frame tree.

**Examples:**

Example 1 (javascript):
```javascript
const { BrowserWindow, webFrameMain } = require('electron')const win = new BrowserWindow({ width: 800, height: 1500 })win.loadURL('https://twitter.com')win.webContents.on(  'did-frame-navigate',  (event, url, httpResponseCode, httpStatusText, isMainFrame, frameProcessId, frameRoutingId) => {    const frame = webFrameMain.fromId(frameProcessId, frameRoutingId)    if (frame) {      const code = 'document.body.innerHTML = document.body.innerHTML.replaceAll("heck", "h*ck")'      frame.executeJavaScript(code)    }  })
```

Example 2 (javascript):
```javascript
const { BrowserWindow } = require('electron')async function main () {  const win = new BrowserWindow({ width: 800, height: 600 })  await win.loadURL('https://reddit.com')  const youtubeEmbeds = win.webContents.mainFrame.frames.filter((frame) => {    try {      const url = new URL(frame.url)      return url.host === 'www.youtube.com'    } catch {      return false    }  })  console.log(youtubeEmbeds)}main()
```

Example 3 (csharp):
```csharp
// Main processconst win = new BrowserWindow()const { port1, port2 } = new MessageChannelMain()win.webContents.mainFrame.postMessage('port', { message: 'hello' }, [port1])// Renderer processipcRenderer.on('port', (e, msg) => {  const [port] = e.ports  // ...})
```

Example 4 (javascript):
```javascript
const { app } = require('electron')app.commandLine.appendSwitch('enable-features', 'DocumentPolicyIncludeJSCallStacksInCrashReports')app.on('web-contents-created', (_, webContents) => {  webContents.on('unresponsive', async () => {    // Interrupt execution and collect call stack from unresponsive renderer    const callStack = await webContents.mainFrame.collectJavaScriptCallStack()    console.log('Renderer unresponsive\n', callStack)  })})
```

---

## Class: NavigationHistory

**URL:** https://www.electronjs.org/docs/latest/api/navigation-history

**Contents:**
- Class: NavigationHistory
- Class: NavigationHistory​
  - Instance Methods​
    - navigationHistory.canGoBack()​
    - navigationHistory.canGoForward()​
    - navigationHistory.canGoToOffset(offset)​
    - navigationHistory.clear()​
    - navigationHistory.getActiveIndex()​
    - navigationHistory.getEntryAtIndex(index)​
    - navigationHistory.goBack()​

Manage a list of navigation entries, representing the user's browsing history within the application.

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

Each NavigationEntry corresponds to a specific visited page. The indexing system follows a sequential order, where the entry for the earliest visited page is at index 0 and the entry for the most recent visited page is at index N.

Some APIs in this class also accept an offset, which is an integer representing the relative position of an index from the current entry according to the above indexing system (i.e. an offset value of 1 would represent going forward in history by one page).

Maintaining this ordered list of navigation entries enables seamless navigation both backward and forward through the user's browsing history.

Returns boolean - Whether the browser can go back to previous web page.

Returns boolean - Whether the browser can go forward to next web page.

Returns boolean - Whether the web page can go to the specified relative offset from the current entry.

Clears the navigation history.

Returns Integer - The index of the current page, from which we would go back/forward or reload.

Returns NavigationEntry - Navigation entry at the given index.

If index is out of bounds (greater than history length or less than 0), null will be returned.

Makes the browser go back a web page.

Makes the browser go forward a web page.

Navigates browser to the specified absolute web page index.

Navigates to the specified relative offset from the current entry.

Returns Integer - History length.

Removes the navigation entry at the given index. Can't remove entry at the "current active index".

Returns boolean - Whether the navigation entry was removed from the webContents history.

Returns NavigationEntry[] - WebContents complete history.

Restores navigation history and loads the given entry in the in stack. Will make a best effort to restore not just the navigation stack but also the state of the individual pages - for instance including HTML form values or the scroll position. It's recommended to call this API before any navigation entries are created, so ideally before you call loadURL() or loadFile() on the webContents object.

This API allows you to create common flows that aim to restore, recreate, or clone other webContents.

Returns Promise<void> - the promise will resolve when the page has finished loading the selected navigation entry (see did-finish-load), and rejects if the page fails to load (see did-fail-load). A noop rejection handler is already attached, which avoids unhandled rejection errors.

---

## What is Electron?

**URL:** https://www.electronjs.org/docs/latest/

**Contents:**
- What is Electron?
- Getting started​
- Running examples with Electron Fiddle​
- What is in the docs?​
- Getting help​

Electron is a framework for building desktop applications using JavaScript, HTML, and CSS. By embedding Chromium and Node.js into its binary, Electron allows you to maintain one JavaScript codebase and create cross-platform apps that work on Windows, macOS, and Linux — no native development experience required.

We recommend you to start with the tutorial, which guides you through the process of developing an Electron app and distributing it to users. The examples and API documentation are also good places to browse around and discover new things.

Electron Fiddle is a sandbox app written with Electron and supported by Electron's maintainers. We highly recommend installing it as a learning tool to experiment with Electron's APIs or to prototype features during development.

Fiddle also integrates nicely with our documentation. When browsing through examples in our tutorials, you'll frequently see an "Open in Electron Fiddle" button underneath a code block. If you have Fiddle installed, this button will open a fiddle.electronjs.org link that will automatically load the example into Fiddle, no copy-pasting required.

All the official documentation is available from the sidebar. These are the different categories and what you can expect on each one:

Are you getting stuck anywhere? Here are a few links to places to look:

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

## nativeImage

**URL:** https://www.electronjs.org/docs/latest/api/native-image

**Contents:**
- nativeImage
- Supported Formats​
- High Resolution Image​
- Template Image macOS​
- Methods​
  - nativeImage.createEmpty()​
  - nativeImage.createThumbnailFromPath(path, size) macOS Windows​
  - nativeImage.createFromPath(path)​
  - nativeImage.createFromBitmap(buffer, options)​
  - nativeImage.createFromBuffer(buffer[, options])​

Create tray, dock, and application icons using PNG or JPG files.

Process: Main, Renderer

If you want to call this API from a renderer process with context isolation enabled, place the API call in your preload script and expose it using the contextBridge API.

The nativeImage module provides a unified interface for manipulating system images. These can be handy if you want to provide multiple scaled versions of the same icon or take advantage of macOS template images.

Electron APIs that take image files accept either file paths or NativeImage instances. An empty and transparent image will be used when null is passed.

For example, when creating a Tray or setting a BrowserWindow's icon, you can either pass an image file path as a string:

or generate a NativeImage instance from the same file:

Currently, PNG and JPEG image formats are supported across all platforms. PNG is recommended because of its support for transparency and lossless compression.

On Windows, you can also load ICO icons from file paths. For best visual quality, we recommend including at least the following sizes:

Check the Icon Scaling section in the Windows App Icon Construction reference.

EXIF metadata is currently not supported and will not be taken into account during image encoding and decoding.

On platforms that support high pixel density displays (such as Apple Retina), you can append @2x after image's base filename to mark it as a 2x scale high resolution image.

For example, if icon.png is a normal image that has standard resolution, then icon@2x.png will be treated as a high resolution image that has double Dots per Inch (DPI) density.

If you want to support displays with different DPI densities at the same time, you can put images with different sizes in the same folder and use the filename without DPI suffixes within Electron. For example:

The following suffixes for DPI are also supported:

On macOS, template images consist of black and an alpha channel. Template images are not intended to be used as standalone images and are usually mixed with other content to create the desired final appearance.

The most common case is to use template images for a menu bar (Tray) icon, so it can adapt to both light and dark menu bars.

To mark an image as a template image, its base filename should end with the word Template (e.g. xxxTemplate.png). You can also specify template images at different DPI densities (e.g. xxxTemplate@2x.png).

The nativeImage module has the following methods, all of which return an instance of the NativeImage class:

Creates an empty NativeImage instance.

Returns Promise<NativeImage> - fulfilled with the file's thumbnail preview image, which is a NativeImage.

Windows implementation will ignore size.height and scale the height according to size.width.

Creates a new NativeImage instance from an image file (e.g., PNG or JPEG) located at path. This method returns an empty image if the path does not exist, cannot be read, or is not a valid image.

Creates a new NativeImage instance from buffer that contains the raw bitmap pixel data returned by toBitmap(). The specific format is platform-dependent.

Creates a new NativeImage instance from buffer. Tries to decode as PNG or JPEG first.

Creates a new NativeImage instance from dataUrl, a base 64 encoded Data URL string.

Creates a new NativeImage instance from the NSImage that maps to the given image name. See Apple's NSImageName documentation and SF Symbols for a list of possible values.

The hslShift is applied to the image with the following rules:

This means that [-1, 0, 1] will make the image completely white and [-1, 1, 0] will make the image completely black.

In some cases, the NSImageName doesn't match its string representation; one example of this is NSFolderImageName, whose string representation would actually be NSFolder. Therefore, you'll need to determine the correct string representation for your image before passing it in. This can be done with the following:

where SYSTEM_IMAGE_NAME should be replaced with any value from this list.

For SF Symbols, usage looks as follows:

where 'square.and.pencil' is the symbol name from the SF Symbols app.

Natively wrap images such as tray, dock, and application icons.

Process: Main, Renderer This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

The following methods are available on instances of the NativeImage class:

Returns Buffer - A Buffer that contains the image's PNG encoded data.

Returns Buffer - A Buffer that contains the image's JPEG encoded data.

Returns Buffer - A Buffer that contains a copy of the image's raw bitmap pixel data.

nativeImage.toDataURL will preserve PNG colorspace

Returns string - The Data URL of the image.

Legacy alias for image.toBitmap().

Returns Buffer - A Buffer that stores C pointer to underlying native handle of the image. On macOS, a pointer to NSImage instance is returned.

Notice that the returned pointer is a weak pointer to the underlying native image instead of a copy, so you must ensure that the associated nativeImage instance is kept around.

Returns boolean - Whether the image is empty.

If scaleFactor is passed, this will return the size corresponding to the image representation most closely matching the passed value.

Marks the image as a macOS template image.

Returns boolean - Whether the image is a macOS template image.

Returns NativeImage - The cropped image.

Returns NativeImage - The resized image.

If only the height or the width are specified then the current aspect ratio will be preserved in the resized image.

Returns Number - The image's aspect ratio (width divided by height).

If scaleFactor is passed, this will return the aspect ratio corresponding to the image representation most closely matching the passed value.

Returns Number[] - An array of all scale factors corresponding to representations for a given NativeImage.

Add an image representation for a specific scale factor. This can be used to programmatically add different scale factor representations to an image. This can be called on empty images.

A boolean property that determines whether the image is considered a template image.

Please note that this property only has an effect on macOS.

**Examples:**

Example 1 (javascript):
```javascript
const { BrowserWindow, Tray } = require('electron')const tray = new Tray('/Users/somebody/images/icon.png')const win = new BrowserWindow({ icon: '/Users/somebody/images/window.png' })
```

Example 2 (javascript):
```javascript
const { BrowserWindow, nativeImage, Tray } = require('electron')const trayIcon = nativeImage.createFromPath('/Users/somebody/images/icon.png')const appIcon = nativeImage.createFromPath('/Users/somebody/images/window.png')const tray = new Tray(trayIcon)const win = new BrowserWindow({ icon: appIcon })
```

Example 3 (python):
```python
images/├── icon.png├── icon@2x.png└── icon@3x.png
```

Example 4 (javascript):
```javascript
const { Tray } = require('electron')const appTray = new Tray('/Users/somebody/images/icon.png')
```

---

## Supported Command Line Switches

**URL:** https://www.electronjs.org/docs/latest/api/command-line-switches

**Contents:**
- Supported Command Line Switches
- Electron CLI Flags​
  - --auth-server-whitelist=url​
  - --auth-negotiate-delegate-whitelist=url​
  - --disable-ntlm-v2​
  - --disable-http-cache​
  - --disable-http2​
  - --disable-renderer-backgrounding​
  - --disk-cache-size=size​
  - --enable-logging[=file]​

Command line switches supported by Electron.

You can use app.commandLine.appendSwitch to append them in your app's main script before the ready event of the app module is emitted:

A comma-separated list of servers for which integrated authentication is enabled.

then any url ending with example.com, foobar.com, baz will be considered for integrated authentication. Without * prefix the URL has to match exactly.

A comma-separated list of servers for which delegation of user credentials is required. Without * prefix the URL has to match exactly.

Disables NTLM v2 for POSIX platforms, no effect elsewhere.

Disables the disk cache for HTTP requests.

Disable HTTP/2 and SPDY/3.1 protocols.

Prevents Chromium from lowering the priority of invisible pages' renderer processes.

This flag is global to all renderer processes, if you only want to disable throttling in one window, you can take the hack of playing silent audio.

Forces the maximum disk space to be used by the disk cache, in bytes.

Prints Chromium's logging to stderr (or a log file).

The ELECTRON_ENABLE_LOGGING environment variable has the same effect as passing --enable-logging.

Passing --enable-logging will result in logs being printed on stderr. Passing --enable-logging=file will result in logs being saved to the file specified by --log-file=..., or to electron_debug.log in the user-data directory if --log-file is not specified.

On Windows, logs from child processes cannot be sent to stderr. Logging to a file is the most reliable way to collect logs on Windows.

See also --log-file, --log-level, --v, and --vmodule.

Field trials to be forcefully enabled or disabled.

For example: WebRTC-Audio-Red-For-Opus/Enabled/

A comma-separated list of rules that control how hostnames are mapped.

These mappings apply to the endpoint host in a net request (the TCP connect and host resolver in a direct connection, and the CONNECT in an HTTP proxy connection, and the endpoint host in a SOCKS proxy connection).

Deprecated: Use the --host-resolver-rules switch instead.

A comma-separated list of rules that control how hostnames are mapped.

These rules only apply to the host resolver.

Ignores certificate related errors.

Ignore the connections limit for domains list separated by ,.

Specifies the flags passed to the V8 engine. In order to enable the flags in the main process, this switch must be passed on startup.

Run node --v8-options or electron --js-flags="--help" in your terminal for the list of available flags. These can be used to enable early-stage JavaScript features, or log and manipulate garbage collection, among other things.

For example, to trace V8 optimization and deoptimization:

If --enable-logging is specified, logs will be written to the given path. The parent directory must exist.

Setting the ELECTRON_LOG_FILE environment variable is equivalent to passing this flag. If both are present, the command-line switch takes precedence.

Enables net log events to be saved and writes them to path.

Sets the verbosity of logging when used together with --enable-logging. N should be one of Chrome's LogSeverities.

Note that two complimentary logging mechanisms in Chromium -- LOG() and VLOG() -- are controlled by different switches. --log-level controls LOG() messages, while --v and --vmodule control VLOG() messages. So you may want to use a combination of these three switches depending on the granularity you want and what logging calls are made by the code you're trying to watch.

See Chromium Logging source for more information on how LOG() and VLOG() interact. Loosely speaking, VLOG() can be thought of as sub-levels / per-module levels inside LOG(INFO) to control the firehose of LOG(INFO) data.

See also --enable-logging, --log-level, --v, and --vmodule.

Don't use a proxy server and always make direct connections. Overrides any other proxy server flags that are passed.

Disables the Chromium sandbox. Forces renderer process and Chromium helper processes to run un-sandboxed. Should only be used for testing.

Instructs Electron to bypass the proxy server for the given semi-colon-separated list of hosts. This flag has an effect only if used in tandem with --proxy-server.

Will use the proxy server for all hosts except for local addresses (localhost, 127.0.0.1 etc.), google.com subdomains, hosts that contain the suffix foo.com and anything at 1.2.3.4:5678.

Uses the PAC script at the specified url.

Use a specified proxy server, which overrides the system setting. This switch only affects requests with HTTP protocol, including HTTPS and WebSocket requests. It is also noteworthy that not all proxy servers support HTTPS and WebSocket requests. The proxy URL does not support username and password authentication per Chromium issue.

Enables remote debugging over HTTP on the specified port.

Gives the default maximal active V-logging level; 0 is the default. Normally positive values are used for V-logging levels.

This switch only works when --enable-logging is also passed.

See also --enable-logging, --log-level, and --vmodule.

Gives the per-module maximal V-logging levels to override the value given by --v. E.g. my_module=2,foo*=3 would change the logging level for all code in source files my_module.* and foo*.*.

Any pattern containing a forward or backward slash will be tested against the whole pathname and not only the module. E.g. */foo/bar/*=2 would change the logging level for all code in the source files under a foo/bar directory.

This switch only works when --enable-logging is also passed.

See also --enable-logging, --log-level, and --v.

Force using discrete GPU when there are multiple GPUs available.

Force using integrated GPU when there are multiple GPUs available.

Sets the minimum required version of XDG portal implementation to version in order to use the portal backend for file dialogs on linux. File dialogs will fallback to using gtk or kde depending on the desktop environment when the required version is unavailable. Current default is set to 3.

Electron supports some of the CLI flags supported by Node.js.

Passing unsupported command line switches to Electron when it is not running in ELECTRON_RUN_AS_NODE will have no effect.

Activate inspector on host:port and break at start of user script. Default host:port is 127.0.0.1:9229.

Aliased to --debug-brk=[host:]port.

Activate inspector on host:port and break at start of the first internal JavaScript script executed when the inspector is available. Default host:port is 127.0.0.1:9229.

Set the host:port to be used when the inspector is activated. Useful when activating the inspector by sending the SIGUSR1 signal. Default host is 127.0.0.1.

Aliased to --debug-port=[host:]port.

Activate inspector on host:port. Default is 127.0.0.1:9229.

V8 inspector integration allows tools such as Chrome DevTools and IDEs to debug and profile Electron instances. The tools attach to Electron instances via a TCP port and communicate using the Chrome DevTools Protocol.

See the Debugging the Main Process guide for more details.

Aliased to --debug[=[host:]port.

Specify ways of the inspector web socket url exposure.

By default inspector websocket url is available in stderr and under /json/list endpoint on http://host:port/json/list.

Enable support for devtools network inspector events, for visibility into requests made by the nodejs http and https modules.

Silence deprecation warnings.

Throw errors for deprecations.

Print stack traces for deprecations.

Print stack traces for process warnings (including deprecations).

Set the default value of the verbatim parameter in the Node.js dns.lookup() and dnsPromises.lookup() functions. The value could be:

The default is verbatim and dns.setDefaultResultOrder() have higher priority than --dns-result-order.

Set the directory to which all Node.js diagnostic output files are written. Defaults to current working directory.

Affects the default output directory of v8.setHeapSnapshotNearHeapLimit.

Disable exposition of Navigator API on the global scope from Node.js.

There isn't a documented list of all Chromium switches, but there are a few ways to find them.

The easiest way is through Chromium's flags page, which you can access at about://flags. These flags don't directly match switch names, but they show up in the process's command-line arguments.

To see these arguments, enable a flag in about://flags, then go to about://version in Chromium. You'll find a list of command-line arguments, including --flag-switches-begin --your --list --flag-switches-end, which contains the list of your flag enabled switches.

Most flags are included as part of --enable-features=, but some are standalone switches, like --enable-experimental-web-platform-features.

A complete list of flags exists in Chromium's flag metadata page, but this list includes platform, environment and GPU specific, expired and potentially non-functional flags, so many of them might not always work in every situation.

Keep in mind that standalone switches can sometimes be split into individual features, so there's no fully complete list of switches.

Finally, you'll need to ensure that the version of Chromium in Electron matches the version of the browser you're using to cross-reference the switches.

**Examples:**

Example 1 (javascript):
```javascript
const { app } = require('electron')app.commandLine.appendSwitch('remote-debugging-port', '8315')app.commandLine.appendSwitch('host-rules', 'MAP * 127.0.0.1')app.whenReady().then(() => {  // Your code here})
```

Example 2 (unknown):
```unknown
--auth-server-whitelist='*example.com, *foobar.com, *baz'
```

Example 3 (unknown):
```unknown
$ electron --js-flags="--harmony_proxies --harmony_collections" your-app
```

Example 4 (unknown):
```unknown
$ electron --js-flags="--trace-opt --trace-deopt" your-app
```

---

## Class: IncomingMessage

**URL:** https://www.electronjs.org/docs/latest/api/incoming-message

**Contents:**
- Class: IncomingMessage
- Class: IncomingMessage​
  - Instance Events​
    - Event: 'data'​
    - Event: 'end'​
    - Event: 'aborted'​
    - Event: 'error'​
  - Instance Properties​
    - response.statusCode​
    - response.statusMessage​

Handle responses to HTTP/HTTPS requests.

Process: Main, Utility This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

IncomingMessage implements the Readable Stream interface and is therefore an EventEmitter.

The data event is the usual method of transferring response data into applicative code.

Indicates that response body has ended. Must be placed before 'data' event.

Emitted when a request has been canceled during an ongoing HTTP transaction.

Emitted when an error was encountered while streaming response data events. For instance, if the server closes the underlying while the response is still streaming, an error event will be emitted on the response object and a close event will subsequently follow on the request object.

An IncomingMessage instance has the following readable properties:

An Integer indicating the HTTP response status code.

A string representing the HTTP status message.

A Record<string, string | string[]> representing the HTTP response headers. The headers object is formatted as follows:

A string indicating the HTTP protocol version number. Typical values are '1.0' or '1.1'. Additionally httpVersionMajor and httpVersionMinor are two Integer-valued readable properties that return respectively the HTTP major and minor version numbers.

An Integer indicating the HTTP protocol major version number.

An Integer indicating the HTTP protocol minor version number.

A string[] containing the raw HTTP response headers exactly as they were received. The keys and values are in the same list. It is not a list of tuples. So, the even-numbered offsets are key values, and the odd-numbered offsets are the associated values. Header names are not lowercased, and duplicates are not merged.

**Examples:**

Example 1 (javascript):
```javascript
// Prints something like://// [ 'user-agent',//   'this is invalid because there can be only one',//   'User-Agent',//   'curl/7.22.0',//   'Host',//   '127.0.0.1:8000',//   'ACCEPT',//   '*/*' ]console.log(response.rawHeaders)
```

---

## Class: Debugger

**URL:** https://www.electronjs.org/docs/latest/api/debugger

**Contents:**
- Class: Debugger
- Class: Debugger​
  - Instance Events​
    - Event: 'detach'​
    - Event: 'message'​
  - Instance Methods​
    - debugger.attach([protocolVersion])​
    - debugger.isAttached()​
    - debugger.detach()​
    - debugger.sendCommand(method[, commandParams, sessionId])​

An alternate transport for Chrome's remote debugging protocol.

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

Chrome Developer Tools has a special binding available at JavaScript runtime that allows interacting with pages and instrumenting them.

Emitted when the debugging session is terminated. This happens either when webContents is closed or devtools is invoked for the attached webContents.

Emitted whenever the debugging target issues an instrumentation event.

Attaches the debugger to the webContents.

Returns boolean - Whether a debugger is attached to the webContents.

Detaches the debugger from the webContents.

Returns Promise<any> - A promise that resolves with the response defined by the 'returns' attribute of the command description in the remote debugging protocol or is rejected indicating the failure of the command.

Send given command to the debugging target.

**Examples:**

Example 1 (javascript):
```javascript
const { BrowserWindow } = require('electron')const win = new BrowserWindow()try {  win.webContents.debugger.attach('1.1')} catch (err) {  console.log('Debugger attach failed : ', err)}win.webContents.debugger.on('detach', (event, reason) => {  console.log('Debugger detached due to : ', reason)})win.webContents.debugger.on('message', (event, method, params) => {  if (method === 'Network.requestWillBeSent') {    if (params.request.url === 'https://www.github.com') {      win.webContents.debugger.detach()    }  }})win.webContents.debugger.sendCommand('Network.enable')
```

---

## Class: WebRequest

**URL:** https://www.electronjs.org/docs/latest/api/web-request

**Contents:**
- Class: WebRequest
- Class: WebRequest​
  - Instance Methods​
    - webRequest.onBeforeRequest([filter, ]listener)​
    - webRequest.onBeforeSendHeaders([filter, ]listener)​
    - webRequest.onSendHeaders([filter, ]listener)​
    - webRequest.onHeadersReceived([filter, ]listener)​
    - webRequest.onResponseStarted([filter, ]listener)​
    - webRequest.onBeforeRedirect([filter, ]listener)​
    - webRequest.onCompleted([filter, ]listener)​

Intercept and modify the contents of a request at various stages of its lifetime.

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

Instances of the WebRequest class are accessed by using the webRequest property of a Session.

The methods of WebRequest accept an optional filter and a listener. The listener will be called with listener(details) when the API's event has happened. The details object describes the request.

⚠️ Only the last attached listener will be used. Passing null as listener will unsubscribe from the event.

The filter object has a urls property which is an Array of URL patterns that will be used to filter out the requests that do not match the URL patterns. If the filter is omitted then all requests will be matched.

For certain events the listener is passed with a callback, which should be called with a response object when listener has done its work.

An example of adding User-Agent header for requests:

The following methods are available on instances of WebRequest:

The listener will be called with listener(details, callback) when a request is about to occur.

The uploadData is an array of UploadData objects.

The callback has to be called with an response object.

Some examples of valid urls:

The listener will be called with listener(details, callback) before sending an HTTP request, once the request headers are available. This may occur after a TCP connection is made to the server, but before any http data is sent.

The callback has to be called with a response object.

The listener will be called with listener(details) just before a request is going to be sent to the server, modifications of previous onBeforeSendHeaders response are visible by the time this listener is fired.

The listener will be called with listener(details, callback) when HTTP response headers of a request have been received.

The callback has to be called with a response object.

The listener will be called with listener(details) when first byte of the response body is received. For HTTP requests, this means that the status line and response headers are available.

The listener will be called with listener(details) when a server initiated redirect is about to occur.

The listener will be called with listener(details) when a request is completed.

The listener will be called with listener(details) when an error occurs.

**Examples:**

Example 1 (javascript):
```javascript
const { session } = require('electron')// Modify the user agent for all requests to the following urls.const filter = {  urls: ['https://*.github.com/*', '*://electron.github.io/*']}session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {  details.requestHeaders['User-Agent'] = 'MyAgent'  callback({ requestHeaders: details.requestHeaders })})
```

Example 2 (typescript):
```typescript
'<all_urls>''http://foo:1234/''http://foo.com/''http://foo:1234/bar''*://*/*''*://example.com/*''*://example.com/foo/*''http://*.foo:1234/''file://foo:1234/bar''http://foo:*/''*://www.foo.com/'
```

---

## Class: ServiceWorkerMain

**URL:** https://www.electronjs.org/docs/latest/api/service-worker-main

**Contents:**
- Class: ServiceWorkerMain
- Class: ServiceWorkerMain​
  - Instance Methods​
    - serviceWorker.isDestroyed() Experimental​
    - serviceWorker.send(channel, ...args) Experimental​
    - serviceWorker.startTask() Experimental​
  - Instance Properties​
    - serviceWorker.ipc Readonly Experimental​
    - serviceWorker.scope Readonly Experimental​
    - serviceWorker.scriptURL Readonly Experimental​

An instance of a Service Worker representing a version of a script for a given scope.

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

Returns boolean - Whether the service worker has been destroyed.

Send an asynchronous message to the service worker process via channel, along with arguments. Arguments will be serialized with the Structured Clone Algorithm, just like postMessage, so prototype chains will not be included. Sending Functions, Promises, Symbols, WeakMaps, or WeakSets will throw an exception.

The service worker process can handle the message by listening to channel with the ipcRenderer module.

Initiate a task to keep the service worker alive until ended.

An IpcMainServiceWorker instance scoped to the service worker.

A string representing the scope URL of the service worker.

A string representing the script URL of the service worker.

A number representing the ID of the specific version of the service worker script in its scope.

---

## shell

**URL:** https://www.electronjs.org/docs/latest/api/shell

**Contents:**
- shell
- Methods​
  - shell.showItemInFolder(fullPath)​
  - shell.openPath(path)​
  - shell.openExternal(url[, options])​
  - shell.trashItem(path)​
  - shell.beep()​
  - shell.writeShortcutLink(shortcutPath[, operation], options) Windows​
  - shell.readShortcutLink(shortcutPath) Windows​

Manage files and URLs using their default applications.

Process: Main, Renderer (non-sandboxed only)

The shell module provides functions related to desktop integration.

An example of opening a URL in the user's default browser:

While the shell module can be used in the renderer process, it will not function in a sandboxed renderer.

The shell module has the following methods:

Show the given file in a file manager. If possible, select the file.

Returns Promise<string> - Resolves with a string containing the error message corresponding to the failure if a failure occurred, otherwise "".

Open the given file in the desktop's default manner.

Returns Promise<void>

Open the given external protocol URL in the desktop's default manner. (For example, mailto: URLs in the user's default mail agent).

Returns Promise<void> - Resolves when the operation has been completed. Rejects if there was an error while deleting the requested item.

This moves a path to the OS-specific trash location (Trash on macOS, Recycle Bin on Windows, and a desktop-environment-specific location on Linux).

Returns boolean - Whether the shortcut was created successfully.

Creates or updates a shortcut link at shortcutPath.

Returns ShortcutDetails

Resolves the shortcut link at shortcutPath.

An exception will be thrown when any error happens.

**Examples:**

Example 1 (javascript):
```javascript
const { shell } = require('electron')shell.openExternal('https://github.com')
```

---

## Class: TouchBarColorPicker

**URL:** https://www.electronjs.org/docs/latest/api/touch-bar-color-picker

**Contents:**
- Class: TouchBarColorPicker
- Class: TouchBarColorPicker​
  - new TouchBarColorPicker(options)​
  - Instance Properties​
    - touchBarColorPicker.availableColors​
    - touchBarColorPicker.selectedColor​

Create a color picker in the touch bar for native macOS applications

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

The following properties are available on instances of TouchBarColorPicker:

A string[] array representing the color picker's available colors to select. Changing this value immediately updates the color picker in the touch bar.

A string hex code representing the color picker's currently selected color. Changing this value immediately updates the color picker in the touch bar.

---

## Class: IpcMainServiceWorker

**URL:** https://www.electronjs.org/docs/latest/api/ipc-main-service-worker

**Contents:**
- Class: IpcMainServiceWorker
- Class: IpcMainServiceWorker​
  - Instance Methods​
    - ipcMainServiceWorker.on(channel, listener)​
    - ipcMainServiceWorker.once(channel, listener)​
    - ipcMainServiceWorker.removeListener(channel, listener)​
    - ipcMainServiceWorker.removeAllListeners([channel])​
    - ipcMainServiceWorker.handle(channel, listener)​
    - ipcMainServiceWorker.handleOnce(channel, listener)​
    - ipcMainServiceWorker.removeHandler(channel)​

Communicate asynchronously from the main process to service workers.

This API is a subtle variation of IpcMain—targeted for communicating with service workers. For communicating with web frames, consult the IpcMain documentation.

Electron's built-in classes cannot be subclassed in user code. For more information, see the FAQ.

Listens to channel, when a new message arrives listener would be called with listener(event, args...).

Adds a one time listener function for the event. This listener is invoked only the next time a message is sent to channel, after which it is removed.

Removes the specified listener from the listener array for the specified channel.

Removes listeners of the specified channel.

Handles a single invokeable IPC message, then removes the listener. See ipcMainServiceWorker.handle(channel, listener).

Removes any handler for channel, if present.

---

## Class: TouchBarGroup

**URL:** https://www.electronjs.org/docs/latest/api/touch-bar-group

**Contents:**
- Class: TouchBarGroup
- Class: TouchBarGroup​
  - new TouchBarGroup(options)​

Create a group in the touch bar for native macOS applications

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

---

## process

**URL:** https://www.electronjs.org/docs/latest/api/process

**Contents:**
- process
- Sandbox​
- Events​
  - Event: 'loaded'​
- Properties​
  - process.defaultApp Readonly​
  - process.isMainFrame Readonly​
  - process.mas Readonly​
  - process.noAsar​
  - process.noDeprecation​

Extensions to process object.

Process: Main, Renderer

Electron's process object is extended from the Node.js process object. It adds the following events, properties, and methods:

In sandboxed renderers the process object contains only a subset of the APIs:

Emitted when Electron has loaded its internal initialization script and is beginning to load the web page or the main script.

A boolean. When the app is started by being passed as parameter to the default Electron executable, this property is true in the main process, otherwise it is undefined. For example when running the app with electron ., it is true, even if the app is packaged (isPackaged) is true. This can be useful to determine how many arguments will need to be sliced off from process.argv.

A boolean, true when the current renderer context is the "main" renderer frame. If you want the ID of the current frame you should use webFrame.routingId.

A boolean. For Mac App Store build, this property is true, for other builds it is undefined.

A boolean that controls ASAR support inside your application. Setting this to true will disable the support for asar archives in Node's built-in modules.

A boolean that controls whether or not deprecation warnings are printed to stderr. Setting this to true will silence deprecation warnings. This property is used instead of the --no-deprecation command line flag.

A string representing the path to the resources directory.

A boolean. When the renderer process is sandboxed, this property is true, otherwise it is undefined.

A boolean that indicates whether the current renderer context has contextIsolation enabled. It is undefined in the main process.

A boolean that controls whether or not deprecation warnings will be thrown as exceptions. Setting this to true will throw errors for deprecations. This property is used instead of the --throw-deprecation command line flag.

A boolean that controls whether or not deprecations printed to stderr include their stack trace. Setting this to true will print stack traces for deprecations. This property is instead of the --trace-deprecation command line flag.

A boolean that controls whether or not process warnings printed to stderr include their stack trace. Setting this to true will print stack traces for process warnings (including deprecations). This property is instead of the --trace-warnings command line flag.

A string representing the current process's type, can be:

A string representing Chrome's version string.

A string representing Electron's version string.

A boolean. If the app is running as a Windows Store app (appx), this property is true, for otherwise it is undefined.

A string (optional) representing a globally unique ID of the current JavaScript context. Each frame has its own JavaScript context. When contextIsolation is enabled, the isolated world also has a separate JavaScript context. This property is only available in the renderer process.

A Electron.ParentPort property if this is a UtilityProcess (or null otherwise) allowing communication with the parent process.

The process object has the following methods:

Causes the main thread of the current process crash.

Returns number | null - The number of milliseconds since epoch, or null if the information is unavailable

Indicates the creation time of the application. The time is represented as number of milliseconds since epoch. It returns null if it is unable to get the process creation time.

Returns an object with V8 heap statistics. Note that all statistics are reported in Kilobytes.

Returns an object with Blink memory information. It can be useful for debugging rendering / DOM related memory issues. Note that all values are reported in Kilobytes.

Returns Promise<ProcessMemoryInfo> - Resolves with a ProcessMemoryInfo

Returns an object giving memory usage statistics about the current process. Note that all statistics are reported in Kilobytes. This api should be called after app ready.

Chromium does not provide residentSet value for macOS. This is because macOS performs in-memory compression of pages that haven't been recently used. As a result the resident set size value is not what one would expect. private memory is more representative of the actual pre-compression memory usage of the process on macOS.

Returns an object giving memory usage statistics about the entire system. Note that all statistics are reported in Kilobytes.

Returns string - The version of the host operating system.

It returns the actual operating system version instead of kernel version on macOS unlike os.release().

Returns boolean - Indicates whether the snapshot has been created successfully.

Takes a V8 heap snapshot and saves it to filePath.

Causes the main thread of the current process hang.

Sets the file descriptor soft limit to maxDescriptors or the OS hard limit, whichever is lower for the current process.

**Examples:**

Example 1 (javascript):
```javascript
const version = process.getSystemVersion()console.log(version)// On macOS -> '10.13.6'// On Windows -> '10.0.17763'// On Linux -> '4.15.0-45-generic'
```

---

## Class: TouchBarSpacer

**URL:** https://www.electronjs.org/docs/latest/api/touch-bar-spacer

**Contents:**
- Class: TouchBarSpacer
- Class: TouchBarSpacer​
  - new TouchBarSpacer(options)​
  - Instance Properties​
    - touchBarSpacer.size​

Create a spacer between two items in the touch bar for native macOS applications

Process: Main This class is not exported from the 'electron' module. It is only available as a return value of other methods in the Electron API.

The following properties are available on instances of TouchBarSpacer:

A string representing the size of the spacer. Can be small, large or flexible.

---

## app

**URL:** https://www.electronjs.org/docs/latest/api/app

**Contents:**
- app
- Events​
  - Event: 'will-finish-launching'​
  - Event: 'ready'​
  - Event: 'window-all-closed'​
  - Event: 'before-quit'​
  - Event: 'will-quit'​
  - Event: 'quit'​
  - Event: 'open-file' macOS​
  - Event: 'open-url' macOS​

Control your application's event lifecycle.

The following example shows how to quit the application when the last window is closed:

The app object emits the following events:

Emitted when the application has finished basic startup. On Windows and Linux, the will-finish-launching event is the same as the ready event; on macOS, this event represents the applicationWillFinishLaunching notification of NSApplication.

In most cases, you should do everything in the ready event handler.

Emitted once, when Electron has finished initializing. On macOS, launchInfo holds the userInfo of the NSUserNotification or information from UNNotificationResponse that was used to open the application, if it was launched from Notification Center. You can also call app.isReady() to check if this event has already fired and app.whenReady() to get a Promise that is fulfilled when Electron is initialized.

The ready event is only fired after the main process has finished running the first tick of the event loop. If an Electron API needs to be called before the ready event, ensure that it is called synchronously in the top-level context of the main process.

Emitted when all windows have been closed.

If you do not subscribe to this event and all windows are closed, the default behavior is to quit the app; however, if you subscribe, you control whether the app quits or not. If the user pressed Cmd + Q, or the developer called app.quit(), Electron will first try to close all the windows and then emit the will-quit event, and in this case the window-all-closed event would not be emitted.

Emitted before the application starts closing its windows. Calling event.preventDefault() will prevent the default behavior, which is terminating the application.

If application quit was initiated by autoUpdater.quitAndInstall(), then before-quit is emitted after emitting close event on all windows and closing them.

On Windows, this event will not be emitted if the app is closed due to a shutdown/restart of the system or a user logout.

Emitted when all windows have been closed and the application will quit. Calling event.preventDefault() will prevent the default behavior, which is terminating the application.

See the description of the window-all-closed event for the differences between the will-quit and window-all-closed events.

On Windows, this event will not be emitted if the app is closed due to a shutdown/restart of the system or a user logout.

Emitted when the application is quitting.

On Windows, this event will not be emitted if the app is closed due to a shutdown/restart of the system or a user logout.

Emitted when the user wants to open a file with the application. The open-file event is usually emitted when the application is already open and the OS wants to reuse the application to open the file. open-file is also emitted when a file is dropped onto the dock and the application is not yet running. Make sure to listen for the open-file event very early in your application startup to handle this case (even before the ready event is emitted).

You should call event.preventDefault() if you want to handle this event.

On Windows, you have to parse process.argv (in the main process) to get the filepath.

Emitted when the user wants to open a URL with the application. Your application's Info.plist file must define the URL scheme within the CFBundleURLTypes key, and set NSPrincipalClass to AtomApplication.

As with the open-file event, be sure to register a listener for the open-url event early in your application startup to detect if the application is being opened to handle a URL. If you register the listener in response to a ready event, you'll miss URLs that trigger the launch of your application.

Emitted when the application is activated. Various actions can trigger this event, such as launching the application for the first time, attempting to re-launch the application when it's already running, or clicking on the application's dock or taskbar icon.

Emitted when the application becomes active. This differs from the activate event in that did-become-active is emitted every time the app becomes active, not only when Dock icon is clicked or application is re-launched. It is also emitted when a user switches to the app via the macOS App Switcher.

Emitted when the app is no longer active and doesn’t have focus. This can be triggered, for example, by clicking on another application or by using the macOS App Switcher to switch to another application.

Emitted during Handoff when an activity from a different device wants to be resumed. You should call event.preventDefault() if you want to handle this event.

A user activity can be continued only in an app that has the same developer Team ID as the activity's source app and that supports the activity's type. Supported activity types are specified in the app's Info.plist under the NSUserActivityTypes key.

Emitted during Handoff before an activity from a different device wants to be resumed. You should call event.preventDefault() if you want to handle this event.

Emitted during Handoff when an activity from a different device fails to be resumed.

Emitted during Handoff after an activity from this device was successfully resumed on another one.

Emitted when Handoff is about to be resumed on another device. If you need to update the state to be transferred, you should call event.preventDefault() immediately, construct a new userInfo dictionary and call app.updateCurrentActivity() in a timely manner. Otherwise, the operation will fail and continue-activity-error will be called.

Emitted when the user clicks the native macOS new tab button. The new tab button is only visible if the current BrowserWindow has a tabbingIdentifier

Emitted when a browserWindow gets blurred.

Emitted when a browserWindow gets focused.

Emitted when a new browserWindow is created.

Emitted when a new webContents is created.

Emitted when failed to verify the certificate for url, to trust the certificate you should prevent the default behavior with event.preventDefault() and call callback(true).

Emitted when a client certificate is requested.

The url corresponds to the navigation entry requesting the client certificate and callback can be called with an entry filtered from the list. Using event.preventDefault() prevents the application from using the first certificate from the store.

Emitted when webContents or Utility process wants to do basic auth.

The default behavior is to cancel all authentications. To override this you should prevent the default behavior with event.preventDefault() and call callback(username, password) with the credentials.

If callback is called without a username or password, the authentication request will be cancelled and the authentication error will be returned to the page.

Emitted whenever there is a GPU info update.

Emitted when the renderer process unexpectedly disappears. This is normally because it was crashed or killed.

Emitted when the child process unexpectedly disappears. This is normally because it was crashed or killed. It does not include renderer processes.

Emitted when Chrome's accessibility support changes. This event fires when assistive technologies, such as screen readers, are enabled or disabled. See https://www.chromium.org/developers/design-documents/accessibility for more details.

Emitted when Electron has created a new session.

This event will be emitted inside the primary instance of your application when a second instance has been executed and calls app.requestSingleInstanceLock().

argv is an Array of the second instance's command line arguments, and workingDirectory is its current working directory. Usually applications respond to this by making their primary window focused and non-minimized.

argv will not be exactly the same list of arguments as those passed to the second instance. The order might change and additional arguments might be appended. If you need to maintain the exact same arguments, it's advised to use additionalData instead.

If the second instance is started by a different user than the first, the argv array will not include the arguments.

This event is guaranteed to be emitted after the ready event of app gets emitted.

Extra command line arguments might be added by Chromium, such as --original-process-start-time.

The app object has the following methods:

Some methods are only available on specific operating systems and are labeled as such.

Try to close all windows. The before-quit event will be emitted first. If all windows are successfully closed, the will-quit event will be emitted and by default the application will terminate.

This method guarantees that all beforeunload and unload event handlers are correctly executed. It is possible that a window cancels the quitting by returning false in the beforeunload event handler.

Exits immediately with exitCode. exitCode defaults to 0.

All windows will be closed immediately without asking the user, and the before-quit and will-quit events will not be emitted.

Relaunches the app when the current instance exits.

By default, the new instance will use the same working directory and command line arguments as the current instance. When args is specified, the args will be passed as the command line arguments instead. When execPath is specified, the execPath will be executed for the relaunch instead of the current app.

Note that this method does not quit the app when executed. You have to call app.quit or app.exit after calling app.relaunch to make the app restart.

When app.relaunch is called multiple times, multiple instances will be started after the current instance exits.

An example of restarting the current instance immediately and adding a new command line argument to the new instance:

Returns boolean - true if Electron has finished initializing, false otherwise. See also app.whenReady().

Returns Promise<void> - fulfilled when Electron is initialized. May be used as a convenient alternative to checking app.isReady() and subscribing to the ready event if the app is not ready yet.

On macOS, makes the application the active app. On Windows, focuses on the application's first window. On Linux, either focuses on the first visible window (X11) or requests focus but may instead show a notification or flash the app icon (Wayland).

You should seek to use the steal option as sparingly as possible.

Hides all application windows without minimizing them.

Returns boolean - true if the application—including all of its windows—is hidden (e.g. with Command-H), false otherwise.

Shows application windows after they were hidden. Does not automatically focus them.

Sets or creates a directory your app's logs which can then be manipulated with app.getPath() or app.setPath(pathName, newPath).

Calling app.setAppLogsPath() without a path parameter will result in this directory being set to ~/Library/Logs/YourAppName on macOS, and inside the userData directory on Linux and Windows.

Returns string - The current application directory.

Returns string - A path to a special directory or file associated with name. On failure, an Error is thrown.

If app.getPath('logs') is called without called app.setAppLogsPath() being called first, a default log directory will be created equivalent to calling app.setAppLogsPath() without a path parameter.

Returns Promise<NativeImage> - fulfilled with the app's icon, which is a NativeImage.

Fetches a path's associated icon.

On Windows, there a 2 kinds of icons:

On Linux and macOS, icons depend on the application associated with file mime type.

Overrides the path to a special directory or file associated with name. If the path specifies a directory that does not exist, an Error is thrown. In that case, the directory should be created with fs.mkdirSync or similar.

You can only override paths of a name defined in app.getPath.

By default, web pages' cookies and caches will be stored under the sessionData directory. If you want to change this location, you have to override the sessionData path before the ready event of the app module is emitted.

Returns string - The version of the loaded application. If no version is found in the application's package.json file, the version of the current bundle or executable is returned.

Returns string - The current application's name, which is the name in the application's package.json file.

Usually the name field of package.json is a short lowercase name, according to the npm modules spec. You should usually also specify a productName field, which is your application's full capitalized name, and which will be preferred over name by Electron.

Overrides the current application's name.

This function overrides the name used internally by Electron; it does not affect the name that the OS uses.

Returns string - The current application locale, fetched using Chromium's l10n_util library. Possible return values are documented here.

To set the locale, you'll want to use a command line switch at app startup, which may be found here.

When distributing your packaged app, you have to also ship the locales folder.

This API must be called after the ready event is emitted.

To see example return values of this API compared to other locale and language APIs, see app.getPreferredSystemLanguages().

Returns string - User operating system's locale two-letter ISO 3166 country code. The value is taken from native OS APIs.

When unable to detect locale country code, it returns empty string.

Returns string - The current system locale. On Windows and Linux, it is fetched using Chromium's i18n library. On macOS, [NSLocale currentLocale] is used instead. To get the user's current system language, which is not always the same as the locale, it is better to use app.getPreferredSystemLanguages().

Different operating systems also use the regional data differently:

Therefore, this API can be used for purposes such as choosing a format for rendering dates and times in a calendar app, especially when the developer wants the format to be consistent with the OS.

This API must be called after the ready event is emitted.

To see example return values of this API compared to other locale and language APIs, see app.getPreferredSystemLanguages().

Returns string[] - The user's preferred system languages from most preferred to least preferred, including the country codes if applicable. A user can modify and add to this list on Windows or macOS through the Language and Region settings.

The API uses GlobalizationPreferences (with a fallback to GetSystemPreferredUILanguages) on Windows, \[NSLocale preferredLanguages\] on macOS, and g_get_language_names on Linux.

This API can be used for purposes such as deciding what language to present the application in.

Here are some examples of return values of the various language and locale APIs with different configurations:

On Windows, given application locale is German, the regional format is Finnish (Finland), and the preferred system languages from most to least preferred are French (Canada), English (US), Simplified Chinese (China), Finnish, and Spanish (Latin America):

On macOS, given the application locale is German, the region is Finland, and the preferred system languages from most to least preferred are French (Canada), English (US), Simplified Chinese, and Spanish (Latin America):

Both the available languages and regions and the possible return values differ between the two operating systems.

As can be seen with the example above, on Windows, it is possible that a preferred system language has no country code, and that one of the preferred system languages corresponds with the language used for the regional format. On macOS, the region serves more as a default country code: the user doesn't need to have Finnish as a preferred language to use Finland as the region,and the country code FI is used as the country code for preferred system languages that do not have associated countries in the language name.

Adds path to the recent documents list.

This list is managed by the OS. On Windows, you can visit the list from the task bar, and on macOS, you can visit it from dock menu.

Clears the recent documents list.

Returns string[] - An array containing documents in the most recent documents list.

Returns boolean - Whether the call succeeded.

Sets the current executable as the default handler for a protocol (aka URI scheme). It allows you to integrate your app deeper into the operating system. Once registered, all links with your-protocol:// will be opened with the current executable. The whole link, including protocol, will be passed to your application as a parameter.

On macOS, you can only register protocols that have been added to your app's info.plist, which cannot be modified at runtime. However, you can change the file during build time via Electron Forge, Electron Packager, or by editing info.plist with a text editor. Please refer to Apple's documentation for details.

In a Windows Store environment (when packaged as an appx) this API will return true for all calls but the registry key it sets won't be accessible by other applications. In order to register your Windows Store application as a default protocol handler you must declare the protocol in your manifest.

The API uses the Windows Registry and LSSetDefaultHandlerForURLScheme internally.

Returns boolean - Whether the call succeeded.

This method checks if the current executable as the default handler for a protocol (aka URI scheme). If so, it will remove the app as the default handler.

Returns boolean - Whether the current executable is the default handler for a protocol (aka URI scheme).

On macOS, you can use this method to check if the app has been registered as the default protocol handler for a protocol. You can also verify this by checking ~/Library/Preferences/com.apple.LaunchServices.plist on the macOS machine. Please refer to Apple's documentation for details.

The API uses the Windows Registry and LSCopyDefaultHandlerForURLScheme internally.

Returns string - Name of the application handling the protocol, or an empty string if there is no handler. For instance, if Electron is the default handler of the URL, this could be Electron on Windows and Mac. However, don't rely on the precise format which is not guaranteed to remain unchanged. Expect a different format on Linux, possibly with a .desktop suffix.

This method returns the application name of the default handler for the protocol (aka URI scheme) of a URL.

Returns Promise<Object> - Resolve with an object containing the following:

This method returns a promise that contains the application name, icon and path of the default handler for the protocol (aka URI scheme) of a URL.

Adds tasks to the Tasks category of the Jump List on Windows.

tasks is an array of Task objects.

Returns boolean - Whether the call succeeded.

If you'd like to customize the Jump List even more use app.setJumpList(categories) instead.

Sets or removes a custom Jump List for the application, and returns one of the following strings:

If categories is null the previously set custom Jump List (if any) will be replaced by the standard Jump List for the app (managed by Windows).

If a JumpListCategory object has neither the type nor the name property set then its type is assumed to be tasks. If the name property is set but the type property is omitted then the type is assumed to be custom.

Users can remove items from custom categories, and Windows will not allow a removed item to be added back into a custom category until after the next successful call to app.setJumpList(categories). Any attempt to re-add a removed item to a custom category earlier than that will result in the entire custom category being omitted from the Jump List. The list of removed items can be obtained using app.getJumpListSettings().

The maximum length of a Jump List item's description property is 260 characters. Beyond this limit, the item will not be added to the Jump List, nor will it be displayed.

Here's a very simple example of creating a custom Jump List:

The return value of this method indicates whether or not this instance of your application successfully obtained the lock. If it failed to obtain the lock, you can assume that another instance of your application is already running with the lock and exit immediately.

I.e. This method returns true if your process is the primary instance of your application and your app should continue loading. It returns false if your process should immediately quit as it has sent its parameters to another instance that has already acquired the lock.

On macOS, the system enforces single instance automatically when users try to open a second instance of your app in Finder, and the open-file and open-url events will be emitted for that. However when users start your app in command line, the system's single instance mechanism will be bypassed, and you have to use this method to ensure single instance.

An example of activating the window of primary instance when a second instance starts:

This method returns whether or not this instance of your app is currently holding the single instance lock. You can request the lock with app.requestSingleInstanceLock() and release with app.releaseSingleInstanceLock()

Releases all locks that were created by requestSingleInstanceLock. This will allow multiple instances of the application to once again run side by side.

Creates an NSUserActivity and sets it as the current activity. The activity is eligible for Handoff to another device afterward.

Returns string - The type of the currently running activity.

Invalidates the current Handoff user activity.

Marks the current Handoff user activity as inactive without invalidating it.

Updates the current activity if its type matches type, merging the entries from userInfo into its current userInfo dictionary.

Changes the Application User Model ID to id.

Sets the activation policy for a given app.

Activation policy types:

Imports the certificate in pkcs12 format into the platform certificate store. callback is called with the result of import operation, a value of 0 indicates success while any other value indicates failure according to Chromium net_error_list.

Configures host resolution (DNS and DNS-over-HTTPS). By default, the following resolvers will be used, in order:

This can be configured to either restrict usage of non-encrypted DNS (secureDnsMode: "secure"), or disable DNS-over-HTTPS (secureDnsMode: "off"). It is also possible to enable or disable the built-in resolver.

To disable insecure DNS, you can specify a secureDnsMode of "secure". If you do so, you should make sure to provide a list of DNS-over-HTTPS servers to use, in case the user's DNS configuration does not include a provider that supports DoH.

This API must be called after the ready event is emitted.

Disables hardware acceleration for current app.

This method can only be called before app is ready.

Returns boolean - whether hardware acceleration is currently enabled.

This information is only usable after the gpu-info-update event is emitted.

By default, Chromium disables 3D APIs (e.g. WebGL) until restart on a per domain basis if the GPU processes crashes too frequently. This function disables that behavior.

This method can only be called before app is ready.

Returns ProcessMetric[]: Array of ProcessMetric objects that correspond to memory and CPU usage statistics of all the processes associated with the app.

Returns GPUFeatureStatus - The Graphics Feature Status from chrome://gpu/.

This information is only usable after the gpu-info-update event is emitted.

Returns Promise<unknown>

For infoType equal to complete: Promise is fulfilled with Object containing all the GPU Information as in chromium's GPUInfo object. This includes the version and driver information that's shown on chrome://gpu page.

For infoType equal to basic: Promise is fulfilled with Object containing fewer attributes than when requested with complete. Here's an example of basic response:

Using basic should be preferred if only basic information like vendorId or deviceId is needed.

Returns boolean - Whether the call succeeded.

Sets the counter badge for current app. Setting the count to 0 will hide the badge.

On macOS, it shows on the dock icon. On Linux, it only works for Unity launcher.

Unity launcher requires a .desktop file to work. For more information, please read the Unity integration documentation.

On macOS, you need to ensure that your application has the permission to display notifications for this method to work.

Returns Integer - The current value displayed in the counter badge.

Returns boolean - Whether the current desktop environment is Unity launcher.

If you provided path and args options to app.setLoginItemSettings, then you need to pass the same arguments here for openAtLogin to be set correctly.

Set the app's login item settings.

To work with Electron's autoUpdater on Windows, which uses Squirrel, you'll want to set the launch path to your executable's name but a directory up, which is a stub application automatically generated by Squirrel which will automatically launch the latest version.

For more information about setting different services as login items on macOS 13 and up, see SMAppService.

Returns boolean - true if Chrome's accessibility support is enabled, false otherwise. This API will return true if the use of assistive technologies, such as screen readers, has been detected. See https://www.chromium.org/developers/design-documents/accessibility for more details.

Manually enables Chrome's accessibility support, allowing to expose accessibility switch to users in application settings. See Chromium's accessibility docs for more details. Disabled by default.

This API must be called after the ready event is emitted.

Rendering accessibility tree can significantly affect the performance of your app. It should not be enabled by default. Calling this method will enable the following accessibility support features: nativeAPIs, webContents, inlineTextBoxes, and extendedProperties.

Returns string[] - Array of strings naming currently enabled accessibility support components. Possible values:

To disable all supported features, pass an empty array [].

Show the app's about panel options. These options can be overridden with app.setAboutPanelOptions(options). This function runs asynchronously.

Set the about panel options. This will override the values defined in the app's .plist file on macOS. See the Apple docs for more details. On Linux, values must be set in order to be shown; there are no defaults.

If you do not set credits but still wish to surface them in your app, AppKit will look for a file named "Credits.html", "Credits.rtf", and "Credits.rtfd", in that order, in the bundle returned by the NSBundle class method main. The first file found is used, and if none is found, the info area is left blank. See Apple documentation for more information.

Returns boolean - whether or not the current OS version allows for native emoji pickers.

Show the platform's native emoji picker.

Returns Function - This function must be called once you have finished accessing the security scoped file. If you do not remember to stop accessing the bookmark, kernel resources will be leaked and your app will lose its ability to reach outside the sandbox completely, until your app is restarted.

Start accessing a security scoped resource. With this method Electron applications that are packaged for the Mac App Store may reach outside their sandbox to access files chosen by the user. See Apple's documentation for a description of how this system works.

Enables full sandbox mode on the app. This means that all renderers will be launched sandboxed, regardless of the value of the sandbox flag in WebPreferences.

This method can only be called before app is ready.

Returns boolean - Whether the application is currently running from the systems Application folder. Use in combination with app.moveToApplicationsFolder()

Returns boolean - Whether the move was successful. Please note that if the move is successful, your application will quit and relaunch.

No confirmation dialog will be presented by default. If you wish to allow the user to confirm the operation, you may do so using the dialog API.

NOTE: This method throws errors if anything other than the user causes the move to fail. For instance if the user cancels the authorization dialog, this method returns false. If we fail to perform the copy, then this method will throw an error. The message in the error should be informative and tell you exactly what went wrong.

By default, if an app of the same name as the one being moved exists in the Applications directory and is not running, the existing app will be trashed and the active app moved into its place. If it is running, the preexisting running app will assume focus and the previously active app will quit itself. This behavior can be changed by providing the optional conflict handler, where the boolean returned by the handler determines whether or not the move conflict is resolved with default behavior. i.e. returning false will ensure no further action is taken, returning true will result in the default behavior and the method continuing.

Would mean that if an app already exists in the user directory, if the user chooses to 'Continue Move' then the function would continue with its default behavior and the existing app will be trashed and the active app moved into its place.

Returns boolean - whether Secure Keyboard Entry is enabled.

By default this API will return false.

Set the Secure Keyboard Entry is enabled in your application.

By using this API, important information such as password and other sensitive information can be prevented from being intercepted by other processes.

See Apple's documentation for more details.

Enable Secure Keyboard Entry only when it is needed and disable it when it is no longer needed.

Returns Promise<void> - Resolves when the proxy setting process is complete.

Sets the proxy settings for networks requests made without an associated Session. Currently this will affect requests made with Net in the utility process and internal requests made by the runtime (ex: geolocation queries).

This method can only be called after app is ready.

Returns Promise<string> - Resolves with the proxy information for url that will be used when attempting to make requests using Net in the utility process.

handler Function<Promise<string>>

Returns Promise<string> - Resolves with the password

The handler is called when a password is needed to unlock a client certificate for hostname.

A boolean property that's true if Chrome's accessibility support is enabled, false otherwise. This property will be true if the use of assistive technologies, such as screen readers, has been detected. Setting this property to true manually enables Chrome's accessibility support, allowing developers to expose accessibility switch to users in application settings.

See Chromium's accessibility docs for more details. Disabled by default.

This API must be called after the ready event is emitted.

Rendering accessibility tree can significantly affect the performance of your app. It should not be enabled by default.

A Menu | null property that returns Menu if one has been set and null otherwise. Users can pass a Menu to set this property.

An Integer property that returns the badge count for current app. Setting the count to 0 will hide the badge.

On macOS, setting this with any nonzero integer shows on the dock icon. On Linux, this property only works for Unity launcher.

Unity launcher requires a .desktop file to work. For more information, please read the Unity integration documentation.

On macOS, you need to ensure that your application has the permission to display notifications for this property to take effect.

A CommandLine object that allows you to read and manipulate the command line arguments that Chromium uses.

A Dock | undefined property (Dock on macOS, undefined on all other platforms) that allows you to perform actions on your app icon in the user's dock.

A boolean property that returns true if the app is packaged, false otherwise. For many apps, this property can be used to distinguish development and production environments.

A string property that indicates the current application's name, which is the name in the application's package.json file.

Usually the name field of package.json is a short lowercase name, according to the npm modules spec. You should usually also specify a productName field, which is your application's full capitalized name, and which will be preferred over name by Electron.

A string which is the user agent string Electron will use as a global fallback.

This is the user agent that will be used when no user agent is set at the webContents or session level. It is useful for ensuring that your entire app has the same user agent. Set to a custom value as early as possible in your app's initialization to ensure that your overridden value is used.

A boolean which when true indicates that the app is currently running under an ARM64 translator (like the macOS Rosetta Translator Environment or Windows WOW).

You can use this property to prompt users to download the arm64 version of your application when they are mistakenly running the x64 version under Rosetta or WOW.

**Examples:**

Example 1 (javascript):
```javascript
const { app } = require('electron')app.on('window-all-closed', () => {  app.quit()})
```

Example 2 (javascript):
```javascript
const { app } = require('electron')app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {  if (url === 'https://github.com') {    // Verification logic.    event.preventDefault()    callback(true)  } else {    callback(false)  }})
```

Example 3 (javascript):
```javascript
const { app } = require('electron')app.on('select-client-certificate', (event, webContents, url, list, callback) => {  event.preventDefault()  callback(list[0])})
```

Example 4 (javascript):
```javascript
const { app } = require('electron')app.on('login', (event, webContents, details, authInfo, callback) => {  event.preventDefault()  callback('username', 'secret')})
```

---
