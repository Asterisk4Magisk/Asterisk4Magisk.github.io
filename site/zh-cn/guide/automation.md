---
title: 自动化与外部控制
description: 服务控制（Wi-Fi、锁屏、定时自动启停）与广播控制（Tasker、adb、自动化应用）。
---

# 自动化与外部控制

## 服务控制 {#service-control}

ROOT 模式下，**设置 → 代理设置（当前模式）→ 服务控制** 可以根据条件自动启动或停止代理服务。开启 **启用服务控制** 后，即使代理服务停止，守护进程 asteriskd 也会常驻以便响应条件。VPN Service 模式下没有此功能，可改用下文的 [广播控制](#broadcast) 配合自动化应用实现。

::: info 前提
启用前需要先添加并选中一个代理节点（或配置）。保存后服务会重启以应用新规则；若应用失败，编辑内容会保留。
:::

### Wi-Fi 控制

启用 **WiFi 控制** 后，可分别设置：

- **连接 WiFi 时启动** / **连接 WiFi 时停止**
- **断开 WiFi 时启动** / **断开 WiFi 时停止**

用 **SSID 列表** 与 **BSSID 列表** 限定生效的网络：两者是「或」关系；两个列表都为空时匹配任意 Wi-Fi。BSSID 格式形如 `00:11:22:33:44:55`。

**典型用法**：在家里的 Wi-Fi 上自动停止代理，离开（断开 Wi-Fi，切到移动数据）时自动启动。

### 锁屏控制

启用 **锁屏控制** 后，可设置 **锁屏时启动 / 停止**、**解锁时启动 / 停止**。

### 定时控制

启用 **定时控制** 后，分别填写 **服务启动时间** 与 **服务停止时间**，格式为五段数字的 Linux cron 表达式：`分 时 日 月 周`，支持 `*`、逗号、范围与步进。

| 表达式 | 含义 |
| --- | --- |
| `0 9 * * 1-5` | 工作日 9:00 |
| `30 23 * * *` | 每天 23:30 |
| `0 */2 * * *` | 每两小时整点 |

::: warning 定时器不会唤醒设备
Android 挂起进程时，定时动作会在设备恢复后补偿最近一次错过的动作；启动与停止同时到期时，停止优先。
:::

## 广播控制 {#broadcast}

开启 **设置 → 高级设置 → 广播控制** 后，其他应用（Tasker、MacroDroid、自动化脚本）或 adb 可以通过**显式广播**控制服务。

### 接收器与 Action

| 应用 | 接收器组件 | Action 前缀 |
| --- | --- | --- |
| AsteriskNG | `org.asterisk.zcc.ang/features.automation.BroadcastControlReceiver` | `org.asterisk.zcc.ang.action.` |
| AsteriskMETA | `org.asterisk.zcc.ameta/features.automation.BroadcastControlReceiver` | `org.asterisk.zcc.ameta.action.` |
| AsteriskBOX | `org.asterisk.zcc.abox/features.automation.BroadcastControlReceiver` | `org.asterisk.zcc.abox.action.` |

| 操作 | Action 后缀 |
| --- | --- |
| 启动代理 | `PROXY_START` |
| 停止代理 | `PROXY_STOP` |
| 切换代理启停 | `PROXY_TOGGLE` |
| 更新全部 URL 订阅 | `SUBSCRIPTION_UPDATE` |
| 取消广播订阅更新 | `SUBSCRIPTION_UPDATE_CANCEL` |
| 更新全部资源 | `RESOURCE_UPDATE` |
| 取消资源更新 | `RESOURCE_UPDATE_CANCEL` |

### 示例

通过 adb 让 AsteriskNG 更新全部订阅：

```sh
adb shell am broadcast \
  -n org.asterisk.zcc.ang/features.automation.BroadcastControlReceiver \
  -a org.asterisk.zcc.ang.action.SUBSCRIPTION_UPDATE
```

在 Tasker 中：新建 **发送意图（Send Intent）** 动作，**Action** 填完整的 Action（前缀 + 后缀），**Package** 填应用包名，**Class** 填 `features.automation.BroadcastControlReceiver`，**Target** 选择 **Broadcast Receiver**。

### 行为说明

- 订阅更新会跳过本地项；取消时保留已完成的结果及定时更新配置。
- 资源更新沿用资源管理中的当前配置；取消资源更新会同时清空其共享队列。
- 同类更新执行期间，重复命令会合并。
- 更新在后台执行，**不会启动代理**。广播送达不代表更新完成，结果请在应用日志中查看 `BroadcastControl` 标签。
- VPN Service 模式下，启动代理需要事先授予过 VPN 权限。

::: warning 安全提示
开启广播控制后，设备上任何应用都可以向接收器发送这些广播。仅在需要自动化时开启。
:::
