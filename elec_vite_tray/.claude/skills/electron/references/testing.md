# Electron - Testing

**Pages:** 21

---

## Using clang-tidy on C++ Code

**URL:** https://www.electronjs.org/docs/latest/development/clang-tidy

**Contents:**
- Using clang-tidy on C++ Code

clang-tidy is a tool to automatically check C/C++/Objective-C code for style violations, programming errors, and best practices.

Electron's clang-tidy integration is provided as a linter script which can be run with npm run lint:clang-tidy. While clang-tidy checks your on-disk files, you need to have built Electron so that it knows which compiler flags were used. There is one required option for the script --output-dir, which tells the script which build directory to pull the compilation information from. A typical usage would be: npm run lint:clang-tidy --out-dir ../out/Testing

With no filenames provided, all C/C++/Objective-C files will be checked. You can provide a list of files to be checked by passing the filenames after the options: npm run lint:clang-tidy --out-dir ../out/Testing shell/browser/api/electron_api_app.cc

While clang-tidy has a long list of possible checks, in Electron only a few are enabled by default. At the moment Electron doesn't have a .clang-tidy config, so clang-tidy will find the one from Chromium at src/.clang-tidy and use the checks which Chromium has enabled. You can change which checks are run by using the --checks= option. This is passed straight through to clang-tidy, so see its documentation for full details. Wildcards can be used, and checks can be disabled by prefixing a -. By default any checks listed are added to those in .clang-tidy, so if you'd like to limit the checks to specific ones you should first exclude all checks then add back what you want, like --checks=-*,performance*.

Running clang-tidy is rather slow - internally it compiles each file and then runs the checks so it will always be some factor slower than compilation. While you can use parallel runs to speed it up using the --jobs|-j option, clang-tidy also uses a lot of memory during its checks, so it can easily run into out-of-memory errors. As such the default number of jobs is one.

---

## Pull Requests

**URL:** https://www.electronjs.org/docs/latest/development/pull-requests

**Contents:**
- Pull Requests
- Setting up your local environment​
  - Step 1: Fork​
  - Step 2: Build​
  - Step 3: Branch​
- Making Changes​
  - Step 4: Code​
  - Step 5: Commit​
    - Commit signing​
    - Commit message guidelines​

Fork the project on GitHub and clone your fork locally.

Build steps and dependencies differ slightly depending on your operating system. See these detailed guides on building Electron locally:

Once you've built the project locally, you're ready to start making changes!

To keep your development environment organized, create local branches to hold your work. These should be branched directly off of the main branch.

Most pull requests opened against the electron/electron repository include changes to either the C/C++ code in the shell/ folder, the JavaScript code in the lib/ folder, the documentation in docs/api/ or tests in the spec/ folder.

Please be sure to run npm run lint from time to time on any code changes to ensure that they follow the project's code style.

See coding style for more information about best practice when modifying code in different parts of the project.

It is recommended to keep your changes grouped logically within individual commits. Many contributors find it easier to review changes that are split across multiple commits. There is no limit to the number of commits in a pull request.

Note that multiple commits get squashed when they are landed.

The electron/electron repo enforces commit signatures for all incoming PRs. To sign your commits, see GitHub's documentation on Telling Git about your signing key.

A good commit message should describe what changed and why. The Electron project uses semantic commit messages to streamline the release process.

Before a pull request can be merged, it must have a pull request title with a semantic prefix.

Examples of commit messages with semantic prefixes:

Other things to keep in mind when writing a commit message:

A commit that has the text BREAKING CHANGE: at the beginning of its optional body or footer section introduces a breaking API change (correlating with Major in semantic versioning). A breaking change can be part of commits of any type. e.g., a fix:, feat: & chore: types would all be valid, in addition to any other type.

See conventionalcommits.org for more details.

Once you have committed your changes, it is a good idea to use git rebase (not git merge) to synchronize your work with the main repository.

This ensures that your working branch has the latest changes from electron/electron main.

Bug fixes and features should always come with tests. A testing guide has been provided to make the process easier. Looking at other tests to see how they should be structured can also help.

Before submitting your changes in a pull request, always run the full test suite. To run the tests:

Make sure the linter does not report any issues and that all tests pass. Please do not submit patches that fail either check.

If you are updating tests and want to run a single spec to check it:

The above would only run spec modules matching menu, which is useful for anyone who's working on tests that would otherwise be at the very end of the testing cycle.

Once your commits are ready to go -- with passing tests and linting -- begin the process of opening a pull request by pushing your working branch to your fork on GitHub.

From within GitHub, opening a new pull request will present you with a template that should be filled out. It can be found here.

If you do not adequately complete this template, your PR may be delayed in being merged as maintainers seek more information or clarify ambiguities.

You will probably get feedback or requests for changes to your pull request. This is a big part of the submission process so don't be discouraged! Some contributors may sign off on the pull request right away. Others may have detailed comments or feedback. This is a necessary part of the process in order to evaluate whether the changes are correct and necessary.

To make changes to an existing pull request, make the changes to your local branch, add a new commit with those changes, and push those to your fork. GitHub will automatically update the pull request.

There are a number of more advanced mechanisms for managing commits using git rebase that can be used, but are beyond the scope of this guide.

Feel free to post a comment in the pull request to ping reviewers if you are awaiting an answer on something. If you encounter words or acronyms that seem unfamiliar, refer to this glossary.

All pull requests require approval from a Code Owner of the area you modified in order to land. Whenever a maintainer reviews a pull request they may request changes. These may be small, such as fixing a typo, or may involve substantive changes. Such requests are intended to be helpful, but at times may come across as abrupt or unhelpful, especially if they do not include concrete suggestions on how to change them.

Try not to be discouraged. If you feel that a review is unfair, say so or seek the input of another project contributor. Often such comments are the result of a reviewer having taken insufficient time to review and are not ill-intended. Such difficulties can often be resolved with a bit of patience. That said, reviewers should be expected to provide helpful feedback.

In order to land, a pull request needs to be reviewed and approved by at least one Electron Code Owner and pass CI. After that, if there are no objections from other contributors, the pull request can be merged.

Congratulations and thanks for your contribution!

Every pull request is tested on the Continuous Integration (CI) system to confirm that it works on Electron's supported platforms.

Ideally, the pull request will pass ("be green") on all of CI's platforms. This means that all tests pass and there are no linting errors. However, it is not uncommon for the CI infrastructure itself to fail on specific platforms or for so-called "flaky" tests to fail ("be red"). Each CI failure must be manually inspected to determine the cause.

CI starts automatically when you open a pull request, but only core maintainers can restart a CI run. If you believe CI is giving a false negative, ask a maintainer to restart the tests.

**Examples:**

Example 1 (python):
```python
$ git clone git@github.com:username/electron.git$ cd electron$ git remote add upstream https://github.com/electron/electron.git$ git fetch upstream
```

Example 2 (unknown):
```unknown
$ git checkout -b my-branch -t upstream/main
```

Example 3 (unknown):
```unknown
$ git add my/changed/files$ git commit
```

Example 4 (unknown):
```unknown
$ git fetch upstream$ git rebase upstream/main
```

---

## Coding Style

**URL:** https://www.electronjs.org/docs/latest/development/coding-style

**Contents:**
- Coding Style
- General Code​
- C++ and Python​
- Documentation​
- JavaScript​
- Naming Things​

These are the style guidelines for coding in Electron.

You can run npm run lint to show any style issues detected by cpplint and eslint.

For C++ and Python, we follow Chromium's Coding Style. There is also a script script/cpplint.py to check whether all files conform.

The Python version we are using now is Python 3.9.

The C++ code uses a lot of Chromium's abstractions and types, so it's recommended to get acquainted with them. A good place to start is Chromium's Important Abstractions and Data Structures document. The document mentions some special types, scoped types (that automatically release their memory when going out of scope), logging mechanisms etc.

You can run npm run lint:docs to ensure that your documentation changes are formatted correctly.

Electron APIs uses the same capitalization scheme as Node.js:

When creating a new API, it is preferred to use getters and setters instead of jQuery's one-function style. For example, .getText() and .setText(text) are preferred to .text([text]). There is a discussion on this.

---

## Debugging on macOS

**URL:** https://www.electronjs.org/docs/latest/development/debugging-on-macos

**Contents:**
- Debugging on macOS
- Requirements​
- Attaching to and Debugging Electron​
  - Setting Breakpoints​
  - Further Reading​

If you experience crashes or issues in Electron that you believe are not caused by your JavaScript application, but instead by Electron itself, debugging can be a little bit tricky especially for developers not used to native/C++ debugging. However, using lldb and the Electron source code, you can enable step-through debugging with breakpoints inside Electron's source code. You can also use XCode for debugging if you prefer a graphical interface.

A testing build of Electron: The easiest way is usually to build it from source, which you can do by following the instructions in the build instructions. While you can attach to and debug Electron as you can download it directly, you will find that it is heavily optimized, making debugging substantially more difficult. In this case the debugger will not be able to show you the content of all variables and the execution path can seem strange because of inlining, tail calls, and other compiler optimizations.

Xcode: In addition to Xcode, you should also install the Xcode command line tools. They include LLDB, the default debugger in Xcode on macOS. It supports debugging C, Objective-C and C++ on the desktop and iOS devices and simulator.

.lldbinit: Create or edit ~/.lldbinit to allow Chromium code to be properly source-mapped.

To start a debugging session, open up Terminal and start lldb, passing a non-release build of Electron as a parameter.

LLDB is a powerful tool and supports multiple strategies for code inspection. For this basic introduction, let's assume that you're calling a command from JavaScript that isn't behaving correctly - so you'd like to break on that command's C++ counterpart inside the Electron source.

Relevant code files can be found in ./shell/.

Let's assume that you want to debug app.setName(), which is defined in browser.cc as Browser::SetName(). Set the breakpoint using the breakpoint command, specifying file and line to break on:

Then, start Electron:

The app will immediately be paused, since Electron sets the app's name on launch:

To show the arguments and local variables for the current frame, run frame variable (or fr v), which will show you that the app is currently setting the name to "Electron".

To do a source level single step in the currently selected thread, execute step (or s). This would take you into name_override_.empty(). To proceed and do a step over, run next (or n).

NOTE: If you don't see source code when you think you should, you may not have added the ~/.lldbinit file above.

To finish debugging at this point, run process continue. You can also continue until a certain line is hit in this thread (thread until 100). This command will run the thread in the current frame till it reaches line 100 in this frame or stops if it leaves the current frame.

Now, if you open up Electron's developer tools and call setName, you will once again hit the breakpoint.

LLDB is a powerful tool with a great documentation. To learn more about it, consider Apple's debugging documentation, for instance the LLDB Command Structure Reference or the introduction to Using LLDB as a Standalone Debugger.

You can also check out LLDB's fantastic manual and tutorial, which will explain more complex debugging scenarios.

**Examples:**

Example 1 (markdown):
```markdown
# e.g: ['~/electron/src/tools/lldb']script sys.path[:0] = ['<...path/to/electron/src/tools/lldb>']script import lldbinit
```

Example 2 (unknown):
```unknown
$ lldb ./out/Testing/Electron.app(lldb) target create "./out/Testing/Electron.app"Current executable set to './out/Testing/Electron.app' (x86_64).
```

