---
title: 文档概览
description: Asterisk App Family 使用文档：AsteriskNG、AsteriskMETA 与 AsteriskBOX 的安装、配置与排错指南。
---

# 文档概览

Asterisk App Family 是三款面向 Android 的开源代理客户端。三款应用共用同一套运行框架（运行模式、分应用代理、资源管理、服务控制等），区别在于内置的代理核心以及与之匹配的配置方式。

本文档基于以下版本编写：

| 应用 | 版本 | 代理核心 | 配置的基本单位 |
| --- | --- | --- | --- |
| [AsteriskNG](./ng) | 1.4.24 | Xray | 节点（分享链接 / 订阅分组） |
| [AsteriskMETA](./meta) | 1.2.24 | Mihomo 或 Meow | 配置文件（Clash/Mihomo YAML） |
| [AsteriskBOX](./box) | 1.1.24 | sing-box | 出站分组 + 选择器 + 路由 |

::: tip 界面文字
文中以 **粗体** 标出的菜单名称均取自应用的简体中文界面。若你使用其他界面语言，请对照英文版文档。
:::

## 如何选择应用

- **只想导入订阅、挑个节点就用** —— 三款都能做到。如果你的服务商提供的是 Clash/Mihomo 订阅，优先选 **AsteriskMETA**，订阅里的策略组和分流规则可以直接生效。
- **习惯 v2rayNG 式的节点列表**，想逐个编辑、分享节点，自己组合策略组和链式代理 —— 选 **AsteriskNG**。
- **想细粒度地控制 DNS、路由与出站**，或需要 WireGuard、OpenVPN、OpenConnect、Tailscale 等 VPN 端点 —— 选 **AsteriskBOX**。

三款应用包名不同，可以同时安装；但同一时间只能有一款应用以 ROOT 模式运行（详见 [运行模式与 ROOT](./run-modes#root-exclusive)）。

## 阅读路线

1. 第一次使用：阅读 [快速开始](./getting-started)，完成安装、导入订阅和首次连接。
2. 了解应用如何接管流量：阅读 [运行模式与 ROOT](./run-modes)。无 ROOT 设备只需了解 VPN Service 模式。
3. 三款应用共有的功能（分应用代理、资源文件、通知与磁贴、隐私、备份还原、日志）见 [通用功能](./common)。
4. 各应用专属的页面与配置，见 [AsteriskNG](./ng)、[AsteriskMETA](./meta)、[AsteriskBOX](./box)。
5. 需要按 Wi-Fi、锁屏、定时自动启停，或用 Tasker / adb 控制，见 [自动化与外部控制](./automation)。
6. 想深入定制核心配置（Custom 节点、覆写脚本、原始配置），见核心配置：[Xray](./core-xray)、[Mihomo](./core-mihomo)、[sing-box](./core-singbox)。
7. 遇到问题时，先看 [常见问题与排错](./faq)。

## 获取帮助

- 源代码与发行版：[GitHub · Asterisk4Magisk](https://github.com/Asterisk4Magisk)
- 讨论与公告：[Telegram 频道](https://t.me/Asterisk4Magisk)
- 反馈问题时，请附上应用版本、运行模式、Android 版本，以及从 **设置 → 日志** 导出的日志。
