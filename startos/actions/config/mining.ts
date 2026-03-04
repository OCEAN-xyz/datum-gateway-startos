import { configJson } from '../../fileModels/datum_gateway_config.json'
import { i18n } from '../../i18n'
import { sdk } from '../../sdk'
import { nullToUndefined } from '../../utils'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  pool_address: Value.text({
    name: i18n('Bitcoin Address'),
    required: true,
    default: null,
    description: i18n(
      'Bitcoin address used for mining on DATUM Pool, and for solo mining rewards.',
    ),
    patterns: [
      {
        regex: '[0-9a-zA-Z]{20,88}',
        description: i18n('Must be a valid Bitcoin address.'),
      },
    ],
  }),
  coinbase_tag_primary: Value.text({
    name: i18n('Primary Coinbase Tag'),
    required: false,
    default: null,
    placeholder: 'DATUM Gateway',
    description: i18n(
      "Text to have in the primary coinbase tag when solo (overridden by DATUM Pool with the pool's name.)",
    ),
  }),
  coinbase_tag_secondary: Value.text({
    name: i18n('Secondary Coinbase Tag'),
    required: false,
    default: null,
    placeholder: 'DATUM User',
    description: i18n(
      "Text to have in the secondary coinbase tag. If you're mining on a pool, this is what you label your blocks with.",
    ),
  }),
  coinbase_unique_id: Value.number({
    name: i18n('Coinbase Unique ID'),
    description: i18n(
      'A unique ID between 1 and 65535. Make unique per instance of datum with the same coinbase tags.',
    ),
    required: false,
    default: null,
    placeholder: '4242',
    min: 1,
    max: 65535,
    integer: true,
  }),
})

export const miningConfig = sdk.Action.withInput(
  'mining-config',

  async () => ({
    name: i18n('Mining Settings'),
    description: i18n(
      'Bitcoin address used for mining on DATUM Pool, and for solo mining rewards.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: 'Config',
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => configJson.read((c) => c?.mining).const(effects),

  ({ effects, input }) =>
    configJson.merge(effects, { mining: nullToUndefined(input) }),
)
