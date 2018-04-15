# Proxy Setup CLI

A helpful tool for developers who are working behind a proxy.

## How to use it
The usage of this command line interface is very straightforward:

<img alt="demo" src="images/demo.gif"/>

### Quick reference guide

1. Mark the checkbox of the tool where the proxy settings should be enabled (use `<SPACE>`-key to toggle)
    - If the checkbox of a tool is not marked, the proxy setting will be disabled
2. Press `<ENTER>`-key to confirm the selection
3. If some checkboxes are selected, you will be asked to enter your proxy settings
    - The proxy settings of the tools that are not selected will be removed
    - If you have not selected any tool, all proxy settings will be removed and you will not be prompted to insert any proxy settings
4. You will then see a small summary of which proxy settings have been activated or deactivated by the CLI
5. Press any key to exit the CLI

## Supported developer tools
- NPM
- Yarn
- Bower
- Git
- Gradle
- Maven

## Features
- Toggle proxy settings for each tool at once
- Authentication data is only stored in the tool's proxy settings
- Authentication data is completely removed when the proxy is disabled for a tool
- Remembers the last used proxy hosts and ports (press `<TAB>` for autocomplete)

## Installation
### Requirements
- Node.js

### Install dependencies
Install all required dependencies with the following command:

```
npm install
```

### Start the CLI
You can open the CLI in your terminal with this command:

```
npm start
```

### Generate executable
It's also possible to generate an executable file of this CLI. For this purpose Zeit's module [pkd](https://github.com/zeit/pkg) is used to build executable files. Simply run this command to create an ".exe"-file if you're working on a Windows machine:

```
npm run package
```

The executable can be found in the "package"-directory.

If you're working on another platform you have to adjust the `package`-script:

#### Linux
```json
"package": "pkg -t node8-linux out/index.js -o ./package/proxy",
```

#### MacOS
```json
"package": "pkg -t node8-macos out/index.js -o ./package/proxy",
```

> Read more about the available [targets](https://github.com/zeit/pkg#targets) of the pkd module.
