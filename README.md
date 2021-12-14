[precinct]: https://github.com/dependents/node-precinct

# jsModuleDependenciesToBeInstalled(specifiers)

> JavaScript 模块（esm, cjs, amd, ts, tsx, jsx）说明符过滤器：需要额外安装的的模块。

依赖（说明符）收集器，见 [Precinct][precinct]。

## 使用

- specifiers {Array} [Precinct][precinct] 收集器收集到的模块说明符集合，默认 **`[]`**；
- 返回 {Array} 需要额外安装的的模块名称。

```js
import { readFileSync } from "fs";
import { log } from "console";

import precinct from "detective-es6";
import jsModuleDependenciesToBeInstalled from "@iyowei/js-module-dependencies-to-be-installed";

/**
 * "/Users/iyowei/Development/iyowei/create-esm/cli.js" 片段，
 *
 * import { existsSync } from "fs";
 * import { Listr } from "listr2";
 * import shell from "shelljs";
 * import meow from "meow";
 * import chalk from "chalk";
 * import { banner, mainHelp, setupHelp, COMMAND_SET, COMMAND_DEFAULTS, getReport } from "./src/messages.js";
 * import pressAnyKeyToContinue from "./src/pressAnyKeyToContinue.js";
 * import { updateGlobalConfigurations, getGlobalConfigurations } from "./src/options/global.js";
 * import makeOptions from "./src/options/make.js";
 * import prerequisites from "./src/prerequisites.js";
 */
const specifiers = precinct(
  readFileSync("/Users/iyowei/Development/iyowei/create-esm/cli.js", "utf-8")
);

const read = jsModuleDependenciesToBeInstalled(specifiers);
console.log("read", read);
// read: [ 'listr2', 'shelljs', 'meow', 'chalk' ]

const given = jsModuleDependenciesToBeInstalled([
  "./startup.js",
  "../config.mjs",

  "file:///opt/nodejs/config.js",

  "/opt/nodejs/config.mjs",

  "fs",
  "node:fs",
  "node:fs/promise",

  "some-package",

  "@others/test",
  "@npmcli/package-json",

  "@npmcli/package-json/promise",
  "some-package/lib/shuffle.mjs",
]);
console.log("given", given);
// given: given [ 'some-package', '@others/test', '@npmcli/package-json' ]
```

## 安装

[![Node version](https://img.shields.io/badge/node.js-%3E%3D12.20.0-brightgreen?style=flat&logo=Node.js)](https://nodejs.org/en/download/)

```shell
# Pnpm
pnpm add @iyowei/js-module-dependencies-to-be-installed

# yarn
yarn add @iyowei/js-module-dependencies-to-be-installed

# npm
npm add @iyowei/js-module-dependencies-to-be-installed
```

## 设计

ESM, CJS, AMD, TS, TSX, JSX，等等，模块定义很多，对应了不同依赖（说明符）收集器，但说明符规范是一致的，所以将过滤器部分提取出来，方便复用。

## 参与贡献

![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)
