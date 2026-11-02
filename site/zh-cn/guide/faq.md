---
title: 常见问题与排错
description: Asterisk 应用的常见问题：启动失败、无法联网、订阅更新失败、ROOT 模式冲突、耗电与后台保活等。
---

# 常见问题与排错

## 排错的一般步骤

1. 看启动失败对话框：**代理启动失败** 会列出错误详情、建议操作与启动日志，先按建议操作处理。
2. 看日志：**设置 → 日志** 中的 **核心日志** 与 **Logcat**。需要更详细的信息时，把 **日志等级** 调高后复现一次。
3. 缩小范围：换一个节点、换回 VPN Service 模式、暂时关闭分应用代理或覆写脚本，确认问题出在哪一环。
4. 反馈：在 [Telegram 频道](https://t.me/Asterisk4Magisk) 或对应仓库的 GitHub Issues 中附上应用版本、Android 版本、运行模式与导出的日志（请先去除订阅地址和服务器信息）。

## 安装与启动

### 应该下载哪个 APK？

不确定时选择 `universal`；明确是 64 位 ARM 设备（绝大多数手机）可选 `arm64-v8a`，体积更小。见 [快速开始 · 下载安装包](./getting-started#download)。

### 提示「VPN 权限未授予，无法启动 VPN Service」

首次启动时系统会弹出 VPN 连接请求，需要点击确定。如果没有弹窗：

- 检查系统设置中是否有其他应用开启了「始终开启的 VPN」/「屏蔽未使用 VPN 的连接」，请先关闭。
- 部分厂商系统会拦截 VPN 授权弹窗，请在系统的 VPN 设置中手动选择本应用。

### 启动后显示已连接，但无法上网

- 用 **测试真连接**（AsteriskNG）或 **整组测试**（AsteriskMETA）确认节点本身可用。
- 检查分应用代理：白名单模式下，未加入名单的应用不会走代理。
- 检查 DNS：尝试关闭 FakeDNS / 覆写 DNS 等自定义项，或换用默认设置。
- 检查系统时间：时间偏差过大会导致 TLS / REALITY 等握手失败。
- AsteriskMETA 使用原始配置时，确认 YAML 中包含必要的入站与 DNS 字段（看 **配置检查** 提示）。

### 订阅更新失败

- 订阅地址本身被阻断时，开启 **使用代理更新** / **通过代理更新**，在代理运行时再更新。
- 有的服务商根据 User-Agent 返回不同格式；可换用 Clash Meta、v2rayNG、sing-box 等预设或自定义 User-Agent。
- 提示 HWID 被拒绝或设备数量已达上限时，需要在服务商处解绑旧设备。
- 订阅使用 Age 加密时，需要填写对应的 Age 私钥。

## ROOT 模式

### 提示「获取ROOT权限失败！」

在 ROOT 管理器（Magisk / KernelSU / APatch）中为本应用授予超级用户权限；若之前拒绝过，请删除拒绝记录后重试。

### 提示「ROOT 代理服务正被 X 占用」

三款应用的 ROOT 服务不能同时运行。先在提示中的应用里停止服务，再启动当前应用。

### eBPF / BPF2SOCKS 模式无法启动

这两种模式依赖内核的 eBPF 支持，通常适配 **GKI 5.10 及以上** 内核的设备（可在系统设置的「关于手机」中查看内核版本，或执行 `uname -r`）。内核较旧或不满足条件时，请改用 TPROXY 或 TUN2SOCKS。

### 热点共享的设备没有走代理

在 **代理设置 → 热点共享设置** 中勾选对应的共享类型（Wi-Fi / USB / 蓝牙 / 以太网）；TUN 模式与 AsteriskBOX 的 eBPF 模式下需要填写实际的下游接口名。VPN Service 模式无法透明代理热点下游设备；可在 **本地代理设置** 中开启 **监听全部网络接口**，让下游设备手动填写代理地址。

### 开启了 FakeDNS 后无法使用白名单 / 黑名单

ROOT 模式开启 FakeDNS / FakeIP 时，默认只支持全应用模式，已选的黑白名单会按全应用模式处理。两种解决方式：

- 在 TPROXY、TUN2SOCKS 或 BPF2SOCKS 模式下开启 [应用名单增强](./run-modes#enhance)，系统 DNS 会按应用名单分流，FakeDNS 即可与白名单 / 黑名单同时使用；
- 或者关闭 FakeDNS。

### ColorOS / RedMagic OS 上 Google Play 商店与 Google Play 服务无法联网

这两个系统会探测 Google 是否可达，探测失败就主动禁止 Google 应用联网，即使代理正常运行这些应用也无法连接；之后在网络变化等时机还会重新探测，手动解除的限制很快就会被恢复。ColorOS 16+ 由电池组件执行，涉及 Google Play 服务、Google Play 商店和 ConfigUpdater，VPN Service 模式下探测会直接判定为成功，因此主要影响 ROOT 模式；RedMagicOS 8+ 由系统的「应用优化」执行，涉及 Google Play 服务和 Google Play 商店。

可以安装 [GoogleFirewallFixer](https://github.com/Asterisk4Magisk/GoogleFirewallFixer) 模块（需要 Zygisk 与 LSPosed）：

- 按系统下载对应版本：ColorOS 16+ 使用 ColorOS 版，RedMagicOS 8+ 使用 RedMagicOS 版；
- 在 LSPosed 中启用模块，确认作用域已勾选（ColorOS 为「电池」，RedMagicOS 为「系统框架」），然后重启手机；
- 模块只阻止系统对这几个 Google 应用禁网，其他限制保持不变：ColorOS 上流量管理中手动设置的联网开关，以及深度睡眠、应用冻结时的断网照常生效；RedMagicOS 版还会避免查杀 Google Play 服务的推送进程，「应用优化」无需关闭。

## 后台与耗电

### 代理在后台被系统停止

- 在系统设置中将本应用的电池策略设为「不限制」/「无限制」，并允许自启动与后台运行。
- 部分厂商系统需要在最近任务中锁定应用。
- ROOT 模式的核心由 ROOT 进程运行，受系统后台限制的影响较小。

### 开机自启不生效

- VPN Service：确认已经授予过 VPN 权限，且系统允许本应用开机自启动。
- ROOT 模式：确认 ROOT 方案支持 `service.d` 脚本。还原备份后，ROOT 开机脚本会被禁用，需要重新开启。

## 其他

### 隐藏桌面图标后怎么打开应用？

在拨号界面输入对应的暗码，或长按快捷设置磁贴。暗码见 [通用功能 · 隐私](./common#privacy)。

### 三款应用可以同时安装吗？

可以，三款应用包名不同。VPN Service 模式下同一时间只能有一个 VPN 连接；ROOT 模式下同一时间只能有一款应用运行。

### AsteriskMETA 如何在 Mihomo 和 Meow 之间切换？

下载另一个核心版本的 APK 直接覆盖安装即可，用户数据保留。Meow 版不支持 TUN（ROOT）模式：如果安装 Meow 版前正在使用 TUN（ROOT），应用会自动把运行模式恢复为默认的 VPN Service，并关闭开机自启，请在切换后重新检查运行模式。
