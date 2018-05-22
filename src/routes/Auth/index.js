import { requireAuth } from 'routes'
export default (store) => ({
  childRoutes: [{
    path: 'login',
    getComponent (nextState, cb) {
      require.ensure([], (require) => {
        const Login = require('./containers/LoginContainer').default
        cb(null, Login)
      }, 'login')
    }
  }, {
    path: 'index.html',
    getComponent (nextState, cb) {
      require.ensure([], (require) => {
        const Login = require('./containers/LoginContainer').default
        cb(null, Login)
      }, 'login')
    }
  }, {
    path: '/android_asset/www/index.html',
    getComponent (nextState, cb) {
      require.ensure([], (require) => {
        const Login = require('./containers/LoginContainer').default
        cb(null, Login)
      }, 'login')
    }
  }, {
    path: 'admin',
    getComponent (nextState, cb) {
      require.ensure([], (require) => {
        const Login = require('./containers/LoginContainer').default
        cb(null, Login)
      }, 'admin')
    }
  }, {
    path: 'register',
    getComponent (nextState, cb) {
      require.ensure([], (require) => {
        const Register = require('./containers/RegisterContainer').default
        cb(null, Register)
      }, 'register')
    }
  }, {
    path: 'changepassword',
    onEnter: requireAuth(store),
    getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Password = require('./containers/PasswordContainer').default
      cb(null, Password)
    }, 'changepassword')
  }
  }]
})