Example 3 (typescript):
```typescript
(lldb) breakpoint set --file browser.cc --line 117Breakpoint 1: where = Electron Framework`atom::Browser::SetName(std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> > const&) + 20 at browser.cc:118, address = 0x000000000015fdb4
```

Example 4 (cpp):
```cpp
(lldb) runProcess 25244 launched: '/Users/fr/Code/electron/out/Testing/Electron.app/Contents/MacOS/Electron' (x86_64)Process 25244 stopped* thread #1: tid = 0x839a4c, 0x0000000100162db4 Electron Framework`atom::Browser::SetName(this=0x0000000108b14f20, name="Electron") + 20 at browser.cc:118, queue = 'com.apple.main-thread', stop reason = breakpoint 1.1    frame #0: 0x0000000100162db4 Electron Framework`atom::Browser::SetName(this=0x0000000108b14f20, name="Electron") + 20 at browser.cc:118   115 	}   116   117 	void Browser::SetName(const std::string& name) {-> 118 	  name_override_ = name;   119 	}   120   121 	int Browser::GetBadgeCount() {(lldb)
```

---

## Patches in Electron

**URL:** https://www.electronjs.org/docs/latest/development/patches

**Contents:**
- Patches in Electron
- Patch justification​
- Patch system​
  - Usage​
    - Adding a new patch​
    - Editing an existing patch​
    - Removing a patch​
    - Resolving conflicts​

Electron is built on two major upstream projects: Chromium and Node.js. Each of these projects has several of their own dependencies, too. We try our best to use these dependencies exactly as they are but sometimes we can't achieve our goals without patching those upstream dependencies to fit our use cases.

Every patch in Electron is a maintenance burden. When upstream code changes, patches can break—sometimes without even a patch conflict or a compilation error. It's an ongoing effort to keep our patch set up-to-date and effective. So we strive to keep our patch count at a minimum. To that end, every patch must describe its reason for existence in its commit message. That reason must be one of the following:

In general, all the upstream projects we work with are friendly folks and are often happy to accept refactorings that allow the code in question to be compatible with both Electron and the upstream project. (See e.g. this change in Chromium, which allowed us to remove a patch that did the same thing, or this change in Node, which was a no-op for Node but fixed a bug in Electron.) We should aim to upstream changes whenever we can, and avoid indefinite-lifetime patches.

If you find yourself in the unfortunate position of having to make a change which can only be made through patching an upstream project, you'll need to know how to manage patches in Electron.

All patches to upstream projects in Electron are contained in the patches/ directory. Each subdirectory of patches/ contains several patch files, along with a .patches file which lists the order in which the patches should be applied. Think of these files as making up a series of git commits that are applied on top of the upstream project after we check it out.

To help manage these patch sets, we provide two tools: git-import-patches and git-export-patches. git-import-patches imports a set of patch files into a git repository by applying each patch in the correct order and creating a commit for each one. git-export-patches does the reverse; it exports a series of git commits in a repository into a set of files in a directory and an accompanying .patches file.

Side note: the reason we use a .patches file to maintain the order of applied patches, rather than prepending a number like 001- to each file, is because it reduces conflicts related to patch ordering. It prevents the situation where two PRs both add a patch at the end of the series with the same numbering and end up both getting merged resulting in a duplicate identifier, and it also reduces churn when a patch is added or deleted in the middle of the series.

git-export-patches ignores any uncommitted files, so you must create a commit if you want your changes to be exported. The subject line of the commit message will be used to derive the patch file name, and the body of the commit message should include the reason for the patch's existence.

Re-exporting patches will sometimes cause shasums in unrelated patches to change. This is generally harmless and can be ignored (but go ahead and add those changes to your PR, it'll stop them from showing up for other people).

Note that the ^ symbol can cause trouble on Windows. The workaround is to either quote it "[COMMIT_SHA]^" or avoid it [COMMIT_SHA]~1.

Note that git-import-patches will mark the commit that was HEAD when it was run as refs/patches/upstream-head. This lets you keep track of which commits are from Electron patches (those that come after refs/patches/upstream-head) and which commits are in upstream (those before refs/patches/upstream-head).

When updating an upstream dependency, patches may fail to apply cleanly. Often, the conflict can be resolved automatically by git with a 3-way merge. You can instruct git-import-patches to use the 3-way merge algorithm by passing the -3 argument:

If git-import-patches -3 encounters a merge conflict that it can't resolve automatically, it will pause and allow you to resolve the conflict manually. Once you have resolved the conflict, git add the resolved files and continue to apply the rest of the patches by running git am --continue.

**Examples:**

Example 1 (r):
```r
patches├── config.json   <-- this describes which patchset directory is applied to what project├── chromium│   ├── .patches│   ├── accelerator.patch│   ├── add_contentgpuclient_precreatemessageloop_callback.patch│   ⋮├── node│   ├── .patches│   ├── add_openssl_is_boringssl_guard_to_oaep_hash_check.patch│   ├── build_add_gn_build_files.patch│   ⋮⋮
```

Example 2 (bash):
```bash
$ cd src/third_party/electron_node$ vim some/code/file.cc$ git commit$ ../../electron/script/git-export-patches -o ../../electron/patches/node
```

Example 3 (bash):
```bash
$ cd src/v8$ vim some/code/file.cc$ git log# Find the commit sha of the patch you want to edit.$ git commit --fixup [COMMIT_SHA]$ git rebase --autosquash -i [COMMIT_SHA]^$ ../electron/script/git-export-patches -o ../electron/patches/v8
```

Example 4 (bash):
```bash
$ vim src/electron/patches/node/.patches# Delete the line with the name of the patch you want to remove$ cd src/third_party/electron_node$ git reset --hard refs/patches/upstream-head$ ../../electron/script/git-import-patches ../../electron/patches/node$ ../../electron/script/git-export-patches -o ../../electron/patches/node
```

---

## Electron Debugging

**URL:** https://www.electronjs.org/docs/latest/development/debugging

**Contents:**
- Electron Debugging
- Generic Debugging​
- Printing Stacktraces​
- Breakpoint Debugging​
- Platform-Specific Debugging​
- Debugging with the Symbol Server​

There are many different approaches to debugging issues and bugs in Electron, many of which are platform specific.

Some of the more common approaches are outlined below.

Chromium contains logging macros which can aid debugging by printing information to console in C++ and Objective-C++.

You might use this to print out variable values, function names, and line numbers, amongst other things.

There are also different levels of logging severity: INFO, WARN, and ERROR.

See logging.h in Chromium's source tree for more information and examples.

Chromium contains a helper to print stack traces to console without interrupting the program.

This will allow you to observe call chains and identify potential issue areas.

Note that this will increase the size of the build significantly, taking up around 50G of disk space

Write the following file to electron/.git/info/exclude/debug.gn

Now you can use LLDB for breakpoint debugging.

Debug symbols allow you to have better debugging sessions. They have information about the functions contained in executables and dynamic libraries and provide you with information to get clean call stacks. A Symbol Server allows the debugger to load the correct symbols, binaries and sources automatically without forcing users to download large debugging files.

For more information about how to set up a symbol server for Electron, see debugging with a symbol server.

**Examples:**

Example 1 (cpp):
```cpp
LOG(INFO) << "bitmap.width(): " << bitmap.width();LOG(INFO, bitmap.width() > 10) << "bitmap.width() is greater than 10!";
```

Example 2 (cpp):
```cpp
#include "base/debug/stack_trace.h"...base::debug::StackTrace().Print();
```

Example 3 (unknown):
```unknown
import("//electron/build/args/testing.gn")is_debug = truesymbol_level = 2forbid_non_component_debug_builds = false
```

Example 4 (bash):
```bash
$ gn gen out/Debug --args="import(\"//electron/.git/info/exclude/debug.gn\") $GN_EXTRA_ARGS"$ ninja -C out/Debug electron
```

---

## Build Instructions (macOS)

**URL:** https://www.electronjs.org/docs/latest/development/build-instructions-macos

**Contents:**
- Build Instructions (macOS)
- Prerequisites​
  - Arm64-specific prerequisites​
- Building Electron​
- Troubleshooting​
  - Xcode "incompatible architecture" errors (MacOS arm64-specific)​
  - Certificates fail to verify​

Follow the guidelines below for building Electron itself on macOS, for the purposes of creating custom Electron binaries. For bundling and distributing your app code with the prebuilt Electron binaries, see the application distribution guide.

See Build Instructions: GN.

If both Xcode and Xcode command line tools are installed ($ xcode -select --install, or directly download the correct version here), but the stack trace says otherwise like so:

If you are on arm64 architecture, the build script may be pointing to the wrong Xcode version (11.x.y doesn't support arm64). Navigate to /Users/<user>/.electron_build_tools/third_party/Xcode/ and rename Xcode-13.3.0.app to Xcode.app to ensure the right Xcode version is used.

installing certifi will fix the following error:

This issue has to do with Python 3.6 using its own copy of OpenSSL in lieu of the deprecated Apple-supplied OpenSSL libraries. certifi adds a curated bundle of default root certificates. This issue is documented in the Electron repo here. Further information about this issue can be found here and here.

**Examples:**

Example 1 (yaml):
```yaml
xcrun: error: unable to load libxcrun(dlopen(/Users/<user>/.electron_build_tools/third_party/Xcode/Xcode.app/Contents/Developer/usr/lib/libxcrun.dylib (http://xcode.app/Contents/Developer/usr/lib/libxcrun.dylib), 0x0005): tried: '/Users/<user>/.electron_build_tools/third_party/Xcode/Xcode.app/Contents/Developer/usr/lib/libxcrun.dylib (http://xcode.app/Contents/Developer/usr/lib/libxcrun.dylib)' (mach-o file, but is an incompatible architecture (have (x86_64), need (arm64e))), '/Users/<user>/.electron_build_tools/third_party/Xcode/Xcode-11.1.0.app/Contents/Developer/usr/lib/libxcrun.dylib (http://xcode-11.1.0.app/Contents/Developer/usr/lib/libxcrun.dylib)' (mach-o file, but is an incompatible architecture (have (x86_64), need (arm64e)))).`
```

Example 2 (jsx):
```jsx
________ running 'python3 src/tools/clang/scripts/update.py' in '/Users/<user>/electron'Downloading https://commondatastorage.googleapis.com/chromium-browser-clang/Mac_arm64/clang-llvmorg-15-init-15652-g89a99ec9-1.tgz<urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:997)>Retrying in 5 s ...Downloading https://commondatastorage.googleapis.com/chromium-browser-clang/Mac_arm64/clang-llvmorg-15-init-15652-g89a99ec9-1.tgz<urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:997)>Retrying in 10 s ...Downloading https://commondatastorage.googleapis.com/chromium-browser-clang/Mac_arm64/clang-llvmorg-15-init-15652-g89a99ec9-1.tgz<urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:997)>Retrying in 20 s ...
```

---

## Testing

**URL:** https://www.electronjs.org/docs/latest/development/testing

**Contents:**
- Testing
- Linting​
- Unit Tests​
- Node.js Smoke Tests​
  - Testing on Windows 10 devices​
    - Extra steps to run the unit test:​
    - Missing fonts​
    - Pixel measurements​

We aim to keep the code coverage of Electron high. We ask that all pull request not only pass all existing tests, but ideally also add new tests to cover changed code and new scenarios. Ensuring that we capture as many code paths and use cases of Electron as possible ensures that we all ship apps with fewer bugs.

This repository comes with linting rules for both JavaScript and C++ – as well as unit and integration tests. To learn more about Electron's coding style, please see the coding-style document.

To ensure that your changes are in compliance with the Electron coding style, run npm run lint, which will run a variety of linting checks against your changes depending on which areas of the code they touch.

Many of these checks are included as precommit hooks, so it's likely you error would be caught at commit time.

If you are not using build-tools, ensure that the name you have configured for your local build of Electron is one of Testing, Release, Default, or you have set process.env.ELECTRON_OUT_DIR. Without these set, Electron will fail to perform some pre-testing steps.

To run all unit tests, run npm run test. The unit tests are an Electron app (surprise!) that can be found in the spec folder. Note that it has its own package.json and that its dependencies are therefore not defined in the top-level package.json.

To run only specific tests matching a pattern, run npm run test -- -g=PATTERN, replacing the PATTERN with a regex that matches the tests you would like to run. As an example: If you want to run only IPC tests, you would run npm run test -- -g ipc.

If you've made changes that might affect the way Node.js is embedded into Electron, we have a test runner that runs all of the tests from Node.js, using Electron's custom fork of Node.js.

To run all of the Node.js tests:

To run a single Node.js test:

where the argument passed to the runner is the path to the test in the Node.js source tree.

Visual Studio 2019 must be installed.

Node headers have to be compiled for your configuration.

The electron.lib has to be copied as node.lib.

Some Windows 10 devices do not ship with the Meiryo font installed, which may cause a font fallback test to fail. To install Meiryo:

Some tests which rely on precise pixel measurements may not work correctly on devices with Hi-DPI screen settings due to floating point precision errors. To run these tests correctly, make sure the device is set to 100% scaling.

To configure display scaling:

**Examples:**

Example 1 (bash):
```bash
$ node script/node-spec-runner.js
```

Example 2 (bash):
```bash
$ node script/node-spec-runner.js parallel/test-crypto-keygen
```

Example 3 (powershell):
```powershell
ninja -C out\Testing electron:node_headers
```

Example 4 (powershell):
```powershell
cd out\Testingmkdir gen\node_headers\Releasecopy electron.lib gen\node_headers\Release\node.lib
```

---

## Issues In Electron

**URL:** https://www.electronjs.org/docs/latest/development/issues

**Contents:**
- Issues In Electron
- How to Contribute to Issues​
- Asking for General Help​
- Submitting a Bug Report​
- Triaging a Bug Report​
- Resolving a Bug Report​

For any issue, there are fundamentally three ways an individual can contribute:

The Electron website has a list of resources for getting programming help, reporting security issues, contributing, and more. Please use the issue tracker for bugs only!

To submit a bug report:

When opening a new issue in the electron/electron issue tracker, users will be presented with a template that should be filled in.

If you believe that you have found a bug in Electron, please fill out the template to the best of your ability.

The two most important pieces of information needed to evaluate the report are a description of the bug and a simple test case to recreate it. It is easier to fix a bug if it can be reproduced.

See How to create a Minimal, Complete, and Verifiable example.

It's common for open issues to involve discussion. Some contributors may have differing opinions, including whether the behavior is a bug or feature. This discussion is part of the process and should be kept focused, helpful, and professional.

Terse responses that provide neither additional context nor supporting detail are not helpful or professional. To many, such responses are annoying and unfriendly.

Contributors are encouraged to solve issues collaboratively and help one another make progress. If you encounter an issue that you feel is invalid, or which contains incorrect information, explain why you feel that way with additional supporting context, and be willing to be convinced that you may be wrong. By doing so, we can often reach the correct outcome faster.

Most issues are resolved by opening a pull request. The process for opening and reviewing a pull request is similar to that of opening and triaging issues, but carries with it a necessary review and approval workflow that ensures that the proposed changes meet the minimal quality and functional guidelines of the Electron project.

---

## Why Electron

**URL:** https://www.electronjs.org/docs/latest/why-electron

**Contents:**
- Why Electron
- Why choose web technologies​
  - Versatility​
  - Reliability​
  - Interoperability​
  - Ubiquity​
- Why choose Electron​
  - Enterprise-grade​
  - Mature​
  - Stability, security, performance​

Electron is a framework enabling developers to build cross-platform desktop applications for macOS, Windows, and Linux by combining web technologies (HTML, JavaScript, CSS) with Node.js and native code. It is open-source, MIT-licensed, and free for both commercial and personal use. In this document, we’ll explain why companies and developers choose Electron.

We can split up the benefits of Electron in two questions: First, why should you use web technologies to build your application? Then, why should you choose Electron as the framework to do so?

If you’re already using web technologies for your application, you can skip straight to the Why Electron? section below.

Web technologies include HTML, CSS, JavaScript, and WebAssembly. They’re the storefront of the modern Internet. Those technologies have emerged as the best choice for building user interfaces — both for consumer applications as well as mission-critical business applications. This is true both for applications that need to run in a browser as well as desktop applications that are not accessible from a browser. Our bold claim here is that this isn’t just true for cross-platform applications that need to run on multiple operating systems but true overall.

As an example, NASA’s actual Mission Control is written with web technologies. The Bloomberg Terminal, the computer system found at every financial institution, is written with web technologies and runs inside Chromium. It costs $25,000 per user, per year. The McDonald’s ordering kiosk, powering the world’s biggest food retailer, is entirely built with Chromium. The SpaceX’s Dragon 2 space capsule uses Chromium to display its interface. You get the point: web technologies are a great tech stack to build user interfaces.

Here are the reasons we, the Electron maintainers, are betting on the web.

Modern versions of HTML and CSS enable your developers and designers to fully express themselves. The web’s showcase includes Google Earth, Netflix, Spotify, Gmail, Facebook, Airbnb, or GitHub. Whatever interface your application needs, you will be able to express it with HTML, CSS, and JavaScript.

If you want to focus on building a great product without figuring out how you can realize your designer’s vision in a specific UI framework, the web is a safe bet.

Web technologies are the most-used foundation for user interfaces on the planet. They have been hardened accordingly. Modern computers have been optimized from the CPU to the operating system to be good at running web technologies. The manufacturers of your user’s devices—be that an Android phone or the latest MacBook—will ensure that they can visit websites, play videos on YouTube, or display emails. In turn, they’ll also ensure that your app has a stable foundation, even if you have just one user.

If you want to focus on building a great product without debugging a weird quirk that nobody has found before, the web is a safe bet.

Whatever provider or customer data you need to interact with, they will have probably thought of an integration path with the web. Depending on your technology choice, embedding a YouTube video either takes 30 seconds or requires you to hire a team devoted to streaming and hardware-accelerated video decoding. In the case of YouTube, using anything other than the provided players is actually against their terms and conditions, so you’ll likely embed a browser frame before you implement your own video streaming decoder.

There will be virtually no platform where your app cannot run if you build it with web technologies. Virtually all devices with a display—be that an ATM, a car infotainment system, a smart TV, a fridge, or a Nintendo Switch—come with means to display web technologies. The web is safe bet if you want to be cross-platform.

It’s easy to find developers with experience building with web technologies. If you’re a developer, it’ll be easy to find answers to your questions on Google, Stack Overflow, GitHub, or a coding AI of your choice. Whatever problem you need to solve, it’s likely that somebody has solved it well before—and that you can find the answer to the puzzle online.

If you want to focus on building a great product with ample access to resources and materials, the web is a safe bet.

Electron combines Chromium, Node.js, and the ability to write custom native code into one framework for building powerful desktop applications. There are three main reasons to use Electron:

Electron is reliable, secure, stable, and mature. It is the premier choice for companies building their flagship product. We have a list of some of those companies on our homepage, but just among chat apps, Slack, Discord, and Signal are built with Electron. Among AI applications, both OpenAI’s ChatGPT and Anthropic’s Claude use Electron. Visual Studio Code, Loom, Canva, Notion, Docker, and countless other leading developers of software bet on Electron.

We did make it a priority to make Electron easy to work with and a delight for developers. That’s likely the main reason why Electron became as popular as it is today — but what keeps Electron alive and thriving is the maintainer’s focus on making Electron as stable, secure, performant, and capable of mission-critical use cases for end users as possible. We’re building an Electron that is ready to be used in scenarios where unfixable bugs, unpatched security holes, and outages of any kind are worst-case scenarios.

Our current estimation is that most desktop computers on the planet run at least one Electron app. Electron has grown by prioritizing talent in its maintainer group, fostering excellent and sustainable engineering practices in managing the ongoing maintenance, and proactively inviting companies betting on Electron to directly contribute to the project. We’re an impact project with the OpenJS foundation, which is itself a part of the Linux foundation. We share resources and expertise with other foundation projects like Node.js, ESLint, Webpack - or the Linux Kernel or Kubernetes.

What does all of that mean for you, a developer, in practice?

Electron delivers the best experience on all target platforms (macOS, Windows, Linux) by bundling the latest version of Chromium, V8, and Node.js directly with the application binary. When it comes to running and rendering web content with upmost stability, security, and performance, we currently believe that stack to be “best in class”.

You might wonder why we bundle Chromium’s web stack with our apps when most modern operating systems already ship a browser and some form of web view. Bundling doesn’t just increase the amount of work for Electron maintainers dramatically, it also increases the total disk size of Electron apps (most apps are >100MB). Many Electron maintainers once developed applications that did make use of embedded web views — and have since accepted the increased disk size and maintainer work as a worthy trade-off.

When using an operating system's built-in web view, you're limited by the browser version included in the oldest operating system version you need to support. We have found the following problems with this approach:

Electron aims to enable the apps it supports to deliver the best possible user experience, followed by the best possible developer experience. Chromium is currently the best cross-platform rendering stack available. Node.js uses Chromium’s JavaScript engine V8, allowing us to combine the powers of both.

To summarize, we aim to build an Electron that is mature, enterprise-grade, and ready for mission-critical applications. We prioritize reliability, stability, security, and performance. That said, you might also choose Electron for its developer experience:

As outlined above, the web is an amazing platform for building interfaces. That doesn’t mean that we, the maintainers, would build everything with HTML and CSS. Here are some notable exceptions:

Resource-Constrained Environments and IoT: In scenarios with very limited memory or processing power (say, one megabyte of memory and 100MHz of processing power on a low-powered ARM Cortex-M), you will likely need to use a low-level language to directly talk to the display to output basic text and images. Even on slightly higher-powered single-chip devices you might want to consider an embedded UI framework. A classic example is a smart watch.

Small Disk Footprint: Zipped Electron apps are usually around 80 to 100 Megabytes. If a smaller disk footprint is a hard requirement, you’ll have to use something else.

Operating System UI Frameworks and Libraries: By allowing you to write native code, Electron can do anything a native application can do, including the use of the operating system’s UI components, like WinUI, SwiftUI, or AppKit. In practice, most Electron apps make rare use of that ability. If you want the majority of your app to be built with operating system-provided interface components, you’ll likely be better off building fully native apps for each operating system you’d like to target. It’s not that it’s impossible with Electron, it’ll just likely be an overall easier development process.

Games and Real-Time Graphics: If you're building a high-performance game or application requiring complex real-time 3D graphics, native frameworks like Unity, Unreal Engine, or DirectX/OpenGL will provide better performance and more direct access to graphics hardware. Web fans might point out caveats, like the fact that even Unreal Engine ships with Chromium — or that WebGPU and WebGL are developing rapidly and many game engines, including the ones listed here, can now output their games in a format that runs in a browser. That said, if you asked us to build the next AAA game, we’d likely use something else than just web technologies.

Embedding Lightweight Websites: Electron apps typically are mostly web apps with native code sprinkled in where useful. Processing-heavy Electron applications tend to write the UI in HTML/CSS and build the backend in Rust, C++, or another native language. If you’re planning to build a primarily native application that also wants to display a little website in a specific view, you might be better off using the OS-provided web view or something like ultralight.

---

## V8 Development

**URL:** https://www.electronjs.org/docs/latest/development/v8-development

**Contents:**
- V8 Development

A collection of resources for learning and using V8

See also Chromium Development

---

## Build Instructions

**URL:** https://www.electronjs.org/docs/latest/development/build-instructions-gn

**Contents:**
- Build Instructions
- Platform prerequisites​
- Build Tools​
- GN Files​
- GN prerequisites​
  - Setting up the git cache​
- Getting the code​
  - A note on pulling/pushing​
- Building​
  - Packaging​

Follow the guidelines below for building Electron itself, for the purposes of creating custom Electron binaries. For bundling and distributing your app code with the prebuilt Electron binaries, see the application distribution guide.

Check the build prerequisites for your platform before proceeding

Electron's Build Tools automate much of the setup for compiling Electron from source with different configurations and build targets. If you wish to set up the environment manually, the instructions are listed below.

Electron uses GN for project generation and ninja for building. Project configurations can be found in the .gn and .gni files.

The following gn files contain the main rules for building Electron:

You'll need to install depot_tools, the toolset used for fetching Chromium and its dependencies.

Also, on Windows, you'll need to set the environment variable DEPOT_TOOLS_WIN_TOOLCHAIN=0. To do so, open Control Panel → System and Security → System → Advanced system settings and add a system variable DEPOT_TOOLS_WIN_TOOLCHAIN with value 0. This tells depot_tools to use your locally installed version of Visual Studio (by default, depot_tools will try to download a Google-internal version that only Googlers have access to).

If you plan on checking out Electron more than once (for example, to have multiple parallel directories checked out to different branches), using the git cache will speed up subsequent calls to gclient. To do this, set a GIT_CACHE_PATH environment variable:

Instead of https://github.com/electron/electron, you can use your own fork here (something like https://github.com/<username>/electron).

If you intend to git pull or git push from the official electron repository in the future, you now need to update the respective folder's origin URLs.

📝 gclient works by checking a file called DEPS inside the src/electron folder for dependencies (like Chromium or Node.js). Running gclient sync -f ensures that all dependencies required to build Electron match that file.

So, in order to pull, you'd run the following commands:

Set the environment variable for chromium build tools

To generate Testing build config of Electron:

To generate Release build config of Electron:

This will generate a out/Testing or out/Release build directory under src/ with the testing or release build depending upon the configuration passed above. You can replace Testing|Release with another names, but it should be a subdirectory of out.

Also you shouldn't have to run gn gen again—if you want to change the build arguments, you can run gn args out/Testing to bring up an editor. To see the list of available build configuration options, run gn args out/Testing --list.

To build, run ninja with the electron target: Note: This will also take a while and probably heat up your lap.

For the testing configuration:

For the release configuration:

This will build all of what was previously 'libchromiumcontent' (i.e. the content/ directory of chromium and its dependencies, incl. Blink and V8), so it will take a while.

The built executable will be under ./out/Testing:

To package the electron build as a distributable zip file:

To compile for a platform that isn't the same as the one you're building on, set the target_cpu and target_os GN arguments. For example, to compile an x86 target from an x64 host, specify target_cpu = "x86" in gn args.

Not all combinations of source and target CPU/OS are supported by Chromium.

If you test other combinations and find them to work, please update this document :)

See the GN reference for allowable values of target_os and target_cpu.

To cross-compile for Windows on Arm, follow Chromium's guide to get the necessary dependencies, SDK and libraries, then build with ELECTRON_BUILDING_WOA=1 in your environment before running gclient sync.

Or (if using PowerShell):

Next, run gn gen as above with target_cpu="arm64".

To run the tests, you'll first need to build the test modules against the same version of Node.js that was built as part of the build process. To generate build headers for the modules to compile against, run the following under src/ directory.

You can now run the tests.

If you're debugging something, it can be helpful to pass some extra flags to the Electron binary:

It is possible to share the gclient git cache with other machines by exporting it as SMB share on linux, but only one process/machine can be using the cache at a time. The locks created by git-cache script will try to prevent this, but it may not work perfectly in a network.

On Windows, SMBv2 has a directory cache that will cause problems with the git cache script, so it is necessary to disable it by setting the registry key

to 0. More information: https://stackoverflow.com/a/9935126

This can be set quickly in powershell (ran as administrator):

If gclient sync is interrupted the git tree may be left in a bad state, leading to a cryptic message when running gclient sync in the future:

If there are no git conflicts or rebases in src/electron, you may need to abort a git am in src:

This may also happen if you have checked out a branch (as opposed to having a detached head) in electron/src/ or some other dependency’s repository. If that is the case, a git checkout --detach HEAD in the appropriate repository should do the trick.

If you see a prompt for Username for 'https://chrome-internal.googlesource.com': when running gclient sync on Windows, it's probably because the DEPOT_TOOLS_WIN_TOOLCHAIN environment variable is not set to 0. Open Control Panel → System and Security → System → Advanced system settings and add a system variable DEPOT_TOOLS_WIN_TOOLCHAIN with value 0. This tells depot_tools to use your locally installed version of Visual Studio (by default, depot_tools will try to download a Google-internal version that only Googlers have access to).

If e is not recognized despite running npm i -g @electron/build-tools, ie:

We recommend installing Node through nvm. This allows for easier Node version management, and is often a fix for missing e modules.

This could be caused by the local clock time on the machine being off by a small amount. Use time.is to check.

**Examples:**

Example 1 (bash):
```bash
$ export GIT_CACHE_PATH="${HOME}/.git_cache"$ mkdir -p "${GIT_CACHE_PATH}"# This will use about 16G.
```

Example 2 (unknown):
```unknown
$ mkdir electron && cd electron$ gclient config --name "src/electron" --unmanaged https://github.com/electron/electron$ gclient sync --with_branch_heads --with_tags# This will take a while, go get a coffee.
```

Example 3 (powershell):
```powershell
$ cd src/electron$ git remote remove origin$ git remote add origin https://github.com/electron/electron$ git checkout main$ git branch --set-upstream-to=origin/main$ cd -
```

Example 4 (unknown):
```unknown
$ cd src/electron$ git pull$ gclient sync -f
```

---

## Glossary

**URL:** https://www.electronjs.org/docs/latest/glossary

**Contents:**
- Glossary
  - ASAR​
  - ASAR integrity​
  - code signing​
  - context isolation​
  - CRT​
  - DMG​
  - IME​
  - IDL​
  - IPC​

This page defines some terminology that is commonly used in Electron development.

ASAR stands for Atom Shell Archive Format. An asar archive is a simple tar-like format that concatenates files into a single file. Electron can read arbitrary files from it without unpacking the whole file.

The ASAR format was created primarily to improve performance on Windows when reading large quantities of small files (e.g. when loading your app's JavaScript dependency tree from node_modules).

ASAR integrity is an security feature that validates the contents of your app's ASAR archives at runtime. When enabled, your Electron app will verify the header hash of its ASAR archive on runtime. If no hash is present or if there is a mismatch in the hashes, the app will forcefully terminate.

See the ASAR Integrity guide for more details.

Code signing is a process where an app developer digitally signs their code to ensure that it hasn't been tampered with after packaging. Both Windows and macOS implement their own version of code signing. As a desktop app developer, it's important that you sign your code if you plan on distributing it to the general public.

For more information, read the Code Signing tutorial.

Context isolation is a security measure in Electron that ensures that your preload script cannot leak privileged Electron or Node.js APIs to the web contents in your renderer process. With context isolation enabled, the only way to expose APIs from your preload script is through the contextBridge API.

For more information, read the Context Isolation tutorial.

See also: preload script, renderer process

The C Runtime Library (CRT) is the part of the C++ Standard Library that incorporates the ISO C99 standard library. The Visual C++ libraries that implement the CRT support native code development, and both mixed native and managed code, and pure managed code for .NET development.

An Apple Disk Image is a packaging format used by macOS. DMG files are commonly used for distributing application "installers".

Input Method Editor. A program that allows users to enter characters and symbols not found on their keyboard. For example, this allows users of Latin keyboards to input Chinese, Japanese, Korean and Indic characters.

Interface description language. Write function signatures and data types in a format that can be used to generate interfaces in Java, C++, JavaScript, etc.

IPC stands for inter-process communication. Electron uses IPC to send serialized JSON messages between the main and renderer processes.

see also: main process, renderer process

The main process, commonly a file named main.js, is the entry point to every Electron app. It controls the life of the app, from open to close. It also manages native elements such as the Menu, Menu Bar, Dock, Tray, etc. The main process is responsible for creating each new renderer process in the app. The full Node API is built in.

Every app's main process file is specified in the main property in package.json. This is how electron . knows what file to execute at startup.

In Chromium, this process is referred to as the "browser process". It is renamed in Electron to avoid confusion with renderer processes.

See also: process, renderer process

Acronym for Apple's Mac App Store. For details on submitting your app to the MAS, see the Mac App Store Submission Guide.

An IPC system for communicating intra- or inter-process, and that's important because Chrome is keen on being able to split its work into separate processes or not, depending on memory pressures etc.

See https://chromium.googlesource.com/chromium/src/+/main/mojo/README.md

On Windows, MSI packages are used by the Windows Installer (also known as Microsoft Installer) service to install and configure applications.

More information can be found in Microsoft's documentation.

Native modules (also called addons in Node.js) are modules written in C or C++ that can be loaded into Node.js or Electron using the require() function, and used as if they were an ordinary Node.js module. They are used primarily to provide an interface between JavaScript running in Node.js and C/C++ libraries.

Native Node modules are supported by Electron, but since Electron is very likely to use a different V8 version from the Node binary installed in your system, you have to manually specify the location of Electron’s headers when building native modules.

For more information, read the Native Node Modules tutorial.

Notarization is a macOS-specific process where a developer can send a code-signed app to Apple servers to get verified for malicious components through an automated service.

See also: code signing

OSR (offscreen rendering) can be used for loading heavy page in background and then displaying it after (it will be much faster). It allows you to render page without showing it on screen.

For more information, read the Offscreen Rendering tutorial.

Preload scripts contain code that executes in a renderer process before its web contents begin loading. These scripts run within the renderer context, but are granted more privileges by having access to Node.js APIs.

See also: renderer process, context isolation

A process is an instance of a computer program that is being executed. Electron apps that make use of the main and one or many renderer process are actually running several programs simultaneously.

In Node.js and Electron, each running process has a process object. This object is a global that provides information about, and control over, the current process. As a global, it is always available to applications without using require().

See also: main process, renderer process

The renderer process is a browser window in your app. Unlike the main process, there can be multiple of these and each is run in a separate process. They can also be hidden.

See also: process, main process

The sandbox is a security feature inherited from Chromium that restricts your renderer processes to a limited set of permissions.

For more information, read the Process Sandboxing tutorial.

Squirrel is an open-source framework that enables Electron apps to update automatically as new versions are released. See the autoUpdater API for info about getting started with Squirrel.

This term originated in the Unix community, where "userland" or "userspace" referred to programs that run outside of the operating system kernel. More recently, the term has been popularized in the Node and npm community to distinguish between the features available in "Node core" versus packages published to the npm registry by the much larger "user" community.

Like Node, Electron is focused on having a small set of APIs that provide all the necessary primitives for developing multi-platform desktop applications. This design philosophy allows Electron to remain a flexible tool without being overly prescriptive about how it should be used. Userland enables users to create and share tools that provide additional functionality on top of what is available in "core".

The utility process is a child of the main process that allows running any untrusted services that cannot be run in the main process. Chromium uses this process to perform network I/O, audio/video processing, device inputs etc. In Electron, you can create this process using UtilityProcess API.

See also: process, main process

V8 is Google's open source JavaScript engine. It is written in C++ and is used in Google Chrome. V8 can run standalone, or can be embedded into any C++ application.

Electron builds V8 as part of Chromium and then points Node to that V8 when building it.

V8's version numbers always correspond to those of Google Chrome. Chrome 59 includes V8 5.9, Chrome 58 includes V8 5.8, etc.

webview tags are used to embed 'guest' content (such as external web pages) in your Electron app. They are similar to iframes, but differ in that each webview runs in a separate process. It doesn't have the same permissions as your web page and all interactions between your app and embedded content will be asynchronous. This keeps your app safe from the embedded content.

---

## Reclient

**URL:** https://www.electronjs.org/docs/latest/development/reclient

**Contents:**
- Reclient
- Enabling Reclient​
- Building with Reclient​
- Access​
- Support​

Reclient integrates with an existing build system to enable remote execution and caching of build actions.

Electron has a deployment of a reclient compatible RBE Backend that is available to all Electron Maintainers. See the Access section below for details on authentication. Non-maintainers will not have access to the cluster, but can sign in to receive a Cache Only token that gives access to the cache-only CAS backend. Using this should result in significantly faster build times .

Currently the only supported way to use Reclient is to use our Build Tools. Reclient configuration is automatically included when you set up build-tools.

If you have an existing config, you can just set "reclient": "remote_exec" in your config file.

When you are using Reclient, you can run autoninja with a substantially higher j value than would normally be supported by your machine.

Please do not set a value higher than 200. The RBE system is monitored. Users found to be abusing it with unreasonable concurrency will be deactivated.

If you're using build-tools, appropriate -j values will automatically be used for you.

For security and cost reasons, access to Electron's RBE backend is currently restricted to Electron Maintainers. If you want access, please head to #access-requests in Slack and ping @infra-wg to ask for it. Please be aware that being a maintainer does not automatically grant access. Access is determined on a case-by-case basis.

We do not provide support for usage of Reclient. Issues raised asking for help / having issues will probably be closed without much reason. We do not have the capacity to handle that kind of support.

**Examples:**

Example 1 (bash):
```bash
autoninja -C out/Testing electron -j 200
```

---

## Setting Up Symbol Server in Debugger

**URL:** https://www.electronjs.org/docs/latest/development/debugging-with-symbol-server

**Contents:**
- Setting Up Symbol Server in Debugger
- Using the Symbol Server in Windbg​
- Using the symbol server in Visual Studio​
- Troubleshooting: Symbols will not load​

Debug symbols allow you to have better debugging sessions. They have information about the functions contained in executables and dynamic libraries and provide you with information to get clean call stacks. A Symbol Server allows the debugger to load the correct symbols, binaries and sources automatically without forcing users to download large debugging files. The server functions like Microsoft's symbol server so the documentation there can be useful.

Note that because released Electron builds are heavily optimized, debugging is not always easy. The debugger will not be able to show you the content of all variables and the execution path can seem strange because of inlining, tail calls, and other compiler optimizations. The only workaround is to build an unoptimized local build.

The official symbol server URL for Electron is https://symbols.electronjs.org. You cannot visit this URL directly, you must add it to the symbol path of your debugging tool. In the examples below, a local cache directory is used to avoid repeatedly fetching the PDB from the server. Replace c:\code\symbols with an appropriate cache directory on your machine.

The Windbg symbol path is configured with a string value delimited with asterisk characters. To use only the Electron symbol server, add the following entry to your symbol path (Note: you can replace c:\code\symbols with any writable directory on your computer, if you'd prefer a different location for downloaded symbols):

Set this string as _NT_SYMBOL_PATH in the environment, using the Windbg menus, or by typing the .sympath command. If you would like to get symbols from Microsoft's symbol server as well, you should list that first:

Type the following commands in Windbg to print why symbols are not loading:

**Examples:**

Example 1 (powershell):
```powershell
SRV*c:\code\symbols\*https://symbols.electronjs.org
```

Example 2 (powershell):
```powershell
SRV*c:\code\symbols\*https://msdl.microsoft.com/download/symbols;SRV*c:\code\symbols\*https://symbols.electronjs.org
```

Example 3 (powershell):
```powershell
> !sym noisy> .reload /f electron.exe
```

---

## Debugging on Windows

**URL:** https://www.electronjs.org/docs/latest/development/debugging-on-windows

**Contents:**
- Debugging on Windows
- Requirements​
- Attaching to and Debugging Electron​
  - Setting Breakpoints​
  - Attaching​
  - Which Process Should I Attach to?​
- Using ProcMon to Observe a Process​
- Using WinDbg​

If you experience crashes or issues in Electron that you believe are not caused by your JavaScript application, but instead by Electron itself, debugging can be a little bit tricky, especially for developers not used to native/C++ debugging. However, using Visual Studio, Electron's hosted Symbol Server, and the Electron source code, you can enable step-through debugging with breakpoints inside Electron's source code.

See also: There's a wealth of information on debugging Chromium, much of which also applies to Electron, on the Chromium developers site: Debugging Chromium on Windows.

A debug build of Electron: The easiest way is usually building it yourself, using the tools and prerequisites listed in the build instructions for Windows. While you can attach to and debug Electron as you can download it directly, you will find that it is heavily optimized, making debugging substantially more difficult: The debugger will not be able to show you the content of all variables and the execution path can seem strange because of inlining, tail calls, and other compiler optimizations.

Visual Studio with C++ Tools: The free community editions of Visual Studio 2013 and Visual Studio 2015 both work. Once installed, configure Visual Studio to use Electron's Symbol server. It will enable Visual Studio to gain a better understanding of what happens inside Electron, making it easier to present variables in a human-readable format.

ProcMon: The free SysInternals tool allows you to inspect a processes parameters, file handles, and registry operations.

To start a debugging session, open up PowerShell/CMD and execute your debug build of Electron, using the application to open as a parameter.

Then, open up Visual Studio. Electron is not built with Visual Studio and hence does not contain a project file - you can however open up the source code files "As File", meaning that Visual Studio will open them up by themselves. You can still set breakpoints - Visual Studio will automatically figure out that the source code matches the code running in the attached process and break accordingly.

Relevant code files can be found in ./shell/.

You can attach the Visual Studio debugger to a running process on a local or remote computer. After the process is running, click Debug / Attach to Process (or press CTRL+ALT+P) to open the "Attach to Process" dialog box. You can use this capability to debug apps that are running on a local or remote computer, debug multiple processes simultaneously.

If Electron is running under a different user account, select the Show processes from all users check box. Notice that depending on how many BrowserWindows your app opened, you will see multiple processes. A typical one-window app will result in Visual Studio presenting you with two Electron.exe entries - one for the main process and one for the renderer process. Since the list only gives you names, there's currently no reliable way of figuring out which is which.

Code executed within the main process (that is, code found in or eventually run by your main JavaScript file) will run inside the main process, while other code will execute inside its respective renderer process.

You can be attached to multiple programs when you are debugging, but only one program is active in the debugger at any time. You can set the active program in the Debug Location toolbar or the Processes window.

While Visual Studio is fantastic for inspecting specific code paths, ProcMon's strength is really in observing everything your application is doing with the operating system - it captures File, Registry, Network, Process, and Profiling details of processes. It attempts to log all events occurring and can be quite overwhelming, but if you seek to understand what and how your application is doing to the operating system, it can be a valuable resource.

For an introduction to ProcMon's basic and advanced debugging features, go check out this video tutorial provided by Microsoft.

It's possible to debug crashes and issues in the Renderer process with WinDbg.

To attach to a debug a process with WinDbg:

**Examples:**

Example 1 (powershell):
```powershell
$ ./out/Testing/electron.exe ~/my-electron-app/
```

---

## Build Instructions (Linux)

**URL:** https://www.electronjs.org/docs/latest/development/build-instructions-linux

**Contents:**
- Build Instructions (Linux)
- Prerequisites​
  - Cross compilation​
- Building​
- Troubleshooting​
  - Error While Loading Shared Libraries: libtinfo.so.5​
- Advanced topics​
  - Using system clang instead of downloaded clang binaries​
  - Using compilers other than clang​

Follow the guidelines below for building Electron itself on Linux, for the purposes of creating custom Electron binaries. For bundling and distributing your app code with the prebuilt Electron binaries, see the application distribution guide.

Due to Electron's dependency on Chromium, prerequisites and dependencies for Electron change over time. Chromium's documentation on building on Linux has up to date information for building Chromium on Linux. This documentation can generally be followed for building Electron on Linux as well.

Additionally, Electron's Linux dependency installer can be referenced to get the current dependencies that Electron requires in addition to what Chromium installs via build/install-deps.sh.

If you want to build for an arm target, you can use Electron's Linux dependency installer to install the additional dependencies by passing the --arm argument:

And to cross-compile for arm or targets, you should pass the target_cpu parameter to gn gen:

See Build Instructions: GN

Prebuilt clang will try to link to libtinfo.so.5. Depending on the host architecture, symlink to appropriate libncurses:

The default building configuration is targeted for major desktop Linux distributions. To build for a specific distribution or device, the following information may help you.

By default Electron is built with prebuilt clang binaries provided by the Chromium project. If for some reason you want to build with the clang installed in your system, you can specify the clang_base_path argument in the GN args.

For example if you installed clang under /usr/local/bin/clang:

Building Electron with compilers other than clang is not supported.

**Examples:**

Example 1 (unknown):
```unknown
$ sudo install-deps.sh --arm
```

Example 2 (unknown):
```unknown
$ gn gen out/Testing --args='import(...) target_cpu="arm"'
```

Example 3 (unknown):
```unknown
$ sudo ln -s /usr/lib/libncurses.so.5 /usr/lib/libtinfo.so.5
```

Example 4 (unknown):
```unknown
$ gn gen out/Testing --args='import("//electron/build/args/testing.gn") clang_base_path = "/usr/local/bin"'
```

---

## Build Instructions (Windows)

**URL:** https://www.electronjs.org/docs/latest/development/build-instructions-windows

**Contents:**
- Build Instructions (Windows)
- Prerequisites​
- Exclude source tree from Windows Security​
- Building​
- 32bit Build​
- Visual Studio project​
- Troubleshooting​
  - Command xxxx not found​
  - Fatal internal compiler error: C1001​
  - LNK1181: cannot open input file 'kernel32.lib'​

Follow the guidelines below for building Electron itself on Windows, for the purposes of creating custom Electron binaries. For bundling and distributing your app code with the prebuilt Electron binaries, see the application distribution guide.

If you don't currently have a Windows installation, developer.microsoft.com has timebombed versions of Windows that you can use to build Electron.

Building Electron is done entirely with command-line scripts and cannot be done with Visual Studio. You can develop Electron with any editor but support for building with Visual Studio will come in the future.

Even though Visual Studio is not used for building, it's still required because we need the build toolchains it provides.

Windows Security doesn't like one of the files in the Chromium source code (see https://crbug.com/441184), so it will constantly delete it, causing gclient sync issues. You can exclude the source tree from being monitored by Windows Security by following these instructions.

See Build Instructions: GN

To build for the 32bit target, you need to pass target_cpu = "x86" as a GN arg. You can build the 32bit target alongside the 64bit target by using a different output directory for GN, e.g. out/Release-x86, with different arguments.

The other building steps are exactly the same.

To generate a Visual Studio project, you can pass the --ide=vs2017 parameter to gn gen:

If you encountered an error like Command xxxx not found, you may try to use the VS2015 Command Prompt console to execute the build scripts.

Make sure you have the latest Visual Studio update installed.

Try reinstalling 32bit Node.js.

Creating that directory should fix the problem:

You may get this error if you are using Git Bash for building, you should use PowerShell or VS2015 Command Prompt instead.

node.js has some extremely long pathnames, and by default git on windows doesn't handle long pathnames correctly (even though windows supports them). This should fix it:

This can happen during build, when Debugging Tools for Windows has been installed with Windows Driver Kit. Uninstall Windows Driver Kit and install Debugging Tools with steps described above.

This bug is a "feature" of Windows' command prompt. It happens when clicking inside the prompt window with QuickEdit enabled and is intended to allow selecting and copying output text easily. Since each accidental click will pause the build process, you might want to disable this feature in the command prompt properties.

**Examples:**

Example 1 (powershell):
```powershell
$ gn gen out/Release-x86 --args="import(\"//electron/build/args/release.gn\") target_cpu=\"x86\""
```

Example 2 (powershell):
```powershell
$ gn gen out/Testing --ide=vs2017
```

Example 3 (powershell):
```powershell
$ mkdir ~\AppData\Roaming\npm
```

Example 4 (unknown):
```unknown
$ git config --system core.longpaths true
```

---

## Chromium Development

**URL:** https://www.electronjs.org/docs/latest/development/chromium-development

**Contents:**
- Chromium Development
- Contributing to Chromium​
- Resources for Chromium Development​
  - Code Resources​
  - Informational Resources​
- Social Links​

A collection of resources for learning about Chromium and tracking its development.

See also V8 Development

Checking Out and Building

Contributing - This document outlines the process of getting a code change merged to the Chromium source tree.

---

## Breaking Changes

**URL:** https://www.electronjs.org/docs/latest/breaking-changes

**Contents:**
- Breaking Changes
  - Types of Breaking Changes​
- Planned Breaking API Changes (39.0)​
  - Deprecated: --host-rules command line switch​
  - Behavior Changed: window.open popups are always resizable​
  - Behavior Changed: shared texture OSR paint event data structure​
- Planned Breaking API Changes (38.0)​
  - Removed: ELECTRON_OZONE_PLATFORM_HINT environment variable​
  - Removed: ORIGINAL_XDG_CURRENT_DESKTOP environment variable​
  - Removed: macOS 11 support​

Breaking changes will be documented here, and deprecation warnings added to JS code where possible, at least one major version before the change is made.

This document uses the following convention to categorize breaking changes:

Chromium is deprecating the --host-rules switch.

You should use --host-resolver-rules instead.

Per current WHATWG spec, the window.open API will now always create a resizable popup window.

To restore previous behavior:

When using shared texture offscreen rendering feature, the paint event now emits a more structured object. It moves the sharedTextureHandle, planes, modifier into a unified handle property. See the OffscreenSharedTexture API structure for more details.

The default value of the --ozone-platform flag changed to auto.

Electron now defaults to running as a native Wayland app when launched in a Wayland session (when XDG_SESSION_TYPE=wayland). Users can force XWayland by passing --ozone-platform=x11.

Previously, Electron changed the value of XDG_CURRENT_DESKTOP internally to Unity, and stored the original name of the desktop session in a separate variable. XDG_CURRENT_DESKTOP is no longer overriden and now reflects the actual desktop environment.

macOS 11 (Big Sur) is no longer supported by Chromium.

Older versions of Electron will continue to run on Big Sur, but macOS 12 (Monterey) or later will be required to run Electron v38.0.0 and higher.

The plugin-crashed event has been removed from webContents.

The routingId property will be removed from webFrame objects.

You should use webFrame.frameToken instead.

The webFrame.findFrameByRoutingId(routingId) function will be removed.

You should use webFrame.findFrameByToken(frameToken) instead.

Utility Processes will now warn with an error message when an unhandled rejection occurs instead of crashing the process.

To restore the previous behavior, you can use:

Calling process.exit() in a utility process will now kill the utility process synchronously. This brings the behavior of process.exit() in line with Node.js behavior.

Please refer to the Node.js docs and PR #45690 to understand the potential implications of that, e.g., when calling console.log() before process.exit().

WebUSB and Web Serial now support the WebUSB Blocklist and Web Serial Blocklist used by Chromium and outlined in their respective specifications.

To disable these, users can pass disable-usb-blocklist and disable-serial-blocklist as command line flags.

This deprecated feature has been removed.

Previously, setting the ProtocolResponse.session property to null would create a random independent session. This is no longer supported.

Using single-purpose sessions here is discouraged due to overhead costs; however, old code that needs to preserve this behavior can emulate it by creating a random session with session.fromPartition(some_random_string) and then using it in ProtocolResponse.session.

BrowserWindow.IsVisibleOnAllWorkspaces() will now return false on Linux if the window is not currently visible.

app.commandLine will convert upper-cases switches and arguments to lowercase.

app.commandLine was only meant to handle chromium switches (which aren't case-sensitive) and switches passed via app.commandLine will not be passed down to any of the child processes.

If you were using app.commandLine to control the behavior of the main process, you should do this via process.argv.

NativeImage.toBitmap() returns a newly-allocated copy of the bitmap. NativeImage.getBitmap() was originally an alternative function that returned the original instead of a copy. This changed when sandboxing was introduced, so both return a copy and are functionally equivalent.

Client code should call NativeImage.toBitmap() instead:

These properties have been removed from the PrinterInfo Object because they have been removed from upstream Chromium.

When calling Session.clearStorageData(options), the options.quota type syncable is no longer supported because it has been removed from upstream Chromium.

Previously, setting the ProtocolResponse.session property to null Would create a random independent session. This is no longer supported.

Using single-purpose sessions here is discouraged due to overhead costs; however, old code that needs to preserve this behavior can emulate it by creating a random session with session.fromPartition(some_random_string) and then using it in ProtocolResponse.session.

When calling Session.clearStorageData(options), the options.quota property is deprecated. Since the syncable type was removed, there is only type left -- 'temporary' -- so specifying it is unnecessary.

session.loadExtension, session.removeExtension, session.getExtension, session.getAllExtensions, 'extension-loaded' event, 'extension-unloaded' event, and 'extension-ready' events have all moved to the new session.extensions class.

The systemPreferences.isAeroGlassEnabled() function has been removed without replacement. It has been always returning true since Electron 23, which only supports Windows 10+, where DWM composition can no longer be disabled.

https://learn.microsoft.com/en-us/windows/win32/dwm/composition-ovw#disabling-dwm-composition-windows7-and-earlier

After an upstream change, GTK 4 is now the default when running GNOME.

In rare cases, this may cause some applications or configurations to error with the following message:

Affected users can work around this by specifying the gtk-version command-line flag:

The same can be done with the app.commandLine.appendSwitch function.

On Linux, the required portal version for file dialogs has been reverted to 3 from 4. Using the defaultPath option of the Dialog API is not supported when using portal file chooser dialogs unless the portal backend is version 4 or higher. The --xdg-portal-required-version command-line switch can be used to force a required version for your application. See #44426 for more details.

The session.serviceWorkers.fromVersionID(versionId) API has been deprecated in favor of session.serviceWorkers.getInfoFromVersionID(versionId). This was changed to make it more clear which object is returned with the introduction of the session.serviceWorkers.getWorkerFromVersionID(versionId) API.

registerPreloadScript, unregisterPreloadScript, and getPreloadScripts are introduced as a replacement for the deprecated methods. These new APIs allow third-party libraries to register preload scripts without replacing existing scripts. Also, the new type option allows for additional preload targets beyond frame.

The console-message event on WebContents has been updated to provide details on the Event argument.

Additionally, level is now a string with possible values of info, warning, error, and debug.

Previously, an empty urls array was interpreted as including all URLs. To explicitly include all URLs, developers should now use the <all_urls> pattern, which is a designated URL pattern that matches every possible URL. This change clarifies the intent and ensures more predictable behavior.

The systemPreferences.isAeroGlassEnabled() function has been deprecated without replacement. It has been always returning true since Electron 23, which only supports Windows 10+, where DWM composition can no longer be disabled.

https://learn.microsoft.com/en-us/windows/win32/dwm/composition-ovw#disabling-dwm-composition-windows7-and-earlier

This brings the behavior to parity with Linux. Prior behavior: Menu bar is still visible during fullscreen on Windows. New behavior: Menu bar is hidden during fullscreen on Windows.

Correction: This was previously listed as a breaking change in Electron 33, but was first released in Electron 34.

The synchronous clipboard read API document.execCommand("paste") has been deprecated in favor of async clipboard API. This is to align with the browser defaults.

The enableDeprecatedPaste option on WebPreferences that triggers the permission checks for this API and the associated permission type deprecated-sync-clipboard-read are also deprecated.

APIs which provide access to a WebFrameMain instance may return an instance with frame.detached set to true, or possibly return null.

When a frame performs a cross-origin navigation, it enters into a detached state in which it's no longer attached to the page. In this state, it may be running unload handlers prior to being deleted. In the event of an IPC sent during this state, frame.detached will be set to true with the frame being destroyed shortly thereafter.

When receiving an event, it's important to access WebFrameMain properties immediately upon being received. Otherwise, it's not guaranteed to point to the same webpage as when received. To avoid misaligned expectations, Electron will return null in the case of late access where the webpage has changed.

Due to changes made in Chromium to support Non-Special Scheme URLs, custom protocol URLs that use Windows file paths will no longer work correctly with the deprecated protocol.registerFileProtocol and the baseURLForDataURL property on BrowserWindow.loadURL, WebContents.loadURL, and <webview>.loadURL. protocol.handle will also not work with these types of URLs but this is not a change since it has always worked that way.

The webContents property in the login event from app will be null when the event is triggered for requests from the utility process created with respondToAuthRequestsFromMainProcess option.

The textured option of type in BrowserWindowConstructorOptions has been deprecated with no replacement. This option relied on the NSWindowStyleMaskTexturedBackground style mask on macOS, which has been deprecated with no alternative.

macOS 10.15 (Catalina) is no longer supported by Chromium.

Older versions of Electron will continue to run on Catalina, but macOS 11 (Big Sur) or later will be required to run Electron v33.0.0 and higher.

Due to changes made upstream, both V8 and Node.js now require C++20 as a minimum version. Developers using native node modules should build their modules with --std=c++20 rather than --std=c++17. Images using gcc9 or lower may need to update to gcc10 in order to compile. See #43555 for more details.

The systemPreferences.accessibilityDisplayShouldReduceTransparency property is now deprecated in favor of the new nativeTheme.prefersReducedTransparency, which provides identical information and works cross-platform.

The nonstandard path property of the Web File object was added in an early version of Electron as a convenience method for working with native files when doing everything in the renderer was more common. However, it represents a deviation from the standard and poses a minor security risk as well, so beginning in Electron 32.0 it has been removed in favor of the webUtils.getPathForFile method.

The navigation-related APIs are now deprecated.

These APIs have been moved to the navigationHistory property of WebContents to provide a more structured and intuitive interface for managing navigation history.

If you have a directory called databases in the directory returned by app.getPath('userData'), it will be deleted when Electron 32 is first run. The databases directory was used by WebSQL, which was removed in Electron 31. Chromium now performs a cleanup that deletes this directory. See issue #45396.

Chromium has removed support for WebSQL upstream, transitioning it to Android only. See Chromium's intent to remove discussion for more information.

PNG decoder implementation has been changed to preserve colorspace data, the encoded data returned from this function now matches it.

See crbug.com/332584706 for more information.

This brings the behavior to parity with Windows and Linux. Prior behavior: The first flashFrame(true) bounces the dock icon only once (using the NSInformationalRequest level) and flashFrame(false) does nothing. New behavior: Flash continuously until flashFrame(false) is called. This uses the NSCriticalRequest level instead. To explicitly use NSInformationalRequest to cause a single dock icon bounce, it is still possible to use dock.bounce('informational').

Cross-origin iframes must now specify features available to a given iframe via the allow attribute in order to access them.

See documentation for more information.

This switch was never formally documented but it's removal is being noted here regardless. Chromium itself now has better support for color spaces so this flag should not be needed.

In Electron 30, BrowserView is now a wrapper around the new WebContentsView API.

Previously, the setAutoResize function of the BrowserView API was backed by autoresizing on macOS, and by a custom algorithm on Windows and Linux. For simple use cases such as making a BrowserView fill the entire window, the behavior of these two approaches was identical. However, in more advanced cases, BrowserViews would be autoresized differently on macOS than they would be on other platforms, as the custom resizing algorithm for Windows and Linux did not perfectly match the behavior of macOS's autoresizing API. The autoresizing behavior is now standardized across all platforms.

If your app uses BrowserView.setAutoResize to do anything more complex than making a BrowserView fill the entire window, it's likely you already had custom logic in place to handle this difference in behavior on macOS. If so, that logic will no longer be needed in Electron 30 as autoresizing behavior is consistent.

The BrowserView class has been deprecated and replaced by the new WebContentsView class.

BrowserView related methods in BrowserWindow have also been deprecated:

The inputFormType property of the params object in the context-menu event from WebContents has been removed. Use the new formControlType property instead.

Chromium has removed access to this information.

Attempting to send the entire ipcRenderer module as an object over the contextBridge will now result in an empty object on the receiving side of the bridge. This change was made to remove / mitigate a security footgun. You should not directly expose ipcRenderer or its methods over the bridge. Instead, provide a safe wrapper like below:

The renderer-process-crashed event on app has been removed. Use the new render-process-gone event instead.

The crashed events on WebContents and <webview> have been removed. Use the new render-process-gone event instead.

The gpu-process-crashed event on app has been removed. Use the new child-process-gone event instead.

WebContents.backgroundThrottling set to false will disable frames throttling in the BrowserWindow for all WebContents displayed by it.

BrowserWindow.setTrafficLightPosition(position) has been removed, the BrowserWindow.setWindowButtonPosition(position) API should be used instead which accepts null instead of { x: 0, y: 0 } to reset the position to system default.

BrowserWindow.getTrafficLightPosition() has been removed, the BrowserWindow.getWindowButtonPosition() API should be used instead which returns null instead of { x: 0, y: 0 } when there is no custom position.

The ipcRenderer.sendTo() API has been removed. It should be replaced by setting up a MessageChannel between the renderers.

The senderId and senderIsMainFrame properties of IpcRendererEvent have been removed as well.

The app.runningUnderRosettaTranslation property has been removed. Use app.runningUnderARM64Translation instead.

The renderer-process-crashed event on app has been deprecated. Use the new render-process-gone event instead.

The inputFormType property of the params object in the context-menu event from WebContents has been deprecated. Use the new formControlType property instead.

The crashed events on WebContents and <webview> have been deprecated. Use the new render-process-gone event instead.

The gpu-process-crashed event on app has been deprecated. Use the new child-process-gone event instead.

macOS 10.13 (High Sierra) and macOS 10.14 (Mojave) are no longer supported by Chromium.

Older versions of Electron will continue to run on these operating systems, but macOS 10.15 (Catalina) or later will be required to run Electron v27.0.0 and higher.

The ipcRenderer.sendTo() API has been deprecated. It should be replaced by setting up a MessageChannel between the renderers.

The senderId and senderIsMainFrame properties of IpcRendererEvent have been deprecated as well.

The following systemPreferences events have been removed:

Use the new updated event on the nativeTheme module instead.

The following vibrancy options have been removed:

These were previously deprecated and have been removed by Apple in 10.15.

The webContents.getPrinters method has been removed. Use webContents.getPrintersAsync instead.

The systemPreferences.getAppLevelAppearance and systemPreferences.setAppLevelAppearance methods have been removed, as well as the systemPreferences.appLevelAppearance property. Use the nativeTheme module instead.

The alternate-selected-control-text value for systemPreferences.getColor has been removed. Use selected-content-background instead.

The webContents.getPrinters method has been deprecated. Use webContents.getPrintersAsync instead.

The systemPreferences.getAppLevelAppearance and systemPreferences.setAppLevelAppearance methods have been deprecated, as well as the systemPreferences.appLevelAppearance property. Use the nativeTheme module instead.

The alternate-selected-control-text value for systemPreferences.getColor has been deprecated. Use selected-content-background instead.

The protocol.register*Protocol and protocol.intercept*Protocol methods have been replaced with protocol.handle.

The new method can either register a new protocol or intercept an existing protocol, and responses can be of any type.

BrowserWindow.setTrafficLightPosition(position) has been deprecated, the BrowserWindow.setWindowButtonPosition(position) API should be used instead which accepts null instead of { x: 0, y: 0 } to reset the position to system default.

BrowserWindow.getTrafficLightPosition() has been deprecated, the BrowserWindow.getWindowButtonPosition() API should be used instead which returns null instead of { x: 0, y: 0 } when there is no custom position.

The maxSize parameter has been changed to size to reflect that the size passed in will be the size the thumbnail created. Previously, Windows would not scale the image up if it were smaller than maxSize, and macOS would always set the size to maxSize. Behavior is now the same across platforms.

Previous Behavior (on Windows):

The implementation of draggable regions (using the CSS property -webkit-app-region: drag) has changed on macOS to bring it in line with Windows and Linux. Previously, when a region with -webkit-app-region: no-drag overlapped a region with -webkit-app-region: drag, the no-drag region would always take precedence on macOS, regardless of CSS layering. That is, if a drag region was above a no-drag region, it would be ignored. Beginning in Electron 23, a drag region on top of a no-drag region will correctly cause the region to be draggable.

Additionally, the customButtonsOnHover BrowserWindow property previously created a draggable region which ignored the -webkit-app-region CSS property. This has now been fixed (see #37210 for discussion).

As a result, if your app uses a frameless window with draggable regions on macOS, the regions which are draggable in your app may change in Electron 23.

Windows 7, Windows 8, and Windows 8.1 are no longer supported. Electron follows the planned Chromium deprecation policy, which will deprecate Windows 7 support beginning in Chromium 109.

Older versions of Electron will continue to run on these operating systems, but Windows 10 or later will be required to run Electron v23.0.0 and higher.

The deprecated scroll-touch-begin, scroll-touch-end and scroll-touch-edge events on BrowserWindow have been removed. Instead, use the newly available input-event event on WebContents.

The webContents.incrementCapturerCount(stayHidden, stayAwake) function has been removed. It is now automatically handled by webContents.capturePage when a page capture completes.

The webContents.decrementCapturerCount(stayHidden, stayAwake) function has been removed. It is now automatically handled by webContents.capturePage when a page capture completes.

webContents.incrementCapturerCount(stayHidden, stayAwake) has been deprecated. It is now automatically handled by webContents.capturePage when a page capture completes.

webContents.decrementCapturerCount(stayHidden, stayAwake) has been deprecated. It is now automatically handled by webContents.capturePage when a page capture completes.

The new-window event of WebContents has been removed. It is replaced by webContents.setWindowOpenHandler().

The new-window event of <webview> has been removed. There is no direct replacement.

The scroll-touch-begin, scroll-touch-end and scroll-touch-edge events on BrowserWindow are deprecated. Instead, use the newly available input-event event on WebContents.

The V8 memory cage has been enabled, which has implications for native modules which wrap non-V8 memory with ArrayBuffer or Buffer. See the blog post about the V8 memory cage for more details.

webContents.printToPDF() has been modified to conform to Page.printToPDF in the Chrome DevTools Protocol. This has been changes in order to address changes upstream that made our previous implementation untenable and rife with bugs.

macOS 10.11 (El Capitan) and macOS 10.12 (Sierra) are no longer supported by Chromium.

Older versions of Electron will continue to run on these operating systems, but macOS 10.13 (High Sierra) or later will be required to run Electron v20.0.0 and higher.

Previously, renderers that specified a preload script defaulted to being unsandboxed. This meant that by default, preload scripts had access to Node.js. In Electron 20, this default has changed. Beginning in Electron 20, renderers will be sandboxed by default, unless nodeIntegration: true or sandbox: false is specified.

If your preload scripts do not depend on Node, no action is needed. If your preload scripts do depend on Node, either refactor them to remove Node usage from the renderer, or explicitly specify sandbox: false for the relevant renderers.

On X11, skipTaskbar sends a _NET_WM_STATE_SKIP_TASKBAR message to the X11 window manager. There is not a direct equivalent for Wayland, and the known workarounds have unacceptable tradeoffs (e.g. Window.is_skip_taskbar in GNOME requires unsafe mode), so Electron is unable to support this feature on Linux.

The handler invoked when session.setDevicePermissionHandler(handler) is used has a change to its arguments. This handler no longer is passed a frame WebFrameMain, but instead is passed the origin, which is the origin that is checking for device permission.

This is a result of Chromium 102.0.4999.0 dropping support for IA32 Linux. This concludes the removal of support for IA32 Linux.

Prior to Electron 15, window.open was by default shimmed to use BrowserWindowProxy. This meant that window.open('about:blank') did not work to open synchronously scriptable child windows, among other incompatibilities. Since Electron 15, nativeWindowOpen has been enabled by default.

See the documentation for window.open in Electron for more details.

The desktopCapturer.getSources API is now only available in the main process. This has been changed in order to improve the default security of Electron apps.

If you need this functionality, it can be replaced as follows:

However, you should consider further restricting the information returned to the renderer; for instance, displaying a source selector to the user and only returning the selected source.

Prior to Electron 15, window.open was by default shimmed to use BrowserWindowProxy. This meant that window.open('about:blank') did not work to open synchronously scriptable child windows, among other incompatibilities. Since Electron 15, nativeWindowOpen has been enabled by default.

See the documentation for window.open in Electron for more details.

The underlying implementation of the crashReporter API on Linux has changed from Breakpad to Crashpad, bringing it in line with Windows and Mac. As a result of this, child processes are now automatically monitored, and calling process.crashReporter.start in Node child processes is no longer needed (and is not advisable, as it will start a second instance of the Crashpad reporter).

There are also some subtle changes to how annotations will be reported on Linux, including that long values will no longer be split between annotations appended with __1, __2 and so on, and instead will be truncated at the (new, longer) annotation value limit.

Usage of the desktopCapturer.getSources API in the renderer has been deprecated and will be removed. This change improves the default security of Electron apps.

See here for details on how to replace this API in your app.

Prior to Electron 15, window.open was by default shimmed to use BrowserWindowProxy. This meant that window.open('about:blank') did not work to open synchronously scriptable child windows, among other incompatibilities. nativeWindowOpen is no longer experimental, and is now the default.

See the documentation for window.open in Electron for more details.

The app.runningUnderRosettaTranslation property has been deprecated. Use app.runningUnderARM64Translation instead.

The remote module was deprecated in Electron 12, and will be removed in Electron 14. It is replaced by the @electron/remote module.

The app.allowRendererProcessReuse property will be removed as part of our plan to more closely align with Chromium's process model for security, performance and maintainability.

For more detailed information see #18397.

The affinity option when constructing a new BrowserWindow will be removed as part of our plan to more closely align with Chromium's process model for security, performance and maintainability.

For more detailed information see #18397.

The optional parameter frameName will no longer set the title of the window. This now follows the specification described by the native documentation under the corresponding parameter windowName.

If you were using this parameter to set the title of a window, you can instead use win.setTitle(title).

In Electron 14, worldSafeExecuteJavaScript will be removed. There is no alternative, please ensure your code works with this property enabled. It has been enabled by default since Electron 12.

You will be affected by this change if you use either webFrame.executeJavaScript or webFrame.executeJavaScriptInIsolatedWorld. You will need to ensure that values returned by either of those methods are supported by the Context Bridge API as these methods use the same value passing semantics.

Prior to Electron 14, windows opened with window.open would inherit BrowserWindow constructor options such as transparent and resizable from their parent window. Beginning with Electron 14, this behavior is removed, and windows will not inherit any BrowserWindow constructor options from their parents.

Instead, explicitly set options for the new window with setWindowOpenHandler:

The deprecated additionalFeatures property in the new-window and did-create-window events of WebContents has been removed. Since new-window uses positional arguments, the argument is still present, but will always be the empty array []. (Though note, the new-window event itself is deprecated, and is replaced by setWindowOpenHandler.) Bare keys in window features will now present as keys with the value true in the options object.

The handler methods first parameter was previously always a webContents, it can now sometimes be null. You should use the requestingOrigin, embeddingOrigin and securityOrigin properties to respond to the permission check correctly. As the webContents can be null it can no longer be relied on.

The deprecated synchronous shell.moveItemToTrash() API has been removed. Use the asynchronous shell.trashItem() instead.

The deprecated extension APIs have been removed:

Use the session APIs instead:

The following systemPreferences methods have been deprecated:

Use the following nativeTheme properties instead:

The new-window event of WebContents has been deprecated. It is replaced by webContents.setWindowOpenHandler().

Chromium has removed support for Flash, and so we must follow suit. See Chromium's Flash Roadmap for more details.

In Electron 12, worldSafeExecuteJavaScript will be enabled by default. To restore the previous behavior, worldSafeExecuteJavaScript: false must be specified in WebPreferences. Please note that setting this option to false is insecure.

This option will be removed in Electron 14 so please migrate your code to support the default value.

In Electron 12, contextIsolation will be enabled by default. To restore the previous behavior, contextIsolation: false must be specified in WebPreferences.

We recommend having contextIsolation enabled for the security of your application.

Another implication is that require() cannot be used in the renderer process unless nodeIntegration is true and contextIsolation is false.

For more details see: https://github.com/electron/electron/issues/23506

The crashReporter.getCrashesDirectory method has been removed. Usage should be replaced by app.getPath('crashDumps').

The following crashReporter methods are no longer available in the renderer process:

They should be called only from the main process.

See #23265 for more details.

The default value of the compress option to crashReporter.start has changed from false to true. This means that crash dumps will be uploaded to the crash ingestion server with the Content-Encoding: gzip header, and the body will be compressed.

If your crash ingestion server does not support compressed payloads, you can turn off compression by specifying { compress: false } in the crash reporter options.

The remote module is deprecated in Electron 12, and will be removed in Electron 14. It is replaced by the @electron/remote module.

The synchronous shell.moveItemToTrash() has been replaced by the new, asynchronous shell.trashItem().

The experimental APIs BrowserView.{destroy, fromId, fromWebContents, getAllViews} have now been removed. Additionally, the id property of BrowserView has also been removed.

For more detailed information, see #23578.

The companyName argument to crashReporter.start(), which was previously required, is now optional, and further, is deprecated. To get the same behavior in a non-deprecated way, you can pass a companyName value in globalExtra.

The crashReporter.getCrashesDirectory method has been deprecated. Usage should be replaced by app.getPath('crashDumps').

Calling the following crashReporter methods from the renderer process is deprecated:

The only non-deprecated methods remaining in the crashReporter module in the renderer are addExtraParameter, removeExtraParameter and getParameters.

All above methods remain non-deprecated when called from the main process.

See #23265 for more details.

Setting { compress: false } in crashReporter.start is deprecated. Nearly all crash ingestion servers support gzip compression. This option will be removed in a future version of Electron.

In Electron 9, using the remote module without explicitly enabling it via the enableRemoteModule WebPreferences option began emitting a warning. In Electron 10, the remote module is now disabled by default. To use the remote module, enableRemoteModule: true must be specified in WebPreferences:

We recommend moving away from the remote module.

The APIs are now synchronous and the optional callback is no longer needed.

The APIs are now synchronous and the optional callback is no longer needed.

The registered or intercepted protocol does not have effect on current page until navigation happens.

This API is deprecated and users should use protocol.isProtocolRegistered and protocol.isProtocolIntercepted instead.

As of Electron 9 we do not allow loading of non-context-aware native modules in the renderer process. This is to improve security, performance and maintainability of Electron as a project.

If this impacts you, you can temporarily set app.allowRendererProcessReuse to false to revert to the old behavior. This flag will only be an option until Electron 11 so you should plan to update your native modules to be context aware.

For more detailed information see #18397.

The following extension APIs have been deprecated:

Use the session APIs instead:

This API, which was deprecated in Electron 8.0, is now removed.

Chromium has removed support for changing the layout zoom level limits, and it is beyond Electron's capacity to maintain it. The function was deprecated in Electron 8.x, and has been removed in Electron 9.x. The layout zoom level limits are now fixed at a minimum of 0.25 and a maximum of 5.0, as defined here.

In Electron 8.0, IPC was changed to use the Structured Clone Algorithm, bringing significant performance improvements. To help ease the transition, the old IPC serialization algorithm was kept and used for some objects that aren't serializable with Structured Clone. In particular, DOM objects (e.g. Element, Location and DOMMatrix), Node.js objects backed by C++ classes (e.g. process.env, some members of Stream), and Electron objects backed by C++ classes (e.g. WebContents, BrowserWindow and WebFrame) are not serializable with Structured Clone. Whenever the old algorithm was invoked, a deprecation warning was printed.

In Electron 9.0, the old serialization algorithm has been removed, and sending such non-serializable objects will now throw an "object could not be cloned" error.

The shell.openItem API has been replaced with an asynchronous shell.openPath API. You can see the original API proposal and reasoning here.

The algorithm used to serialize objects sent over IPC (through ipcRenderer.send, ipcRenderer.sendSync, WebContents.send and related methods) has been switched from a custom algorithm to V8's built-in Structured Clone Algorithm, the same algorithm used to serialize messages for postMessage. This brings about a 2x performance improvement for large messages, but also brings some breaking changes in behavior.

Sending any objects that aren't native JS types, such as DOM objects (e.g. Element, Location, DOMMatrix), Node.js objects (e.g. process.env, Stream), or Electron objects (e.g. WebContents, BrowserWindow, WebFrame) is deprecated. In Electron 8, these objects will be serialized as before with a DeprecationWarning message, but starting in Electron 9, sending these kinds of objects will throw a 'could not be cloned' error.

This API is implemented using the remote module, which has both performance and security implications. Therefore its usage should be explicit.

However, it is recommended to avoid using the remote module altogether.

Chromium has removed support for changing the layout zoom level limits, and it is beyond Electron's capacity to maintain it. The function will emit a warning in Electron 8.x, and cease to exist in Electron 9.x. The layout zoom level limits are now fixed at a minimum of 0.25 and a maximum of 5.0, as defined here.

The following systemPreferences events have been deprecated:

Use the new updated event on the nativeTheme module instead.

The following systemPreferences methods have been deprecated:

Use the following nativeTheme properties instead:

This is the URL specified as disturl in a .npmrc file or as the --dist-url command line flag when building native Node modules. Both will be supported for the foreseeable future but it is recommended that you switch.

Deprecated: https://atom.io/download/electron

Replace with: https://electronjs.org/headers

The session.clearAuthCache API no longer accepts options for what to clear, and instead unconditionally clears the whole cache.

This property was removed in Chromium 77, and as such is no longer available.

The webkitdirectory property on HTML file inputs allows them to select folders. Previous versions of Electron had an incorrect implementation where the event.target.files of the input returned a FileList that returned one File corresponding to the selected folder.

As of Electron 7, that FileList is now list of all files contained within the folder, similarly to Chrome, Firefox, and Edge (link to MDN docs).

As an illustration, take a folder with this structure:

In Electron <=6, this would return a FileList with a File object for:

In Electron 7, this now returns a FileList with a File object for:

Note that webkitdirectory no longer exposes the path to the selected folder. If you require the path to the selected folder rather than the folder contents, see the dialog.showOpenDialog API (link).

Electron 5 and Electron 6 introduced Promise-based versions of existing asynchronous APIs and deprecated their older, callback-based counterparts. In Electron 7, all deprecated callback-based APIs are now removed.

These functions now only return Promises:

These functions now have two forms, synchronous and Promise-based asynchronous:

Mixed-sandbox mode is now enabled by default.

Under macOS Catalina our former Tray implementation breaks. Apple's native substitute doesn't support changing the highlighting behavior.

The following webPreferences option default values are deprecated in favor of the new defaults listed below.

E.g. Re-enabling the webviewTag

Child windows opened with the nativeWindowOpen option will always have Node.js integration disabled, unless nodeIntegrationInSubFrames is true.

Renderer process APIs webFrame.registerURLSchemeAsPrivileged and webFrame.registerURLSchemeAsBypassingCSP as well as browser process API protocol.registerStandardSchemes have been removed. A new API, protocol.registerSchemesAsPrivileged has been added and should be used for registering custom schemes with the required privileges. Custom schemes are required to be registered before app ready.

The spellCheck callback is now asynchronous, and autoCorrectWord parameter has been removed.

webContents.getZoomLevel and webContents.getZoomFactor no longer take callback parameters, instead directly returning their number values.

The following list includes the breaking API changes made in Electron 4.0.

When building native modules for windows, the win_delay_load_hook variable in the module's binding.gyp must be true (which is the default). If this hook is not present, then the native module will fail to load on Windows, with an error message like Cannot find module. See the native module guide for more.

Electron 18 will no longer run on 32-bit Linux systems. See discontinuing support for 32-bit Linux for more information.

The following list includes the breaking API changes in Electron 3.0.

This is the URL specified as disturl in a .npmrc file or as the --dist-url command line flag when building native Node modules.

Deprecated: https://atom.io/download/atom-shell

Replace with: https://atom.io/download/electron

The following list includes the breaking API changes made in Electron 2.0.

Each Electron release includes two identical ARM builds with slightly different filenames, like electron-v1.7.3-linux-arm.zip and electron-v1.7.3-linux-armv7l.zip. The asset with the v7l prefix was added to clarify to users which ARM version it supports, and to disambiguate it from future armv6l and arm64 assets that may be produced.

The file without the prefix is still being published to avoid breaking any setups that may be consuming it. Starting at 2.0, the unprefixed file will no longer be published.

For details, see 6986 and 7189.

**Examples:**

Example 1 (css):
```css
webContents.setWindowOpenHandler((details) => {  return {    action: 'allow',    overrideBrowserWindowOptions: {      resizable: details.features.includes('resizable=yes')    }  }})
```

Example 2 (javascript):
```javascript
process.on('unhandledRejection', () => {  process.exit(1)})
```

Example 3 (unknown):
```unknown
// Deprecatedbitmap = image.getBitmap()// Use this insteadbitmap = image.toBitmap()
```

Example 4 (julia):
```julia
Gtk-ERROR **: 11:30:38.382: GTK 2/3 symbols detected. Using GTK 2/3 and GTK 4 in the same process is not supported
```

---

## Electron FAQ

**URL:** https://www.electronjs.org/docs/latest/faq

**Contents:**
- Electron FAQ
- Why am I having trouble installing Electron?​
- How are Electron binaries downloaded?​
- When will Electron upgrade to latest Chromium?​
- When will Electron upgrade to latest Node.js?​
- How to share data between web pages?​
- My app's tray disappeared after a few minutes.​
- I can not use jQuery/RequireJS/Meteor/AngularJS in Electron.​
- require('electron').xxx is undefined.​
- The font looks blurry, what is this and what can I do?​

When running npm install electron, some users occasionally encounter installation errors.

In almost all cases, these errors are the result of network problems and not actual issues with the electron npm package. Errors like ELIFECYCLE, EAI_AGAIN, ECONNRESET, and ETIMEDOUT are all indications of such network problems. The best resolution is to try switching networks, or wait a bit and try installing again.

You can also attempt to download Electron directly from GitHub Releases if installing via npm is failing.

If you need to install Electron through a custom mirror or proxy, see the Advanced Installation documentation for more details.

When you run npm install electron, the Electron binary for the corresponding version is downloaded into your project's node_modules folder via npm's postinstall lifecycle script.

This logic is handled by the @electron/get utility package under the hood.

Every new major version of Electron releases with a Chromium major version upgrade. By releasing every 8 weeks, Electron is able to pull in every other major Chromium release on the very same day that it releases upstream. Security fixes will be backported to stable release channels ahead of time.

See the Electron Releases documentation for more details or releases.electronjs.org to see our Release Status dashboard.

When a new version of Node.js gets released, we usually wait for about a month before upgrading the one in Electron. So we can avoid getting affected by bugs introduced in new Node.js versions, which happens very often.

New features of Node.js are usually brought by V8 upgrades, since Electron is using the V8 shipped by Chrome browser, the shiny new JavaScript feature of a new Node.js version is usually already in Electron.

To share data between web pages (the renderer processes) the simplest way is to use HTML5 APIs which are already available in browsers. Good candidates are Storage API, localStorage, sessionStorage, and IndexedDB.

Alternatively, you can use the IPC primitives that are provided by Electron. To share data between the main and renderer processes, you can use the ipcMain and ipcRenderer modules. To communicate directly between web pages, you can send a MessagePort from one to the other, possibly via the main process using ipcRenderer.postMessage(). Subsequent communication over message ports is direct and does not detour through the main process.

This happens when the variable which is used to store the tray gets garbage collected.

If you encounter this problem, the following articles may prove helpful:

If you want a quick fix, you can make the variables global by changing your code from this:

Due to the Node.js integration of Electron, there are some extra symbols inserted into the DOM like module, exports, require. This causes problems for some libraries since they want to insert the symbols with the same names.

To solve this, you can turn off node integration in Electron:

But if you want to keep the abilities of using Node.js and Electron APIs, you have to rename the symbols in the page before including other libraries:

When using Electron's built-in module you might encounter an error like this:

It is very likely you are using the module in the wrong process. For example electron.app can only be used in the main process, while electron.webFrame is only available in renderer processes.

If sub-pixel anti-aliasing is deactivated, then fonts on LCD screens can look blurry. Example:

Sub-pixel anti-aliasing needs a non-transparent background of the layer containing the font glyphs. (See this issue for more info).

To achieve this goal, set the background in the constructor for BrowserWindow:

The effect is visible only on (some?) LCD screens. Even if you don't see a difference, some of your users may. It is best to always set the background this way, unless you have reasons not to do so.

Notice that just setting the background in the CSS does not have the desired effect.

Electron classes cannot be subclassed with the extends keyword (also known as class inheritance). This feature was never implemented in Electron due to the added complexity it would add to C++/JavaScript interop in Electron's internals.

For more information, see electron/electron#23.

**Examples:**

Example 1 (javascript):
```javascript
const { app, Tray } = require('electron')app.whenReady().then(() => {  const tray = new Tray('/path/to/icon.png')  tray.setTitle('hello world')})
```

Example 2 (javascript):
```javascript
const { app, Tray } = require('electron')let tray = nullapp.whenReady().then(() => {  tray = new Tray('/path/to/icon.png')  tray.setTitle('hello world')})
```

Example 3 (css):
```css
// In the main process.const { BrowserWindow } = require('electron')const win = new BrowserWindow({  webPreferences: {    nodeIntegration: false  }})win.show()
```

Example 4 (html):
```html
<head><script>window.nodeRequire = require;delete window.require;delete window.exports;delete window.module;</script><script type="text/javascript" src="jquery.js"></script></head>
```

---
