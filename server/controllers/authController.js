const bcrypt = require('bcryptjs')

const User = require('../models/User')

const generateToken = require('../utils/generateToken')

/* REGISTER */
const registerUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role,
    } = req.body

    const Setting = require('../models/Setting')
    const logAudit = require('../utils/auditLogger')

    const registrationSetting = await Setting.findOne({ key: 'registrationEnabled' })
    if (registrationSetting && registrationSetting.value === false) {
      return res.status(403).json({
        message: 'Public registration is disabled by the administrator',
      })
    }

    const userExists = await User.findOne({ email })

    if (userExists) {

      return res.status(400).json({
        message: 'User already exists',
      })

    }

    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    )

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    })

    await logAudit(
      'INFO',
      `New user registered: ${user.email} (${user.role})`,
      user.name,
      req.ip
    )

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(
        user._id,
        user.role
      ),
    })

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })

  }

}

/* LOGIN */
const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    const logAudit = require('../utils/auditLogger')

    if (
      user &&
      (await bcrypt.compare(
        password,
        user.password
      ))
    ) {

      await logAudit(
        'INFO',
        `User logged in: ${user.email}`,
        user.name,
        req.ip
      )

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(
          user._id,
          user.role
        ),
      })

    } else {

      await logAudit(
        'WARN',
        `Failed login attempt: ${email}`,
        'System',
        req.ip
      )

      res.status(401).json({
        message: 'Invalid credentials',
      })

    }

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })

  }

}

module.exports = {
  registerUser,
  loginUser,
}