import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'organizations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('organization_key', 120).notNullable().unique()
      table.string('name', 255).notNullable()
      table
        .enu('type', ['distributor', 'facility', 'program-node'], {
          useNative: true,
          enumName: 'organization_type',
        })
        .notNullable()
      table.string('status', 32).notNullable().defaultTo('active')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS "organization_type"')
  }
}
