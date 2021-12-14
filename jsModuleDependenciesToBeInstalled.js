/**
 * 从以下形式引用方式中寻找需要额外安装的包，
 *
 * - `from "./startup.js"`
 * - `from "../config.mjs"`
 *
 * - `from "file:///opt/nodejs/config.js"`
 *
 * - `from "/opt/nodejs/config.mjs"`
 *
 * - `from "node:fs/promise"`
 * - `from "fs"`
 * - `from "node:fs"`
 *
 * - `from "@npmcli/package-json/promise"`
 * - `from "@npmcli/package-json"`
 * - `from "some-package/lib/shuffle.mjs"`
 *
 * - `from "some-package"`
 */

import { isAbsolute } from "path";
import builtinModules from "builtin-modules";

// JavaScript 模块（esm, cjs, amd, ts, tsx, jsx）说明符过滤器（specifiers filter）：需要额外安装的的模块。
export default function jsModuleDependenciesToBeInstalled(specifiers = []) {
  // 获取 `from "some-package"` 形式的包
  const fromNormal = specifiers.filter((cur) => isBare(cur));

  // 获取 `from "@npmcli/package-json" 形式的包`
  const fromNS = specifiers.filter(
    (cur) => isNameSpaced(cur) && !isDeepBare(cur)
  );

  /**
   * 获取以下形式中需要安装的包，
   * - `from "@npmcli/package-json/promise"`
   * - `from "some-package/lib/shuffle.mjs"`
   */
  const fromDeepBare = specifiers
    .filter((cur) => isDeepBare(cur))
    .map((cur) => {
      if (isNameSpaced(cur)) {
        const _cur = cur.split("/");

        return `${_cur[0]}/${_cur[1]}`;
      }

      return cur.split("/")[0];
    });

  return Array.from(new Set([fromNormal, fromNS, fromDeepBare].flat()));
}

// specifiers =====================================================>

// `from "file:///opt/nodejs/config.js"`
function isFileUrl(_path) {
  return !isAbsolute(_path) && _path.startsWith("file:");
}

/**
 * - `from "./startup.js"`
 * - `from "../config.mjs"`
 */
function isRelative(_path) {
  return _path.startsWith("./") || _path.startsWith("../");
}

// `from "some-package"`
function isBare(_path) {
  return (
    !isAbsolute(_path) &&
    !isRelative(_path) &&
    !isFileUrl(_path) &&
    !builtinModules.includes(_path) &&
    !_path.includes(":") &&
    !isDeepBare(_path) &&
    !isNameSpaced(_path)
  );
}

/**
 * - `from "some-package/lib/shuffle.mjs"`
 * - `from "@npmcli/package-json/promise"`
 *
 * 存在需要安装的可能性
 */
function isDeepBare(_path) {
  if (_path.startsWith("@")) {
    return _path.split("/").length > 2;
  }

  return (
    !isAbsolute(_path) &&
    !isFileUrl(_path) &&
    !isRelative(_path) &&
    !_path.includes(":") &&
    !builtinModules.includes(_path) &&
    _path.split("/").length > 1
  );
}

/**
 * - `from "@npmcli/package-json"`
 * - `from "@npmcli/package-json/promise"`
 *
 * 存在需要安装的可能性
 */
function isNameSpaced(_path) {
  return _path.startsWith("@");
}
