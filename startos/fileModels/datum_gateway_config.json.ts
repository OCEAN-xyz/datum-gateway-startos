import { FileHelper, z } from '@start9labs/start-sdk'
import { configDefaults, dataDir } from '../utils'
import { sdk } from '../sdk'

const { bitcoind, stratum, mining, api, logger, datum } = configDefaults

export const configJsonShape = z.object({
  bitcoind: z.object({
    rpccookiefile: z.string().catch(bitcoind.rpccookiefile),
    rpcurl: z.string().catch(bitcoind.rpcurl),
    work_update_seconds: z.number().catch(bitcoind.work_update_seconds),
    notify_fallback: z.boolean().catch(bitcoind.notify_fallback),
  }),
  stratum: z.object({
    listen_addr: z.string().catch(stratum.listen_addr),
    listen_port: z.number().catch(stratum.listen_port),
    max_clients_per_thread: z.number().catch(stratum.max_clients_per_thread),
    max_threads: z.number().catch(stratum.max_threads),
    max_clients: z.number().catch(stratum.max_clients),
    trust_proxy: z.number().catch(stratum.trust_proxy),
    vardiff_min: z.number().catch(stratum.vardiff_min),
    vardiff_target_shares_min: z.number().catch(
      stratum.vardiff_target_shares_min,
    ),
    vardiff_quickdiff_count: z.number().catch(stratum.vardiff_quickdiff_count),
    vardiff_quickdiff_delta: z.number().catch(stratum.vardiff_quickdiff_delta),
    share_stale_seconds: z.number().catch(stratum.share_stale_seconds),
    fingerprint_miners: z.boolean().catch(stratum.fingerprint_miners),
    idle_timeout_no_subscribe: z.number().catch(
      stratum.idle_timeout_no_subscribe,
    ),
    idle_timeout_no_shares: z.number().catch(stratum.idle_timeout_no_shares),
    idle_timeout_max_last_work: z.number().catch(
      stratum.idle_timeout_max_last_work,
    ),
    username_modifiers: z
      .record(z.string(), z.record(z.string(), z.number()))
      .catch(stratum.username_modifiers),
  }),
  mining: z.object({
    pool_address: z.string().catch(mining.pool_address),
    coinbase_tag_primary: z.string().catch(mining.coinbase_tag_primary),
    coinbase_tag_secondary: z.string().catch(mining.coinbase_tag_secondary),
    coinbase_unique_id: z.number().catch(mining.coinbase_unique_id),
  }),
  api: z.object({
    allow_insecure_auth: z.boolean().catch(api.allow_insecure_auth),
    listen_port: z.number().catch(api.listen_port),
    listen_addr: z.string().catch(api.listen_addr),
    admin_password: z.string().catch(api.admin_password),
  }),
  logger: z.object({
    log_to_stderr: z.boolean().catch(logger.log_to_stderr),
    log_to_file: z.boolean().catch(logger.log_to_file),
    log_file: z.string().catch(logger.log_file),
    log_rotate_daily: z.boolean().catch(logger.log_rotate_daily),
    log_calling_function: z.boolean().catch(logger.log_calling_function),
    log_level_console: z.number().catch(logger.log_level_console),
    log_level_file: z.number().catch(logger.log_level_file),
  }),
  datum: z.object({
    pool_host: z.string().catch(datum.pool_host),
    pool_port: z.number().catch(datum.pool_port),
    pool_pubkey: z.string().catch(datum.pool_pubkey),
    pool_pass_workers: z.boolean().catch(datum.pool_pass_workers),
    pool_pass_full_users: z.boolean().catch(datum.pool_pass_full_users),
    always_pay_self: z.boolean().catch(datum.always_pay_self),
    pooled_mining_only: z.boolean().catch(datum.pooled_mining_only),
    protocol_global_timeout: z.number().catch(datum.protocol_global_timeout),
  }),
})

export const configJson = FileHelper.json(
  {
    base: sdk.volumes.main,
    subpath: `${dataDir}/datum_gateway_config.json`,
  },
  configJsonShape,
)

export async function ensureConfigFile(effects: any) {
  const exists = await configJson.read().const(effects)
  if (!exists) {
    await configJson.write(effects, configDefaults)
  }
}
