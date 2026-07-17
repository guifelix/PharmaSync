import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sites'

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
      table.string('organization_key', 120).notNullable()
      table.string('site_key', 120).notNullable()
      table.string('name', 255).notNullable()
      table
        .enu('type', ['warehouse', 'pharmacy', 'clinic', 'program-location'], {
          useNative: true,
          enumName: 'site_type',
        })
        .notNullable()
      table.string('status', 32).notNullable().defaultTo('active')
      table.string('city', 120).notNullable()
      table.string('region', 120).notNullable()
      table.string('country', 2).notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['organization_id', 'site_key'])
      table.index(['organization_key', 'site_key'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS "site_type"')
  }
}
