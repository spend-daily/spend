import { graphqlHandler, playgroundHandler } from './handler'

it('graphiqlHandler should be a function', () => {
  expect(typeof playgroundHandler).toBe('function')
})
