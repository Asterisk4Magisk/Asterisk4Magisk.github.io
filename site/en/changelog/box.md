---
title: AsteriskBOX changelog
description: Notable changes in every stable AsteriskBOX release.
---

# AsteriskBOX changelog

This page summarizes the user-facing changes in every stable AsteriskBOX release. For the full commit lists and APKs, see [AsteriskBOX Releases](https://github.com/Asterisk4Magisk/AsteriskBOX/releases).

Dates are GitHub Releases publication dates (UTC).

## 1.1.27 · 2026-11-11 {#v1-1-27}

- **Improved**: a subscription update that changes the outbounds, or a successful resource update, is applied to the running service automatically (an in-place reload in VPN Service mode, a service restart in ROOT modes); manual edits to groups or outbounds still go through the **Changes not applied** prompt. See [AsteriskBOX · Groups and outbounds](../guide/box#groups-and-outbounds).
- **Fixed**: restarting the service no longer swaps the control port for a random one.
- **Fixed**: automatic resource updates in the background check the proxy state first and download through the proxy while it is running.
- **Fixed**: notifications no longer linger after a resource update finishes or is cancelled.
- **Improved**: multi-line text fields scroll horizontally instead of wrapping; compact proxy and outbound cards use at most two title lines; a new Quick Settings tile icon; refined UI text.

## 1.1.26 · 2026-11-05 {#v1-1-26}

- **New**: protocol plugins. With the plugin APKs installed you can use Mieru, ShadowQUIC, and Juicity outbounds, or switch Hysteria2 / NaiveProxy to their plugin implementations. See [AsteriskBOX · Protocol plugins](../guide/box#plugins).
- **New**: on Android 17 the app requests the local network permission at startup.
- **New**: with the top-tab layout and many selectors, tap **Show all proxy groups** to jump to a selector from a sheet.
- **Fixed**: Mieru share links use the official `mierus://` format, and plugin outbound configuration generation is corrected.

## 1.1.25 · 2026-11-03 {#v1-1-25}

- **New**: share and export outbound groups — subscription QR code, copy subscription link, copy every outbound link in the group, or export links to a file. See [AsteriskBOX · Adding a group](../guide/box#adding-a-group).
- **New**: the network activity card on Home is drawn as a dot waveform with an optional two-line style; the resource monitor has separate CPU and memory cards.
- **New**: in ROOT mode, if the device is already on a network matching **Stop when Wi-Fi connects** at boot, start on boot keeps the proxy stopped.
- **Improved**: the Quick Settings tile follows the running state in real time.
- **Fixed**: with a custom core in ROOT mode, import, save, and start are no longer rejected by the built-in core's checks.
- **Fixed**: a crash caused by the default Mihomo provider fetcher.

## 1.1.24 · 2026-11-01 {#v1-1-24}

- **New**: the Proxies page supports the **Expandable list** layout.
- **Improved**: the VPN Service runs in its own process; runtime data refresh and traffic statistics pause in the background and while the screen is off.
- **Improved**: new Hysteria2 outbounds disable Chrome QUIC parroting by default.
- **Fixed**: the ROOT service keeps running after you leave the page; asteriskd updated to v2.2.7 and bpf2socks to v1.2.2.

## 1.1.23 · 2026-10-28 {#v1-1-23}

- **New**: VPN Service mode can start on boot and supports Android's always-on VPN.
- **New**: Hysteria2 Realm URIs; improved subscription imports.
- **Fixed**: selector regex filters match server names only; REALITY compatibility with Xray 26.9.8 and later is restored.
- **Improved**: a clearer "Changes not applied" banner that is simpler to clear.

## 1.1.22 · 2026-10-25 {#v1-1-22}

- **New**: ordered **failover** in URLTest groups.
- **New**: add subscription groups by scanning a QR code; create a group from a local config file; fetch the subscription as soon as a group is saved; retry failed syncs.
- **New**: group cards show sync time and expiry; a warning when outbound changes need a service restart.
- **New**: real-time download speed in the status bar.
- **Improved**: ROOT rules apply much faster; group config changes coordinate with service control and hot-reload in VPN mode.
- **Fixed**: the system IPv6 guard only applies to networks the app can access.
- **Core**: sing-box updated to v1.15.0-alpha.13-reF1nd.

## 1.1.21 · 2026-10-21 {#v1-1-21}

- **Fixed**: AAAA queries are routed to FakeIP.
- **Core**: AndroidLibBoxLite updated to v1.15.0-alpha.11-reF1nd-android.3, with local DNS as the default.

## 1.1.20 · 2026-10-20 {#v1-1-20}

- **New**: pick installed apps for `package_name` conditions in routing rules.
- **New**: dedicated IPv4 FakeIP settings, applied to all apps in ROOT mode.
- **New**: auto-hide navigation bar setting.
- **Fixed**: FakeIP mappings are only persisted when FakeIP is active.

## 1.1.19 · 2026-10-18 {#v1-1-19}

- **New**: a **Privacy** section in settings: hide from recent tasks, screenshot protection, and hide the launcher icon.
- **New**: global connection test settings; the delay test button shows live progress.
- **Fixed**: relaxed readiness probes for core and helper ports.

## 1.1.18 · 2026-10-15 {#v1-1-18}

- **Fixed**: DNS events and restart recovery in the enhancement module; bpf2socks relay, hotspot, and idle wake-up issues.

## 1.1.17 · 2026-10-13 {#v1-1-17}

- **Fixed**: DNS and netd issues in the enhancement module.
- **Improved**: simpler outbound group cards; improved module installation dialog.

## 1.1.16 · 2026-10-13 {#v1-1-16}

- **New**: app list and DNS enhancements (requires the enhancement module).
- **Fixed**: unused fields are cleared when switching DNS and routing rule types; statistics notification sessions are isolated and handle startup failures.

## 1.1.14 · 2026-10-09 {#v1-1-14}

- **New**: a toggle to bypass private addresses in eBPF mode.
- **New**: dual-stack public egress probing, including through the proxy; locate the current server on the Proxies page; the navigation bar hides while scrolling.
- **Fixed**: network monitoring bypasses the local proxy when the service is stopped; private address ranges bypassed in ROOT modes.
- **Core**: sing-box updated to v1.15.0-alpha.11-reF1nd.

## 1.1.13 · 2026-10-06 {#v1-1-13}

- **New**: config validation warnings in override script debugging; copy from the config preview.
- **Improved**: unified page search with animated search bars; the service button sits beside the floating navigation bar.
- **Fixed**: override scripts are skipped when validating settings; subscription updates use the local proxy first and fall back to a direct connection.
- **Core**: sing-box updated to v1.15.0-alpha.10-reF1nd.

## 1.1.12 · 2026-09-29 {#v1-1-12}

- **New**: bulk copy and delete in the outbound management menu.
- **Fixed**: outbound IDs are kept across subscription updates; duplicate outbound imports are allowed; policy chain display order; Rule mode uses `route.final`.
- **Core**: sing-box updated to v1.15.0-alpha.9-reF1nd.

## 1.1.11 · 2026-09-27 {#v1-1-11}

- **New**: override scripts and configuration preview. See [sing-box configuration](../guide/core-singbox).
- **New**: group-level pre-proxy (detour).
- **New**: editable hosts files for DNS servers; `dns_server_address` and `dns_search_domain` in routing and DNS rules.
- **New**: lightweight automatic pause and resume; lock / unlock service control on Android 13 and later.
- **Fixed**: longer ROOT connection retries; the UI updates immediately after changing the language.

## 1.1.10 · 2026-09-24 {#v1-1-10}

- **Fixed**: no false DNS reference warnings when restoring a backup; asteriskd honors the configured runtime paths.
- **Core**: sing-box updated to v1.15.0-alpha.8-reF1nd.

## 1.1.9 · 2026-09-18 {#v1-1-9}

- **New**: network quality test (Apple networkQuality).
- **New**: subscription deep links; groups are named from the subscription and show its traffic.
- **New**: automatic resource updates; broadcast commands for subscription and resource updates.
- **New**: "Scan Chinese apps" in the per-app proxy menu; a ROOT startup failure diagnostic dialog.
- **Improved**: latency colors and thresholds, settings icons, and refreshed accent colors.
- **Core**: sing-box updated to v1.15.0-alpha.6-reF1nd.

## 1.1.8 · 2026-09-13 {#v1-1-8}

- **New**: eBPF data plane and DNS mode options.
- **New**: the connection monitor keeps disconnected connections for the session.
- **Fixed**: early data is parsed from WebSocket paths.
- **Improved**: refreshed top bars, floating navigation, and card styles; outbound management is available while the service is stopped.
- **Core**: sing-box updated to v1.15.0-alpha.3-reF1nd.

## 1.1.7 · 2026-09-05 {#v1-1-7}

- **New**: complete sing-box outbound options.
- **Improved**: `auto_redirect` in TUN mode uses core-managed routing.

## 1.1.6 · 2026-08-31 {#v1-1-6}

- **New**: traffic statistics in ROOT modes.
- **Fixed**: cleanup after the VPN permission is revoked.
- **Core**: sing-box updated to v1.14.0-reF1nd.

## 1.1.5 · 2026-08-30 {#v1-1-5}

- **Fixed**: IKE and NAT-T traffic is bypassed so Wi-Fi Calling keeps working; service control no longer depends on `awk`.
- **Fixed**: IPv6 DNS hijacking in bpf2socks.
- **Core**: sing-box updated to v1.14.0-rc.4-reF1nd.

## 1.1.4 · 2026-08-26 {#v1-1-4}

- **Fixed**: IPv6 DNS paths enabled across ROOT modes.
- **Improved**: outbound credential fields are shown as plain text for easier checking.
- **Core**: sing-box updated to v1.14.0-rc.1-reF1nd.

## 1.1.3 · 2026-08-23 {#v1-1-3}

- **Improved**: service logs are cleaned up on launch; smoother page and form animations.

## 1.1.2 · 2026-08-18 {#v1-1-2}

- **Fixed**: switching the proxy mode restarts the ROOT service correctly and keeps the VPN service running; restarts wait for the supervisor socket to be released.
- **Core**: sing-box updated to v1.14.0-beta.17-reF1nd.

## 1.1.1 · 2026-08-17 {#v1-1-1}

- **Improved**: the ROOT runtime is managed by asteriskd, making boot configuration and service startup more reliable.
- **Fixed**: ROOT runtime probes no longer run in VPN mode; custom core replacement is restored.

## 1.0.10 · 2026-08-10 {#v1-0-10}

- **New**: drag reordering in custom selectors.
- **Fixed**: URLTest groups can no longer be switched manually.
- **Core**: sing-box updated to v1.14.0-beta.13-reF1nd.

## 1.0.9 · 2026-08-09 {#v1-0-9}

- **New**: logical rule groups.
- **Fixed**: VLESS and VMess UUIDs are no longer decoded as Base64; routing rules are validated.
- **Core**: sing-box updated to v1.14.0-beta.12-reF1nd.

## 1.0.8 · 2026-08-08 {#v1-0-8}

- **New**: delay tests for a single outbound.
- **Fixed**: daily traffic accounting.
- **Core**: sing-box updated to v1.14.0-beta.10-reF1nd.

## 1.0.7 · 2026-08-07 {#v1-0-7}

- **Fixed**: compatibility with HevTUN 2.17; local address bypass rule order.
- **Core**: sing-box updated to v1.14.0-beta.9-reF1nd.

## 1.0.6 · 2026-08-06 {#v1-0-6}

- **Fixed**: OpenVPN configurations with legacy ciphers can be imported.

## 1.0.5 · 2026-08-06 {#v1-0-5}

- **New**: FakeIP and DNS cache persistence options; DNS group server type.
- **New**: Hysteria2 option to disable Chrome parroting; AnyTLS client metadata.
- **New**: regex search with select all matches.
- **Improved**: VPN config import compatibility.
- **Core**: sing-box updated to v1.14.0-beta.7-reF1nd.

## 1.0.4 · 2026-08-04 {#v1-0-4}

- **Fixed**: Base64 subscriptions and common aliases; group delay tests keep running in the background.
- **Improved**: clearer descriptions for selectors, the resource catalog, and DNS / eBPF options.

## 1.0.3 · 2026-08-02 {#v1-0-3}

- **New**: outbound share links and QR codes.
- **New**: app data backup and restore.
- **New**: queued resource file updates, with automatic download after import.
- **Improved**: reorderable group list; consistent editor layouts.
- **Fixed**: `spx` in VLESS Reality share links; VPN status syncs after revocation.

## 1.0.2 · 2026-08-01 {#v1-0-2}

- **New**: eBPF (ROOT) run mode.
- **Fixed**: compatibility with HyperOS / Qualcomm mangle hooks; event-driven IPv6 leak prevention.
- **Core**: sing-box updated to v1.14.0-beta.4, with the reF1nd build for the ROOT core.

## 1.0.1 · 2026-07-30 {#v1-0-1}

- **New**: routing settings; DNS settings consolidated into **DNS management**.
- **Improved**: subscription and endpoint import support.
- **Core**: sing-box updated to v1.14.0-beta.3.

## 1.0.0 · 2026-07-28 {#v1-0-0}

The first stable release of AsteriskBOX.

- **New**: NaiveProxy outbounds; the global selector includes custom selectors.
- **Fixed**: more reliable nested group delay tests with clearer feedback; built-in outbounds are labeled in policy chains.
