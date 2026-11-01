---
title: AsteriskMETA
description: AsteriskMETA (Mihomo / Meow) guide — profiles and subscriptions, proxy groups, providers, override scripts, raw profiles, automatic switching, and monitoring.
---

# AsteriskMETA

AsteriskMETA is a client built on the **Mihomo** (Clash Meta) or **Meow** core and centered on profiles: once you import a Clash / Mihomo YAML subscription, its proxy groups, rules, and providers take effect as-is. To adjust things, use the app's settings or a JavaScript override script instead of editing the subscription itself.

The bottom navigation has four tabs: **Home**, **Proxies**, **Profiles**, and **Settings**.

## Core editions {#core-editions}

| | Mihomo edition | Meow edition |
| --- | --- | --- |
| APK file name | Without `-meow` | With `-meow` |
| Run modes | VPN Service, TPROXY, TUN, TUN2SOCKS, BPF2SOCKS | Same, but **no TUN (ROOT)** |

Both editions share a package name: install one over the other to switch; your data is kept. If you switch to the Meow edition while using TUN (ROOT), the run mode is reset to VPN Service and start on boot is turned off.

## Home {#home}

- **Start service** / **Stop service**, plus uptime, the current profile, and the current proxy.
- **Proxy mode**: **Rule** (route by the profile's rules), **Global** (everything through the proxy selected in the `GLOBAL` group), **Direct**. This maps to Mihomo's `mode` field and is written by the app when you switch, so the subscription does not change.
- **Subscription**: when the subscription reports usage, shows used, remaining, total, and expiry.
- Four monitor cards — tap one for details:

| Card | Shows |
| --- | --- |
| **Traffic** | Today's total, this session's total, a 5-minute trend, and 7- / 30-day statistics. Traffic history is stored only in the app's private storage |
| **Connections** | Active and closed connections; search and sort by rate / start time / target. Details show the matched rule, proxy chain, and source process. Close one or all connections |
| **Resource** | CPU and memory usage of the core process, with peaks |
| **Network** | Local IPv4 / IPv6, default gateway, DNS servers, plus the public egress address and Cloudflare colo location |

::: info Privacy of the network status page
When you open or refresh the network status page, the app sends one address lookup to each probe service. The requests contain no subscription, profile, device identifier, or account data, and results are kept in memory only.
:::

## Profiles

### Adding a profile

On the **Profiles** page tap **Add profile**:

- **URL**: add a remote subscription and sync it immediately;
- **File**: import a local Mihomo YAML file;
- **QR code**: scan a `clash://` or `clashmeta://` import QR code.

Options for URL profiles:

| Field | Notes |
| --- | --- |
| **Name** | If left empty, named automatically after the first sync |
| **Update interval (hours)** | Automatic update period |
| **Update via proxy** | Download the subscription through the current proxy |
| **User-Agent** | The User-Agent sent when fetching the subscription; can be customized |
| **HWID** | Reports a device identifier to providers that limit devices; you'll be told if it is rejected or the limit is reached |
| **Age secret key** | Decrypts Age-encrypted subscriptions |

When saving, the app downloads, decrypts, and verifies the profile in turn. If any stage fails you can **Retry**, **Save anyway** (keep the temporarily unusable profile), or cancel and keep editing.

### Managing profiles

Each profile's menu offers **Sync**, **Preview** (the final YAML that will be used), edit, and delete. **Update all subscriptions** in the page menu updates every remote profile in turn.

- **Sync providers**: updates the profile's remote `proxy-providers`.
- **Provider usage**: when a profile has providers, expand it to see each provider's usage and expiry (requires the proxy to be running).

If you change the profile that is currently running, the app shows **Changes not applied yet**; tap **Apply now** to have the running service use the new configuration.

### Override scripts and raw profiles

When editing a profile, you can pick an **Override script** or turn on **Disable all overrides**:

- **Override script**: transforms the profile with JavaScript before the service starts.
- **Disable all overrides** (**Raw profile**): loads the YAML exactly as-is; neither app settings nor override scripts apply. The corresponding settings are shown read-only as **From YAML**. If required fields such as ports are missing the service may fail to start; the app shows a configuration check result.

For which fields the app manages, the script API with examples, and what a raw profile must contain, see [Mihomo configuration](./core-mihomo).

## Override scripts

**Settings → Advanced settings → Override script** manages all scripts: create, edit, duplicate, and delete. The editor can **Format JavaScript**.

Tap **Debug** and choose a **Temporary test profile** to run a script and see:

- **Output YAML**: the full profile after the script runs;
- **Console**: anything the script prints with `console`;
- **Summary**: how the number of proxies, policy groups, and rules changed.

Use **Copy report** to share the result when troubleshooting. Scripts must define a synchronous `main(config)` function; see [Mihomo configuration · Override scripts](./core-mihomo#script) for the API and examples.

## Proxies

The **Proxies** page shows the profile's policy groups; tap a proxy to switch (only manually selectable groups can be switched).

- **Test group**: test the latency of every proxy in a group.
- **Locate current proxy**, **Search proxies**.
- **Proxy display options**: group layout (**Expandable list** / **Top tabs**), proxy layout (auto / single / double / multiple columns), sort (default / delay / name), and **Interrupt connections** when switching.
- Open **Providers** from the top-right to see **Proxy Providers** and **Rule Providers**, refresh one or all, and preview rule set contents.

::: details Core implementation
Policy groups come from the profile's `proxy-groups`. Common types: `select` (manual, switchable on this page), `url-test` (automatically picks the lowest latency), `fallback` (picks the first available in order), and `load-balance`. Automatic groups are probed by the core using the group's `url` and `interval`, and the core decides the current proxy itself, so they cannot be switched manually here.

**Test group** uses the group's own test URL, or the test URL from **Connection test** if the group has none. With **Unified delay** (`unified-delay`) on, the core measures a second request on the established connection to exclude handshake time, which makes latencies across protocols more comparable.
:::

## Settings

### General

| Setting | Notes |
| --- | --- |
| **Resource management** | See [Common features · Resource management](./common#resources) |
| **DNS settings** | With **Override DNS** on, replaces the profile's `dns` block with the app's settings: enhanced mode, Fake IP range and filter, default nameserver, nameserver, fallback and fallback filter, nameserver policy, proxy server nameserver, prefer HTTP/3, respect rules, hosts, and more |
| **Sniffer** | Detects HTTP / TLS / QUIC target domains; set per-protocol ports, whether to override the destination, and domains / addresses to force or skip |
| **Geodata mode** / **Geodata loader** | Use geodata files for GeoIP rules; `memconservative` uses less memory but loads more slowly |
| **Proxy app list** | See [Common features · Per-app proxy](./common#per-app-proxy) |
| **Connection test** | Test URL (used when a group does not specify one), test timeout, test concurrency, **Unified delay** |
| **Automatic switching** | See below |
| **Log level** | Verbosity of the core log |

::: details Core implementation: DNS enhanced mode
Mihomo's `dns.enhanced-mode` has two values:

- `fake-ip`: domains resolve to virtual addresses from the **Fake IP range**, and the core maps them back to domains when connecting. Rules can match by domain, and resolution does not wait for the real answer. Domains in the **Fake IP filter** get real addresses — useful for LAN devices, NTP, game matchmaking, and other cases that need a real IP.
- `redir-host`: returns real answers; more compatible, but domain-based routing relies on sniffing.

With **Override DNS** off and an enabled `dns` block in the profile, the profile wins; see [Mihomo configuration · DNS merge rules](./core-mihomo#dns).
:::

### Advanced settings

**Broadcast control**, IPv6 and **IPv6 preferred**, **Override script**.

## Automatic switching {#auto-switch}

**Settings → General → Automatic switching** lets the core periodically check the current proxy of selected policy groups while the service is running, and switch to a working proxy when it fails. The app itself does not need to stay in the background.

| Setting | Notes |
| --- | --- |
| **Enable automatic switching** | Master switch |
| **Monitored policy groups** | Pick at least one **manual select group**; only directly selected proxies are monitored. Re-select after switching profiles |
| **Preferred regions** / **Custom preferred proxy name keywords** | Prefer proxies from these regions; regions are recognized from flags, region names, and abbreviations in proxy names |
| **Consecutive failures to trigger** | Default 1, range 1–10 |
| **Check interval** | Default 30 s, range 10–3600 s |
| **Expected delay** | Default 300 ms; switches to the first working proxy below this value. Set 0 to test all proxies and pick the fastest |
| **Switch back** | Switch back after the original proxy passes 3 consecutive checks |

Checks use the test URL, timeout, and concurrency from **Connection test**. No switch happens while the current proxy is healthy or if you changed the selection manually; if every candidate fails, the original selection is kept. **Switching history** shows the next check time, each group's status, and recent events.

::: warning
- Automatic switching requires the built-in core; uploaded custom cores do not support it.
- With a raw profile, the core follows the `asterisk-auto-switch` field in the YAML; the in-app settings are saved but not applied. See [Mihomo configuration · asterisk-auto-switch](./core-mihomo#auto-switch-field) for the field format.
:::
