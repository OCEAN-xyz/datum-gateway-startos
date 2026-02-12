import { sdk } from '../sdk'
import {
  configJson,
  ensureConfigFile,
} from '../fileModels/datum_gateway_config.json'
import { i18n } from '../i18n'
const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  address: Value.dynamicText(async ({ effects }) => {
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

export const configPoolAddress = sdk.Action.withInput(
  // id
  'config-pool-address',

  // metadata
  async ({ effects }) => ({
    name: i18n('Config pool address'),
    description: i18n('Config the pool address to mine on.'),
    warning: null,
    allowedStatuses: 'any',
    group: 'Config',
    visibility: 'enabled',
  }),

  // input spec
  inputSpec,

  // optionally pre-fill form
  async ({ effects }) => {
    await ensureConfigFile(effects)
    const config = await configJson.read().const(effects)
    if (!config) throw new Error('Config file does not exist')
    
    return {address: config.mining?.pool_address || '',}
  },

  // execution function
  async ({ effects, input }) => {
    const { address } = input

    const pool_address = address

    await ensureConfigFile(effects)

    await configJson.merge(effects, { mining: { pool_address } })

    return {
      version: '1',
      title: i18n('Success'),
      message: i18n('Bitcoin address set.'),
      result: null,
    }
  },
)
