/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

const projectId = 'dhwg1ocm'
const dataset = 'production'

export default defineCliConfig({
  api: { projectId, dataset },
  deployment: {
    appId: 't9ylkrij3rjljpu6kmwr7gml',
  },
})
