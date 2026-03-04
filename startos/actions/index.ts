import { sdk } from '../sdk'
import { apiConfig } from './config/api'
import { autoconfigPoolAddress } from './config/autoconfigPoolAddress'
import { bitcoindConfig } from './config/bitcoind'
import { datumConfig } from './config/datum'
import { loggerConfig } from './config/logger'
import { miningConfig } from './config/mining'
import { stratumConfig } from './config/stratum'
import { resetPassword } from './resetPassword'

export const actions = sdk.Actions.of()
  .addAction(resetPassword)
  .addAction(autoconfigPoolAddress)
  .addAction(bitcoindConfig)
  .addAction(stratumConfig)
  .addAction(miningConfig)
  .addAction(apiConfig)
  .addAction(loggerConfig)
  .addAction(datumConfig)
