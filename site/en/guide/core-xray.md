---
title: Xray configuration (AsteriskNG)
description: How AsteriskNG generates its Xray configuration — reserved tags, inbounds per run mode, how servers map to outbounds, routing rule syntax, and how Custom servers are rewritten.
---

# Xray configuration (AsteriskNG)

AsteriskNG does not ask you to edit a full Xray config file. Instead, it **generates an Xray JSON configuration on every start** from the servers, routing rules, and settings in the UI. Knowing how that works helps you write correct routing rules, or use your own Xray config in a **Custom** server.

## Structure of the generated config

| Xray field | Source |
| --- | --- |
| `log` | **Log level**, **Record access logs** |
| `inbounds` | The current run mode and **Local proxy settings** (see below) |
| `outbounds` | The selected server / strategy group / proxy chain, plus the fixed `direct`, `block`, and similar outbounds |
| `routing` | Rules on the **Routing** page, the **Default outbound proxy tag**, and the **Domain strategy** |
| `dns`, `fakeDns` | **Core settings → DNS settings** |
| `observatory`, `burstObservatory` | Generated automatically for "Least ping" and "Least Load" strategy groups |
| `stats`, `api`, `policy` | Added when **Show traffic statistics** is on, for traffic statistics |

## Reserved tags {#tags}

These tags are reserved by the app and can be referenced from routing rules or Custom configs:

| Tag | Kind | Notes |
| --- | --- | --- |
| `proxy` | Outbound | The currently selected server |
| `direct` | Outbound | `freedom` direct connection |
| `block` | Outbound | `blackhole` |
| `dns-out` | Outbound | DNS outbound used for DNS hijacking |
| `fragment` | Outbound | `freedom` fragment outbound when **Fragment** is on |
| `dns-proxy` / `dns-direct` | Internal | Tags used for proxy DNS / direct DNS queries |

## Inbounds and run modes

| Inbound tag | When present |
| --- | --- |
| `vpn-tun-in` | VPN Service mode without **Use Hev TUN** (an Xray `tun` inbound); with Hev TUN, traffic reaches `socks-in` through `hev-socks5-tunnel` instead |
| `socks-in` | The local proxy from **Local proxy settings** |
| `vpn-http-in` | VPN Service with **Append HTTP proxy** |
| `tproxy-in` | TPROXY mode |
| `tun2socks-in` | TUN2SOCKS mode |
| `bpf2socks-in` | BPF2SOCKS mode |

With DNS hijacking on, the app inserts a rule before the rules from the **Routing** page that sends TCP / UDP traffic to port 53 from the traffic-entry inbound (e.g. `vpn-tun-in`, or `socks-in` with Hev TUN) to `dns-out`.

## How servers become outbounds {#outbounds}

| In the UI | Generated Xray config |
| --- | --- |
| Regular server (VLESS, VMess, Trojan, …) | One `outbound` of that protocol; `streamSettings` comes from the transport and security settings |
| **Strategy group** | A balancer in `routing.balancers`. `strategy.type` maps **Least ping** → `leastPing`, **Least Load** → `leastLoad`, **Random** → `random`, **Round robin** → `roundRobin`. `leastPing` adds an `observatory` and `leastLoad` adds a `burstObservatory` for probing |
| **Proxy chain** | One outbound per member; each later hop dials through the previous one via `streamSettings.sockopt.dialerProxy` |
| **Fragment** | The server's `sockopt.dialerProxy` points to the `fragment` outbound, whose `freedom` `fragment` option splits early TCP data by **Fragment mode**, length, and interval |
| **Mux** | The outbound's `mux` field (`concurrency`, `xudpConcurrency`, `xudpProxyUDP443`) |

## Writing routing rules {#routing-rules}

Each rule on the **Routing** page becomes one entry in `routing.rules`. Rules are matched top to bottom; the first match wins.

**Domain rules** support all Xray forms:

| Form | Meaning |
| --- | --- |
| `example.com` | Substring match |
| `domain:example.com` | The domain and its subdomains |
| `full:www.example.com` | Exact match |
| `keyword:google` | Keyword match |
| `regexp:\.cn$` | Regular expression |
| `geosite:cn` | A category from `geosite.dat` |
| `ext:file.dat:tag` | A category from a custom dat file in the resource directory |

**IP rules** accept single IPs, CIDRs (e.g. `10.0.0.0/8`), `geoip:cn`, `geoip:private`, and so on, as well as `ext:file.dat:tag`.

::: tip Custom rule files
A `.dat` file downloaded with **Add custom resource file** in **Resource management** can be referenced with `ext:`. Before starting, the app checks that every file referenced with `ext:` in the **Domain rules** of enabled rules exists and is not empty, and reports an error instead of letting the core silently ignore it.
:::

## Custom servers {#custom}

A **Custom** server lets you paste Xray JSON directly. It must be a JSON object with at least one entry in `outbounds`.

### With "Override inbound and DNS settings" on (default)

Use this when you want your own outbounds and routing but let the app handle the rest. The app will:

- **replace** `inbounds` with the current run mode's inbounds, and **replace** `dns` and `fakeDns` with the app's DNS settings;
- remove your `direct` and `dns-out` outbounds and use the app's `direct` instead, adding the app's `dns-out` when DNS hijacking is on;
- treat the outbound tagged `proxy` as the main outbound; if there is none, use the first outbound without a reserved tag (and name it `proxy` if it has no tag);
- insert the DNS hijacking and DNS upstream rules **before** your `routing.rules`, keeping your rules in their original order.

### With the override off

The config is passed to the core almost **as-is**; only when **Show traffic statistics** is on are the `stats` / `api` / `policy` needed for traffic statistics added. In this case:

- you must write the inbounds, DNS, and routing yourself, and they must match the current run mode — for example, TPROXY mode needs a transparent `dokodemo-door` inbound listening on the **Transparent proxy port**;
- the app's DNS settings and the rules on the **Routing** page do not apply to this server; per-app proxy is enforced by the VPN / ROOT layer and still applies.

::: warning
Turning the override off is an advanced option. If the config does not match the run mode, the proxy may start but nothing will load. Keep it on in most cases.
:::

## Official documentation

- [Xray configuration](https://xtls.github.io/en/config/) ([简体中文](https://xtls.github.io/config/))
- [routing](https://xtls.github.io/config/routing.html) · [DNS](https://xtls.github.io/config/dns.html) · [outbounds](https://xtls.github.io/config/outbound.html) · [transport](https://xtls.github.io/config/transport.html)
- [observatory](https://xtls.github.io/config/observatory.html) · [FakeDNS](https://xtls.github.io/config/fakedns.html)
- [Xray-core on GitHub](https://github.com/XTLS/Xray-core)
