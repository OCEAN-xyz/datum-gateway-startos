import { configJson } from '../../fileModels/datum_gateway_config.json'
import { i18n } from '../../i18n'
import { sdk } from '../../sdk'
import { nullToUndefined } from '../../utils'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  pool_host: Value.text({
    name: i18n('Pool Host'),
    required: false,
    default: null,
    placeholder: 'datum-beta1.mine.ocean.xyz',
    description: i18n(
      'Remote DATUM server host/ip to use for decentralized pooled mining',
    ),
  }),
  pool_port: Value.number({
    name: i18n('Pool Port'),
    description: i18n('Remote DATUM server port'),
    required: false,
    default: null,
    placeholder: '28915',
    min: 0,
    max: 65535,
    integer: true,
  }),
  pool_pubkey: Value.text({
    name: i18n('Pool Pubkey'),
    required: false,
    default: null,
    placeholder:
      'f21f2f0ef0aa1970468f22bad9bb7f4535146f8e4a8f646bebc93da3d89b1406f40d032f09a417d94dc068055df654937922d2c89522e3e8f6f0e649de473003',
    description: i18n(
      'Public key of the DATUM server for initiating encrypted connection. Leave empty to auto-fetch.',
    ),
  }),
  pool_pass_workers: Value.toggle({
    name: i18n('Pool Pass Workers'),
    default: true,
    description: i18n(
      'Pass stratum miner usernames as sub-worker names to the pool',
    ),
  }),
  pool_pass_full_users: Value.toggle({
    name: i18n('Pool Pass Full Users'),
    default: true,
    description: i18n(
      'Pass stratum miner usernames as raw usernames to the pool (use if putting multiple payout addresses on miners behind this gateway)',
    ),
  }),
  always_pay_self: Value.toggle({
    name: i18n('Always Pay Self'),
    default: true,
    description: i18n(
      'Always include my datum.pool_username payout in my blocks if possible',
    ),
  }),
  reward_sharing: Value.select({
    name: i18n('Collaborative reward sharing (pooled mining)'),
    description: i18n(
      "You can share rewards and share in others' rewards - or only get rewarded when you find a block yourself.",
    ),
    default: 'require',
    values: {
      require: 'require',
      prefer: 'prefer',
      never: 'never',
    },
  }),
})

export const datumConfig = sdk.Action.withInput(
  'datum-config',

  async () => ({
    name: i18n('Datum'),
    description: i18n(
      'Datum-Gateway settings. These are set to mine on OCEAN by default. Modify to switch to another Datum-supporting pool, or to solo mine.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: 'Config',
    visibility: 'enabled',
  }),

  inputSpec,

  // Pre-fill: derive reward_sharing from pooled_mining_only + pool_host
  async ({ effects }) => {
    const datum = await configJson.read((c) => c?.datum).const(effects)
    if (!datum) return {}
    return {
      ...datum,
      reward_sharing: datum.pooled_mining_only
        ? 'require'
        : datum.pool_host
          ? 'prefer'
          : 'never',
    }
  },

  // Execute: derive pooled_mining_only + pool_host from reward_sharing
  async ({ effects, input }) => {
    const sharing = input.reward_sharing

    const pool_host =
      sharing === 'never'
        ? ''
        : sharing === 'require' && !input.pool_host
          ? 'datum-beta1.mine.ocean.xyz'
          : (input.pool_host ?? undefined)

    await configJson.merge(effects, {
      datum: nullToUndefined({
        ...input,
        pool_host,
        pooled_mining_only: sharing === 'require',
      }),
    })
  },
)
