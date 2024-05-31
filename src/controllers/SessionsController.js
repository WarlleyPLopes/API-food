const AppError = require("../utils/AppError")
const authConfig = require("../configs/auth")
const knex = require("../database/knex")
const { sign } = require("jsonwebtoken")
const { compare } = require("bcryptjs")

class SessionsController {
  async create(request, response) {
    const { email, password } = request.body

    const user = await knex("users").where({ email }).first()

    if (!user) {
      throw new AppError("Incorrect username or password.", 401)
    }

    const checkPassword = await compare(password, user.password)

    if (!checkPassword) {
      throw new AppError("Incorrect username or password.", 401)
    }

    const { secret, expiresIn } = authConfig.jwt
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    })

    return response.json({ user, token })
  }
}

module.exports = SessionsController