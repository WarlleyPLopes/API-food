const knex = require("../database/knex")
const DiskStorage = require("../providers/DiskStorage")

class DishesImageController {
  async update(request, response) {
    const { id } = request.params
    const imageFileName = request.file.filename

    const diskStorage = new DiskStorage()

    const dish = await knex("dishes").where({ id }).first()

    if (dish.image) {
      await diskStorage.deleteFile(dish.image)
    }

    const filename = await diskStorage.saveFile(imageFileName)

    dish.image = filename

    await knex("dishes").update(dish).where({ id })

    return response.json(dish)
  }
}

module.exports = DishesImageController