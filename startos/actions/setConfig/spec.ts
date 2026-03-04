import { List } from '@start9labs/start-sdk/base/lib/actions/input/builder'
import { sdk } from '../../sdk'
import { i18n } from '../../i18n'
const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  bitcoind: Value.object(
    {
      name: i18n('Bitcoin RPC settings'),
      description: i18n('RPC settings for bitcoind'),
    },
    InputSpec.of({
      rpcurl: Value.text({
        name: i18n('RPC URL'),
        default: 'http://bitcoind.startos:8332',
        required: true,
        description:
          i18n('RPC URL for communication with local bitcoind. (GBT Template Source)'),
        warning: null,
        masked: false,
        placeholder: null,
        inputmode: 'text',
        patterns: [],
        minLength: null,
        maxLength: null,
        immutable: true,
      }),
      work_update_seconds: Value.number({
        name: i18n('Work Update (Seconds)'),
        description: i18n('How frequently should Bitcoind send updated templates'),
        warning: null,
        default: 40,
        required: false,
        min: 5,
        max: 120,
        step: null,
        integer: true,
        units: 'seconds',
        placeholder: null,
      }),
    }),
  ),
  stratum: Value.object(
    {
      name: i18n('Stratum Server Settings'),
      description: i18n('Configure the Datum gateway\'s stratum server.'),
    },
    InputSpec.of({
      listen_port: Value.number({
        name: i18n('Listen Port'),
        description: i18n('Listening port for Stratum Gateway.'),
        warning: null,
        default: 23334,
        required: false,
        min: 0,
        max: 65535,
        step: null,
        integer: false,
        units: null,
        placeholder: null,
        immutable: true,
      }),
      max_clients_per_thread: Value.number({
        name: i18n('Maximum Clients Per Thread'),
        description: i18n('Maximum clients per Stratum server thread.'),
        warning: null,
        default: 128,
        required: false,
        min: 0,
        max: null,
        step: null,
        integer: true,
        units: null,
        placeholder: null,
      }),
      max_threads: Value.number({
        name: i18n('Max Threads'),
        description: i18n('Maximum Stratum server threads (integer, default: 8)'),
        warning: null,
        default: 8,
        required: false,
        min: 0,
        max: null,
        step: null,
        integer: true,
        units: null,
        placeholder: null,
      }),
      max_clients: Value.number({
        name: i18n('Max Clients'),
        description:
          i18n('Maximum total Stratum clients before rejecting connections (integer, default: 2048)'),
        warning: null,
        default: 1024,
        required: false,
        min: 0,
        max: null,
        step: null,
        integer: true,
        units: null,
        placeholder: null,
      }),
      trust_proxy: Value.number({
        name: i18n('Trust PROXY'),
        description:
          i18n('Number of PROXY line trusted'),
        warning: null,
        default: -1,
        required: false,
        min: -1,
        max: null,
        step: null,
        integer: true,
        units: null,
        placeholder: null,
      }),
      vardiff_min: Value.number({
        name: i18n('Minimum Difficulty'),
        description: i18n('Work difficulty floor (integer, default: 16384)'),
        warning: null,
        default: 16384,
        required: false,
        min: 0,
        max: null,
        step: null,
        integer: true,
        units: null,
        placeholder: null,
      }),
      vardiff_target_shares_min: Value.number({
        name: i18n('Target Shares per Minute'),
        description:
          i18n('Adjust work difficulty to target this many shares per minute (integer, default: 8)'),
        warning: null,
        default: 8,
        required: false,
        min: 0,
        max: null,
        step: null,
        integer: true,
        units: null,
        placeholder: null,
      }),
      vardiff_quickdiff_count: Value.number({
        name: i18n('Difficulty Update Speed'),
        description:
          i18n('How many shares before considering a quick diff update (integer, default: 8)'),
        warning: null,
        default: 8,
        required: false,
        min: 0,
        max: null,
        step: null,
        integer: true,
        units: null,
        placeholder: null,
      }),
      vardiff_quickdiff_delta: Value.number({
        name: i18n('Difficulty Delta'),
        description:
          i18n('How many times faster than our target does the miner have to be before we enforce a quick diff bump (integer, default: 8)'),
        warning: null,
        default: 8,
        required: false,
        min: 0,
        max: null,
        step: null,
        integer: true,
        units: null,
        placeholder: null,
      }),
      share_stale_seconds: Value.number({
        name: i18n('Seconds Until Shares Considered Stale'),
        description:
          i18n('How many seconds after a job is generated before a share submission is considered stale? (integer, default: 120)'),
        warning: null,
        default: 120,
        required: false,
        min: 0,
        max: null,
        step: null,
        integer: true,
        units: null,
        placeholder: null,
      }),
      fingerprint_miners: Value.toggle({
        name: i18n('Fingerprint Miners'),
        default: true,
        description:
          i18n('Attempt to fingerprint miners for better use of coinbase space (boolean, default: true)'),
        warning: null,
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
                default: null,
                description: i18n('User defined modifier name'),
                required: true,
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
                        integer: false,
                        default: null,
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
    }),
  ),
  mining: Value.object(
    {
      name: i18n('Mining Settings'),
      description: i18n('Mining settings'),
    },
    InputSpec.of({
      pool_address: Value.text({
        name: i18n('Bitcoin Address'),
        default: null,
        required: true,
        description:
          i18n('Bitcoin address used for mining on DATUM Pool, and for solo mining rewards.'),
        warning: null,
        masked: false,
        placeholder: null,
        inputmode: 'text',
        patterns: [
          {
            regex: '[0-9a-zA-Z]{20,88}',
            description: i18n('Must be a valid Bitcoin address.'),
          },
        ],
        minLength: null,
        maxLength: null,
      }),
      coinbase_tag_primary: Value.text({
        name: i18n('Primary Coinbase Tag'),
        default: 'DATUM Gateway',
        required: false,
        description:
          i18n('Text to have in the primary coinbase tag when solo (overridden by DATUM Pool with the pool\'s name.)'),
        warning: null,
        masked: false,
        placeholder: null,
        inputmode: 'text',
        patterns: [],
        minLength: null,
        maxLength: null,
      }),
      coinbase_tag_secondary: Value.text({
        name: i18n('Secondary Coinbase Tag'),
        default: 'DATUM User',
        required: false,
        description:
          i18n('Text to have in the secondary coinbase tag. If you\'re mining on a pool, this is what you label your blocks with.'),
        warning: null,
        masked: false,
        placeholder: null,
        inputmode: 'text',
        patterns: [],
        minLength: null,
        maxLength: null,
      }),
      coinbase_unique_id: Value.number({
        name: i18n('Coinbase Unique ID'),
        description:
          i18n('A unique ID between 1 and 65535. This is appended to the coinbase. Make unique per instance of datum with the same coinbase tags.'),
        warning: null,
        default: 4242,
        required: false,
        min: 1,
        max: 65535,
        step: null,
        integer: true,
        units: null,
        placeholder: null,
      }),
    }),
  ),
  api: Value.object(
    {
      name: i18n('API'),
      description: i18n('Settings for the Datum Gateway Dashboard'),
    },
    InputSpec.of({
      listen_port: Value.number({
        name: i18n('Listen Port'),
        description: i18n('Listening port for Datum Gateway Dashboard.'),
        warning: null,
        default: 7152,
        required: true,
        min: 0,
        max: 65535,
        step: null,
        integer: true,
        units: null,
        placeholder: null,
        immutable: true,
      }),
      allow_insecure_auth: Value.toggle({
        name: i18n('Allow Insecure Authentication'),
        default: false,
        description: i18n('Allow insecure authentication (required for Safari)'),
        warning: i18n('This lowers security of the dashboard login. Use it only on trusted networks.'),
      })
    }),
  ),
  logger: Value.object(
    {
      name: i18n('Logger'),
      description: i18n('Log Settings'),
    },
    InputSpec.of({
      log_level_console: Value.number({
        name: i18n('Log Level Console'),
        description:
          i18n('Minimum log level for console messages (0=All, 1=Debug, 2=Info, 3=Warn, 4=Error, 5=Fatal) (integer, default: 2)'),
        warning: null,
        default: 2,
        required: true,
        min: 0,
        max: 5,
        step: null,
        integer: true,
        units: null,
        placeholder: null,
      }),
      log_to_file: Value.toggle({
        name: i18n('Log to File'),
        default: false,
        description: i18n('Enable logging of messages to a file'),
        warning: null,
      }),
      log_file: Value.text({
        name: i18n('Log File'),
        default: '/root/start9/logs.txt',
        required: false,
        description: i18n('Path to file to write log messages, when enabled'),
        warning: null,
        masked: false,
        placeholder: null,
        inputmode: 'text',
        patterns: [],
        minLength: null,
        maxLength: null,
      }),
      log_level_file: Value.number({
        name: i18n('File Log Level'),
        description: i18n('Minimum log level for log file messages'),
        warning: null,
        default: 1,
        required: false,
        min: 0,
        max: 5,
        step: null,
        integer: true,
        units: null,
        placeholder: null,
      }),
    }),
  ),
  datum: Value.object(
    {
      name: i18n('Datum'),
      description:
        i18n('Datum-Gateway settings. These are set to mine on OCEAN by default. Modify to switch to another Datum-supporting pool, or to solo mine.'),
    },
    InputSpec.of({
      pool_host: Value.text({
        name: i18n('Pool Host'),
        default: 'datum-beta1.mine.ocean.xyz',
        required: false,
        description:
          i18n('Remote DATUM server host/ip to use for decentralized pooled mining (string, default: datum.mine.ocean.xyz)'),
        warning: null,
        masked: false,
        placeholder: null,
        inputmode: 'text',
        patterns: [],
        minLength: null,
        maxLength: null,
      }),
      pool_port: Value.number({
        name: i18n('Pool Port'),
        description: i18n('Remote DATUM server port (integer, default: 28915)'),
        warning: null,
        default: 28915,
        required: false,
        min: 0,
        max: 65535,
        step: null,
        integer: true,
        units: null,
        placeholder: null,
      }),
      pool_pubkey: Value.text({
        name: i18n('Pool Pubkey'),
        default:
          'f21f2f0ef0aa1970468f22bad9bb7f4535146f8e4a8f646bebc93da3d89b1406f40d032f09a417d94dc068055df654937922d2c89522e3e8f6f0e649de473003',
        required: false,
        description:
          i18n('Public key of the DATUM server for initiating encrypted connection. Get from secure location, or set to empty to auto-fetch.'),
        warning: null,
        masked: false,
        placeholder: null,
        inputmode: 'text',
        patterns: [],
        minLength: null,
        maxLength: null,
      }),
      pool_pass_workers: Value.toggle({
        name: i18n('Pool Pass Workers'),
        default: true,
        description:
          i18n('Pass stratum miner usernames as sub-worker names to the pool (boolean, default: true)'),
        warning: null,
      }),
      pool_pass_full_users: Value.toggle({
        name: i18n('Pool Pass Full Users'),
        default: true,
        description:
          i18n('Pass stratum miner usernames as raw usernames to the pool (use if putting multiple payout addresses on miners behind this gateway)'),
        warning: null,
      }),
      always_pay_self: Value.toggle({
        name: i18n('Always Pay Self'),
        default: true,
        description:
          i18n('Always include my datum.pool_username payout in my blocks if possible (boolean, default: true)'),
        warning: null,
      }),
      reward_sharing: Value.select({
        name: i18n('Collaborative reward sharing (pooled mining)'),
        description:
          i18n('You can share rewards and share in others\' rewards - or only get rewarded when you find a block yourself.'),
        warning: null,
        default: 'require',
        values: {
          require: 'require',
          prefer: 'prefer',
          never: 'never',
        },
      } as const),
    }),
  ),
})
