---
title: AsteriskBOX
description: AsteriskBOX (sing-box) guide — outbound groups and subscriptions, selectors, VPN endpoints, DNS management, routing management, sniffing, override scripts, and tools.
---

# AsteriskBOX

AsteriskBOX is a client built on the **sing-box** core. It splits a sing-box configuration into visual modules — **outbound groups**, **selectors**, **endpoints**, **DNS**, and **routing** — that you manage separately, and the app generates the complete sing-box configuration from them. You can configure everything in the UI, edit JSON directly where it matters, or make final adjustments with an override script.

The bottom navigation has four tabs: **Home**, **Proxies**, **Groups**, and **Settings**.

## How the configuration fits together

| Module | sing-box section | Where to manage it |
| --- | --- | --- |
| Groups and outbounds (servers) | `outbounds` | **Groups** tab, **Settings → Outbound management** |
| Selectors (Selector / URLTest) | selector / urltest in `outbounds` | **Settings → Selector management**; switch on the **Proxies** tab |
| Endpoints (WireGuard, Tailscale, …) | `endpoints` | **Settings → Endpoint management** |
| DNS servers and rules | `dns` | **Settings → DNS management** |
| Routing rules | `route` | **Settings → Routing management** |
| Override script (optional) | Final changes to the generated result | **Settings → Advanced settings → Override script** |

- A selector can be "managed", so its members follow an outbound group automatically; or you can freely combine outbounds from several groups.
- Routing and DNS rules can reference outbounds, selectors, or endpoints.
- See the full generated configuration in **Settings → Tools → Configuration preview**.

## Home

