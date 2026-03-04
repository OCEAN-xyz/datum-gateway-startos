import { FileHelper, z } from '@start9labs/start-sdk'
import { dataDir, knotsMountpoint, stratumPort, uiPort } from '../utils'
import { sdk } from '../sdk'

const optString = z.string().optional().catch(undefined)
const optNumber = z.number().optional().catch(undefined)
const optBoolean = z.boolean().optional().catch(undefined)

const bitcoindShape = z.object({
  // Enforced
  rpccookiefile: z
    .literal(`${knotsMountpoint}/.cookie`)
    .catch(`${knotsMountpoint}/.cookie`),
  rpcurl: z
    .literal('http://bitcoind.startos:8332')
    .catch('http://bitcoind.startos:8332'),
  // Configurable (upstream defaults apply when absent)
  work_update_seconds: optNumber,
  notify_fallback: optBoolean,
})

const stratumShape = z.object({
  // Enforced
  listen_addr: z.literal('').catch(''),
  listen_port: z.literal(stratumPort).catch(stratumPort),
  // Configurable
  max_clients_per_thread: optNumber,
  max_threads: optNumber,
  max_clients: optNumber,
  trust_proxy: optNumber,
  vardiff_min: optNumber,
  vardiff_target_shares_min: optNumber,
  vardiff_quickdiff_count: optNumber,
  vardiff_quickdiff_delta: optNumber,
  share_stale_seconds: optNumber,
  fingerprint_miners: optBoolean,
  idle_timeout_no_subscribe: optNumber,
  idle_timeout_no_shares: optNumber,
  idle_timeout_max_last_work: optNumber,
  username_modifiers: z
    .record(z.string(), z.record(z.string(), z.number()))
    .optional()
    .catch(undefined),
})

const miningShape = z.object({
  pool_address: optString,
  coinbase_tag_primary: optString,
  coinbase_tag_secondary: optString,
  coinbase_unique_id: optNumber,
})

const apiShape = z.object({
  // Enforced
  listen_port: z.literal(uiPort).catch(uiPort),
  listen_addr: z.literal('').catch(''),
  // Configurable
  admin_password: z.string().catch(''),
  allow_insecure_auth: optBoolean,
})

const loggerShape = z.object({
  // Enforced
  log_to_stderr: z.literal(false).catch(false),
  // Configurable
  log_to_file: optBoolean,
  log_file: optString,
  log_rotate_daily: optBoolean,
  log_calling_function: optBoolean,
  log_level_console: optNumber,
  log_level_file: optNumber,
})

const datumShape = z.object({
  pool_host: optString,
  pool_port: optNumber,
  pool_pubkey: optString,
  pool_pass_workers: optBoolean,
  pool_pass_full_users: optBoolean,
  always_pay_self: optBoolean,
  pooled_mining_only: optBoolean,
  protocol_global_timeout: optNumber,
})

const diskShape = z.object({
  bitcoind: bitcoindShape.catch(bitcoindShape.parse({})),
  stratum: stratumShape.catch(stratumShape.parse({})),
  mining: miningShape.catch(miningShape.parse({})),
  api: apiShape.catch(apiShape.parse({})),
  logger: loggerShape.catch(loggerShape.parse({})),
  datum: datumShape.catch(datumShape.parse({})),
})

// Form shape: same as disk but stratum.username_modifiers is an array
const stratumFormShape = stratumShape
  .omit({ username_modifiers: true })
  .extend({
    username_modifiers: z
      .array(
        z.object({
          name: z.string(),
          addresses: z.array(
            z.object({ address: z.string().catch(''), split: z.number() }),
          ),
        }),
      )
      .catch([]),
  })

const formShape = z.object({
  bitcoind: bitcoindShape.catch(bitcoindShape.parse({})),
  stratum: stratumFormShape.catch(stratumFormShape.parse({})),
  mining: miningShape.catch(miningShape.parse({})),
  api: apiShape.catch(apiShape.parse({})),
  logger: loggerShape.catch(loggerShape.parse({})),
  datum: datumShape.catch(datumShape.parse({})),
})

export const configJson = FileHelper.json(
  {
    base: sdk.volumes.main,
    subpath: `${dataDir}/datum_gateway_config.json`,
  },
  formShape,
  {
    onRead: (a: unknown) => {
      const disk = diskShape.parse(a)
      return {
        ...disk,
        stratum: {
          ...disk.stratum,
          username_modifiers: Object.entries(
            disk.stratum.username_modifiers ?? {},
          ).map(([name, addressMap]) => ({
            name,
            addresses: Object.entries(addressMap).map(([address, split]) => ({
              address,
              split,
            })),
          })),
        },
      }
    },
    onWrite: (a: z.infer<typeof formShape>) => {
      const modifiers: Record<string, Record<string, number>> = {}
      for (const { name, addresses } of a.stratum.username_modifiers ?? []) {
        const addressMap: Record<string, number> = {}
        for (const { address, split } of addresses) {
          addressMap[address ?? ''] = split
        }
        modifiers[name] = addressMap
      }
      return {
        ...a,
        stratum: {
          ...a.stratum,
          username_modifiers: modifiers,
        },
      }
    },
  },
)
