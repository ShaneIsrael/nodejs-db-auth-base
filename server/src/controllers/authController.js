const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../database/models')
const controller = {}

const COOKIE_PARAMS = {
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: true,
  secure: process.env.NODE_ENV === 'production',
}

controller.register = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!(email && password)) return res.status(400).send('email & password required')

    if (password.length < 5) return res.status(400).send('password must be at least 5 characters')

    const userExists = !!(await User.findOne({ where: { email } }))
    if (userExists) return res.status(409).send('an account with that email already exists')

    const hash = await bcrypt.hash(password, 10)

    await User.create({ email, password: hash })

    const accessToken = jwt.sign({ email }, process.env.SECRET_KEY)
    return res.cookie('session', accessToken, COOKIE_PARAMS).sendStatus(200)
  } catch (err) {
    next(err)
  }
}

controller.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!(email && password)) return res.status(400).send('email & password required')

    const user = await User.findOne({ where: { email } })

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign({ email }, process.env.SECRET_KEY)
      return res.cookie('session', accessToken, COOKIE_PARAMS).sendStatus(200)
    }

    return res.status(400).send('invalid username or password')
  } catch (err) {
    next(err)
  }
}

controller.logout = async (req, res, next) => {
  return res.clearCookie('session').status(200).json({ message: 'Successfully logged out!' })
}

module.exports = controller
