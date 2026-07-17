import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'medication_products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('ndc', 32).notNullable()
      table.string('normalized_ndc', 16).notNullable().unique()
      table.string('proprietary_name', 255).notNullable()
      table.string('nonproprietary_name', 255).notNullable()
      table.string('dosage_form', 120).notNullable()
      table.string('route', 120).notNullable()
      table.string('labeler_name', 255).notNullable()
      table.string('product_type', 120).notNullable()
      table.string('marketing_category', 120).notNullable()
      table.string('active_ingredient', 255).notNullable()
      table.string('strength', 120).notNullable()
      table.string('source', 120).notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['proprietary_name'])
      table.index(['nonproprietary_name'])
      table.index(['active_ingredient'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
