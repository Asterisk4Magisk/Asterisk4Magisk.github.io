---
title: Mihomo configuration (AsteriskMETA)
description: How AsteriskMETA processes Mihomo YAML — the pipeline, fields managed by the app, DNS merge rules, the override script API with examples, raw profile requirements, and the asterisk-auto-switch field.
---

# Mihomo configuration (AsteriskMETA)

AsteriskMETA starts from the Mihomo (Clash Meta) YAML you import, makes a few necessary changes before startup, and then hands it to the core. This page explains which fields are rewritten, how override scripts work, and what a raw profile must contain.

## Pipeline

```text
Subscription / file YAML
   │
   ├─ ① Rule override (if the profile has one enabled)
   │
   ├─ ② Override script main(config) (if the profile has one)
   │
   ├─ ③ App-managed fields: ports, inbounds, API, mode, DNS, sniffer, …
   │
   └─ ④ Run by the core
```

With **Disable all overrides** (raw profile) on, steps ①, ②, and ③ are skipped and the YAML is passed to the core as-is.

::: tip Rule override first, then the script, then managed fields
The [rule override](./meta#rule-override) runs first, so the script sees the overridden rules. The override script runs **before** the app-managed fields are applied. Changes the script makes to the managed fields below are overwritten by the app; for every other field (`proxies`, `proxy-groups`, `rules`, `proxy-providers`, `rule-providers`, and so on) the script's output wins.
:::

## Fields managed by the app {#managed}

| Field | Value written by the app |
| --- | --- |
| `mixed-port`, `socks-port`, `listeners`, `tun`, and other inbounds | Determined by the run mode and **Local proxy settings**. Unneeded inbounds are zeroed or cleared; TPROXY and TUN (ROOT) modes are generated through `listeners` |
| `authentication` | **Local proxy username / password** |
| `allow-lan`, `bind-address` | LAN access is allowed when **Listen on all network interfaces** or root tethering sharing is on |
| `external-controller`, `secret`, … | The API address and secret used internally by Home, Proxies, connection monitoring, and other features. In ROOT modes, **Other → External control** can fix the port, set the secret, listen on all interfaces, and configure CORS |
| `external-ui`, `external-ui-name`, `external-ui-url` | Written when **Override external UI** is on |
| `find-process-mode` | **Find process mode**; **Follow profile** keeps the profile's value |
| `mode` | **Rule / Global / Direct** on Home, i.e. `rule` / `global` / `direct` |
| `unified-delay` | **Connection test → Unified delay** |
| `log-level` | **Log level** |
| `geodata-mode`, `geodata-loader`, `geox-url` | **Geodata mode** and **Geodata loader** under **Other**, and the resource **Update source** |
| `ipv6` | The IPv6 switch |
| `sniffer` | **Sniffer** settings; with **Override sniffer** off the profile's block is kept as written |
| `asterisk-auto-switch` | **Automatic switching** settings (see below) |
| `dns`, `hosts` | See "DNS merge rules" below |

## DNS merge rules {#dns}

- If **Override DNS** is on, or the profile's `dns.enable` is not `true`: the `dns` block generated from the app's **DNS settings** is used.
- Otherwise the profile's own `dns` block is kept.
- Entries from the app's **DNS hosts** are merged with the profile's `hosts`.
- When the run mode needs DNS hijacking, the app adds the corresponding `dns-hijack` settings.

## Override scripts {#script}

An override script is JavaScript that must define a synchronous `main(config)` function:

- `config` is a JavaScript object converted from the YAML, with the same key names (e.g. `config['proxy-groups']`). If the profile has no `proxy-providers`, an empty object is added first.
- Return the modified object; if you return `undefined` or `null`, the `config` you mutated in place is used.
- The return value must be an object; it is converted back to YAML.
- Scripts run in the built-in QuickJS engine, with no network or file access and no async support (`async` / Promise).
- `console` is only provided while **debugging**. It is not guaranteed to exist during a normal start; if you keep logging statements, check `typeof console !== 'undefined'` first.

### Example: add a direct rule at the top

```js
function main(config) {
  config.rules = config.rules || []
  config.rules.unshift('DOMAIN-SUFFIX,example.com,DIRECT')
  return config
}
```

### Example: add an auto-testing group for Hong Kong proxies

```js
function main(config) {
  const names = (config.proxies || [])
    .map((proxy) => proxy.name)
    .filter((name) => /香港|HK|Hong Kong/i.test(name))
  if (names.length === 0) return config

  config['proxy-groups'] = config['proxy-groups'] || []
  config['proxy-groups'].unshift({
    name: 'HK Auto',
    type: 'url-test',
    proxies: names,
    url: 'https://www.gstatic.com/generate_204',
    interval: 300,
  })
  return config
}
```

A new group only carries traffic once a rule or another `select` group references it. Use **Override scripts → Debug** to check the **Final YAML** and **Summary**, and confirm the changes in proxy, group, and rule counts are what you expect.

## Raw profiles {#raw}

With **Disable all overrides** on, the app no longer rewrites the YAML, so the YAML itself must provide the inbounds needed by the current run mode. The edit page shows a configuration check result:

| Run mode | Required | If missing |
| --- | --- | --- |
| TPROXY | `tproxy-port` | Cannot start |
| TUN (ROOT) | One compatible TUN inbound | Cannot start |
| TUN2SOCKS, BPF2SOCKS | A SOCKS or Mixed inbound | Cannot start |
| VPN Service (with Hev TUN) | A SOCKS or Mixed inbound | Cannot start |
| Other modes | A SOCKS or Mixed inbound is recommended | Local proxy features are unavailable |

Also:

- Without `external-controller`, features that rely on the API — Home monitors, switching proxies, and so on — are unavailable.
- If DNS hijacking is needed, the YAML must contain DNS rules that apply to both TCP and UDP port 53; otherwise DNS hijacking is not installed.

## asterisk-auto-switch {#auto-switch-field}

**Automatic switching** is handed to the core through the top-level `asterisk-auto-switch` field. It is read by AsteriskMETA's built-in core; upstream Mihomo ignores it. Normally the app writes it from your settings; with a raw profile you can write it in the YAML yourself:

```yaml
asterisk-auto-switch:
  enable: true
  groups: [Proxy]               # manual select groups to monitor
  preferred-filter: '(?i)(?:HK|Hong Kong)'  # regex for preferred proxy names (regexp2 syntax)
  failure-threshold: 1          # consecutive failures before switching
  expected-delay: 300           # expected delay (ms); 0 tests all and picks the fastest
  restore: false                # switch back once the original proxy recovers
  interval: 30                  # check interval (seconds)
  url: https://www.gstatic.com/generate_204
  timeout: 5000                 # per-check timeout (ms)
  concurrency: 10               # check concurrency
```

## About the Meow edition

Meow is another core implementation that is compatible with the Mihomo configuration format, and AsteriskMETA uses the same pipeline for both. Support for individual fields or protocols may differ; refer to the Meow project documentation.

## Official documentation

- [Mihomo docs](https://wiki.metacubex.one/): [configuration](https://wiki.metacubex.one/config/) · [DNS](https://wiki.metacubex.one/config/dns/) · [proxy groups](https://wiki.metacubex.one/config/proxy-groups/) · [rules](https://wiki.metacubex.one/config/rules/) · [sniffer](https://wiki.metacubex.one/config/sniff/)
- [Mihomo on GitHub](https://github.com/MetaCubeX/mihomo)
- [Meow on GitHub](https://github.com/meow-rs/meow-rs)
