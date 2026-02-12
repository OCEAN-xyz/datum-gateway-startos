import { setupManifest } from '@start9labs/start-sdk'
import { short, long } from './i18n'

export const manifest = setupManifest({
  id: 'datum',
  title: 'Datum Gateway',
  license: 'mit',
  wrapperRepo: 'https://github.com/ocean-xyz/datum-gateway-startos',
  upstreamRepo: 'https://github.com/ocean-xyz/datum-gateway',
  supportSite: 'https://ocean.xyz',
  marketingSite: 'https://ocean.xyz',
  docsUrl:
    'https://github.com/OCEAN-xyz/datum-gateway-startos/blob/next/docs/instructions.md', //@TODO update me for main branch
  donationUrl: null,
  description: { short, long },
  volumes: ['main'],
  images: {
    datum: {
      source: {
        dockerBuild: {
          dockerfile: 'Dockerfile',
          workdir: '.',
        },
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    bitcoind: {
      description: 'Used to subscribe to new block events.',
      optional: true,
      metadata: {
        title: 'Bitcoin',
        icon: 'https://bitcoin.org/img/icons/opengraph.png',
      },
    },
  },
})
