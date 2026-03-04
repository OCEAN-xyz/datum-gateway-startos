import { List } from '@start9labs/start-sdk/base/lib/actions/input/builder'
import { configJson } from '../../fileModels/datum_gateway_config.json'
import { i18n } from '../../i18n'
import { sdk } from '../../sdk'
import { nullToUndefined } from '../../utils'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  max_clients_per_thread: Value.number({
    name: i18n('Maximum Clients Per Thread'),
    description: i18n('Maximum clients per Stratum server thread.'),
    required: false,
    default: null,
    placeholder: '128',
    integer: true,
    min: 0,
  }),
  max_threads: Value.number({
    name: i18n('Max Threads'),
    description: i18n('Maximum Stratum server threads'),
    required: false,
    default: null,
    placeholder: '8',
    integer: true,
    min: 0,
  }),
  max_clients: Value.number({
    name: i18n('Max Clients'),
    description: i18n(
      'Maximum total Stratum clients before rejecting connections',
    ),
    required: false,
    default: null,
    placeholder: '1024',
    integer: true,
    min: 0,
  }),
  trust_proxy: Value.number({
    name: i18n('Trust PROXY'),
    description: i18n('Number of PROXY lines trusted'),
    required: false,
    default: null,
    placeholder: '-1',
    integer: true,
    min: -1,
  }),
  vardiff_min: Value.number({
    name: i18n('Minimum Difficulty'),
    description: i18n('Work difficulty floor'),
    required: false,
    default: null,
    placeholder: '16384',
    integer: true,
    min: 0,
  }),
  vardiff_target_shares_min: Value.number({
    name: i18n('Target Shares per Minute'),
    description: i18n(
      'Adjust work difficulty to target this many shares per minute',
    ),
    required: false,
    default: null,
    placeholder: '8',
    integer: true,
    min: 0,
  }),
  vardiff_quickdiff_count: Value.number({
    name: i18n('Difficulty Update Speed'),
    description: i18n(
      'How many shares before considering a quick diff update',
    ),
    required: false,
    default: null,
    placeholder: '8',
    integer: true,
    min: 0,
  }),
  vardiff_quickdiff_delta: Value.number({
    name: i18n('Difficulty Delta'),
    description: i18n(
      'How many times faster than target before enforcing a quick diff bump',
    ),
    required: false,
    default: null,
    placeholder: '8',
    integer: true,
    min: 0,
  }),
  share_stale_seconds: Value.number({
    name: i18n('Seconds Until Shares Considered Stale'),
    description: i18n(
      'How many seconds after a job is generated before a share is considered stale',
    ),
    required: false,
    default: null,
    placeholder: '120',
    integer: true,
    min: 0,
  }),
  fingerprint_miners: Value.toggle({
    name: i18n('Fingerprint Miners'),
    default: true,
    description: i18n(
      'Attempt to fingerprint miners for better use of coinbase space',
    ),
  }),
  username_modifiers: Value.list(
    List.obj(
      {
        name: i18n('Username modifiers'),
        description: i18n('Miners addresses to distribute shares'),
      },
      {
        spec: InputSpec.of({
          name: Value.text({
            name: i18n('Modifier name'),
            required: true,
            default: null,
            description: i18n('User defined modifier name'),
          }),
          addresses: Value.list(
            List.obj(
              {
                name: i18n('Modifier Address'),
              },
              {
                spec: InputSpec.of({
                  address: Value.text({
                    name: i18n('Bitcoin address'),
                    required: false,
                    default: null,
                    patterns: [
                      {
                        regex: '[0-9a-zA-Z]{0,88}',
                        description: i18n('Must be a valid Bitcoin address.'),
                      },
                    ],
                  }),
                  split: Value.number({
                    name: i18n('Address split percentage'),
                    required: true,
                    default: null,
                    integer: false,
                    min: 0,
                    max: 1,
                  }),
                }),
              },
            ),
          ),
        }),
      },
    ),
  ),
})

export const stratumConfig = sdk.Action.withInput(
  'stratum-config',

  async () => ({
    name: i18n('Stratum Server Settings'),
    description: i18n("Configure the Datum gateway's stratum server."),
    warning: null,
    allowedStatuses: 'any',
    group: 'Config',
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => configJson.read((c) => c?.stratum).const(effects),

  ({ effects, input }) =>
    configJson.merge(effects, { stratum: nullToUndefined(input) }),
)
