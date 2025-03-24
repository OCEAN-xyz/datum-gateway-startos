// // To utilize the default config system built, this file is required. It defines the *structure* of the configuration file. These structured options display as changeable UI elements within the "Config" section of the service details page in the StartOS UI.

import { compat, types as T } from "../deps.ts";

export const getConfig: T.ExpectedExports.getConfig = compat.getConfig({
  "bitcoind": {
    type: "object",
    name: "Bitcoin RPC settings",
    description: "RPC settings for bitcoind",
    spec: {
      rpcuser: {
        type: "pointer",
        name: "RPC Username",
        description: "The username for Bitcoin Core's RPC interface",
        subtype: "package",
        "package-id": "bitcoind",
        target: "config",
        multi: false,
        selector: "$.rpc.username",
      },
      rpcpassword: {
        type: "pointer",
        name: "RPC Password",
        description: "The password for Bitcoin Core's RPC interface",
        subtype: "package",
        "package-id": "bitcoind",
        target: "config",
        multi: false,
        selector: "$.rpc.password",
      },
      rpcurl: {
        type: "string",
        name: "RPC URL",
        description: "RPC URL for communication with local bitcoind. (GBT Template Source)",
        nullable: false,
        default: "http://bitcoind.embassy:8332",
      },
      work_update_seconds: {
        type: "number",
        name: "Work Update (Seconds)",
        description: "How frequently should Bitcoind send updated templates",
        nullable: true,
        range: "[5,120)",
        integral: true,
        default: 40,
        units: "seconds",
      },
      blocknotify: {
        type: "pointer",
        name: "Block Notify",
        description: "Does Bitcoind have blocknotify? This should say curl -s -m5 http://datum.embassy:7152/NOTIFY",
        subtype: "package",
        "package-id": "bitcoind",
        target: "config",
        multi: false,
        selector: "$.advanced.blocknotify",
      },
      //notify_fallback?
    },
  },
  "stratum": {
    type: "object",
    name: "Stratum Server Settings",
    description: "Configure the Datum gateway's stratum server.",
    spec: {
      listen_port: {
        type: "number",
        name: "Listen Port",
        description: "Listening port for Stratum Gateway.",
        nullable: true,
        range: "[0,65535]",
        integral: false,
        default: 23335,
      },
      max_clients_per_thread: {
        type: "number",
        name: "Maximum Clients Per Thread",
        description: "Maximum clients per Stratum server thread.",
        nullable: true,
        range: "[0,*)",
        integral: true,
        default: 1000,
      },
      max_threads: {
        type: "number",
        name: "Max Threads",
        description: "Maximum Stratum server threads (integer, default: 8)",
        nullable: true,
        range: "[0,*)",
        integral: true,
        default: 8,
      },
      max_clients: {
        type: "number",
        name: "Max Clients",
        description: "Maximum total Stratum clients before rejecting connections (integer, default: 2048)",
        nullable: true,
        range: "[0,*)",
        integral: true,
        default: 2048,
      },
      vardiff_min: {
        type: "number",
        name: "Minimum Difficulty",
        description: "Work difficulty floor (integer, default: 16384)",
        nullable: true,
        range: "[0,*)",
        integral: true,
        default: 16384,
      },
      vardiff_target_shares_min: {
        type: "number",
        name: "Target Shares per Minute",
        description: "Adjust work difficulty to target this many shares per minute (integer, default: 8)",
        nullable: true,
        range: "[0,*)",
        integral: true,
        default: 8,
      },
      vardiff_quickdiff_count: {
        type: "number",
        name: "Difficulty Update Speed",
        description: "How many shares before considering a quick diff update (integer, default: 8)",
        nullable: true,
        range: "[0,*)",
        integral: true,
        default: 8,
      },
      vardiff_quickdiff_delta: {
        type: "number",
        name: "Difficulty Delta",
        description: "How many times faster than our target does the miner have to be before we enforce a quick diff bump (integer, default: 8)",
        nullable: true,
        range: "[0,*)",
        integral: true,
        default: 8,
      },
      share_stale_seconds: {
        type: "number",
        name: "Seconds Until Shares Considered Stale",
        description: "How many seconds after a job is generated before a share submission is considered stale? (integer, default: 120)",
        nullable: true,
        range: "[0,*)",
        integral: true,
        default: 120,
      },
      fingerprint_miners: {
        type: "boolean",
        name: "Fingerprint Miners",
        description: "Attempt to fingerprint miners for better use of coinbase space (boolean, default: true)",
        default: true,
        nullable: false,
      },
      // empty_block_speedup: {
      //   type: "boolean",
      //   name: "Empty Block Speedup",
      //   description: "Get on the latest block as fast as possible by sending blank work first (highly recommended) (boolean, default: true)",
      //   default: true,
      //   nullable: false,
      // },
    },
  },
  "mining": {
    type: "object",
    name: "Mining Settings",
    description: "Mining settings",
    spec: {
      pool_address: {
        type: "string",
        name: "Bitcoin Address",
        description: "Bitcoin address used for mining on DATUM Pool, and for solo mining rewards.",
        nullable: false,
        pattern: "[0-9a-zA-Z]{20,88}",
        "pattern-description":
          "Must be a valid Bitcoin address.",
      },
      coinbase_tag_primary: {
        type: "string",
        name: "Primary Coinbase Tag",
        description: "Text to have in the primary coinbase tag when solo (overridden by DATUM Pool with the pool's name.)",
        default: "Datum User",
        nullable: true,
      },
      coinbase_tag_secondary: {
        type: "string",
        name: "Secondary Coinbase Tag",
        description: "Text to have in the secondary coinbase tag. If you're mining on a pool, this is what you label your blocks with.",
        default: "Datum Miner",
        nullable: true,
      },
      // coinbase_tag_tertiary: {
      //   type: "string",
      //   name: "Tertiary Coinbase Tag",
      //   description: "Text to have in the tertiary coinbase tag. Suggested to be a longer name/description/url/etc",
      //   default: "Datum User",
      //   nullable: true,
      // },
      coinbase_unique_id: {
        type: "number",
        name: "Coinbase Unique ID",
        description: "A unique ID between 1 and 65535. This is appended to the coinbase. Make unique per instance of datum with the same coinbase tags.",
        integral: true,
        range: "[1,65535]",
        default: 120,
        nullable: true,
      },
    },
  },
  "api": {
    type: "object",
    name: "API",
    description: "Settings for the Datum Gateway Dashboard",
    spec: {
      listen_port: {
        type: "number",
        name: "Listen Port",
        description: "Listening port for Datum Gateway Dashboard.",
        nullable: false,
        range: "[0,65535]",
        integral: true,
        default: 7152,
      },
      admin_password: {
        type: "string",
        name: "Admin Password",
        description: "Admin password for actions/changes",
        default: "",
        nullable: true,
      },
    },
  },
  // "extra_block_submissions": {
  //   type: "object",
  //   name: "Extra Block Submissions",
  //   description: "Additional places to submit solved blocks",
  //   spec: {
  //     type: "string",
  //     name: "URL",
  //     descrption: "Array of bitcoind RPC URLs to submit our blocks to directly.  Include auth info: http://user:pass@IP (string_array)",
  //     nullable: true,
  //   },
  // },
  "logger": {
    type: "object",
    name: "Logger",
    description: "Log Settings",
    spec: {
      log_level_console: {
        type: "number",
        name: "Log Level Console",
        description: "Minimum log level for console messages (0=All, 1=Debug, 2=Info, 3=Warn, 4=Error, 5=Fatal) (integer, default: 2)",
        integral: true,
        range: "[0,5)",
        default: 2,
        nullable: false,
      },
      log_to_file: {
	type: "boolean",
	name: "Log to File",
	description: "Enable logging of messages to a file",
	default: false,
	nullable: true,	
      },
      log_file: {
	type: "string",
	name: "Log File",
	description: "Path to file to write log messages, when enabled",
	default: "/root/start9/logs.txt",
	nullable: true,
      },
      log_level_file: {
	type: "number",
	name: "File Log Level",
	description: "Minimum log level for log file messages",
	integral: true,
	range: "[0,5)",
	default: 1,
	nullable: true,
      },
    },
  },
  "datum":{
    type: "object",
    name: "Datum",
    description: "Datum-Gateway settings. These are set to mine on OCEAN by default. Modify to switch to another Datum-supporting pool, or to solo mine.",
    spec: {
      pool_host: {
        type: "string",
        name: "Pool Host",
        description: "Remote DATUM server host/ip to use for decentralized pooled mining (string, default: datum.mine.ocean.xyz)",
        default: "datum-beta1.mine.ocean.xyz",
        nullable: true,
      },
      pool_port: {
        type: "number",
        name: "Pool Port",
        description: "Remote DATUM server port (integer, default: 28915)",
        range: "[0,65535]",
        default: 28915,
        integral: true,
        nullable: true,
      },
      pool_pubkey: {
        type: "string",
        name: "Pool Pubkey",
        description: "Public key of the DATUM server for initiating encrypted connection. Get from secure location, or set to empty to auto-fetch.",
        default: "f21f2f0ef0aa1970468f22bad9bb7f4535146f8e4a8f646bebc93da3d89b1406f40d032f09a417d94dc068055df654937922d2c89522e3e8f6f0e649de473003",
        nullable: true,
      },
      pool_pass_workers: {
        type: "boolean",
        name: "Pool Pass Workers",
        description: "Pass stratum miner usernames as sub-worker names to the pool (boolean, default: true)",
        default: true,
        nullable: true,
      },
      pool_pass_full_users: {
        type: "boolean",
        name: "Pool Pass Full Users",
        description: "Pass stratum miner usernames as raw usernames to the pool (use if putting multiple payout addresses on miners behind this gateway)",
        default: true,
        nullable: true,
      },
      always_pay_self: {
        type: "boolean",
        name: "Always Pay Self",
        description: "Always include my datum.pool_username payout in my blocks if possible (boolean, default: true)",
        default: true,
        nullable: true,
      },
      // pay_self_below_minimum: {
      //   type: "boolean",
      //   name: "Pay Self Below Minimum",
      //   description: "If datum.always_pay_self, include even if below the pool's minimum payout (boolean, default: false)",
      //   default: false,
      //   nullable: true,
      // },
      // allow_low_local_diff: {
      //   type: "boolean",
      //   name: "Allow Low Local Diff",
      //   description: "Do full local stratum vardiff even if below the pool's minimum difficulty for my connection. (boolean, default: false)",
      //   default: false,
      //   nullable: true,
      // },
      reward_sharing: {
        type: "enum",
        values: [
          "require",
          "prefer",
          "never",
        ],
        name: "Collaborative reward sharing (pooled mining)",
        description: "You can share rewards and share in others' rewards - or only get rewarded when you find a block yourself.",
        "value-names": {
          require: "require (pooled mining only)",
          prefer: "prefer (failover to non-pooled)",
          never: "never (non-pooled only)",
        },
        default: "require",
      },
    },
  },
});
