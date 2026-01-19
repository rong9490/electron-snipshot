# Electron - Ipc

**Pages:** 2

---

## utilityProcess

**URL:** https://www.electronjs.org/docs/latest/api/utility-process

**Contents:**
- utilityProcess
- Methods​
  - utilityProcess.fork(modulePath[, args][, options])​
- Class: UtilityProcess​
  - Instance Methods​
    - child.postMessage(message, [transfer])​
    - child.kill()​
  - Instance Properties​
    - child.pid​
    - child.stdout​

utilityProcess creates a child process with Node.js and Message ports enabled. It provides the equivalent of child_process.fork API from Node.js but instead uses Services API from Chromium to launch the child process.

Returns UtilityProcess

utilityProcess.fork can only be called after the ready event has been emitted on App.

Instances of the UtilityProcess represent the Chromium spawned child process with Node.js integration.

UtilityProcess is an EventEmitter.

Send a message to the child process, optionally transferring ownership of zero or more MessagePortMain objects.

Terminates the process gracefully. On POSIX, it uses SIGTERM but will ensure the process is reaped on exit. This function returns true if the kill is successful, and false otherwise.

A Integer | undefined representing the process identifier (PID) of the child process. Until the child process has spawned successfully, the value is undefined. When the child process exits, then the value is undefined after the exit event is emitted.

You can use the pid to determine if the process is currently running.

A NodeJS.ReadableStream | null that represents the child process's stdout. If the child was spawned with options.stdio[1] set to anything other than 'pipe', then this will be null. When the child process exits, then the value is null after the exit event is emitted.

A NodeJS.ReadableStream | null that represents the child process's stderr. If the child was spawned with options.stdio[2] set to anything other than 'pipe', then this will be null. When the child process exits, then the value is null after the exit event is emitted.

Emitted once the child process has spawned successfully.

Emitted when the child process needs to terminate due to non continuable error from V8.

No matter if you listen to the error event, the exit event will be emitted after the child process terminates.

Emitted after the child process ends.

Emitted when the child process sends a message using process.parentPort.postMessage().

**Examples:**

Example 1 (javascript):
```javascript
// Main processconst { port1, port2 } = new MessageChannelMain()const child = utilityProcess.fork(path.join(__dirname, 'test.js'))child.postMessage({ message: 'hello' }, [port1])// Child processprocess.parentPort.once('message', (e) => {  const [port] = e.ports  // ...})
```

Example 2 (javascript):
```javascript
const child = utilityProcess.fork(path.join(__dirname, 'test.js'))console.log(child.pid) // undefinedchild.on('spawn', () => {  console.log(child.pid) // Integer})child.on('exit', () => {  console.log(child.pid) // undefined})
```

Example 3 (javascript):
```javascript
// Main processconst { port1, port2 } = new MessageChannelMain()const child = utilityProcess.fork(path.join(__dirname, 'test.js'))child.stdout.on('data', (data) => {  console.log(`Received chunk ${data}`)})
```

---

## parentPort

**URL:** https://www.electronjs.org/docs/latest/api/parent-port

**Contents:**
- parentPort
- Events​
  - Event: 'message'​
- Methods​
  - parentPort.postMessage(message)​

Interface for communication with parent process.

parentPort is an EventEmitter. This object is not exported from the 'electron' module. It is only available as a property of the process object in the Electron API.

The parentPort object emits the following events:

Emitted when the process receives a message. Messages received on this port will be queued up until a handler is registered for this event.

Sends a message from the process to its parent.

**Examples:**

Example 1 (javascript):
```javascript
// Main processconst child = utilityProcess.fork(path.join(__dirname, 'test.js'))child.postMessage({ message: 'hello' })child.on('message', (data) => {  console.log(data) // hello world!})// Child processprocess.parentPort.on('message', (e) => {  process.parentPort.postMessage(`${e.data} world!`)})
```

---
