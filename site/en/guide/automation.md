---
title: Automation & control
description: Service control (start and stop by Wi-Fi, lock screen, or schedule) and broadcast control (Tasker, adb, and automation apps).
---

# Automation & control

## Service control {#service-control}

In ROOT modes, **Settings → Proxy settings (current mode) → Service control** starts or stops the proxy service automatically based on conditions. With **Enable service control** on, the asteriskd daemon stays resident even when the proxy service is stopped, so it can react to the conditions. This feature is not available in VPN Service mode; use [broadcast control](#broadcast) with an automation app instead.

::: info Before you start
Add and select a proxy server (or profile) first. Saving restarts the service to apply the new rules; if applying fails, your edits are kept.
:::

### Wi-Fi control

With **Enable Wi-Fi control** on, you can set each of:

- **Start when Wi-Fi connects** / **Stop when Wi-Fi connects**
- **Start when Wi-Fi disconnects** / **Stop when Wi-Fi disconnects**

Limit which networks count with the **SSID list** and **BSSID list**. The two lists are combined with OR; when both are empty, any Wi-Fi matches. BSSIDs look like `00:11:22:33:44:55`.

**Typical use**: stop the proxy automatically on your home Wi-Fi, and start it when you leave (Wi-Fi disconnects and you switch to mobile data).

If the device is already connected at boot to a network that matches **Stop when Wi-Fi connects**, start on boot keeps the proxy service stopped. A manual start ignores the Wi-Fi state at that moment.

### Lock screen control

With **Enable lock screen control** on, set **Start on lock / Stop on lock** and **Start on unlock / Stop on unlock**.

### Scheduled control

With **Enable scheduled control** on, fill in **Service start time** and **Service stop time** as five-field numeric Linux cron expressions — `minute hour day month weekday` — with support for `*`, commas, ranges, and steps.

| Expression | Meaning |
| --- | --- |
| `0 9 * * 1-5` | 09:00 on weekdays |
| `30 23 * * *` | 23:30 every day |
| `0 */2 * * *` | Every two hours, on the hour |

::: warning Timers do not wake the device
If Android suspends the process, the most recent missed action is applied once the device resumes; when a start and a stop are due at the same time, stop wins.
:::

## Broadcast control {#broadcast}

With **Settings → Advanced settings → Broadcast control** on, other apps (Tasker, MacroDroid, automation scripts) or adb can control the service with **explicit broadcasts**.

### Receivers and actions

| App | Receiver component | Action prefix |
| --- | --- | --- |
| AsteriskNG | `org.asterisk.zcc.ang/features.automation.BroadcastControlReceiver` | `org.asterisk.zcc.ang.action.` |
| AsteriskMETA | `org.asterisk.zcc.ameta/features.automation.BroadcastControlReceiver` | `org.asterisk.zcc.ameta.action.` |
| AsteriskBOX | `org.asterisk.zcc.abox/features.automation.BroadcastControlReceiver` | `org.asterisk.zcc.abox.action.` |

| Operation | Action suffix |
| --- | --- |
| Start proxy | `PROXY_START` |
| Stop proxy | `PROXY_STOP` |
| Toggle proxy | `PROXY_TOGGLE` |
| Update all URL subscriptions | `SUBSCRIPTION_UPDATE` |
| Cancel broadcast subscription update | `SUBSCRIPTION_UPDATE_CANCEL` |
| Update all resources | `RESOURCE_UPDATE` |
| Cancel resource update | `RESOURCE_UPDATE_CANCEL` |

### Examples

Update all subscriptions in AsteriskNG through adb:

```sh
adb shell am broadcast \
  -n org.asterisk.zcc.ang/features.automation.BroadcastControlReceiver \
  -a org.asterisk.zcc.ang.action.SUBSCRIPTION_UPDATE
```

In Tasker: add a **Send Intent** action, set **Action** to the full action (prefix + suffix), **Package** to the app's package name, **Class** to `features.automation.BroadcastControlReceiver`, and **Target** to **Broadcast Receiver**.

### Behavior

- Subscription updates skip local items; cancelling keeps already completed results and the scheduled update configuration.
- Resource updates use the current configuration in resource management; cancelling a resource update also clears its shared queue.
- While an update of the same kind is running, repeated commands are merged.
- Updates run in the background and **do not start the proxy**. Delivery of the broadcast does not mean the update finished — check the `BroadcastControl` tag in the app logs for the result.
- In VPN Service mode, starting the proxy requires that the VPN permission was granted before.

::: warning Security
With broadcast control on, any app on the device can send these broadcasts to the receiver. Only enable it when you need automation.
:::
