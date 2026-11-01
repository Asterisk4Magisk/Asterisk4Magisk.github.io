---
title: Xray 配置（AsteriskNG）
description: AsteriskNG 如何生成 Xray 配置：固定标签、入站与运行模式、节点到出站的映射、路由规则写法，以及 Custom 节点的覆写规则。
---

# Xray 配置（AsteriskNG）

AsteriskNG 不直接让你编辑完整的 Xray 配置文件，而是根据界面中的节点、路由与设置**在每次启动时生成**一份 Xray JSON 配置。理解生成规则，有助于你写出正确的路由规则，或在 **Custom** 节点中直接使用自己的 Xray 配置。

## 生成的配置结构

| Xray 字段 | 来源 |
| --- | --- |
| `log` | **日志等级**、**记录访问日志** |
| `inbounds` | 当前运行模式与 **本地代理设置**（见下文） |
| `outbounds` | 选中的节点 / 策略组 / 链式代理，以及固定的 `direct`、`block` 等出站 |
| `routing` | **路由** 页的规则、**默认出站代理标签**、**域名解析策略** |
| `dns`、`fakeDns` | **核心设置 → DNS 设置** |
| `observatory`、`burstObservatory` | 使用「最低延迟」「最低负载」策略组时自动生成 |
| `stats`、`api`、`policy` | 应用用于统计流量，始终追加 |

## 固定标签 {#tags}

以下标签由应用保留，路由规则或 Custom 配置中可以直接引用：

| 标签 | 类型 | 说明 |
| --- | --- | --- |
| `proxy` | 出站 | 当前选中的节点 |
| `direct` | 出站 | `freedom` 直连 |
| `block` | 出站 | `blackhole` 阻止 |
| `dns-out` | 出站 | DNS 出站，用于 DNS 劫持 |
| `fragment` | 出站 | 开启 **Fragment** 时的 `freedom` 分片出站 |
| `dns-proxy` / `dns-direct` | 内部 | 代理 DNS / 直连 DNS 查询使用的标签 |

## 入站与运行模式

| 入站标签 | 出现条件 |
| --- | --- |
| `vpn-tun-in` | VPN Service 模式且未启用 **使用 Hev TUN**（Xray `tun` 入站）；启用 Hev TUN 时，流量经 `hev-socks5-tunnel` 进入 `socks-in` |
| `socks-in` | **本地代理设置** 中的本地代理 |
| `vpn-http-in` | VPN Service 开启 **追加 HTTP 代理** |
| `tproxy-in` | TPROXY 模式 |
| `tun2socks-in` | TUN2SOCKS 模式 |
| `bpf2socks-in` | BPF2SOCKS 模式 |

DNS 劫持开启时，应用会在路由规则最前面插入一条规则：把流量入口入站（如 `vpn-tun-in`，启用 Hev TUN 时为 `socks-in`）中目标端口 53 的 TCP / UDP 流量交给 `dns-out`。

## 节点如何变成出站 {#outbounds}

| 界面中的类型 | 生成的 Xray 配置 |
| --- | --- |
| 普通节点（VLESS、VMess、Trojan 等） | 一个对应协议的 `outbound`，`streamSettings` 由传输与安全设置生成 |
| **策略组** | `routing.balancers` 中的一个负载均衡器。`strategy.type` 对应 **最低延迟** `leastPing`、**最低负载** `leastLoad`、**随机选择** `random`、**轮询** `roundRobin`；`leastPing` 会生成 `observatory`，`leastLoad` 会生成 `burstObservatory` 用于测速 |
| **链式代理** | 每个成员一个出站，后一跳通过 `streamSettings.sockopt.dialerProxy` 经由前一跳拨号 |
| **Fragment** | 节点通过 `sockopt.dialerProxy` 指向 `fragment` 出站，由 `freedom` 的 `fragment` 选项按 **分片方式**、包长与间隔拆分早期 TCP 数据 |
| **Mux** | 节点出站的 `mux` 字段（`concurrency`、`xudpConcurrency`、`xudpProxyUDP443`） |

## 路由规则写法 {#routing-rules}

**路由** 页中的每条规则对应 `routing.rules` 中的一项，按列表顺序自上而下匹配，首条命中即生效。

**域名规则** 支持 Xray 的全部写法：

| 写法 | 含义 |
| --- | --- |
| `example.com` | 子串匹配 |
| `domain:example.com` | 匹配该域名及其子域名 |
| `full:www.example.com` | 完整匹配 |
| `keyword:google` | 关键词匹配 |
| `regexp:\.cn$` | 正则匹配 |
| `geosite:cn` | 使用 `geosite.dat` 中的分类 |
| `ext:文件名.dat:标签` | 使用资源目录中自定义 dat 文件的分类 |

**IP 规则** 支持单个 IP、CIDR（如 `10.0.0.0/8`）和 `geoip:cn`、`geoip:private` 等。

::: tip 自定义规则文件
在 **资源管理** 中用 **添加自定义资源文件** 下载的 `.dat` 文件可以通过 `ext:` 引用。启动前应用会检查被引用的文件是否存在且非空，缺失时会直接报错，而不是让核心静默忽略。
:::

## Custom 节点 {#custom}

**Custom** 节点让你直接粘贴 Xray JSON。配置必须是一个 JSON 对象，并且至少包含一个 `outbounds`。

### 开启「覆写入站设置和 DNS 设置」（默认）

适合「只想用自己的出站与路由，其他交给应用」的场景。应用会：

- 用当前运行模式的入站**替换** `inbounds`，用应用的 DNS 设置**替换** `dns` 与 `fakeDns`；
- 在 `outbounds` 中移除你写的 `direct` 与 `dns-out`，改为应用生成的版本；
- 把标签为 `proxy` 的出站视为主出站；没有时，取第一个非固定标签的出站（若它没有标签，会被命名为 `proxy`）；
- 在你的 `routing.rules` **前面**插入 DNS 劫持与 DNS 上游路由规则，你原有的规则保持原顺序。

### 关闭覆写

配置几乎**原样**交给核心，仅追加流量统计所需的 `stats` / `api` / `policy`。此时：

- 入站、DNS 与路由都需要你自己写，并且必须与当前运行模式匹配，例如 TPROXY 模式需要监听 **透明代理端口** 的 `dokodemo-door` 透明代理入站；
- 应用的分应用代理、DNS 设置、路由规则对该节点不生效。

::: warning
关闭覆写属于高级用法，配置与运行模式不匹配时，代理可能启动成功却无法上网。一般请保持开启。
:::

## 官方文档

- [Xray 配置文档](https://xtls.github.io/config/)（[English](https://xtls.github.io/en/config/)）
- [路由 routing](https://xtls.github.io/config/routing.html) · [DNS](https://xtls.github.io/config/dns.html) · [出站 outbounds](https://xtls.github.io/config/outbound.html) · [传输方式 transport](https://xtls.github.io/config/transport.html)
- [负载均衡 observatory](https://xtls.github.io/config/observatory.html) · [FakeDNS](https://xtls.github.io/config/fakedns.html)
- [Xray-core GitHub](https://github.com/XTLS/Xray-core)
