import { configJson } from '../../fileModels/datum_gateway_config.json'
import { i18n } from '../../i18n'
import { sdk } from '../../sdk'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  pool_address: Value.dynamicText(async ({ effects }) => {
    return {
      name: i18n('Address'),
      description: i18n('The Bitcoin address to use for pooled/lotto mining'),
      required: true,
      default: null,
      patterns: [
        {
          regex: '^[a-zA-Z0-9]+$',
          description: i18n('Must be alphanumeric.'),
        },
      ],
    }
  }),
})

export const autoconfigPoolAddress = sdk.Action.withInput(
  'autoconfig-pool-address',

  async ({ effects }) => ({
    name: i18n('Config pool address'),
    description: i18n('Config the pool address to mine on.'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'hidden',
  }),

  inputSpec,

  async ({ effects }) => configJson.read((c) => c?.mining).const(effects),

  async ({ effects, input }) => {
    await configJson.merge(effects, {
      mining: { pool_address: input.pool_address },
    })
  },
)
