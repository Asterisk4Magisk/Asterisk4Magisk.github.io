---
title: FAQ & troubleshooting
description: Common questions about the Asterisk apps — startup failures, no connectivity, subscription update errors, ROOT conflicts, battery and background limits.
---

# FAQ & troubleshooting

## General troubleshooting steps

1. Read the failure dialog: **Failed to start proxy** lists error details, suggested actions, and the startup log. Try the suggested actions first.
2. Read the logs: **Core logs** and **Logcat** under **Settings → Logs**. For more detail, raise the **Log level** and reproduce the problem.
3. Narrow it down: try another server, switch back to VPN Service, and temporarily turn off per-app proxy or override scripts to find which part is at fault.
4. Report it: in the [Telegram channel](https://t.me/Asterisk4Magisk) or the app's GitHub Issues, include the app version, Android version, run mode, and exported logs (remove subscription URLs and server details first).

## Installing and starting

### Which APK should I download?

If unsure, choose `universal`. If you know your device is 64-bit ARM (almost all phones), `arm64-v8a` is smaller. See [Getting started · Download](./getting-started#download).

### "VPN permission was not granted. VPN Service cannot be started"

Android shows a VPN connection request on first start; tap OK. If no prompt appears:

- Check whether another app has "Always-on VPN" / "Block connections without VPN" enabled in system settings, and turn it off.
- Some vendor ROMs suppress the VPN prompt; select this app manually in the system VPN settings.

### Connected, but nothing loads

- Use **Real connection test** (AsteriskNG) or **Test group** (AsteriskMETA) to confirm the server itself works.
- Check per-app proxy: in whitelist mode, apps not on the list do not use the proxy.
- Check DNS: try turning off FakeDNS / Override DNS and other customizations, or go back to the defaults.
- Check the system clock: a large time offset breaks TLS / REALITY handshakes.
- With a raw profile in AsteriskMETA, make sure the YAML has the required inbound and DNS fields (see the configuration check).

### Subscription updates fail

- If the subscription URL itself is blocked, turn on **Update via proxy** / **Update through the running proxy** and update while the proxy is running.
- Some providers return different formats depending on the User-Agent; try the Clash Meta, v2rayNG, or sing-box presets, or a custom value.
- If the HWID is rejected or the device limit is reached, unbind old devices with your provider.
- Age-encrypted subscriptions need the matching Age secret key.

## ROOT modes

### "No ROOT access detected!"

Grant superuser access to the app in your root manager (Magisk / KernelSU / APatch). If you denied it before, remove the denial and try again.

### "The ROOT proxy service is being used by X"

The ROOT services of the three apps cannot run at the same time. Stop the service in the app named in the message, then start the current app.

### eBPF / BPF2SOCKS will not start

These modes depend on kernel eBPF support and are generally suited to devices with a **GKI 5.10 or newer** kernel (check the kernel version in your phone's "About phone" settings, or run `uname -r`). On older or unsupported kernels, use TPROXY or TUN2SOCKS instead.

### Tethered devices are not proxied

Under **Proxy settings → Tethering sharing**, check the tethering types you use (Wi-Fi / USB / Bluetooth / Ethernet); in TUN mode and AsteriskBOX's eBPF mode, enter the actual downstream interface names. VPN Service mode cannot transparently proxy tethered devices; instead, turn on **Listen on all network interfaces** in **Local proxy settings** and configure the proxy manually on the downstream devices.

### Whitelist / blacklist are unavailable with FakeDNS on

When FakeDNS / FakeIP is enabled in a ROOT mode, only all-app mode is supported by default, and a selected whitelist / blacklist is treated as all-app. Two ways around it:

- Turn on [Application list enhancement](./run-modes#enhance) in TPROXY, TUN2SOCKS, or BPF2SOCKS mode. System DNS is then split by the per-app list, so FakeDNS works together with whitelist / blacklist;
- or turn off FakeDNS.

### Google Play Store and Google Play services cannot connect on ColorOS / RedMagic OS

Once these systems decide that Google is unreachable, they actively cut Google apps off the network, so those apps cannot connect even while the proxy is running.

**ColorOS 16 / 17**: the battery component checks whether Google is reachable after boot and whenever the network changes; when the check fails, it blocks networking for Google Play services, the Google Play Store, and ConfigUpdater. In VPN Service mode the check passes outright, so mainly ROOT modes are affected. Install the [GoogleFirewallFixer](https://github.com/Asterisk4Magisk/GoogleFirewallFixer) module (requires Zygisk and LSPosed):

- Enable the module in LSPosed, make sure **Battery** is checked in its scope, then reboot;
- The module only stops the battery component from blocking these Google apps and leaves the system firewall rules alone; network permissions you set in Data usage, as well as network cuts during deep sleep and app freezing, keep working.

**RedMagic OS**: the system's **App optimization** drops traffic from Google Play services and the Google Play Store whenever it cannot reach Google, and re-checks periodically and on network or screen changes, so cleaning the firewall rules by hand is quickly undone. Turn off **App optimization** in **Developer options**; the system then lifts the restriction itself.

## Background and battery

### The system stops the proxy in the background

- Set the app's battery policy to "Unrestricted" in system settings, and allow auto-start and background activity.
- On some vendor ROMs you also need to lock the app in recent tasks.
- In ROOT modes the core runs as a root process and is less affected by background restrictions.

### Start on boot does not work

- VPN Service: make sure the VPN permission was granted before and the system allows the app to auto-start.
- ROOT modes: make sure your root solution supports `service.d` scripts. Restoring a backup disables the ROOT boot script; turn it on again.

## Other

### How do I open the app after hiding its launcher icon?

Dial the app's code in the phone app, or long-press the Quick Settings tile. The codes are listed in [Common features · Privacy](./common#privacy).

### Can I install all three apps?

Yes, they have different package names. In VPN Service mode only one VPN can be connected at a time; in ROOT modes only one app can run at a time.

### How do I switch AsteriskMETA between Mihomo and Meow?

Download the APK of the other core edition and install it over the current one; your data is kept. The Meow edition does not support TUN (ROOT): if you were using TUN (ROOT) before installing the Meow edition, the app automatically resets the run mode to the default VPN Service and turns off start on boot, so re-check the run mode after switching.
