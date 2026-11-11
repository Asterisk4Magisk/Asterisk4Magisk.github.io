---
title: Run modes & root
description: How VPN Service, TPROXY, TUN, eBPF, TUN2SOCKS, and BPF2SOCKS differ, plus root-only settings and the enhancement module.
---

# Run modes & root

The run mode decides **how device traffic reaches the proxy core**. Switch it in **Settings → Advanced settings → Run mode**. After switching, a **Proxy settings (mode name)** section appears further down the settings page with the options for that mode.

## At a glance

| Mode | Root | AsteriskNG | AsteriskMETA | AsteriskBOX | How traffic is captured |
| --- | :-: | :-: | :-: | :-: | --- |
| VPN Service | No | ✓ | ✓ | ✓ | Android `VpnService` |
| TPROXY | Yes | ✓ | ✓ | ✓ | iptables + policy routing transparent proxy |
| TUN | Yes | — | ✓ (Mihomo edition only) | ✓ | The core's own TUN inbound with auto-route / auto-redirect |
| eBPF | Yes | — | — | ✓ | sing-box eBPF inbound |
| TUN2SOCKS | Yes | ✓ | ✓ | ✓ | `hev-socks5-tunnel` creates a TUN and feeds the core's SOCKS5 inbound |
| BPF2SOCKS | Yes | ✓ | ✓ | ✓ | `bpf2socks` hijacks traffic and feeds the core's SOCKS5 inbound |

::: tip Which one?
- **No root**: VPN Service is the only option, and it covers almost all everyday use.
- **Rooted**: TPROXY is a good starting point. It does not occupy the system VPN slot, so other VPN apps keep working.
- **eBPF / BPF2SOCKS** depend on the kernel's eBPF support and are generally suited to devices with a **GKI 5.10 or newer** kernel. Older kernels may not work; if they fail to start, use another mode.
:::

## VPN Service (no root)

The app creates a virtual network interface through Android's `VpnService`, and the system routes traffic through it. The VPN permission is requested on first start.

Common options under **Proxy settings (VPN Service)**:

- **Append HTTP proxy** (Android 10 and later): attach a system HTTP proxy to the VPN so apps that support it can use the HTTP proxy directly.
- **Use Hev TUN**: handle the TUN device with `hev-socks5-tunnel`.
- **TUN settings**: MTU, VPN DNS, and IPv4 / IPv6 ranges.

The **Enable DNS hijacking** switch, which lets the core handle DNS requests, is not here but in the DNS settings: **Core settings → DNS settings** in AsteriskNG, and the DNS settings / **DNS management** under **General** in AsteriskMETA / AsteriskBOX.

Every mode has **Local proxy settings**: local proxy port, username, and password. **Dynamic local proxy port** picks a free port on every start; **Listen on all network interfaces** binds to `0.0.0.0` so other devices on your LAN can connect (always set a username and password when you enable it).

::: warning System limitation
Android allows only one VPN app to be connected at a time. Starting this app disconnects any other VPN, and vice versa. If another app has "Always-on VPN" enabled in system settings, turn it off first.
:::

## ROOT modes

In ROOT modes the app gains root through libsu, and the **asteriskd** daemon runs the core as root and maintains the network rules:

- it watches local IPv4 / IPv6 addresses and tethering interfaces and refreshes iptables rules or BPF maps accordingly;
- when the service stops, it cleans up the rules owned by the current mode.

The first time you switch to a ROOT mode, your root manager asks for permission — allow it. If you see **No ROOT access detected!**, check the grant log in your root manager.

### Shared root settings

| Setting | What it does |
| --- | --- |
| **Start on boot** | Generates a `service.d` script so the root solution starts the service at boot |
| **Service control** | Starts or stops automatically by Wi-Fi, lock screen, or schedule; see [Automation & control](./automation#service-control) |
| **Use eBPF matcher** | TPROXY and TUN2SOCKS only. Speeds up matching for large per-app lists and supports address filtering |
| **Bypass direct addresses** | A switch when the eBPF matcher is on or in BPF2SOCKS: matching destinations skip the core, using the China address list by default (adjustable in **Resource management**). In TUN mode (AsteriskMETA / AsteriskBOX) and eBPF mode (AsteriskBOX) it becomes a picker for IP CIDR rule sets instead; see below |
| **Bypass private addresses** | AsteriskBOX eBPF mode only. Private addresses skip the core |
| **Disable system IPv6** | Shown when IPv6 is disabled in the app; prevents IPv6 leaks through WebRTC and similar |
| **Application list enhancement** | TPROXY, TUN2SOCKS, and BPF2SOCKS only; see [Enhancement module](#enhance) below |
| **Tethering sharing** | Lets traffic from Wi-Fi / USB / Bluetooth / Ethernet tethering clients enter the proxy |
| **Ignored interfaces** | Interfaces that should not be captured; a trailing `+` matches a prefix, e.g. `wlan+` |
| **Private addresses** | Private addresses skip the core by default; add ranges here that should be proxied |

In TUN mode (AsteriskMETA / AsteriskBOX) and eBPF mode (AsteriskBOX), **Tethering sharing** takes the actual downstream interface names instead (e.g. `ap0`, `rndis0`, no wildcards), and **Ignored interfaces** and **Private addresses** are not shown.

::: info FakeDNS and per-app proxy
When FakeDNS / FakeIP is enabled in a ROOT mode, per-app proxy only supports **All-app mode** by default. With [Application list enhancement](#enhance) on in TPROXY, TUN2SOCKS, or BPF2SOCKS mode, DNS is split by the per-app list and this restriction is lifted.
:::

### Notes on each ROOT mode

- **TPROXY**: set the **Transparent proxy port**. Built on iptables and policy routing; does not need eBPF.
- **TUN**: uses the core's own TUN stack. Under **Bypass direct addresses** you can pick IP CIDR rule sets that bypass capture entirely (domain rules have no effect here); AsteriskMETA also lets you choose the **TUN stack**.
- **eBPF** (AsteriskBOX): choose the **Data plane** (`socket_assign` / `cgroup` / `packet_rewrite`, etc.) and **DNS mode** (`hijack` takes over port 53; `respect_policy` follows the app filter). Like TUN mode, IP CIDR rule sets can bypass capture.
- **TUN2SOCKS**: set the SOCKS5 port used by TUN2SOCKS, plus the TUN MTU and ranges.
- **BPF2SOCKS**: set the **BPF2SOCKS bridge port** and the **SOCKS5 port**.

### Only one ROOT service at a time {#root-exclusive}

The ROOT services of the three apps share the same set of network rules and cannot run concurrently. If you see *The ROOT proxy service is being used by X*, stop the service in that app first, then start the current one.

## Enhancement module (AsteriskEnhance) {#enhance}

[AsteriskEnhance](https://github.com/Asterisk4Magisk/AsteriskEnhance) is an optional system module that **routes system DNS by the per-app list too**, and keeps separate resolver caches per list so DNS answers do not leak between apps.

- Requires root and **Zygisk Next**; supports TPROXY, TUN2SOCKS, and BPF2SOCKS.
- Turn on **Application list enhancement** under **Settings → Proxy settings (current mode)** and follow the prompts; the app flashes the module for you (Magisk, KernelSU, and APatch are supported).
- **Reboot after installing or updating.** When an app update ships a newer module, you will be prompted to update and reboot.
- If automatic flashing fails, export the app's APK, rename `.apk` to `.zip`, and flash it manually in your root manager.
