---
title: AsteriskMETA changelog
description: Notable changes in every stable AsteriskMETA release.
---

# AsteriskMETA changelog

This page summarizes the user-facing changes in every stable AsteriskMETA release. For the full commit lists and APKs, see [AsteriskMETA Releases](https://github.com/Asterisk4Magisk/AsteriskMETA/releases).

Dates are GitHub Releases publication dates (UTC).

## 1.2.26 · 2026-11-05 {#v1-2-26}

- **New**: on Android 17 the app requests the local network permission at startup, so LAN servers and hotspot sharing keep working. See [Getting started](../guide/getting-started#first-connection).
- **New**: with the top-tab layout and many groups, tap **Show all proxy groups** to jump to a group from a sheet.
- **Fixed**: DNS hijacking rules did not load in the Meow edition in TUN2SOCKS / BPF2SOCKS modes (managed rules now use `IN-TYPE,SOCKS5`).
- **Improved**: icon accents on the enhancement toggle and settings search results.
- **Core**: Meow updated to v0.29.0.

## 1.2.25 · 2026-11-03 {#v1-2-25}

- **New**: the network activity card on Home is drawn as a dot waveform; switch back to **Two lines** with **Network activity chart** in the appearance settings.
- **Improved**: the resource monitor has separate CPU and memory cards; details add averages, uptime, today's traffic, and active connections.
- **New**: if the device is already on a network matching **Stop when Wi-Fi connects** at boot, start on boot keeps the proxy stopped.
- **Improved**: the Quick Settings tile follows the running state in real time.
- **Fixed**: with a custom core in ROOT mode, subscriptions no longer fail to sync because the built-in core rejects protocols or fields it does not know. See [Common features · Custom core](../guide/common#custom-core).
- **Fixed**: a conflict when ROOT boot configuration was written while the proxy was starting or stopping.

## 1.2.24 · 2026-11-01 {#v1-2-24}

- **New**: Meow core support, shipped as `-meow` APKs. See [AsteriskMETA · Core editions](../guide/meta#core-editions).
- **New**: the Proxies page supports the **Expandable list** layout and multiple columns with a column setting; provider usage follows the profile order.
- **Improved**: the VPN Service runs in its own process, and the resource monitor measures that process.
- **Improved**: traffic statistics pause while the screen is off; the status bar speed icon shows the combined speed.
- **Fixed**: the ROOT service keeps running after you leave the page; asteriskd updated to v2.2.7 and bpf2socks to v1.2.2.

## 1.2.23 · 2026-10-28 {#v1-2-23}

- **New**: VPN Service mode can start on boot and supports Android's always-on VPN.
- **New**: optionally interrupt existing connections when switching proxies.
- **Improved**: the "Changes not applied" banner moved to the Profiles page and is simpler to clear.
- **Fixed**: profiles can be imported when provider prefetch fails; relaxed DNS hijacking checks for raw configs.

## 1.2.22 · 2026-10-25 {#v1-2-22}

- **New**: automatic switching can switch back once the original proxy recovers.
- **New**: real-time download speed in the status bar.
- **Improved**: ROOT rules apply much faster; the core gets up to 15 seconds to become ready at startup.
- **Fixed**: pending profile changes apply after leaving the page, with hot reload in VPN mode; manual syncs of unscheduled profiles are saved.
- **Fixed**: the system IPv6 guard only applies to networks the app can access.

## 1.2.21 · 2026-10-21 {#v1-2-21}

- **Improved**: the interface consistently says "proxy".
- **Core**: AndroidLibClashLite updated to v1.19.33.

## 1.2.20 · 2026-10-20 {#v1-2-20}

- **New**: automatic switching to available proxies, with expected latency; groups proven healthy by live traffic are shown. See [AsteriskMETA · Automatic switching](../guide/meta#auto-switch).
- **New**: auto-hide navigation bar setting.
- **Fixed**: a consistent Fake IP pool default; IPv6 ranges are rejected.

## 1.2.19 · 2026-10-18 {#v1-2-19}

- **New**: a **Privacy** section in settings, with screenshot protection and hiding the launcher icon.
- **New**: connection test settings and the **Unified delay** toggle.
- **Fixed**: relaxed readiness probes for core and helper ports.

## 1.2.18 · 2026-10-15 {#v1-2-18}

- **New**: user data backup and restore.
- **New**: URL profiles can be named automatically from the subscription title.
- **Fixed**: profiles without proxies or providers are allowed; bpf2socks relay, hotspot, and idle wake-up issues.

## 1.2.17 · 2026-10-13 {#v1-2-17}

- **Fixed**: managed DNS rules are unified and must cover both TCP and UDP; DNS and netd issues in the enhancement module.
- **Improved**: simpler profile cards; improved module installation dialog.

## 1.2.16 · 2026-10-13 {#v1-2-16}

- **New**: option to hide the app from recent tasks.
- **New**: app list and DNS enhancements (requires the enhancement module).
- **Fixed**: DNS hijacking is scoped to proxy inbounds; statistics notification sessions are isolated and handle startup failures.

## 1.2.14 · 2026-10-09 {#v1-2-14}

- **New**: improved navigation on the Proxies page and public egress address monitoring.
- **Fixed**: network monitoring bypasses the local proxy when the service is stopped; private address ranges bypassed in ROOT modes.

## 1.2.13 · 2026-10-05 {#v1-2-13}

- **Improved**: unified page search with animated search bars; the service button sits beside the floating navigation bar.
- **Improved**: read-only previews share the same copy actions.
- **Fixed**: all-app mode is enforced when Fake IP is on in ROOT mode; subscription updates use the local proxy first and fall back to a direct connection.
- **Core**: Mihomo updated to v1.19.32.

## 1.2.12 · 2026-09-29 {#v1-2-12}

- **New**: HWID support for subscriptions.
- **Fixed**: policy chain order, with provider sources shown separately.
- **Improved**: consistent spacing for page tops and section titles.

## 1.2.11 · 2026-09-27 {#v1-2-11}

- **New**: lightweight automatic pause and resume.
- **New**: lock / unlock service control on Android 13 and later.
- **Fixed**: stale delays no longer mask failed tests; YAML formatting no longer accumulates blank lines; the UI updates immediately after changing the language.

## 1.2.10 · 2026-09-24 {#v1-2-10}

- **Improved**: "Enable local DNS" is renamed "Enable DNS hijacking"; page transitions keep rounded corners and dimmed backgrounds.
- **Fixed**: asteriskd honors the configured runtime paths.

## 1.2.9 · 2026-09-18 {#v1-2-9}

- **New**: automatic resource updates.
- **New**: broadcast commands for subscription and resource updates.
- **New**: "Scan Chinese apps" in the per-app proxy menu.
- **New**: ROOT startup failure diagnostics.
- **Fixed**: provider caches are isolated for ROOT mode.
- **Improved**: latency colors, colorful settings icons, and refreshed accent colors.
- **Core**: Mihomo updated to v1.19.31.

## 1.2.8 · 2026-09-13 {#v1-2-8}

- **New**: the connection monitor keeps disconnected connections for the session.
- **New**: floating format buttons in the YAML and JavaScript editors.
- **Improved**: refreshed top bars, floating navigation, and card styles; editors expand while the keyboard is visible.

## 1.2.7 · 2026-09-05 {#v1-2-7}

- **New**: traffic statistics in ROOT modes.
- **Fixed**: cleanup after the VPN permission is revoked.

## 1.2.6 · 2026-08-30 {#v1-2-6}

- **Fixed**: service control no longer depends on `awk`.

## 1.2.5 · 2026-08-30 {#v1-2-5}

- **Fixed**: IKE and NAT-T traffic is bypassed so Wi-Fi Calling keeps working.
- **Fixed**: IPv6 DNS hijacking in bpf2socks; the VPN runtime is released before starting a ROOT mode.

## 1.2.4 · 2026-08-26 {#v1-2-4}

- **Fixed**: IPv6 DNS paths enabled across ROOT modes.

## 1.2.3 · 2026-08-23 {#v1-2-3}

- **Improved**: service logs are cleaned up on launch; smoother page transitions.

## 1.2.2 · 2026-08-18 {#v1-2-2}

- **Fixed**: Clash API hot updates work in ROOT mode; restarts wait for the supervisor socket to be released.

## 1.2.1 · 2026-08-17 {#v1-2-1}

- **Improved**: the ROOT runtime is managed by asteriskd, making boot configuration and service startup more reliable.
- **Fixed**: ROOT runtime probes no longer run in VPN mode; custom core replacement is restored.

## 1.1.7 · 2026-08-07 {#v1-1-7}

- **Fixed**: compatibility with HevTUN 2.17; local address bypass rule order.

## 1.1.6 · 2026-08-06 {#v1-1-6}

- **Improved**: runtime and provider data are preloaded on cold start; faster profile builds.
- **Fixed**: delay results are kept for provider servers that only appear in groups.

## 1.1.5 · 2026-08-03 {#v1-1-5}

- **New**: detailed provider subscription usage on Home.
- **New**: resource file updates are queued.
- **Fixed**: delay tests for provider servers; usage loading no longer stalls on large profiles.

## 1.1.45141919810 · 2026-08-01 {#v1-1-45141919810}

- **New**: Rule Providers management with unified previews.
- **Fixed**: compatibility with HyperOS / Qualcomm mangle hooks; event-driven IPv6 leak prevention.

## 1.1.3 · 2026-07-28 {#v1-1-3}

- **New**: provider usage in the profile list.
- **Fixed**: core logs keep their original timestamps.

## 1.1.2 · 2026-07-20 {#v1-1-2}

- **New**: bulk subscription updates can be cancelled.

## 1.1.1 · 2026-07-18 {#v1-1-1}

- **Improved**: unified profile validation and sync.
- **Fixed**: lower CPU usage from repeated config rebuilds; more consistent proxy state.

## 1.1.0 · 2026-07-16 {#v1-1-0}

- **Fixed**: IPv6 connected UDP and downlink backpressure; stale proxy mode switching on Home; follow-system mode uses the current system language and theme.

## 1.0.7 · 2026-07-11 {#v1-0-7}

- **Fixed**: several IPv6 and UDP issues in BPF2SOCKS mode; Android's IPv6 tc offload is disabled for ROOT hotspot modes.
- **Fixed**: list changes are no longer lost after rapid saves.

## 1.0.6 · 2026-07-05 {#v1-0-6}

- **New**: broadcast control for the proxy service.
- **New**: full sniffer settings.
- **New**: update action for individual resource files.
- **Fixed**: automatic proxy groups allow manual selection; selections for uninstalled apps are pruned on refresh.

## 1.0.5 · 2026-07-02 {#v1-0-5}

- **New**: BPF2SOCKS (ROOT) run mode.
- **New**: proxy traffic statistics notification.
- **Fixed**: automatic proxy groups stay visible.

## 1.0.4 · 2026-06-27 {#v1-0-4}

- **New**: Proxy Providers management.
- **New**: optional Hev TUN for the VPN Service.
- **New**: clipboard import / export for app lists.
- **Fixed**: the Age secret key is passed when loading providers.

## 1.0.3 · 2026-06-23 {#v1-0-3}

- **New**: eBPF matcher and direct CIDR resources.
- **Fixed**: ROOT modes respect the local DNS setting; boot startup uses a dedicated config.

## 1.0.2 · 2026-06-15 {#v1-0-2}

- **New**: Geodata mode and loader options.
- **New**: Age secret keys for URL profiles.
- **New**: proxy list display options.

## 1.0.1 · 2026-06-14 {#v1-0-1}

- **New**: option to disable system IPv6 to prevent WebRTC leaks.
- **Improved**: manual HTTP subscription URLs are allowed with a warning.
- **Fixed**: custom resource file names are validated.

## 1.0.0 · 2026-06-09 {#v1-0-0}

The first stable release of AsteriskMETA, with run modes including VPN Service and TUN (ROOT).