- **Start service** / **Stop service**, service status and uptime, plus today's traffic and live speed.
- **Proxy mode**: **Rule** / **Global** / **Direct**.
- The same **Traffic**, **Connections**, **Resource**, and **Network** monitor cards as AsteriskMETA; see [AsteriskMETA · Home](./meta#home).

## Groups and outbounds

### Adding a group

On the **Groups** page tap **Add group**:

- **Enter manually**: enter a remote subscription URL, or leave the URL empty to create a **Local group**;
- **File**: import a local sing-box JSON, Mihomo YAML, or share-link file;
- **QR code**: scan a subscription link QR code and sync immediately.

| Field | Notes |
| --- | --- |
| **Name** | If left empty, named automatically after the first sync |
| **Subscription URL (optional)** | Leave empty for a local group. You'll be advised to use HTTPS instead of HTTP |
| **Update interval (hours, optional)** | Automatic update period |
| **Update through the running proxy** | Download the subscription through the proxy |
| **User-Agent** | sing-box, Clash Meta, v2rayNG, or custom |
| **HWID**, **Mihomo Age secret key** | Device identifier reporting and Age decryption |
| **Strict import** | If any entry in the subscription is invalid, keep the existing servers instead of updating |
| **Pre-proxy** | A detour (relay) outbound for all outbounds in the group |

**Update all group subscriptions** downloads, decrypts, parses, validates, and saves each subscription in turn, then shows how many entries were imported / skipped / duplicated, and why any failed. Group cards show the subscription's used traffic, total, and expiry.

### Outbounds

Inside a group you can **Import outbound** (**Scan QR code**, **Import file**, clipboard) or **Add outbound** manually. Supported protocols:

SOCKS, HTTP, NaiveProxy, Shadowsocks, VMess, Trojan, Hysteria, Hysteria 2, VLESS, ShadowTLS, TUIC, AnyTLS, Snell, SSH.

The outbound editor follows sing-box's structure: **Server**, **Protocol**, **TLS** (including uTLS and Reality), **V2Ray transport** (HTTP, WebSocket, QUIC, gRPC, HTTPUpgrade), **Multiplex**, **QUIC**, and **Dial** (bind interface, domain resolver, timeouts, and network strategy).

The outbound list menu offers **PING this group**, layout and sort (manual order / remarks / protocol / PING latency), search, copy all server URLs, delete duplicates, and more. An outbound can be shared with **Copy URL**, **Generate QR code**, or **Copy JSON**.

If you change groups or outbounds while the service is running, the app shows **Changes not applied**; tap **Apply now**.

## Proxies

The **Proxies** page lists all selectors; tap a server to switch. The service must be started from Home first.

## Settings · General

### Outbound management / Selector management

- **Outbound management**: import, add, and edit the outbounds of every group in one place.
- **Selector management**: create and edit **Selector** (manual) and **URLTest** (automatic) groups.

URLTest options:

| Option | Notes |
| --- | --- |
| **Selection method** | **Lowest latency** (prefer low-latency servers) or **Failover** (pick the first working server in order) |
| **Maximum acceptable delay** | With failover, prefer servers under this limit; empty or 0 means no limit |
| **Test URL** / **Test interval** | Empty uses the defaults (interval 3m) |
| **Tolerance (ms)** | Only switch when the latency difference exceeds this; default 50ms |
| **Idle timeout** | Pause testing when idle; default 30m |

You can also choose whether existing connections are closed when the selected outbound changes.

### Endpoint management

**Endpoints** are sing-box's VPN-tunnel style outbounds:

| Endpoint type | Use |
| --- | --- |
| **WireGuard** | Layer-3 WireGuard tunnel |
| **Tailscale** | Join this device to a Tailscale network |
| **OpenVPN Client** | Connect with an OpenVPN client configuration |
| **OpenConnect** | Connect to AnyConnect-compatible VPN servers |
| **MASQUE Client** | IP proxying over HTTP (CONNECT-IP) |

Import sing-box endpoint JSON directly, or WireGuard, OpenVPN, and OpenConnect configuration files. For safety, unsafe directives and directives that reference external files are rejected.

### DNS management

**DNS management** maps to sing-box's `dns` section:

- **DNS servers**: UDP / TCP, TLS, HTTPS, HTTP/3, QUIC, local resolver, DHCP, Hosts, mDNS, Resolved, group, and DNS provided by Tailscale / OpenVPN / OpenConnect endpoints.
- **Default DNS server**: handles ordinary DNS queries.
- **Outbound domain resolver**: resolves proxy server and endpoint domains before connecting.
- **DNS rules**: match by domain, query type, response content, and more, with actions **Route**, **Reject**, **Predefined response**, **Evaluate**, and **Respond**.
- **FakeIP** and **Persist FakeIP mappings**; cache options include LRU cache capacity, **Optimistic DNS cache**, **Persist DNS cache**, and more.

### Routing management

**Routing management** maps to sing-box's `route` section:

- **Routing rules**: actions are **Route to outbound** or **Reject connection**; the default outbound is used when no rule matches.
- **Route settings**: auto-detect the default interface, default network strategy and fallback network, find the process owning a connection, and more.
- Rule sets come from the `.srs` / `.json` files in **Resource management**.

### Protocol sniffing

Inserts a sing-box sniff action before the routing rules. Available sniffers: HTTP, TLS, and QUIC (which extract target domains), plus DNS, BitTorrent, DTLS, NTP, RDP, SSH, and STUN (for protocol-based routing). **Sniff timeout** defaults to 300ms.

### Resource management

In addition to what's described in [Common features](./common#resources), AsteriskBOX can:

- search the sing-geoip / sing-geosite catalogs and add rule sets in bulk;
- add custom `.srs` or `.json` rule sets and `.hosts` files (URL optional — local files work too);
- edit files with the built-in **JSON rule set** editor (validated on save) and **Hosts** editor.

### Connection test

Test URL, timeout, concurrency, and more; optionally start timing only after the TCP / TLS handshake completes, so handshake time is excluded.

## Settings · Tools

- **Configuration preview**: view the full sing-box configuration generated by the app, for checking or troubleshooting.
- **Network quality test**: measures upload / download capacity, responsiveness (RPM), and idle latency through the selected outbound using the Apple networkQuality protocol.

## Settings · Advanced

- **Override script**: modify the generated configuration further with JavaScript. Debugging shows the output JSON, console output, and warnings, and can copy a report.
- **Broadcast control**, IPv6 and **IPv6 preferred**.
