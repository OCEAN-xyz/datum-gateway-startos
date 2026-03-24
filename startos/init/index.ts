import { actions } from '../actions'
import { restoreInit } from '../backups'
import { setDependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { sdk } from '../sdk'
import { versionGraph } from '../versions'
import { seedFiles } from './seedFiles'
import { taskConfigPoolAddress } from './taskConfigPoolAddress'
import { taskResetPassword } from './taskResetPassword'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  setInterfaces,
  setDependencies,
  actions,
  seedFiles,
  taskResetPassword,
  taskConfigPoolAddress,
)

export const uninit = sdk.setupUninit(versionGraph)
