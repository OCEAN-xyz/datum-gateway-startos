import { configJson } from '../../fileModels/datum_gateway_config.json'
import { i18n } from '../../i18n'
import { sdk } from '../../sdk'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  allow_insecure_auth: Value.toggle({
    name: i18n('Allow Insecure Authentication'),
    default: false,
    description: i18n(
      'Allow insecure authentication (required for Safari)',
    ),
    warning: i18n(
      'This lowers security of the dashboard login. Use it only on trusted networks.',
    ),
  }),
})

export const apiConfig = sdk.Action.withInput(
  'api-config',

  async () => ({
    name: i18n('API'),
    description: i18n('Settings for the Datum Gateway Dashboard'),
    warning: null,
    allowedStatuses: 'any',
    group: 'Config',
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => configJson.read((c) => c?.api).const(effects),

  ({ effects, input }) => configJson.merge(effects, { api: input }),
)
