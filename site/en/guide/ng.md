---
title: AsteriskNG
description: AsteriskNG (Xray) guide — servers and subscriptions, strategy groups and proxy chains, routing rules, DNS, Mux, and Fragment.
---

# AsteriskNG

AsteriskNG is a client built on the **Xray** core and centered on a server list: every server can be edited and shared individually, then combined through subscription groups, strategy groups, proxy chains, and routing rules.

The bottom navigation has four tabs: **Proxy**, **Routing**, **Apps** (per-app proxy, see [Common features](./common#per-app-proxy)), and **Settings**.

## Subscription groups

Subscriptions are managed in **Settings → General → Group management**. A group can be:

- a **subscription group**: has a subscription URL, and the app fetches servers from it periodically;
- a **manual proxy server group**: no URL, used to hold servers you add yourself.

| Field | Notes |
| --- | --- |
| **Group name** | If left empty, named automatically after the first sync |
| **Subscription URL** | May be empty for manual groups. A warning is shown for plain-HTTP URLs |
| **Auto update interval (hours)** | At least 0.25 hours |
| **User-Agent** | v2rayNG, Clash Meta, or custom; some providers return different formats depending on it |
| **HWID** | Reports a device identifier to providers that limit the number of devices |
| **Mihomo Age secret key** | Decrypts subscriptions encrypted with Age |
| **Update via proxy** | Requests the subscription URL through the local proxy — useful when the URL itself is blocked |

Tap **Update subscriptions** in the overflow menu of the **Proxy** page to update all subscription groups. With multiple groups, enable **Enable "All" group** in settings to show a combined group at the top of the server list.

## Server list

The **Proxy** page lists the servers of the current group. Tap a server to select it, then tap **Start proxy**; tap again while running to **Stop proxy**.

The page's overflow menu offers:

- **Handshake latency test**: measures handshake latency to the server without going through the full proxy path.
- **Real connection test**: sends a real request through the server — a better indicator of whether it actually works.
- **Layout** (single / double / multiple columns) and **Sort** (default / latency / name).
- **Search servers**, **Copy all server URLs**.
- **Delete duplicate proxy servers**, **Delete invalid proxy servers**, **Delete all proxy servers**.
- **Restart service**: apply configuration changes to the running service right away.

Use the buttons / menu on a server card to edit, share, or delete it. Sharing options are **Share URL**, **QR code**, and **Full JSON**.

## Adding servers

Tap the add button and choose **Scan QR code**, **Import from clipboard**, **Import from file**, or **Manual input** for one of these types:

| Type | Notes |
| --- | --- |
| VLESS / VMess / Trojan / Shadowsocks | Common proxy protocols with RAW, XHTTP, WebSocket, gRPC, HTTPUpgrade, mKCP transports and TLS / REALITY |
| Socks / HTTP | Upstream SOCKS5 / HTTP proxies |
| Hysteria2 | Bandwidth settings, port hopping, and salamander obfuscation |
| WireGuard | Keys, local address, MTU, Reserved, and more |
| MASQUE | IP proxying over HTTP, with optional WARP settings |
| Custom | Paste Xray JSON (a full config or outbounds only); optionally **Override inbound and DNS settings** to use AsteriskNG's inbound and DNS instead |
| Strategy group | See below |
| Chain proxy | See below |

The editor validates each field. If some items fail full validation, you can **Return to edit** or **Continue saving** (the configuration may not work).

### Strategy groups

A strategy group picks an outbound automatically from a set of servers:

- **Strategy group type**: **Least ping**, **Least Load**, **Random**, **Round robin**.
- **Subscription group**: where the servers come from — one group or **All groups**.
- **Remarks regex filter**: filter servers by name with a regular expression, e.g. `Hong Kong|HK`.

### Proxy chains

A proxy chain sends traffic through several servers in order (**Proxy chain members**, at least two), for example *relay server → exit server*. The list shows the number of hops.

## Routing rules

The **Routing** page manages Xray routing rules, deciding whether each connection goes to **Proxy**, **Direct**, or **Block**.

Each rule can combine these conditions:

| Condition | Examples |
| --- | --- |
| **Domain rules** | `domain:example.com`, `geosite:cn` |
| **IP rules** | `1.1.1.1`, `10.0.0.0/8`, `geoip:cn` |
| **Port** | `443`, `1000-2000` |
| **Network type** | `tcp`, `udp` |
| **Protocol type** | e.g. `http`, `tls`, `bittorrent` (requires sniffing) |
| **Process rules** | Match by app process |

Besides proxy / direct / block, the **Outbound proxy tag** can point to a specific server or strategy group.

- The menu in the top-right of the title bar sets the **Default outbound proxy tag** (used when no rule matches); the current value is shown under the title.
- **Domain policy** at the top of the list selects the **Domain strategy**.
- Rules are matched top to bottom in list order. Drag to reorder, and toggle individual rules on or off.

Use **Import from clipboard** / **Export to clipboard** to move rules in bulk; when importing, choose to merge or replace.

::: tip geosite / geoip
`geosite:` and `geoip:` rules rely on resource files. Switch between Loyalsoldier, V2Fly, Chocolate4U, RunetFreedom, and other sources in **Settings → General → Resource management**.
:::

## Core settings

### DNS settings

| Setting | Notes |
| --- | --- |
| **FakeDNS** and **FakeDNS pool** | Assigns virtual IPs to domains for faster connections and domain-based routing |
| **Direct DNS** and **Direct DNS domains** | Which domains are resolved by the direct DNS |
| **Use direct DNS to resolve proxy servers** | Resolve the proxy servers' own domains with direct DNS |
| **Proxy DNS** | DNS servers queried through the proxy |
| **DNS hosts** | Static entries, format: `domain:address1,address2` |
| **Resolve proxy server domains** | Write proxy server IPs into DNS hosts |

### Sniffing, Mux, and Fragment

- **Sniffing**: detects HTTP / TLS target domains to assist routing; with **routeOnly** on, sniffed domains are used for routing only and do not rewrite the destination.
- **Mux**: connection multiplexing. Can lower latency but may cause stalls — use with care. Set **TCP concurrency**, **XUDP concurrency**, and **QUIC handling** (multiplex / native / don't proxy) separately.
- **Fragment**: splits early TCP traffic; enable only when needed. Set **Fragment mode**, **Fragment length**, and **Fragment interval**.

### Logs

**Log level** controls how verbose the core log is. With **Record access logs** on, see where each connection went under **Settings → Logs → Access logs**.

## Advanced settings

- **IPv6**: enable IPv6 support; **IPv6 preferred** makes connections prefer IPv6 addresses.
- **Broadcast control**: lets other apps control the service via broadcasts; see [Automation & control](./automation#broadcast).
