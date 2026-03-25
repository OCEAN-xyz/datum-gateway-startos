/**
 * Plumbing. DO NOT EDIT.
 */
export { actions } from './actions'
export { createBackup } from './backups'
export { init, uninit } from './init'
export { main } from './main'
import { buildManifest } from '@start9labs/start-sdk'
import { manifest as sdkManifest } from './manifest'
import { versionGraph } from './versions'
export const manifest = buildManifest(versionGraph, sdkManifest)
