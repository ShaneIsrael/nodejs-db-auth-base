const jwt = require('jsonwebtoken')

const authorize = (req, res, next) => {
  const token = req.cookies.session

  if (!token) return res.sendStatus(403)

  try {
    const data = jwt.verify(token, process.env.SECRET_KEY)
    req.email = data.email
    return next()
  } catch (err) {
    return res.sendStatus(403)
  }
}

module.exports = {
  authorize,
}
