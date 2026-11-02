---
title: Overview
description: The Asterisk App Family user guide — installing, configuring, and troubleshooting AsteriskNG, AsteriskMETA, and AsteriskBOX.
---

# Overview

The Asterisk App Family is a set of three open-source proxy clients for Android. All three share the same runtime framework (run modes, per-app proxy, resource management, service control, and so on); they differ in the bundled proxy core and in how you configure it.

This guide covers the following versions:

| App | Version | Proxy core | Unit of configuration |
| --- | --- | --- | --- |
| [AsteriskNG](./ng) | 1.4.24 | Xray | Servers (share links / subscription groups) |
| [AsteriskMETA](./meta) | 1.2.24 | Mihomo or Meow | Profiles (Clash / Mihomo YAML) |
| [AsteriskBOX](./box) | 1.1.24 | sing-box | Outbound groups + selectors + routing |

::: tip UI labels
Menu names shown in **bold** are taken from the apps' English UI. If you use another UI language, see the Chinese edition of this guide.
:::

## Which app should I use?

- **Just import a subscription and pick a server** — all three can do that. If your provider gives you a Clash / Mihomo subscription, start with **AsteriskMETA**: the profile's policy groups and routing rules work as-is.
- **You like a v2rayNG-style server list** and want to edit and share individual servers, and build your own strategy groups and proxy chains — choose **AsteriskNG**.
- **You want fine-grained control over DNS, routing, and outbounds**, or need VPN endpoints such as WireGuard, OpenVPN, OpenConnect, or Tailscale — choose **AsteriskBOX**.

The three apps have different package names and can be installed side by side, but only one of them can run in a ROOT mode at a time (see [Run modes & root](./run-modes#root-exclusive)).

## How to read this guide

1. First time: follow [Getting started](./getting-started) to install, import a subscription, and connect.
2. To understand how traffic is captured, read [Run modes & root](./run-modes). On non-rooted devices you only need the VPN Service section.
3. Features shared by all three apps (per-app proxy, resource files, notifications and tiles, privacy, backup and restore, logs) are in [Common features](./common).
4. Pages and settings for each app: [AsteriskNG](./ng), [AsteriskMETA](./meta), [AsteriskBOX](./box).
5. To start or stop automatically by Wi-Fi, lock screen, or schedule, or to control the app from Tasker / adb, see [Automation & control](./automation).
6. To customize the core configuration in depth (Custom servers, override scripts, raw profiles), see the core pages: [Xray](./core-xray), [Mihomo](./core-mihomo), [sing-box](./core-singbox).
7. When something goes wrong, check [FAQ & troubleshooting](./faq) first.

## Getting help

- Source code and releases: [GitHub · Asterisk4Magisk](https://github.com/Asterisk4Magisk)
- Discussion and announcements: [Telegram channel](https://t.me/Asterisk4Magisk)
- When reporting a problem, include the app version, run mode, Android version, and the logs exported from **Settings → Logs**.
