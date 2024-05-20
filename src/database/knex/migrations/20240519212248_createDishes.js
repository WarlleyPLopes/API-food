exports.up = (knex) =>
  knex.schema.createTable("dishes", (table) => {
    table.increments("id").primary()
    table.text("title")
    table.text("image").default(null)
    table.decimal("price", 8, 2)
    table.text("category")
    table.text("description")
  })
exports.down = (knex) => knex.schema.dropTable("dishes")