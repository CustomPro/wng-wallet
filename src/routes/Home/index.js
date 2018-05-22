import { requireAuth } from 'routes'

export default (store) => ({
  path: '/',
  onEnter: requireAuth(store),
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Home = require('./containers/HomeContainer').default
      cb(null, Home)
    }, 'home')
  }
})
