---
title: 快速开始
description: 下载与安装 Asterisk 应用、导入订阅并完成首次连接。
---

# 快速开始

## 系统要求

- Android 8.0（API 26）及以上。
- 默认的 VPN Service 模式**不需要 ROOT**。ROOT 运行模式需要 Magisk、KernelSU 或 APatch 等 ROOT 方案。

## 下载安装包 {#download}

前往对应应用的 GitHub Releases 页面下载最新版本：

- [AsteriskNG Releases](https://github.com/Asterisk4Magisk/AsteriskNG/releases/latest)
- [AsteriskMETA Releases](https://github.com/Asterisk4Magisk/AsteriskMETA/releases/latest)
- [AsteriskBOX Releases](https://github.com/Asterisk4Magisk/AsteriskBOX/releases/latest)

| 文件名包含 | 适用设备 |
| --- | --- |
| `arm64-v8a` | 绝大多数近年的手机与平板（推荐） |
| `armeabi-v7a` | 较老的 32 位 ARM 设备 |
| `x86_64` / `x86` | 模拟器、部分 x86 平板 |
| `universal` | 包含全部架构，体积最大；不确定时可选它 |

::: info AsteriskMETA 的两个核心版本
文件名带 `-meow` 的是 **Meow** 版，不带的是 **Mihomo** 版，差异与切换方法见 [AsteriskMETA · 核心版本](./meta#core-editions)。
:::

官方仅在 GitHub Releases 分发应用安装包，其他来源请注意甄别安全性。

## 首次连接

下面以无 ROOT 的默认模式（VPN Service）为例。

::: tip Android 17 的本地网络权限
在 Android 17 及以上，应用首次打开时会与通知权限一起申请 **本地网络** 权限。使用局域网内的代理节点、开启 **监听全部网络接口** 或网络共享时需要授予该权限，否则局域网连接会被系统拦截。
:::

### AsteriskNG

1. **有订阅地址**：进入 **设置 → 分组管理**，点击 **添加订阅**，填写订阅地址并保存；然后回到 **代理** 页，在更多菜单中点击 **更新订阅**。
2. **只有单个节点链接**：在 **代理** 页点击添加按钮，选择 **扫描二维码**、**从剪贴板导入**、**从文件导入** 或 **手动输入**。
3. 点击选中一个节点，再点击 **启动代理**。
4. 首次启动时系统会弹出 VPN 连接请求，点击 **确定** 授权。

### AsteriskMETA

1. 进入底部 **配置** 页，点击 **添加配置**，选择 **URL**（远程订阅）、**文件**（本地 YAML）或 **二维码**。
2. 填写订阅地址并保存，应用会立即下载、解密（如需）并校验配置。
3. 选中该配置，回到 **首页** 点击 **启动服务**，并授予 VPN 权限。
4. 在 **代理** 页按策略组切换节点；首页可在 **规则 / 全局 / 直连** 之间切换代理模式。

### AsteriskBOX

1. 进入底部 **分组** 页，点击 **添加分组**，选择 **手动填写**（订阅 URL 或新建本地分组）、**文件** 或 **二维码**。
2. 分组同步完成后，在 **首页** 点击 **启动服务** 并授予 VPN 权限。
3. 在 **代理** 页的选择器中切换节点。

::: tip 一键导入
在浏览器或其他应用中点击以下格式的链接，可直接唤起应用导入订阅（`url` 参数为订阅地址，`name` 可选）：

- `clash://install-config?url=…`、`clashmeta://install-config?url=…`（三款均支持）
- `v2rayng://install-sub?url=…`（AsteriskNG、AsteriskBOX）
- `sing-box://import-remote-profile?url=…`（AsteriskBOX）
:::

## 验证是否生效

- 状态栏出现钥匙（VPN）图标，表示 VPN Service 已建立。
- AsteriskMETA / AsteriskBOX 的首页会显示运行时长、流量和 **网络状态**（本地地址与出口地址）。
- AsteriskNG 可在 **代理** 页使用 **真连接测试** 检查节点是否可用。

如果启动失败，应用会弹出 **代理启动失败** 对话框，包含错误详情、建议操作与启动日志，可一键 **复制日志** 用于排查或反馈。

## 下一步

- 只想让部分应用走代理？见 [通用功能 · 分应用代理](./common#per-app-proxy)。
- 设备已 ROOT，希望全局透明代理或共享给热点设备？见 [运行模式与 ROOT](./run-modes)。
- 希望开机自动连接？见 [通用功能 · 开机自启](./common#start-on-boot)。
