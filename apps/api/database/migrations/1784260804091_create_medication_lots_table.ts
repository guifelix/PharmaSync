import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'medication_lots'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('medication_product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('medication_products')
        .onDelete('CASCADE')
      table.string('lot_number', 120).notNullable()
      table.date('expiration_date').notNullable()
      table.string('source', 120).notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['medication_product_id', 'lot_number'])
      table.index(['expiration_date'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
