import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'worker_heartbeats'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('name', 64).primary()
      table.timestamp('last_seen_at').notNullable()
      table.jsonb('metadata').notNullable().defaultTo('{}')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
