## [0.0.11] - 2026-06-26

### 重大变更
- **Target 类重构为 target 接口**：将 `Target` 类改为轻量级接口 `target`，移除 getter/setter 方法，改为直接属性访问。这简化了 API 的使用方式，减少了样板代码。
- **移除 Dependency 类**：依赖关系现在直接通过 `target` 接口的 `dep` 字段表达，无需额外的包装类。

### 新增
- 新增 `isTarget()` 类型守卫函数，用于运行时的 target 类型校验
- 新增 `isArrayString()` 辅助函数，用于验证字符串数组类型

### 改进
- 类型命名规范化：所有类型名称从双下划线风格 (`language__t`、`cStandard__t`) 统一改为单下划线风格 (`language_t`、`cStandard_t`)，与 TypeScript 社区惯例对齐
- 代码清理：移除 `main.ts` 中未使用的 import（`fs_promises`、`parseArgs`、`Target`、`Dependency`）
- `CMake.buildDep()` 和 `addTarget()` 方法适配新的 `target` 接口，使用 `isTarget()` 进行类型检查
- `package.json` 中 `scripts` 字段位置调整（纯格式优化）

### 类型定义变更（BREAKING）
以下类型名称已重命名，旧名称不再可用：

| 旧名称 | 新名称 |
|--------|--------|
| `language__t` | `language_t` |
| `cStandard__t` | `cStandard_t` |
| `cppStandard__t` | `cppStandard_t` |
| `javaStandard__t` | `javaStandard_t` |
| `packageManager__t` | `packageManager_t` |
| `c_cpp_compiler__t` | `c_cpp_compiler_t` |
| `java_compiler__t` | `java_compiler_t` |
| `c_cpp_build_tools__t` | `c_cpp_build_tools_t` |
| `project_config__i` | `project_config_i` |
| `Target` (class) | `target` (interface) |

### API 变更（BREAKING）
- `Target` 类已移除，请改用 `target` 接口直接构造对象字面量
- `new Target({...})` → `{ name: '...', type: '...', source: [...] }`
- 不再需要调用 `.getName()`、`.getSource()` 等 getter 方法，直接使用 `.name`、`.source` 属性访问
- `Dependency` 类已移除，依赖关系直接作为 `target` 对象的 `dep` 字段

---

## [0.0.10]
修复当 `kiln.config.ts` 不存在时,程序尚未退出的BUG

---

## [0.0.9]
修复当 `kiln.config.ts` 不存在时的报错
添加no_config字段

---

## [0.0.8] [0.0.7] [0.0.6] [0.0.5] [0.0.4] [0.0.3] [0.0.2]
仅调试包, 无实际添加内容

---

## [0.0.1]
发布包
