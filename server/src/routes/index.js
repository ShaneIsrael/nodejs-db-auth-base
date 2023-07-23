const { authorize } = require('../middleware/authorize')

module.exports = (app) => {
  app.get('/', (req, res, next) =>
    res.status(200).json({
      message: 'Welcome to Books REST API by The JavaScript Dojo',
    }),
  )

  app.get('/protected', authorize, (req, res, next) => {
    res.status(200).json({
      message: 'Successfully accessed a protected route!',
    })
  })

  app.all('*', (req, res, next) =>
    res.status(404).json({
      message: 'Route un-available',
    }),
  )
}
