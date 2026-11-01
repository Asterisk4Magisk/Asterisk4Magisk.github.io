---
title: Getting started
description: Download and install an Asterisk app, import a subscription, and make your first connection.
---

# Getting started

## Requirements

- Android 8.0 (API 26) or later.
- The default VPN Service mode **does not require root**. ROOT modes require a root solution such as Magisk, KernelSU, or APatch.

## Download {#download}

Get the latest release from each app's GitHub Releases page:

- [AsteriskNG Releases](https://github.com/Asterisk4Magisk/AsteriskNG/releases/latest)
- [AsteriskMETA Releases](https://github.com/Asterisk4Magisk/AsteriskMETA/releases/latest)
- [AsteriskBOX Releases](https://github.com/Asterisk4Magisk/AsteriskBOX/releases/latest)

Each release ships APKs split by CPU architecture:

| File name contains | For |
| --- | --- |
| `arm64-v8a` | Almost all recent phones and tablets (recommended) |
| `armeabi-v7a` | Older 32-bit ARM devices |
| `x86_64` / `x86` | Emulators and some x86 tablets |
| `universal` | All architectures, largest download; pick this if unsure |

::: info Two core editions of AsteriskMETA
Each AsteriskMETA APK bundles exactly one core. APKs with `-meow` in the file name contain **Meow**; the others contain **Mihomo**. Both use the same package name, so you can switch cores by installing one over the other — your data is kept. See [AsteriskMETA · Core editions](./meta#core-editions) for the differences.
:::

Only download APKs from the official GitHub Releases. The apps are GPL-3.0 licensed; you can review or build them yourself.

## First connection

The steps below use the default, non-root VPN Service mode.

### AsteriskNG

1. **With a subscription URL**: open **Settings → Group management**, tap **Add subscription**, enter the URL, and save. Then go back to the **Proxy** page and tap **Update subscriptions** in the overflow menu.
2. **With a single share link**: on the **Proxy** page tap the add button and choose **Scan QR code**, **Import from clipboard**, **Import from file**, or **Manual input**.
3. Tap a server to select it, then tap **Start proxy**.
4. On first start, Android asks for permission to create a VPN connection. Tap **OK**.

### AsteriskMETA

1. On the **Profiles** page tap **Add profile** and choose **URL** (remote subscription), **File** (local YAML), or **QR code**.
2. Enter the subscription URL and save. The app downloads, decrypts (if needed), and verifies the profile immediately.
3. Select the profile, go to **Home**, tap **Start service**, and grant the VPN permission.
4. Switch servers per policy group on the **Proxies** page. On Home you can switch the proxy mode between **Rule**, **Global**, and **Direct**.

### AsteriskBOX

1. On the **Groups** page tap **Add group** and choose **Enter manually** (subscription URL or a new local group), **File**, or **QR code**.
2. After the group syncs, tap **Start service** on **Home** and grant the VPN permission.
3. Switch servers in the selectors on the **Proxies** page.

::: tip One-tap import
Opening a link in one of these formats from a browser or another app launches the app and imports the subscription (`url` is the subscription URL; `name` is optional):

- `clash://install-config?url=…`, `clashmeta://install-config?url=…` (all three apps)
- `v2rayng://install-sub?url=…` (AsteriskNG, AsteriskBOX)
- `sing-box://import-remote-profile?url=…` (AsteriskBOX)
:::

## Check that it works

- A key (VPN) icon in the status bar means the VPN Service is up.
- On AsteriskMETA / AsteriskBOX, Home shows uptime, traffic, and **Network status** (local and egress addresses).
- On AsteriskNG, use **Real connection test** on the **Proxy** page to check whether a server works.

If starting fails, the app shows a **Failed to start proxy** dialog with error details, suggested actions, and the startup log. Tap **Copy log** to share it when asking for help.

## Next steps

- Only want some apps to use the proxy? See [Common features · Per-app proxy](./common#per-app-proxy).
- Rooted device, and want system-wide transparent proxying or to share the proxy with tethered devices? See [Run modes & root](./run-modes).
- Want to connect automatically at boot? See [Common features · Start on boot](./common#start-on-boot).
