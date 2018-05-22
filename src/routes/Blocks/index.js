export default (store) => ({
  path: 'blocks',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Blocks = require('./containers/BlocksContainer').default
      cb(null, Blocks)
    }, 'blocks')
  }
})
