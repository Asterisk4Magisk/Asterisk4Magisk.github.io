---
title: Mihomo 配置（AsteriskMETA）
description: AsteriskMETA 如何处理 Mihomo YAML：处理流程、应用托管的字段、DNS 合并规则、覆写脚本接口与示例、原始配置的要求，以及 asterisk-auto-switch 字段。
---

# Mihomo 配置（AsteriskMETA）

AsteriskMETA 以你导入的 Mihomo（Clash Meta）YAML 为基础，在启动前做少量必要的改写，再交给核心运行。本页说明哪些字段会被改写、覆写脚本如何工作，以及「原始配置」需要满足什么条件。

## 处理流程

```text
订阅 / 文件 YAML
   │
   ├─ ① 规则覆写（若该配置启用了规则覆写）
   │
   ├─ ② 覆写脚本 main(config)（若该配置选择了脚本）
   │
   ├─ ③ 应用托管字段：端口、入站、API、模式、DNS、嗅探等
   │
   └─ ④ 交给核心运行
```

开启 **完全关闭覆写**（原始配置）时，跳过 ①、② 和 ③，YAML 原样交给核心。

::: tip 先规则覆写，再脚本，最后托管
[规则覆写](./meta#rule-override) 最先执行，脚本看到的是覆写后的规则。覆写脚本在应用托管字段**之前**执行。脚本对下表中托管字段的修改会被应用覆盖；其他字段（`proxies`、`proxy-groups`、`rules`、`proxy-providers`、`rule-providers` 等）则以脚本的输出为准。
:::

## 应用托管的字段 {#managed}

| 字段 | 应用写入的值 |
| --- | --- |
| `mixed-port` | **本地代理端口**。其他入站字段的写法见下文「强制处理的字段」 |
| `authentication` | **本地代理用户名 / 密码** |
| `allow-lan`、`bind-address` | 开启 **监听全部网络接口** 或 ROOT 网络共享时允许局域网访问 |
| `external-controller`、`secret` 等 | 应用内部使用的 API 地址与密钥，供首页、代理页、连接监控等功能使用。ROOT 模式下可在 **其他 → 外部控制** 中固定端口、设置密钥、监听所有接口并配置 CORS |
| `external-ui`、`external-ui-name`、`external-ui-url` | 开启 **覆写外部面板** 时写入 |
| `find-process-mode` | **进程查找模式**；选择 **跟随配置** 时保留配置原值 |
| `mode` | 首页的 **规则 / 全局 / 直连**，对应 `rule` / `global` / `direct` |
| `unified-delay` | **连接测试 → 统一延迟** |
| `log-level` | **日志等级** |
| `geodata-mode`、`geodata-loader`、`geox-url` | **其他** 中的 **Geodata 模式**、**Geodata 加载器**，以及资源 **更新来源** |
| `ipv6` | IPv6 开关 |
| `sniffer` | **域名嗅探** 设置；关闭 **覆写域名嗅探** 时保留配置原样 |
| `asterisk-auto-switch` | 开启 **开启自动切换** 时按设置生成（见下文）；关闭时移除，配置自带的该字段不会生效 |
| `dns`、`hosts` | 见下文「DNS 合并规则」 |

### 强制处理的字段 {#forced}

覆写脚本执行之后，应用会重新写入下列字段，订阅或脚本中的值都不会生效。只有开启 **完全关闭覆写**（原始配置）时才保留 YAML 原样。

**固定写入，没有设置项：**

| 字段 | 实际行为 |
| --- | --- |
| `port`、`redir-port` | 始终为 `0` |
| `tproxy-port` | 始终为 `0`。TPROXY 模式不使用该字段，而是在 `listeners` 中生成 `asterisk-tproxy` 入站（见下表） |
| `tun` | 始终为 `enable: false`。TUN（ROOT）模式不使用该字段，而是在 `listeners` 中生成 `asterisk-tun` 入站（见下表） |
| `external-controller-unix` | VPN Service 模式为应用内部的控制套接字，其他模式移除 |
| `external-controller-pipe`、`external-controller-tls` | 始终移除 |
| `profile` | `store-selected` 与 `store-fake-ip` 强制为 `true`，其他子项保留 |
| `ntp` | `write-to-system` 强制为 `false`，其他子项保留 |
| `proxy-providers`、`rule-providers` 的 `path` | 仅 ROOT 模式：统一放到 `providers-root/` 目录下。已写 `path` 的去掉 `.`、`..` 等路径段后拼在其后；未写 `path` 的远程 Provider 按 URL 生成文件名 |
| `x-asteriskmeta-root-tun`、`x-asteriskmeta-root-bpf2socks` | 应用内部的模式标记，分别只在 TUN（ROOT）与 BPF2SOCKS 模式下写入为 `true`，其他情况移除 |

**取值来自设置，但写法由应用决定：**

| 字段 | 实际行为 |
| --- | --- |
| `socks-port` | TUN2SOCKS 模式为 **TUN2SOCKS SOCKS5 端口**，BPF2SOCKS 模式为 **SOCKS5 端口**，其他模式为 `0` |
| `listeners` | 配置自带的监听器总会被丢弃。TPROXY 模式只有 `asterisk-tproxy`（`tproxy` 类型，端口为 **透明代理端口**，开启 UDP）；TUN（ROOT）模式只有 `asterisk-tun`（设备 `asterisk0`，开启 `auto-route`、`auto-redirect`、`auto-detect-interface`，栈、MTU 与地址取自 **TUN 设置**，并按分应用名单、网络共享接口与绕过规则集生成匹配范围）；其他模式为空 |
| `skip-auth-prefixes` | 设置了 **本地代理用户名** 且 VPN Service 开启 **追加 HTTP 代理** 时为 `127.0.0.1/8`、`::1/128`，否则移除 |
| `proxies`、`rules` | ROOT 模式或 VPN Service 开启 **使用 Hev TUN** 时，若 **启用 DNS 劫持**：`proxies` 末尾追加名为 `dns-out` 的 `dns` 类型代理（已有同名代理时不追加），`rules` 最前面插入两条规则，把流量入口入站目标端口 53 的 TCP / UDP 交给 `dns-out`；`rules` 为空时先补一条 `MATCH,DIRECT` |

## DNS 合并规则 {#dns}

- 开启 **覆写 DNS**，或配置中的 `dns.enable` 不为 `true` 时：使用应用 **DNS 设置** 生成的 `dns` 块。
- 否则保留配置自带的 `dns` 块；若未 **启用 DNS 劫持**，其中的 `enable` 会被置为 `false`。
- 应用 **DNS hosts** 中的条目会与配置中的 `hosts` 合并。
- 运行模式需要 DNS 劫持时，应用会补充相应的 `dns-hijack` 设置。

## 覆写脚本 {#script}

覆写脚本是一段 JavaScript，必须定义同步函数 `main(config)`：

- `config` 是由 YAML 转换而来的 JavaScript 对象，键名与 YAML 一致（如 `config['proxy-groups']`）。若配置中没有 `proxy-providers`，会先补一个空对象。
- 返回修改后的对象；返回 `undefined` 或 `null` 时使用被直接修改过的 `config`。
- 返回值必须是对象，之后会转换回 YAML。
- 脚本运行在内置的 QuickJS 引擎中，没有网络与文件访问能力，也不支持异步（`async` / Promise）。
- `console` 只在 **调试** 时提供。正式启动时不保证存在 `console`，如需保留日志语句，请先判断 `typeof console !== 'undefined'`。

### 示例：在最前面加一条直连规则

```js
function main(config) {
  config.rules = config.rules || []
  config.rules.unshift('DOMAIN-SUFFIX,example.com,DIRECT')
  return config
}
```

### 示例：为香港节点新增一个自动测速组

```js
function main(config) {
  const names = (config.proxies || [])
    .map((proxy) => proxy.name)
    .filter((name) => /香港|HK|Hong Kong/i.test(name))
  if (names.length === 0) return config

  config['proxy-groups'] = config['proxy-groups'] || []
  config['proxy-groups'].unshift({
    name: '香港自动',
    type: 'url-test',
    proxies: names,
    url: 'https://www.gstatic.com/generate_204',
    interval: 300,
  })
  return config
}
```

新增的组需要被规则或其他 `select` 组引用后才会实际承载流量。修改后可在 **覆写脚本 → 调试** 中查看 **最终 YAML** 与 **摘要**，确认节点、策略组、规则数量的变化符合预期。

## 原始配置 {#raw}

开启 **完全关闭覆写** 后，应用不再改写 YAML，因此 YAML 本身必须提供当前运行模式所需的入站。应用会在编辑页给出 **配置检查** 结果：

| 运行模式 | 必须提供 | 缺失时 |
| --- | --- | --- |
| TPROXY | `tproxy-port` | 无法启动 |
| TUN（ROOT） | 一个兼容的 TUN 入站 | 无法启动 |
| TUN2SOCKS、BPF2SOCKS | SOCKS 或 Mixed 入站 | 无法启动 |
| VPN Service（启用 Hev TUN） | SOCKS 或 Mixed 入站 | 无法启动 |
| 其他模式 | 建议提供 SOCKS 或 Mixed 入站 | 本地代理相关功能不可用 |

此外：

- 没有配置 `external-controller` 时，首页监控、代理切换等依赖 API 的功能不可用。
- 需要 DNS 劫持时，YAML 中必须有对 TCP 与 UDP 53 端口生效的 DNS 规则，否则不会安装 DNS 劫持。

## asterisk-auto-switch {#auto-switch-field}

**自动切换** 通过顶层字段 `asterisk-auto-switch` 交给核心执行。该字段由 AsteriskMETA 内置核心读取，上游 Mihomo 会忽略它。正常模式下由应用根据设置写入；使用原始配置时，可以在 YAML 中自行编写：

```yaml
asterisk-auto-switch:
  enable: true
  groups: [节点选择]          # 监测的手动选择组
  preferred-filter: '(?i)(?:香港|HK)'  # 偏好节点名称的正则（regexp2 语法）
  failure-threshold: 1       # 连续失败多少次触发切换
  expected-delay: 300        # 期望延迟（ms），0 表示检测全部后选最快
  restore: false             # 是否在原节点恢复后切回
  interval: 30               # 检测间隔（秒）
  url: https://www.gstatic.com/generate_204
  timeout: 5000              # 单次检测超时（ms）
  concurrency: 10            # 检测并发
```

## 关于 Meow 版

Meow 是兼容 Mihomo 配置格式的另一种核心实现，AsteriskMETA 对两者使用相同的处理流程。个别字段或协议的支持情况可能不同，请以 Meow 项目文档为准。

## 官方文档

- [Mihomo 文档](https://wiki.metacubex.one/)：[配置总览](https://wiki.metacubex.one/config/) · [DNS](https://wiki.metacubex.one/config/dns/) · [代理组](https://wiki.metacubex.one/config/proxy-groups/) · [规则](https://wiki.metacubex.one/config/rules/) · [嗅探](https://wiki.metacubex.one/config/sniff/)
- [Mihomo GitHub](https://github.com/MetaCubeX/mihomo)
- [Meow GitHub](https://github.com/meow-rs/meow-rs)
