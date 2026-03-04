import { autoconfigPoolAddress } from '../actions/config/autoconfigPoolAddress'
import { configJson } from '../fileModels/datum_gateway_config.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const taskConfigPoolAddress = sdk.setupOnInit(async (effects) => {
  if (!(await configJson.read((c) => c.mining.pool_address).const(effects))) {
    await sdk.action.createOwnTask(effects, autoconfigPoolAddress, 'critical', {
      reason: i18n('You must set a pool address'),
    })
  }
})
