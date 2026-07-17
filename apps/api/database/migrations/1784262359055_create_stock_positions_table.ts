import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stock_positions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('organization_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('organizations')
        .onDelete('CASCADE')
      table
        .integer('site_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('sites')
        .onDelete('CASCADE')
      table
        .integer('medication_product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('medication_products')
        .onDelete('CASCADE')
      table
        .integer('medication_lot_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('medication_lots')
        .onDelete('CASCADE')
      table.integer('quantity_on_hand').notNullable().defaultTo(0)
      table.integer('quantity_reserved').notNullable().defaultTo(0)
      table.integer('low_stock_threshold').notNullable().defaultTo(0)
      table.string('transfer_correlation_id', 120).nullable()
      table.timestamp('last_counted_at').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['organization_id', 'site_id', 'medication_product_id', 'medication_lot_id'])
      table.index(['organization_id', 'site_id'])
      table.index(['organization_id', 'medication_product_id'])
      table.index(['organization_id', 'medication_lot_id'])
      table.index(['last_counted_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
