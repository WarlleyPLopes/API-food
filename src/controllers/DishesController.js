const knex = require("../database/knex")
const AppError = require("../utils/AppError")

class DishesController {
  async create(request, response) {
    const { title, description, ingredients, category, price } = request.body

    const checkDishExists = await knex("dishes").where({ title }).first()

    if (checkDishExists) {
      throw new AppError("Existing dish")
    }

    const [dish_id] = await knex("dishes").insert({
      title,
      description,
      price,
      category,
    })

    const ingredientsInsert = ingredients.map((title) => {
      return {
        dish_id,
        title,
      }
    })

    await knex("ingredients").insert(ingredientsInsert)

    return response.status(201).json()
  }

  async show(request, response) {
    const { id } = request.params

    const dish = await knex("dishes").where({ id }).first()

    const ingredients = await knex("ingredients")
      .where({ dish_id: id })
      .orderBy("title")

    return response.status(201).json({
      ...dish,
      ingredients,
    })
  }

  async index(request, response) {
    const { title, ingredients } = request.query

    let dishes

    if (ingredients) {
      const filterIngredients = ingredients
        .split(",")
        .map((ingredient) => ingredient.trim())

      dishes = await knex("ingredients")
        .select([
          "dishes.id",
          "dishes.title",
          "dishes.image",
          "dishes.price",
          "dishes.category",
          "dishes.description",
        ])
        .whereLike("dishes.title", `%${title}%`)
        .whereIn("ingredients.title", filterIngredients)
        .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
        .groupBy("dishes.id")
        .orderBy("dishes.title")
    } else {
      dishes = await knex("dishes")
        .whereLike("title", `%${title}%`)
        .orderBy("title")
    }

    const setIngredients = await knex("ingredients")
    const dishesWithDishes = dishes.map((dish) => {
      const dishIngredients = setIngredients.filter(
        (ingredient) => ingredient.dish_id === dish.id
      )

      return {
        ...dish,
        dishIngredients,
      }
    })

    return response.json(dishesWithDishes)
  }

  async update(request, response) {
    const { id } = request.params
    const { title, description, ingredients, category, price } = request.body

    const dish = await knex("dishes").where({ id }).first()

    if (!dish) {
      throw new AppError("Dish nor found.")
    }

    const checkDishExists = await knex("dishes").where({ title }).first()

    if (checkDishExists && checkDishExists.id !== dish.id) {
      throw new AppError("The dish already exists")
    }

    dish.title = title ?? dish.title
    dish.description = description ?? dish.description
    dish.price = price ?? dish.price
    dish.category = category ?? dish.category

    await knex("dishes").update(dish).where({ id })

    if (ingredients) {
      const addIngredients = ingredients.map((ingredient) => {
        return {
          title: ingredient,
          dish_id: dish.id,
        }
      })

      await knex("ingredients").where({ dish_id: dish.id }).delete()
      await knex("ingredients")
        .where({ dish_id: dish.id })
        .insert(addIngredients)

      return response.status(201).json(dish)
    }
  }

  async delete(request, response) {
    const { id } = request.params

    await knex("dishes").where({ id }).delete()

    return response.status(201).json()
  }
}

module.exports = DishesController