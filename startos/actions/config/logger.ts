import { configJson } from '../../fileModels/datum_gateway_config.json'
import { i18n } from '../../i18n'
import { sdk } from '../../sdk'
import { nullToUndefined } from '../../utils'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  log_level_console: Value.number({
    name: i18n('Log Level Console'),
    description: i18n(
      'Minimum log level for console messages (0=All, 1=Debug, 2=Info, 3=Warn, 4=Error, 5=Fatal)',
    ),
    required: false,
    default: null,
    placeholder: '2',
    min: 0,
    max: 5,
    integer: true,
  }),
  log_to_file: Value.toggle({
    name: i18n('Log to File'),
    default: false,
    description: i18n('Enable logging of messages to a file'),
  }),
  log_file: Value.text({
    name: i18n('Log File'),
    required: false,
    default: null,
    placeholder: '/root/start9/logs.txt',
    description: i18n('Path to file to write log messages, when enabled'),
  }),
  log_level_file: Value.number({
    name: i18n('File Log Level'),
    description: i18n('Minimum log level for log file messages'),
    required: false,
    default: null,
    placeholder: '1',
    min: 0,
    max: 5,
    integer: true,
  }),
})

export const loggerConfig = sdk.Action.withInput(
  'logger-config',

  async () => ({
    name: i18n('Logger'),
    description: i18n('Log Settings'),
    warning: null,
    allowedStatuses: 'any',
    group: 'Config',
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => configJson.read((c) => c?.logger).const(effects),

  ({ effects, input }) =>
    configJson.merge(effects, { logger: nullToUndefined(input) }),
)
