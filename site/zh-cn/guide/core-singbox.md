---
title: sing-box 配置（AsteriskBOX）
description: AsteriskBOX 如何生成 sing-box 配置：模块与配置段的对应、托管标签命名、覆写脚本接口与示例、校验与预览。
---

# sing-box 配置（AsteriskBOX）

AsteriskBOX 把界面中的分组、出站、选择器、端点、DNS 与路由**编译**成一份完整的 sing-box JSON 配置。你可以在 **设置 → 工具 → 配置预览** 中查看结果，并通过覆写脚本对它做最后的修改。

## 处理流程

```text
界面中的各模块
   │
   ├─ ① 编译：生成 log / inbounds / endpoints / outbounds / services / dns / route / experimental
   │
   ├─ ② 覆写脚本 main(config)（开启时）
   │
   ├─ ②′ 编译插件出站（使用协议插件时）
   │
   ├─ ③ 校验：用核心检查最终配置
   │
   └─ ④ 交给核心运行
```

覆写脚本在编译**之后**执行，能修改配置中的任何部分；校验不通过时服务不会启动。

## 模块与配置段

| 配置段 | 来源 |
| --- | --- |
| `log` | **日志等级** |
| `inbounds` | 当前运行模式与 **本地代理设置** |
| `outbounds` | 分组中的出站、**选择器管理** 中的 Selector / URLTest，以及直连出站 |
| `endpoints` | **端点管理** |
| `dns` | **DNS 管理** |
| `route` | **路由管理**、**协议嗅探**、**资源管理** 中的规则集 |
| `services`、`experimental` | 应用内部使用的 API 与缓存设置 |

## 托管标签 {#tags}

配置中的 `tag` 由应用统一生成，格式固定，便于在覆写脚本中引用：

| 标签 | 含义 |
| --- | --- |
| `inbound_tun` | VPN Service（未启用 Hev TUN）与 TUN（ROOT）模式的 TUN 入站 |
| `inbound_root` | TPROXY、eBPF、TUN2SOCKS、BPF2SOCKS 模式的流量入站 |
| `inbound_local` | 本地代理入站（启用 Hev TUN 时 VPN 流量也经由它进入） |
| `outbound_direct` | 直连出站 |
| `selector_global` | 首页「全局」模式下所有流量使用的选择器 |
| `outbound_<编号>_<别名>` | 出站（节点） |
| `outbound_group_<编号>_<分组名>` | 分组自带的选择器 |
| `selector_<编号>_<别名>` | **选择器管理** 中创建的 Selector / URLTest |
| `endpoint_<编号>_<别名>` | 端点 |
| `dns_server_<编号>_<别名>` | DNS 服务器 |
| `dns_fakeip` | FakeIP DNS 服务器 |

别名中的特殊字符会被替换，实际标签请以 **配置预览** 为准。

## 路由规则的顺序 {#route-order}

`route.rules` 按顺序匹配，首条命中即生效。应用生成的顺序为：

1. 嗅探：`action: sniff`（开启 **协议嗅探** 时）
2. DNS 劫持：目标端口 53 的连接 `action: hijack-dns`（启用 DNS 时）
3. 代理模式：`clash_mode: Global` 时全部交给 `selector_global`，`clash_mode: Direct` 时全部交给 `outbound_direct`
4. **路由管理** 中启用的规则
5. 未命中任何规则时，使用 `route.final`（默认出站）

首页的 **规则 / 全局 / 直连** 就是通过第 3 步的 `clash_mode` 实现的。

## 覆写脚本 {#script}

在 **设置 → 高级设置 → 覆写脚本** 中开启 **启用覆写脚本** 并编写脚本。脚本必须定义同步函数 `main(config)`：

- `config` 是编译好的 sing-box 配置对象。
- 返回修改后的对象；返回 `undefined` 或 `null` 时使用被直接修改过的 `config`。返回值必须是对象，不能是数组。
- 不支持异步：`main` 返回 Promise 会被视为错误。
- 运行限制：单次执行最长 3 秒，内存上限 64 MB；没有网络与文件访问能力。
- 可以使用 `console.log` 等方法，输出在 **调试** 中查看（最多保留 500 条）。

::: info 错误信息只在调试中显示
脚本出错时，启动只会提示「覆写失败」，不会显示详细错误，以免配置中的密钥出现在通知或日志里。请在 **调试** 中查看完整的错误、Console 输出与校验警告。
:::

### 示例：为某个域名添加直连规则

新规则应插在应用注入的嗅探、DNS 劫持与代理模式规则之后（见 [路由规则的顺序](#route-order)）：放在嗅探之前会匹配不到嗅探出的域名，放在代理模式规则之前则会让「全局 / 直连」模式失效。

```js
function main(config) {
  config.route = config.route || {}
  const rules = config.route.rules || (config.route.rules = [])
  const injected = (rule) =>
    rule.action === 'sniff' || rule.action === 'hijack-dns' || rule.clash_mode !== undefined
  let index = 0
  while (index < rules.length && injected(rules[index])) {
    index++
  }
  rules.splice(index, 0, {
    domain_suffix: ['example.com'],
    outbound: 'outbound_direct',
  })
  return config
}
```

### 示例：调整所有 URLTest 的测试间隔

```js
function main(config) {
  for (const outbound of config.outbounds || []) {
    if (outbound.type === 'urltest') {
      outbound.interval = '5m'
    }
  }
  return config
}
```

::: warning
修改 `inbound_*` 入站或 `services`、`experimental` 中的应用内部设置，可能导致当前运行模式或首页监控、代理切换等功能失效。
:::

## 校验与预览

- 保存规则集、启动服务前，应用都会用核心校验配置，不合法时直接报错，不会用错误的配置启动。
- **配置预览**：服务运行时显示正在使用的配置文件；服务未运行时显示按当前设置（包括覆写脚本）生成的配置。
- AsteriskBOX 内置的 sing-box 核心包含部分上游没有的扩展，例如 eBPF 入站；这些字段以应用生成的结果为准。

## 官方文档

- [sing-box 配置文档](https://sing-box.sagernet.org/zh/configuration/)（[English](https://sing-box.sagernet.org/configuration/)）
- [路由 route](https://sing-box.sagernet.org/configuration/route/) · [规则动作](https://sing-box.sagernet.org/configuration/route/rule_action/) · [规则集 rule-set](https://sing-box.sagernet.org/configuration/rule-set/) · [DNS](https://sing-box.sagernet.org/configuration/dns/)
- [Selector](https://sing-box.sagernet.org/configuration/outbound/selector/) · [URLTest](https://sing-box.sagernet.org/configuration/outbound/urltest/) · [端点 endpoint](https://sing-box.sagernet.org/configuration/endpoint/)
- [sing-box GitHub](https://github.com/SagerNet/sing-box) · [reF1nd/sing-box-releases](https://github.com/reF1nd/sing-box-releases)
