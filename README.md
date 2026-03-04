<p align="center">
  <img src="icon.svg" alt="Datum Gateway Logo" width="21%">
</p>

# Datum Gateway on StartOS

> **Upstream docs:** <https://ocean.xyz/docs/datum>
>
> Everything not listed in this document should behave the same as upstream
> Datum Gateway. If a feature, setting, or behavior is not mentioned here,
> the upstream documentation is accurate and fully applicable.

DATUM (Decentralized Alternative Templates for Universal Mining) enables miners to create custom block templates using their own Bitcoin node, either for pooled mining on DATUM-supporting pools (such as OCEAN) or for solo mining. See the [upstream repo](https://github.com/ocean-xyz/datum-gateway) for general Datum Gateway documentation.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions](#actions-startos-ui)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property      | Value                                                                        |
| ------------- | ---------------------------------------------------------------------------- |
| Image         | Custom Dockerfile (multi-stage Debian Bookworm build from upstream C source) |
| Architectures | x86_64, aarch64                                                              |
| Entrypoint    | `datum_gateway -c /root/data/datum_gateway_config.json`                      |

The custom Dockerfile compiles `datum_gateway` from source using CMake with dependencies: libmicrohttpd, libjansson, libcurl, libgcrypt, and libsodium.

## Volume and Data Layout

| Volume | Mount Point | Purpose                               |
| ------ | ----------- | ------------------------------------- |
| `main` | `/root`     | All Datum Gateway data (config, logs) |

The Bitcoin node's data volume is also mounted read-only at `/mnt/knots` for cookie-based RPC authentication.

Key files on the `main` volume:

| File                             | Purpose                                                      |
| -------------------------------- | ------------------------------------------------------------ |
| `data/datum_gateway_config.json` | All Datum Gateway configuration (managed by StartOS actions) |

## Installation and First-Run Flow

1. A default `datum_gateway_config.json` is written with sensible defaults, pre-configured to mine on OCEAN pool (`datum-beta1.mine.ocean.xyz`)
2. Two **critical tasks** are created prompting the user to:
   - **Set an admin password** — required to access the Datum Gateway dashboard
   - **Set a pool address** — the Bitcoin address for mining rewards
3. Bitcoin RPC is pre-configured to connect to the local `bitcoind` service via cookie authentication (`/mnt/knots/.cookie`)
4. A dependency task is created on `bitcoind` to set `blocknotify` to `curl -s -m5 http://datum.startos:7152/NOTIFY`, ensuring Datum receives new block notifications

## Configuration Management

Datum Gateway is configured through **StartOS actions** that write to `datum_gateway_config.json` on the `main` volume.

### Config Actions

Each configuration section has its own dedicated action:

| Action                      | Settings                                                                                                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Bitcoin RPC Settings**    | Work update interval (5–120 seconds)                                                                                                                                                              |
| **Stratum Server Settings** | Max clients per thread, max threads, max clients, PROXY trust level, vardiff parameters (min difficulty, target shares/min, update speed, delta), stale share timeout, miner fingerprinting, username modifiers |
| **Mining Settings**         | Bitcoin payout address, primary/secondary coinbase tags, coinbase unique ID                                                                                                                        |
| **API**                     | Allow insecure authentication (for Safari)                                                                                                                                                         |
| **Logger**                  | Console log level (0–5), file logging toggle, log file path, file log level                                                                                                                        |
| **Datum**                   | Pool host, pool port, pool public key, pass workers/full users to pool, always pay self, reward sharing strategy (require/prefer/never)                                                            |

Settings **not** managed by StartOS (hardcoded or derived):

| Setting                 | Value                          | Reason                                     |
| ----------------------- | ------------------------------ | ------------------------------------------ |
| `rpccookiefile`         | `/mnt/knots/.cookie`           | Bitcoin cookie auth via mounted volume     |
| `rpcurl`                | `http://bitcoind.startos:8332` | Internal service networking                |
| `listen_addr` (stratum) | `""` (all interfaces)          | Required for container networking          |
| `listen_addr` (api)     | `""` (all interfaces)          | Required for container networking          |
| `notify_fallback`       | `true`                         | Ensures block updates if blocknotify fails |

### Reward Sharing Strategy

The **reward sharing** selector in the Datum Pool section controls pooled vs solo mining:

| Option                | Behavior                                                                                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Require** (default) | Pool mining required; `pooled_mining_only` = true. If pool host is empty, defaults to OCEAN. If pool goes down, Datum stops issuing work — miners should have backup pools configured |
| **Prefer**            | Pool mining preferred; `pooled_mining_only` = false. Falls back to solo mining if pool is unavailable                                                                                 |
| **Never**             | Solo mining only; clears `pool_host` and sets `pooled_mining_only` = false. All block rewards go to the configured pool address                                                       |

### Username Modifiers

The stratum server supports **username modifiers** for distributing mining shares across multiple Bitcoin addresses. Each modifier maps a name to a set of addresses with split percentages (0–1).

## Network Access and Interfaces

| Interface      | Port  | Protocol          | Purpose                                           |
| -------------- | ----- | ----------------- | ------------------------------------------------- |
| Web UI         | 7152  | HTTP              | Datum Gateway dashboard (admin password required) |
| Stratum Server | 23334 | TCP (stratum+tcp) | Mining protocol — point ASICs here                |

### Connecting Miners

Configure mining hardware with:

- **URL**: `stratum+tcp://<your-startos-address>:23334`
- **Username**: Bitcoin payout address, optionally with worker name (e.g., `bc1q...abc.worker1`)
- **Password**: Ignored — use `x` or leave blank

### Payout Address Behavior (Pooled Mining)

By default, **Pool Pass Full Users** is enabled. This means rewards from OCEAN (or any DATUM-supporting pool) go to the Bitcoin addresses configured in your **miners**, not the address in Datum Gateway's config. The config address acts as a fail-safe for solo mining rewards if the pool goes down.

If you prefer to use a single payout address for all miners, disable **Pool Pass Full Users** in the Datum config action. Then the Bitcoin address in Datum Gateway's config will be used for pool payouts, and you can use just worker names (without addresses) in your miners.

### Failover Behavior

With the default **Require** reward sharing strategy, if the pool connection fails, Datum Gateway stops issuing work. Miners should be configured with backup pool(s) to fail over to.

With the **Prefer** strategy, Datum Gateway falls back to solo mining if the pool is unavailable, continuing to issue work using your own block templates.

## Actions (StartOS UI)

### Config

| Action                      | Purpose                                     | Availability |
| --------------------------- | ------------------------------------------- | ------------ |
| **Bitcoin RPC Settings**    | Configure Bitcoin RPC work update interval  | Any          |
| **Stratum Server Settings** | Configure stratum server tuning and vardiff | Any          |
| **Mining Settings**         | Configure payout address and coinbase tags  | Any          |
| **API**                     | Configure dashboard authentication          | Any          |
| **Logger**                  | Configure log levels and file logging       | Any          |
| **Datum**                   | Configure pool connection and reward sharing| Any          |
| **Create/Reset Password**   | Generate admin password for the dashboard   | Any          |

The **Create/Reset Password** action dynamically shows "Create Password" when no password is set, and "Reset Password" otherwise. It generates a 22-character random password and saves it to the config.

## Backups and Restore

**Backed up:** The entire `main` volume, including `datum_gateway_config.json` (all configuration and credentials).

**Restore behavior:** Restoring overwrites current configuration with the backup copy.

## Health Checks

| Check                 | Method                                          | Messages                                      |
| --------------------- | ----------------------------------------------- | --------------------------------------------- |
| **Web Interface**     | `checkPortListening` on port 7152               | Ready: "The Datum Gateway dashboard is ready" |
| **Stratum Interface** | `checkPortListening` on port 23334 (1s timeout) | Ready: "Stratum server is available"          |

The Stratum health check requires the datum daemon to be ready first.

## Dependencies

| Dependency                    | Required | Version          | Purpose                                                                                     |
| ----------------------------- | -------- | ---------------- | ------------------------------------------------------------------------------------------- |
| **Bitcoin Node** (`bitcoind`) | Optional | >= 29.1:2-beta.0 | Block template generation via `getblocktemplate`; new block notifications via `blocknotify` |

When the Bitcoin dependency is configured, Datum Gateway automatically creates a task on `bitcoind` to set `blocknotify = curl -s -m5 http://datum.startos:7152/NOTIFY`. This task is re-evaluated on every init to ensure the setting persists.

Bitcoin Knots is recommended over Bitcoin Core for its superior template controls and mempool filtering.

## Limitations and Differences

1. **Custom Docker image** — compiled from source with CMake; includes runtime dependencies (libmicrohttpd, libjansson, libsodium) not in upstream binary releases
2. **RPC cookie auth enforced** — always uses the mounted Bitcoin node's `.cookie` file; no manual RPC credentials
3. **Immutable ports** — stratum (23334) and dashboard (7152) ports cannot be changed through the config action
4. **Admin password required** — a critical task forces password creation before the dashboard is accessible
5. **Pool address required** — a critical task forces pool address configuration before mining can begin
6. **blocknotify auto-configured** — the `bitcoind` blocknotify setting is automatically managed; manual changes will be overwritten
7. **Config file not editable via dashboard** — `modify_conf` is hardcoded to `false`; all configuration changes must go through StartOS actions

## What Is Unchanged from Upstream

- Stratum mining protocol (stratum+tcp)
- Block template generation via `getblocktemplate`
- Variable difficulty (vardiff) algorithm
- Coinbase tag and unique ID handling
- DATUM pool protocol (encrypted connection to pool server)
- Username-based payout addressing (Pool Pass Full Users / Pool Pass Workers)
- Worker identification and fingerprinting
- Share validation and stale share handling
- Failover behavior (pooled → stop or pooled → solo, depending on config)
- Dashboard UI and monitoring features

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions and development workflow.

---

## Quick Reference for AI Consumers

```yaml
package_id: datum
image: custom Dockerfile (built from Datum Gateway C source)
architectures: [x86_64, aarch64]
volumes:
  main: /root
dependency_mounts:
  bitcoind_main: /mnt/knots (read-only)
ports:
  ui: 7152
  stratum: 23334
dependencies:
  - bitcoind (optional, >= 29.1:2-beta.0)
startos_managed_files:
  - data/datum_gateway_config.json
actions:
  - bitcoind-config
  - stratum-config
  - mining-config
  - api-config
  - logger-config
  - datum-config
  - autoconfig-pool-address (hidden, task-triggered)
  - reset-password
health_checks:
  - checkPortListening:7152: web_interface
  - checkPortListening:23334: stratum_interface
backup_volumes:
  - main (full volume)
auto_configured_dependency_settings:
  bitcoind:
    blocknotify: 'curl -s -m5 http://datum.startos:7152/NOTIFY'
init_tasks:
  - reset-password (critical, if no admin password set)
  - autoconfig-pool-address (critical, if no pool address set)
config_sections:
  - bitcoind (RPC settings)
  - stratum (server tuning, vardiff, username modifiers)
  - mining (payout address, coinbase tags)
  - api (dashboard settings)
  - logger (log levels, file logging)
  - datum (pool connection, reward sharing strategy)
```
