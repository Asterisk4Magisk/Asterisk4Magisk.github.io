---
title: 运行模式与 ROOT
description: VPN Service、TPROXY、TUN、eBPF、TUN2SOCKS、BPF2SOCKS 运行模式的区别，以及 ROOT 相关设置与增强模块。
---

# 运行模式与 ROOT

运行模式决定应用**如何把设备流量交给代理核心**。在 **设置 → 高级设置 → 运行模式** 中切换；切换后，设置页下方会出现对应的 **代理设置（模式名）** 分组，存放该模式的专属选项。

## 模式一览

| 模式 | ROOT | AsteriskNG | AsteriskMETA | AsteriskBOX | 流量接管方式 |
| --- | :-: | :-: | :-: | :-: | --- |
| VPN Service | 否 | ✓ | ✓ | ✓ | Android `VpnService` |
| TPROXY | 是 | ✓ | ✓ | ✓ | iptables + 策略路由透明代理 |
| TUN | 是 | — | ✓（仅 Mihomo 版） | ✓ | 核心自带 TUN 入站的 auto-route / auto-redirect |
| eBPF | 是 | — | — | ✓ | sing-box eBPF 入站 |
| TUN2SOCKS | 是 | ✓ | ✓ | ✓ | `hev-socks5-tunnel` 创建 TUN，送入核心 SOCKS5 入站 |
| BPF2SOCKS | 是 | ✓ | ✓ | ✓ | `bpf2socks` 劫持流量，送入核心 SOCKS5 入站 |

::: tip 怎么选
- **没有 ROOT**：只能使用 VPN Service，它能覆盖绝大多数日常场景。
- **有 ROOT**：可以从 TPROXY 开始；它不占用系统 VPN 槽位，其他 VPN 类应用仍可使用。
- **eBPF / BPF2SOCKS** 依赖设备内核的 eBPF 支持，通常适配 **GKI 5.10 及以上** 内核的设备；较旧内核可能无法使用，启动失败时请换用其他模式。
:::

## VPN Service（无需 ROOT）

应用通过 Android 的 `VpnService` 建立一个虚拟网卡，系统把流量交给它处理。首次启动需授予 VPN 权限。

**代理设置（VPN Service）** 中的常用项：

- **追加 HTTP 代理**（Android 10 及以上）：在 VPN 上附带系统 HTTP 代理，让支持的应用直接使用 HTTP 代理。
- **使用 Hev TUN**：改用 `hev-socks5-tunnel` 处理 TUN 设备。
- **TUN 设置**：MTU、VPN DNS、IPv4 / IPv6 地址段。

由核心处理 DNS 请求的 **启用 DNS 劫持** 开关不在这里，而在 DNS 设置中：AsteriskNG 为 **核心设置 → DNS 设置**，AsteriskMETA / AsteriskBOX 为 **常规** 中的 DNS 设置 / **DNS 管理**。

所有模式都有 **本地代理设置**：本地代理端口、用户名与密码；**动态本地代理端口** 会在每次启动时自动挑选可用端口；**监听全部网络接口** 绑定到 `0.0.0.0`，允许局域网内其他设备连接（开启时请务必设置用户名和密码）。

::: warning 系统限制
Android 同一时间只允许一个 VPN 应用处于连接状态。启动本应用会断开其他 VPN，反之亦然。如果系统设置里开启了其他应用的「始终开启的 VPN」，请先关闭。
:::

## ROOT 模式

ROOT 模式下，应用通过 libsu 以 ROOT 身份直接运行核心可执行文件，并由常驻守护进程 **asteriskd** 维护网络规则：

- 监听本地 IPv4 / IPv6 地址和热点接口变化，自动刷新 iptables 规则或 BPF map；
- 服务停止时清理当前模式负责的网络规则。

首次切换到 ROOT 模式时，ROOT 管理器会弹出授权请求，请允许。若提示 **获取ROOT权限失败！**，请在 ROOT 管理器中检查授权记录。

### ROOT 通用设置

