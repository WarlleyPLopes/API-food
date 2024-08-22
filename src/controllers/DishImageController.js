const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const DiskStorage = require("../providers/DiskStorage")

class DishImageController {
  async update(request, response) {
    const user = request.user
    const { id } = request.params
    const imageFileName = request.file.filename

    const diskStorage = new DiskStorage()

    const dish = await knex("dishes").where({ id }).first()

    if (!dish) {
      throw new AppError("Dish nor found.", 404)
    }

    if (dish.image) {
      await diskStorage.deleteFile(dish.image)
    }

    const filename = await diskStorage.saveFile(imageFileName)

    dish.image = filename

    await knex("dishes").update(dish).where({ id })

    return response.status(201).json()
  }
}

module.exports = DishImageController