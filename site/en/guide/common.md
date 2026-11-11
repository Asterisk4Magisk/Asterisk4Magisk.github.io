---
title: Common features
description: Features shared by all three apps — per-app proxy, resource management, start on boot, notifications and the Quick Settings tile, appearance, privacy, logs, and backup and restore.
---

# Common features

This page covers features shared by all three apps. Where a setting lives in a different section in each app, it is noted below.

## Per-app proxy {#per-app-proxy}

Decides which apps send their traffic through the proxy.

- AsteriskNG: the **Apps** tab at the bottom.
- AsteriskMETA / AsteriskBOX: **Settings → General → Proxy app list**.

Three **proxy modes**:

| Mode | Effect |
| --- | --- |
| **All-app mode** | Every app uses the proxy |
| **Whitelist mode** | Only apps in the list use the proxy; everything else connects directly |
| **Blacklist mode** | Apps in the list bypass the proxy; everything else uses it |

Common actions (in the page's overflow menu):

- **Show system apps**: include system apps in the list.
- **Scan Chinese apps**: detect and check Chinese apps automatically — typically used with blacklist mode so those apps connect directly. Skipped in all-app mode.
- **Invert selection** / **Clear selection**: quickly adjust the list.
- **Import from clipboard** / **Export to clipboard**: move lists between devices or apps; when importing, choose **Merge import** or **Replace existing**.
- Pull down to refresh the installed app list.

::: tip
When FakeDNS / FakeIP is enabled in a ROOT mode, only all-app mode is available by default; with [Application list enhancement](./run-modes#enhance) on in TPROXY, TUN2SOCKS, or BPF2SOCKS mode, whitelist / blacklist work again.
:::

## Resource management {#resources}

**Settings → General → Resource management** manages the proxy core and rule resources (GeoIP, GeoSite, rule sets, and so on).

- Each file shows a **Ready** / **Missing** status, its size, and when it was updated.
- **Update resource files** downloads the latest versions from the **Update source**; enable **Automatic resource updates** to refresh them periodically (in hours) while online.
- Tap a file to **Replace** it with a local file, **Restore** the built-in version, or delete a custom file.
- **Add custom resource file**: give it a file name and a download URL.
- Files marked **Only used in ROOT modes** are used only in ROOT modes.
- While the service is running, a successful resource update is applied to the running service automatically.

Available update sources:

| App | Built-in sources |
| --- | --- |
| AsteriskNG | Loyalsoldier, V2Fly, Chocolate4U, RunetFreedom (GitHub), or a custom geodata URL |
| AsteriskMETA | MetaCubeX (GitHub), or a custom URL |
| AsteriskBOX | Default (GitHub), or a custom URL; you can also bulk-add rule sets from the sing-geoip / sing-geosite catalogs |

### Custom core

The **Core files** in resource management can be replaced with a core executable you upload; VPN and ROOT modes share the same core. Restore the built-in file to go back to the bundled core.

::: warning
Some features depend on the built-in core, such as AsteriskMETA's [automatic switching](./meta#auto-switch). An uploaded core may not be compatible with the current app version; if anything breaks, restore the built-in core first.
:::

When AsteriskMETA or AsteriskBOX runs a custom core in ROOT mode, configurations are no longer checked with the built-in core on import, save, or start, so protocols or fields that only the custom core understands are not rejected; the custom core reports any errors when it starts. VPN Service mode keeps every check.

## Start on boot {#start-on-boot}

Enable **Start on boot** under **Settings → Proxy settings (current mode)**:

- **VPN Service**: starts the VPN service after boot, and restores the previous service state after an app update. The VPN permission must have been granted before.
- **ROOT modes**: generates a `service.d` script so the root solution starts the service at boot.

Some vendor ROMs also require you to allow **auto-start / background activity** for the app, or start on boot may not work.

## Notifications and the Quick Settings tile

- **Show statistics** (**Settings → Proxy settings (current mode)**): shows the current speed and total traffic in the notification and status bar.
- **Quick Settings tile**: add the app's tile from the Quick Settings editor; tap it to start or stop the proxy, long-press to open the app. If the VPN permission has not been granted yet, grant it when prompted and tap the tile again. The tile follows the run mode, running state, and language in real time, including starts and stops triggered by service control in ROOT mode.

## Appearance and language

- **Theme**: follow system, light, or dark. **Accent color** can follow the system default (dynamic color) or use a preset.
- **Language**: AsteriskNG supports Simplified Chinese, English, Русский, and Tiếng Việt; AsteriskMETA and AsteriskBOX support Simplified Chinese and English.
- **Auto-hide navigation bar** (AsteriskMETA / AsteriskBOX): hides the bottom navigation bar while you scroll up.
- **Network activity chart** (AsteriskMETA / AsteriskBOX): the style of the network activity card on Home, either **Dots** (default) or **Two lines**.
- AsteriskMETA / AsteriskBOX can search settings from the top of the settings page.

## Privacy {#privacy}

| Setting | What it does |
| --- | --- |
| **Hide from recent tasks** | The app does not appear in the recent tasks list |
| **Allow screenshots** | Turn off to block screenshots and screen recording of the app |
| **Hide launcher icon** | Removes the home-screen icon; open the app with a dialer code or by long-pressing the Quick Settings tile |

With the launcher icon hidden, dial the following code in the phone app to open the app:

| App | Dialer code |
| --- | --- |
| AsteriskNG | `*#*#260517#*#*` |
| AsteriskMETA | `*#*#260608#*#*` |
| AsteriskBOX | `*#*#260728#*#*` |

Some vendor ROMs require the app to be allowed **auto-start / background activity** before it can respond to dialer codes. Make sure one of the methods above works for you before hiding the icon.

AsteriskNG also has **Deletion confirmation**, which asks before deleting servers, routes, groups, or resources.

## Logs {#logs}

**Settings → Logs** shows:

- **Core logs**: output from the proxy core; verbosity is set by **Log level**.
- **Access logs** (AsteriskNG): with **Record access logs** on, records where each connection went.
- **Logcat**: the app's own system log — the most useful one for startup problems.

Log pages support live refresh, pause, copy, and **Export logs**. Before sharing logs, remove subscription URLs, server addresses, and other sensitive data.

## Backup and restore {#backup}

**Settings → Backup and restore**:

- **Back up user data**: exports settings, servers / profiles, subscription groups, routing rules, the per-app list, and so on to a backup file.
- **Restore user data**: restores from a backup file. Before restoring, the app shows the backup's creation time, version, and item counts.

::: warning Restoring overwrites current data
Restoring overwrites all current user data. In addition, the running proxy is stopped, the ROOT boot script is disabled, and the run mode is switched back to VPN Service. Re-check the run mode and start-on-boot settings after restoring.
:::

Backup files contain subscription URLs and server credentials. Keep them safe and do not share them publicly.