| 设置项 | 作用 |
| --- | --- |
| **开机自启** | 生成 `service.d` 启动脚本，开机后由 ROOT 方案拉起服务 |
| **服务控制** | 按 Wi-Fi、锁屏、定时条件自动启停，见 [自动化与外部控制](./automation#service-control) |
| **使用 eBPF 匹配器** | 仅 TPROXY 与 TUN2SOCKS 模式。分应用名单较大时提升匹配性能，并支持地址过滤 |
| **绕过直连地址** | 开启 eBPF 匹配器或使用 BPF2SOCKS 时为开关：命中名单的目标地址不进入代理核心，默认使用中国地址列表，可在 **资源管理** 中调整。TUN 模式（AsteriskMETA / AsteriskBOX）与 eBPF 模式（AsteriskBOX）下改为选择 IP CIDR 规则集，见下文 |
| **绕过私有地址** | 仅 AsteriskBOX 的 eBPF 模式。私有地址不进入代理核心 |
| **禁用系统 IPv6** | 在应用中关闭 IPv6 后出现，用于防止 WebRTC 等途径泄露 IPv6 地址 |
| **应用名单增强** | 仅 TPROXY、TUN2SOCKS、BPF2SOCKS 模式，见下文 [增强模块](#enhance) |
| **热点共享设置** | 允许 Wi-Fi / USB / 蓝牙 / 以太网 热点共享的下游设备流量进入代理 |
| **忽略接口设置** | 指定不接管的网络接口；末尾加 `+` 可按前缀匹配，如 `wlan+` |
| **私有地址设置** | 私有地址默认不进入代理核心；需要代理的网段在此添加 |

在 TUN 模式（AsteriskMETA / AsteriskBOX）与 eBPF 模式（AsteriskBOX）下，**热点共享设置** 改为填写实际的下游接口名（如 `ap0`、`rndis0`），不支持通配符；**忽略接口设置** 与 **私有地址设置** 不显示。

::: info FakeDNS 与分应用代理
ROOT 模式开启 FakeDNS / FakeIP 时，分应用代理默认仅支持 **全应用模式**。在 TPROXY、TUN2SOCKS、BPF2SOCKS 模式下开启 [应用名单增强](#enhance) 后，DNS 会按应用名单分流，此限制随之解除。
:::

### 各 ROOT 模式的要点

- **TPROXY**：设置 **透明代理端口**。基于 iptables 与策略路由，不依赖 eBPF。
- **TUN**：使用核心自身的 TUN 栈。可在 **绕过直连地址** 中指定若干 IP CIDR 规则集直接绕过流量接管（域名规则在此处不生效）；AsteriskMETA 还可选择 **TUN 栈**。
- **eBPF**（AsteriskBOX）：可选择 **数据面**（`socket_assign` / `cgroup` / `packet_rewrite` 等）和 **DNS 模式**（`hijack` 接管 53 端口，`respect_policy` 遵循应用筛选）；与 TUN 模式一样可用 IP CIDR 规则集绕过流量接管。
- **TUN2SOCKS**：设置 TUN2SOCKS 使用的 SOCKS5 端口，以及 TUN 的 MTU 与地址段。
- **BPF2SOCKS**：设置 **BPF2SOCKS bridge 端口** 与 **SOCKS5 端口**。

### 同一时间只能有一个 ROOT 服务 {#root-exclusive}

三款应用的 ROOT 服务共用同一套网络规则，不能同时运行。若出现 *ROOT 代理服务正被 X 占用* 的提示，请先在提示中的应用里停止服务，再启动当前应用。

## 增强模块（AsteriskEnhance） {#enhance}

[AsteriskEnhance](https://github.com/Asterisk4Magisk/AsteriskEnhance) 是可选的系统模块，让**系统 DNS 也按分应用名单分流**，并为不同名单隔离解析缓存，避免应用间的 DNS 结果互相污染。

- 需要 ROOT 和 **Zygisk Next**；支持 TPROXY、TUN2SOCKS 与 BPF2SOCKS 模式。
- 在 **设置 → 代理设置（当前模式）** 中开启 **应用名单增强**，按提示由应用自动刷入（支持 Magisk、KernelSU、APatch）。
- 安装或更新后**需要重启设备**。应用更新附带新版模块时，会提示更新并重启。
- 自动刷入失败时，可导出本应用 APK，将后缀 `.apk` 改为 `.zip`，在 ROOT 管理器中手动刷入。
