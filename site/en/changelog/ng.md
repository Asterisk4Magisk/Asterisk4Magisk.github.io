---
title: AsteriskNG changelog
description: Notable changes in every stable AsteriskNG release.
---

# AsteriskNG changelog

This page summarizes the user-facing changes in every stable AsteriskNG release. For the full commit lists and APKs, see [AsteriskNG Releases](https://github.com/Asterisk4Magisk/AsteriskNG/releases).

Dates are GitHub Releases publication dates (UTC).

## 1.4.25 · 2026-11-03 {#v1-4-25}

- **New**: share and export subscription groups — subscription QR code, copy subscription link, copy every server link in the group, or export links to a file. See [AsteriskNG · Subscription groups](../guide/ng#subscription-groups).
- **New**: in ROOT mode, if the device is already on a network matching **Stop when Wi-Fi connects** at boot, start on boot keeps the proxy stopped. See [Automation · Wi-Fi control](../guide/automation#wi-fi-control).
- **Improved**: the Quick Settings tile follows the run mode, running state, and language in real time, and stays in its processing state until a toggle settles.
- **Fixed**: a conflict when ROOT boot configuration was written while the proxy was starting or stopping.
- **Other**: a hardened `:vpn` process boundary; traffic statistics now run in the `:service` process.

## 1.4.24 · 2026-11-01 {#v1-4-24}

- **Improved**: the VPN Service now runs in its own process.
- **Improved**: traffic statistics pause while the screen is off to save battery.
- **Improved**: more balanced text sizes for the status bar network speed.
- **Fixed**: asteriskd updated to v2.2.7 to handle large vendor mangle tables.
- **Core**: Xray updated to v26.10.31.

## 1.4.23 · 2026-10-29 {#v1-4-23}

- **Improved**: the status bar speed icon shows the combined upload and download speed in larger text.
- **Fixed**: saving service control settings is no longer interrupted; asteriskd updated to v2.2.5 and bpf2socks to v1.2.2.
- **Core**: Xray updated to v26.10.29.

## 1.4.22 · 2026-10-28 {#v1-4-22}

- **New**: VPN Service mode can start on boot and supports Android's always-on VPN.
- **New**: import v2rayN share links; subscription parsing is more complete.

## 1.4.21 · 2026-10-25 {#v1-4-21}

- **New**: real-time download speed in the status bar.
- **Improved**: ROOT rules apply much faster; the core gets up to 15 seconds to become ready at startup.
- **Fixed**: the bottom navigation bar stays above the keyboard, and editors no longer jump when the keyboard appears.
- **Fixed**: the system IPv6 guard only applies to networks the app can access.

## 1.4.20 · 2026-10-21 {#v1-4-20}

- **Fixed**: AAAA queries return empty responses when FakeDNS is on, so IPv6 addresses do not bypass it.
- **Core**: AndroidLibXrayLite updated to v26.10.22, with local DNS as the default.

## 1.4.19 · 2026-10-20 {#v1-4-19}

- **New**: pick installed apps for process conditions in routing rules.
- **New**: configurable IPv4-only FakeDNS pool.
- **Improved**: help for app proxy modes and more readable dialogs.

## 1.4.18 · 2026-10-18 {#v1-4-18}

- **New**: MASQUE server support.
- **New**: a **Privacy** section in settings; the Monet launcher icon is removed.
- **Fixed**: relaxed readiness probes for core and helper ports.
- **Core**: Xray updated to v26.10.17.

## 1.4.17 · 2026-10-15 {#v1-4-17}

- **New**: subscription groups can be named automatically from the subscription title.
- **New**: handshake latency tests for QUIC and WireGuard servers.
- **Fixed**: bpf2socks relay, hotspot, and idle wake-up issues.

## 1.4.16 · 2026-10-13 {#v1-4-16}

- **Fixed**: DNS and netd issues in the enhancement module; improved module installation dialog.

## 1.4.15 · 2026-10-13 {#v1-4-15}

- **New**: option to hide the app from recent tasks.
- **New**: app list and DNS enhancements (requires the enhancement module).
- **Fixed**: traffic notifications and statistics sampling in ROOT modes.
- **Core**: Xray updated to v26.10.10.

## 1.4.13 · 2026-10-09 {#v1-4-13}

- **Fixed**: server IDs are preserved during subscription updates, so the selected server is kept.
- **Fixed**: private address ranges bypassed in ROOT modes.

## 1.4.12 · 2026-10-01 {#v1-4-12}

- **Fixed**: all-app mode is enforced when FakeDNS is on in ROOT mode.
- **Fixed**: subscription updates use the local proxy first and fall back to a direct connection.
- **Core**: Xray updated to v26.9.30.

## 1.4.11 · 2026-09-27 {#v1-4-11}

- **New**: lightweight automatic pause and resume.
- **New**: lock / unlock service control on Android 13 and later.
- **New**: remote DNS for WireGuard servers.
- **Fixed**: the UI updates immediately after changing the language; the VPN HTTP proxy option is hidden on unsupported Android versions.

## 1.4.10 · 2026-09-24 {#v1-4-10}

- **New**: drag-and-drop sorting for subscription groups.
- **Improved**: "Enable local DNS" is renamed "Enable DNS hijacking".
- **Fixed**: process conditions in routing rules did not match apps when the VPN Service used Xray's built-in TUN.

## 1.4.9 · 2026-09-18 {#v1-4-9}

- **New**: automatic resource updates.
- **New**: broadcast commands for subscription and resource updates.
- **New**: "Scan Chinese apps" in the per-app proxy menu.
- **New**: ROOT startup failure diagnostics.
- **Improved**: latency colors and thresholds, with failures in red; refreshed accent colors.

## 1.4.8 · 2026-09-13 {#v1-4-8}

- **New**: Vietnamese interface.
- **Improved**: drag reordering commits when you release; editors expand while the keyboard is visible.
- **Core**: Xray updated to v26.9.9.

## 1.4.7 · 2026-09-05 {#v1-4-7}

- **New**: traffic statistics in ROOT modes.
- **Fixed**: cleanup after the VPN permission is revoked, and bounded runtime shutdown.

## 1.4.6 · 2026-08-30 {#v1-4-6}

- **Fixed**: service control no longer depends on `awk`.

## 1.4.5 · 2026-08-30 {#v1-4-5}

- **Fixed**: IKE and NAT-T traffic is bypassed so Wi-Fi Calling keeps working.
- **Fixed**: IPv6 DNS hijacking in bpf2socks; ipsec interfaces are exempt from the IPv6 guard.

## 1.4.4 · 2026-08-26 {#v1-4-4}

- **Fixed**: IPv6 DNS paths enabled across ROOT modes.

## 1.4.3 · 2026-08-23 {#v1-4-3}

- **Improved**: service logs are cleaned up on launch; the asteriskd log is kept when switching run modes.

## 1.4.2 · 2026-08-18 {#v1-4-2}

- **Improved**: restarts wait for the supervisor socket to be released, reducing failed restarts.

## 1.4.1 · 2026-08-17 {#v1-4-1}

- **Improved**: the ROOT runtime is managed by asteriskd, making boot configuration and service startup more reliable.
- **Fixed**: ROOT runtime probes no longer run in VPN mode; custom core replacement is restored.

## 1.3.12 · 2026-08-07 {#v1-3-12}

- **Fixed**: compatibility with HevTUN 2.17; local address bypass rule order.

## 1.3.11 · 2026-08-06 {#v1-3-11}

- **New**: resource file updates are queued.
- **Fixed**: all inbound proxy traffic is counted and notification speeds are smoother; VPN status syncs after revocation.

## 1.3.10 · 2026-08-01 {#v1-3-10}

- **Fixed**: compatibility with HyperOS / Qualcomm mangle hooks; event-driven IPv6 leak prevention.

## 1.3.9 · 2026-07-29 {#v1-3-9}

- **New**: WireGuard finalMask support.
- **Improved**: Xray logs are shown in the local time zone; easier-to-grab log scrollbar.
- **Fixed**: the group tab follows the selected server on restore; strategy groups are kept on subscription update.
- **Core**: Xray updated to v26.7.28.

## 1.3.8 · 2026-07-20 {#v1-3-8}

- **New**: HWID and Mihomo Age decryption for subscriptions.
- **Improved**: new code editor and runtime UX fixes.
- **Fixed**: resource files that never downloaded; default outbound ordering; status bar icons and splash screen follow theme changes.

## 1.3.7 · 2026-07-13 {#v1-3-7}

- **New**: deletion confirmation setting.
- **Fixed**: IPv6 connected UDP and downlink backpressure.
- **Core**: Xray updated to v26.7.11.

## 1.3.6 · 2026-07-11 {#v1-3-6}

- **Fixed**: several IPv6 and UDP issues in BPF2SOCKS mode; Android's IPv6 tc offload is disabled for ROOT hotspot modes.
- **Fixed**: list changes are no longer lost after rapid saves.

## 1.3.5 · 2026-07-05 {#v1-3-5}

- **New**: broadcast control for the proxy service.
- **New**: update action for individual resource files.
- **Fixed**: selections for uninstalled apps are pruned on refresh; database journaling is backup-safe.

## 1.3.4 · 2026-07-02 {#v1-3-4}

- **New**: BPF2SOCKS (ROOT) run mode.
- **New**: proxy traffic statistics notification.
- **New**: Russian interface.
- **Core**: Xray updated to v26.6.27.

## 1.3.3 · 2026-06-27 {#v1-3-3}

- **New**: optional Hev TUN for the VPN Service.
- **New**: clipboard import / export for routing rules and app lists.

## 1.3.2 · 2026-06-23 {#v1-3-2}

- **New**: per-group subscription update action.
- **New**: eBPF matcher and direct CIDR resources.
- **Improved**: HTTP subscription URLs are allowed with a warning.
- **Fixed**: ROOT modes respect the local DNS setting; hosts and transport aliases in share links are normalized.
- **Core**: Xray updated to v26.6.22.

## 1.3.1 · 2026-06-14 {#v1-3-1}

- **New**: option to disable system IPv6 to prevent WebRTC leaks.
- **Fixed**: `ext:` routing resources are validated before startup.

## 1.3.0 · 2026-06-12 {#v1-3-0}

- **New**: user data backup and restore.
- **New**: copy options on server cards; delete all servers.
- **Improved**: Mihomo transport import compatibility; mKCP seed maps to Xray finalmask.

## 1.2.4 · 2026-06-09 {#v1-2-4}

- **New**: RunetFreedom GEO update source.
- **Fixed**: the selected server can be deleted; deleting an inactive server no longer stops the proxy; background operations survive page changes.

## 1.2.3 · 2026-06-04 {#v1-2-3}

- **Improved**: adding a duplicate subscription URL updates the existing subscription; imports reuse an empty default group.
- **Fixed**: updates use a direct connection when the proxy is stopped.

## 1.2.2 · 2026-06-03 {#v1-2-2}

- **New**: Monet background for the app icon.
- **Core**: AndroidLibXrayLite updated to v26.6.2.

## 1.2.1 · 2026-06-01 {#v1-2-1}

- **Improved**: dynamic theme colors match Android defaults.
- **Core**: Xray updated to v26.6.1.

## 1.2.0 · 2026-05-31 {#v1-2-0}

- **New**: TUN2SOCKS (ROOT) run mode, with a unified ROOT runtime.
- **Fixed**: in-app dialogs follow the app language setting.

## 1.1.1 · 2026-05-30 {#v1-1-1}

- **Improved**: page interactions and the order of the inbound proxy summary.
- **Fixed**: interface selection sheet state; temp file collisions when restoring bundled resources concurrently.

## 1.1.0 · 2026-05-29 {#v1-1-0}

- **New**: Custom servers that use Xray JSON directly.
- **New**: Mihomo YAML import; one-tap import links for v2rayNG, Mihomo, Clash.Meta, and FlClashX.
- **New**: improved resource management with custom GEO update sources.
- **Improved**: subscription User-Agent settings, shown only when a subscription URL is set.

## 1.0.0 · 2026-05-26 {#v1-0-0}

The first stable release of AsteriskNG.

- **New**: default outbound tag setting; lists can be sorted by test results.
- **New**: logs for the TPROXY bootstrap script.
- **Improved**: real connection tests run 8 at a time.
- **Fixed**: the floating toolbar covering card actions; latency result display; the boot-completed check.
