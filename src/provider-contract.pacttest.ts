import path from 'path'
import { Verifier, VerifierOptions } from '@pact-foundation/pact'
import { stateHandlers } from './test-helpers/state-handlers'
import { buildVerifierOptions } from './test-helpers/pact-utils/build-verifier-options'
import { truncateTables } from '../scripts/truncate-tables'
import { requestFilter } from './test-helpers/pact-utils/pact-request-filter'

describe('Pact Verification (Local)', () => {
  const port = process.env.PORT || '3001'

  // The path to your local Pact file
  const pactFile = path.resolve(
    __dirname,
    '../pacts/WebConsumer-MoviesAPI.json'
  )
  // 👆 Adjust the name/path depending on your consumer contract location
  ///Users/andvardy/Projects/Learning/provider/pacts/WebConsumer-MoviesAPI.json

  const options: VerifierOptions = {
    providerBaseUrl: `http://localhost:${port}`,
    pactUrls: [pactFile], // 👈 use local pact files, not broker
    provider: 'MoviesAPI',
    //consumer: 'WebConsumer',
    stateHandlers,
    requestFilter,
    beforeEach: async () => {
      await truncateTables()
      return Promise.resolve()
    },
    logLevel: 'info'
  }

  const verifier = new Verifier(options)

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('should verify the consumer contract locally', async () => {
    const output = await verifier.verifyProvider()
    console.log('✅ Pact Verification Complete!')
    console.log(output)
  })
})
