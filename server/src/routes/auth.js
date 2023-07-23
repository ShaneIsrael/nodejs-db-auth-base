const { register, login, logout } = require('../controllers/authController')
const { authorize } = require('../middleware/authorize')

module.exports = (app) => {
  app.post('/register', register)
  app.post('/login', login)
  app.post('/logout', authorize, logout)
}
