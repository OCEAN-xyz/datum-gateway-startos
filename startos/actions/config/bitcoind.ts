import { configJson } from '../../fileModels/datum_gateway_config.json'
import { i18n } from '../../i18n'
import { sdk } from '../../sdk'
import { nullToUndefined } from '../../utils'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  work_update_seconds: Value.number({
    name: i18n('Work Update (Seconds)'),
    description: i18n(
      'How frequently should Bitcoind send updated templates',
    ),
    required: false,
    default: null,
    placeholder: '40',
    min: 5,
    max: 120,
    integer: true,
    units: 'seconds',
  }),
})

export const bitcoindConfig = sdk.Action.withInput(
  'bitcoind-config',

  async () => ({
    name: i18n('Bitcoin RPC settings'),
    description: i18n('RPC settings for bitcoind'),
    warning: null,
    allowedStatuses: 'any',
    group: 'Config',
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => configJson.read((c) => c?.bitcoind).const(effects),

  ({ effects, input }) =>
    configJson.merge(effects, { bitcoind: nullToUndefined(input) }),
)
