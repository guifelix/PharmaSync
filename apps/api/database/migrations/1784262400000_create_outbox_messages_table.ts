import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'outbox_messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 120).primary()
      table.string('event_type', 120).notNullable()
      table.string('aggregate_type', 120).notNullable()
      table.string('aggregate_id', 120).notNullable()
      table.string('trace_id', 120).notNullable()
      table.integer('payload_version').notNullable().defaultTo(1)
      table.jsonb('payload').notNullable().defaultTo('{}')
      table.string('status', 20).notNullable().defaultTo('pending')
      table.integer('attempt_count').notNullable().defaultTo(0)
      table.timestamp('available_at').notNullable()
      table.timestamp('locked_at').nullable()
      table.string('locked_by', 120).nullable()
      table.timestamp('processed_at').nullable()
      table.text('last_error').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['status', 'available_at'])
      table.index(['locked_by'])
      table.index(['aggregate_type', 'aggregate_id'])
      table.index(['trace_id'])
      table.index(['event_type'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
